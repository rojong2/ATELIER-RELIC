"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 로그인 로직 구현
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

          <button
            type="submit"
            className="mt-10 h-12 w-full rounded-full bg-[#b9b0a2] text-[15px] tracking-[0.18em] text-white hover:bg-[#a79d8d] transition">
            로그인
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
