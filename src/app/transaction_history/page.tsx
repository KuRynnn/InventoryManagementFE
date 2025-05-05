'use client';

import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';

interface Transaction {
  id: number;
  tanggal: string;
  kode_barang: string;
  nama_barang: string;
  jenis_transaksi: 'pembelian' | 'penjualan';
  jumlah: number;
  harga_satuan: number;
  diskon: number;
  total_harga: number;
  stok_awal: number;
  stok_akhir: number;
}

const TransactionHistoryPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  const [bulan, setBulan] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTransactionHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://103.87.66.188:3000/api/transactions_history?tahun=${tahun}&bulan=${bulan}`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
        setFilteredTransactions(data);
      } else {
        setError('Failed to fetch transaction history');
      }
    } catch (error) {
      setError('Error fetching transaction history');
      console.error('Error fetching transaction history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [tahun, bulan]);

  useEffect(() => {
    fetchTransactionHistory();
  }, [fetchTransactionHistory]);

  useEffect(() => {
    const filtered = transactions.filter(transaction =>
      transaction.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTransactions(filtered);
  }, [searchTerm, transactions]);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredTransactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transaction History");
    
    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Save to file
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transaction_history_${tahun}_${bulan}.xlsx`;
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
      <div className="mb-4 flex items-center flex-wrap">
        <label className="mr-2">Tahun:</label>
        <input
          type="number"
          value={tahun}
          onChange={(e) => setTahun(e.target.value)}
          className="border rounded px-2 py-1 mr-4"
        />
        <label className="mr-2">Bulan:</label>
        <select
          value={bulan}
          onChange={(e) => setBulan(e.target.value)}
          className="border rounded px-2 py-1 mr-4"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month.toString().padStart(2, '0')}>
              {month}
            </option>
          ))}
        </select>
        <button
          onClick={fetchTransactionHistory}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
        <button
          onClick={downloadExcel}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-4"
          disabled={isLoading || filteredTransactions.length === 0}
        >
          Download Excel
        </button>
        <input
          type="text"
          placeholder="Search by item name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-2 py-1 mt-2 sm:mt-0"
        />
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Tanggal</th>
              <th className="py-2 px-4 border-b">Kode Barang</th>
              <th className="py-2 px-4 border-b">Nama Barang</th>
              <th className="py-2 px-4 border-b">Jenis Transaksi</th>
              <th className="py-2 px-4 border-b">Jumlah</th>
              <th className="py-2 px-4 border-b">Harga Satuan</th>
              <th className="py-2 px-4 border-b">Diskon</th>
              <th className="py-2 px-4 border-b">Total Harga</th>
              <th className="py-2 px-4 border-b">Stok Awal</th>
              <th className="py-2 px-4 border-b">Stok Akhir</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => (
              <tr key={transaction.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-2 px-4 border-b">{new Date(transaction.tanggal).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{transaction.kode_barang}</td>
                <td className="py-2 px-4 border-b">{transaction.nama_barang}</td>
                <td className="py-2 px-4 border-b">{transaction.jenis_transaksi}</td>
                <td className="py-2 px-4 border-b text-right">{transaction.jumlah}</td>
                <td className="py-2 px-4 border-b text-right">{transaction.harga_satuan.toLocaleString()}</td>
                <td className="py-2 px-4 border-b text-right">{transaction.diskon.toLocaleString()}</td>
                <td className="py-2 px-4 border-b text-right">{transaction.total_harga.toLocaleString()}</td>
                <td className="py-2 px-4 border-b text-right">{transaction.stok_awal}</td>
                <td className="py-2 px-4 border-b text-right">{transaction.stok_akhir}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredTransactions.length === 0 && !isLoading && (
        <div className="text-center text-gray-500 mt-4">
          No transactions found for the selected period or search term.
        </div>
      )}
    </div>
  );
};

export default TransactionHistoryPage;