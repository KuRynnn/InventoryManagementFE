'use client';

import React from 'react';
import TransactionForm from '../../components/TransactionForm';
import { useRouter } from 'next/navigation';
import useApi from '../../hooks/useApi';

interface Transaction {
  item_id: string;
  kode_barang: string;
  nama_barang: string;
  harga_beli: string;
  harga_jual: string;
  jumlah: string;
}

export default function CreateTransaction() {
  const router = useRouter();
  const { postData, error, isLoading } = useApi();

  const handleSubmit = async (transaction: Transaction) => {
    try {
      let success: boolean;
      if (transaction.item_id === 'new') {
        // Create new item (this will also create a transaction)
        const newItem = {
          kode_barang: transaction.kode_barang,
          nama_barang: transaction.nama_barang,
          harga_beli: parseFloat(transaction.harga_beli),
          harga_jual: parseFloat(transaction.harga_jual),
          jumlah: parseInt(transaction.jumlah)
        };
        success = await postData(`${process.env.NEXT_PUBLIC_API_URL}api/items`, newItem);
      } else {
        // Create transaction (pembelian) for existing item
        const newTransaction = {
          item_id: transaction.item_id,
          jenis_transaksi: 'pembelian_stok',
          jumlah: parseInt(transaction.jumlah),
          harga_satuan: parseFloat(transaction.harga_beli)
        };
        success = await postData(`${process.env.NEXT_PUBLIC_API_URL}api/transaction`, newTransaction); // 'transaction' bukan 'transactions'
      }

      if (success) {
        router.push('/');
      } else {
        console.error('Failed to create item/transaction');
      }
    } catch (error) {
      console.error('Error creating item/transaction:', error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-black">Tambah Item</h1>
      <TransactionForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
    </div>
  );
}