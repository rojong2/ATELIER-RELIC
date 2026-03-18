"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function JoinPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validatePassword = (password: string): boolean => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLongEnough = password.length >= 8;

    if (!isLongEnough) {
      setPasswordError("비밀번호는 8자 이상이어야 합니다.");
      return false;
    }
    if (!hasLetter) {
      setPasswordError("영문을 포함해야 합니다.");
      return false;
    }
    if (!hasNumber) {
      setPasswordError("숫자를 포함해야 합니다.");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      if (value.length > 0) {
        validatePassword(value);
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validatePassword(form.password)) {
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!agreeTerms || !agreePrivacy) {
      setErrorMessage("필수 약관에 동의해주세요.");
      return;
    }

    setIsLoading(true);

    const cleanEmail = form.email.trim().toLowerCase();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: form.password,
        options: {
          data: {
            name: form.name.trim(),
          },
        },
      });

      setIsLoading(false);

      if (error) {
        console.error("Signup error:", error);
        if (error.message.includes("already registered")) {
          setErrorMessage("이미 가입된 이메일입니다.");
        } else if (error.message.includes("Invalid email")) {
          setErrorMessage("유효하지 않은 이메일 형식입니다.");
        } else if (error.message.includes("Password")) {
          setErrorMessage("비밀번호가 요구사항을 충족하지 않습니다.");
        } else {
          setErrorMessage(`회원가입 실패: ${error.message}`);
        }
        return;
      }

      if (data?.user?.identities?.length === 0) {
        setErrorMessage("이미 가입된 이메일입니다.");
        return;
      }

      if (data?.user) {
        alert("회원가입이 완료되었습니다. 로그인해주세요.");
        router.push("/login");
      } else {
        setErrorMessage("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Unexpected error:", err);
      setErrorMessage("예기치 않은 오류가 발생했습니다.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-24 text-[#5B3A1A]">
      <div className="w-full max-w-[420px]">
        <h1 className="mb-12 pb-7 text-center text-[30px] font-bold tracking-[0.14em] pt-23">
          JOIN
        </h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-[13px] tracking-[0.12em] text-[#7b674f]">
              이름 <span className="text-[#b9b0a2]">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-2 h-12 w-full border border-[#ece6dd] bg-white px-4 text-[12px] tracking-[0.12em] text-[#5B3A1A] outline-none focus:border-[#b9b0a2]"
            />
          </div>

          <div className="h-8" aria-hidden="true" />

          <div>
            <label
              htmlFor="email"
              className="block text-[13px] tracking-[0.12em] text-[#7b674f]">
              이메일 <span className="text-[#b9b0a2]">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-2 h-12 w-full border border-[#ece6dd] bg-white px-4 text-[12px] tracking-[0.12em] text-[#5B3A1A] outline-none focus:border-[#b9b0a2]"
            />
          </div>

          <div className="h-8" aria-hidden="true" />

          <div>
            <label
              htmlFor="password"
              className="block text-[13px] tracking-[0.12em] text-[#7b674f]">
              비밀번호 <span className="text-[#b9b0a2]">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className={`mt-2 h-12 w-full border bg-white px-4 text-[12px] tracking-[0.12em] text-[#5B3A1A] outline-none focus:border-[#b9b0a2] ${
                passwordError ? "border-red-400" : "border-[#ece6dd]"
              }`}
            />
            {passwordError ? (
              <p className="mt-2 text-[10px] tracking-[0.08em] text-red-500">
                {passwordError}
              </p>
            ) : (
              <p className="mt-2 text-[10px] tracking-[0.08em] text-[#9b8a72]">
                영문, 숫자를 포함한 8자 이상
              </p>
            )}
          </div>

          <div className="h-8" aria-hidden="true" />

          <div>
            <label
              htmlFor="passwordConfirm"
              className="block text-[13px] tracking-[0.12em] text-[#7b674f]">
              비밀번호 확인 <span className="text-[#b9b0a2]">*</span>
            </label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              required
              className="mt-2 h-12 w-full border border-[#ece6dd] bg-white px-4 text-[12px] tracking-[0.12em] text-[#5B3A1A] outline-none focus:border-[#b9b0a2]"
            />
          </div>

          <div className="h-8" aria-hidden="true" />

          <div className="mt-12 border-t border-[#ece6dd] pt-8">
            <p className="text-[13px] tracking-[0.12em] text-[#5B3A1A]">
              약관 동의
            </p>

            <div className="mt-6 space-y-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 accent-[#b9b0a2]"
                />
                <span className="text-[12px] tracking-[0.08em] text-[#7b674f]">
                  이용약관 동의 <span className="text-[#b9b0a2]">(필수)</span>
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="h-4 w-4 accent-[#b9b0a2]"
                />
                <span className="text-[12px] tracking-[0.08em] text-[#7b674f]">
                  개인정보 수집 및 이용 동의{" "}
                  <span className="text-[#b9b0a2]">(필수)</span>
                </span>
              </label>
            </div>
          </div>

          <div className="h-3" aria-hidden="true" />

          {errorMessage && (
            <p className="mt-4 text-center text-[12px] tracking-[0.08em] text-red-500">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-12 h-12 w-full rounded-full bg-[#b9b0a2] text-[15px] tracking-[0.18em] text-white transition hover:bg-[#a79d8d] disabled:cursor-not-allowed disabled:opacity-50">
            {isLoading ? "가입 중..." : "가입하기"}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 pt-7 text-[13px] tracking-[0.12em] text-[#9b8a72]">
          <span>이미 회원이신가요?</span>
          <Link href="/login" className="text-[#5B3A1A] hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </main>
  );
}
