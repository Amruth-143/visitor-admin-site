import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin",
  description: "A simple page with optional, consent-based visitor statistics.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
