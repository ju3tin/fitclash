import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals1.css";
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dance Clash",
  description: "Challange Your Friends To A Dance Battle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <meta property="og:image" content="https://fitclash.vercel.app/images/dance1.png" />
<meta property="og:image:type" content="<generated>" />
<meta property="og:image:width" content="<generated>" />
<meta property="og:image:height" content="<generated>" />
<meta property="og:site_name" content="https://fitclash.vercel.app" />
<meta property="og:title" content="Fit Clash" />
<meta property="og:description" content="Challange Your Friends To A Fitness Battle" />
<meta property="twitter:image" content="https://fitclash.vercel.app/images/dance1.png"></meta>
<meta property="twitter:card" content="summary_large_image"></meta>
<meta property="twitter:description" content="Challange Your Friends To A Fitness Battle"></meta>
<meta property="twitter:title" content="Fitness Clash"></meta>
<meta property="og:url" content="https://fitclash.vercel.app"></meta>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}