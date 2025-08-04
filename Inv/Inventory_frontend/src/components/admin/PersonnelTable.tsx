import React, { useState } from 'react';
import DataTable from './DataTable';
import TokenDisplayModal from './TokenDisplayModal';
import { User } from '../../types/admin';

interface PersonnelTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onGenerateToken: (userId: number) => Promise<string>;
  onRefreshData?: () => void;
  getTheme: () => { primaryText: string };
}

const PersonnelTable: React.FC<PersonnelTableProps> = ({
  users,
  onEdit,
  onDelete,
  onGenerateToken,
  onRefreshData,
  getTheme
}) => {
  const [tokenModal, setTokenModal] = useState<{
    show: boolean;
    userEmail: string;
    token: string;
  }>({ show: false, userEmail: '', token: '' });

  const [generalToken, setGeneralToken] = useState<string>('');
  const [showGeneralToken, setShowGeneralToken] = useState<boolean>(false);

  const handleGenerateToken = async (userId: number) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      
      const token = await onGenerateToken(userId);
      
      // Show the token modal
      setTokenModal({
        show: true,
        userEmail: user.email,
        token: token
      });
      
      // Refresh data after token generation
      if (onRefreshData) {
        onRefreshData();
      }
    } catch (error) {
      console.error('Failed to generate token:', error);
    }
  };

  const handleGenerateGeneralToken = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
      const response = await fetch(`${API_BASE}/generate-token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setGeneralToken(data.token);
        setShowGeneralToken(true);
      } else {
        throw new Error('Failed to generate token');
      }
    } catch (error) {
      console.error('Failed to generate general token:', error);
    }
  };

  const closeTokenModal = () => {
    setTokenModal({ show: false, userEmail: '', token: '' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      {/* General Token Generation Section */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-blue-800">General Access Token</h3>
            <p className="text-sm text-blue-600">Generate tokens for new sales personnel to use during login</p>
          </div>
          <button
            onClick={handleGenerateGeneralToken}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Generate New Token
          </button>
        </div>
        
        {showGeneralToken && (
          <div className="bg-white p-3 rounded border">
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                {generalToken}
              </code>
              <button
                onClick={() => copyToClipboard(generalToken)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ⚠️ Share this token with sales personnel for their initial login. Each token can only be used once.
            </p>
          </div>
        )}
      </div>
      <DataTable
        data={users}
        headers={['Email', 'Role', 'Token', 'Status', 'Actions']}
        renderRow={(user) => (
          <tr key={user.id}>
            <td className="px-6 py-4 font-medium text-gray-900">{user.email}</td>
            <td className="px-6 py-4 text-gray-700 capitalize">{user.role}</td>
            <td className="px-6 py-4 text-gray-700">
              {user.role === 'sales' ? (
                <div className="flex items-center gap-2">
                  {user.token ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      Generated
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">Not generated</span>
                  )}
                  <button
                    onClick={() => handleGenerateToken(user.id)}
                    className="text-blue-600 hover:text-blue-800 text-xs underline font-medium"
                  >
                    Generate
                  </button>
                </div>
              ) : (
                <span className="text-gray-400 text-xs">N/A</span>
              )}
            </td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.active ? 'bg-green-100 text-green-800' : 'bg-gray-300 text-gray-700'}`}>
                {user.active ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="px-6 py-4 flex gap-2">
              <button onClick={() => onEdit(user)} className={`${getTheme().primaryText} hover:underline text-sm`}>Edit</button>
              <button onClick={() => onDelete(user.id)} className="text-red-600 hover:underline text-sm">Delete</button>
            </td>
          </tr>
        )}
      />
      
      {/* Token Display Modal */}
      <TokenDisplayModal
        show={tokenModal.show}
        onClose={closeTokenModal}
        userEmail={tokenModal.userEmail}
        token={tokenModal.token}
      />
    </>
  );
};

export default PersonnelTable;
