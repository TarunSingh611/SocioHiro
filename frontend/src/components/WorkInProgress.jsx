import { useState, useEffect } from 'react';
import { 
  WrenchScrewdriverIcon, 
  RocketLaunchIcon, 
  SparklesIcon,
  ClockIcon,
  CogIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const WorkInProgress = ({ 
  title = "Work in Progress", 
  subtitle = "We're building something amazing for you",
  features = [],
  showParticles = true,
  className = ""
}) => {

  const [progress, setProgress] = useState(50);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 80) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden ${className}`}>
      {/* Animated Background Particles */}
      {showParticles && (
        <>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
            <div className="particle particle-5"></div>
          </div>
        </>
      )}

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-6 relative">
              <WrenchScrewdriverIcon className="w-12 h-12 text-white" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse opacity-75"></div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {subtitle}
            </p>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-12">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Development Progress</span>
                <span className="text-sm font-medium text-indigo-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out animate-pulse"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          {features.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg mb-4 mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Animated Dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: linear-gradient(45deg, #6366f1, #a855f7);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }
        
        .particle-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .particle-2 {
          top: 60%;
          left: 80%;
          animation-delay: 2s;
        }
        
        .particle-3 {
          top: 40%;
          left: 60%;
          animation-delay: 4s;
        }
        
        .particle-4 {
          top: 80%;
          left: 20%;
          animation-delay: 1s;
        }
        
        .particle-5 {
          top: 30%;
          left: 90%;
          animation-delay: 3s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default WorkInProgress; 