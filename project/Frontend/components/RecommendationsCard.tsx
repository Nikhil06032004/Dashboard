import React from 'react';
import { Lightbulb, CheckCircle } from 'lucide-react';
import { useAnalysis } from '../contexts/AnalysisContext';

export const RecommendationsCard: React.FC = () => {
  const { data } = useAnalysis();

  if (!data.analysisResults) return null;

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
          Recommendations
        </h3>
      </div>
      
      <div className="space-y-3">
        {data.analysisResults.recommendations.map((recommendation, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {recommendation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};