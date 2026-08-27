import type { Metadata } from "next";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/cyrillic-400.css";
import "@fontsource/playfair-display/cyrillic-500.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/cyrillic-400.css";
import "@fontsource/inter/cyrillic-500.css";
import "@fontsource/inter/cyrillic-600.css";
import "@fontsource/inter/cyrillic-700.css";
import "@fontsource/inter/cyrillic-800.css";
import "./globals.css";
import MotionProvider from "./motion-provider";
import { PageLoader } from "./page-loader";
import { AiManagerMount } from "./ai-manager-mount";

export const metadata: Metadata = {
  title: {
    default: "PRODUP — Content that grows business",
    template: "%s — PRODUP",
  },
  description:
    "AI, content and marketing studio creating work that moves business forward.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PageLoader />
        <MotionProvider />
        {children}
        <AiManagerMount />
      </body>
    </html>
  );
}
