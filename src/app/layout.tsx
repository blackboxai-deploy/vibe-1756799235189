import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Speed Racer 2D - Racing Game",
  description: "Experience high-speed 2D racing action with AI opponents, multiple tracks, and realistic physics.",
  keywords: "racing game, 2D racing, car game, speed racer, racing simulator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black">
        {children}
      </body>
    </html>
  );
}