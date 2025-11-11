import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AcracsInput, ScoreBreakdown, WeightPresetProfile } from '../types';
import ScoreGauge from './ScoreGauge';
import ScoreBreakdownChart from './ScoreBreakdown';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

interface ResultsPanelProps {
  score: number;
  breakdown: ScoreBreakdown;
  weights: { financial: number; stability: number; cvi: number; acs: number; };
  activeWeightPreset: WeightPresetProfile;
  handleWeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownloadCSV: () => void;
  inputs: AcracsInput;
  aiAnalysis: string;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = (props) => {
    const { score, breakdown, weights, activeWeightPreset, handleWeightChange, handleDownloadCSV, inputs, aiAnalysis } = props;
    const resultsRef = useRef<HTMLDivElement>(null);
    const { language } = useLanguage();
    const t = translations[language];

    const handleDownloadPDF = async () => {
        const resultsElement = resultsRef.current;
        if (!resultsElement) return;

        const buttonsContainer = resultsElement.querySelector('#download-buttons');
        if (buttonsContainer) (buttonsContainer as HTMLElement).style.display = 'none';

        const canvas = await html2canvas(resultsElement, { scale: 2 });

        if (buttonsContainer) (buttonsContainer as HTMLElement).style.display = 'flex';

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const margin = 15;
        
        if(language === 'bn') {
          alert('PDF ডাউনলোড বর্তমানে শুধুমাত্র ইংরেজি ভাষায় সমর্থিত। আপনার জন্য একটি ইংরেজি রিপোর্ট তৈরি করা হবে।');
        }

        pdf.setFontSize(22);
        pdf.setFont('helvetica', 'bold');
        pdf.text('ACRACS Business Health Check', margin, 20);

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Report for: ${inputs.enterpriseName}`, margin, 30);
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 36);
        
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = pdfWidth - margin * 2;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        
        let currentY = 45;
        if (currentY + imgHeight > pdf.internal.pageSize.getHeight() - margin) {
            pdf.addPage();
            currentY = margin;
        }

        pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
        currentY += imgHeight;

        if (aiAnalysis) {
          currentY += 10;
          
          if (currentY > pdf.internal.pageSize.getHeight() - margin) {
              pdf.addPage();
              currentY = margin;
          }

          pdf.setFontSize(16);
          pdf.setFont('helvetica', 'bold');
          pdf.text('AI Advisor Summary', margin, currentY);
          currentY += 8;

          pdf.setFontSize(10);
          const lines = aiAnalysis.split('\n');
          const contentWidth = pdfWidth - margin * 2;
          const lineHeight = 5; // Approx height for 10pt font with spacing

          lines.forEach(line => {
              line = line.trim();
              if (!line) {
                  currentY += lineHeight / 2;
                  return;
              }

              let textToRender = line;
              let isBold = false;
              let isListItem = false;
              let indent = 0;

              if (line.startsWith('**') && line.endsWith('**')) {
                  textToRender = line.substring(2, line.length - 2);
                  isBold = true;
              } else if (line.startsWith('- ') || line.startsWith('* ')) {
                  textToRender = `• ${line.substring(2)}`;
                  isListItem = true;
                  indent = 3;
              }
              
              const splitText = pdf.splitTextToSize(textToRender, contentWidth - indent);
              
              if (currentY + (splitText.length * lineHeight) > pdf.internal.pageSize.getHeight() - margin) {
                  pdf.addPage();
                  currentY = margin;
              }

              pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
              pdf.text(splitText, margin + indent, currentY);
              currentY += splitText.length * lineHeight;
          });
        }
        
        pdf.save(`ACRACS_Report_${inputs.enterpriseName.replace(/ /g, '_')}.pdf`);
    };

    return (
        <div ref={resultsRef} className="bg-white p-6 rounded-lg shadow sticky top-8">
            <ScoreGauge score={score} />
            <hr className="my-6"/>
            <ScoreBreakdownChart data={breakdown} />
            <hr className="my-6"/>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1 text-center">{t.weights.title}</h3>
              <p className="text-xs text-gray-500 text-center mb-4">{t.weights.helper}</p>
               <div className="mb-4 p-2 bg-blue-50 text-blue-800 border-l-4 border-blue-500 text-xs rounded">
                  <p>{t.weightPresetReasons[activeWeightPreset]}</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700"><span>{t.weights.financial}</span><span>{(weights.financial * 100).toFixed(0)}%</span></label>
                  <input type="range" min="0" max="1" step="0.05" name="financial" value={weights.financial} onChange={handleWeightChange} className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer" />
                </div>
                 <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700"><span>{t.weights.stability}</span><span>{(weights.stability * 100).toFixed(0)}%</span></label>
                  <input type="range" min="0" max="1" step="0.05" name="stability" value={weights.stability} onChange={handleWeightChange} className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700"><span>{t.weights.cvi}</span><span>{(weights.cvi * 100).toFixed(0)}%</span></label>
                  <input type="range" min="0" max="1" step="0.05" name="cvi" value={weights.cvi} onChange={handleWeightChange} className="w-full h-2 bg-orange-100 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700"><span>{t.weights.acs}</span><span>{(weights.acs * 100).toFixed(0)}%</span></label>
                  <input type="range" min="0" max="1" step="0.05" name="acs" value={weights.acs} onChange={handleWeightChange} className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>
            </div>
            <hr className="my-6"/>
            <div id="download-buttons" className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleDownloadCSV} className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {t.downloadCSV}
                </button>
                <button onClick={handleDownloadPDF} className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v2a1 1 0 102 0v-2zm2-3a1 1 0 011 1v5a1 1 0 11-2 0V10a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                    </svg>
                    {t.downloadPDF}
                </button>
            </div>
        </div>
    );
};