import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
