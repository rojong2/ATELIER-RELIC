"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { supabase, type Magazine } from "@/lib/supabase";

type Props = {
  perPage?: number;
  initialItems?: Magazine[];
};

export default function MagazineCarousel({ perPage = 3, initialItems }: Props) {
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
          .order("published_at", { ascending: false })
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

  const pages = useMemo(() => {
    const out: Magazine[][] = [];
    for (let i = 0; i < items.length; i += perPage) {
      out.push(items.slice(i, i + perPage));
    }
    return out;
  }, [items, perPage]);

  const [page, setPage] = useState(0);

  useEffect(() => {
    if (pages.length <= 1) return;
    const id = window.setInterval(() => {
      setPage((p) => (p + 1) % pages.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [pages.length]);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="text-[14px] tracking-[0.08em] text-[#9b8a72]">
          로딩 중...
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="text-[14px] tracking-[0.08em] text-[#9b8a72]">
          매거진이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden">
        <div
          className="flex w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${page * 100}%)` }}>
          {pages.map((cards, idx) => (
            <div key={idx} className="w-full shrink-0 px-60">
              <div className="mx-auto grid w-full max-w-8xl gap-10 md:grid-cols-3">
                {cards.map((card) => (
                  <article
                    key={card.id}
                    className="group cursor-pointer border border-[#ece6dd] bg-white">
                    <div className="relative h-[190px] w-full overflow-hidden bg-[#f3f3f3] md:h-[210px]">
                      <Image
                        src={card.image_url}
                        alt={card.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 90vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="px-5 pb-5 pt-4">
                      <h3 className="text-[12px] tracking-[0.02em] text-[#5B3A1A]">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-[10px] leading-relaxed tracking-[0.01em] text-[#9b8a72]">
                        {card.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-3 pt-5">
        {pages.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to page ${idx + 1}`}
            onClick={() => setPage(idx)}
            className={`h-2 w-2 rounded-full border transition-colors ${
              idx === page
                ? "border-[#9b8a72] bg-[#9b8a72]"
                : "border-[#d8cdbf] bg-transparent"
            }`}
          />
        ))}
      </div>

      <div className="flex justify-center pt-15">
        <Link
          href="/magazine"
          className="inline-flex h-11 items-center justify-center rounded-full border border-[#5B3A1A] px-12 text-[11px] tracking-[0.24em] !text-[#5B3A1A] transition-colors hover:bg-[#5B3A1A] hover:!text-white">
          MAGAZINE NOW
        </Link>
      </div>
    </div>
  );
}
