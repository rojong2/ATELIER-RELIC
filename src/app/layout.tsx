import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Caudex } from "next/font/google";

const caudex = Caudex({
  subsets: ["latin"],
  weight: ["400", "700"],
});

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
      <body
        className={`${caudex.className} min-h-screen bg-gray-500 text-white`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
