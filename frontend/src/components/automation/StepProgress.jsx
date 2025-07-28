import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

const StepProgress = ({ currentStep, totalSteps = 4 }) => {
  const steps = [
    { id: 1, label: 'Basic Info', description: 'Name & Description' },
    { id: 2, label: 'Trigger & Action', description: 'What triggers & what happens' },
    { id: 3, label: 'Content & Conditions', description: 'Select posts & set conditions' },
    { id: 4, label: 'Response Message', description: 'What to send or do' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isCurrent 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                
                {/* Step Label */}
                <div className="mt-2 text-center">
                  <p className={`text-xs font-medium transition-colors duration-300 ${
                    isCompleted 
                      ? 'text-green-600' 
                      : isCurrent 
                      ? 'text-blue-600' 
                      : 'text-gray-400'
                  }`}>
                    {step.label}
                  </p>
                  <p className={`text-xs transition-colors duration-300 ${
                    isCompleted 
                      ? 'text-green-500' 
                      : isCurrent 
                      ? 'text-blue-500' 
                      : 'text-gray-400'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">Step {currentStep} of {totalSteps}</span>
          <span className="text-xs text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
      </div>
    </div>
  );
};

export default StepProgress; 