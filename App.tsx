import React, { useState, useEffect, useCallback } from 'react';
import { AcracsInput, ScoreBreakdown, WeightPresetProfile } from './types';
import { Header } from './components/Header';
import { WelcomePage } from './components/WelcomePage';
import { BusinessInfoPage } from './components/BusinessInfoPage';
import { AnalysisPage } from './components/AnalysisPage';
import { ResultsPage } from './components/ResultsPage';
import { generateRiskAnalysis } from './services/geminiService';
import { LOCATIONS, SECTORS, CVI_SCORES, ACS_POINTS, WOMAN_LED_BONUS_MULTIPLIER, YEARS_IN_BUSINESS, RESOURCE_DEPENDENCY, STABILITY_POINTS, RESILIENCE_LABELS, WEIGHT_PRESETS, HIGH_RISK_LOCATIONS, HIGH_RISK_SECTORS, LOW_RISK_SECTORS } from './constants';
import { Footer } from './components/Footer';
import { useLanguage } from './contexts/LanguageContext';
import { translations } from './translations';

const initialInputs: AcracsInput = {
  enterpriseName: '',
  isWomanLed: false,
  location: 'khulna',
  sector: 'agriculture',
  debtToEquity: 0,
  yearlyProfit: 0,
  monthlyRevenue: 0,
  monthlyExpenses: 0,
  cashOnHand: 0,
  yearsInBusiness: '0-1',
  employees: 0,
  resourceDependency: 'low',
  resilienceMeasures: {
    diversification: { checked: false, details: '' },
    climateSmartPractices: { checked: false, details: '' },
    protectiveInfrastructure: { checked: false, details: '' },
    microInsurance: { checked: false, details: '' },
    climateTraining: { checked: false, details: '' },
    hasSavings: { checked: false, details: '' },
    earlyWarningAccess: { checked: false, details: '' },
    communityGroupMember: { checked: false, details: '' },
    formalBusinessPlan: { checked: false, details: '' },
    localSupplierNetwork: { checked: false, details: '' },
    digitalLiteracy: { checked: false, details: '' },
  },
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputs, setInputs] = useState<AcracsInput>(initialInputs);
  const [score, setScore] = useState(0);
  const [breakdown, setBreakdown] = useState<ScoreBreakdown>({ financial: 0, stability: 0, cvi: 0, acs: 0 });
  const [weights, setWeights] = useState(WEIGHT_PRESETS.balanced);
  const [activeWeightPreset, setActiveWeightPreset] = useState<WeightPresetProfile>('balanced');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  const handleNext = () => setCurrentPage(p => p + 1);
  const handlePrev = () => setCurrentPage(p => p - 1);
  const handleStartOver = () => {
    setInputs(initialInputs);
    setAiAnalysis('');
    setCurrentPage(1);
  };
  
  const calculateScore = useCallback(() => {
    // 1. Financial Score (scaled to 100)
    const financialScoreDTE = Math.max(0, 100 - (inputs.debtToEquity / 3) * 100);
    const financialScoreProfit = Math.min(100, (inputs.yearlyProfit / 3000000) * 100);
    const financialScore = (financialScoreDTE * 0.5) + (financialScoreProfit * 0.5);

    // 2. Business Stability Score
    const yearsScore = STABILITY_POINTS.years[inputs.yearsInBusiness];
    const dependencyScore = STABILITY_POINTS.dependency[inputs.resourceDependency];
    const employeeScore = Math.min(30, inputs.employees * STABILITY_POINTS.employees); // Cap at 30 points
    const stabilityScore = yearsScore + dependencyScore + employeeScore;
    
    // 3. Climate Vulnerability Index Score (inverted, so higher is better)
    const baseCvi = CVI_SCORES[inputs.location as keyof typeof CVI_SCORES] || 50;
    const cviScore = 100 - baseCvi;

    // 4. Adaptive Capacity Score
    let acsScore = (Object.entries(inputs.resilienceMeasures) as [keyof typeof ACS_POINTS, {checked: boolean}][])
      .reduce((total, [key, value]) => {
        return total + (value.checked ? ACS_POINTS[key] : 0);
      }, 0);
    
    if (inputs.isWomanLed) {
      acsScore *= WOMAN_LED_BONUS_MULTIPLIER;
    }
    acsScore = Math.min(100, acsScore);

    setBreakdown({ financial: financialScore, stability: stabilityScore, cvi: cviScore, acs: acsScore });

    // Final Weighted Score
    const finalScore = (financialScore * weights.financial) + (stabilityScore * weights.stability) + (cviScore * weights.cvi) + (acsScore * weights.acs);
    setScore(finalScore);
  }, [inputs, weights]);

  // Auto-adjust weights based on business profile
  useEffect(() => {
    const { location, sector, yearsInBusiness } = inputs;
    let profile: WeightPresetProfile = 'balanced';

    if (HIGH_RISK_LOCATIONS.includes(location) || HIGH_RISK_SECTORS.includes(sector)) {
      profile = 'highClimateRisk';
    } else if (yearsInBusiness === '5+' && LOW_RISK_SECTORS.includes(sector)) {
      profile = 'establishedStable';
    } else if (yearsInBusiness === '0-1') {
      profile = 'newVenture';
    }

    setWeights(WEIGHT_PRESETS[profile]);
    setActiveWeightPreset(profile);
  }, [inputs.location, inputs.sector, inputs.yearsInBusiness]);

  useEffect(() => {
    calculateScore();
  }, [calculateScore]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        if(name === 'isWomanLed') {
            setInputs(prev => ({...prev, isWomanLed: checked}));
        }
    } else {
      setInputs(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    }
  };

  const handleResilienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const key = name as keyof AcracsInput['resilienceMeasures'];

    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setInputs(prev => ({
            ...prev,
            resilienceMeasures: { ...prev.resilienceMeasures, [key]: {...prev.resilienceMeasures[key], checked } },
        }));
    } else {
        setInputs(prev => ({
            ...prev,
            resilienceMeasures: { ...prev.resilienceMeasures, [key]: {...prev.resilienceMeasures[key], details: value } },
        }));
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWeights(prev => ({...prev, [name]: parseFloat(value)}));
  }

  const handleGenerateAnalysis = async () => {
    setIsLoadingAi(true);
    setAiAnalysis('');
    const analysis = await generateRiskAnalysis(inputs, { final: score, breakdown }, language);
    setAiAnalysis(analysis);
    setIsLoadingAi(false);
  };
  
  const handleDownloadCSV = useCallback(() => {
    const { enterpriseName, isWomanLed, location, sector, debtToEquity, yearlyProfit, monthlyRevenue, monthlyExpenses, cashOnHand, yearsInBusiness, employees, resourceDependency, resilienceMeasures } = inputs;
    const t_csv = translations[language].csv;

    const locationLabel = LOCATIONS.find(l => l.value === location)?.label[language] || 'N/A';
    const sectorLabel = SECTORS.find(s => s.value === sector)?.label[language] || 'N/A';
    const yearsLabel = YEARS_IN_BUSINESS.find(y => y.value === yearsInBusiness)?.label[language] || 'N/A';
    const dependencyLabel = RESOURCE_DEPENDENCY.find(r => r.value === resourceDependency)?.label[language] || 'N/A';
    const yes = language === 'bn' ? 'হ্যাঁ' : 'Yes';
    const no = language === 'bn' ? 'না' : 'No';

    const resilienceData = (Object.keys(RESILIENCE_LABELS) as (keyof AcracsInput['resilienceMeasures'])[])
      .map(key => {
        const measure = resilienceMeasures[key];
        let value = measure.checked ? yes : no;
        if (measure.checked && measure.details) {
            value += ` (${measure.details})`;
        }
        return [`${t_csv.resiliencePrefix}: ${RESILIENCE_LABELS[key].label[language]}`, value];
      });

    const data = [
        [t_csv.category, t_csv.field, t_csv.value],
        [t_csv.bizInfo, t_csv.bizName, enterpriseName],
        [t_csv.bizInfo, t_csv.womanLed, isWomanLed ? yes : no],
        [t_csv.bizInfo, t_csv.location, locationLabel],
        [t_csv.bizInfo, t_csv.sector, sectorLabel],
        [t_csv.bizInfo, t_csv.years, yearsLabel],
        [t_csv.bizInfo, t_csv.employees, employees.toString()],
        [t_csv.bizInfo, t_csv.reliance, dependencyLabel],
        [t_csv.financials, t_csv.d2e, debtToEquity.toString()],
        [t_csv.financials, t_csv.profit, yearlyProfit.toLocaleString()],
        [t_csv.financials, t_csv.monthlyRevenue, monthlyRevenue?.toLocaleString() || 'N/A'],
        [t_csv.financials, t_csv.monthlyExpenses, monthlyExpenses?.toLocaleString() || 'N/A'],
        [t_csv.financials, t_csv.cashOnHand, cashOnHand?.toLocaleString() || 'N/A'],
        ...resilienceData,
        [t_csv.scores, t_csv.finalScore, score.toFixed(2)],
        [t_csv.scores, t_csv.financialScore, breakdown.financial.toFixed(2)],
        [t_csv.scores, t_csv.stabilityScore, breakdown.stability.toFixed(2)],
        [t_csv.scores, t_csv.cviScore, breakdown.cvi.toFixed(2)],
        [t_csv.scores, t_csv.acsScore, breakdown.acs.toFixed(2)],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + data.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ACRACS_Report_${enterpriseName.replace(/ /g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [inputs, score, breakdown, language]);

  const renderAiAnalysis = (text: string) => {
    if (!text) return null;

    const htmlText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(new RegExp(`(${t.riskLevels.low})`, 'g'), '<span class="font-bold text-green-600">$1</span>')
      .replace(new RegExp(`(${t.riskLevels.medium})`, 'g'), '<span class="font-bold text-amber-600">$1</span>')
      .replace(new RegExp(`(${t.riskLevels.high})`, 'g'), '<span class="font-bold text-red-600">$1</span>');

    const lines = htmlText.split('\n');
    const elements = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            if (!inList) {
                inList = true;
                elements.push('<ul class="list-disc list-inside space-y-1 my-2">');
            }
            elements.push(`<li>${line.trim().substring(2)}</li>`);
        } else {
            if (inList) {
                inList = false;
                elements.push('</ul>');
            }
            if (line.trim()) {
                elements.push(`<p class="my-2">${line}</p>`);
            }
        }
    }

    if (inList) {
        elements.push('</ul>');
    }

    return { __html: elements.join('') };
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
        case 1:
            return <WelcomePage onNext={handleNext} />;
        case 2:
            return <BusinessInfoPage inputs={inputs} handleInputChange={handleInputChange} onNext={handleNext} onPrev={handlePrev} />;
        case 3:
            return <AnalysisPage 
                inputs={inputs}
                handleInputChange={handleInputChange}
                handleResilienceChange={handleResilienceChange}
                onNext={handleNext}
                onPrev={handlePrev}
            />;
        case 4:
            return <ResultsPage 
                inputs={inputs}
                score={score}
                breakdown={breakdown}
                weights={weights}
                activeWeightPreset={activeWeightPreset}
                aiAnalysis={aiAnalysis}
                isLoadingAi={isLoadingAi}
                handleWeightChange={handleWeightChange}
                handleGenerateAnalysis={handleGenerateAnalysis}
                handleDownloadCSV={handleDownloadCSV}
                renderAiAnalysis={renderAiAnalysis}
                onPrev={handlePrev}
                onStartOver={handleStartOver}
            />;
        default:
            return <WelcomePage onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex-grow w-full">
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;