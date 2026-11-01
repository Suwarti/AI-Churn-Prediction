export type NavigationTab = 
  | 'prediction' 
  | 'customer-value' 
  | 'decision-framework' 
  | 'scenario-view' 
  | 'roi-calculation' 
  | 'generate-insight';

export interface CustomerProfile {
  tenureMonths: number | '';
  monthlyCharges: number | '';
  age: number | '';
  total_support_interactions: number | '';
  hasPhoneService: 'No' | 'Yes' | '';
  hasInternetService: 'DSL' | 'Fiber optic' | 'No' | '';
  contractType: 'Month-to-month' | 'One year' | 'Two year' | '';
  paperlessBilling: 'No' | 'Yes' | '';
  paymentMethod: 
    | 'Bank transfer (automatic)' 
    | 'Credit card (automatic)' 
    | 'Electronic check' 
    | 'Mailed check'
    | '';
  region: string;
  gender: 'Female' | 'Male' | '';
  partner: 'No' | 'Yes' | '';
  dependents: 'No' | 'Yes' | '';
}

export interface PredictionResult {
  churn_probability: number;
  predicted_churn: 0 | 1;
  prediction_label: 'Churn' | 'Non-Churn';
  risk_level: 'Low' | 'Medium' | 'High';
  key_risk_factors: string[];
  retention_recommendations: string[];
  prediction_explanation: string;
  timestamp: string;
  isScenario?: boolean;
}

export interface ModelApiStatus {
  connected: boolean;
  apiUrl: string;
  statusMessage: string;
  checking: boolean;
  lastChecked?: string;
  modelDetails?: {
    filename: string;
    algorithm: string;
    featureCount: number;
    threshold: number;
    horizon: string;
  };
}

export interface ModuleCompletionState {
  prediction: boolean;
  'customer-value': boolean;
  'decision-framework': boolean;
  'scenario-view': boolean;
  'roi-calculation': boolean;
  'generate-insight': boolean;
}

export interface PrerequisiteInfo {
  targetTab: NavigationTab;
  targetTitle: string;
  requiredTab: NavigationTab;
  requiredTitle: string;
  reason: string;
}

export interface ValueSegmentationSettings {
  highThreshold: number; // e.g. 15,000,000 IDR
  mediumThreshold: number; // e.g. 5,000,000 IDR
}

export type CustomerValueSegment = 'High Value' | 'Medium Value' | 'Low Value';

export interface CustomerValueFinancials {
  monthlyCharges: number;
  tenureMonths: number;
  expectedRemainingMonths: number;
  estimatedCustomerValue: number;
  calculationBreakdown: {
    baseContractMonths: number;
    tenureBonusMonths: number;
    bundlingBonusMonths: number;
  };
}

export interface CustomerValueAiAssessment {
  customer_value_segment: CustomerValueSegment;
  customer_value_assessment: string;
  key_value_drivers: string[];
  business_interpretation: string;
  retention_strategy: {
    tier_title: string;
    primary_objective: string;
    recommended_actions: string[];
  };
  cachedAt?: string;
  engine?: string;
}

export type FinalDecisionLabel = 
  | 'Priority Retention'
  | 'Cost-Efficient Retention'
  | 'Loyalty Enhancement'
  | 'Standard Engagement';

export interface FinalDecisionAnalysis {
  churnRiskCategory: 'High' | 'Low';
  valueCategory: 'High' | 'Low';
  finalDecision: FinalDecisionLabel;
  businessInterpretation: string;
  businessRationale: string;
  primaryRetentionStrategy: string;
  recommendedActions: string[];
  engine?: string;
  cachedAt?: string;
}

export interface RetentionScenarioItem {
  id: 'conservative' | 'base-case' | 'optimistic';
  name: string;
  interventionLevel: string;
  assumedSuccessRate: number; // e.g. 20, 35, 50
  assumedSuccessRateLabel: string;
  recommendedActions: string[];
  expectedBusinessImpact: string;
  rationale: string;
}

export interface ScenarioRecommendationsResult {
  scenarios: RetentionScenarioItem[];
  recommendedScenarioId: 'conservative' | 'base-case' | 'optimistic';
  recommendedScenarioName: string;
  recommendationExplanation: string;
  cachedAt?: string;
  engine?: string;
}

export interface DecisionQuadrantConfig {
  id: 'high-risk-high-value' | 'high-risk-low-value' | 'low-risk-high-value' | 'low-risk-low-value';
  title: string;
  riskCategory: 'High Risk' | 'Low Risk';
  valueCategory: 'High Value' | 'Low Value';
  defaultTitle: string;
  recommendedAction: string;
  priorityLevel: 'Immediate (P0)' | 'High (P1)' | 'Medium (P2)' | 'Standard (P3)';
  businessExplanation: string;
  tactics: string[];
}

export interface SingleScenarioFinancials {
  id: 'conservative' | 'base-case' | 'optimistic';
  name: string;
  assumedSuccessRate: number; // 0.20, 0.35, 0.50
  costPercentage: number; // 0.05, 0.10, 0.15
  estimatedRetentionCost: number;
  expectedRetainedValue: number;
  expectedNetGain: number;
  estimatedRoiPercentage: number;
}

export interface AutomatedRoiAnalysis {
  estimatedCustomerValue: number;
  monthlyCharges: number;
  expectedRemainingMonths: number;
  scenariosFinancials: Record<'conservative' | 'base-case' | 'optimistic', SingleScenarioFinancials>;
  recommendedScenarioId: 'conservative' | 'base-case' | 'optimistic';
  recommendedScenarioName: string;
  recommendedFinancials: SingleScenarioFinancials;
  businessInterpretation: string;
  financialRationale: string;
  cachedAt?: string;
  engine?: string;
}

export interface RoiAssumptions {
  targetedCustomers: number;
  retentionSuccessRate: number; // percentage (0 - 100)
  avgMonthlyCharges: number; // IDR
  retainedLifetimeMonths: number;
  costPerCustomer: number; // IDR
}

export interface RoiResults {
  estimatedRevenueRetained: number;
  totalCampaignCost: number;
  netBenefit: number;
  roiPercentage: number;
}

export interface ExecutiveReportSynthesis {
  executiveSummary: string;
  strategicRecommendations: {
    interventionPriority: string;
    engagementApproach: string;
    actionPlan: string[];
    expectedBusinessImpact: string;
    risksAndLimitations: string;
  };
  engine?: string;
  cachedAt?: string;
}
