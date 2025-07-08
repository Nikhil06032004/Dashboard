import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AnalysisData {
  fileName: string;
  fileSize: number;
  analysisResults: {
    overallScore: number;
    skillMatch: { matched: number; missing: number };
    sections: { [key: string]: number };
    keywords: { [key: string]: number };
    summary: string;
    recommendations: string[];
  } | null;
  jobDescription: string;
  isAnalyzing: boolean;
}

interface AnalysisContextType {
  data: AnalysisData;
  updateData: (updates: Partial<AnalysisData>) => void;
  resetAnalysis: () => void;
}

const initialData: AnalysisData = {
  fileName: '',
  fileSize: 0,
  analysisResults: null,
  jobDescription: '',
  isAnalyzing: false,
};

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AnalysisData>(initialData);

  const updateData = (updates: Partial<AnalysisData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const resetAnalysis = () => {
    setData(initialData);
  };

  return (
    <AnalysisContext.Provider value={{ data, updateData, resetAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
};