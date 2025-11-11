import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const { language } = useLanguage();
  const t = translations[language].scoreGauge;

  const scoreValue = Math.round(score);
  const data = [
    { name: 'Score', value: scoreValue },
    { name: 'Remaining', value: 100 - scoreValue },
  ];

  const getColor = (value: number) => {
    if (value >= 75) return '#10B981'; // Green
    if (value >= 50) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  const getRiskLevel = (value: number) => {
    if (value >= 75) return t.lowRisk;
    if (value >= 50) return t.mediumRisk;
    return t.highRisk;
  }

  const color = getColor(scoreValue);

  return (
    <div className="w-full h-64 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius="70%"
            outerRadius="100%"
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
            stroke="none"
            isAnimationActive={true}
            animationDuration={800}
          >
            <Cell fill={color} />
            <Cell fill="#E5E7EB" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 text-center">
        <p className="text-gray-500 text-sm">{t.title}</p>
        <p className="text-6xl font-bold" style={{ color }}>{scoreValue}</p>
        <p className="text-gray-600 font-semibold">
            {getRiskLevel(scoreValue)}
        </p>
      </div>
    </div>
  );
};

export default ScoreGauge;