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
    <div className="p-4 border rounded-lg shadow-md max-w-md mx-auto mt-10 text-center">
      <button
        onClick={generateUrl}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate URL
      </button>

      {url && (
        <div className="mt-4">
          <p className="break-words text-blue-700 font-mono">{url}</p>
          <button
            onClick={copyToClipboard}
            className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Copy
          </button>
          {copied && <p className="text-sm text-green-500 mt-1">Copied!</p>}
        </div>
      )}
    </div>
  );
}
