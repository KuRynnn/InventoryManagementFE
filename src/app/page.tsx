// File: app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface StockInfo {
  totalJenisBarang: number;
  totalStok: number;
  totalStockTerjual: number;
}

interface FinancialInfo {
  totalModal: number;
  totalOmset: number;
  totalKeuntunganKotor: number;
  totalKeuntunganBersih: number;
}

interface TopSellingItem {
  nama_barang: string;
  jumlah_terjual: number;
}

interface DashboardData {
  stockInfo: StockInfo;
  financialInfo: FinancialInfo;
  topSelling: TopSellingItem[];
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://103.87.66.188:3000/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        setError('Error fetching dashboard data');
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error || !dashboardData) {
    return <div className="text-center mt-8 text-red-300">{error || 'Failed to load dashboard data'}</div>;
  }

  const { stockInfo, financialInfo, topSelling } = dashboardData;

  return (
    <div className="bg-white text-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-black">Dashboard</h1>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-black">Informasi Stok</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-200 p-4 rounded-lg">
                <h3 className="text-sm mb-1 text-blue-700">Total Jenis Barang</h3>
                <p className="text-2xl font-bold text-blue-800">{stockInfo.totalJenisBarang}</p>
              </div>
              <div className="bg-green-200 p-4 rounded-lg">
                <h3 className="text-sm mb-1 text-green-700">Total Seluruh Stok</h3>
                <p className="text-2xl font-bold text-green-800">{stockInfo.totalStok}</p>
              </div>
              <div className="bg-yellow-200 p-4 rounded-lg">
                <h3 className="text-sm mb-1 text-yellow-700">Total Stok Terjual</h3>
                <p className="text-2xl font-bold text-yellow-800">{stockInfo.totalStockTerjual}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-black">Informasi Keuangan</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-200 p-4 rounded-lg">
                <h3 className="text-sm mb-1 text-purple-700">Total Modal</h3>
                <p className="text-2xl font-bold text-purple-800">Rp {financialInfo.totalModal.toLocaleString()}</p>
              </div>
              <div className="bg-red-200 p-4 rounded-lg">
                <h3 className="text-sm mb-1 text-red-700">Total Keuntungan Bersih</h3>
                <p className="text-2xl font-bold text-red-800">Rp {financialInfo.totalKeuntunganBersih.toLocaleString()}</p>
              </div>
              {/* <div className="bg-pink-200 p-4 rounded-lg">
                <h3 className="text-sm mb-1 text-pink-700">Total Keuntungan Kotor</h3>
                <p className="text-2xl font-bold text-pink-800">Rp {financialInfo.totalKeuntunganKotor.toLocaleString()}</p>
              </div> */}
              <div className="bg-indigo-200 p-4 rounded-lg">
                <h3 className="text-sm mb-1 text-indigo-700">Total Omset</h3>
                <p className="text-2xl font-bold text-indigo-800">Rp {financialInfo.totalOmset.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-100 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-3 text-purple-700">Top Selling Items (All Time)</h2>
          <ul>
            {topSelling.map((item, index) => (
              <li key={index} className="flex justify-between items-center mb-2 text-purple-800">
                <span>{item.nama_barang}</span>
                <span className="text-purple-600">Terjual: {item.jumlah_terjual}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;