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
  aiFeedback: 'up' | 'down' | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleResilienceChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleWeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenerateAnalysis: () => void;
  handleAiFeedback: (feedback: 'up' | 'down') => void;
  handleDownloadCSV: () => void;
  renderAiAnalysis: (text: string) => { __html: string } | null;
  onPrev: () => void;
  onStartOver: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = (props) => {
    const { inputs, score, breakdown, weights, activeWeightPreset, aiAnalysis, isLoadingAi, aiFeedback, handleWeightChange, handleGenerateAnalysis, handleAiFeedback, handleDownloadCSV, renderAiAnalysis, onPrev, onStartOver } = props;
    const { language } = useLanguage();
    const t = translations[language];

    const resourcesLinks = [
        { text: t.sections.resources.link1, url: "http://www.smef.gov.bd/" },
        { text: t.sections.resources.link2, url: "https://pksf-bd.org/" },
        { text: t.sections.resources.link3, url: "https://dae.portal.gov.bd/" },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8 section-container">
            <Section className="fade-in-up" title={t.sections.ai.title} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}>
                {!aiAnalysis && !isLoadingAi && (
                    <div className="text-center">
                        <button onClick={handleGenerateAnalysis} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
                            {t.sections.ai.button}
                        </button>
                    </div>
                )}
                {isLoadingAi && (
                    <div className="flex items-center justify-center p-4">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-gray-600">{t.sections.ai.loading}</span>
                    </div>
                )}
                <div className={`ai-analysis-container ${aiAnalysis ? 'visible' : ''}`}>
                  {aiAnalysis && (
                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={renderAiAnalysis(aiAnalysis) as any} />
                  )}
                  {aiAnalysis && (
                    <div className="mt-6 text-center">
                        {aiFeedback ? (
                            <p className="text-sm text-green-700 font-medium">{t.sections.ai.feedback.thanks}</p>
                        ) : (
                            <>
                                <p className="text-sm text-gray-600 mb-2">{t.sections.ai.feedback.prompt}</p>
                                <div className="flex justify-center gap-4">
                                    <button 
                                        onClick={() => handleAiFeedback('up')}
                                        aria-label={t.sections.ai.feedback.thumbUpAria}
                                        className="p-2 rounded-full text-gray-400 hover:bg-green-100 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                        disabled={!!aiFeedback}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 18.331V11.5a2 2 0 012-2h2.036a2 2 0 001.732-1h.003zM7 11.5V6a2 2 0 012-2h1.5l-2.481 4.342A2 2 0 007 11.5z" /></svg>
                                    </button>
                                    <button 
                                        onClick={() => handleAiFeedback('down')}
                                        aria-label={t.sections.ai.feedback.thumbDownAria}
                                        className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                        disabled={!!aiFeedback}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3h4.017c.163 0 .326.02.485.06L17 5.669V12.5a2 2 0 01-2 2h-2.036a2 2 0 00-1.732 1h-.003zM7 12.5V18a2 2 0 002 2h1.5l2.481-4.342A2 2 0 0017 12.5z" /></svg>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                  )}
                </div>
            </Section>

            <Section className="fade-in-up" title={t.sections.resources.title} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}>
                <p className="text-sm text-gray-600">{t.sections.resources.intro}</p>
                <ul className="space-y-2">
                    {resourcesLinks.map((link, index) => (
                        <li key={index}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-2">
                                <span>{link.text}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </a>
                        </li>
                    ))}
                </ul>
            </Section>
            
            <div className="mt-8 flex justify-between fade-in-up">
                <button onClick={onPrev} className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    {t.navigation.previous}
                </button>
                <button onClick={onStartOver} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600">
                    {t.navigation.startOver}
                </button>
            </div>
          </div>
          <div className="lg:col-span-1">
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
