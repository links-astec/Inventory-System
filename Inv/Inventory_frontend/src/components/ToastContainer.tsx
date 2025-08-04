import React, { useEffect } from 'react';
import { AlertTriangle, Users, Package } from 'lucide-react';
import { AppError } from '../hooks/useErrorHandler';

interface ToastProps {
  error: AppError & { id?: number };
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ error, onClose }) => {
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (error.type) {
      case 'success':
        return <Package className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Users className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (error.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-red-50 border-red-200';
    }
  };

  const getTextColor = () => {
    switch (error.type) {
      case 'success':
        return 'text-green-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-red-800';
    }
  };

  return (
    <div className={`max-w-md w-full ${getBackgroundColor()} border rounded-lg shadow-lg p-4 mb-2 transform transition-all duration-300 ease-in-out hover:scale-105`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 w-0 flex-1">
          {error.title && (
            <p className={`text-sm font-medium ${getTextColor()}`}>
              {error.title}
            </p>
          )}
          <p className={`text-sm ${getTextColor()} ${error.title ? 'mt-1' : ''}`}>
            {error.message}
          </p>
          {error.details && (
            <p className="text-xs text-gray-600 mt-1">
              {error.details}
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className={`rounded-md inline-flex p-1 ${getTextColor()} hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
            onClick={onClose}
            aria-label="Close notification"
          >
            <span className="text-lg font-bold">×</span>
          </button>
        </div>
      </div>
      {/* Progress bar for auto-dismiss */}
      <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
        <div 
          className={`h-1 rounded-full ${error.type === 'success' ? 'bg-green-400' : error.type === 'warning' ? 'bg-yellow-400' : error.type === 'info' ? 'bg-blue-400' : 'bg-red-400'}`}
          style={{
            animation: 'progressBar 5s linear forwards'
          }}
        ></div>
      </div>
    </div>
  );
};

interface ToastContainerProps {
  errors: (AppError & { id?: number })[];
  onRemove: (index: number) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ errors, onRemove }) => {
  if (errors.length === 0) return null;

  return (
    <>
      {/* Add CSS for progress bar animation */}
      <style>{`
        @keyframes progressBar {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      
      {/* Horizontal layout - top center */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center space-y-2 max-w-4xl w-full px-4">
        {errors.map((error, index) => (
          <Toast
            key={error.id || index}
            error={error}
            onClose={() => onRemove(index)}
          />
        ))}
      </div>
    </>
  );
};

export default ToastContainer;
