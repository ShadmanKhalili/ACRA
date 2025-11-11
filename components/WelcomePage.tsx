import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

interface WelcomePageProps {
  onNext: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onNext }) => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="max-w-3xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        <span className="block">{t.welcome.title}</span>
      </h2>
      <p className="mt-4 text-lg leading-6 text-gray-500">
        {t.welcome.description}
      </p>
      <div className="mt-8">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
        >
          {t.welcome.button}
        </button>
      </div>
    </div>
  );
};
