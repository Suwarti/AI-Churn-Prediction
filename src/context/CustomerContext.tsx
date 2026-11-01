import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  CustomerProfile, 
  PredictionResult, 
  NavigationTab,
  ValueSegmentationSettings,
  DecisionQuadrantConfig,
  RoiAssumptions,
  RoiResults,
  ModuleCompletionState,
  PrerequisiteInfo
} from '../types';

export const INITIAL_CUSTOMER_PROFILE: CustomerProfile = {
  tenureMonths: '',
  monthlyCharges: '',
  age: '',
  total_support_interactions: '',
  hasPhoneService: '',
  hasInternetService: '',
  contractType: '',
  paperlessBilling: '',
  paymentMethod: '',
  region: '',
  gender: '',
  partner: '',
  dependents: '',
};

const DEFAULT_QUADRANTS: Record<string, DecisionQuadrantConfig> = {
  'high-risk-high-value': {
    id: 'high-risk-high-value',
    title: 'Priority Retention',
    defaultTitle: 'Priority Retention',
    riskCategory: 'High Risk',
    valueCategory: 'High Value',
    priorityLevel: 'Immediate (P0)',
    recommendedAction: 'Deploy high-touch retention specialist with personalized contract renewal incentive and priority SLA.',
    businessExplanation: 'High-value subscribers at high churn risk represent critical revenue exposure. High-touch intervention is economically justified by customer lifetime value.',
    tactics: [
      'Personalized retention discount on 12-month renewal',
      'Dedicated customer success account manager',
      'Priority customer care routing',
      'Free bandwidth speed-boost bonus'
    ]
  },
  'high-risk-low-value': {
    id: 'high-risk-low-value',
    title: 'Cost-Efficient Retention',
    defaultTitle: 'Cost-Efficient Retention',
    riskCategory: 'High Risk',
    valueCategory: 'Low Value',
    priorityLevel: 'High (P1)',
    recommendedAction: 'Automated digital retention outreach with low marginal-cost incentives to preserve operational margins.',
    businessExplanation: 'Subscribers have elevated churn probability but modest monthly billing. Retention investments must remain automated and unit-cost controlled.',
    tactics: [
      'Automated in-app push and SMS renewal alerts',
      'App-exclusive data voucher incentives',
      'Self-service digital troubleshooting assistance',
      'Digital feedback survey to diagnose friction points'
    ]
  },
  'low-risk-high-value': {
    id: 'low-risk-high-value',
    title: 'Loyalty Enhancement',
    defaultTitle: 'Loyalty Enhancement',
    riskCategory: 'Low Risk',
    valueCategory: 'High Value',
    priorityLevel: 'Medium (P2)',
    recommendedAction: 'Enroll in VIP loyalty tier, proactive relationship check-ins, and exclusive ecosystem perks.',
    businessExplanation: 'Stable, high-contribution customers who form the revenue core of the business. Focus on relationship building, delight, and cross-selling.',
    tactics: [
      'Telecommunications VIP loyalty tier benefits',
      'Exclusive device upgrade subsidies',
      'Early access to 5G and premium streaming bundles',
      'Annual account review with customer manager'
    ]
  },
  'low-risk-low-value': {
    id: 'low-risk-low-value',
    title: 'Standard Engagement',
    defaultTitle: 'Standard Engagement',
    riskCategory: 'Low Risk',
    valueCategory: 'Low Value',
    priorityLevel: 'Standard (P3)',
    recommendedAction: 'Maintain steady digital communication and identify organic upsell milestones.',
    businessExplanation: 'Stable baseline accounts with low churn risk. Maintain automated operational efficiency and trigger organic bandwidth tier upgrade prompts.',
    tactics: [
      'Automated billing and usage threshold updates',
      'Regular CSAT feedback monitoring',
      'Milestone upgrade promotions (e.g. at 12 & 24 months)',
      'Encouragement of auto-debit adoption'
    ]
  }
};

interface CustomerContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;

  // Prerequisite & Unlocking Logic
  completedModules: ModuleCompletionState;
  isTabUnlocked: (tab: NavigationTab) => boolean;
  getTabPrerequisite: (tab: NavigationTab) => PrerequisiteInfo | null;
  attemptNavigateToTab: (tab: NavigationTab) => boolean;
  completeModule: (tab: NavigationTab, proceedToNext?: boolean) => void;
  prerequisiteModal: PrerequisiteInfo | null;
  closePrerequisiteModal: () => void;

  // Form profile
  customerProfile: CustomerProfile;
  setCustomerProfile: React.Dispatch<React.SetStateAction<CustomerProfile>>;
  updateCustomerField: <K extends keyof CustomerProfile>(field: K, value: CustomerProfile[K]) => void;
  resetCustomerProfile: () => void;

  // AI Churn Prediction
  predictionResult: PredictionResult | null;
  predictionLoading: boolean;
  predictionError: string | null;
  predictCustomerChurn: (customProfile?: CustomerProfile) => Promise<PredictionResult | null>;

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

  // Module completion state tracking
  const [completedModules, setCompletedModules] = useState<ModuleCompletionState>({
    prediction: false,
    'customer-value': false,
    'decision-framework': false,
    'scenario-view': false,
    'roi-calculation': false,
    'generate-insight': false,
  });

  const [prerequisiteModal, setPrerequisiteModal] = useState<PrerequisiteInfo | null>(null);

  // Profile state
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>(INITIAL_CUSTOMER_PROFILE);

  // Prediction state
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);

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
    monthlyCharges: 380000,
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

  // Prerequisite Unlocking Logic
  const isTabUnlocked = (tab: NavigationTab): boolean => {
    switch (tab) {
      case 'prediction':
        return true; // 1. Always unlocked
      case 'customer-value':
        // 2. At least one successful churn prediction
        return !!predictionResult;
      case 'decision-framework':
        // 3. Customer Value analysis completed
        return !!predictionResult && completedModules['customer-value'];
      case 'scenario-view':
        // 4. Decision Framework analysis completed
        return (
          !!predictionResult && 
          completedModules['customer-value'] && 
          completedModules['decision-framework']
        );
      case 'roi-calculation':
        // 5. At least one scenario analysis completed
        return (
          isTabUnlocked('scenario-view') && 
          (!!scenarioPrediction || completedModules['scenario-view'])
        );
      case 'generate-insight':
        // 6. ROI Calculation completed
        return (
          isTabUnlocked('roi-calculation') && 
          completedModules['roi-calculation']
        );
      default:
        return false;
    }
  };

  const getTabPrerequisite = (tab: NavigationTab): PrerequisiteInfo | null => {
    if (isTabUnlocked(tab)) return null;

    switch (tab) {
      case 'customer-value':
        return {
          targetTab: 'customer-value',
          targetTitle: 'Customer Value',
          requiredTab: 'prediction',
          requiredTitle: 'Churn Prediction',
          reason: 'Customer Value analysis requires at least one successful customer churn prediction.',
        };
      case 'decision-framework':
        if (!predictionResult) {
          return {
            targetTab: 'decision-framework',
            targetTitle: 'Decision Framework',
            requiredTab: 'prediction',
            requiredTitle: 'Churn Prediction',
            reason: 'Decision Framework requires completing a Churn Prediction first.',
          };
        }
        return {
          targetTab: 'decision-framework',
          targetTitle: 'Decision Framework',
          requiredTab: 'customer-value',
          requiredTitle: 'Customer Value',
          reason: 'Decision Framework requires completing the Customer Value analysis first.',
        };
      case 'scenario-view':
        if (!completedModules['decision-framework']) {
          return {
            targetTab: 'scenario-view',
            targetTitle: 'Scenario View',
            requiredTab: 'decision-framework',
            requiredTitle: 'Decision Framework',
            reason: 'Scenario View simulator requires completing the Decision Framework analysis first.',
          };
        }
        break;
      case 'roi-calculation':
        if (!scenarioPrediction && !completedModules['scenario-view']) {
          return {
            targetTab: 'roi-calculation',
            targetTitle: 'ROI Calculation',
            requiredTab: 'scenario-view',
            requiredTitle: 'Scenario View',
            reason: 'ROI Calculation requires at least one completed scenario analysis simulation.',
          };
        }
        break;
      case 'generate-insight':
        if (!completedModules['roi-calculation']) {
          return {
            targetTab: 'generate-insight',
            targetTitle: 'Generate Insight',
            requiredTab: 'roi-calculation',
            requiredTitle: 'ROI Calculation',
            reason: 'AI Executive Insight generation requires completing the ROI Calculation model first.',
          };
        }
        break;
    }
    return null;
  };

  const attemptNavigateToTab = (tab: NavigationTab): boolean => {
    if (isTabUnlocked(tab)) {
      setActiveTab(tab);
      return true;
    }

    const prereq = getTabPrerequisite(tab);
    if (prereq) {
      setPrerequisiteModal(prereq);
    }
    return false;
  };

  const closePrerequisiteModal = () => {
    setPrerequisiteModal(null);
  };

  const completeModule = (tab: NavigationTab, proceedToNext: boolean = true) => {
    setCompletedModules(prev => ({ ...prev, [tab]: true }));

    if (proceedToNext) {
      const order: NavigationTab[] = [
        'prediction',
        'customer-value',
        'decision-framework',
        'scenario-view',
        'roi-calculation',
        'generate-insight',
      ];
      const currentIndex = order.indexOf(tab);
      if (currentIndex >= 0 && currentIndex < order.length - 1) {
        const nextTab = order[currentIndex + 1];
        setActiveTab(nextTab);
      }
    }
  };

  const updateCustomerField = <K extends keyof CustomerProfile>(field: K, value: CustomerProfile[K]) => {
    setCustomerProfile(prev => ({ ...prev, [field]: value }));
    // Invalidate downstream dependent results if key input changes
    if (predictionResult) {
      setPredictionResult(null);
      setCompletedModules(prev => ({
        ...prev,
        prediction: false,
        'customer-value': false,
        'decision-framework': false,
        'scenario-view': false,
        'roi-calculation': false,
        'generate-insight': false,
      }));
    }
  };

  const resetCustomerProfile = () => {
    setCustomerProfile(INITIAL_CUSTOMER_PROFILE);
    setPredictionResult(null);
    setPredictionError(null);
    setScenarioPrediction(null);
    setCompletedModules({
      prediction: false,
      'customer-value': false,
      'decision-framework': false,
      'scenario-view': false,
      'roi-calculation': false,
      'generate-insight': false,
    });
    setActiveTab('prediction');
  };

  // Predict churn dynamically using Gemini AI engine
  const predictCustomerChurn = async (customProfile?: CustomerProfile): Promise<PredictionResult | null> => {
    const rawProfile = customProfile || customerProfile;
    // Strip any possible formatting or string types into pure numbers
    const payload = {
      ...rawProfile,
      tenureMonths: Number(rawProfile.tenureMonths) || 0,
      monthlyCharges: Number(rawProfile.monthlyCharges) || 0,
      age: Number(rawProfile.age) || 0,
      total_support_interactions: Number(rawProfile.total_support_interactions) || 0,
    };
    setPredictionLoading(true);
    setPredictionError(null);

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = data.error || 'Failed to obtain AI churn prediction';
        setPredictionError(errorMsg);
        setPredictionLoading(false);
        return null;
      }

      const result: PredictionResult = {
        churn_probability: data.churn_probability,
        predicted_churn: data.predicted_churn,
        prediction_label: data.prediction_label,
        risk_level: data.risk_level,
        key_risk_factors: data.key_risk_factors || [],
        retention_recommendations: data.retention_recommendations || [],
        prediction_explanation: data.prediction_explanation || '',
        timestamp: new Date().toLocaleTimeString(),
      };

      setPredictionResult(result);
      setScenarioProfile({ ...rawProfile });
      setPredictionLoading(false);

      // Automatically mark Step 1 as completed and unlock Customer Value!
      setCompletedModules(prev => ({ ...prev, prediction: true }));
      return result;
    } catch (err: any) {
      const errorMsg = `AI Prediction Error: ${err.message || 'Service unavailable'}.`;
      setPredictionError(errorMsg);
      setPredictionLoading(false);
      return null;
    }
  };

  // Customer Value calculations
  const estimatedHistoricalRevenue = (Number(customerProfile.monthlyCharges) || 0) * (Number(customerProfile.tenureMonths) || 0);
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
    const payload = {
      ...scenarioProfile,
      tenureMonths: Number(scenarioProfile.tenureMonths) || 0,
      monthlyCharges: Number(scenarioProfile.monthlyCharges) || 0,
      age: Number(scenarioProfile.age) || 0,
      total_support_interactions: Number(scenarioProfile.total_support_interactions) || 0,
    };

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setScenarioError(data.error || 'Scenario simulation failed');
        setIsScenarioSimulating(false);
        return;
      }

      const result: PredictionResult = {
        churn_probability: data.churn_probability,
        predicted_churn: data.predicted_churn,
        prediction_label: data.prediction_label,
        risk_level: data.risk_level,
        key_risk_factors: data.key_risk_factors || [],
        retention_recommendations: data.retention_recommendations || [],
        prediction_explanation: data.prediction_explanation || '',
        timestamp: new Date().toLocaleTimeString(),
        isScenario: true,
      };

      setScenarioPrediction(result);
      setIsScenarioSimulating(false);

      // Scenario completed: Unlocks ROI Calculation!
      setCompletedModules(prev => ({ ...prev, 'scenario-view': true }));
    } catch (err: any) {
      setScenarioError(`Simulation Error: ${err.message || 'Service unreachable'}`);
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
        completedModules,
        isTabUnlocked,
        getTabPrerequisite,
        attemptNavigateToTab,
        completeModule,
        prerequisiteModal,
        closePrerequisiteModal,
        customerProfile,
        setCustomerProfile,
        updateCustomerField,
        resetCustomerProfile,
        predictionResult,
        predictionLoading,
        predictionError,
        predictCustomerChurn,
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
