import React from 'react';

interface ModalProps {
  show: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  primaryTextClass?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  show, 
  title, 
  onClose, 
  children, 
  size = 'md',
  primaryTextClass = 'text-blue-600'
}) => {
  if (!show) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className={`bg-white rounded-xl shadow-lg p-8 w-full ${sizeClasses[size]} relative`}>
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          aria-label="Close modal"
        >
          ×
        </button>
        <h2 className={`text-2xl font-bold ${primaryTextClass} mb-4`}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;
