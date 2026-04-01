import MagazineGridSection from "@/features/magazine/components/MagazineGridSection";
import { getMagazinesByIdOrder } from "@/features/magazine/services/magazineService";

export default async function MagazinePage() {
  const magazines = await getMagazinesByIdOrder();
  return (
    <main>
      <section className="flex h-[300px] w-full items-center justify-center">
        <div className="mx-auto w-full text-center">
          <h2 className="pt-50 text-[60px] font-normal text-[#5B3A1A]">
            MAGAZINE
          </h2>
          <p className="mx-auto text-[16px] leading-[1.8] text-[#7b674f]">
            Our stories and collections.
          </p>
        </div>
      </section>

      <MagazineGridSection initialItems={magazines} />
      <div className="h-[70px]"></div>
    </main>
  );
}
