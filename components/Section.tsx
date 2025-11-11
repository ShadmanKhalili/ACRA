
import React from 'react';

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ title, icon, children, className }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className || ''}`}>
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 text-blue-700">{icon}</div>
        <h2 className="text-xl font-semibold text-gray-800 ml-3">{title}</h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};
