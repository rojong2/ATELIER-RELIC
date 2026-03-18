"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
        } else if (error.message.includes("Email not confirmed")) {
          setErrorMessage("이메일 인증이 필요합니다. 이메일을 확인해주세요.");
        } else {
          setErrorMessage(`로그인 실패: ${error.message}`);
        }
        setIsLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setErrorMessage("예기치 않은 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-24 text-[#5B3A1A]">
      <div className="w-full max-w-[420px]">
        <h1 className="mb-12 pb-5 text-center text-[30px] font-bold tracking-[0.14em]">
          LOGIN
        </h1>

        <form onSubmit={handleSubmit} className="space-y-16">
          <div>
            <label
              htmlFor="email"
              className="block text-[13px] tracking-[0.12em] text-[#7b674f]">
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 h-12 w-full border border-[#ece6dd] bg-white px-4 text-[12px] tracking-[0.12em] text-[#5B3A1A] outline-none focus:border-[#b9b0a2]"
            />
          </div>

          <div className="h-8" aria-hidden="true" />

          <div>
            <label
              htmlFor="password"
              className="block text-[13px] tracking-[0.12em] text-[#7b674f]">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2  h-12 w-full border border-[#ece6dd] bg-white px-4 text-[12px] tracking-[0.12em] text-[#5B3A1A] outline-none focus:border-[#b9b0a2]"
            />
          </div>

          <div className="h-8" aria-hidden="true" />

          {errorMessage && (
            <p className="text-center text-[12px] tracking-[0.08em] text-red-500">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-10 h-12 w-full rounded-full bg-[#b9b0a2] text-[15px] tracking-[0.18em] text-white transition hover:bg-[#a79d8d] disabled:cursor-not-allowed disabled:opacity-50">
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-4 text-[13px] tracking-[0.12em] text-[#9b8a72] pt-7">
          <Link href="/join" className="hover:text-[#5B3A1A]">
            회원가입
          </Link>
          <span>|</span>
          <Link href="/find-id" className="hover:text-[#5B3A1A]">
            아이디 찾기
          </Link>
          <span>|</span>
          <Link href="/find-password" className="hover:text-[#5B3A1A]">
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </main>
  );
}
