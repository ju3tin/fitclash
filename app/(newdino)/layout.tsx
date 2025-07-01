'use client';
import './style.css';
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import axios from "axios";
import axiosInstance from '../../lib/axiosInstance';
import { SolanaProvider } from "../../components/solanaprovider";
import Script from 'next/script';

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="FitClash - Fitness Competition Platform" />
          
          {/* Facebook Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://fitclash.vercel.app/" />
          <meta property="og:title" content="FitClash" />
          <meta property="og:description" content="FitClash - Fitness Competition Platform" />
          <meta property="og:image" content="https://fitclash.vercel.app/images/logo3.png" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content="https://fitclash.vercel.app/" />
          <meta name="twitter:title" content="FitClash" />
          <meta name="twitter:description" content="FitClash - Fitness Competition Platform" />
          <meta name="twitter:image" content="https://fitclash.vercel.app/images/logo3.png" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="/assets/css/index1.css" />
          <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" />
          <Script src="/assets/js/index1.js" strategy="beforeInteractive" />
    
          <title>FitClash</title>
        </head>
        <body className="layout--splash" dir="ltr">
          <SolanaProvider>
           {children}
           </SolanaProvider>
        </body>
      </html>
    )
  }