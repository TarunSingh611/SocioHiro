import React from 'react';

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8 sm:h-12 sm:w-12',
    large: 'h-12 w-12 sm:h-16 sm:w-16'
  };

  return (
    <div className="flex items-center justify-center h-64">
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner; 