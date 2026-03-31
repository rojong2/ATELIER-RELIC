import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Caudex } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"

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
        <Analytics />
        <SpeedInsights />
        <div className="flex min-h-screen min-w-0 flex-col overflow-x-clip">
          <Header />
          <main className="min-w-0 flex-1 overflow-x-clip">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
