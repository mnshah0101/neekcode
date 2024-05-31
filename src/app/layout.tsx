import type { Metadata } from "next";
import localFont from "@next/font/local";
import "./globals.css";
import Head from "next/head";

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
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>

      <body className={Electrica.className}>{children}</body>
    </html>
  );
}
