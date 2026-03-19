"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const router = useRouter();
  const {
    items: cartItems,
    removeItem,
    updateQty,
    toggleSelect,
    toggleSelectAll,
    removeSelected,
  } = useCartStore();

  const [allSelected, setAllSelected] = useState(true);

  const totalCount = cartItems.length;
  const selectedItems = cartItems.filter((item) => item.selected);
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const deliveryFee = 0;
  const finalPrice = totalPrice + deliveryFee;

  const handleSelectAll = () => {
    const newState = !allSelected;
    setAllSelected(newState);
    toggleSelectAll(newState);
  };

  const handleSelectItem = (id: number) => {
    toggleSelect(id);
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item,
    );
    setAllSelected(updatedItems.every((item) => item.selected));
  };

  const handleDeleteSelected = () => {
    removeSelected();
    setAllSelected(true);
  };

  const formatPrice = (price: number) => price.toLocaleString("ko-KR");

  return (
    <main className="flex min-h-screen justify-center bg-white px-6 py-24 pt-60 text-[#5B3A1A]">
      <div className="w-full max-w-[1100px]">
        <div className="mb-8 flex items-center gap-3">
          <h1 className="text-[28px] tracking-[0.08em]">장바구니</h1>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d0c6b9] text-[11px] text-white">
            {totalCount}
          </span>
        </div>

        <div className="border-t border-[#5B3A1A]">
          <div className="grid grid-cols-[auto_1fr_140px_140px_120px] items-center gap-4 border-b border-[#ece6dd] py-4 text-[12px] tracking-[0.08em] text-[#7b674f]">
            <input
              type="checkbox"
              checked={allSelected && cartItems.length > 0}
              onChange={handleSelectAll}
              disabled={cartItems.length === 0}
              className="h-4 w-4 accent-[#5B3A1A]"
            />
            <span>상품 정보</span>
            <span className="text-center">수량</span>
            <span className="text-center">주문금액</span>
            <span className="text-center">배송 정보</span>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="mb-6 h-16 w-16 text-[#d0c6b9]">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              <p className="text-[13px] tracking-[0.08em] text-[#9b8a72]">
                장바구니가 비어있습니다.
              </p>
            </div>
          ) : (
            <div>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[auto_1fr_140px_140px_120px] items-center gap-4 border-b border-[#ece6dd] py-6">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => handleSelectItem(item.id)}
                    className="h-4 w-4 accent-[#5B3A1A]"
                  />
                  <div className="flex items-center gap-4">
                    <div className="relative h-[72px] w-[72px] bg-[#f5f5f5]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="72px"
                        className="object-contain"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] tracking-[0.08em]">
                        {item.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-[#9b8a72] hover:text-[#5B3A1A]">
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="inline-flex items-center border border-[#ece6dd]">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, -1)}
                        className="flex h-8 w-8 items-center justify-center text-[#7b674f] hover:bg-[#faf7f2]">
                        −
                      </button>
                      <div className="flex h-8 w-10 items-center justify-center border-x border-[#ece6dd] text-[13px] text-[#5B3A1A]">
                        {item.qty}
                      </div>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, 1)}
                        className="flex h-8 w-8 items-center justify-center text-[#7b674f] hover:bg-[#faf7f2]">
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[14px] font-medium">
                      {formatPrice(item.price * item.qty)}원
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-[12px]">
                    <div className="flex items-center gap-1">
                      <span className="text-[#5B3A1A]">무료</span>
                      <span className="text-[#d0c6b9]">ⓘ</span>
                    </div>
                    <span className="text-[#9b8a72]">택배</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-8" aria-hidden="true" />

        {cartItems.length > 0 && (
          <>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={handleDeleteSelected}
                className="rounded border border-[#ece6dd] px-4 py-2 text-[11px] tracking-[0.08em] text-[#7b674f] hover:bg-[#faf7f2]">
                선택 삭제
              </button>
              <button
                type="button"
                className="rounded border border-[#ece6dd] px-4 py-2 text-[11px] tracking-[0.08em] text-[#7b674f] hover:bg-[#faf7f2]">
                품절 삭제
              </button>
            </div>

            <div className="h-8" aria-hidden="true" />

            <div className="mt-10 border-t border-[#ece6dd] pt-8">
              <p className="text-[13px] tracking-[0.08em] text-[#5B3A1A]">
                총 주문 상품 {selectedItems.length}개
              </p>

              <div className="mt-8 flex items-center justify-center gap-6 text-center">
                <div>
                  <p className="text-[20px] font-medium tracking-[0.04em]">
                    {formatPrice(totalPrice)}원
                  </p>
                  <p className="mt-1 text-[11px] tracking-[0.08em] text-[#9b8a72]">
                    상품금액
                  </p>
                </div>
                <span className="text-[18px] text-[#9b8a72]">+</span>
                <div>
                  <p className="text-[20px] font-medium tracking-[0.04em]">
                    무료
                  </p>
                  <p className="mt-1 text-[11px] tracking-[0.08em] text-[#9b8a72]">
                    배송비
                  </p>
                </div>
                <span className="text-[18px] text-[#9b8a72]">=</span>
                <div>
                  <p className="text-[20px] font-medium tracking-[0.04em] text-[#5B3A1A]">
                    {formatPrice(finalPrice)}원
                  </p>
                  <p className="mt-1 text-[11px] tracking-[0.08em] text-[#9b8a72]">
                    총 주문금액
                  </p>
                </div>
              </div>

              <div className="h-8" aria-hidden="true" />

              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => router.push("/checkout")}
                  disabled={selectedItems.length === 0}
                  className="h-12 w-[280px] rounded-full bg-[#b9b0a2] text-[14px] tracking-[0.18em] text-white transition hover:bg-[#a79d8d] disabled:cursor-not-allowed disabled:bg-[#d0c6b9]">
                  주문하기
                </button>
              </div>

              <div className="h-8" aria-hidden="true" />
            </div>
          </>
        )}

        <div className="mt-10 flex justify-center border-t border-[#ece6dd] pt-8">
          <Link
            href="/shop"
            className="text-[13px] tracking-[0.08em] text-[#5B3A1A] underline underline-offset-4 hover:text-[#7b674f]">
            계속 쇼핑하기
          </Link>
        </div>
      </div>
    </main>
  );
}
