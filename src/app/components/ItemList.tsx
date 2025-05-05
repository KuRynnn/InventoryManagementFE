import React from 'react';
import FlexibleTable from './FlexibleTable';

interface Item {
  kode_barang: string;
  nama_barang: string;
  harga_beli: number;
  harga_jual: number;
  stok: number;
}

interface ItemListProps {
  items: Item[];
}

const columns = [
  { key: 'kode_barang', title: 'Kode Barang' },
  { key: 'nama_barang', title: 'Nama Barang' },
  { key: 'harga_beli', title: 'Harga Beli', align: 'right' as const },
  { key: 'harga_jual', title: 'Harga Jual', align: 'right' as const },
  { key: 'stok', title: 'Stok', align: 'center' as const },
];

const ItemList: React.FC<ItemListProps> = ({ items }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <FlexibleTable columns={columns} data={items} rowKeyField="kode_barang" />
    </div>
  );
};

export default ItemList;