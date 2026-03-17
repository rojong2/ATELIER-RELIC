"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { Product } from "@/data/products";

type TabKey = "detail" | "review" | "qna";

type Props = {
  product: Product;
};

export default function ProductDetail({ product }: Props) {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<TabKey>("detail");

  const crumb = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/shop", label: "All product" },
    ],
    [],
  );

  const unitPrice = useMemo(() => {
    const n = Number(product.price.replace(/[^\d]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [product.price]);

  const totalPrice = unitPrice * qty;

  const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;

  const tabClass = (key: TabKey) =>
    [
      "px-0 pb-3 text-[12px] tracking-[0.12em] transition-colors",
      tab === key ? "text-[#5B3A1A]" : "text-[#9b8a72] hover:text-[#5B3A1A]",
    ].join(" ");

  return (
    <main className="min-h-screen bg-white pb-32 pt-36 text-[#5B3A1A]">
      <section className="mx-auto w-full max-w-6xl px-4 pt-20 sm:px-6 lg:px-12">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-[11px] tracking-[0.12em] text-[#9b8a72]">
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
        <div className="mx-auto grid w-full gap-10 md:grid-cols-[minmax(0,1fr)_420px] md:items-start">
          <div className="relative mx-auto h-[520px] w-full max-w-[760px] overflow-hidden bg-[#e9e9e9] md:mx-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 768px) 60vw, 90vw"
              className="object-contain p-10"
            />
          </div>

          <div className="mx-auto w-full max-w-[420px] border border-transparent md:mx-0 md:pt-1">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h1 className="text-[14px] font-semibold tracking-[0.14em]">
                  {product.name.toUpperCase()}
                </h1>
                <p className="mt-4 text-[13px] tracking-[0.12em] text-[#7b674f]">
                  {product.price}
                </p>
              </div>
              <button
                type="button"
                aria-label="Share"
                className="mt-1 h-8 w-8 rounded-full border border-[#ece6dd] text-[#9b8a72] hover:text-[#5B3A1A]">
                ⤴
              </button>
            </div>

            <div className="mt-10 space-y-2 text-[12px] leading-relaxed tracking-[0.12em] text-[#9b8a72]">
              <p>Origin: {product.origin}</p>
              <p>Era: {product.era}</p>
            </div>

            <div className="mt-8 text-[11px] tracking-[0.12em] text-[#7b674f]">
              <span className="font-semibold text-[#5B3A1A]">배송비</span> 무료
              (0원 이상 무료배송)
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <div className="relative">
                <select className="h-10 w-full appearance-none rounded border border-[#ece6dd] bg-white px-3 pr-9 text-[11px] tracking-[0.12em] text-[#7b674f] outline-none">
                  <option>택배</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9b8a72]">
                  ▾
                </span>
              </div>
              <div className="relative">
                <select className="h-10 w-full appearance-none rounded border border-[#ece6dd] bg-white px-3 pr-9 text-[11px] tracking-[0.12em] text-[#7b674f] outline-none">
                  <option>배송비(선결제)</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9b8a72]">
                  ▾
                </span>
              </div>
            </div>

            <div className="mt-8 border-t border-[#ece6dd] pt-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] tracking-[0.12em] text-[#7b674f]">
                  수량
                </span>
                <span className="text-[11px] tracking-[0.12em] text-[#7b674f]">
                  {formatWon(unitPrice)}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="inline-flex items-center overflow-hidden rounded border border-[#ece6dd]">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="h-9 w-9 text-[#7b674f] hover:bg-[#faf7f2]">
                    -
                  </button>
                  <div className="h-9 min-w-10 border-x border-[#ece6dd] text-center text-[11px] leading-9 text-[#5B3A1A]">
                    {qty}
                  </div>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="h-9 w-9 text-[#7b674f] hover:bg-[#faf7f2]">
                    +
                  </button>
                </div>
                <div className="text-[11px] tracking-[0.12em] text-[#7b674f]">
                  {formatWon(totalPrice)}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between text-[11px] tracking-[0.12em]">
              <span className="text-[#7b674f]">총 상품금액({qty}개)</span>
              <span className="text-[#7b674f]">{formatWon(totalPrice)}</span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-2">
              <button
                type="button"
                className="h-11 rounded-full bg-[#b9b0a2] text-[11px] tracking-[0.18em] text-white hover:bg-[#a79d8d]">
                구매하기
              </button>
              <button
                type="button"
                className="h-11 rounded-full border border-[#ece6dd] bg-white text-[11px] tracking-[0.18em] text-[#5B3A1A] hover:bg-[#faf7f2]">
                장바구니
              </button>
              <button
                type="button"
                className="flex h-11 items-center justify-center gap-2 rounded-full border border-[#ece6dd] bg-white text-[11px] tracking-[0.18em] text-[#5B3A1A] hover:bg-[#faf7f2]">
                ♡ <span className="text-[#7b674f]">0</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20 border-b border-[#ece6dd]">
          <div className="flex gap-10">
            <button
              type="button"
              onClick={() => setTab("detail")}
              className={tabClass("detail")}>
              상세정보
            </button>
            <button
              type="button"
              onClick={() => setTab("review")}
              className={tabClass("review")}>
              구매평
            </button>
            <button
              type="button"
              onClick={() => setTab("qna")}
              className={tabClass("qna")}>
              Q&amp;A
            </button>
          </div>
        </div>

        <div className="mt-10">
          {tab === "detail" ? (
            <div className="space-y-6 text-[11px] leading-[2.0] tracking-[0.12em] text-[#7b674f]">
              <p className="text-[#9b8a72]">상품 이미지</p>
              <div className="h-px w-full bg-[#ece6dd]" />
              <div className="space-y-3">
                <p className="text-[#5B3A1A]">&lt;교환 및 반품 가능 기간&gt;</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    계약내용에 관한 서면을 받은 날부터 7일. 다만, 그 서면을 받은
                    때보다 재화등의 공급이 늦게 이루어진 경우에는 재화등을
                    공급받거나 재화등의 공급이 시작된 날부터 7일
                  </li>
                  <li>
                    공급받은 상품 및 용역의 내용이 표시﹒광고의 내용과 다르거나
                    계약내용과 다르게 이행된 경우에는 그 재화등을 공급받은 날
                    부터 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날부터
                    30일이내
                  </li>
                </ul>
              </div>
            </div>
          ) : tab === "review" ? (
            <div className="text-[11px] tracking-[0.12em] text-[#7b674f]">
              구매평
            </div>
          ) : (
            <div className="text-[11px] tracking-[0.12em] text-[#7b674f]">
              Q&amp;A
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
