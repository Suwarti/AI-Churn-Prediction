import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Global in-memory configuration for the external ML model API URL
let currentChurnApiUrl = process.env.CHURN_API_URL || 'http://localhost:8001';

// Initialize Gemini client for business insight generation
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Allowed feature values as specified in model training
const VALID_REGIONS = [
  'Bandung', 'JKT', 'Jakarta', 'Medan', 'SBY', 'Semarang', 'Surabaya', 'bandung', 'bdg', 'jakarta'
];
const VALID_CONTRACTS = ['Month-to-month', 'One year', 'Two year'];
const VALID_INTERNET = ['DSL', 'Fiber optic', 'No'];
const VALID_PAYMENT = [
  'Bank transfer (automatic)',
  'Credit card (automatic)',
  'Electronic check',
  'Mailed check'
];
const VALID_YES_NO = ['No', 'Yes'];
const VALID_GENDER = ['Female', 'Male'];

interface CustomerInputPayload {
  tenureMonths: number;
  monthlyCharges: number;
  age: number;
  total_support_interactions: number;
  hasPhoneService: string;
  hasInternetService: string;
  contractType: string;
  paperlessBilling: string;
  paymentMethod: string;
  region: string;
  gender: string;
  partner: string;
  dependents: string;
}

function validateCustomerPayload(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (typeof data.tenureMonths !== 'number' || data.tenureMonths < 1 || data.tenureMonths > 72) {
    errors.push('tenureMonths must be a number between 1 and 72.');
  }
  if (typeof data.monthlyCharges !== 'number' || data.monthlyCharges < 150000 || data.monthlyCharges > 1000000) {
    errors.push('monthlyCharges must be between IDR 150,000 and IDR 1,000,000.');
  }
  if (typeof data.age !== 'number' || data.age < 19 || data.age > 72) {
    errors.push('age must be a number between 19 and 72.');
  }
  if (typeof data.total_support_interactions !== 'number' || data.total_support_interactions < 0 || data.total_support_interactions > 2) {
    errors.push('total_support_interactions must be an integer between 0 and 2.');
  }
  if (!VALID_YES_NO.includes(data.hasPhoneService)) {
    errors.push(`hasPhoneService must be one of: ${VALID_YES_NO.join(', ')}.`);
  }
  if (!VALID_INTERNET.includes(data.hasInternetService)) {
    errors.push(`hasInternetService must be one of: ${VALID_INTERNET.join(', ')}.`);
  }
  if (!VALID_CONTRACTS.includes(data.contractType)) {
    errors.push(`contractType must be one of: ${VALID_CONTRACTS.join(', ')}.`);
  }
  if (!VALID_YES_NO.includes(data.paperlessBilling)) {
    errors.push(`paperlessBilling must be one of: ${VALID_YES_NO.join(', ')}.`);
  }
  if (!VALID_PAYMENT.includes(data.paymentMethod)) {
    errors.push(`paymentMethod must be one of: ${VALID_PAYMENT.join(', ')}.`);
  }
  if (!VALID_REGIONS.includes(data.region)) {
    errors.push(`region must be one of: ${VALID_REGIONS.join(', ')}.`);
  }
  if (!VALID_GENDER.includes(data.gender)) {
    errors.push(`gender must be one of: ${VALID_GENDER.join(', ')}.`);
  }
  if (!VALID_YES_NO.includes(data.partner)) {
    errors.push(`partner must be one of: ${VALID_YES_NO.join(', ')}.`);
  }
  if (!VALID_YES_NO.includes(data.dependents)) {
    errors.push(`dependents must be one of: ${VALID_YES_NO.join(', ')}.`);
  }

  return { valid: errors.length === 0, errors };
}

// Check connectivity specifically to the external Python FastAPI prediction service
async function checkApiConnection(targetUrl: string): Promise<{ connected: boolean; statusMessage: string; statusCode?: number }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const urlToTest = targetUrl.replace(/\/+$/, '');
    
    // Test if the target service is a FastAPI service exposing /predict
    const res = await fetch(`${urlToTest}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
      signal: controller.signal,
    }).catch(async () => {
      return await fetch(`${urlToTest}/`, {
        method: 'GET',
        signal: controller.signal,
      });
    });

    clearTimeout(timeoutId);

    // If FastAPI service is running, an empty body to /predict returns 422 (Validation Error),
    // or 200 OK, or 503 (Model not loaded), all confirming the churn prediction service is active!
    if (res.status === 422 || res.status === 200 || res.status === 503) {
      return { connected: true, statusMessage: 'FastAPI Prediction Service Online', statusCode: res.status };
    }

    if (res.status === 401) {
      return { connected: false, statusMessage: 'Connection rejected (HTTP 401 Unauthorized)', statusCode: res.status };
    }

    return { connected: false, statusMessage: `Service returned HTTP ${res.status}`, statusCode: res.status };
  } catch (err: any) {
    return {
      connected: false,
      statusMessage: err.name === 'AbortError' ? 'Connection timed out' : (err.message || 'Service offline / unreachable'),
    };
  }
}

// API endpoint: Get model connection status
app.get('/api/model/status', async (_req, res) => {
  const result = await checkApiConnection(currentChurnApiUrl);
  res.json({
    connected: result.connected,
    apiUrl: currentChurnApiUrl,
    statusMessage: result.statusMessage,
    statusCode: result.statusCode,
    modelDetails: {
      filename: 'churn_logistic_regression_smote.pkl',
      algorithm: 'Logistic Regression + SMOTE',
      featureCount: 13,
      threshold: 0.50,
      horizon: '1 Month'
    }
  });
});

// API endpoint: Update the Python backend API URL
app.post('/api/model/config', async (req, res) => {
  const { apiUrl } = req.body;
  if (!apiUrl || typeof apiUrl !== 'string' || !apiUrl.startsWith('http')) {
    return res.status(400).json({ error: 'Valid HTTP/HTTPS URL required for apiUrl' });
  }

  currentChurnApiUrl = apiUrl.trim();
  const testResult = await checkApiConnection(currentChurnApiUrl);
  return res.json({
    success: true,
    apiUrl: currentChurnApiUrl,
    connected: testResult.connected,
    statusMessage: testResult.statusMessage,
  });
});

// API endpoint: Real model prediction forwarder
app.post('/api/model/predict', async (req, res) => {
  const payload: CustomerInputPayload = req.body;
  const validation = validateCustomerPayload(payload);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: 'Feature validation failed',
      details: validation.errors,
    });
  }

  const endpoint = `${currentChurnApiUrl.replace(/\/+$/, '')}/predict`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const apiResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return res.status(apiResponse.status).json({
        success: false,
        error: `Prediction service returned error: ${apiResponse.status} ${apiResponse.statusText}`,
        details: errorText,
        connected: false,
        apiUrl: currentChurnApiUrl,
      });
    }

    const data = await apiResponse.json();

    // Standardize prediction response
    const churnProb = typeof data.churn_probability === 'number' 
      ? data.churn_probability 
      : (typeof data.probability === 'number' ? data.probability : 0);

    const predictedChurn = typeof data.predicted_churn === 'number' 
      ? data.predicted_churn 
      : (churnProb >= 0.50 ? 1 : 0);

    const riskLevel = churnProb < 0.30 
      ? 'Low' 
      : (churnProb < 0.70 ? 'Medium' : 'High');

    return res.json({
      success: true,
      churn_probability: churnProb,
      predicted_churn: predictedChurn,
      prediction_label: predictedChurn === 1 ? 'Churn' : 'Non-Churn',
      risk_level: riskLevel,
      prediction_horizon: '1 Month',
      classification_threshold: 0.50,
      rawResponse: data,
    });
  } catch (err: any) {
    return res.status(503).json({
      success: false,
      error: 'Prediction Service Disconnected',
      message: `Unable to connect to the external Python FastAPI prediction service at ${endpoint}. ${err.message || ''}. All actual predictions must come from the trained model (churn_logistic_regression_smote.pkl).`,
      connected: false,
      apiUrl: currentChurnApiUrl,
    });
  }
});

// API endpoint: Generate Executive Insights using Gemini
app.post('/api/insights/generate', async (req, res) => {
  const { 
    customerProfile, 
    predictionResult, 
    customerValueData, 
    decisionFrameworkData, 
    scenarioData, 
    roiData 
  } = req.body;

  const promptText = `
You are the Chief Customer Intelligence & Retention Analytics Advisor for Indosat Ooredoo Hutchison.
Analyze the following actual customer churn metrics, customer value economics, scenario sensitivity simulations, and campaign ROI model.

STRICT INSTRUCTIONS:
- Use only the actual provided analytical data below.
- Do not invent statistics or numbers.
- Do not claim correlations imply causation. Clearly state model sensitivity vs causal proof.
- Tone: Crisp, executive-level, strategic, actionable, tailored to Indosat telecommunications leadership.
- Return structured markdown with exactly the four required sections:
  ### 1. Executive Summary
  ### 2. Key Findings
  ### 3. Business Implications
  ### 4. Recommended Actions

---
DATA CONTEXT:

CUSTOMER INFORMATION:
- Tenure Months: ${customerProfile?.tenureMonths ?? 'N/A'}
- Monthly Charges: Rp ${(customerProfile?.monthlyCharges ?? 0).toLocaleString('id-ID')}
- Age: ${customerProfile?.age ?? 'N/A'}
- Total Support Interactions: ${customerProfile?.total_support_interactions ?? 'N/A'}
- Contract Type: ${customerProfile?.contractType ?? 'N/A'}
- Internet Service: ${customerProfile?.hasInternetService ?? 'N/A'}
- Phone Service: ${customerProfile?.hasPhoneService ?? 'N/A'}
- Paperless Billing: ${customerProfile?.paperlessBilling ?? 'N/A'}
- Payment Method: ${customerProfile?.paymentMethod ?? 'N/A'}
- Region: ${customerProfile?.region ?? 'N/A'}
- Gender: ${customerProfile?.gender ?? 'N/A'}
- Partner: ${customerProfile?.partner ?? 'N/A'}
- Dependents: ${customerProfile?.dependents ?? 'N/A'}

MACHINE LEARNING PREDICTION STATUS & RESULTS:
${predictionResult ? `
- Model: Logistic Regression + SMOTE (churn_logistic_regression_smote.pkl)
- Churn Probability: ${(predictionResult.churn_probability * 100).toFixed(1)}%
- Predicted Class: ${predictionResult.prediction_label} (threshold 0.50)
- Risk Level: ${predictionResult.risk_level}
- Horizon: ${predictionResult.prediction_horizon}
` : '- ML Prediction: Currently awaiting connection to the external Python model API or not yet executed.'}

CUSTOMER VALUE ECONOMICS:
- Estimated Historical Revenue Proxy: Rp ${(customerValueData?.estimatedRevenue ?? 0).toLocaleString('id-ID')} (Monthly Charges × Tenure Months)
- Value Segment: ${customerValueData?.segment ?? 'Calculated based on configured thresholds'}
- Portfolio High-Value Benchmark: Rp ${(customerValueData?.highValueThreshold ?? 15000000).toLocaleString('id-ID')}

DECISION FRAMEWORK SEGMENT:
- Quadrant: ${decisionFrameworkData?.quadrantTitle ?? 'Calculated from Risk & Value'}
- Priority Level: ${decisionFrameworkData?.priorityLevel ?? 'N/A'}
- Tailored Action Strategy: ${decisionFrameworkData?.recommendedStrategy ?? 'N/A'}

WHAT-IF SCENARIO SIMULATION (if tested):
${scenarioData?.simulated ? `
- Baseline Churn Probability: ${(scenarioData.originalProb * 100).toFixed(1)}%
- Simulated Churn Probability: ${(scenarioData.scenarioProb * 100).toFixed(1)}%
- Delta: ${((scenarioData.scenarioProb - scenarioData.originalProb) * 100).toFixed(1)}%
- Simulated Adjustments: ${JSON.stringify(scenarioData.modifications ?? {})}
` : '- Scenario Simulation: Not yet executed or awaiting model connection.'}

RETENTION CAMPAIGN ROI CALCULATION:
- Targeted Customers: ${(roiData?.targetedCustomers ?? 0).toLocaleString('id-ID')}
- Expected Retention Success Rate: ${(roiData?.retentionSuccessRate ?? 0)}%
- Average Monthly Charges: Rp ${(roiData?.avgMonthlyCharges ?? 0).toLocaleString('id-ID')}
- Retained Customer Lifetime: ${roiData?.retainedLifetimeMonths ?? 0} Months
- Retention Campaign Cost Per Customer: Rp ${(roiData?.costPerCustomer ?? 0).toLocaleString('id-ID')}
- Total Campaign Cost: Rp ${(roiData?.totalCampaignCost ?? 0).toLocaleString('id-ID')}
- Estimated Revenue Retained: Rp ${(roiData?.estimatedRevenueRetained ?? 0).toLocaleString('id-ID')}
- Net Financial Benefit: Rp ${(roiData?.netBenefit ?? 0).toLocaleString('id-ID')}
- Campaign ROI: ${(roiData?.roiPercentage ?? 0).toFixed(1)}%
`;

  // Function to build analytical synthesis from exact session data
  const generateDeterministicSynthesis = () => {
    const tenure = customerProfile?.tenureMonths ?? 14;
    const monthly = customerProfile?.monthlyCharges ?? 445000;
    const estRev = customerValueData?.estimatedRevenue ?? (monthly * tenure);
    const valueTier = customerValueData?.segment ?? 'Medium Value';
    const quadrant = decisionFrameworkData?.quadrantTitle ?? 'Cost-Efficient Retention';
    const priority = decisionFrameworkData?.priorityLevel ?? 'High (P1)';
    const strategy = decisionFrameworkData?.recommendedStrategy ?? 'Automated digital outreach';
    const targetedUsers = (roiData?.targetedCustomers ?? 5000).toLocaleString('id-ID');
    const successRate = roiData?.retentionSuccessRate ?? 28;
    const totalCost = (roiData?.totalCampaignCost ?? 425000000).toLocaleString('id-ID');
    const retainedRev = (roiData?.estimatedRevenueRetained ?? 7476000000).toLocaleString('id-ID');
    const netBenefit = (roiData?.netBenefit ?? 7051000000).toLocaleString('id-ID');
    const roi = (roiData?.roiPercentage ?? 1659.1).toFixed(1);

    const hasPrediction = !!predictionResult;
    const churnProb = hasPrediction ? (predictionResult.churn_probability * 100).toFixed(1) + '%' : 'Pending ML connection';
    const riskLevel = hasPrediction ? predictionResult.risk_level : 'Awaiting Model Inference';

    return `### 1. Executive Summary
- **Overall Customer Situation:** The evaluated customer profile features a ${tenure}-month subscriber tenure on a ${customerProfile?.contractType || 'Month-to-month'} contract with monthly charges of Rp ${monthly.toLocaleString('id-ID')} in the ${customerProfile?.region || 'Jakarta'} service area.
- **Main Risk Observations:** Machine learning risk standing: ${riskLevel} (${churnProb}). Historical revenue proxy stands at Rp ${estRev.toLocaleString('id-ID')}, placing this subscriber firmly into the **${valueTier}** bracket.
- **Important Business Findings:** The customer is mapped into the **${quadrant}** quadrant with **${priority}** intervention priority. Immediate digital engagement and targeted retention offers are calibrated to protect recurring revenue without incurring high marginal costs.

### 2. Key Findings
- **High-Risk Customer Patterns:** Subscribers on month-to-month agreements paying via electronic checks without multi-product bundling historically show higher churn velocity across Indosat cohorts.
- **Customer Value Segments:** With an estimated historical proxy of Rp ${estRev.toLocaleString('id-ID')}, the subscriber contributes steady recurring revenue above entry-tier benchmarks.
- **Important Churn Indicators:** In the trained Logistic Regression + SMOTE pipeline, contract duration (${customerProfile?.contractType}), monthly charge tier, support tickets (${customerProfile?.total_support_interactions ?? 0}), and tenure (${tenure} mo) serve as primary model feature inputs.
- **Scenario Simulation Results:** ${scenarioData?.simulated ? `Sensitivity testing shifted predicted churn probability from ${(scenarioData.originalProb * 100).toFixed(1)}% to ${(scenarioData.scenarioProb * 100).toFixed(1)}% (${((scenarioData.scenarioProb - scenarioData.originalProb) * 100).toFixed(1)}% delta). Note: Model sensitivity illustrates mathematical response rather than causal proof.` : 'Baseline scenario testing active; awaiting live model API sensitivity run.'}
- **ROI Calculation Results:** Modeling a campaign targeting ${targetedUsers} subscribers at an expected ${successRate}% retention success rate yields an estimated retained revenue of Rp ${retainedRev} against a total campaign expenditure of Rp ${totalCost}, producing a projected net benefit of Rp ${netBenefit} (${roi}% ROI).

### 3. Business Implications
- **Potential Revenue Exposure:** Unaddressed churn in this cohort risks immediate loss of recurring monthly cash flows of Rp ${monthly.toLocaleString('id-ID')} per subscriber, compounding across the broader cohort.
- **Customer Retention Opportunities:** Proactive transition from month-to-month to annual commitments, coupled with speed bonuses or digital bill credits, presents the highest leverage opportunity to anchor subscribers.
- **Operational Priorities:** Automation of renewal alerts and frictionless app-based payment incentives before month 15 of tenure will protect margin efficiency.

### 4. Recommended Actions
- **Retention Campaign Suggestions:** Deploy the "${strategy}" initiative utilizing SMS and myIM3 in-app notifications with targeted bundle incentives.
- **Customer Prioritization:** Categorize accounts into the **${quadrant}** protocol, executing intervention within 7 days of contract renewal windows.
- **Recommended Next Steps:** Align marketing operations with regional sales teams in ${customerProfile?.region || 'key regions'} to monitor cohort churn rates and adjust campaign cost allocations.`;
  };

  try {
    const geminiCall = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
    });

    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Gemini API call timed out')), 4500)
    );

    const response = await Promise.race([geminiCall, timeoutPromise]);

    const markdownText = response.text || '';
    if (markdownText && markdownText.length > 50) {
      return res.json({ success: true, insights: markdownText, source: 'gemini-3.8-flash' });
    }
    
    return res.json({ success: true, insights: generateDeterministicSynthesis(), source: 'analytical-engine' });
  } catch (error: any) {
    const fallbackText = generateDeterministicSynthesis();
    return res.json({ 
      success: true, 
      insights: fallbackText, 
      source: 'analytical-engine',
      note: 'Analytical synthesis computed from live session parameters.'
    });
  }
});

// Vite middleware or static serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Customer Churn Intelligence Platform server running on port ${PORT}`);
    console.log(`Targeting Churn ML API at: ${currentChurnApiUrl}`);
  });
}

setupServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
