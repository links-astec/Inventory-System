import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import ReusableModal from '../components/ReusableModal';

interface Buyer {
  id: number;
  name: string;
  contact: string;
}

export default function BuyersPage() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [newBuyerName, setNewBuyerName] = useState('');
  const [newBuyerContact, setNewBuyerContact] = useState('');

  const [buyerToDelete, setBuyerToDelete] = useState<Buyer | null>(null);
  const [buyerToEdit, setBuyerToEdit] = useState<Buyer | null>(null);

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = () => {
    api.get<Buyer[]>('buyers/')
      .then((res) => setBuyers(res.data))
      .catch(() => alert('Failed to fetch buyers.'))
      .finally(() => setLoading(false));
  };

  const handleAddBuyer = () => {
    api.post('buyers/', {
      name: newBuyerName,
      contact: newBuyerContact,
    })
      .then(() => {
        fetchBuyers();
        setIsAddModalOpen(false);
        resetForm();
      })
      .catch(() => alert('Failed to add buyer.'));
  };

  const handleUpdateBuyer = () => {
    if (!buyerToEdit) return;
    api.put(`buyers/${buyerToEdit.id}/`, {
      name: newBuyerName,
      contact: newBuyerContact,
    })
      .then(() => {
        fetchBuyers();
        setIsEditModalOpen(false);
        setBuyerToEdit(null);
        resetForm();
      })
      .catch(() => alert('Failed to update buyer.'));
  };

  const handleDeleteBuyer = () => {
    if (!buyerToDelete) return;
    api.delete(`buyers/${buyerToDelete.id}/`)
      .then(() => {
        fetchBuyers();
        setIsDeleteModalOpen(false);
        setBuyerToDelete(null);
      })
      .catch(() => alert('Failed to delete buyer.'));
  };

  const resetForm = () => {
    setNewBuyerName('');
    setNewBuyerContact('');
  };

  const openEditModal = (buyer: Buyer) => {
    setBuyerToEdit(buyer);
    setNewBuyerName(buyer.name);
    setNewBuyerContact(buyer.contact);
    setIsEditModalOpen(true);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Buyers</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Buyer
        </button>
      </div>

      {loading ? (
        <p>Loading buyers...</p>
      ) : buyers.length === 0 ? (
        <p>No buyers found.</p>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Contact</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buyers.map((buyer) => (
              <tr key={buyer.id} className="border-t">
                <td className="p-2">{buyer.name}</td>
                <td className="p-2">{buyer.contact || 'N/A'}</td>
                <td className="p-2 text-center space-x-2">
                  <button
                    onClick={() => openEditModal(buyer)}
                    className="text-green-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setBuyerToDelete(buyer);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Buyer Modal */}
      <ReusableModal
        isOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
        title="Add New Buyer"
      >
        <BuyerForm
          name={newBuyerName}
          contact={newBuyerContact}
          setName={setNewBuyerName}
          setContact={setNewBuyerContact}
          handleSubmit={handleAddBuyer}
          buttonText="Add Buyer"
        />
      </ReusableModal>

      {/* Edit Buyer Modal */}
      <ReusableModal
        isOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        title="Edit Buyer"
      >
        <BuyerForm
          name={newBuyerName}
          contact={newBuyerContact}
          setName={setNewBuyerName}
          setContact={setNewBuyerContact}
          handleSubmit={handleUpdateBuyer}
          buttonText="Update Buyer"
        />
      </ReusableModal>

      {/* Delete Confirmation Modal */}
      <ReusableModal
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to delete <strong>{buyerToDelete?.name}</strong>?</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteBuyer}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </ReusableModal>
    </Layout>
  );
}

function BuyerForm({
  name,
  contact,
  setName,
  setContact,
  handleSubmit,
  buttonText,
}: {
  name: string;
  contact: string;
  setName: (v: string) => void;
  setContact: (v: string) => void;
  handleSubmit: () => void;
  buttonText: string;
}) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Buyer Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Contact"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        {buttonText}
      </button>
    </div>
  );
}
