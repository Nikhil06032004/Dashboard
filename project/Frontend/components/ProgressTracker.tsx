import React from 'react';
import { Check, Upload, Brain, BarChart3, } from 'lucide-react';

interface ProgressTrackerProps {
  currentStep: number;
}

const steps = [
  { 
    id: 0, 
    title: 'Upload Resume', 
    subtitle: 'Upload your document',
    icon: Upload 
  },
  { 
    id: 1, 
    title: 'AI Analysis', 
    subtitle: 'Processing your data',
    icon: Brain 
  },
  { 
    id: 2, 
    title: 'View Results', 
    subtitle: 'Review insights',
    icon: BarChart3 
  },
];

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStep }) => {
  return (
    <div className="mb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Resume Analysis Progress
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-8">
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700"></div>
          <div 
            className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-700 ease-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
          
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isActive = currentStep >= step.id;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const Icon = step.icon;
              
              return (
                <div key={step.id} className="flex flex-col items-center group">
                  {/* Step Circle */}
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 transform ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 scale-105'
                          : isCurrent
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105 animate-pulse'
                          : isActive
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-white dark:bg-slate-800 text-slate-400 border-2 border-slate-200 dark:border-slate-700'
                      } group-hover:scale-110`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    
                    {/* Pulse animation for current step */}
                    {isCurrent && (
                      <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20"></div>
                    )}
                  </div>
                  
                  {/* Step Info */}
                  <div className="mt-4 text-center max-w-24">
                    <h3
                      className={`text-sm font-semibold transition-colors duration-300 ${
                        isActive
                          ? 'text-slate-800 dark:text-white'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-xs mt-1 transition-colors duration-300 ${
                        isActive
                          ? 'text-slate-600 dark:text-slate-300'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {step.subtitle}
                    </p>
                  </div>
                  
                  {/* Status Badge */}
                  {isCompleted && (
                    <div className="mt-2 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-full">
                      Completed
                    </div>
                  )}
                  {isCurrent && (
                    <div className="mt-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                      In Progress
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step Info */}
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {currentStep < steps.length 
                ? `Currently: ${steps[currentStep].title}`
                : 'Process Complete'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo component to showcase the progress tracker
export default function ProgressDemo() {
  const [currentStep, setCurrentStep] = React.useState(0);
  
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  
  const resetSteps = () => {
    setCurrentStep(0);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-6xl mx-auto">
        <ProgressTracker currentStep={currentStep} />
        
        {/* Demo Controls */}
        <div className="text-center space-x-4">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-all duration-300 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium transition-all duration-300 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Step
          </button>
          <button
            onClick={resetSteps}
            className="px-6 py-2 bg-slate-500 text-white rounded-lg font-medium transition-all duration-300 hover:bg-slate-600"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}