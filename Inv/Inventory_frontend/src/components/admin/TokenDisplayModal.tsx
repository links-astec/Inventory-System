import React, { useState } from 'react';

interface TokenDisplayModalProps {
  show: boolean;
  onClose: () => void;
  userEmail: string;
  token: string;
  primaryBg?: string;
  primaryHoverBg?: string;
}

const TokenDisplayModal: React.FC<TokenDisplayModalProps> = ({
  show,
  onClose,
  userEmail,
  token
}) => {
  const [copied, setCopied] = useState(false);

  if (!show) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      // Close popup after copying
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Failed to copy token:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Sales Person Token</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-4">
            <p className="text-gray-600">
              Token generated for <strong>{userEmail}</strong>
            </p>
          </div>

          {/* Token display box */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-3">
                <p className="text-xs font-medium text-gray-600 mb-1">Generated Token:</p>
                <p className="text-sm font-mono text-gray-800 break-all">{token}</p>
              </div>
              <button
                onClick={copyToClipboard}
                className={`flex-shrink-0 p-2 rounded-md transition-all duration-200 ${
                  copied
                    ? 'bg-green-100 text-green-600'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
                title={copied ? 'Copied!' : 'Copy token'}
              >
                {copied ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Warning message */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex">
              <svg className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.732-.833-2.5 0L4.732 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> Save this token securely. The sales person will use it to access their dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDisplayModal;
