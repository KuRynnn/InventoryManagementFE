import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

interface Item {
  id: number;
  kode_barang: string;
  nama_barang: string;
  harga_beli: number;
  harga_jual: number;
  stok: number;
}

interface Transaction {
  item_id: string;
  kode_barang: string;
  nama_barang: string;
  harga_beli: string;
  harga_jual: string;
  jumlah: string;
}

interface TransactionFormProps {
  onSubmit: (transaction: Transaction) => void;
  isLoading: boolean;
  error: string | null;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, isLoading, error }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [transaction, setTransaction] = useState<Transaction>({
    item_id: '',
    kode_barang: '',
    nama_barang: '',
    harga_beli: '',
    harga_jual: '',
    jumlah: '',
  });
  const [isNewItem, setIsNewItem] = useState(false);
  const { fetchData } = useApi();

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchData('http://103.87.66.188:3000/api/items');
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
  
    loadItems();
  }, [fetchData]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransaction(prev => ({ ...prev, [name]: value }));

    if (name === 'item_id') {
      setIsNewItem(value === 'new');
      if (value !== 'new' && value !== '') {
        const selectedItem = items.find(item => item.id.toString() === value);
        if (selectedItem) {
          setTransaction(prev => ({
            ...prev,
            kode_barang: selectedItem.kode_barang,
            nama_barang: selectedItem.nama_barang,
            harga_beli: selectedItem.harga_beli.toString(),
            harga_jual: selectedItem.harga_jual.toString(),
            jumlah: '',
          }));
        }
      } else if (value === 'new') {
        setTransaction(prev => ({
          ...prev,
          kode_barang: '',
          nama_barang: '',
          harga_beli: '',
          harga_jual: '',
          jumlah: '',
        }));
      } else {
        setTransaction(prev => ({
          ...prev,
          kode_barang: '',
          nama_barang: '',
          harga_beli: '',
          harga_jual: '',
          jumlah: '',
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(transaction);
  };

  const isFormValid = () => {
    return (
      transaction.item_id &&
      transaction.kode_barang &&
      transaction.nama_barang &&
      transaction.harga_beli &&
      transaction.harga_jual &&
      transaction.jumlah
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="item_id">
          Item
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="item_id"
          name="item_id"
          value={transaction.item_id}
          onChange={handleChange}
          required
        >
          <option value="">Select an item</option>
          {items.map((item) => (
            <option key={item.id} value={item.id.toString()}>
              {item.nama_barang}
            </option>
          ))}
          <option value="new">New Item</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kode_barang">
          Kode Barang
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="kode_barang"
          type="text"
          name="kode_barang"
          value={transaction.kode_barang}
          onChange={handleChange}
          required
          readOnly={!isNewItem}
          disabled={transaction.item_id === ''}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nama_barang">
          Nama Barang
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="nama_barang"
          type="text"
          name="nama_barang"
          value={transaction.nama_barang}
          onChange={handleChange}
          required
          readOnly={!isNewItem}
          disabled={transaction.item_id === ''}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="harga_beli">
          Harga Beli
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="harga_beli"
          type="number"
          name="harga_beli"
          value={transaction.harga_beli}
          onChange={handleChange}
          required
          readOnly={!isNewItem}
          disabled={transaction.item_id === ''}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="harga_jual">
          Harga Jual
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="harga_jual"
          type="number"
          name="harga_jual"
          value={transaction.harga_jual}
          onChange={handleChange}
          required
          readOnly={!isNewItem}
          disabled={transaction.item_id === ''}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jumlah">
          Jumlah
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="jumlah"
          type="number"
          name="jumlah"
          value={transaction.jumlah}
          onChange={handleChange}
          required
          disabled={transaction.item_id === ''}
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={isLoading || !isFormValid()}
        >
          {isLoading ? 'Processing...' : (transaction.item_id === '' ? 'Select Item' : (isNewItem ? 'Create New Item' : 'Add Stock'))}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;