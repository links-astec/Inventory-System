import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import ReusableModal from '../components/ReusableModal';

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [newProductName, setNewProductName] = useState('');
  const [newProductQuantity, setNewProductQuantity] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    api.get<Product[]>('products/')
      .then((res) => setProducts(res.data))
      .catch(() => alert('Failed to fetch products.'))
      .finally(() => setLoading(false));
  };

  const handleAddProduct = () => {
    api.post('products/', {
      name: newProductName,
      quantity: Number(newProductQuantity),
      price: Number(newProductPrice),
    })
      .then(() => {
        fetchProducts();
        setIsAddModalOpen(false);
        resetForm();
      })
      .catch(() => alert('Failed to add product.'));
  };

  const handleUpdateProduct = () => {
    if (!productToEdit) return;
    api.put(`products/${productToEdit.id}/`, {
      name: newProductName,
      quantity: Number(newProductQuantity),
      price: Number(newProductPrice),
    })
      .then(() => {
        fetchProducts();
        setIsEditModalOpen(false);
        setProductToEdit(null);
        resetForm();
      })
      .catch(() => alert('Failed to update product.'));
  };

  const handleDeleteProduct = () => {
    if (!productToDelete) return;
    api.delete(`products/${productToDelete.id}/`)
      .then(() => {
        fetchProducts();
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      })
      .catch(() => alert('Failed to delete product.'));
  };

  const resetForm = () => {
    setNewProductName('');
    setNewProductQuantity('');
    setNewProductPrice('');
  };

  const openEditModal = (product: Product) => {
    setProductToEdit(product);
    setNewProductName(product.name);
    setNewProductQuantity(product.quantity.toString());
    setNewProductPrice(product.price.toString());
    setIsEditModalOpen(true);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Products</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Quantity</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-2">{product.name}</td>
                <td className="p-2">{product.quantity}</td>
                <td className="p-2">GHS {product.price}</td>
                <td className="p-2 text-center space-x-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="text-green-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setProductToDelete(product);
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

      {/* Add Product Modal */}
      <ReusableModal
        isOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
        title="Add New Product"
      >
        <ProductForm
          name={newProductName}
          quantity={newProductQuantity}
          price={newProductPrice}
          setName={setNewProductName}
          setQuantity={setNewProductQuantity}
          setPrice={setNewProductPrice}
          handleSubmit={handleAddProduct}
          buttonText="Add Product"
        />
      </ReusableModal>

      {/* Edit Product Modal */}
      <ReusableModal
        isOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        title="Edit Product"
      >
        <ProductForm
          name={newProductName}
          quantity={newProductQuantity}
          price={newProductPrice}
          setName={setNewProductName}
          setQuantity={setNewProductQuantity}
          setPrice={setNewProductPrice}
          handleSubmit={handleUpdateProduct}
          buttonText="Update Product"
        />
      </ReusableModal>

      {/* Delete Confirmation Modal */}
      <ReusableModal
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to delete <strong>{productToDelete?.name}</strong>?</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteProduct}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </ReusableModal>
    </Layout>
  );
}

function ProductForm({
  name,
  quantity,
  price,
  setName,
  setQuantity,
  setPrice,
  handleSubmit,
  buttonText,
}: {
  name: string;
  quantity: string;
  price: string;
  setName: (v: string) => void;
  setQuantity: (v: string) => void;
  setPrice: (v: string) => void;
  handleSubmit: () => void;
  buttonText: string;
}) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
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
