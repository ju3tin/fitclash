'use client';
import './style.css';
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import axios from "axios";
import axiosInstance from '../../lib/axiosInstance';


export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body className="layout--splash" dir="ltr">
           {children}
        </body>
      </html>
    )
  }