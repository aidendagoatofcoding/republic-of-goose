import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

// The shop catalogue, for the handful of screens that need to know what an item is.
export default function useShopItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    base44.entities.ShopItem.list({ sort: 'price', limit: 200 })
      .then((page) => {
        if (active) setItems(page?.items ?? []);
      })
      .catch(() => {
        if (active) setItems([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return items;
}