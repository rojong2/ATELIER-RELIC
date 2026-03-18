import Image from "next/image";
import type { MagazineCard } from "@/data/magazines";

type Props = {
  items: MagazineCard[];
};

export default function MagazineGridSection({ items }: Props) {
  const ordered = [...items].sort((a, b) => a.id - b.id).slice(0, 9);

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-white px-6 pt-10 pb-24">
      <div className="mx-auto w-full max-w-8xl">
        <div className="grid justify-items-center gap-x-30 gap-y-20 md:grid-cols-3 px-50">
          {ordered.map((card) => (
            <article
              key={card.id}
              className="block w-full max-w-[360px] text-center space-y-12 cursor-pointer">
              <div className="relative mx-auto h-[516px] w-[388px] hover:opacity-50 transition duration-300">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="388px"
                  className="object-cover"
                />
              </div>
              <div className="px-5 pb-6">
                <h3 className="text-[15px] tracking-[0.04em] text-[#5B3A1A]">
                  {card.title}
                </h3>
                <p className="mt-2 text-[12px] leading-relaxed tracking-[0.02em] text-[#9b8a72]">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
