"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { supabase, type Magazine } from "@/lib/supabase";

type Props = {
  initialItems?: Magazine[];
};

export default function MagazineGridSection({ initialItems }: Props) {
  const [items, setItems] = useState<Magazine[]>(initialItems ?? []);
  const [loading, setLoading] = useState(!initialItems);

  useEffect(() => {
    if (initialItems) return;
    const fetchMagazines = async () => {
      try {
        const { data, error } = await supabase
          .from("magazines")
          .select("*")
          .eq("is_published", true)
          .order("id", { ascending: true })
          .limit(9);

        if (error) {
          console.error("Error fetching magazines:", error);
        } else {
          setItems(data || []);
        }
      } catch (err) {
        console.error("Error fetching magazines:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMagazines();
  }, [initialItems]);

  if (loading) {
    return (
      <section
        className="w-full bg-white px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-12 lg:px-12"
        aria-busy="true"
        aria-label="매거진 목록 불러오는 중">
        <div className="mx-auto grid w-full max-w-8xl grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 md:gap-14 lg:grid-cols-3 lg:gap-16">
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <div
              key={k}
              className="mx-auto w-full max-w-md animate-pulse space-y-6 sm:max-w-none">
              <div className="aspect-[3/4] w-full rounded-sm bg-[#ece6dd]" />
              <div className="space-y-2 px-1">
                <div className="mx-auto h-3 w-2/3 rounded bg-[#e5ddd4]" />
                <div className="mx-auto h-2 w-full rounded bg-[#ece6dd]" />
                <div className="mx-auto h-2 w-4/5 rounded bg-[#ece6dd]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="flex min-h-[40vh] w-full items-center justify-center bg-white px-6 pb-24 pt-8">
        <p className="text-center text-[14px] tracking-[0.08em] text-[#9b8a72]">
          매거진이 없습니다.
        </p>
      </section>
    );
  }

  return (
    <section
      className="w-full bg-white px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-12 lg:px-12"
      aria-label="매거진 목록">
      <div className="mx-auto w-full max-w-8xl">
        <ul className="grid list-none grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 md:gap-x-10 md:gap-y-18 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-20">
          {items.map((card) => (
            <li key={card.id} className="min-w-0">
              <article
                id={`magazine-${card.id}`}
                className="group mx-auto w-full max-w-md text-center sm:max-w-none">
                <div className="relative mx-auto aspect-[3/4] w-full overflow-hidden bg-[#f3f3f3]">
                  <Image
                    src={card.image_url}
                    alt={card.title}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="mt-8 space-y-3 px-1 sm:mt-10">
                  <h3 className="text-[14px] font-normal leading-snug tracking-[0.04em] text-[#5B3A1A] sm:text-[15px]">
                    {card.title}
                  </h3>
                  <p className="text-[12px] leading-relaxed tracking-[0.02em] text-[#9b8a72] sm:text-[13px]">
                    {card.description}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
