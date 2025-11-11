import React from 'react';
import { AcracsInput } from '../types';
import { Section } from './Section';
import { LOCATIONS, SECTORS, YEARS_IN_BUSINESS, RESOURCE_DEPENDENCY } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

interface BusinessInfoPageProps {
  inputs: AcracsInput;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
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

export const BusinessInfoPage: React.FC<BusinessInfoPageProps> = ({ inputs, handleInputChange, onNext, onPrev }) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const selectedLocation = LOCATIONS.find(loc => loc.value === inputs.location);

  return (
    <div className="max-w-4xl mx-auto">
        <Section title={t.sections.about.title} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label={t.sections.about.name.label} helper={t.sections.about.name.helper}>
                    <input type="text" name="enterpriseName" value={inputs.enterpriseName} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </FormField>
                <FormField label={t.sections.about.sector.label} helper={t.sections.about.sector.helper}>
                    <select name="sector" value={inputs.sector} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                        {SECTORS.map(opt => <option key={opt.value} value={opt.value}>{opt.label[language]}</option>)}
                    </select>
                </FormField>
                <div>
                    <FormField label={t.sections.about.location.label} helper={t.sections.about.location.helper}>
                        <select name="location" value={inputs.location} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                            {LOCATIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label[language]}</option>)}
                        </select>
                    </FormField>
                    {selectedLocation && selectedLocation.risks && (
                        <div className="mt-2 p-2 bg-amber-50 text-amber-900 border-l-4 border-amber-400 text-xs rounded-r-md flex items-start gap-2">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <span className="font-semibold">{t.sections.about.primaryRisks}:</span> {selectedLocation.risks[language]}
                            </div>
                        </div>
                    )}
                </div>
                <FormField label={t.sections.about.years.label} helper={t.sections.about.years.helper}>
                    <select name="yearsInBusiness" value={inputs.yearsInBusiness} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                        {YEARS_IN_BUSINESS.map(opt => <option key={opt.value} value={opt.value}>{opt.label[language]}</option>)}
                    </select>
                </FormField>
                <FormField label={t.sections.about.employees.label} helper={t.sections.about.employees.helper}>
                    <input type="number" name="employees" value={inputs.employees || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </FormField>
                <FormField label={t.sections.about.reliance.label} helper={t.sections.about.reliance.helper}>
                    <select name="resourceDependency" value={inputs.resourceDependency} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                        {RESOURCE_DEPENDENCY.map(opt => <option key={opt.value} value={opt.value}>{opt.label[language]}</option>)}
                    </select>
                </FormField>
                <div className="flex items-center pt-5">
                    <input id="isWomanLed" name="isWomanLed" type="checkbox" checked={inputs.isWomanLed} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="isWomanLed" className="ml-2 block text-sm font-medium text-gray-900">{t.sections.about.womanLed}</label>
                </div>
            </div>
        </Section>
        <div className="mt-8 flex justify-between">
            <button onClick={onPrev} className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {t.navigation.previous}
            </button>
            <button onClick={onNext} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
                {t.navigation.next}
            </button>
        </div>
    </div>
  );
};