import { magazines } from "@/data/magazines";
import MagazineGridSection from "@/features/magazine/components/MagazineGridSection";

export default function MagazinePage() {
  return (
    <main className="w-full bg-white">
      <section className="flex h-[250px] w-full items-center justify-center pt-50">
        <div className="mx-auto w-full text-center">
          <h1 className="text-[60px] font-normal text-[#5B3A1A]">MAGAZINE</h1>
          <p className="mx-auto text-[18px] leading-[1.8] text-[#7b674f]">
            OUR STORY
          </p>
        </div>
      </section>

      <MagazineGridSection items={magazines} />
    </main>
  );
}
