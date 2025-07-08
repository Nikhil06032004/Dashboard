// Mock API service to simulate backend analysis
// In production, this would make actual HTTP requests to Flask backend

export interface AnalysisResults {
  overallScore: number;
  skillMatch: { matched: number; missing: number };
  sections: { [key: string]: number };
  keywords: { [key: string]: number };
  summary: string;
  recommendations: string[];
}

export const analyzeResume = async (file: File, jobDescription: string): Promise<AnalysisResults> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Mock analysis results based on file type and job description
  const hasJobDescription = jobDescription.trim().length > 0;
  
  const mockResults: AnalysisResults = {
    overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
    skillMatch: {
      matched: hasJobDescription ? Math.floor(Math.random() * 5) + 8 : Math.floor(Math.random() * 3) + 5,
      missing: hasJobDescription ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 2) + 1,
    },
    sections: {
      'Contact Info': Math.floor(Math.random() * 20) + 80,
      'Summary': Math.floor(Math.random() * 30) + 60,
      'Experience': Math.floor(Math.random() * 25) + 75,
      'Education': Math.floor(Math.random() * 20) + 80,
      'Skills': Math.floor(Math.random() * 30) + 70,
      'Projects': Math.floor(Math.random() * 40) + 50,
    },
    keywords: {
      'JavaScript': Math.floor(Math.random() * 8) + 5,
      'React': Math.floor(Math.random() * 6) + 4,
      'Python': Math.floor(Math.random() * 7) + 3,
      'SQL': Math.floor(Math.random() * 5) + 2,
      'Git': Math.floor(Math.random() * 4) + 3,
      'AWS': Math.floor(Math.random() * 3) + 2,
      'Docker': Math.floor(Math.random() * 4) + 2,
      'Node.js': Math.floor(Math.random() * 5) + 3,
      'MongoDB': Math.floor(Math.random() * 3) + 2,
      'API': Math.floor(Math.random() * 6) + 4,
    },
    summary: `Professional ${file.name.includes('senior') ? 'senior' : 'mid-level'} developer with strong technical skills and proven experience in software development. Demonstrates expertise in modern technologies and shows good potential for ${hasJobDescription ? 'the targeted role' : 'various technical positions'}. Resume structure is well-organized with clear sections highlighting relevant experience and skills.`,
    recommendations: [
      hasJobDescription 
        ? 'Add more specific keywords from the job description to improve ATS compatibility'
        : 'Consider adding a professional summary section to better highlight your value proposition',
      'Include quantifiable achievements and metrics to demonstrate impact',
      'Add more relevant technical skills mentioned in current industry trends',
      'Consider adding a projects section to showcase practical application of skills',
      'Optimize formatting for better readability and professional appearance',
    ],
  };

  return mockResults;
};

// Flask backend endpoints (for reference)
export const mockBackendEndpoints = {
  analyze: '/api/analyze',
  jobMatch: '/api/job-match',
  summary: '/api/summary',
};
// src/services/config.ts
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const MAX_UPLOAD_SIZE_MB = import.meta.env.VITE_MAX_UPLOAD_SIZE_MB || 10;
export const ENABLE_SUMMARY = import.meta.env.VITE_FEATURE_SUMMARY_GEN === "true";
