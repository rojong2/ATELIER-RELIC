"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { useWishlistStore } from "@/store/wishlistStore";

type Address = {
  id: number;
  name: string;
  phone: string;
  postcode: string;
  address: string;
  detailAddress: string;
  isDefault: boolean;
};

type Profile = {
  name: string;
  email: string;
  phone: string;
};

type OrderItem = {
  id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
};

type Order = {
  id: number;
  order_number: string;
  status: string;
  recipient_name: string;
  recipient_phone: string;
  address: string;
  detail_address: string | null;
  total_product_price: number;
  delivery_fee: number;
  total_price: number;
  ordered_at: string;
  order_items: OrderItem[];
};

const ORDER_STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "결제대기", color: "bg-yellow-100 text-yellow-800" },
  paid: { label: "결제완료", color: "bg-blue-100 text-blue-800" },
  preparing: { label: "상품준비중", color: "bg-indigo-100 text-indigo-800" },
  shipping: { label: "배송중", color: "bg-purple-100 text-purple-800" },
  delivered: { label: "배송완료", color: "bg-green-100 text-green-800" },
  cancelled: { label: "주문취소", color: "bg-red-100 text-red-800" },
  refunded: { label: "환불완료", color: "bg-gray-100 text-gray-800" },
};

export default function MyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "profile" | "address" | "orders" | "wishlist"
  >("profile");

  const { items: wishlistItems, removeItem: removeWishlistItem } =
    useWishlistStore();

  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    phone: "",
  });
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileForm, setProfileForm] = useState<Profile>({
    name: "",
    email: "",
    phone: "",
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    postcode: "",
    address: "",
    detailAddress: "",
    isDefault: false,
  });

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (userError) {
        console.error("Error fetching user:", userError);
        setProfile({
          name: session.user.user_metadata?.name || "",
          email: session.user.email || "",
          phone: "",
        });
      } else if (userData) {
        setProfile({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
        });
      }

      const { data: addressData } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", session.user.id)
        .order("is_default", { ascending: false });

      if (addressData) {
        setAddresses(
          addressData.map((addr) => ({
            id: addr.id,
            name: addr.recipient_name,
            phone: addr.phone,
            postcode: addr.postcode,
            address: addr.address,
            detailAddress: addr.detail_address || "",
            isDefault: addr.is_default,
          }))
        );
      }

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (*)
        `
        )
        .eq("user_id", session.user.id)
        .order("ordered_at", { ascending: false });

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
      } else if (ordersData) {
        setOrders(ordersData as Order[]);
      }

      setIsLoading(false);
    };

    checkAuthAndFetchData();
  }, [router]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    const { error } = await supabase
      .from("users")
      .update({
        name: profileForm.name,
        phone: profileForm.phone,
      })
      .eq("id", session.user.id);

    if (error) {
      console.error("Error updating profile:", error);
      alert("프로필 수정에 실패했습니다.");
      return;
    }

    setProfile(profileForm);
    setShowProfileForm(false);
  };

  const handleEditProfile = () => {
    setProfileForm({ ...profile });
    setShowProfileForm(true);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    const addressData = {
      user_id: session.user.id,
      recipient_name: addressForm.name,
      phone: addressForm.phone,
      postcode: addressForm.postcode,
      address: addressForm.address,
      detail_address: addressForm.detailAddress,
      is_default: addressForm.isDefault,
    };

    if (editingId !== null) {
      const { error } = await supabase
        .from("addresses")
        .update(addressData)
        .eq("id", editingId);

      if (error) {
        console.error("Error updating address:", error);
        alert("배송지 수정에 실패했습니다.");
        return;
      }

      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingId
            ? { ...addressForm, id: editingId }
            : addressForm.isDefault
              ? { ...addr, isDefault: false }
              : addr
        )
      );
      setEditingId(null);
    } else {
      const { data, error } = await supabase
        .from("addresses")
        .insert(addressData)
        .select()
        .single();

      if (error) {
        console.error("Error adding address:", error);
        alert("배송지 추가에 실패했습니다.");
        return;
      }

      const newAddr: Address = {
        id: data.id,
        name: addressForm.name,
        phone: addressForm.phone,
        postcode: addressForm.postcode,
        address: addressForm.address,
        detailAddress: addressForm.detailAddress,
        isDefault: addressForm.isDefault,
      };

      setAddresses((prev) => {
        const updated = addressForm.isDefault
          ? prev.map((a) => ({ ...a, isDefault: false }))
          : prev;
        return [...updated, newAddr];
      });
    }

    setAddressForm({
      name: "",
      phone: "",
      postcode: "",
      address: "",
      detailAddress: "",
      isDefault: false,
    });
    setShowAddressForm(false);
  };

  const handleEdit = (addr: Address) => {
    setEditingId(addr.id);
    setAddressForm({
      name: addr.name,
      phone: addr.phone,
      postcode: addr.postcode,
      address: addr.address,
      detailAddress: addr.detailAddress,
      isDefault: addr.isDefault,
    });
    setShowAddressForm(true);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("addresses").delete().eq("id", id);

    if (error) {
      console.error("Error deleting address:", error);
      alert("배송지 삭제에 실패했습니다.");
      return;
    }

    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const tabClass = (tab: typeof activeTab) =>
    `px-6 py-3 text-[13px] tracking-[0.12em] transition ${
      activeTab === tab
        ? "border-b-2 border-[#5B3A1A] text-[#5B3A1A]"
        : "text-[#9b8a72] hover:text-[#5B3A1A]"
    }`;

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-[14px] tracking-[0.08em] text-[#9b8a72]">
          로딩 중...
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen justify-center bg-white px-6 py-24 text-[#5B3A1A] pt-70">
      <div className="w-full max-w-[800px]">
        <h1 className="mb-12 text-center text-[30px] font-bold tracking-[0.14em] pb-3">
          MY PAGE
        </h1>

        <div className="mb-10 flex justify-center gap-2 border-b border-[#ece6dd]">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={tabClass("profile")}>
            회원정보
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("address")}
            className={tabClass("address")}>
            배송지 관리
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={tabClass("orders")}>
            주문내역
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("wishlist")}
            className={tabClass("wishlist")}>
            관심상품
          </button>
        </div>

        {activeTab === "profile" && (
          <section className="space-y-8">
            <div className="rounded border border-[#ece6dd] p-8">
              <h2 className="mb-6 text-[15px] font-semibold tracking-[0.12em]">
                회원정보
              </h2>

              {showProfileForm ? (
                <form onSubmit={handleProfileSubmit}>
                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="profile-name"
                        className="block text-[12px] tracking-[0.12em] text-[#7b674f]">
                        이름 <span className="text-[#b9b0a2]">*</span>
                      </label>
                      <input
                        type="text"
                        id="profile-name"
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        required
                        className="mt-2 h-11 w-full border border-[#ece6dd] bg-white px-4 text-[12px] tracking-[0.12em] text-[#5B3A1A] outline-none focus:border-[#b9b0a2]"
                      />
                    </div>

                    <div className="h-4" aria-hidden="true" />

                    <div>
                      <label
                        htmlFor="profile-email"
                        className="block text-[12px] tracking-[0.12em] text-[#7b674f]">
                        이메일 <span className="text-[#b9b0a2]">*</span>
                      </label>
                      <input
                        type="email"
                        id="profile-email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        required
                        className="mt-2 h-11 w-full border border-[#ece6dd] bg-white px-4 text-[12px] tracking-[0.12em] text-[#5B3A1A] outline-none focus:border-[#b9b0a2]"
                      />
                    </div>

                    <div className="h-4" aria-hidden="true" />

                    <div>
                      <label
                        htmlFor="profile-phone"
                        className="block text-[12px] tracking-[0.12em] text-[#7b674f]">
                        연락처 <span className="text-[#b9b0a2]">*</span>
                      </label>
                      <input
                        type="tel"
                        id="profile-phone"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        required
                        placeholder="010-0000-0000"
                        className="mt-2 h-11 w-full border border-[#ece6dd] bg-white px-4 text-[12px] tracking-[0.12em] text-[#5B3A1A] outline-none focus:border-[#b9b0a2] placeholder:text-[#d0c6b9]"
                      />
                    </div>
                  </div>

                  <div className="h-4" aria-hidden="true" />

                  <div className="mt-8 flex gap-3">
                    <button
                      type="submit"
                      className="h-10 flex-1 rounded-full bg-[#b9b0a2] text-[12px] tracking-[0.18em] text-white transition hover:bg-[#a79d8d]">
                      수정 완료
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowProfileForm(false)}
                      className="h-10 flex-1 rounded-full border border-[#ece6dd] bg-white text-[12px] tracking-[0.18em] text-[#7b674f] transition hover:bg-[#faf7f2]">
                      취소
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="space-y-4 text-[13px] tracking-[0.08em]">
                    <div className="flex">
                      <span className="w-24 text-[#9b8a72]">이름</span>
                      <span>{profile.name}</span>
                    </div>
                    <div className="flex">
                      <span className="w-24 text-[#9b8a72]">이메일</span>
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex">
                      <span className="w-24 text-[#9b8a72]">연락처</span>
                      <span>{profile.phone}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleEditProfile}
                    className="mt-8 h-10 rounded-full border border-[#ece6dd] px-6 text-[12px] tracking-[0.12em] text-[#7b674f] transition hover:bg-[#faf7f2]">
                    회원정보 수정
                  </button>
                </>
              )}
            </div>
          </section>
        )}

        {activeTab === "address" && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold tracking-[0.12em] pt-5">
                배송지 목록
              </h2>
              {!showAddressForm && (
                <button
                  type="button"
                  onClick={() => {
                    setShowAddressForm(true);
                    setEditingId(null);
                    setAddressForm({
                      name: "",
                      phone: "",
                      postcode: "",
                      address: "",
                      detailAddress: "",
                      isDefault: false,
                    });
                  }}
                  className="h-9 rounded-full bg-[#b9b0a2] px-5 text-[12px] tracking-[0.12em] text-white transition hover:bg-[#a79d8d]">
                  새 배송지 추가
                </button>
              )}
            </div>

            {showAddressForm && (
              <form
                onSubmit={handleAddressSubmit}
                className="rounded border border-[#ece6dd] p-8">
                <h3 className="mb-6 text-[14px] font-semibold tracking-[0.12em]">
                  {editingId ? "배송지 수정" : "새 배송지 추가"}
                </h3>

                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="addr-name"
                      className="block text-[12px] tracking-[0.12em] text-[#7b674f]">
                      받는 분 <span className="text-[#b9b0a2]">*</span>
                    </label>
                    <input
                      type="text"
                      id="addr-name"
                      name="name"
                      value={addressForm.name}
                      onChange={handleAddressChange}
                      required
                      className="mt-2 h-11 w-full border border-[#ece6dd] bg-white px-4 text-[12px] tracking-[0.12em] text-[#5B3A1A] outline-none focus:border-[#b9b0a2]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="addr-phone"
                      className="block text-[12px] tracking-[0.12em] text-[#7b674f]">
                      연락처 <span className="text-[#b9b0a2]">*</span>
                    </label>
                    <input
                      type="tel"
                      id="addr-phone"
                      name="phone"
                      value={addressForm.phone}
                      onChange={handleAddressChange}
                      required
                      placeholder="010-0000-0000"
                      className="mt-2 h-11 w-full border border-[#ece6dd] bg-white px-4 text-[12px] tracking-[0.12em] text-[#5B3A1A] outline-none focus:border-[#b9b0a2] placeholder:text-[#d0c6b9]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="addr-postcode"
                      className="block text-[12px] tracking-[0.12em] text-[#7b674f]">
                      우편번호 <span className="text-[#b9b0a2]">*</span>
                    </label>
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        id="addr-postcode"
                        name="postcode"
                        value={addressForm.postcode}
                        onChange={handleAddressChange}
                        required
                        className="h-11 w-32 border border-[#ece6dd] bg-white px-4 text-[12px] tracking-[0.12em] text-[#5B3A1A] outline-none focus:border-[#b9b0a2]"
                      />
                      <button
                        type="button"
                        className="h-11 rounded border border-[#ece6dd] px-4 text-[11px] tracking-[0.12em] text-[#7b674f] transition hover:bg-[#faf7f2]">
                        주소 검색
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="addr-address"
                      className="block text-[12px] tracking-[0.12em] text-[#7b674f]">
                      주소 <span className="text-[#b9b0a2]">*</span>
                    </label>
                    <input
                      type="text"
                      id="addr-address"
                      name="address"
                      value={addressForm.address}
                      onChange={handleAddressChange}
                      required
                      className="mt-2 h-11 w-full border border-[#ece6dd] bg-white px-4 text-[12px] tracking-[0.12em] text-[#5B3A1A] outline-none focus:border-[#b9b0a2]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="addr-detail"
                      className="block text-[12px] tracking-[0.12em] text-[#7b674f]">
                      상세주소
                    </label>
                    <input
                      type="text"
                      id="addr-detail"
                      name="detailAddress"
                      value={addressForm.detailAddress}
                      onChange={handleAddressChange}
                      placeholder="상세주소 입력"
                      className="mt-2 h-11 w-full border border-[#ece6dd] bg-white px-4 text-[12px] tracking-[0.12em] text-[#5B3A1A] outline-none focus:border-[#b9b0a2] placeholder:text-[#d0c6b9]"
                    />
                  </div>

                  <label className="flex cursor-pointer items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={addressForm.isDefault}
                      onChange={handleAddressChange}
                      className="h-4 w-4 accent-[#b9b0a2]"
                    />
                    <span className="text-[12px] tracking-[0.08em] text-[#7b674f]">
                      기본 배송지로 설정
                    </span>
                  </label>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    type="submit"
                    className="h-10 flex-1 rounded-full bg-[#b9b0a2] text-[12px] tracking-[0.18em] text-white transition hover:bg-[#a79d8d]">
                    {editingId ? "수정 완료" : "등록"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddressForm(false);
                      setEditingId(null);
                    }}
                    className="h-10 flex-1 rounded-full border border-[#ece6dd] bg-white text-[12px] tracking-[0.18em] text-[#7b674f] transition hover:bg-[#faf7f2]">
                    취소
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div className="py-16 text-center text-[13px] tracking-[0.08em] text-[#9b8a72]">
                  등록된 배송지가 없습니다.
                </div>
              ) : (
                addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="rounded border border-[#ece6dd] p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="text-[14px] font-semibold tracking-[0.08em]">
                        {addr.name}
                      </span>
                      {addr.isDefault && (
                        <span className="rounded bg-[#b9b0a2] px-2 py-0.5 text-[10px] tracking-[0.08em] text-white">
                          기본배송지
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] tracking-[0.08em] text-[#7b674f]">
                      {addr.phone}
                    </p>
                    <p className="mt-2 text-[12px] tracking-[0.08em] text-[#7b674f]">
                      [{addr.postcode}] {addr.address} {addr.detailAddress}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(addr)}
                        className="h-8 rounded border border-[#ece6dd] px-4 text-[11px] tracking-[0.08em] text-[#7b674f] transition hover:bg-[#faf7f2]">
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(addr.id)}
                        className="h-8 rounded border border-[#ece6dd] px-4 text-[11px] tracking-[0.08em] text-[#7b674f] transition hover:bg-[#faf7f2]">
                        삭제
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {activeTab === "orders" && (
          <section>
            {orders.length === 0 ? (
              <div className="py-16 text-center text-[13px] tracking-[0.08em] text-[#9b8a72]">
                주문 내역이 없습니다.
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded border border-[#ece6dd] p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#ece6dd] pb-4">
                      <div>
                        <p className="text-[14px] font-semibold tracking-[0.08em] text-[#5B3A1A]">
                          {order.order_number}
                        </p>
                        <p className="mt-1 text-[11px] tracking-[0.08em] text-[#9b8a72]">
                          {new Date(order.ordered_at).toLocaleDateString(
                            "ko-KR",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <span
                        className={`rounded px-3 py-1 text-[11px] font-medium ${
                          ORDER_STATUS_MAP[order.status]?.color ||
                          "bg-gray-100 text-gray-800"
                        }`}>
                        {ORDER_STATUS_MAP[order.status]?.label || order.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {order.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-[13px]">
                          <div className="flex items-center gap-2">
                            <span className="text-[#5B3A1A]">
                              {item.product_name}
                            </span>
                            <span className="text-[#9b8a72]">
                              x {item.quantity}
                            </span>
                          </div>
                          <span className="text-[#5B3A1A]">
                            {item.subtotal.toLocaleString("ko-KR")}원
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 border-t border-[#ece6dd] pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-[#9b8a72]">
                          배송지: {order.address}{" "}
                          {order.detail_address && order.detail_address}
                        </span>
                        <span className="text-[14px] font-semibold text-[#5B3A1A]">
                          총 {order.total_price.toLocaleString("ko-KR")}원
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "wishlist" && (
          <section>
            {wishlistItems.length === 0 ? (
              <div className="py-16 text-center text-[13px] tracking-[0.08em] text-[#9b8a72]">
                관심상품이 없습니다.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded border border-[#ece6dd] p-4">
                    <Link href={`/shop/${item.id}`}>
                      <div className="relative mx-auto h-[180px] w-full bg-[#f5f5f5]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(min-width: 768px) 250px, 100vw"
                          className="object-contain"
                        />
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-[13px] tracking-[0.08em] text-[#5B3A1A]">
                          {item.name}
                        </p>
                        <p className="mt-1 text-[12px] tracking-[0.08em] text-[#7b674f]">
                          {item.price}
                        </p>
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeWishlistItem(item.id)}
                      className="mt-4 w-full rounded border border-[#ece6dd] py-2 text-[11px] tracking-[0.08em] text-[#7b674f] transition hover:bg-[#faf7f2]">
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
