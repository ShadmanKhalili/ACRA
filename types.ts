export interface AcracsInput {
  enterpriseName: string;
  isWomanLed: boolean;
  location: string; // Changed to string to allow for more options
  sector: string; // Changed to string to allow for more options
  debtToEquity: number;
  yearlyProfit: number;
  monthlyRevenue?: number;
  monthlyExpenses?: number;
  cashOnHand?: number;
  yearsInBusiness: '0-1' | '2-5' | '5+';
  employees: number;
  resourceDependency: 'low' | 'medium' | 'high';
  resilienceMeasures: {
    diversification: { checked: boolean, details: string };
    climateSmartPractices: { checked: boolean, details: string };
    protectiveInfrastructure: { checked: boolean, details: string };
    microInsurance: { checked: boolean, details: string };
    climateTraining: { checked: boolean, details: string };
    hasSavings: { checked: boolean, details: string };
    earlyWarningAccess: { checked: boolean, details: string };
    communityGroupMember: { checked: boolean, details: string };
    formalBusinessPlan: { checked: boolean, details: string };
    localSupplierNetwork: { checked: boolean, details: string };
    digitalLiteracy: { checked: boolean, details: string };
  };
}

export interface ScoreBreakdown {
  financial: number;
  stability: number;
  cvi: number;
  acs: number;
}

export type WeightPresetProfile = 'highClimateRisk' | 'establishedStable' | 'newVenture' | 'balanced';
