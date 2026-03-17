import Image from "next/image";
import { products } from "@/data/products";
import { magazines } from "@/data/magazines";
import MagazineCarousel from "@/components/magazine/MagazineCarousel";
import ProductGridSection from "@/features/products/components/ProductGridSection";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative w-full">
      <div className="relative h-screen w-full">
        <Image
          src="/home.png"
          alt="ATELIER RELIC home"
          fill
          priority
          className="object-cover brightness-[0.6]"
        />

        <div className="pointer-events-none hero-overlay">
          <Image
            src="/home_title.png"
            width={1200}
            height={1200}
            alt="ATELIER RELIC home title"
            className="hero-title"
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
      <section className="flex h-[300px] w-full items-center justify-center">
        <div className="mx-auto w-full  text-center">
          <h2 className="text-[60px] font-normal text-[#5B3A1A] pt-20">
            ABOUT OUR COLLECTION
          </h2>
          <p className="mx-auto text-[16px] leading-[1.8] text-[#7b674f] pt-8">
            We source vintage furniture from local markets and international
            dealers.
            <br />
            All pieces are selected based on condition, material quality, and
            design relevance.
          </p>
        </div>
      </section>

      <ProductGridSection products={products} />

      {/* 매거진 섹션 */}
      <section className="flex h-[250px] w-full items-center justify-center">
        <div className="mx-auto w-full  text-center">
          <h2 className="text-[60px] font-normal text-[#5B3A1A]">MAGAZINE</h2>
          <p className="mx-auto text-[18px] leading-[1.8] text-[#7b674f]">
            OUR STORY
          </p>
        </div>
      </section>

      <section className="flex w-full bg-white pb-24 items-center justify-center">
        <MagazineCarousel items={magazines} />
      </section>
    </main>
  );
}
