import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartTech - Interactive Smart Board Solutions",
  description: "Professional Interactive Smart Board RK3588 with Android 12, 48MP AI Camera, and advanced features for education and business.",
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
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