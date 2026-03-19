import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  "";

let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
  supabase = createClient(
    "https://placeholder.supabase.co",
    "placeholder-key"
  );
}

export { supabase };

export type Magazine = {
  id: number;
  title: string;
  description: string;
  content: string | null;
  image_url: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  origin: string | null;
  era: string | null;
  image_url: string;
  description: string | null;
  stock: number;
  like_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export const formatPrice = (price: number): string => {
  return `${price.toLocaleString("ko-KR")}원`;
};

export type User = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type Address = {
  id: number;
  user_id: string;
  recipient_name: string;
  phone: string;
  postcode: string;
  address: string;
  detail_address: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "shipping"
  | "delivered"
  | "cancelled"
  | "refunded";

export type Order = {
  id: number;
  user_id: string | null;
  order_number: string;
  status: OrderStatus;
  orderer_name: string;
  orderer_phone: string;
  orderer_email: string;
  recipient_name: string;
  recipient_phone: string;
  postcode: string;
  address: string;
  detail_address: string | null;
  delivery_method: "delivery" | "pickup" | "quick";
  payment_method: "prepaid" | "cod";
  delivery_memo: string | null;
  total_product_price: number;
  delivery_fee: number;
  total_price: number;
  ordered_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
};
