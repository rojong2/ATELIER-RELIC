import { notFound } from "next/navigation";

import { products } from "@/data/products";
import ProductDetail from "@/features/products/components/ProductDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }));
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const productId = Number(id);
  const product = products.find((p) => p.id === productId);

  if (!product) return notFound();

  return <ProductDetail product={product} />;
}

