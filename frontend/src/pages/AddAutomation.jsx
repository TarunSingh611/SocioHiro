import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useAddAutomation } from '../hooks/useAddAutomation';
import StepProgress from '../components/automation/StepProgress';
import BasicInfoStep from '../components/automation/BasicInfoStep';
import TriggerActionStep from '../components/automation/TriggerActionStep';
import ContentConditionsStep from '../components/automation/ContentConditionsStep';
import ResponseMessageStep from '../components/automation/ResponseMessageStep';

const AddAutomation = () => {
  const {
    content,
    selectedContent,
    currentStep,
    loading,
    error,
    formData,
    setSelectedContent,
    setFormData,
    nextStep,
    prevStep,
    handleSubmit,
    isStepValid,
    getStepValidationMessage
  } = useAddAutomation();
  
  if (loading && currentStep === 1) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your content...</p>
        </div>
      </div>
    );
  }

  if (error && currentStep === 1) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Error loading content: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Automation</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm">
            Set up automated responses for your Instagram interactions
          </p>
        </div>
        <Link
          to="/automation"
          className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeftIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-2" />
          Back to Automation
        </Link>
      </div>

      {/* Progress Indicator */}
      <StepProgress currentStep={currentStep} />

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-sm font-medium text-red-800">Please fix the following:</span>
          </div>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6 sm:p-8">
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <BasicInfoStep formData={formData} setFormData={setFormData} />
          )}
          
          {currentStep === 2 && (
            <TriggerActionStep formData={formData} setFormData={setFormData} />
          )}
          
          {currentStep === 3 && (
            <ContentConditionsStep 
              formData={formData} 
              setFormData={setFormData}
              content={content}
              selectedContent={selectedContent}
              setSelectedContent={setSelectedContent}
            />
          )}
          
          {currentStep === 4 && (
            <ResponseMessageStep formData={formData} setFormData={setFormData} />
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !isStepValid(currentStep)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Automation'
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Automation Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="text-gray-600">
              Name: <span className="font-medium text-gray-900">{formData.name || 'Not set'}</span>
            </p>
            <p className="text-gray-600">
              Trigger: <span className="font-medium text-gray-900 capitalize">{formData.triggerType || 'Not set'}</span>
            </p>
            <p className="text-gray-600">
              Action: <span className="font-medium text-gray-900 capitalize">{formData.actionType?.replace('_', ' ') || 'Not set'}</span>
            </p>
            <p className="text-gray-600">
              Status: <span className={`font-medium ${formData.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">
              Content: <span className="font-medium text-gray-900">
                {selectedContent ? `Specific post (${selectedContent.instagramId})` : 'All content'}
              </span>
            </p>
            <p className="text-gray-600">
              Keywords: <span className="font-medium text-gray-900">
                {formData.keywords ? formData.keywords.split(',').length : 0} keywords
              </span>
            </p>
            <p className="text-gray-600">
              Rate Limit: <span className="font-medium text-gray-900">
                {formData.conditions.maxExecutionsPerDay || 10}/day, {formData.cooldownMinutes || 5}min cooldown
              </span>
            </p>
            <p className="text-gray-600">
              Message: <span className="font-medium text-gray-900">
                {formData.responseMessage ? `${formData.responseMessage.length} characters` : 'Not set'}
              </span>
            </p>
          </div>
        </div>

        {/* Advanced Conditions Summary */}
        {(formData.conditions.timeOfDay?.start || formData.conditions.daysOfWeek?.length > 0) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Advanced Conditions</h4>
            <div className="text-xs text-gray-600 space-y-1">
              {formData.conditions.timeOfDay?.start && formData.conditions.timeOfDay?.end && (
                <p>• Time window: {formData.conditions.timeOfDay.start} - {formData.conditions.timeOfDay.end}</p>
              )}
              {formData.conditions.daysOfWeek?.length > 0 && (
                <p>• Days: {formData.conditions.daysOfWeek.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}</p>
              )}
              {formData.conditions.requireVerifiedUser && (
                <p>• Only verified users</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAutomation; 