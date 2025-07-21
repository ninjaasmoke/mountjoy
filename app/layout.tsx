import type { Metadata } from "next";
import { Funnel_Display } from "next/font/google";
import "./globals.css";

const appFont = Funnel_Display({
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
