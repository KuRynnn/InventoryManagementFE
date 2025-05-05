import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AppBarProps {
  title: string;
}

const AppBar: React.FC<AppBarProps> = ({ title }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-black">{title}</h1>
        <nav>
          <Link href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
            Dashboard
          </Link>
          <Link href="/items" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
            List Item
          </Link>
          <Link href="/transactions/create" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
            Tambah Item
          </Link>
          <Link href="/pos" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
            Point Of Sales
          </Link>
          <Link href="/rekapitulasi" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
            Rekapitulasi Stok
          </Link>
          <Link href="/transaction_history" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
            Histori Transaksi
          </Link>
        </nav>
      </div>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
          <Image
            src="/images/PP.png"
            alt="User Avatar"
            width={40}
            height={40}
          />
        </div>
      </div>
    </div>
  );
};

export default AppBar;