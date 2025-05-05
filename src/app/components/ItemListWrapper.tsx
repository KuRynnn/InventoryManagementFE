'use client';

import React, { useEffect, useState } from 'react';
import ItemList from './ItemList';

const ItemListWrapper = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/items`);
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  return <ItemList items={items} />;
};

export default ItemListWrapper;
