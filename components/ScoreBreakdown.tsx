import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ScoreBreakdown } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

interface ScoreBreakdownChartProps {
  data: ScoreBreakdown;
}

const ScoreBreakdownChart: React.FC<ScoreBreakdownChartProps> = ({ data }) => {
  const { language } = useLanguage();
  const t = translations[language].scoreBreakdown;

  const chartData = [
    { subject: t.financial, score: Math.round(data.financial), fullMark: 100 },
    { subject: t.stability, score: Math.round(data.stability), fullMark: 100 },
    { subject: t.cvi, score: Math.round(data.cvi), fullMark: 100 },
    { subject: t.acs, score: Math.round(data.acs), fullMark: 100 },
  ];

  return (
    <div className="w-full h-64">
        <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">{t.title}</h3>
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="score" stroke="#1D4ED8" fill="#3B82F6" fillOpacity={0.6} />
            </RadarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default ScoreBreakdownChart;
