import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="w-full min-w-0 bg-[#f6f1ea] text-[#5B3A1A]">
      <div className="flex items-center justify-center">
        <section className="mx-auto flex w-full max-w-8xl items-center justify-center px-4 pb-10 pt-16 sm:px-6 md:h-[500px] md:px-0 md:pb-0 md:pr-60 md:pt-50">
          <div className="grid w-full min-w-0 items-center gap-10 md:grid-cols-2 md:gap-16">
            <div className="text-center md:text-right">
              <h1 className="text-[54px] font-bold leading-[1.05] tracking-[0.06em] text-[#5B3A1A] pt-20 md:text-[74px]">
                ABOUT
                <br />
                FURNITURE
                <br />
                ARCHIVE
              </h1>
            </div>

            <div className="mx-auto w-full min-w-0 max-w-[560px]">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#e9e9e9]">
                <Image
                  src="https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/about/about1.PNG"
                  alt="Furniture Archive showroom"
                  fill
                  priority
                  sizes="(max-width: 767px) 100vw, (min-width: 768px) 560px, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="flex min-h-screen w-full items-center justify-center py-16 md:py-24">
        <div className="mx-auto w-full min-w-0 max-w-8xl px-4 sm:px-6 md:px-60">
          <div className="grid min-w-0 items-start gap-10 md:grid-cols-[1fr_360px] md:gap-14">
            <div className="relative aspect-[16/9] w-full min-w-0 overflow-hidden bg-[#e9e9e9]">
              <Image
                src="https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/about/about2.PNG"
                alt="Furniture Archive interior"
                fill
                sizes="(max-width: 767px) 100vw, (min-width: 768px) 60vw, 90vw"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 space-y-8 text-[15px] font-bold leading-[2.1] text-[#7b674f] first-letter:text-5xl">
              <p>
                Furniture Archive is a vintage select shop based in Seongsu,
                Seoul, dedicated to sourcing furniture shaped by time and
                craftsmanship.
              </p>
              <br />
              <p>
                We carefully collect pieces from European markets and
                independent dealers, selecting each item for its material
                quality, character, and lasting design value.
              </p>
              <br />
              <p>
                Rather than following trends, we focus on furniture that
                continues to live naturally in contemporary spaces — objects
                that carry history while adapting to modern living.
              </p>
            </div>
          </div>

          <div className="mx-auto w-full min-w-0 space-y-8 pt-12 text-center text-[15px] font-bold first-letter:text-5xl text-[#7b674f] md:pt-20">
            <p>
              Our Seongsu showroom presents these collected pieces as part of an
              evolving archive,
              <br />
              where past and present meet through design.
            </p>
            <br />
            <p>
              We believe vintage furniture offers more than aesthetic value.
              <br />
              Every mark, texture, and sign of aging reflects years of use and
              human experience,
              <br />
              adding depth that cannot be replicated by newly manufactured
              products.
            </p>
            <br />
            <p>
              Through careful selection and thoughtful presentation,
              <br />
              Furniture Archive aims to create spaces where timeless design
              becomes part of everyday life.
              <br />
              Each piece is chosen not only for how it looks, but for how it
              lives within a space over time.
            </p>

            <p className="pb-12 pt-16 text-[25px] italic text-[#5B3A1A] md:pb-20 md:pt-30">
              Timeless pieces, thoughtfully collected.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
