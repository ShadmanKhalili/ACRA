import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="w-full text-center py-6 px-4 sm:px-6 lg:px-8">
      <p className="text-xs text-gray-500 max-w-2xl mx-auto">
        {t.footer}
      </p>
    </footer>
  );
};