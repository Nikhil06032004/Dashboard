import React, { useState, useMemo } from 'react';
import { Target, TrendingUp, AlertTriangle, CheckCircle, Search, Filter, Award, BookOpen, Zap } from 'lucide-react';

// Mock data for demonstration
const mockAnalysisData = {
  analysisResults: {
    skillMatch: {
      matched: 18,
      missing: 7,
      details: {
        matched: [
          { skill: 'JavaScript', category: 'Programming', level: 'Advanced', demand: 'High' },
          { skill: 'React', category: 'Frontend', level: 'Advanced', demand: 'High' },
          { skill: 'Node.js', category: 'Backend', level: 'Intermediate', demand: 'High' },
          { skill: 'TypeScript', category: 'Programming', level: 'Intermediate', demand: 'Medium' },
          { skill: 'Python', category: 'Programming', level: 'Beginner', demand: 'High' },
          { skill: 'SQL', category: 'Database', level: 'Intermediate', demand: 'High' },
          { skill: 'Git', category: 'Tools', level: 'Advanced', demand: 'High' },
          { skill: 'AWS', category: 'Cloud', level: 'Beginner', demand: 'High' },
          { skill: 'Docker', category: 'DevOps', level: 'Intermediate', demand: 'Medium' },
          { skill: 'MongoDB', category: 'Database', level: 'Intermediate', demand: 'Medium' },
          { skill: 'CSS', category: 'Frontend', level: 'Advanced', demand: 'High' },
          { skill: 'HTML', category: 'Frontend', level: 'Advanced', demand: 'High' },
          { skill: 'REST APIs', category: 'Backend', level: 'Intermediate', demand: 'High' },
          { skill: 'GraphQL', category: 'Backend', level: 'Beginner', demand: 'Medium' },
          { skill: 'Jest', category: 'Testing', level: 'Intermediate', demand: 'Medium' },
          { skill: 'Webpack', category: 'Tools', level: 'Intermediate', demand: 'Low' },
          { skill: 'Agile', category: 'Methodology', level: 'Intermediate', demand: 'High' },
          { skill: 'Scrum', category: 'Methodology', level: 'Intermediate', demand: 'High' }
        ],
        missing: [
          { skill: 'Kubernetes', category: 'DevOps', priority: 'High', reason: 'Required for scaling' },
          { skill: 'Redis', category: 'Database', priority: 'Medium', reason: 'Caching optimization' },
          { skill: 'Microservices', category: 'Architecture', priority: 'High', reason: 'System design' },
          { skill: 'CI/CD', category: 'DevOps', priority: 'High', reason: 'Deployment automation' },
          { skill: 'Terraform', category: 'Infrastructure', priority: 'Medium', reason: 'Infrastructure as Code' },
          { skill: 'Elasticsearch', category: 'Database', priority: 'Low', reason: 'Search functionality' },
          { skill: 'Machine Learning', category: 'AI/ML', priority: 'Medium', reason: 'Data analysis' }
        ]
      }
    }
  }
};

// Mock contexts for demonstration
const useAnalysis = () => ({ data: mockAnalysisData });
const useTheme = () => ({ isDark: false });

const getLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'advanced': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20';
    case 'intermediate': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
    case 'beginner': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
    default: return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
    case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
    case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
    default: return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20';
  }
};

const getDemandColor = (demand: string) => {
  switch (demand.toLowerCase()) {
    case 'high': return 'text-purple-600 dark:text-purple-400';
    case 'medium': return 'text-blue-600 dark:text-blue-400';
    case 'low': return 'text-slate-600 dark:text-slate-400';
    default: return 'text-slate-600 dark:text-slate-400';
  }
};

export const SkillMatchChart: React.FC = () => {
  const { data } = useAnalysis();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'matched' | 'missing'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const skillData = useMemo(() => {
    if (!data.analysisResults?.skillMatch) return null;
    
    const { matched, missing, details } = data.analysisResults.skillMatch;
    const total = matched + missing;
    const matchPercentage = Math.round((matched / total) * 100);
    
    return {
      matched,
      missing,
      total,
      matchPercentage,
      details: details || { matched: [], missing: [] }
    };
  }, [data.analysisResults]);

  const filteredMatchedSkills = useMemo(() => {
    if (!skillData?.details.matched) return [];
    
    return skillData.details.matched.filter(skill => {
      const matchesSearch = skill.skill.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || skill.category.toLowerCase() === filterCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [skillData, searchTerm, filterCategory]);

  const filteredMissingSkills = useMemo(() => {
    if (!skillData?.details.missing) return [];
    
    return skillData.details.missing.filter(skill => {
      const matchesSearch = skill.skill.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || skill.category.toLowerCase() === filterCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [skillData, searchTerm, filterCategory]);

  const categories = useMemo(() => {
    if (!skillData?.details.matched) return [];
    
    const allCategories = [
      ...skillData.details.matched.map(s => s.category),
      ...skillData.details.missing.map(s => s.category)
    ];
    
    return Array.from(new Set(allCategories));
  }, [skillData]);

  if (!skillData) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-center h-64 text-slate-400">
          <div className="text-center">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No skill match data available</p>
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
            <div className="p-2 bg-indigo-500 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                Skill Match Analysis
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Resume skills vs market requirements
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {skillData.matchPercentage}%
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Match Rate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {[
              { key: 'overview', label: 'Overview', icon: TrendingUp },
              { key: 'matched', label: 'Matched Skills', icon: CheckCircle },
              { key: 'missing', label: 'Missing Skills', icon: AlertTriangle }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          
          {(activeTab === 'matched' || activeTab === 'missing') && (
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-sm border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Donut Chart */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="20"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="20"
                    strokeDasharray={`${(skillData.matchPercentage / 100) * 502.6} 502.6`}
                    strokeDashoffset="125.6"
                    transform="rotate(-90 100 100)"
                    className="transition-all duration-1000"
                  />
                  <text
                    x="100"
                    y="95"
                    textAnchor="middle"
                    className="text-3xl font-bold fill-slate-800 dark:fill-white"
                  >
                    {skillData.matchPercentage}%
                  </text>
                  <text
                    x="100"
                    y="115"
                    textAnchor="middle"
                    className="text-sm fill-slate-600 dark:fill-slate-400"
                  >
                    Match Rate
                  </text>
                </svg>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {skillData.matched}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Matched Skills
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {skillData.missing}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Missing Skills
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {skillData.total}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Total Skills
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-slate-800 dark:text-white mb-2 flex items-center">
                <Award className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                Skill Development Priority
              </h4>
              <div className="space-y-2">
                {skillData.details.missing.slice(0, 3).map((skill, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getPriorityColor(skill.priority)}`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 dark:text-white">{skill.skill}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">{skill.reason}</div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(skill.priority)}`}>
                      {skill.priority}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Matched Skills Tab */}
        {activeTab === 'matched' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-800 dark:text-white">
                Matched Skills ({filteredMatchedSkills.length})
              </h4>
            </div>
            
            <div className="grid gap-3">
              {filteredMatchedSkills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <div className="font-medium text-slate-800 dark:text-white">{skill.skill}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{skill.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                      {skill.level}
                    </div>
                    <div className={`text-xs font-medium ${getDemandColor(skill.demand)}`}>
                      {skill.demand} demand
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills Tab */}
        {activeTab === 'missing' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-800 dark:text-white">
                Missing Skills ({filteredMissingSkills.length})
              </h4>
            </div>
            
            <div className="grid gap-3">
              {filteredMissingSkills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <div>
                      <div className="font-medium text-slate-800 dark:text-white">{skill.skill}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{skill.reason}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(skill.priority)}`}>
                      {skill.priority}
                    </div>
                    <BookOpen className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
            
            {filteredMissingSkills.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h5 className="font-semibold text-blue-800 dark:text-blue-200">Learning Recommendation</h5>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Focus on high-priority skills first. Consider online courses, certifications, or hands-on projects to build these competencies.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Demo component
export default function SkillMatchDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Enhanced Skill Match Analysis
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Comprehensive skill assessment with detailed recommendations
          </p>
        </div>
        
        <SkillMatchChart />
      </div>
    </div>
  );
}