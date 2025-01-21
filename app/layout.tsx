'use client';
import React from 'react'
//import Document, { Html, Head, Main, NextScript } from 'next/document';


export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <Html lang="en-US" className="no-js">
      <Head>
        {/* SEO Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="google-site-verification" content="UQj93ERU9zgECodaaXgVpkjrFn9UrDMEzVamacSoQ8Y" />
        <link rel="stylesheet" href="/css/main1.css" />
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@latest/css/all.min.css"
          as="style"
          onLoad={(e) => {
            const el = e.currentTarget as HTMLLinkElement;
            el.onload = null;
            el.rel = 'stylesheet';
          }}
        />
        <noscript>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@latest/css/all.min.css" />
        </noscript>
      </Head>
      <body className="layout--splash" dir="ltr">
        <Main />
        {children}
        <NextScript />
      </body>
    </Html>
    )
  }