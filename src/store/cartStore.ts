import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
  selected: boolean;
};

type CartState = {
  items: CartItem[];
  userId: string | null;
  isLoading: boolean;
  setUserId: (userId: string | null) => void;
  setItems: (items: CartItem[]) => void;
  fetchCart: (userId: string) => Promise<void>;
  addItem: (item: Omit<CartItem, "qty" | "selected">) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, delta: number) => void;
  toggleSelect: (id: number) => void;
  toggleSelectAll: (selected: boolean) => void;
  removeSelected: () => void;
  clearCart: (options?: { deleteFromDb?: boolean }) => void;
};

const toCartItem = (
  product: { id: number; name: string; price: number; image_url: string },
  quantity: number
): CartItem => ({
  id: product.id,
  name: product.name,
  price: product.price,
  qty: quantity,
  image: product.image_url,
  selected: true,
});

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  userId: null,
  isLoading: false,

  setUserId: (userId) => set({ userId }),
  setItems: (items) => set({ items }),

  fetchCart: async (userId) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select(
          `
          product_id,
          quantity,
          products (
            id,
            name,
            price,
            image_url
          )
        `
        )
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching cart:", error);
        return;
      }

      if (data) {
        const items: CartItem[] = data
          .filter((item) => item.products)
          .map((item) => {
            const product = item.products as unknown as {
              id: number;
              name: string;
              price: number;
              image_url: string;
            };
            return toCartItem(product, item.quantity);
          });
        set({ items, userId });
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: (item) => {
    const { userId, items } = get();

    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return {
        items: [...state.items, { ...item, qty: 1, selected: true }],
      };
    });

    if (userId) {
      const { items: currentItems } = get();
      const added = currentItems.find((i) => i.id === item.id)!;
      void (async () => {
        const { data: existing } = await supabase
          .from("cart_items")
          .select("id, quantity")
          .eq("user_id", userId)
          .eq("product_id", item.id)
          .maybeSingle();

        const { error } = existing
          ? await supabase
              .from("cart_items")
              .update({ quantity: added.qty })
              .eq("id", existing.id)
          : await supabase.from("cart_items").insert({
              user_id: userId,
              product_id: item.id,
              quantity: added.qty,
            });

        if (error) {
          console.error("Error syncing cart to DB:", error);
          get().fetchCart(userId);
        }
      })();
    }
  },

  removeItem: (id) => {
    const { userId, items } = get();
    const previousItems = [...items];

    set({ items: items.filter((i) => i.id !== id) });

    if (userId) {
      supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", id)
        .then(({ error }) => {
          if (error) {
            console.error("Error removing from cart:", error);
            set({ items: previousItems });
          }
        });
    }
  },

  updateQty: (id, delta) => {
    const { userId, items } = get();
    const existing = items.find((i) => i.id === id);
    if (!existing) return;

    const newQty = existing.qty + delta;
    if (newQty < 1) {
      get().removeItem(id);
      return;
    }

    const previousItems = [...items];
    set({
      items: items.map((i) =>
        i.id === id ? { ...i, qty: newQty } : i
      ),
    });

    if (userId) {
      supabase
        .from("cart_items")
        .update({ quantity: newQty })
        .eq("user_id", userId)
        .eq("product_id", id)
        .then(({ error }) => {
          if (error) {
            console.error("Error updating cart qty:", error);
            set({ items: previousItems });
          }
        });
    }
  },

  toggleSelect: (id) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, selected: !i.selected } : i
      ),
    })),

  toggleSelectAll: (selected) =>
    set((state) => ({
      items: state.items.map((i) => ({ ...i, selected })),
    })),

  removeSelected: () => {
    const { userId, items } = get();
    const toRemove = items.filter((i) => i.selected);
    const toKeep = items.filter((i) => !i.selected);
    const previousItems = [...items];

    set({ items: toKeep });

    if (userId && toRemove.length > 0) {
      const productIds = toRemove.map((i) => i.id);
      supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId)
        .in("product_id", productIds)
        .then(({ error }) => {
          if (error) {
            console.error("Error removing selected from cart:", error);
            set({ items: previousItems });
          }
        });
    }
  },

  clearCart: (options?: { deleteFromDb?: boolean }) => {
    const { userId } = get();
    const deleteFromDb = options?.deleteFromDb !== false;

    if (userId && deleteFromDb) {
      supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId)
        .then(({ error }) => {
          if (error) console.error("Error clearing cart from DB:", error);
        });
    }
    set({ items: [], userId: null });
  },
}));
