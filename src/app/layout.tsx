import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartTech - Interactive Smart Board Solutions",
  description: "Professional Interactive Smart Board RK3588 with Android 12, 48MP AI Camera, and advanced features for education and business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
