"use client";

import dynamic from "next/dynamic";

const CheckoutPage = dynamic(
  () => import("@/features/checkout/components/CheckoutPage"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#faf9f7]">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h1 className="mb-8 text-2xl font-light tracking-wider text-[#5B3A1A]">
            결제하기
          </h1>
          <p className="text-[#9b8a72]">로딩 중...</p>
        </div>
      </div>
    ),
  }
);

export default function Page() {
  return <CheckoutPage />;
}
