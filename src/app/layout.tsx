import type { Metadata } from "next";
import localFont from "@next/font/local";
import "./globals.css";

const Electrica = localFont({
  src: [
    {
      path: "./fonts/electricamedium.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/electricamedium.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "neekcode",
  description: "questions that really matter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />

      <body className={Electrica.className}>{children}</body>
    </html>
  );
}
