import { supabase, type Magazine } from "@/lib/supabase";

export async function getMagazines(limit = 9): Promise<Magazine[]> {
  const { data, error } = await supabase
    .from("magazines")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching magazines:", error);
    return [];
  }

  return data || [];
}

export async function getMagazinesByIdOrder(limit = 9): Promise<Magazine[]> {
  const { data, error } = await supabase
    .from("magazines")
    .select("*")
    .eq("is_published", true)
    .order("id", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching magazines:", error);
    return [];
  }

  return data || [];
}
