import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Filter, Download, RefreshCw } from 'lucide-react';

// Mock data for demonstration
const mockAnalysisData = {
  analysisResults: {
    keywords: {
      'JavaScript': 28,
      'React': 24,
      'Node.js': 18,
      'TypeScript': 16,
      'Python': 14,
      'AWS': 12,
      'Docker': 10,
      'MongoDB': 8,
      'GraphQL': 6,
      'Redis': 5,
      'PostgreSQL': 4,
      'Express': 3,
      'Vue.js': 2,
      'Angular': 1
    }
  }
};

// Mock contexts for demonstration
const useAnalysis = () => ({ data: mockAnalysisData });
const useTheme = () => ({ isDark: false });

interface KeywordData {
  keyword: string;
  count: number;
  percentage: number;
}

export const KeywordBarChart: React.FC = () => {
  const { data } = useAnalysis();
  const { isDark } = useTheme();
  const [showCount, setShowCount] = useState(10);
  const [sortBy, setSortBy] = useState<'count' | 'alphabetical'>('count');
  
  const processedKeywords = useMemo(() => {
    if (!data.analysisResults) return [];
    
    const entries = Object.entries(data.analysisResults.keywords);
    const totalCount = entries.reduce((sum, [, count]) => sum + count, 0);
    
    let sortedEntries = [...entries];
    
    if (sortBy === 'count') {
      sortedEntries.sort(([, a], [, b]) => b - a);
    } else {
      sortedEntries.sort(([a], [b]) => a.localeCompare(b));
    }
    
    return sortedEntries
      .slice(0, showCount)
      .map(([keyword, count]) => ({
        keyword,
        count,
        percentage: Math.round((count / totalCount) * 100)
      }));
  }, [data.analysisResults, showCount, sortBy]);

  const maxCount = Math.max(...processedKeywords.map(k => k.count));
  
  if (!data.analysisResults) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-center h-64 text-slate-400">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No analysis data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-750">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                Top Keywords Analysis
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Most frequently mentioned skills and technologies
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <TrendingUp className="w-4 h-4" />
              <span>{processedKeywords.length} keywords</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'count' | 'alphabetical')}
                className="text-sm border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                <option value="count">Sort by Frequency</option>
                <option value="alphabetical">Sort Alphabetically</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Show:</span>
              <select
                value={showCount}
                onChange={(e) => setShowCount(Number(e.target.value))}
                className="text-sm border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                <option value={5}>Top 5</option>
                <option value={10}>Top 10</option>
                <option value={15}>Top 15</option>
                <option value={20}>Top 20</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-6">
        <div className="space-y-4">
          {processedKeywords.map((item, index) => (
            <div key={item.keyword} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-amber-600' : 
                    'bg-slate-400'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium text-slate-800 dark:text-white">
                    {item.keyword}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {item.percentage}%
                  </span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-white min-w-8">
                    {item.count}
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>
                
                {/* Hover tooltip */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 dark:bg-slate-700 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  {item.keyword}: {item.count} mentions
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800 dark:border-t-slate-700"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {processedKeywords.length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Keywords Shown
              </div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {processedKeywords.reduce((sum, k) => sum + k.count, 0)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Total Mentions
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {processedKeywords.length > 0 ? Math.round(processedKeywords.reduce((sum, k) => sum + k.count, 0) / processedKeywords.length) : 0}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Avg. per Keyword
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo component
export default function KeywordChartDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Enhanced Keyword Analysis
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Professional visualization of resume keywords with interactive controls
          </p>
        </div>
        
        <KeywordBarChart />
      </div>
    </div>
  );
}