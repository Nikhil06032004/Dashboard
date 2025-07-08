import React, { useState, useMemo } from 'react';
import { Radar, Target, TrendingUp, Award, AlertCircle, CheckCircle, Settings, Download } from 'lucide-react';

// Mock data for demonstration
const mockAnalysisData = {
  analysisResults: {
    sections: {
      'Contact Information': 95,
      'Professional Summary': 88,
      'Work Experience': 92,
      'Education': 85,
      'Skills': 78,
      'Projects': 65,
      'Certifications': 45,
      'Awards': 30
    }
  }
};

// Mock contexts for demonstration
const useAnalysis = () => ({ data: mockAnalysisData });
const useTheme = () => ({ isDark: false });

interface SectionData {
  name: string;
  score: number;
  status: 'excellent' | 'good' | 'needs-improvement' | 'missing';
  recommendations: string[];
}

const getScoreStatus = (score: number) => {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 40) return 'needs-improvement';
  return 'missing';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'text-emerald-600 dark:text-emerald-400';
    case 'good': return 'text-blue-600 dark:text-blue-400';
    case 'needs-improvement': return 'text-yellow-600 dark:text-yellow-400';
    case 'missing': return 'text-red-600 dark:text-red-400';
    default: return 'text-slate-600 dark:text-slate-400';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'excellent': return <CheckCircle className="w-4 h-4" />;
    case 'good': return <CheckCircle className="w-4 h-4" />;
    case 'needs-improvement': return <AlertCircle className="w-4 h-4" />;
    case 'missing': return <AlertCircle className="w-4 h-4" />;
    default: return <Target className="w-4 h-4" />;
  }
};

const getRecommendations = (name: string, score: number): string[] => {
  const recommendations = {
    'Contact Information': score < 90 ? ['Add LinkedIn profile', 'Include portfolio URL', 'Verify phone format'] : [],
    'Professional Summary': score < 90 ? ['Make it more compelling', 'Add key achievements', 'Optimize for ATS'] : [],
    'Work Experience': score < 90 ? ['Add quantifiable results', 'Include action verbs', 'Show career progression'] : [],
    'Education': score < 90 ? ['Add relevant coursework', 'Include GPA if strong', 'Add academic achievements'] : [],
    'Skills': score < 90 ? ['Add technical skills', 'Include soft skills', 'Organize by categories'] : [],
    'Projects': score < 90 ? ['Add more projects', 'Include tech stack', 'Add project outcomes'] : [],
    'Certifications': score < 90 ? ['Add industry certifications', 'Include completion dates', 'Add certification IDs'] : [],
    'Awards': score < 90 ? ['Add professional awards', 'Include recognition dates', 'Add award descriptions'] : []
  };
  
  return recommendations[name as keyof typeof recommendations] || [];
};

export const SectionRadarChart: React.FC = () => {
  const { data } = useAnalysis();
  const { isDark } = useTheme();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const processedSections = useMemo(() => {
    if (!data.analysisResults) return [];
    
    return Object.entries(data.analysisResults.sections).map(([name, score]) => ({
      name,
      score,
      status: getScoreStatus(score),
      recommendations: getRecommendations(name, score)
    }));
  }, [data.analysisResults]);

  const averageScore = useMemo(() => {
    if (processedSections.length === 0) return 0;
    return Math.round(processedSections.reduce((sum, section) => sum + section.score, 0) / processedSections.length);
  }, [processedSections]);

  const statusCounts = useMemo(() => {
    const counts = { excellent: 0, good: 0, 'needs-improvement': 0, missing: 0 };
    processedSections.forEach(section => {
      counts[section.status]++;
    });
    return counts;
  }, [processedSections]);

  if (!data.analysisResults) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-center h-64 text-slate-400">
          <div className="text-center">
            <Radar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No section analysis data available</p>
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
            <div className="p-2 bg-purple-500 rounded-lg">
              <Radar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                Section Completeness Analysis
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Resume section quality and completeness scores
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <Target className="w-4 h-4" />
              <span>Avg: {averageScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                showDetails 
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>{showDetails ? 'Hide Details' : 'Show Details'}</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Radar Chart Visualization */}
        <div className="mb-6">
          <div className="relative bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
            <svg viewBox="0 0 300 300" className="w-full h-64 max-w-sm mx-auto">
              {/* Background circles */}
              {[20, 40, 60, 80, 100].map((radius, i) => (
                <circle
                  key={i}
                  cx="150"
                  cy="150"
                  r={radius}
                  fill="none"
                  stroke={isDark ? '#475569' : '#cbd5e1'}
                  strokeWidth="1"
                  opacity={0.3}
                />
              ))}
              
              {/* Axis lines */}
              {processedSections.map((_, i) => {
                const angle = (i * 2 * Math.PI) / processedSections.length - Math.PI / 2;
                const x = 150 + Math.cos(angle) * 100;
                const y = 150 + Math.sin(angle) * 100;
                return (
                  <line
                    key={i}
                    x1="150"
                    y1="150"
                    x2={x}
                    y2={y}
                    stroke={isDark ? '#475569' : '#cbd5e1'}
                    strokeWidth="1"
                    opacity={0.5}
                  />
                );
              })}
              
              {/* Data polygon */}
              <polygon
                points={processedSections.map((section, i) => {
                  const angle = (i * 2 * Math.PI) / processedSections.length - Math.PI / 2;
                  const radius = section.score;
                  const x = 150 + Math.cos(angle) * radius;
                  const y = 150 + Math.sin(angle) * radius;
                  return `${x},${y}`;
                }).join(' ')}
                fill="rgba(139, 92, 246, 0.2)"
                stroke="#8b5cf6"
                strokeWidth="2"
              />
              
              {/* Data points */}
              {processedSections.map((section, i) => {
                const angle = (i * 2 * Math.PI) / processedSections.length - Math.PI / 2;
                const radius = section.score;
                const x = 150 + Math.cos(angle) * radius;
                const y = 150 + Math.sin(angle) * radius;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#8b5cf6"
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-6 transition-all"
                    onClick={() => setSelectedSection(section.name)}
                  />
                );
              })}
              
              {/* Section labels */}
              {processedSections.map((section, i) => {
                const angle = (i * 2 * Math.PI) / processedSections.length - Math.PI / 2;
                const labelRadius = 115;
                const x = 150 + Math.cos(angle) * labelRadius;
                const y = 150 + Math.sin(angle) * labelRadius;
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-medium fill-slate-700 dark:fill-slate-300"
                  >
                    {section.name.split(' ')[0]}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Section Details */}
        {showDetails && (
          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Section Breakdown
            </h4>
            {processedSections.map((section) => (
              <div
                key={section.name}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedSection === section.name
                    ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-600'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                onClick={() => setSelectedSection(selectedSection === section.name ? null : section.name)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`${getStatusColor(section.status)}`}>
                      {getStatusIcon(section.status)}
                    </div>
                    <div>
                      <span className="font-medium text-slate-800 dark:text-white">
                        {section.name}
                      </span>
                      <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                        {section.status.replace('-', ' ')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-800 dark:text-white">
                        {section.score}%
                      </div>
                    </div>
                    <div className="w-12 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          section.status === 'excellent' ? 'bg-emerald-500' :
                          section.status === 'good' ? 'bg-blue-500' :
                          section.status === 'needs-improvement' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${section.score}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                {selectedSection === section.name && section.recommendations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Recommendations:
                    </div>
                    <ul className="space-y-1">
                      {section.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start space-x-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {statusCounts.excellent}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Excellent
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {statusCounts.good}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Good
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {statusCounts['needs-improvement']}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Needs Work
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-red-600 dark:text-red-400">
              {statusCounts.missing}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Missing
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo component
export default function RadarChartDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Enhanced Section Radar Analysis
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Comprehensive resume section completeness visualization
          </p>
        </div>
        
        <SectionRadarChart />
      </div>
    </div>
  );
}