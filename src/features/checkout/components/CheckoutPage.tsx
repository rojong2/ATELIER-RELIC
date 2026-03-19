"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCartStore, CartItem } from "@/store/cartStore";
import { supabase } from "@/lib/supabase";
import {
  createOrder,
  getUserProfile,
  getDefaultAddress,
} from "../services/orderService";

type DeliveryMemo =
  | "배송메모를 선택해 주세요."
  | "부재 시 문 앞에 놓아주세요."
  | "부재 시 경비실에 맡겨주세요."
  | "배송 전 연락 바랍니다."
  | "직접 입력";

type PaymentMethod = "카드결제" | "무통장입금" | "카카오페이" | "네이버페이";

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const selectedItems = cartItems.filter((item) => item.selected);

  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [ordererName, setOrdererName] = useState("");
  const [ordererPhone, setOrdererPhone] = useState("");
  const [ordererEmail, setOrdererEmail] = useState("");

  const [sameAsOrderer, setSameAsOrderer] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [deliveryMemo, setDeliveryMemo] =
    useState<DeliveryMemo>("배송메모를 선택해 주세요.");
  const [customMemo, setCustomMemo] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("카드결제");

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePurchase, setAgreePurchase] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUserId(user.id);

          const profile = await getUserProfile(user.id);
          if (profile) {
            setOrdererName(profile.name || "");
            setOrdererPhone(profile.phone || "");
            setOrdererEmail(profile.email || "");
          }

          const defaultAddress = await getDefaultAddress(user.id);
          if (defaultAddress) {
            setRecipientName(defaultAddress.recipient_name || "");
            setRecipientPhone(defaultAddress.phone || "");
            setPostalCode(defaultAddress.postcode || "");
            setAddress(defaultAddress.address || "");
            setDetailAddress(defaultAddress.detail_address || "");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSameAsOrderer = (checked: boolean) => {
    setSameAsOrderer(checked);
    if (checked) {
      setRecipientName(ordererName);
      setRecipientPhone(ordererPhone);
    }
  };

  const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;

  const productTotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const shippingFee = 0;
  const totalPrice = productTotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ordererName || !ordererPhone || !ordererEmail) {
      alert("주문자 정보를 입력해 주세요.");
      return;
    }

    if (
      !recipientName ||
      !recipientPhone ||
      !postalCode ||
      !address ||
      !detailAddress
    ) {
      alert("배송 정보를 입력해 주세요.");
      return;
    }

    if (!agreeTerms || !agreePurchase) {
      alert("필수 약관에 동의해 주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const finalDeliveryMemo =
        deliveryMemo === "직접 입력"
          ? customMemo
          : deliveryMemo === "배송메모를 선택해 주세요."
            ? ""
            : deliveryMemo;

      const result = await createOrder({
        userId,
        ordererName,
        ordererPhone,
        ordererEmail,
        recipientName,
        recipientPhone,
        postcode: postalCode,
        address,
        detailAddress,
        deliveryMemo: finalDeliveryMemo,
        paymentMethod,
        items: selectedItems,
        totalProductPrice: productTotal,
        deliveryFee: shippingFee,
        totalPrice,
      });

      clearCart();
      alert(`주문이 완료되었습니다.\n주문번호: ${result.orderNumber}`);
      router.push("/my");
    } catch (error) {
      console.error("Order error:", error);
      alert("주문 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] pt-40">
        <div className="mx-auto max-w-[1200px] px-16 py-20 text-center">
          <h1 className="mb-10 text-[36px] font-bold tracking-wider text-[#5B3A1A]">
            결제하기
          </h1>
          <p className="text-lg text-[#9b8a72]">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf9f7] pt-40">
        <div className="mx-auto max-w-[1200px] px-16 py-20 text-center">
          <h1 className="mb-10 text-[36px] font-bold tracking-wider text-[#5B3A1A]">
            결제하기
          </h1>
          <p className="text-lg text-[#9b8a72]">
            장바구니에 선택된 상품이 없습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#faf9f7] pt-40">
      <div className="mx-auto w-full max-w-[1200px] px-16 py-16">
        <h1 className="mb-16 text-center font-bold tracking-wider text-[#5B3A1A] text-[36px] pb-10">
          결제하기
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-8">
            {/* Left Column - Forms */}
            <div className="flex-1 space-y-12">
              {/* 주문 상품 정보 */}
              <section className="rounded-sm border border-[#e8e4df] bg-white p-8">
                <h2 className="mb-8 text-[20px] font-bold text-[#5B3A1A] pb-3">
                  주문 상품 정보
                </h2>
                <div className="divide-y divide-[#e8e4df]">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="py-6 first:pt-0 last:pb-6">
                      <OrderItem item={item} />
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-[#e8e4df] pt-5">
                  <p className="text-base text-[#5B3A1A]">
                    배송비 <span className="text-[#a02c2c]">무료</span>
                  </p>
                </div>
              </section>

              <div className="h-8" aria-hidden="true" />

              {/* 주문자 정보 */}
              <section className="rounded-sm border border-[#e8e4df] bg-white p-8">
                <h2 className="mb-8 text-[20px] font-bold text-[#5B3A1A] pb-3">
                  주문자 정보
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    label="이름"
                    value={ordererName}
                    onChange={setOrdererName}
                    placeholder="이름"
                  />
                  <InputField
                    label="연락처"
                    value={ordererPhone}
                    onChange={setOrdererPhone}
                    placeholder="연락처"
                    type="tel"
                  />
                  <div className="sm:col-span-2">
                    <InputField
                      label="이메일"
                      value={ordererEmail}
                      onChange={setOrdererEmail}
                      placeholder="이메일"
                      type="email"
                    />
                  </div>
                </div>
              </section>

              <div className="h-8" aria-hidden="true" />

              {/* 배송 정보 */}
              <section className="rounded-sm border border-[#e8e4df] bg-white p-8">
                <h2 className="mb-8 text-[20px] font-bold text-[#5B3A1A] pb-3">
                  배송 정보
                </h2>

                <label className="mb-8 flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={sameAsOrderer}
                    onChange={(e) => handleSameAsOrderer(e.target.checked)}
                    className="h-5 w-5 rounded border-[#d1c9bc] text-[#5B3A1A] focus:ring-[#5B3A1A]"
                  />
                  <span className="text-base text-[#5B3A1A]">
                    주문자 정보와 동일
                  </span>
                </label>

                <div className="h-3" aria-hidden="true" />

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                      label="수령인"
                      value={recipientName}
                      onChange={setRecipientName}
                      placeholder="수령인"
                    />
                    <InputField
                      label="연락처"
                      value={recipientPhone}
                      onChange={setRecipientPhone}
                      placeholder="연락처"
                      type="tel"
                    />
                  </div>

                  <div className="h-4" aria-hidden="true" />

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <InputField
                        label="우편번호"
                        value={postalCode}
                        onChange={setPostalCode}
                        placeholder="우편번호"
                        readOnly
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPostalCode("06035");
                        setAddress("서울특별시 강남구 테헤란로");
                      }}
                      className="mt-7 h-12 whitespace-nowrap rounded-sm border border-[#5B3A1A] bg-white px-5 text-base text-[#5B3A1A] transition-colors hover:bg-[#5B3A1A] hover:text-white">
                      주소검색
                    </button>
                  </div>

                  <div className="h-4" aria-hidden="true" />

                  <InputField
                    label="주소"
                    value={address}
                    onChange={setAddress}
                    placeholder="주소"
                    readOnly
                  />

                  <div className="h-4" aria-hidden="true" />

                  <InputField
                    label="상세주소"
                    value={detailAddress}
                    onChange={setDetailAddress}
                    placeholder="상세주소"
                  />
                </div>

                <div className="h-4" aria-hidden="true" />

                <div className="mt-8">
                  <p className="mb-3 text-base font-medium text-[#5B3A1A]">
                    배송메모
                  </p>
                  <div className="h-3" aria-hidden="true" />
                  <select
                    value={deliveryMemo}
                    onChange={(e) =>
                      setDeliveryMemo(e.target.value as DeliveryMemo)
                    }
                    className="w-full rounded-sm border border-[#d1c9bc] bg-white px-5 py-4 text-base text-[#5B3A1A] outline-none focus:border-[#5B3A1A]">
                    <option value="배송메모를 선택해 주세요.">
                      배송메모를 선택해 주세요.
                    </option>
                    <option value="부재 시 문 앞에 놓아주세요.">
                      부재 시 문 앞에 놓아주세요.
                    </option>
                    <option value="부재 시 경비실에 맡겨주세요.">
                      부재 시 경비실에 맡겨주세요.
                    </option>
                    <option value="배송 전 연락 바랍니다.">
                      배송 전 연락 바랍니다.
                    </option>
                    <option value="직접 입력">직접 입력</option>
                  </select>
                  {deliveryMemo === "직접 입력" && (
                    <textarea
                      value={customMemo}
                      onChange={(e) => setCustomMemo(e.target.value)}
                      placeholder="배송 메모를 입력해 주세요."
                      className="mt-3 w-full resize-none rounded-sm border border-[#d1c9bc] bg-white px-5 py-4 text-base text-[#5B3A1A] outline-none focus:border-[#5B3A1A]"
                      rows={3}
                    />
                  )}
                </div>
              </section>
            </div>

            {/* Right Column - Sticky Summary */}
            <div className="lg:w-[380px]">
              <div className="lg:sticky lg:top-40">
                <div className="space-y-8">
                  {/* 주문 요약 */}
                  <section className="rounded-sm border border-[#e8e4df] bg-white p-8">
                    <h2 className="mb-8 text-[20px] font-bold text-[#5B3A1A] pb-3">
                      주문 요약
                    </h2>
                    <div className="space-y-4">
                      <div className="flex justify-between text-base">
                        <span className="text-[#9b8a72]">상품가격</span>
                        <span className="text-[#5B3A1A]">
                          {formatWon(productTotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-base">
                        <span className="text-[#9b8a72]">배송비</span>
                        <span className="text-[#5B3A1A]">무료</span>
                      </div>
                      <div className="border-t border-[#e8e4df] pt-4">
                        <div className="flex justify-between">
                          <span className="text-base font-medium text-[#5B3A1A]">
                            총 주문금액
                          </span>
                          <span className="text-xl font-semibold text-[#a02c2c]">
                            {formatWon(totalPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 결제수단 */}
                  <section className="rounded-sm border border-[#e8e4df] bg-white p-8">
                    <h2 className="mb-8 text-[20px] font-bold text-[#5B3A1A] pb-3">
                      결제수단
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          "카드결제",
                          "무통장입금",
                          "카카오페이",
                          "네이버페이",
                        ] as PaymentMethod[]
                      ).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`rounded-sm border px-5 py-4 text-base transition-colors ${
                            paymentMethod === method
                              ? "border-[#5B3A1A] bg-[#5B3A1A] text-white"
                              : "border-[#d1c9bc] bg-white text-[#5B3A1A] hover:border-[#5B3A1A]"
                          }`}>
                          {method}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* 이용 및 정보 제공 약관 */}
                  <section className="rounded-sm border border-[#e8e4df] bg-white p-8">
                    <h2 className="mb-5 text-[20px] font-bold text-[#5B3A1A] pb-3">
                      이용 및 정보 제공 약관
                    </h2>
                    <p className="mb-5 text-sm leading-relaxed text-[#9b8a72]">
                      결제 전 이용 및 정보 제공 약관 등의 내용을 확인하였으며
                      이에 동의합니다.
                    </p>
                    <div className="space-y-4">
                      <label className="flex cursor-pointer items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            className="h-5 w-5 rounded border-[#d1c9bc] text-[#5B3A1A] focus:ring-[#5B3A1A]"
                          />
                          <span className="text-base text-[#5B3A1A]">
                            개인정보 수집 및 이용 동의
                          </span>
                        </div>
                        <button
                          type="button"
                          className="text-sm text-[#9b8a72] underline hover:text-[#5B3A1A]">
                          자세히
                        </button>
                      </label>
                      <label className="flex cursor-pointer items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={agreePurchase}
                            onChange={(e) => setAgreePurchase(e.target.checked)}
                            className="h-5 w-5 rounded border-[#d1c9bc] text-[#5B3A1A] focus:ring-[#5B3A1A]"
                          />
                          <span className="text-base text-[#5B3A1A]">
                            구매조건 확인 및 결제진행 동의
                          </span>
                        </div>
                      </label>
                    </div>
                  </section>

                  {/* 결제하기 버튼 */}
                  <button
                    type="submit"
                    disabled={!agreeTerms || !agreePurchase || isSubmitting}
                    className="w-full rounded-sm bg-[#a02c2c] py-5 text-base font-medium tracking-wider text-white transition-colors hover:bg-[#8a2525] disabled:cursor-not-allowed disabled:bg-[#d1c9bc]">
                    {isSubmitting ? "처리 중..." : "결제하기"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function OrderItem({ item }: { item: CartItem }) {
  const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;

  return (
    <div className="flex gap-5">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-sm bg-[#f5f3ef]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center">
        <h3 className="text-base font-medium text-[#5B3A1A]">{item.name}</h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-sm bg-[#5B3A1A] px-2.5 py-1 text-sm text-white">
            필수
          </span>
          <span className="text-sm text-[#9b8a72]">{item.qty}개</span>
        </div>
        <p className="mt-2 text-base font-medium text-[#5B3A1A]">
          {formatWon(item.price * item.qty)}
        </p>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-base font-medium text-[#5B3A1A] sr-only">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full rounded-sm border border-[#d1c9bc] bg-white px-5 py-4 text-base text-[#5B3A1A] placeholder-[#9b8a72] outline-none focus:border-[#5B3A1A] ${
          readOnly ? "cursor-not-allowed bg-[#f5f3ef]" : ""
        }`}
      />
    </div>
  );
}
