import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sales Tool",
  description: "Interactive property sales and inventory tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignInUrl="/" afterSignUpUrl="/">
      <html lang="en">
        <body className={`${playfair.variable} ${dmSans.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
