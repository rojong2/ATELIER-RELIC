import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/data/products";

type Props = {
  products: Product[];
};

export default function ProductGridSection({ products }: Props) {
  const orderedProducts = [...products].sort((a, b) => a.id - b.id);

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-white px-6 py-24">
      <div className="mx-auto w-full max-w-8xl">
        <div className="grid justify-items-center gap-x-5 gap-y-20 md:grid-cols-3 px-50">
          {orderedProducts.map((product) => (
            <article
              key={product.id}
              className="w-full max-w-[360px] text-center space-y-12 cursor-pointer">
              <div className="relative mx-auto h-[320px] w-full max-w-[520px] hover:opacity-50 transition duration-300">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 768px) 520px, 80vw"
                  className="object-contain"
                />
              </div>
              <div className="space-y-5">
                <h3 className="text-[12px] font-bold tracking-[0.1em] text-[#5B3A1A] pb-2 pt-5">
                  {product.name.toUpperCase()}
                </h3>
                <p className="pt-1 text-[10px] tracking-[0.16em] text-[#5B3A1A] pb-2">
                  {product.price}
                </p>
                <p className="pt-1 text-[10px] leading-relaxed tracking-[0.14em] text-[#9b8a72]">
                  Origin: {product.origin}
                  <br />
                  Era: {product.era}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="pt-15 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#5B3A1A] px-12 text-[11px] tracking-[0.24em] !text-[#5B3A1A] transition-colors hover:bg-[#5B3A1A] hover:!text-white">
            SHOP NOW
          </Link>
        </div>
      </div>
    </section>
  );
}

