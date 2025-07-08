import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useAnalysis } from '../../contexts/AnalysisContext';
import { useTheme } from '../../contexts/ThemeContext';

interface ScoreRangeConfig {
  min: number;
  max: number;
  color: string;
  label: string;
}

const SCORE_RANGES: ScoreRangeConfig[] = [
  { min: 0, max: 40, color: '#ef4444', label: 'Poor' },
  { min: 40, max: 70, color: '#f97316', label: 'Fair' },
  { min: 70, max: 85, color: '#eab308', label: 'Good' },
  { min: 85, max: 100, color: '#10b981', label: 'Excellent' }
];

export const ResumeScoreGauge: React.FC = () => {
  const { data } = useAnalysis();
  const { isDark } = useTheme();

  // Memoize the score and range calculation for performance
  const scoreData = useMemo(() => {
    if (!data?.analysisResults?.overallScore) return null;
    
    const score = Math.round(data.analysisResults.overallScore);
    const range = SCORE_RANGES.find(r => score >= r.min && score <= r.max);
    
    return {
      score,
      range: range || SCORE_RANGES[0],
      isValid: score >= 0 && score <= 100
    };
  }, [data?.analysisResults?.overallScore]);

  // Memoize the ECharts configuration
  const chartOption = useMemo(() => {
    if (!scoreData?.isValid) return null;

    const baseColors = {
      text: isDark ? '#ffffff' : '#1e293b',
      subText: isDark ? '#cbd5e1' : '#64748b',
      border: isDark ? '#475569' : '#cbd5e1',
      background: isDark ? '#0f172a' : '#f8fafc'
    };

    return {
      title: {
        text: 'Resume Score',
        subtext: `Performance: ${scoreData.range.label}`,
        left: 'center',
        top: 10,
        textStyle: {
          color: baseColors.text,
          fontSize: 16,
          fontWeight: 600,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        subtextStyle: {
          color: baseColors.subText,
          fontSize: 11,
          fontWeight: 500,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        }
      },
      series: [
        {
          type: 'gauge',
          center: ['50%', '55%'],
          radius: '70%',
          startAngle: 200,
          endAngle: -40,
          min: 0,
          max: 100,
          splitNumber: 10,
          itemStyle: {
            color: scoreData.range.color
          },
          progress: {
            show: true,
            width: 16,
            roundCap: true,
            itemStyle: {
              color: scoreData.range.color
            }
          },
          pointer: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 16,
              color: [
                [0.4, '#ef4444'],
                [0.7, '#f97316'],
                [0.85, '#eab308'],
                [1, '#10b981']
              ],
              opacity: 0.3
            }
          },
          axisTick: {
            distance: -25,
            splitNumber: 5,
            lineStyle: {
              width: 1,
              color: baseColors.border
            }
          },
          splitLine: {
            distance: -30,
            length: 8,
            lineStyle: {
              width: 2,
              color: baseColors.border
            }
          },
          axisLabel: {
            distance: -5,
            color: baseColors.subText,
            fontSize: 10,
            fontWeight: 500,
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
          },
          anchor: {
            show: false
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            width: '60%',
            lineHeight: 40,
            borderRadius: 8,
            offsetCenter: [0, '10%'],
            fontSize: 28,
            fontWeight: 700,
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            formatter: (value: number) => `${Math.round(value)}%`,
            color: baseColors.text,
            backgroundColor: 'transparent',
            borderWidth: 0
          },
          data: [
            {
              value: scoreData.score,
              name: 'Score'
            }
          ]
        }
      ]
    };
  }, [scoreData, isDark]);

  // Early return if no data
  if (!data?.analysisResults?.overallScore || !scoreData?.isValid) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              No analysis data available
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
              Upload and analyze your resume to see the score
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
      <div className="relative">
        <ReactECharts 
          option={chartOption} 
          style={{ height: '280px' }} 
          opts={{
            renderer: 'canvas',
            useDirtyRect: false
          }}
        />
      </div>
      
      {/* Score breakdown indicators */}
      <div className="flex justify-center items-center space-x-6 mt-4">
        {SCORE_RANGES.map((range, index) => (
          <div 
            key={index}
            className={`flex items-center space-x-2 transition-all duration-200 ${
              scoreData.range.label === range.label 
                ? 'opacity-100 scale-105' 
                : 'opacity-50'
            }`}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: range.color }}
            />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {range.label}
            </span>
          </div>
        ))}
      </div>
      
      {/* Additional context */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            Score Range: {scoreData.range.min} - {scoreData.range.max}
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            Last Updated: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};