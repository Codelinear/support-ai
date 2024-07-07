import type { Metadata } from "next";
import { graphik } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Support AI",
  description: "",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={graphik.className}>{children}</body>
    </html>
  );
}
