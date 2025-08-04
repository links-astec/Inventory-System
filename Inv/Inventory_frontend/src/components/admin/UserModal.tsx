import React, { useState } from 'react';
import { User } from '../../types/admin';

interface UserModalProps {
  show: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  userForm: {
    email: string;
    role: string;
    password: string;
    active: boolean;
  };
  onFieldChange: (field: string, value: any) => void;
  onGenerateToken: (userId: number) => Promise<string>;
  editingUser: User | null;
  primaryBg: string;
  primaryHoverBg: string;
  submitText: string;
}

const UserModal: React.FC<UserModalProps> = ({
  show,
  title,
  onClose,
  onSubmit,
  userForm,
  onFieldChange,
  onGenerateToken,
  editingUser,
  primaryBg,
  primaryHoverBg,
  submitText
}) => {
  const [generatedToken, setGeneratedToken] = useState<string>('');
  const [generatingToken, setGeneratingToken] = useState(false);

  if (!show) return null;

  const handleGenerateToken = async () => {
    if (!editingUser || editingUser.role !== 'sales') return;
    
    setGeneratingToken(true);
    try {
      const token = await onGenerateToken(editingUser.id);
      setGeneratedToken(token);
    } catch (error) {
      console.error('Failed to generate token:', error);
    } finally {
      setGeneratingToken(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const showTokenSection = editingUser && editingUser.role === 'sales';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={userForm.email}
              onChange={(e) => onFieldChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {!editingUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                value={userForm.password}
                onChange={(e) => onFieldChange('password', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={userForm.role}
              onChange={(e) => onFieldChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="admin">Admin</option>
              <option value="sales">Sales</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          {showTokenSection && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Salesperson Token
                </label>
                <button
                  type="button"
                  onClick={handleGenerateToken}
                  disabled={generatingToken}
                  className={`${primaryBg} hover:${primaryHoverBg} text-white px-3 py-1 rounded text-sm flex items-center gap-1 disabled:opacity-50`}
                >
                  ⟳ Generate
                </button>
              </div>
              
              {(editingUser.token || generatedToken) && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={generatedToken || editingUser.token}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedToken || editingUser.token)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                    title="Copy to clipboard"
                  >
                    📋
                  </button>
                </div>
              )}
              
              {!editingUser.token && !generatedToken && (
                <p className="text-sm text-gray-500">
                  No token generated yet. Click "Generate" to create a new token.
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${primaryBg} hover:${primaryHoverBg} text-white px-4 py-2 rounded-lg`}
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
