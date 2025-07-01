'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function Home() {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    fetch('/examples/dinogame/index.html')
      .then((res) => res.text())
      .then((data) => setHtmlContent(data));
  }, []);

  return (
    <div>
      <h1>Next.js Page with Injected Static HTML</h1>
      <Script src="/examples/dinogame/index.html" strategy='beforeInteractive' />
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}