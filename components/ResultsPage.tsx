import React from 'react';
import { AcracsInput, ScoreBreakdown, WeightPresetProfile } from '../types';
import { Section } from './Section';
import { ResultsPanel } from './ResultsPanel';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

interface ResultsPageProps {
  inputs: AcracsInput;
  score: number;
  breakdown: ScoreBreakdown;
  weights: { financial: number; stability: number; cvi: number; acs: number; };
  activeWeightPreset: WeightPresetProfile;
  aiAnalysis: string;
  isLoadingAi: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleResilienceChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleWeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenerateAnalysis: () => void;
  handleDownloadCSV: () => void;
  renderAiAnalysis: (text: string) => { __html: string } | null;
  onPrev: () => void;
  onStartOver: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = (props) => {
    const { inputs, score, breakdown, weights, activeWeightPreset, aiAnalysis, isLoadingAi, handleWeightChange, handleGenerateAnalysis, handleDownloadCSV, renderAiAnalysis, onPrev, onStartOver } = props;
    const { language } = useLanguage();
    const t = translations[language];

    const resourcesLinks = [
        { text: t.sections.resources.link1, url: "http://www.smef.gov.bd/" },
        { text: t.sections.resources.link2, url: "https://www.bb.org.bd/en/index.php/financialactivity/greenbanking" },
        { text: t.sections.resources.link3, url: "https://dae.portal.gov.bd/" },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8 section-container">
            <Section className="fade-in-up" title={t.sections.ai.title} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}>
              <button onClick={handleGenerateAnalysis} disabled={isLoadingAi} className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 disabled:bg-gray-400">
                {isLoadingAi ? t.sections.ai.loading : t.sections.ai.button}
              </button>
              <div className={`ai-analysis-container ${aiAnalysis ? 'visible' : ''}`}>
                <div className="mt-4 p-4 bg-slate-50 rounded-md prose prose-sm max-w-none text-gray-800">
                  <div dangerouslySetInnerHTML={renderAiAnalysis(aiAnalysis) ?? { __html: '' }}></div>
                </div>
              </div>
            </Section>
            
            <Section className="fade-in-up" title={t.sections.resources.title} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                <p className="text-sm text-gray-600">{t.sections.resources.intro}</p>
                <ul className="list-disc list-inside space-y-2 mt-3">
                    {resourcesLinks.map((link, index) => (
                         <li key={index}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                                {link.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </Section>
            
            <div className="mt-8 flex justify-between">
              <button onClick={onPrev} className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {t.navigation.previous}
              </button>
              <button onClick={onStartOver} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  {t.navigation.startOver}
              </button>
            </div>

          </div>

          <div className="lg:col-span-1 space-y-8">
            <ResultsPanel 
              score={score}
              breakdown={breakdown}
              weights={weights}
              activeWeightPreset={activeWeightPreset}
              handleWeightChange={handleWeightChange}
              handleDownloadCSV={handleDownloadCSV}
              inputs={inputs}
              aiAnalysis={aiAnalysis}
            />
          </div>
        </div>
    );
};