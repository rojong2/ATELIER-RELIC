import type { StaticImageData } from "next/image";
import { create } from "zustand";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: StaticImageData;
  selected: boolean;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty" | "selected">) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, delta: number) => void;
  toggleSelect: (id: number) => void;
  toggleSelectAll: (selected: boolean) => void;
  removeSelected: () => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
          ),
        };
      }
      return {
        items: [...state.items, { ...item, qty: 1, selected: true }],
      };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  updateQty: (id, delta) =>
    set((state) => ({
      items: state.items
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            if (newQty < 1) return null;
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null),
    })),

  toggleSelect: (id) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, selected: !i.selected } : i,
      ),
    })),

  toggleSelectAll: (selected) =>
    set((state) => ({
      items: state.items.map((i) => ({ ...i, selected })),
    })),

  removeSelected: () =>
    set((state) => ({
      items: state.items.filter((i) => !i.selected),
    })),

  clearCart: () => set({ items: [] }),
}));
