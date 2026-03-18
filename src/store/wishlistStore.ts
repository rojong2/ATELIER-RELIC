import type { StaticImageData } from "next/image";
import { create } from "zustand";

export type WishlistItem = {
  id: number;
  name: string;
  price: string;
  image: StaticImageData;
};

type WishlistState = {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (id: number) => boolean;
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      if (state.items.some((i) => i.id === item.id)) {
        return state;
      }
      return { items: [...state.items, item] };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  toggleItem: (item) => {
    const { items } = get();
    if (items.some((i) => i.id === item.id)) {
      set({ items: items.filter((i) => i.id !== item.id) });
    } else {
      set({ items: [...items, item] });
    }
  },

  isInWishlist: (id) => get().items.some((i) => i.id === id),
}));
