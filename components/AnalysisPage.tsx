import React from 'react';
import { AcracsInput } from '../types';
import { Section } from './Section';
import { RESILIENCE_LABELS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

interface AnalysisPageProps {
  inputs: AcracsInput;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleResilienceChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface FormFieldProps {
  label: string;
  helper: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, helper, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {children}
        <p className="mt-1 text-xs text-gray-500">{helper}</p>
    </div>
);


export const AnalysisPage: React.FC<AnalysisPageProps> = (props) => {
    const { inputs, handleInputChange, handleResilienceChange, onNext, onPrev } = props;
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 section-container">
            <Section className="fade-in-up" title={t.sections.money.title} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label={t.sections.money.d2e.label} helper={t.sections.money.d2e.helper}>
                        <input type="number" name="debtToEquity" value={inputs.debtToEquity || ''} onChange={handleInputChange} step="0.1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                    </FormField>
                    <FormField label={t.sections.money.profit.label} helper={t.sections.money.profit.helper}>
                        <input type="number" name="yearlyProfit" value={inputs.yearlyProfit || ''} onChange={handleInputChange} step="10000" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                    </FormField>
                </div>
                <hr className="my-2 border-gray-200" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField label={t.sections.money.monthlyRevenue.label} helper={t.sections.money.monthlyRevenue.helper}>
                        <input type="number" name="monthlyRevenue" value={inputs.monthlyRevenue || ''} onChange={handleInputChange} step="1000" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                    </FormField>
                    <FormField label={t.sections.money.monthlyExpenses.label} helper={t.sections.money.monthlyExpenses.helper}>
                        <input type="number" name="monthlyExpenses" value={inputs.monthlyExpenses || ''} onChange={handleInputChange} step="1000" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                    </FormField>
                     <FormField label={t.sections.money.cashOnHand.label} helper={t.sections.money.cashOnHand.helper}>
                        <input type="number" name="cashOnHand" value={inputs.cashOnHand || ''} onChange={handleInputChange} step="1000" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                    </FormField>
                </div>
            </Section>
            
            <Section className="fade-in-up" title={t.sections.protection.title} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}>
                <p className="text-sm text-gray-600 -mt-2 mb-4">{t.sections.protection.helper}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {(Object.keys(RESILIENCE_LABELS) as (keyof typeof RESILIENCE_LABELS)[]).map((key) => {
                        const measure = RESILIENCE_LABELS[key];
                        return (
                         <div key={key} className="space-y-2">
                             <label className="relative flex items-start gap-3 cursor-pointer">
                                 <div className="flex h-5 items-center">
                                     <input id={key} name={key} type="checkbox" checked={inputs.resilienceMeasures[key].checked} onChange={handleResilienceChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                 </div>
                                 <div className="text-sm">
                                     <span className="font-medium text-gray-700 flex items-center gap-2">
                                        <span className="w-5 h-5 text-blue-800">{measure.icon}</span>
                                        <span>{measure.label[language]}</span>
                                     </span>
                                 </div>
                             </label>
                             {measure.hasDetails && inputs.resilienceMeasures[key].checked && (
                                <textarea
                                    name={key}
                                    value={inputs.resilienceMeasures[key].details}
                                    onChange={handleResilienceChange}
                                    rows={2}
                                    placeholder={measure.placeholder[language]}
                                    className="block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                             )}
                         </div>
                        )
                    })}
                </div>
            </Section>
          </div>
          <div className="mt-8 flex justify-between">
            <button onClick={onPrev} className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {t.navigation.previous}
            </button>
            <button onClick={onNext} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
                {t.navigation.seeResults}
            </button>
          </div>
        </div>
    );
};