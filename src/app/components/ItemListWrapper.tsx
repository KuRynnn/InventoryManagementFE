'use client';

import React, { useEffect, useState } from 'react';
import ItemList from './ItemList';

const ItemListWrapper = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/items')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  return <ItemList items={items} />;
};

export default ItemListWrapper;