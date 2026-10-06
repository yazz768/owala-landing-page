import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OWALA — Hydration, Reimagined",
  description:
    "An immersive product experience for the Owala water bottle.",
  applicationName: "Owala Experience",
  authors: [{ name: "Owala" }],
  openGraph: {
    title: "OWALA — Hydration, Reimagined",
    description:
      "An immersive product experience for the Owala water bottle.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}