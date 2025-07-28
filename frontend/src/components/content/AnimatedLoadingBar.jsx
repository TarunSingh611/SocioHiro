import React, { useState, useEffect, useRef } from 'react';

const AnimatedLoadingBar = ({ 
  duration = 3000, 
  onComplete, 
  showProgress = true,
  className = "" 
}) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState('medium');
  const startTime = useRef(Date.now());
  const animationRef = useRef(null);
  const networkSpeedRef = useRef('medium');

  // Detect network speed using navigator.connection if available
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      const updateNetworkSpeed = () => {
        let speed = 'medium';
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          speed = 'slow';
        } else if (connection.effectiveType === '3g') {
          speed = 'medium';
        } else {
          speed = 'fast';
        }
        setNetworkSpeed(speed);
        networkSpeedRef.current = speed;
      };
      
      updateNetworkSpeed();
      connection.addEventListener('change', updateNetworkSpeed);
      
      return () => {
        connection.removeEventListener('change', updateNetworkSpeed);
      };
    }
  }, []);

  useEffect(() => {
    // Adjust duration based on network speed
    const adjustedDuration = networkSpeedRef.current === 'slow' ? duration * 1.5 : 
                           networkSpeedRef.current === 'fast' ? duration * 0.7 : 
                           duration;

    const animate = () => {
      const elapsed = Date.now() - startTime.current;
      const newProgress = Math.min((elapsed / adjustedDuration) * 100, 100);
      
      setProgress(newProgress);
      
      if (newProgress < 100) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsComplete(true);
        onComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [duration, onComplete]);

  // Calculate network speed - use detected speed or fallback to simulation
  const getNetworkSpeed = () => {
    // If we have detected network speed, use it
    if (networkSpeedRef.current !== 'medium') {
      return networkSpeedRef.current;
    }
    
    // Otherwise simulate based on progress and time elapsed
    const elapsed = Date.now() - startTime.current;
    const speed = elapsed / duration;
    
    if (speed < 0.3) return 'slow';
    if (speed < 0.7) return 'medium';
    return 'fast';
  };

  const getSpeedColor = () => {
    const speed = getNetworkSpeed();
    switch (speed) {
      case 'slow': return 'bg-yellow-500';
      case 'medium': return 'bg-blue-500';
      case 'fast': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const getSpeedText = () => {
    const speed = getNetworkSpeed();
    switch (speed) {
      case 'slow': return 'Slow connection detected';
      case 'medium': return 'Moderate connection';
      case 'fast': return 'Fast connection';
      default: return 'Connecting...';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-300 ease-out ${getSpeedColor()} relative overflow-hidden`}
          style={{ 
            width: `${progress}%`,
            transition: 'width 0.3s ease-out'
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 loading-bar-shimmer" />
        </div>
      </div>

      {/* Progress Text */}
      {showProgress && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {getSpeedText()}
          </span>
          <span className="text-gray-500 font-medium">
            {Math.round(progress)}%
          </span>
        </div>
      )}

      {/* Loading Stages */}
      <div className="mt-4 space-y-2">
        <div className={`flex items-center text-sm transition-opacity duration-300 ${
          progress >= 10 ? 'opacity-100' : 'opacity-50'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-3 ${
            progress >= 10 ? 'bg-green-500 loading-stage-complete' : 'bg-gray-300'
          }`} />
          <span className={progress >= 10 ? 'text-gray-700' : 'text-gray-400'}>
            Connecting to Instagram API
          </span>
        </div>

        <div className={`flex items-center text-sm transition-opacity duration-300 ${
          progress >= 30 ? 'opacity-100' : 'opacity-50'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-3 ${
            progress >= 30 ? 'bg-green-500 loading-stage-complete' : 'bg-gray-300'
          }`} />
          <span className={progress >= 30 ? 'text-gray-700' : 'text-gray-400'}>
            Fetching your content data
          </span>
        </div>

        <div className={`flex items-center text-sm transition-opacity duration-300 ${
          progress >= 60 ? 'opacity-100' : 'opacity-50'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-3 ${
            progress >= 60 ? 'bg-green-500 loading-stage-complete' : 'bg-gray-300'
          }`} />
          <span className={progress >= 60 ? 'text-gray-700' : 'text-gray-400'}>
            Processing media and insights
          </span>
        </div>

        <div className={`flex items-center text-sm transition-opacity duration-300 ${
          progress >= 90 ? 'opacity-100' : 'opacity-50'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-3 ${
            progress >= 90 ? 'bg-green-500 loading-stage-complete' : 'bg-gray-300'
          }`} />
          <span className={progress >= 90 ? 'text-gray-700' : 'text-gray-400'}>
            Finalizing your content dashboard
          </span>
        </div>
      </div>

      {/* Completion Message */}
      {isComplete && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse" />
            <span className="text-sm text-green-700 font-medium">
              Content loaded successfully!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedLoadingBar; 