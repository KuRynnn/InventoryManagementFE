'use client';

import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';

interface RekapitulasiItem {
  kode_barang: string;
  nama_barang: string;
  stok_awal: number;
  jumlah_pembelian: number;
  harga_beli: number;
  total_harga_beli: number;
  jumlah_terjual: number;
  harga_jual: number;
  total_harga_jual: number;
  total_diskon: number;
  stok_akhir: number;
  keuntungan: number;
}

const RekapitulasiPage: React.FC = () => {
  const [rekapitulasi, setRekapitulasi] = useState<RekapitulasiItem[]>([]);
  const [filteredRekapitulasi, setFilteredRekapitulasi] = useState<RekapitulasiItem[]>([]);
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  const [bulan, setBulan] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRekapitulasi = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/rekapitulasi?tahun=${tahun}&bulan=${bulan}`);
      if (response.ok) {
        const data = await response.json();
        setRekapitulasi(data);
        setFilteredRekapitulasi(data);
      } else {
        setError('Failed to fetch rekapitulasi');
      }
    } catch (error) {
      setError('Error fetching rekapitulasi');
      console.error('Error fetching rekapitulasi:', error);
    } finally {
      setIsLoading(false);
    }
  }, [tahun, bulan]);

  useEffect(() => {
    fetchRekapitulasi();
  }, [fetchRekapitulasi]);

  useEffect(() => {
    const filtered = rekapitulasi.filter(item =>
      item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode_barang.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRekapitulasi(filtered);
  }, [searchTerm, rekapitulasi]);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRekapitulasi);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekapitulasi");
    
    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Save to file
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rekapitulasi_${tahun}_${bulan}.xlsx`;
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-6">Rekapitulasi Stok</h1>
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
          onClick={fetchRekapitulasi}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
        <button
          onClick={downloadExcel}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-4"
          disabled={isLoading || filteredRekapitulasi.length === 0}
        >
          Download Excel
        </button>
        <input
          type="text"
          placeholder="Search by item name or code..."
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
              <th className="py-2 px-4 border-b">Kode Barang</th>
              <th className="py-2 px-4 border-b">Nama Barang</th>
              <th className="py-2 px-4 border-b">Stok Awal</th>
              <th className="py-2 px-4 border-b">Jumlah Pembelian</th>
              <th className="py-2 px-4 border-b">Harga Beli</th>
              <th className="py-2 px-4 border-b">Total Harga Beli</th>
              <th className="py-2 px-4 border-b">Jumlah Terjual</th>
              <th className="py-2 px-4 border-b">Harga Jual</th>
              <th className="py-2 px-4 border-b">Total Harga Jual</th>
              <th className="py-2 px-4 border-b">Total Diskon</th>
              <th className="py-2 px-4 border-b">Stok Akhir</th>
              <th className="py-2 px-4 border-b">Keuntungan</th>
            </tr>
          </thead>
          <tbody>
            {filteredRekapitulasi.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-2 px-4 border-b">{item.kode_barang}</td>
                <td className="py-2 px-4 border-b">{item.nama_barang}</td>
                <td className="py-2 px-4 border-b text-right">{item.stok_awal}</td>
                <td className="py-2 px-4 border-b text-right">{item.jumlah_pembelian}</td>
                <td className="py-2 px-4 border-b text-right">{item.harga_beli.toLocaleString()}</td>
                <td className="py-2 px-4 border-b text-right">{item.total_harga_beli.toLocaleString()}</td>
                <td className="py-2 px-4 border-b text-right">{item.jumlah_terjual}</td>
                <td className="py-2 px-4 border-b text-right">{item.harga_jual.toLocaleString()}</td>
                <td className="py-2 px-4 border-b text-right">{item.total_harga_jual.toLocaleString()}</td>
                <td className="py-2 px-4 border-b text-right">{item.total_diskon.toLocaleString()}</td>
                <td className="py-2 px-4 border-b text-right">{item.stok_akhir}</td>
                <td className="py-2 px-4 border-b text-right">{item.keuntungan.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredRekapitulasi.length === 0 && !isLoading && (
        <div className="text-center text-gray-500 mt-4">
          No data available for the selected period or search term.
        </div>
      )}
    </div>
  );
};

export default RekapitulasiPage;