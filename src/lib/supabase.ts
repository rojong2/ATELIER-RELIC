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
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export const formatPrice = (price: number): string => {
  return `${price.toLocaleString("ko-KR")}원`;
};
