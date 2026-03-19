import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export type WishlistItem = {
  id: number;
  name: string;
  price: string;
  image: string;
};

type WishlistState = {
  items: WishlistItem[];
  isLoading: boolean;
  userId: string | null;
  setUserId: (userId: string | null) => void;
  fetchWishlist: (userId: string) => Promise<void>;
  addItem: (item: WishlistItem) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  toggleItem: (item: WishlistItem) => Promise<void>;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: false,
  userId: null,

  setUserId: (userId) => set({ userId }),

  fetchWishlist: async (userId) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("wishlist_items")
        .select(
          `
          product_id,
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
        console.error("Error fetching wishlist:", error);
        return;
      }

      if (data) {
        const items: WishlistItem[] = data
          .filter((item) => item.products)
          .map((item) => {
            const product = item.products as unknown as {
              id: number;
              name: string;
              price: number;
              image_url: string;
            };
            return {
              id: product.id,
              name: product.name,
              price: `${product.price.toLocaleString("ko-KR")}원`,
              image: product.image_url,
            };
          });
        set({ items, userId });
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (item) => {
    const { userId, items } = get();

    if (items.some((i) => i.id === item.id)) {
      return;
    }

    set({ items: [...items, item] });

    if (userId) {
      try {
        const { error } = await supabase.from("wishlist_items").insert({
          user_id: userId,
          product_id: item.id,
        });

        if (error) {
          console.error("Error adding to wishlist:", error);
          set({ items: items.filter((i) => i.id !== item.id) });
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        set({ items: items.filter((i) => i.id !== item.id) });
      }
    }
  },

  removeItem: async (id) => {
    const { userId, items } = get();
    const previousItems = [...items];

    set({ items: items.filter((i) => i.id !== id) });

    if (userId) {
      try {
        const { error } = await supabase
          .from("wishlist_items")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", id);

        if (error) {
          console.error("Error removing from wishlist:", error);
          set({ items: previousItems });
        }
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        set({ items: previousItems });
      }
    }
  },

  toggleItem: async (item) => {
    const { items, addItem, removeItem } = get();
    if (items.some((i) => i.id === item.id)) {
      await removeItem(item.id);
    } else {
      await addItem(item);
    }
  },

  isInWishlist: (id) => get().items.some((i) => i.id === id),

  clearWishlist: () => set({ items: [], userId: null }),
}));
