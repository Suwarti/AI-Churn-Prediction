export type NavigationTab = 
  | 'prediction' 
  | 'customer-value' 
  | 'decision-framework' 
  | 'scenario-view' 
  | 'roi-calculation' 
  | 'generate-insight';

export interface CustomerProfile {
  tenureMonths: number;
  monthlyCharges: number;
  age: number;
  total_support_interactions: number;
  hasPhoneService: 'No' | 'Yes';
  hasInternetService: 'DSL' | 'Fiber optic' | 'No';
  contractType: 'Month-to-month' | 'One year' | 'Two year';
  paperlessBilling: 'No' | 'Yes';
  paymentMethod: 
    | 'Bank transfer (automatic)' 
    | 'Credit card (automatic)' 
    | 'Electronic check' 
    | 'Mailed check';
  region: 
    | 'Bandung' 
    | 'JKT' 
    | 'Jakarta' 
    | 'Medan' 
    | 'SBY' 
    | 'Semarang' 
    | 'Surabaya' 
    | 'bandung' 
    | 'bdg' 
    | 'jakarta';
  gender: 'Female' | 'Male';
  partner: 'No' | 'Yes';
  dependents: 'No' | 'Yes';
}

export interface PredictionResult {
  churn_probability: number;
  predicted_churn: number;
  prediction_label: 'Churn' | 'Non-Churn';
  risk_level: 'Low' | 'Medium' | 'High';
  prediction_horizon: string;
  classification_threshold: number;
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

export interface ValueSegmentationSettings {
  highThreshold: number; // e.g. 15,000,000 IDR
  mediumThreshold: number; // e.g. 5,000,000 IDR
}

export type CustomerValueSegment = 'High Value' | 'Medium Value' | 'Low Value';

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
