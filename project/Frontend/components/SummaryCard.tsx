import React from 'react';
import { FileText, RefreshCw } from 'lucide-react';
import { useAnalysis } from '../contexts/AnalysisContext';

export const SummaryCard: React.FC = () => {
  const { data, resetAnalysis } = useAnalysis();

  if (!data.analysisResults) return null;

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
              Resume Summary
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {data.fileName}
            </p>
          </div>
        </div>
        <button
          onClick={resetAnalysis}
          className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          title="Analyze new resume"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
          <h4 className="font-medium text-slate-800 dark:text-white mb-2">AI Generated Summary</h4>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {data.analysisResults.summary}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.analysisResults.skillMatch.matched}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Skills Matched</p>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data.analysisResults.skillMatch.missing}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Skills Missing</p>
          </div>
        </div>
      </div>
    </div>
  );
};