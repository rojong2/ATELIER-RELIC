import { notFound } from "next/navigation";

import { supabase } from "@/lib/supabase";
import ProductDetail from "@/features/products/components/ProductDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const productId = Number(id);

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("is_active", true)
    .single();

  if (error || !product) return notFound();

  return <ProductDetail product={product} />;
}

