import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";

const appFont = Lexend_Deca({
  variable: "--app-font",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mountjoy",
  description: "A heater timer calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${appFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
