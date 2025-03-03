"use client"
import { useState, useEffect } from "react";

export const useNetworkStatus = () => {
  const [isWiFi, setIsWiFi] = useState<boolean>(false);

  useEffect(() => {
    const getNetworkType = () => {
      const connection =
        (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection;

      if (connection) {
        setIsWiFi(connection.type === "wifi" || connection.effectiveType === "wifi");
      }
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
    <div>
      {isWiFi ? (
        <p className="text-green-500">✅ Connected via WiFi</p>
      ) : (
        <p className="text-red-500">⚠️ Not on WiFi! Switch for best performance.</p>
      )}
    </div>
  );
};

export default NetworkStatus;