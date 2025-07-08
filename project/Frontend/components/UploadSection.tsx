import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { useAnalysis } from '../contexts/AnalysisContext';
import { analyzeResume } from '../services/api';

interface UploadSectionProps {
  onStepChange: (step: number) => void;
  onAnalysisComplete: () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onStepChange, onAnalysisComplete }) => {
  const { data, updateData } = useAnalysis();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        setError('Please upload a valid PDF, DOC, or DOCX file under 10MB');
        return;
      }
      
      const file = acceptedFiles[0];
      if (file) {
        setUploadedFile(file);
        updateData({ fileName: file.name, fileSize: file.size });
        setError('');
      }
    },
  });

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      setError('Please upload a resume first');
      return;
    }

    try {
      onStepChange(1);
      updateData({ isAnalyzing: true, jobDescription });

      const results = await analyzeResume(uploadedFile, jobDescription);
      
      updateData({ 
        analysisResults: results,
        isAnalyzing: false 
      });
      
      onStepChange(2);
      onAnalysisComplete();
    } catch (err) {
      setError('Analysis failed. Please try again.');
      updateData({ isAnalyzing: false });
      onStepChange(0);
    }
  };

  if (data.isAnalyzing) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              Analyzing Your Resume
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Our AI is processing your resume and extracting insights...
            </p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* File Upload Section */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
            Upload Your Resume
          </h2>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : uploadedFile
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              {uploadedFile ? (
                <>
                  <FileText className="w-12 h-12 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      PDF, DOC, DOCX up to 10MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
            </div>
          )}
        </div>

        {/* Job Description Section */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
            Job Description (Optional)
          </h2>
          
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here to get a tailored analysis..."
            className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
          />
          
          <div className="mt-6">
            <button
              onClick={handleAnalyze}
              disabled={!uploadedFile}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {uploadedFile ? 'Analyze Resume' : 'Upload Resume First'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};