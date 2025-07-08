import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { Dashboard } from './components/Dashboard';
import { ProgressTracker } from './components/ProgressTracker';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnalysisProvider } from './contexts/AnalysisContext';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  return (
    <ThemeProvider>
      <AnalysisProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-all duration-300">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <ProgressTracker currentStep={currentStep} />
            {!analysisComplete ? (
              <UploadSection 
                onStepChange={setCurrentStep}
                onAnalysisComplete={() => setAnalysisComplete(true)}
              />
            ) : (
              <Dashboard />
            )}
          </main>
        </div>
      </AnalysisProvider>
    </ThemeProvider>
  );
}

export default App;