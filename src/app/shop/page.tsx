import { products } from "@/data/products";
import ProductGridSection from "@/features/products/components/ProductGridSection";

export default function SHOP() {
  return (
    <main>
      <section className="flex h-[300px] w-full items-center justify-center">
        <div className="mx-auto w-full  text-center">
          <h2 className="text-[60px] font-normal text-[#5B3A1A] pt-50">
            SELECT SHOP
          </h2>
          <p className="mx-auto text-[16px] leading-[1.8] text-[#7b674f]">
            A curated space offering carefully sourced vintage furniture and
            objects.
          </p>
        </div>
      </section>
      <ProductGridSection products={products} showShopNowButton={false} />
      <div className="h-[70px]"></div>
    </main>
  );
}
