import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  CustomerProfile, 
  PredictionResult, 
  ModelApiStatus, 
  NavigationTab,
  ValueSegmentationSettings,
  DecisionQuadrantConfig,
  RoiAssumptions,
  RoiResults
} from '../types';

export const INITIAL_CUSTOMER_PROFILE: CustomerProfile = {
  tenureMonths: 14,
  monthlyCharges: 445000,
  age: 36,
  total_support_interactions: 0,
  hasPhoneService: 'Yes',
  hasInternetService: 'Fiber optic',
  contractType: 'Month-to-month',
  paperlessBilling: 'Yes',
  paymentMethod: 'Electronic check',
  region: 'Jakarta',
  gender: 'Female',
  partner: 'No',
  dependents: 'No',
};

const DEFAULT_QUADRANTS: Record<string, DecisionQuadrantConfig> = {
  'high-risk-high-value': {
    id: 'high-risk-high-value',
    title: 'Priority Retention',
    defaultTitle: 'Priority Retention',
    riskCategory: 'High Risk',
    valueCategory: 'High Value',
    priorityLevel: 'Immediate (P0)',
    recommendedAction: 'Deploy dedicated retention team with personalized contract discount and priority support SLA.',
    businessExplanation: 'High-value subscribers at high churn risk represent the greatest revenue vulnerability. Immediate high-touch intervention is justified by customer lifetime value.',
    tactics: [
      'Personalized retention offers',
      'Dedicated customer engagement manager',
      'Priority customer support routing',
      'Flexible contract re-negotiation & speed bump bonus'
    ]
  },
  'high-risk-low-value': {
    id: 'high-risk-low-value',
    title: 'Cost-Efficient Retention',
    defaultTitle: 'Cost-Efficient Retention',
    riskCategory: 'High Risk',
    valueCategory: 'Low Value',
    priorityLevel: 'High (P1)',
    recommendedAction: 'Automated digital retention outreach with light-touch incentives to preserve margins.',
    businessExplanation: 'Subscribers have high churn propensity but modest monthly contributions. Retention investments must remain digital and unit-cost controlled.',
    tactics: [
      'Automated retention email & SMS campaigns',
      'Targeted promotions & app-exclusive data vouchers',
      'Digital engagement & self-service troubleshooting',
      'Feedback survey to identify systemic friction'
    ]
  },
  'low-risk-high-value': {
    id: 'low-risk-high-value',
    title: 'Loyalty Program',
    defaultTitle: 'Loyalty Program',
    riskCategory: 'Low Risk',
    valueCategory: 'High Value',
    priorityLevel: 'Medium (P2)',
    recommendedAction: 'Enrol in Indosat VIP loyalty rewards and cross-sell premium ecosystem products.',
    businessExplanation: 'Stable, high-margin customers who form the revenue core of the business. Focus on delight, relationship building, and brand advocacy.',
    tactics: [
      'Indosat VIP loyalty tier and tier perks',
      'Exclusive lifestyle and telecom benefits',
      'Early access to 5G / Fiber upgrades',
      'Proactive relationship check-ins'
    ]
  },
  'low-risk-low-value': {
    id: 'low-risk-low-value',
    title: 'Standard Engagement',
    defaultTitle: 'Standard Engagement',
    riskCategory: 'Low Risk',
    valueCategory: 'Low Value',
    priorityLevel: 'Standard (P3)',
    recommendedAction: 'Maintain steady digital communications and monitor for usage milestone upgrade opportunities.',
    businessExplanation: 'Stable baseline customers with low churn risk. Maintain operational efficiency and identify organic opportunities to upsell higher bandwidth tiers.',
    tactics: [
      'Automated lifecycle & billing communications',
      'Regular customer service satisfaction checkups',
      'Targeted upsell offers upon tenure milestones',
      'Streamlined digital app payment adoption'
    ]
  }
};

interface CustomerContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;

  // Form profile
  customerProfile: CustomerProfile;
  setCustomerProfile: React.Dispatch<React.SetStateAction<CustomerProfile>>;
  updateCustomerField: <K extends keyof CustomerProfile>(field: K, value: CustomerProfile[K]) => void;
  resetCustomerProfile: () => void;

  // ML Prediction
  predictionResult: PredictionResult | null;
  predictionLoading: boolean;
  predictionError: string | null;
  predictCustomerChurn: (customProfile?: CustomerProfile) => Promise<PredictionResult | null>;

  // Model backend connection
  apiStatus: ModelApiStatus;
  checkApiStatus: () => Promise<void>;
  updateApiUrl: (newUrl: string) => Promise<{ success: boolean; message: string }>;

  // Customer Value
  valueSettings: ValueSegmentationSettings;
  updateValueSettings: (updates: Partial<ValueSegmentationSettings>) => void;
  estimatedHistoricalRevenue: number;
  customerValueSegment: 'High Value' | 'Medium Value' | 'Low Value';

  // Decision Framework
  decisionThresholds: { riskThreshold: number; valueThreshold: number };
  updateDecisionThresholds: (updates: Partial<{ riskThreshold: number; valueThreshold: number }>) => void;
  quadrantConfigs: Record<string, DecisionQuadrantConfig>;
  updateQuadrantConfig: (id: string, updates: Partial<DecisionQuadrantConfig>) => void;
  activeQuadrantId: string;

  // Scenario Simulator
  scenarioProfile: CustomerProfile;
  updateScenarioField: <K extends keyof CustomerProfile>(field: K, value: CustomerProfile[K]) => void;
  scenarioPrediction: PredictionResult | null;
  isScenarioSimulating: boolean;
  scenarioError: string | null;
  runScenarioSimulation: () => Promise<void>;
  syncScenarioWithOriginal: () => void;

  // ROI Calculator
  roiAssumptions: RoiAssumptions;
  updateRoiAssumptions: (updates: Partial<RoiAssumptions>) => void;
  roiResults: RoiResults;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<NavigationTab>('prediction');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Profile state
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>(INITIAL_CUSTOMER_PROFILE);

  // Prediction state
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  // Model Backend Status
  const [apiStatus, setApiStatus] = useState<ModelApiStatus>({
    connected: false,
    apiUrl: 'http://localhost:8001',
    statusMessage: 'Checking connection...',
    checking: true,
  });

  // Customer Value Settings
  const [valueSettings, setValueSettings] = useState<ValueSegmentationSettings>({
    highThreshold: 10000000, // Rp 10.000.000
    mediumThreshold: 4000000, // Rp 4.000.000
  });

  // Decision Framework Settings
  const [decisionThresholds, setDecisionThresholds] = useState({
    riskThreshold: 0.50,
    valueThreshold: 10000000,
  });
  const [quadrantConfigs, setQuadrantConfigs] = useState<Record<string, DecisionQuadrantConfig>>(DEFAULT_QUADRANTS);

  // Scenario state
  const [scenarioProfile, setScenarioProfile] = useState<CustomerProfile>({
    ...INITIAL_CUSTOMER_PROFILE,
    contractType: 'One year',
    total_support_interactions: 0,
  });
  const [scenarioPrediction, setScenarioPrediction] = useState<PredictionResult | null>(null);
  const [isScenarioSimulating, setIsScenarioSimulating] = useState(false);
  const [scenarioError, setScenarioError] = useState<string | null>(null);

  // ROI Assumptions
  const [roiAssumptions, setRoiAssumptions] = useState<RoiAssumptions>({
    targetedCustomers: 5000,
    retentionSuccessRate: 28, // 28%
    avgMonthlyCharges: 445000, // IDR
    retainedLifetimeMonths: 12,
    costPerCustomer: 85000, // IDR
  });

  // Check model API connection on mount
  const checkApiStatus = async () => {
    setApiStatus(prev => ({ ...prev, checking: true }));
    try {
      const res = await fetch('/api/model/status');
      if (res.ok) {
        const data = await res.json();
        setApiStatus({
          connected: data.connected,
          apiUrl: data.apiUrl,
          statusMessage: data.statusMessage,
          checking: false,
          lastChecked: new Date().toLocaleTimeString(),
          modelDetails: data.modelDetails,
        });
      } else {
        setApiStatus(prev => ({
          ...prev,
          connected: false,
          checking: false,
          statusMessage: `Status check returned HTTP ${res.status}`,
          lastChecked: new Date().toLocaleTimeString(),
        }));
      }
    } catch (err: any) {
      setApiStatus(prev => ({
        ...prev,
        connected: false,
        checking: false,
        statusMessage: err.message || 'Unable to query status API',
        lastChecked: new Date().toLocaleTimeString(),
      }));
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  const updateApiUrl = async (newUrl: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/model/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiUrl: newUrl }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setApiStatus({
          connected: data.connected,
          apiUrl: data.apiUrl,
          statusMessage: data.statusMessage,
          checking: false,
          lastChecked: new Date().toLocaleTimeString(),
        });
        return { 
          success: true, 
          message: data.connected 
            ? 'Connected successfully to Python model API!' 
            : `Updated URL, but server is currently unreachable (${data.statusMessage}).` 
        };
      }
      return { success: false, message: data.error || 'Failed to update URL' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error updating API configuration' };
    }
  };

  const updateCustomerField = <K extends keyof CustomerProfile>(field: K, value: CustomerProfile[K]) => {
    setCustomerProfile(prev => ({ ...prev, [field]: value }));
  };

  const resetCustomerProfile = () => {
    setCustomerProfile(INITIAL_CUSTOMER_PROFILE);
    setPredictionResult(null);
    setPredictionError(null);
  };

  // Predict churn using real Python backend
  const predictCustomerChurn = async (customProfile?: CustomerProfile): Promise<PredictionResult | null> => {
    const payload = customProfile || customerProfile;
    setPredictionLoading(true);
    setPredictionError(null);

    try {
      const res = await fetch('/api/model/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = data.message || data.error || 'Failed to obtain prediction from model service';
        setPredictionError(errorMsg);
        setPredictionLoading(false);
        return null;
      }

      const result: PredictionResult = {
        churn_probability: data.churn_probability,
        predicted_churn: data.predicted_churn,
        prediction_label: data.prediction_label,
        risk_level: data.risk_level,
        prediction_horizon: data.prediction_horizon || '1 Month',
        classification_threshold: data.classification_threshold || 0.50,
        timestamp: new Date().toLocaleTimeString(),
      };

      setPredictionResult(result);
      setPredictionLoading(false);
      // Mark API as connected
      setApiStatus(prev => ({ ...prev, connected: true, statusMessage: 'Online & Serving' }));
      return result;
    } catch (err: any) {
      const errorMsg = `Prediction Service Connection Error: ${err.message || 'Service unavailable'}. All actual predictions must come from the existing trained Python model.`;
      setPredictionError(errorMsg);
      setPredictionLoading(false);
      return null;
    }
  };

  // Customer Value calculations
  const estimatedHistoricalRevenue = customerProfile.monthlyCharges * customerProfile.tenureMonths;
  let customerValueSegment: 'High Value' | 'Medium Value' | 'Low Value' = 'Low Value';
  if (estimatedHistoricalRevenue >= valueSettings.highThreshold) {
    customerValueSegment = 'High Value';
  } else if (estimatedHistoricalRevenue >= valueSettings.mediumThreshold) {
    customerValueSegment = 'Medium Value';
  }

  const updateValueSettings = (updates: Partial<ValueSegmentationSettings>) => {
    setValueSettings(prev => ({ ...prev, ...updates }));
  };

  // Decision Framework
  const updateDecisionThresholds = (updates: Partial<{ riskThreshold: number; valueThreshold: number }>) => {
    setDecisionThresholds(prev => ({ ...prev, ...updates }));
  };

  const updateQuadrantConfig = (id: string, updates: Partial<DecisionQuadrantConfig>) => {
    setQuadrantConfigs(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates }
    }));
  };

  // Determine active quadrant based on current customer state
  const isHighRisk = (predictionResult?.churn_probability ?? 0.5) >= decisionThresholds.riskThreshold;
  const isHighValue = estimatedHistoricalRevenue >= decisionThresholds.valueThreshold;
  
  let activeQuadrantId = 'high-risk-high-value';
  if (isHighRisk && isHighValue) activeQuadrantId = 'high-risk-high-value';
  else if (isHighRisk && !isHighValue) activeQuadrantId = 'high-risk-low-value';
  else if (!isHighRisk && isHighValue) activeQuadrantId = 'low-risk-high-value';
  else activeQuadrantId = 'low-risk-low-value';

  // Scenario Simulator
  const updateScenarioField = <K extends keyof CustomerProfile>(field: K, value: CustomerProfile[K]) => {
    setScenarioProfile(prev => ({ ...prev, [field]: value }));
  };

  const syncScenarioWithOriginal = () => {
    setScenarioProfile({ ...customerProfile });
    setScenarioPrediction(null);
    setScenarioError(null);
  };

  const runScenarioSimulation = async () => {
    setIsScenarioSimulating(true);
    setScenarioError(null);
    try {
      const res = await fetch('/api/model/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scenarioProfile),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setScenarioError(data.message || data.error || 'Scenario simulation failed to reach model service');
        setIsScenarioSimulating(false);
        return;
      }

      setScenarioPrediction({
        churn_probability: data.churn_probability,
        predicted_churn: data.predicted_churn,
        prediction_label: data.prediction_label,
        risk_level: data.risk_level,
        prediction_horizon: data.prediction_horizon || '1 Month',
        classification_threshold: data.classification_threshold || 0.50,
        timestamp: new Date().toLocaleTimeString(),
        isScenario: true,
      });
      setIsScenarioSimulating(false);
    } catch (err: any) {
      setScenarioError(`Simulation Connection Error: ${err.message || 'Service unreachable'}`);
      setIsScenarioSimulating(false);
    }
  };

  // ROI Calculator Calculations
  const updateRoiAssumptions = (updates: Partial<RoiAssumptions>) => {
    setRoiAssumptions(prev => ({ ...prev, ...updates }));
  };

  const successRateFraction = Math.max(0, Math.min(100, roiAssumptions.retentionSuccessRate)) / 100;
  const estimatedRevenueRetained = 
    roiAssumptions.targetedCustomers * 
    successRateFraction * 
    roiAssumptions.avgMonthlyCharges * 
    roiAssumptions.retainedLifetimeMonths;

  const totalCampaignCost = roiAssumptions.targetedCustomers * roiAssumptions.costPerCustomer;
  const netBenefit = estimatedRevenueRetained - totalCampaignCost;
  const roiPercentage = totalCampaignCost > 0 ? (netBenefit / totalCampaignCost) * 100 : 0;

  const roiResults: RoiResults = {
    estimatedRevenueRetained,
    totalCampaignCost,
    netBenefit,
    roiPercentage,
  };

  return (
    <CustomerContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        customerProfile,
        setCustomerProfile,
        updateCustomerField,
        resetCustomerProfile,
        predictionResult,
        predictionLoading,
        predictionError,
        predictCustomerChurn,
        apiStatus,
        checkApiStatus,
        updateApiUrl,
        valueSettings,
        updateValueSettings,
        estimatedHistoricalRevenue,
        customerValueSegment,
        decisionThresholds,
        updateDecisionThresholds,
        quadrantConfigs,
        updateQuadrantConfig,
        activeQuadrantId,
        scenarioProfile,
        updateScenarioField,
        scenarioPrediction,
        isScenarioSimulating,
        scenarioError,
        runScenarioSimulation,
        syncScenarioWithOriginal,
        roiAssumptions,
        updateRoiAssumptions,
        roiResults,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
}
