import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";

export const metadata: Metadata = {
  title: "Washington Weather Hub | Real-time Weather for WA State",
  description: "Beautiful, real-time weather forecasts and doppler radar for Washington State. Get current conditions, 10-day forecasts, and interactive maps for Seattle, Spokane, Tacoma, and all major WA cities.",
  keywords: "Washington weather, Seattle weather, Spokane weather, WA forecast, doppler radar, weather map",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
