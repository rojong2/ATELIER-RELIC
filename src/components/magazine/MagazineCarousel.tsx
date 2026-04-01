"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { supabase, type Magazine } from "@/lib/supabase";

type Props = {
  /** 고정 슬라이드당 카드 수. 생략 시 뷰포트에 따라 1 / 2 / 3 */
  perPage?: number;
  initialItems?: Magazine[];
};

const AUTOPLAY_MS = 5000;
const MANUAL_PAUSE_MS = 12000;

function resolvePerPageFromViewport(): number {
  if (typeof window === "undefined") return 3;
  if (window.matchMedia("(min-width: 1024px)").matches) return 3;
  if (window.matchMedia("(min-width: 768px)").matches) return 2;
  return 1;
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export default function MagazineCarousel({
  perPage: perPageProp,
  initialItems,
}: Props) {
  const [items, setItems] = useState<Magazine[]>(initialItems ?? []);
  const [loading, setLoading] = useState(!initialItems);
  const [viewportPerPage, setViewportPerPage] = useState(3);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [hoverInside, setHoverInside] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [manualPauseUntil, setManualPauseUntil] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const effectivePerPage = perPageProp ?? viewportPerPage;

  useLayoutEffect(() => {
    if (perPageProp !== undefined) return;
    setViewportPerPage(resolvePerPageFromViewport());
  }, [perPageProp]);

  useEffect(() => {
    if (perPageProp !== undefined) return;
    const update = () => setViewportPerPage(resolvePerPageFromViewport());
    window.addEventListener("resize", update);
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const mqMd = window.matchMedia("(min-width: 768px)");
    mqLg.addEventListener("change", update);
    mqMd.addEventListener("change", update);
    return () => {
      window.removeEventListener("resize", update);
      mqLg.removeEventListener("change", update);
      mqMd.removeEventListener("change", update);
    };
  }, [perPageProp]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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
    for (let i = 0; i < items.length; i += effectivePerPage) {
      out.push(items.slice(i, i + effectivePerPage));
    }
    return out;
  }, [items, effectivePerPage]);

  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage((p) => (pages.length === 0 ? 0 : Math.min(p, pages.length - 1)));
  }, [pages.length]);

  const bumpManualPause = useCallback(() => {
    setManualPauseUntil(Date.now() + MANUAL_PAUSE_MS);
  }, []);

  const goNext = useCallback(() => {
    if (pages.length <= 1) return;
    bumpManualPause();
    setPage((p) => (p + 1) % pages.length);
  }, [pages.length, bumpManualPause]);

  const goPrev = useCallback(() => {
    if (pages.length <= 1) return;
    bumpManualPause();
    setPage((p) => (p - 1 + pages.length) % pages.length);
  }, [pages.length, bumpManualPause]);

  const goToPage = useCallback(
    (idx: number) => {
      bumpManualPause();
      setPage(idx);
    },
    [bumpManualPause],
  );

  const autoplayAllowed =
    pages.length > 1 &&
    !reduceMotion &&
    !hoverInside &&
    !focusInside &&
    Date.now() >= manualPauseUntil;

  useEffect(() => {
    if (!autoplayAllowed) return;
    const id = window.setInterval(() => {
      setPage((p) => (p + 1) % pages.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [autoplayAllowed, pages.length]);

  useEffect(() => {
    if (manualPauseUntil <= 0) return;
    const remain = manualPauseUntil - Date.now();
    if (remain <= 0) return;
    const id = window.setTimeout(() => setManualPauseUntil(0), remain);
    return () => window.clearTimeout(id);
  }, [manualPauseUntil]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null || pages.length <= 1) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const threshold = 48;
      if (dx < -threshold) goNext();
      else if (dx > threshold) goPrev();
      touchStartX.current = null;
    },
    [pages.length, goNext, goPrev],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "Home") {
        e.preventDefault();
        goToPage(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goToPage(pages.length - 1);
      }
    },
    [goPrev, goNext, goToPage, pages.length],
  );

  const onFocusCapture = useCallback(() => setFocusInside(true), []);
  const onBlurCapture = useCallback((e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setFocusInside(false);
    }
  }, []);

  const transitionClass = reduceMotion ? "duration-0" : "duration-500 ease-out";

  if (loading) {
    return (
      <div
        className="w-full min-w-0 px-4 sm:px-8 md:px-12"
        aria-busy="true"
        aria-label="매거진 불러오는 중">
        <div className="mx-auto grid w-full max-w-8xl animate-pulse grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 md:gap-9 lg:grid-cols-3 lg:gap-10">
          {[0, 1, 2].map((k) => (
            <div key={k} className="border border-[#ece6dd] bg-[#faf8f6]">
              <div className="aspect-[16/10] w-full bg-[#ece6dd] sm:aspect-[16/9] md:aspect-auto md:h-[200px] lg:h-[210px]" />
              <div className="space-y-2 px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
                <div className="h-3 w-3/4 rounded bg-[#e5ddd4]" />
                <div className="h-2 w-full rounded bg-[#ece6dd]" />
                <div className="h-2 w-5/6 rounded bg-[#ece6dd]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[220px] w-full items-center justify-center sm:min-h-[300px] md:min-h-[400px]">
        <p className="text-[14px] tracking-[0.08em] text-[#9b8a72]">
          매거진이 없습니다.
        </p>
      </div>
    );
  }

  const showArrows = pages.length > 1;

  return (
    <section
      className="relative w-full min-w-0 overflow-x-clip"
      aria-labelledby="magazine-carousel-heading">
      <h2 id="magazine-carousel-heading" className="sr-only">
        매거진 하이라이트
      </h2>

      <div
        role="group"
        aria-roledescription="캐러셀"
        aria-label={`매거진 하이라이트, 슬라이드 ${pages.length}개`}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setHoverInside(true)}
        onMouseLeave={() => setHoverInside(false)}
        onFocusCapture={onFocusCapture}
        onBlurCapture={onBlurCapture}
        className="relative touch-pan-y">
        <p className="sr-only" aria-live="polite">
          {pages.length > 1
            ? `슬라이드 ${page + 1} / ${pages.length}`
            : "슬라이드 1개"}
        </p>

        {showArrows && (
          <>
            <button
              type="button"
              aria-label="이전 슬라이드"
              onClick={goPrev}
              className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full pl-1 text-[#5B3A1A] transition-opacity hover:opacity-80 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b8a72] focus-visible:ring-offset-2 sm:flex sm:items-center sm:justify-center sm:pl-2 md:pl-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ece6dd] bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-white">
                <ChevronLeft className="shrink-0" />
              </span>
            </button>
            <button
              type="button"
              aria-label="다음 슬라이드"
              onClick={goNext}
              className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full pr-1 text-[#5B3A1A] transition-opacity hover:opacity-80 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b8a72] focus-visible:ring-offset-2 sm:flex sm:items-center sm:justify-center sm:pr-2 md:pr-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ece6dd] bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-white">
                <ChevronRight className="shrink-0" />
              </span>
            </button>
          </>
        )}

        <div
          className="relative overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}>
          <div
            className={`flex w-full transition-transform ${transitionClass}`}
            style={{ transform: `translateX(-${page * 100}%)` }}>
            {pages.map((cards, idx) => (
              <div key={idx} className="w-full shrink-0 px-4 sm:px-8 md:px-12">
                <div className="mx-auto grid w-full max-w-8xl grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 md:gap-9 lg:grid-cols-3 lg:gap-10">
                  {cards.map((card) => (
                    <Link
                      key={card.id}
                      href="/magazine"
                      className="group block border border-[#ece6dd] bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b8a72] focus-visible:ring-offset-2">
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f3f3f3] sm:aspect-[16/9] md:aspect-auto md:h-[200px] lg:h-[210px]">
                        <Image
                          src={card.image_url}
                          alt=""
                          fill
                          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                      </div>
                      <div className="px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
                        <h3 className="text-[13px] font-normal leading-snug tracking-[0.02em] text-[#5B3A1A] sm:text-[12px]">
                          {card.title}
                        </h3>
                        <p className="mt-2 text-[11px] leading-relaxed tracking-[0.01em] text-[#9b8a72] sm:text-[10px]">
                          {card.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center px-4 pt-10 sm:pt-12 md:pt-14">
        <Link
          href="/magazine"
          className="inline-flex h-11 w-full max-w-xs items-center justify-center rounded-full border border-[#5B3A1A] px-8 text-[11px] tracking-[0.24em] !text-[#5B3A1A] transition-colors hover:bg-[#5B3A1A] hover:!text-white sm:w-auto sm:max-w-none sm:px-12">
          MAGAZINE NOW
        </Link>
      </div>
    </section>
  );
}
