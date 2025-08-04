import { useState, useCallback } from 'react';

export interface AppError {
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  details?: string;
}

export const useErrorHandler = () => {
  const [errors, setErrors] = useState<AppError[]>([]);

  const addError = useCallback((error: AppError) => {
    setErrors(prev => [...prev, { ...error, id: Date.now() } as AppError & { id: number }]);
    
    // Auto-remove success and info messages after 5 seconds
    if (error.type === 'success' || error.type === 'info') {
      setTimeout(() => {
        setErrors(prev => prev.filter(e => (e as any).id !== Date.now()));
      }, 5000);
    }
  }, []);

  const removeError = useCallback((index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const handleApiError = useCallback((error: any, context: string) => {
    let message = 'An unexpected error occurred';
    let title = 'Error';
    let details = '';

    if (error.message) {
      if (error.message.includes('Failed to fetch')) {
        message = 'Unable to connect to the server. Please check your internet connection.';
        title = 'Connection Error';
      } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        message = 'Your session has expired. Please log in again.';
        title = 'Authentication Error';
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        message = 'You do not have permission to perform this action.';
        title = 'Permission Error';
      } else if (error.message.includes('404') || error.message.includes('Not found')) {
        message = 'The requested resource was not found.';
        title = 'Not Found';
      } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
        message = 'A server error occurred. Please try again later.';
        title = 'Server Error';
      } else {
        message = error.message;
        details = `Context: ${context}`;
      }
    }

    addError({
      type: 'error',
      title,
      message,
      details
    });
  }, [addError]);

  const showSuccess = useCallback((message: string, title?: string) => {
    addError({
      type: 'success',
      title: title || 'Success',
      message
    });
  }, [addError]);

  const showWarning = useCallback((message: string, title?: string) => {
    addError({
      type: 'warning',
      title: title || 'Warning',
      message
    });
  }, [addError]);

  const showInfo = useCallback((message: string, title?: string) => {
    addError({
      type: 'info',
      title: title || 'Information',
      message
    });
  }, [addError]);

  return {
    errors,
    addError,
    removeError,
    clearErrors,
    handleApiError,
    showSuccess,
    showWarning,
    showInfo
  };
};
