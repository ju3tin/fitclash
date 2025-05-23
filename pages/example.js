import React, { useEffect } from 'react';

export default function Example() {
  useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://webrtcsocket.onrender.com/api/data', true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log('Response:', xhr.responseText);
      } else {
        console.error('Request failed');
      }
    };

    xhr.onerror = function () {
      console.error('Network error');
    };

    xhr.send();
  }, []);

  return <div>Check console for XHR response</div>;
} 