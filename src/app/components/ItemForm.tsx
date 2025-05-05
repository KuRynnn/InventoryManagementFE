import React, { useState } from 'react';

interface Item {
  kode_barang: string;
  nama_barang: string;
  harga_beli: string;
  harga_jual: string;
}

interface ItemFormProps {
  onSubmit: (item: Item) => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ onSubmit }) => {
  const [item, setItem] = useState<Item>({
    kode_barang: '',
    nama_barang: '',
    harga_beli: '',
    harga_jual: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(item);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kode_barang">
          Kode Barang
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="kode_barang"
          type="text"
          name="kode_barang"
          value={item.kode_barang}
          onChange={handleChange}
          required
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
          value={item.nama_barang}
          onChange={handleChange}
          required
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
          value={item.harga_beli}
          onChange={handleChange}
          required
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
          value={item.harga_jual}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default ItemForm;