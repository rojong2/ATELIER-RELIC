"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { supabase, type Product, formatPrice } from "@/lib/supabase";

type Props = {
  showShopNowButton?: boolean;
};

export default function ProductGridSection({ showShopNowButton = true }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("id", { ascending: true })
        .limit(9);

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="flex min-h-screen w-full items-center justify-center bg-white">
        <div className="text-[14px] tracking-[0.08em] text-[#9b8a72]">
          로딩 중...
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="flex min-h-screen w-full items-center justify-center bg-white">
        <div className="text-[14px] tracking-[0.08em] text-[#9b8a72]">
          상품이 없습니다.
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-white px-6 py-24">
      <div className="mx-auto w-full max-w-8xl">
        <div className="grid justify-items-center gap-x-5 gap-y-20 px-50 md:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="block w-full max-w-[360px] cursor-pointer space-y-12 text-center"
              aria-label={`View ${product.name}`}>
              <div className="relative mx-auto h-[320px] w-full max-w-[520px] transition duration-300 hover:opacity-50">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="(min-width: 768px) 520px, 80vw"
                  className="object-contain"
                />
              </div>
              <div className="space-y-5">
                <h3 className="pb-2 pt-5 text-[12px] font-bold tracking-[0.1em] text-[#5B3A1A]">
                  {product.name.toUpperCase()}
                </h3>
                <p className="pb-2 pt-1 text-[10px] tracking-[0.16em] text-[#5B3A1A]">
                  {formatPrice(product.price)}
                </p>
                <p className="pt-1 text-[10px] leading-relaxed tracking-[0.14em] text-[#9b8a72]">
                  Origin: {product.origin}
                  <br />
                  Era: {product.era}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {showShopNowButton && (
          <div className="flex justify-center pt-15">
            <Link
              href="/shop"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#5B3A1A] px-12 text-[11px] tracking-[0.24em] !text-[#5B3A1A] transition-colors hover:bg-[#5B3A1A] hover:!text-white">
              SHOP NOW
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
