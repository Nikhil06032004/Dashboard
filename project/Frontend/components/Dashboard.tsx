import React from 'react';
import { SkillMatchChart } from './charts/SkillMatchChart';
import { ResumeScoreGauge } from './charts/ResumeScoreGauge';
import { SectionRadarChart } from './charts/SectionRadarChart';
import { KeywordBarChart } from './charts/KeywordBarChart';
import { SummaryCard } from './SummaryCard';
import { RecommendationsCard } from './RecommendationsCard';
import { useAnalysis } from '../contexts/AnalysisContext';

export const Dashboard: React.FC = () => {
  const { data } = useAnalysis();

  if (!data.analysisResults) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">No analysis results available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Section - Summary & Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SummaryCard />
        </div>
        <div>
          <ResumeScoreGauge />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillMatchChart />
        <SectionRadarChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KeywordBarChart />
        <RecommendationsCard />
      </div>
    </div>
  );
};