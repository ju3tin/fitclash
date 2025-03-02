"use client";
import { useEffect, useState } from "react";

const useIsUsingWiFi = () => {
  const [isWiFi, setIsWiFi] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.connection) {
      const connection = navigator.connection;
      if (connection && 'effectiveType' in connection) {
        setIsWiFi(connection.effectiveType === "wifi");
      }
    }
  }, []);

  return isWiFi;
};

const NetworkStatus = () => {
  const isWiFi = useIsUsingWiFi();

  return <div>Network: {isWiFi === null ? "Checking..." : isWiFi ? "WiFi" : "Not WiFi"}</div>;
};

export default NetworkStatus;