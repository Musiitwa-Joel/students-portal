import React, { useEffect, useState } from "react";
import { Alert, ConfigProvider } from "antd";
import {
  DisconnectOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import Ping from "ping.js";

// Custom hook to detect network status and quality
const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: navigator.onLine,
    quality: "good", // Possible values: "good", "slow", "offline"
    message: "",
    type: "info",
  });

  const checkNetworkQuality = async () => {
    if (!navigator.onLine) {
      return {
        isOnline: false,
        quality: "offline",
        message: "You are offline. Please check your network connection.",
        type: "error",
      };
    }

    try {
      const ping = new Ping();
      const latency = await ping.ping("https://www.google.com");

      if (latency === 0) {
        // No response (likely offline or server unreachable)
        return {
          isOnline: true, // navigator.onLine is true, but ping failed
          quality: "offline",
          message: "Network unreachable. Please check your connection.",
          type: "error",
        };
      }

      if (latency > 1000) {
        return {
          isOnline: true,
          quality: "slow",
          message:
            "Slow network detected. Try switching to a stronger connection.",
          type: "warning",
        };
      }

      return {
        isOnline: true,
        quality: "good",
        message: "Network is stable. You're good to go!",
        type: "info",
      };
    } catch (error) {
      // console.log("Ping error:", error); // Debug log
      return {
        isOnline: true, // Fallback to navigator.onLine
        quality: "offline",
        message: "Network check failed. Please verify your connection.",
        type: "error",
      };
    }
  };

  useEffect(() => {
    const updateNetworkStatus = async () => {
      const status = await checkNetworkQuality();
      setNetworkStatus(status);
      // console.log("Network status:", status); // Debug log
    };

    updateNetworkStatus();
    const interval = setInterval(updateNetworkStatus, 10000); // Check every 10 seconds
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, []);

  return networkStatus;
};

// Network status indicator component
const NetworkStatusIndicator = () => {
  const { isOnline, quality, message, type } = useNetworkStatus();

  // Only show alert for slow or offline states
  if (quality === "good") return null;

  const getIcon = () => {
    if (quality === "offline")
      return <DisconnectOutlined style={{ marginRight: 8 }} />;
    if (quality === "slow")
      return <WarningOutlined style={{ marginRight: 8 }} />;
    return <InfoCircleOutlined style={{ marginRight: 8 }} />;
  };

  const getSuggestion = () => {
    if (quality === "slow") {
      const suggestions = [
        "Try switching to a Wi-Fi network for better performance.",
        "Move closer to your router to improve signal strength.",
        "Restart your modem or router to refresh the connection.",
        "Pause any background downloads or uploads.",
        "Disable VPN temporarily to improve speed.",
        "Switch to a different browser that handles slow connections better.",
        "Use a wired Ethernet connection if possible.",
        "Close unused tabs or applications that use the internet.",
        "Clear your browser cache and cookies.",
        "Switch to mobile data if Wi-Fi is unstable.",
        "Try accessing a lighter version of the site.",
        "Reduce video quality for smoother streaming.",
        "Avoid using multiple devices on the same network.",
        "Check if your internet service provider is having issues.",
        "Try again at a later time when traffic is lower.",
        "Update your browser or app to the latest version.",
        "Limit your usage to essential services during slow periods.",
        "Turn off auto-play for videos on websites.",
        "Enable data-saving mode if available in your browser.",
        "Use a performance-optimized browser like Opera Mini.",
        "Turn off Bluetooth if it's interfering with your Wi-Fi signal.",
        "Check if someone else is using high bandwidth (e.g., streaming).",
        "Limit cloud sync services temporarily (e.g., Google Drive, Dropbox).",
        "Restart your device to reset network settings.",
        "Switch between 2.4GHz and 5GHz Wi-Fi bands.",
        "Reposition your router to a more central location.",
        "Use airplane mode and turn it off again to reset mobile data.",
        "Install browser extensions to block ads (which use bandwidth).",
        "Avoid using large attachments in emails for now.",
        "Check for malware that might be consuming bandwidth.",
        "Try using incognito mode in your browser.",
        "Use a lightweight version of the app or website.",
        "Ensure your device firmware is up to date.",
        "Reduce the number of active browser tabs.",
        "Disable background auto-updates for apps.",
        "Try tethering to another device with better signal.",
        "Switch your SIM card to another slot if dual SIM is used.",
        "Temporarily disable sync for apps like Photos or Drive.",
        "Switch to a low-bandwidth mode if your app supports it.",
        "Disable animations or transitions in app settings.",
        "Use offline features if available until you're back online.",
        "Enable browser compression tools (like Chrome's Lite Mode).",
        "Avoid large file downloads during poor connection.",
        "Close streaming services like YouTube or Netflix on other devices.",
        "Try accessing the service via a different device.",
        "Use mobile hotspot only in good signal zones.",
        "Contact your ISP for a line check if slow speeds persist.",
        "Switch your phone to 3G/4G manually to see if it improves.",
        "Disable automatic cloud backups temporarily.",
        "Avoid online gaming during low bandwidth conditions.",
        "Monitor your data usage to see which app is draining it.",
        "Disable tethering if not actively using it.",
        "Switch your DNS to something faster like Google (8.8.8.8).",
      ];
      return suggestions[Math.floor(Math.random() * suggestions.length)];
    }
    return null;
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0832b7",
          colorTextBase: "#0832b7",
          colorError: "#f5222d",
          colorWarning: "#faad14",
          colorInfo: "#1890ff",
        },
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
          animation: "fadeIn 0.3s ease-in",
        }}
      >
        <Alert
          message={
            <>
              {getIcon()}
              {message}
              {quality === "slow" && (
                <div style={{ marginTop: 8 }}>
                  <strong>Suggestion:</strong> {getSuggestion()}
                </div>
              )}
            </>
          }
          type={type}
          showIcon={false}
          closable={quality !== "offline"} // Offline alert is persistent
          style={{
            textAlign: "center",
            backgroundColor: quality === "offline" ? "#fff1f0" : "#fffbe6",
            borderColor: quality === "offline" ? "#ffa39e" : "#ffe58f",
            color: "#0832b7",
            borderRadius: 8,
            margin: "8px 16px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </div>
    </ConfigProvider>
  );
};

// CSS animation for fade-in
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default NetworkStatusIndicator;
