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
      <section className="flex min-h-screen w-full items-center justify-center bg-white">
        <div className="text-[14px] tracking-[0.08em] text-[#9b8a72]">
          로딩 중...
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="flex min-h-screen w-full items-center justify-center bg-white">
        <div className="text-[14px] tracking-[0.08em] text-[#9b8a72]">
          매거진이 없습니다.
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-white px-6 pb-24 pt-10">
      <div className="mx-auto w-full max-w-8xl">
        <div className="grid justify-items-center gap-x-30 gap-y-20 px-50 md:grid-cols-3">
          {items.map((card) => (
            <article
              key={card.id}
              className="block w-full max-w-[360px] cursor-pointer space-y-12 text-center">
              <div className="relative mx-auto h-[516px] w-[388px] transition duration-300 hover:opacity-50">
                <Image
                  src={card.image_url}
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
