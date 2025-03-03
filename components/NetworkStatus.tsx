"use client"
import { useState, useEffect } from "react";

export const useNetworkStatus = () => {
  const [isWiFi, setIsWiFi] = useState<boolean | null>(null);

  useEffect(() => {
    const getNetworkType = () => {
      const connection =
        (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection;

      // Default assumption: if `navigator.connection` is missing (Safari), assume WiFi if online
      if (!connection) {
        setIsWiFi(navigator.onLine);
        return;
      }

      // Check network type (only works in Chrome, Edge, Android)
      const isWiFiConnection =
        connection.type === "wifi" || connection.effectiveType === "wifi";

      // For Apple devices where type is not available, assume WiFi if it's NOT "cellular"
      const isNotCellular = connection.effectiveType && connection.effectiveType !== "cellular";

      setIsWiFi(isWiFiConnection || isNotCellular);
    };

    getNetworkType();
    window.addEventListener("online", getNetworkType);
    window.addEventListener("offline", getNetworkType);

    return () => {
      window.removeEventListener("online", getNetworkType);
      window.removeEventListener("offline", getNetworkType);
    };
  }, []);

  return isWiFi;
};

// Example Component
const NetworkStatus = () => {
  const isWiFi = useNetworkStatus();

  return (
    <div style={{display: 'none'}}>
      {isWiFi === null ? (
        <p className="text-gray-500">🔄 Checking network...</p>
      ) : isWiFi ? (
        <p className="text-green-500">✅ Connected via WiFi</p>
      ) : (
        <p className="text-red-500">⚠️ Not on WiFi! Switch for best performance.</p>
      )}
    </div>
  );
};

export default NetworkStatus;