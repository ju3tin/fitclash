import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals1.css";
import { Analytics } from "@vercel/analytics/react";
import Header from "../../components/header";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fit Clash",
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
      <meta property="og:image" content="https://fitclash.vercel.app/images/logo3.png" />
      <link rel="stylesheet" type="text/css" href="./css/control_utils.css" />
      <Script src="./javascript/camera_utils.js" />
      <Script src="./javascript/control_utils.js" />
      <Script src="./javascript/drawing_utils.js" />
      <Script src="./javascript/pose.js" />
<meta property="og:image:type" content="<generated>" />
<meta property="og:image:width" content="<generated>" />
<meta property="og:image:height" content="<generated>" />
<meta property="og:site_name" content="https://fitclash.vercel.app" />
<meta property="og:title" content="Fit Clash" />
<meta property="og:description" content="Challange Your Friends To A Fitness Battle" />
<meta property="twitter:image" content="https://fitclash.vercel.app/images/logo3.png"></meta>
<meta property="twitter:card" content="summary_large_image"></meta>
<meta property="twitter:description" content="Challange Your Friends To A Fitness Battle"></meta>
<meta property="twitter:title" content="Fitness Clash"></meta>
<meta property="og:url" content="https://fitclash.vercel.app"></meta>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Analytics />
      </body> 
      <Script src="./javascript/leg1.js" />
    </html>
  );
}