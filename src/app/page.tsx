import Image from "next/image";
import Link from "next/link";

import MagazineCarousel from "@/components/magazine/MagazineCarousel";
import ProductGridSection from "@/features/products/components/ProductGridSection";
import { getProducts } from "@/features/products/services/productService";
import { getMagazines } from "@/features/magazine/services/magazineService";

export default async function Home() {
  const [products, magazines] = await Promise.all([
    getProducts(),
    getMagazines(),
  ]);
  return (
    <main className="relative w-full min-w-0 overflow-x-clip">
      <div className="relative h-screen w-full min-w-0 overflow-hidden">
        <Image
          src="https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/home/home.png"
          alt="ATELIER RELIC home"
          fill
          priority
          className="object-cover brightness-[0.6]"
        />

        <div className="pointer-events-none hero-overlay px-4 sm:px-6">
          <Image
            src="https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/home/home_title.png"
            width={1200}
            height={1200}
            alt="ATELIER RELIC home title"
            sizes="(max-width: 768px) 100vw, 920px"
            className="hero-title h-auto w-full max-w-full object-contain"
          />

          <p className="hero-subtitle">
            More than furniture, a collected history.
            <br />
            Objects shaped by use and memory,
            <br />
            chosen for their enduring presence.
          </p>

          <Link href="/shop" className="pointer-events-auto hero-button">
            SHOP
          </Link>
        </div>
      </div>
      {/* 상품 그리드 섹션 */}
      <section className="flex min-h-[300px] w-full items-center justify-center px-4">
        <div className="mx-auto w-full max-w-full text-center">
          <h2 className="pt-20 text-3xl font-normal text-[#5B3A1A] sm:text-5xl md:text-[60px]">
            ABOUT OUR COLLECTION
          </h2>
          <p className="mx-auto max-w-full text-[16px] leading-[1.8] text-[#7b674f] pt-8">
            We source vintage furniture from local markets and international
            dealers.
            <br />
            All pieces are selected based on condition, material quality, and
            design relevance.
          </p>
        </div>
      </section>

      <ProductGridSection initialProducts={products} />

      {/* 매거진 섹션 */}
      <section className="flex min-h-[250px] w-full items-center justify-center px-4">
        <div className="mx-auto w-full max-w-full text-center">
          <h2 className="text-3xl font-normal text-[#5B3A1A] sm:text-5xl md:text-[60px]">
            MAGAZINE
          </h2>
          <p className="mx-auto text-[18px] leading-[1.8] text-[#7b674f]">
            OUR STORY
          </p>
        </div>
      </section>

      <section className="flex w-full bg-white pb-24 items-center justify-center">
        <MagazineCarousel initialItems={magazines} />
      </section>
    </main>
  );
}
