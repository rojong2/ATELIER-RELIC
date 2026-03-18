"use client";

import { useState } from "react";

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

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "address" | "orders">(
    "profile",
  );

  const [profile, setProfile] = useState<Profile>({
    name: "홍길동",
    email: "example@email.com",
    phone: "010-1234-5678",
  });
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileForm, setProfileForm] = useState<Profile>({
    name: "",
    email: "",
    phone: "",
  });

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      name: "홍길동",
      phone: "010-1234-5678",
      postcode: "12345",
      address: "서울특별시 성동구 연무장길 12",
      detailAddress: "1층",
      isDefault: true,
    },
  ]);
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

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId !== null) {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingId
            ? { ...addressForm, id: editingId }
            : addressForm.isDefault
              ? { ...addr, isDefault: false }
              : addr,
        ),
      );
      setEditingId(null);
    } else {
      const newId = Math.max(0, ...addresses.map((a) => a.id)) + 1;
      setAddresses((prev) => {
        const updated = addressForm.isDefault
          ? prev.map((a) => ({ ...a, isDefault: false }))
          : prev;
        return [...updated, { ...addressForm, id: newId }];
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

  const handleDelete = (id: number) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const tabClass = (tab: typeof activeTab) =>
    `px-6 py-3 text-[13px] tracking-[0.12em] transition ${
      activeTab === tab
        ? "border-b-2 border-[#5B3A1A] text-[#5B3A1A]"
        : "text-[#9b8a72] hover:text-[#5B3A1A]"
    }`;

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
            <div className="py-16 text-center text-[13px] tracking-[0.08em] text-[#9b8a72]">
              주문 내역이 없습니다.
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
