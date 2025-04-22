// components/RandomUrlGenerator.tsx

'use client';

import { useState } from 'react';

export default function RandomUrlGenerator() {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const generateUrl = () => {
    const randomString = Math.random().toString(36).substring(2, 10);
    const newUrl = `https://example.com/${randomString}`;
    setUrl(newUrl);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Hide "Copied!" after 1.5s
    }
  };

  return (
    <div className="gap-4">
      <div className="grid gap-4">
        <button
          onClick={generateUrl}
          className="bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generate URL
        </button>

        {url && (
          <div className="gap-4">
            <p style={{maxWidth:"150px !important"}} className="text-blue-700 font-mono">{url}</p>
            <button
              onClick={copyToClipboard}
              className="bg-green-600 text-white rounded hover:bg-green-700"
            >
              Copy
            </button>
            {copied && <p className="text-sm text-green-500">Copied!</p>}
          </div>
        )}
      </div>
    </div>
  );
}
