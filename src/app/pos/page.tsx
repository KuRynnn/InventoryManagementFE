'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Item {
  id: number;
  kode_barang: string;
  nama_barang: string;
  harga_jual: number;
  stok: number;
}

interface CartItem extends Item {
  quantity: number;
  discount: number;
}

const POS: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://103.87.66.188:3000/api/items');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        console.error('Failed to fetch items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const categories = Array.from(new Set(items.map(item => item.kode_barang.split(' ')[0])));

  const addToCart = (item: Item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      if (existingItem.quantity < item.stok) {
        setCart(cart.map(cartItem => 
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        ));
      } else {
        alert(`Cannot add more. Maximum stock (${item.stok}) reached for ${item.nama_barang}.`);
      }
    } else {
      setCart([...cart, { ...item, quantity: 1, discount: 0 }]);
    }
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    const item = items.find(i => i.id === itemId);
    if (item && newQuantity <= item.stok && newQuantity >= 0) {
      setCart(cart.map(cartItem => 
        cartItem.id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem
      ));
    } else if (newQuantity > item!.stok) {
      alert(`Cannot set quantity above maximum stock (${item!.stok}) for ${item!.nama_barang}.`);
    }
  };

  const updateDiscount = (itemId: number, discount: string) => {
    const numDiscount = parseFloat(discount);
    if (!isNaN(numDiscount)) {
      setCart(cart.map(item => 
        item.id === itemId ? { ...item, discount: numDiscount } : item
      ));
    }
  };

  const filteredItems = items.filter(item => 
    (selectedCategory ? item.kode_barang.startsWith(selectedCategory) : true) &&
    item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateItemTotal = (item: CartItem) => {
    return (item.harga_jual * item.quantity) - item.discount;
  };

  const total = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const change = parseFloat(receivedAmount) - total;

  const placeOrder = async () => {
    setIsLoading(true);
    try {
      for (const item of cart) {
        const response = await fetch('http://localhost:3000/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            item_id: item.id,
            jenis_transaksi: 'penjualan',
            jumlah: item.quantity,
            harga_satuan: item.harga_jual,
            diskon: item.discount,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
      }

      alert(`Order placed successfully!\nTotal: Rp ${total.toLocaleString()}\nReceived: Rp ${parseFloat(receivedAmount).toLocaleString()}\nChange: Rp ${change.toLocaleString()}`);
      setCart([]);
      setReceivedAmount('');
      fetchItems(); // Refresh items to update stock
    } catch (error) {
      console.error('Error placing order:', error);
      alert(`An error occurred while placing the order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-black">
      <div className="flex-1 flex">
        <div className="w-2/3 p-6 overflow-y-auto">
          <input 
            type="text" 
            placeholder="Search items..." 
            className="w-full p-2 border rounded text-black mb-6"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex mb-6 space-x-2 overflow-x-auto">
            {categories.map(category => (
              <button 
                key={category}
                onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                className={`px-4 py-2 rounded ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-white p-4 rounded shadow text-left text-black"
                disabled={item.stok === 0}
              >
                <h3 className="font-bold">{item.nama_barang}</h3>
                <p>{item.kode_barang}</p>
                <p className="text-green-600">Rp {item.harga_jual.toLocaleString()}</p>
                <p className={item.stok === 0 ? 'text-red-500' : 'text-gray-500'}>
                  Stock: {item.stok}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="w-1/3 bg-white p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-black">Cart</h2>
          {cart.map(item => (
            <div key={item.id} className="flex flex-col mb-4 border-b pb-2">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-black">{item.nama_barang}</h3>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500">Remove</button>
              </div>
              <p className="text-black">Rp {item.harga_jual.toLocaleString()} x {item.quantity}</p>
              <div className="flex items-center mt-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded text-black">-</button>
                <span className="mx-2 text-black">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded text-black">+</button>
              </div>
              <div className="flex items-center mt-2">
                <label className="mr-2">Discount (Rp):</label>
                <input
                  type="number"
                  value={item.discount || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateDiscount(item.id, value === '' ? '0' : value);
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      updateDiscount(item.id, '0');
                    }
                  }}
                  className="border rounded p-1 w-24 text-black"
                  placeholder="0"
                />
              </div>
              <p className="text-black mt-1">Item Total: Rp {calculateItemTotal(item).toLocaleString()}</p>
            </div>
          ))}
          <div className="mt-6">
            <h3 className="text-xl font-bold text-black">Total: Rp {total.toLocaleString()}</h3>
            <div className="mt-2">
              <label className="block">Received Amount:</label>
              <input
                type="text"
                value={receivedAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/^0+/, '');
                  setReceivedAmount(value);
                }}
                className="border rounded p-2 w-full text-black"
              />
            </div>
            <p className="mt-2 text-lg">Change: Rp {change >= 0 ? change.toLocaleString() : '0'}</p>
          </div>
          <button 
            className="mt-4 w-full bg-green-500 text-white py-2 rounded disabled:bg-gray-400"
            onClick={placeOrder}
            disabled={isLoading || cart.length === 0 || parseFloat(receivedAmount) < total}
          >
            {isLoading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;