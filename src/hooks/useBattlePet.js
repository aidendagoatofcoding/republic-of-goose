import { useMemo } from 'react';
import { useCitizen } from '@/hooks/useCitizen';
import useShopItems from '@/hooks/useShopItems';

// The first pet in the pack is the one that steps into the ring.
export default function useBattlePet() {
  const { citizen } = useCitizen();
  const items = useShopItems();
  const pet = useMemo(() => {
    const owned = new Set(citizen?.possessions ?? []);
    return items.find((item) => item.category === 'pet' && owned.has(item.id)) || null;
  }, [items, citizen?.possessions]);
  return { pet };
}