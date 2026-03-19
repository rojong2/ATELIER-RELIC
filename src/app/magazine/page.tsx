import MagazineGridSection from "@/features/magazine/components/MagazineGridSection";
import { getMagazinesByIdOrder } from "@/features/magazine/services/magazineService";

export default async function MagazinePage() {
  const magazines = await getMagazinesByIdOrder();
  return (
    <main className="w-full bg-white">
      <section className="flex h-[300px] w-full items-center justify-center pt-50">
        <div className="mx-auto w-full text-center">
          <h1 className="text-[60px] font-normal text-[#5B3A1A]">MAGAZINE</h1>
          <p className="mx-auto text-[18px] leading-[1.8] text-[#7b674f]">
            OUR STORY
          </p>
        </div>
      </section>

      <MagazineGridSection initialItems={magazines} />
    </main>
  );
}
