// LoadingScreen.jsx
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute inset-2 border-4 border-blue-300 rounded-full animate-ping"></div>
          <div className="absolute inset-4 border-4 border-blue-200 rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-semibold text-blue-600 animate-bounce">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;