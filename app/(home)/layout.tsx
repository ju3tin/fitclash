'use client';
import './style.css';
import React from 'react';
import Masthead from '../../components/masthead';
import Document, { Html, Head, Main, NextScript } from 'next/document';


export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body>
            <Masthead />
            {children}
        </body>
      </html>
    )
  }