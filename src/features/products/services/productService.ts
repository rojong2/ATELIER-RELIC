import { supabase, type Product } from "@/lib/supabase";

export async function getProducts(limit = 9): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("id", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data || [];
}
