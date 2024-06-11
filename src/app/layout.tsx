import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"

 const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nba Guess2k Player",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="body-container">{children}
      <SpeedInsights/>
      </body>

    </html>
  );
}
