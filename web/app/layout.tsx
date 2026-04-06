import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "../styles/globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "Todo DApp",
  description: "Chain-based Task Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={notoSans.variable}>
      <body className="min-h-full flex flex-col font-sans text-[16px] md:text-[17px] antialiased">
        {children}
      </body>
    </html>
  );
}
