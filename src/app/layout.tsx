import type { Metadata } from "next";
import "./globals.css";
import Header from "@/component/layout/header";
import Footer from "@/component/layout/footer";

export const metadata: Metadata = {
  title: "ATELIER RELIC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-500 text-white">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <div className="mx-auto flex h-full max-w-5xl items-center justify-center px-6">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
