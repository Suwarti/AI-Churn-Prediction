import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  CustomerProfile, 
  PredictionResult, 
  NavigationTab,
  ValueSegmentationSettings,
  DecisionQuadrantConfig,
  RoiAssumptions,
  RoiResults,
  ModuleCompletionState,
  PrerequisiteInfo,
  CustomerValueSegment,
  CustomerValueFinancials,
  CustomerValueAiAssessment,
  FinalDecisionLabel,
  FinalDecisionAnalysis,
  RetentionScenarioItem,
  ScenarioRecommendationsResult,
  AutomatedRoiAnalysis,
  SingleScenarioFinancials
} from '../types';

export function computeScenarioFinancials(
  estimatedCustomerValue: number,
  id: 'conservative' | 'base-case' | 'optimistic',
  name: string
): SingleScenarioFinancials {
  const successRates = {
    conservative: 0.20,
    'base-case': 0.35,
    optimistic: 0.50,
  };
  const costPercentages = {
    conservative: 0.05,
    'base-case': 0.10,
    optimistic: 0.15,
  };

  const assumedSuccessRate = successRates[id];
  const costPercentage = costPercentages[id];

  const estimatedRetentionCost = Math.round(estimatedCustomerValue * costPercentage);
  const expectedRetainedValue = Math.round(estimatedCustomerValue * assumedSuccessRate);
  const expectedNetGain = expectedRetainedValue - estimatedRetentionCost;
  const estimatedRoiPercentage = estimatedRetentionCost > 0
    ? ((expectedNetGain / estimatedRetentionCost) * 100)
    : 0;

  return {
    id,
    name,
    assumedSuccessRate,
    costPercentage,
    estimatedRetentionCost,
    expectedRetainedValue,
    expectedNetGain,
    estimatedRoiPercentage,
  };
}

export function determineFinalDecision(churnRisk: 'High' | 'Low', customerValue: 'High' | 'Low'): FinalDecisionLabel {
  if (churnRisk === 'High' && customerValue === 'High') {
    return 'Priority Retention';
  }
  if (churnRisk === 'High' && customerValue === 'Low') {
    return 'Cost-Efficient Retention';
  }
  if (churnRisk === 'Low' && customerValue === 'High') {
    return 'Loyalty Enhancement';
  }
  return 'Standard Engagement';
}

export function calculateCustomerValueFinancials(profile: CustomerProfile): CustomerValueFinancials {
  const monthlyCharges = Number(profile.monthlyCharges) || 0;
  const tenureMonths = Number(profile.tenureMonths) || 0;

  // Base contract horizon modeled from contract type
  let baseContractMonths = 6;
  if (profile.contractType === 'Two year') {
    baseContractMonths = 24;
  } else if (profile.contractType === 'One year') {
    baseContractMonths = 12;
  } else {
    baseContractMonths = 6;
  }

  // Tenure longevity & relationship stability bonus
  let tenureBonusMonths = 0;
  if (tenureMonths >= 36) {
    tenureBonusMonths = 6;
  } else if (tenureMonths >= 24) {
    tenureBonusMonths = 4;
  } else if (tenureMonths >= 12) {
    tenureBonusMonths = 2;
  }

  // Multi-play service bundling factor
  let bundlingBonusMonths = 0;
  if (profile.hasPhoneService === 'Yes' && profile.hasInternetService !== 'No') {
    bundlingBonusMonths = 2;
  }

  const expectedRemainingMonths = Math.max(1, baseContractMonths + tenureBonusMonths + bundlingBonusMonths);
  const estimatedCustomerValue = monthlyCharges * expectedRemainingMonths;

  return {
    monthlyCharges,
    tenureMonths,
    expectedRemainingMonths,
    estimatedCustomerValue,
    calculationBreakdown: {
      baseContractMonths,
      tenureBonusMonths,
      bundlingBonusMonths,
    },
  };
}

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
  customerValueFinancials: CustomerValueFinancials | null;
  customerValueAiAssessment: CustomerValueAiAssessment | null;
  customerValueAiLoading: boolean;
  customerValueAiError: string | null;
  assessCustomerValue: (customProfile?: CustomerProfile, customPrediction?: PredictionResult | null) => Promise<CustomerValueAiAssessment | null>;
  valueSettings: ValueSegmentationSettings;
  updateValueSettings: (updates: Partial<ValueSegmentationSettings>) => void;
  estimatedHistoricalRevenue: number;
  customerValueSegment: CustomerValueSegment;

  // Decision Framework - ONE Final Decision
  finalDecisionAnalysis: FinalDecisionAnalysis | null;
  finalDecisionLoading: boolean;
  finalDecisionError: string | null;
  generateFinalDecision: () => Promise<FinalDecisionAnalysis | null>;
  decisionThresholds: { riskThreshold: number; valueThreshold: number };
  updateDecisionThresholds: (updates: Partial<{ riskThreshold: number; valueThreshold: number }>) => void;
  quadrantConfigs: Record<string, DecisionQuadrantConfig>;
  updateQuadrantConfig: (id: string, updates: Partial<DecisionQuadrantConfig>) => void;
  activeQuadrantId: string;

  // Scenario Simulator & Automated Scenario Recommendations
  scenarioRecommendations: ScenarioRecommendationsResult | null;
  scenarioRecommendationsLoading: boolean;
  scenarioRecommendationsError: string | null;
  generateScenarioRecommendations: () => Promise<ScenarioRecommendationsResult | null>;
  scenarioProfile: CustomerProfile;
  updateScenarioField: <K extends keyof CustomerProfile>(field: K, value: CustomerProfile[K]) => void;
  scenarioPrediction: PredictionResult | null;
  isScenarioSimulating: boolean;
  scenarioError: string | null;
  runScenarioSimulation: () => Promise<void>;
  syncScenarioWithOriginal: () => void;

  // Automated ROI Analysis
  automatedRoiAnalysis: AutomatedRoiAnalysis | null;
  automatedRoiLoading: boolean;
  automatedRoiError: string | null;
  calculateAutomatedRoi: () => Promise<AutomatedRoiAnalysis | null>;
  roiAssumptions: RoiAssumptions;
  updateRoiAssumptions: (updates: Partial<RoiAssumptions>) => void;
  roiResults: RoiResults;
}

export const TAB_TITLES: Record<NavigationTab, string> = {
  prediction: 'Churn Prediction',
  'customer-value': 'Customer Value',
  'decision-framework': 'Decision Framework',
  'scenario-view': 'Scenario View',
  'roi-calculation': 'ROI Calculation',
  'generate-insight': 'Generate Insight',
};

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTabState] = useState<NavigationTab>('prediction');
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

  // Customer Value Settings & AI Assessment State
  const [customerValueFinancials, setCustomerValueFinancials] = useState<CustomerValueFinancials | null>(null);
  const [customerValueAiAssessment, setCustomerValueAiAssessment] = useState<CustomerValueAiAssessment | null>(null);
  const [customerValueAiLoading, setCustomerValueAiLoading] = useState(false);
  const [customerValueAiError, setCustomerValueAiError] = useState<string | null>(null);
  const [valueSettings, setValueSettings] = useState<ValueSegmentationSettings>({
    highThreshold: 10000000, // Rp 10.000.000
    mediumThreshold: 4000000, // Rp 4.000.000
  });

  // Decision Framework State - ONE Final Decision
  const [finalDecisionAnalysis, setFinalDecisionAnalysis] = useState<FinalDecisionAnalysis | null>(null);
  const [finalDecisionLoading, setFinalDecisionLoading] = useState(false);
  const [finalDecisionError, setFinalDecisionError] = useState<string | null>(null);

  // Decision Framework Settings
  const [decisionThresholds, setDecisionThresholds] = useState({
    riskThreshold: 0.50,
    valueThreshold: 10000000,
  });
  const [quadrantConfigs, setQuadrantConfigs] = useState<Record<string, DecisionQuadrantConfig>>(DEFAULT_QUADRANTS);

  // Automated Scenario Recommendations State
  const [scenarioRecommendations, setScenarioRecommendations] = useState<ScenarioRecommendationsResult | null>(null);
  const [scenarioRecommendationsLoading, setScenarioRecommendationsLoading] = useState(false);
  const [scenarioRecommendationsError, setScenarioRecommendationsError] = useState<string | null>(null);

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

  // Automated ROI Analysis State
  const [automatedRoiAnalysis, setAutomatedRoiAnalysis] = useState<AutomatedRoiAnalysis | null>(null);
  const [automatedRoiLoading, setAutomatedRoiLoading] = useState(false);
  const [automatedRoiError, setAutomatedRoiError] = useState<string | null>(null);

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
    if (tab === 'prediction') {
      return true; // 1. Churn Prediction is always unlocked
    }

    // Global Navigation Rule: If Churn Prediction has not been completed, ALL other tabs must be locked.
    const isPredictionComplete = !!predictionResult || completedModules['prediction'];
    if (!isPredictionComplete) {
      return false;
    }

    // Churn Prediction is complete. Preserve existing prerequisite dependencies between subsequent modules:
    const isCustomerValueComplete = !!customerValueAiAssessment || completedModules['customer-value'];
    const isDecisionFrameworkComplete = !!finalDecisionAnalysis || completedModules['decision-framework'];
    const isScenarioViewComplete = !!scenarioRecommendations || !!scenarioPrediction || completedModules['scenario-view'];
    const isRoiCalculationComplete = !!automatedRoiAnalysis || completedModules['roi-calculation'];

    switch (tab) {
      case 'customer-value':
        return true; // Unlocked once Churn Prediction is completed
      case 'decision-framework':
        return isCustomerValueComplete;
      case 'scenario-view':
        return isCustomerValueComplete && isDecisionFrameworkComplete;
      case 'roi-calculation':
        return isCustomerValueComplete && isDecisionFrameworkComplete && isScenarioViewComplete;
      case 'generate-insight':
        return (
          isCustomerValueComplete &&
          isDecisionFrameworkComplete &&
          isScenarioViewComplete &&
          isRoiCalculationComplete
        );
      default:
        return false;
    }
  };

  const getTabPrerequisite = (tab: NavigationTab): PrerequisiteInfo | null => {
    if (isTabUnlocked(tab)) return null;

    const isPredictionComplete = !!predictionResult || completedModules['prediction'];

    // Global Navigation Rule:
    // If Churn Prediction has not been completed, ALL other tabs must be locked.
    // Whenever a user clicks any locked tab, always display the same prerequisite modal:
    // Title: "PREREQUISITE REQUIRED"
    // Message: "Please complete Churn Prediction first."
    // Description: "This module requires completing Churn Prediction before proceeding."
    // Button: "GO TO CHURN PREDICTION →"
    if (!isPredictionComplete) {
      return {
        targetTab: tab,
        targetTitle: TAB_TITLES[tab] || 'Module',
        requiredTab: 'prediction',
        requiredTitle: 'Churn Prediction',
        title: 'PREREQUISITE REQUIRED',
        message: 'Please complete Churn Prediction first.',
        description: 'This module requires completing Churn Prediction before proceeding.',
        reason: 'This module requires completing Churn Prediction before proceeding.',
        buttonText: 'GO TO CHURN PREDICTION →',
      };
    }

    // Preserve the existing prerequisite dependencies between subsequent modules once Churn Prediction is completed:
    const isCustomerValueComplete = !!customerValueAiAssessment || completedModules['customer-value'];
    if (!isCustomerValueComplete) {
      return {
        targetTab: tab,
        targetTitle: TAB_TITLES[tab] || 'Module',
        requiredTab: 'customer-value',
        requiredTitle: 'Customer Value',
        title: 'PREREQUISITE REQUIRED',
        message: 'Please complete Customer Value first.',
        description: `${TAB_TITLES[tab] || 'This module'} requires completing Customer Value analysis first.`,
        reason: `${TAB_TITLES[tab] || 'This module'} requires completing Customer Value analysis first.`,
        buttonText: 'GO TO CUSTOMER VALUE →',
      };
    }

    const isDecisionFrameworkComplete = !!finalDecisionAnalysis || completedModules['decision-framework'];
    if (!isDecisionFrameworkComplete) {
      return {
        targetTab: tab,
        targetTitle: TAB_TITLES[tab] || 'Module',
        requiredTab: 'decision-framework',
        requiredTitle: 'Decision Framework',
        title: 'PREREQUISITE REQUIRED',
        message: 'Please complete Decision Framework first.',
        description: `${TAB_TITLES[tab] || 'This module'} requires completing Decision Framework analysis first.`,
        reason: `${TAB_TITLES[tab] || 'This module'} requires completing Decision Framework analysis first.`,
        buttonText: 'GO TO DECISION FRAMEWORK →',
      };
    }

    const isScenarioViewComplete = !!scenarioRecommendations || !!scenarioPrediction || completedModules['scenario-view'];
    if (!isScenarioViewComplete) {
      return {
        targetTab: tab,
        targetTitle: TAB_TITLES[tab] || 'Module',
        requiredTab: 'scenario-view',
        requiredTitle: 'Scenario View',
        title: 'PREREQUISITE REQUIRED',
        message: 'Please complete Scenario View first.',
        description: `${TAB_TITLES[tab] || 'This module'} requires completing Scenario View analysis first.`,
        reason: `${TAB_TITLES[tab] || 'This module'} requires completing Scenario View analysis first.`,
        buttonText: 'GO TO SCENARIO VIEW →',
      };
    }

    const isRoiCalculationComplete = !!automatedRoiAnalysis || completedModules['roi-calculation'];
    if (!isRoiCalculationComplete) {
      return {
        targetTab: tab,
        targetTitle: TAB_TITLES[tab] || 'Module',
        requiredTab: 'roi-calculation',
        requiredTitle: 'ROI Calculation',
        title: 'PREREQUISITE REQUIRED',
        message: 'Please complete ROI Calculation first.',
        description: `${TAB_TITLES[tab] || 'This module'} requires completing ROI Calculation analysis first.`,
        reason: `${TAB_TITLES[tab] || 'This module'} requires completing ROI Calculation analysis first.`,
        buttonText: 'GO TO ROI CALCULATION →',
      };
    }

    return null;
  };

  const attemptNavigateToTab = (tab: NavigationTab): boolean => {
    if (isTabUnlocked(tab)) {
      setActiveTabState(tab);
      return true;
    }

    const prereq = getTabPrerequisite(tab);
    if (prereq) {
      setPrerequisiteModal(prereq);
    }
    return false;
  };

  const setActiveTab = (tab: NavigationTab) => {
    if (isTabUnlocked(tab)) {
      setActiveTabState(tab);
    } else {
      const prereq = getTabPrerequisite(tab);
      if (prereq) {
        setPrerequisiteModal(prereq);
      }
    }
  };

  // Guard: if Churn Prediction is incomplete, force activeTab back to 'prediction'
  useEffect(() => {
    const isPredictionComplete = !!predictionResult || completedModules['prediction'];
    if (!isPredictionComplete && activeTab !== 'prediction') {
      setActiveTabState('prediction');
    }
  }, [predictionResult, completedModules, activeTab]);

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
        setActiveTabState(nextTab);
      }
    }
  };

  const updateCustomerField = <K extends keyof CustomerProfile>(field: K, value: CustomerProfile[K]) => {
    // Check if value actually changed
    if (customerProfile[field] === value) {
      return;
    }

    setCustomerProfile(prev => ({ ...prev, [field]: value }));

    // Invalidate downstream dependent results only when upstream customer data actually changes
    if (predictionResult) {
      setPredictionResult(null);
      setCustomerValueAiAssessment(null);
      setCustomerValueFinancials(null);
      setFinalDecisionAnalysis(null);
      setFinalDecisionError(null);
      setScenarioRecommendations(null);
      setScenarioRecommendationsError(null);
      setAutomatedRoiAnalysis(null);
      setAutomatedRoiError(null);
      setCompletedModules({
        prediction: false,
        'customer-value': false,
        'decision-framework': false,
        'scenario-view': false,
        'roi-calculation': false,
        'generate-insight': false,
      });
    }
  };

  const resetCustomerProfile = () => {
    setCustomerProfile(INITIAL_CUSTOMER_PROFILE);
    setPredictionResult(null);
    setPredictionError(null);
    setCustomerValueAiAssessment(null);
    setCustomerValueFinancials(null);
    setCustomerValueAiError(null);
    setFinalDecisionAnalysis(null);
    setFinalDecisionError(null);
    setScenarioRecommendations(null);
    setScenarioRecommendationsError(null);
    setAutomatedRoiAnalysis(null);
    setAutomatedRoiError(null);
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

  // Automated AI Customer Value Assessment
  const assessCustomerValue = async (
    customProfile?: CustomerProfile,
    customPrediction?: PredictionResult | null
  ): Promise<CustomerValueAiAssessment | null> => {
    const prof = customProfile || customerProfile;
    const pred = customPrediction !== undefined ? customPrediction : predictionResult;
    const fin = calculateCustomerValueFinancials(prof);
    setCustomerValueFinancials(fin);

    setCustomerValueAiLoading(true);
    setCustomerValueAiError(null);

    try {
      const res = await fetch('/api/customer-value/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerProfile: {
            ...prof,
            tenureMonths: Number(prof.tenureMonths) || 0,
            monthlyCharges: Number(prof.monthlyCharges) || 0,
            age: Number(prof.age) || 0,
            total_support_interactions: Number(prof.total_support_interactions) || 0,
          },
          financials: fin,
          churnPrediction: pred,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete AI Customer Value assessment');
      }

      const assessment: CustomerValueAiAssessment = {
        customer_value_segment: data.customer_value_segment,
        customer_value_assessment: data.customer_value_assessment,
        key_value_drivers: data.key_value_drivers || [],
        business_interpretation: data.business_interpretation,
        retention_strategy: data.retention_strategy,
        cachedAt: new Date().toLocaleTimeString(),
        engine: data.engine || 'gemini-3.8-flash',
      };

      setCustomerValueAiAssessment(assessment);
      setCustomerValueAiLoading(false);
      setCompletedModules(prev => ({ ...prev, 'customer-value': true }));
      return assessment;
    } catch (err: any) {
      setCustomerValueAiError(err.message || 'Customer value assessment failed');
      setCustomerValueAiLoading(false);
      return null;
    }
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

      // Automatically execute Customer Value Assessment using Gemini AI in the background!
      assessCustomerValue(rawProfile, result);

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
  const customerValueSegment: CustomerValueSegment =
    customerValueAiAssessment?.customer_value_segment ??
    (estimatedHistoricalRevenue >= valueSettings.highThreshold
      ? 'High Value'
      : estimatedHistoricalRevenue >= valueSettings.mediumThreshold
      ? 'Medium Value'
      : 'Low Value');

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
  const isHighValue = customerValueAiAssessment
    ? customerValueAiAssessment.customer_value_segment === 'High Value'
    : estimatedHistoricalRevenue >= decisionThresholds.valueThreshold;
  
  let activeQuadrantId = 'high-risk-high-value';
  if (isHighRisk && isHighValue) activeQuadrantId = 'high-risk-high-value';
  else if (isHighRisk && !isHighValue) activeQuadrantId = 'high-risk-low-value';
  else if (!isHighRisk && isHighValue) activeQuadrantId = 'low-risk-high-value';
  else activeQuadrantId = 'low-risk-low-value';

  // Generate ONE Final Strategic Decision using the Exact Decision Matrix + Gemini AI
  const generateFinalDecision = async (): Promise<FinalDecisionAnalysis | null> => {
    if (!predictionResult) return null;

    const churnRiskCat: 'High' | 'Low' = 
      (predictionResult.risk_level === 'High' || predictionResult.churn_probability >= 0.50) ? 'High' : 'Low';
    const valueCat: 'High' | 'Low' = 
      (customerValueSegment === 'High Value' || (customerValueFinancials?.estimatedCustomerValue ?? 0) >= 10000000) ? 'High' : 'Low';
    const decision = determineFinalDecision(churnRiskCat, valueCat);

    setFinalDecisionLoading(true);
    setFinalDecisionError(null);

    const fin = customerValueFinancials || calculateCustomerValueFinancials(customerProfile);

    try {
      const res = await fetch('/api/decision-framework/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          churnRisk: churnRiskCat,
          customerValueSegment: valueCat,
          finalDecision: decision,
          churnProbability: predictionResult.churn_probability,
          estimatedCustomerValue: fin.estimatedCustomerValue,
          customerProfile,
          keyRiskFactors: predictionResult.key_risk_factors,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate decision interpretation');
      }

      const result: FinalDecisionAnalysis = {
        churnRiskCategory: churnRiskCat,
        valueCategory: valueCat,
        finalDecision: decision,
        businessInterpretation: data.business_interpretation,
        businessRationale: data.business_rationale,
        primaryRetentionStrategy: data.primary_retention_strategy,
        recommendedActions: data.recommended_actions || [],
        engine: data.engine || 'gemini-3.8-flash',
        cachedAt: new Date().toLocaleTimeString(),
      };

      setFinalDecisionAnalysis(result);
      setFinalDecisionLoading(false);
      setCompletedModules(prev => ({ ...prev, 'decision-framework': true }));
      return result;
    } catch (err: any) {
      setFinalDecisionError(err.message || 'Decision generation failed');
      setFinalDecisionLoading(false);
      return null;
    }
  };

  // Generate Automated AI-Powered Retention Strategy Recommendations
  const generateScenarioRecommendations = async (): Promise<ScenarioRecommendationsResult | null> => {
    if (!predictionResult) return null;

    setScenarioRecommendationsLoading(true);
    setScenarioRecommendationsError(null);

    const fin = customerValueFinancials || calculateCustomerValueFinancials(customerProfile);
    const churnRiskCat: 'High' | 'Low' = 
      (predictionResult.risk_level === 'High' || predictionResult.churn_probability >= 0.50) ? 'High' : 'Low';
    const valueCat: 'High' | 'Low' = 
      (customerValueSegment === 'High Value' || (customerValueFinancials?.estimatedCustomerValue ?? 0) >= 10000000) ? 'High' : 'Low';
    const decision = finalDecisionAnalysis?.finalDecision || determineFinalDecision(churnRiskCat, valueCat);

    try {
      const res = await fetch('/api/scenarios/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerProfile,
          predictionResult,
          customerValue: {
            customerValueSegment,
            estimatedCustomerValue: fin.estimatedCustomerValue,
            monthlyCharges: fin.monthlyCharges,
            expectedRemainingMonths: fin.expectedRemainingMonths,
          },
          decisionFramework: {
            finalDecision: decision,
            businessInterpretation: finalDecisionAnalysis?.businessInterpretation || '',
            primaryRetentionStrategy: finalDecisionAnalysis?.primaryRetentionStrategy || '',
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate scenario recommendations');
      }

      const result: ScenarioRecommendationsResult = {
        scenarios: data.scenarios || [],
        recommendedScenarioId: data.recommended_scenario_id || 'base-case',
        recommendedScenarioName: data.recommended_scenario_name || 'Base Case Scenario',
        recommendationExplanation: data.recommendation_explanation || '',
        engine: data.engine || 'gemini-3.8-flash',
        cachedAt: new Date().toLocaleTimeString(),
      };

      setScenarioRecommendations(result);
      setScenarioRecommendationsLoading(false);
      setCompletedModules(prev => ({ ...prev, 'scenario-view': true }));
      return result;
    } catch (err: any) {
      setScenarioRecommendationsError(err.message || 'Failed to generate retention scenarios');
      setScenarioRecommendationsLoading(false);
      return null;
    }
  };

  // Calculate Automated Retention ROI Analysis
  const calculateAutomatedRoi = async (): Promise<AutomatedRoiAnalysis | null> => {
    if (!predictionResult) return null;

    setAutomatedRoiLoading(true);
    setAutomatedRoiError(null);

    const fin = customerValueFinancials || calculateCustomerValueFinancials(customerProfile);
    const totalVal = fin.estimatedCustomerValue;

    const conservativeFin = computeScenarioFinancials(totalVal, 'conservative', 'Conservative Scenario');
    const baseCaseFin = computeScenarioFinancials(totalVal, 'base-case', 'Base Case Scenario');
    const optimisticFin = computeScenarioFinancials(totalVal, 'optimistic', 'Optimistic Scenario');

    const scenariosFinancials = {
      conservative: conservativeFin,
      'base-case': baseCaseFin,
      optimistic: optimisticFin,
    };

    const recId = scenarioRecommendations?.recommendedScenarioId || 'base-case';
    const recName = scenarioRecommendations?.recommendedScenarioName || 'Base Case Scenario';
    const recommendedFin = scenariosFinancials[recId];

    const churnRiskCat: 'High' | 'Low' = 
      (predictionResult.risk_level === 'High' || predictionResult.churn_probability >= 0.50) ? 'High' : 'Low';
    const valueCat: 'High' | 'Low' = 
      (customerValueSegment === 'High Value' || totalVal >= 10000000) ? 'High' : 'Low';
    const decision = finalDecisionAnalysis?.finalDecision || determineFinalDecision(churnRiskCat, valueCat);

    try {
      const res = await fetch('/api/roi/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerProfile,
          predictionResult,
          customerValue: {
            estimatedCustomerValue: totalVal,
            monthlyCharges: fin.monthlyCharges,
            expectedRemainingMonths: fin.expectedRemainingMonths,
            customerValueSegment,
          },
          decisionFramework: {
            finalDecision: decision,
            primaryRetentionStrategy: finalDecisionAnalysis?.primaryRetentionStrategy || '',
          },
          scenarioView: {
            recommendedScenarioId: recId,
            recommendedScenarioName: recName,
          },
          financials: {
            estimatedCustomerValue: totalVal,
            scenarios: scenariosFinancials,
            recommended: recommendedFin,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to interpret ROI calculations');
      }

      const result: AutomatedRoiAnalysis = {
        estimatedCustomerValue: totalVal,
        monthlyCharges: fin.monthlyCharges,
        expectedRemainingMonths: fin.expectedRemainingMonths,
        scenariosFinancials,
        recommendedScenarioId: recId,
        recommendedScenarioName: recName,
        recommendedFinancials: recommendedFin,
        businessInterpretation: data.business_interpretation,
        financialRationale: data.financial_rationale,
        cachedAt: new Date().toLocaleTimeString(),
        engine: data.engine || 'gemini-3.8-flash',
      };

      setAutomatedRoiAnalysis(result);
      setAutomatedRoiLoading(false);
      setCompletedModules(prev => ({ ...prev, 'roi-calculation': true }));
      return result;
    } catch (err: any) {
      setAutomatedRoiError(err.message || 'Failed to calculate retention ROI');
      setAutomatedRoiLoading(false);
      return null;
    }
  };

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
        customerValueFinancials,
        customerValueAiAssessment,
        customerValueAiLoading,
        customerValueAiError,
        assessCustomerValue,
        valueSettings,
        updateValueSettings,
        estimatedHistoricalRevenue,
        customerValueSegment,
        decisionThresholds,
        updateDecisionThresholds,
        quadrantConfigs,
        updateQuadrantConfig,
        activeQuadrantId,
        finalDecisionAnalysis,
        finalDecisionLoading,
        finalDecisionError,
        generateFinalDecision,
        scenarioRecommendations,
        scenarioRecommendationsLoading,
        scenarioRecommendationsError,
        generateScenarioRecommendations,
        scenarioProfile,
        updateScenarioField,
        scenarioPrediction,
        isScenarioSimulating,
        scenarioError,
        runScenarioSimulation,
        syncScenarioWithOriginal,
        // Automated ROI Analysis
        automatedRoiAnalysis,
        automatedRoiLoading,
        automatedRoiError,
        calculateAutomatedRoi,
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
