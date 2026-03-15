import type { Metadata } from "next";
import "./globals.css";
import Header from "@/component/layout/header";

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
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
