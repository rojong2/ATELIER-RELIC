"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { type Product, formatPrice } from "@/lib/supabase";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

type TabKey = "detail" | "review" | "qna";

type Props = {
  product: Product;
};

export default function ProductDetail({ product }: Props) {
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState<TabKey>("detail");
  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<
    "택배" | "방문수령" | "퀵 서비스"
  >("택배");
  const [paymentMethod, setPaymentMethod] = useState<"선결제" | "착불">(
    "선결제",
  );
  const [showCartModal, setShowCartModal] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { items: wishlistItems, toggleItem } = useWishlistStore();
  const isLiked = wishlistItems.some((item) => item.id === product.id);

  const handleToggleLike = () => {
    toggleItem({
      id: product.id,
      name: product.name,
      price: formatPrice(product.price),
      image: product.image_url,
    });
  };

  const tabsStartRef = useRef<HTMLDivElement | null>(null);
  const detailRef = useRef<HTMLElement | null>(null);
  const reviewRef = useRef<HTMLElement | null>(null);
  const qnaRef = useRef<HTMLElement | null>(null);

  const crumb = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/shop", label: "All product" },
    ],
    [],
  );

  const unitPrice = product.price;
  const totalPrice = unitPrice * qty;

  const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: unitPrice,
        image: product.image_url,
      });
    }
    setShowCartModal(true);
  };

  const tabClass = (key: TabKey) =>
    [
      "px-0 pb-3 text-[12px] tracking-[0.12em] transition-colors",
      active === key ? "text-[#5B3A1A]" : "text-[#9b8a72] hover:text-[#5B3A1A]",
    ].join(" ");

  useEffect(() => {
    const startEl = tabsStartRef.current;
    const detailEl = detailRef.current;
    const reviewEl = reviewRef.current;
    const qnaEl = qnaRef.current;
    if (!startEl || !detailEl || !reviewEl || !qnaEl) return;

    const startObs = new IntersectionObserver(
      ([entry]) => setShowStickyTabs(!entry.isIntersecting),
      { root: null, threshold: 0 },
    );
    startObs.observe(startEl);

    const sectionObs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0),
          )[0];
        if (!visible) return;
        const id = (visible.target as HTMLElement).dataset.section as
          | TabKey
          | undefined;
        if (id) setActive(id);
      },
      { root: null, threshold: [0.25, 0.5, 0.75] },
    );

    [detailEl, reviewEl, qnaEl].forEach((el) => sectionObs.observe(el));

    return () => {
      startObs.disconnect();
      sectionObs.disconnect();
    };
  }, []);

  const scrollTo = (key: TabKey) => {
    const el =
      key === "detail"
        ? detailRef.current
        : key === "review"
          ? reviewRef.current
          : qnaRef.current;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-white pb-32 pt-10 text-[#5B3A1A]">
      <section className="mx-auto w-full max-w-8xl !px-50 pt-20 sm:px-6 lg:px-12">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-[15px] tracking-[0.12em] text-[#9b8a72] font-bold">
          <ol className="flex flex-wrap items-center gap-2">
            {crumb.map((c, idx) => (
              <li key={c.href} className="flex items-center gap-2">
                <Link href={c.href} className="hover:text-[#5B3A1A]">
                  {c.label}
                </Link>
                {idx < crumb.length - 1 ? <span>/</span> : null}
              </li>
            ))}
          </ol>
        </nav>

        {/* Top */}
        <div className="mx-auto grid gap-10 w-full md:grid-cols-[minmax(0,1fr)_550px] md:items-start pt-10">
          <div className="relative mx-auto h-[490px] w-full max-w-[610px] overflow-hidden md:ml-auto md:mr-0">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 768px) 60vw, 90vw"
              className="object-contain"
            />
          </div>

          <div className="mx-auto w-full max-w-[420px] border border-transparent md:mx-0 md:ml-0 md:pt-1">
            <div className="flex items-start justify-between gap-6 pb-15">
              <div>
                <h1 className="text-[17px] font-bold ">
                  {product.name.toUpperCase()}
                </h1>
                <p className="pt-3 text-[14px] tracking-[0.12em] text-[#7b674f]">
                  {formatWon(product.price)}
                </p>
              </div>
              <button
                type="button"
                aria-label="Share"
                className="mt-1 h-8 w-8 rounded-full border border-[#ece6dd] text-[#9b8a72] hover:text-[#5B3A1A]">
                <Image src="/share.png" alt="Share" width={16} height={16} />
              </button>
            </div>

            <div className="mt-6 h-px w-full bg-[#ece6dd]" />

            <div className="mt-10 space-y-2 text-[15px] leading-relaxed  text-[#9b8a72] pt-7 pb-10">
              <p>Origin: {product.origin}</p>
              <p className="pt-3">Era: {product.era}</p>
            </div>

            {deliveryMethod === "택배" && (
              <div className="mt-8 text-[13px] tracking-[0.12em] text-[#7b674f]">
                <span className="font-semibold text-[#5B3A1A]">배송비</span>{" "}
                무료 (50,000원 이상 무료배송)
              </div>
            )}

            {deliveryMethod === "퀵 서비스" && (
              <div className="mt-8 text-[13px] tracking-[0.12em] text-[#7b674f]">
                <span className="font-semibold text-[#5B3A1A]">배송비</span>{" "}
                착불
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-2">
              <div className="relative">
                <select
                  value={deliveryMethod}
                  onChange={(e) =>
                    setDeliveryMethod(
                      e.target.value as "택배" | "방문수령" | "퀵 서비스",
                    )
                  }
                  className="h-10 w-full appearance-none border border-[#ece6dd] bg-white px-3 pr-9 text-[13px] tracking-[0.12em] text-[#7b674f] outline-none">
                  <option value="택배">택배</option>
                  <option value="방문수령">방문수령</option>
                  <option value="퀵 서비스">퀵 서비스</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9b8a72]">
                  ▾
                </span>
              </div>

              {deliveryMethod === "택배" && (
                <div className="relative">
                  <select
                    value={`배송비(${paymentMethod})`}
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value.includes("선결제") ? "선결제" : "착불",
                      )
                    }
                    className="h-10 w-full appearance-none border border-[#ece6dd] bg-white px-3 pr-9 text-[13px] tracking-[0.12em] text-[#7b674f] outline-none">
                    <option value="배송비(선결제)">배송비(선결제)</option>
                    <option value="배송비(착불)">배송비(착불)</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9b8a72]">
                    ▾
                  </span>
                </div>
              )}

              {deliveryMethod === "방문수령" && (
                <button
                  type="button"
                  className="h-10 border border-[#ece6dd] bg-white text-[13px] tracking-[0.12em] text-[#7b674f] hover:bg-[#faf7f2]">
                  {/* TODO: 위치확인 버튼 회원정보의 배송지 정보에서 가져오기 */}
                  위치확인
                </button>
              )}
            </div>

            <div className="pt-8 border-t border-[#ece6dd] bg-[#3d3d3d08] py-6">
              <div className="flex items-center justify-between px-4 pb-3">
                <span className="text-[13px] tracking-[0.12em] text-[#7b674f]">
                  수량
                </span>
                <span className="text-[13px] tracking-[0.12em] text-[#7b674f]">
                  {formatWon(unitPrice)}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between px-4">
                <div className="inline-flex items-center overflow-hidden border border-[#ece6dd] bg-white">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="h-9 w-9 text-[#7b674f] hover:bg-[#faf7f2]">
                    -
                  </button>
                  <div className="h-9 min-w-10 border-x border-[#ece6dd] text-center text-[13px] leading-9 text-[#5B3A1A]">
                    {qty}
                  </div>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="h-9 w-9 text-[#7b674f] hover:bg-[#faf7f2]">
                    +
                  </button>
                </div>
                <div className="text-[13px] tracking-[0.12em] text-[#7b674f]">
                  {formatWon(totalPrice)}
                </div>
              </div>
            </div>

            <div className="pt-13 flex items-center justify-between text-[13px] tracking-[0.12em]">
              <span className="text-[#7b674f]">총 상품금액({qty}개)</span>
              <span className="text-[#7b674f]">{formatWon(totalPrice)}</span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 pt-11">
              {/* TODO: 구매하기 버튼 클릭 시 로그인 확인 후 로그인 안되있으면 로그인 페이지로 이동 되있으면 구매 페이지로 이동*/}
              <button
                type="button"
                className="h-11 rounded-full bg-[#b9b0a2] text-[13px] tracking-[0.18em] text-white hover:bg-[#a79d8d]">
                구매하기
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                className="h-11 rounded-full border border-[#ece6dd] bg-white text-[13px] tracking-[0.18em] text-[#5B3A1A] hover:bg-[#faf7f2]">
                장바구니
              </button>
              <button
                type="button"
                onClick={handleToggleLike}
                className={`flex h-11 items-center justify-center gap-2 rounded-full border text-[13px] tracking-[0.18em] transition ${
                  isLiked
                    ? "border-[#e74c3c] bg-[#e74c3c] text-white hover:bg-[#c0392b]"
                    : "border-[#ece6dd] bg-white text-[#5B3A1A] hover:bg-[#faf7f2]"
                }`}>
                <span aria-hidden>{isLiked ? "♥" : "♡"}</span>
                <span className={isLiked ? "text-white" : "text-[#7b674f]"}>
                  {isLiked ? 1 : 0}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div
          ref={tabsStartRef}
          className="mx-auto mt-16 w-full border-b border-[#ece6dd] bg-white pt-20">
          <div className="mx-auto flex w-full items-center justify-center gap-10 px-4 py-5 text-[20px] tracking-[0.12em] text-[#9b8a72] font-bold">
            <button
              type="button"
              onClick={() => scrollTo("detail")}
              className={tabClass("detail")}>
              상세정보
            </button>
            <span className="text-[#d8cdbf]">/</span>
            <button
              type="button"
              onClick={() => scrollTo("review")}
              className={tabClass("review")}>
              구매평 (0)
            </button>
            <span className="text-[#d8cdbf]">/</span>
            <button
              type="button"
              onClick={() => scrollTo("qna")}
              className={tabClass("qna")}>
              Q&amp;A (0)
            </button>
          </div>
        </div>

        <div
          className={`sticky top-0 z-40 border-y border-[#ece6dd] bg-white/95 backdrop-blur transition-opacity ${
            showStickyTabs ? "opacity-100" : "pointer-events-none opacity-0"
          }`}>
          <div className="mx-auto flex max-w-4xl items-center justify-center gap-10 px-4 py-5 text-[12px] tracking-[0.12em] text-[#9b8a72]">
            <button
              type="button"
              onClick={() => scrollTo("detail")}
              className={tabClass("detail")}>
              상세정보
            </button>
            <span className="text-[#d8cdbf]">/</span>
            <button
              type="button"
              onClick={() => scrollTo("review")}
              className={tabClass("review")}>
              구매평 (0)
            </button>
            <span className="text-[#d8cdbf]">/</span>
            <button
              type="button"
              onClick={() => scrollTo("qna")}
              className={tabClass("qna")}>
              Q&amp;A (0)
            </button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-8xl pb-14">
          <section
            ref={detailRef}
            data-section="detail"
            className="scroll-mt-10">
            <div className="space-y-10 text-[12px] leading-[2.0] tracking-[0.12em] text-[#7b674f]">
              <div className="space-y-4">
                <p className="text-[#5B3A1A] text-[15px] font-bold pb-3">
                  &lt;교환 및 반품 가능 기간&gt;
                </p>
                <ul className="list-disc space-y-3 pl-5 text-[13px]">
                  <li>
                    - 계약내용에 관한 서면을 받은 날부터 7일. 다만, 그 서면을
                    받은 때보다 재화등의 공급이 늦게 이루어진 경우에는 재화등을
                    공급받거나 재화등의 공급이 시작된 날부터 7일
                  </li>
                  <li>
                    - 공급받은 상품 및 용역의 내용이 표시﹒광고의 내용과
                    다르거나 계약내용과 다르게 이행된 경우에는 그 재화등을
                    공급받은 날 부터 3개월 이내, 그 사실을 안 날 또는 알 수
                    있었던 날부터 30일이내
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section
            ref={reviewRef}
            data-section="review"
            className="mt-20 scroll-mt-10 pt-15">
            <div className="space-y-8">
              <div>
                <h2 className="text-[15px] font-semibold tracking-[0.12em] text-[#5B3A1A] pb-2">
                  구매평 (0)
                </h2>
                <p className="mt-2 text-[13px] tracking-[0.12em] text-[#9b8a72] pb-2">
                  상품을 구매하신 분들이 작성한 리뷰입니다.
                </p>
                <button
                  type="button"
                  disabled
                  className="mt-5 h-9 rounded-full border border-[#ece6dd] px-5 text-[11px] tracking-[0.14em] text-[#d0c6b9]">
                  구매평 작성
                </button>
              </div>

              <div className="h-px w-full bg-[#ece6dd]" />

              <div className="py-24 text-center text-[12px] tracking-[0.12em] text-[#bfb6aa]">
                등록된 구매평이 없습니다.
              </div>
            </div>
          </section>

          <section
            ref={qnaRef}
            data-section="qna"
            className="mt-20 scroll-mt-10">
            <div className="space-y-8">
              <div>
                <h2 className="text-[15px] font-semibold tracking-[0.12em] text-[#5B3A1A] pb-2">
                  Q&amp;A (0)
                </h2>
                <p className="mt-2 text-[13px] tracking-[0.12em] text-[#9b8a72] pb-2">
                  구매하시려는 상품에 대해 궁금한 점이 있으면 문의주세요.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {/* TODO: 버튼 클릭 시 로그인 확인 후 로그인 안되있으면 로그인 페이지로 이동 되있으면 문의 페이지로 이동*/}
                  <button
                    type="button"
                    disabled
                    className="h-9 rounded-full border border-[#ece6dd] px-5 text-[11px] tracking-[0.14em] text-[#d0c6b9]">
                    상품문의
                  </button>
                  <button
                    type="button"
                    className="h-9 rounded-full border border-[#ece6dd] bg-white px-5 text-[11px] tracking-[0.14em] text-[#5B3A1A] hover:bg-[#faf7f2]">
                    1:1 문의
                  </button>
                </div>
              </div>

              <div className="h-px w-full bg-[#ece6dd]" />

              <div className="py-24 text-center text-[12px] tracking-[0.12em] text-[#bfb6aa]">
                등록된 문의가 없습니다.
              </div>
            </div>
          </section>
        </div>
      </section>

      {showCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-[360px] rounded-[10px] bg-white p-8 text-center">
            <p className="text-[14px] tracking-[0.08em] text-[#5B3A1A]">
              선택하신 상품을 장바구니에 담았습니다.
            </p>
            <div className="h-4" aria-hidden="true" />
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setShowCartModal(false)}
                className="h-10 flex-1 rounded-full border border-[#ece6dd] bg-white text-[12px] tracking-[0.12em] text-[#7b674f] transition hover:bg-[#faf7f2]">
                계속쇼핑
              </button>
              <Link
                href="/cart"
                className="flex h-10 flex-1 items-center justify-center rounded-full bg-[#b9b0a2] text-[12px] tracking-[0.12em] text-white transition hover:bg-[#a79d8d]">
                장바구니
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
