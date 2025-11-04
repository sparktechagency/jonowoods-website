"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const UniversalVideoPlayer = ({
  video,
  autoplay = false,
  showControls = true,
  muted = false,
  aspectRatio = "16:9",
  style = {},
  className = "",
  watermark = null,
  onReady = () => {},
  onPlay = () => {},
  onPause = () => {},
  onEnded = () => {},
  onError = () => {},
  onSecurityViolation = () => {},
}) => {
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const [securityWarning, setSecurityWarning] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsLoading(true); // Start loading when component mounts
  }, []);

  const getPaddingBottom = () => {
    switch (aspectRatio) {
      case "4:3":
        return "75%";
      case "1:1":
        return "100%";
      case "16:9":
      default:
        return "56.25%";
    }
  };

  // DevTools Detection
  useEffect(() => {
    if (!isMounted) return;

    const detectDevTools = () => {
      const threshold = 160;
      const widthOpen = window.outerWidth - window.innerWidth > threshold;
      const heightOpen = window.outerHeight - window.innerHeight > threshold;
      const open = widthOpen || heightOpen;

      if (open) {
        setDevToolsOpen(true);
        setSecurityWarning(true);
        onSecurityViolation("devtools_detected");
        try {
          playerRef.current?.pause?.();
        } catch (e) {
          // Silent fail
        }
      } else {
        if (devToolsOpen || securityWarning) {
          setDevToolsOpen(false);
          setSecurityWarning(false);
          if (autoplay) {
            try {
              playerRef.current?.play?.();
            } catch (e) {
              // Silent fail
            }
          }
        }
      }
    };

    const intervalId = setInterval(detectDevTools, 1000);
    window.addEventListener("resize", detectDevTools);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", detectDevTools);
    };
  }, [isMounted, autoplay, devToolsOpen, securityWarning, onSecurityViolation]);

  // Disable shortcuts
  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (e) => {
      const key = e.key?.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ["s", "u", "i", "j", "c"].includes(key)) {
        e.preventDefault();
        onSecurityViolation("key_blocked");
      }
      if (key === "f12" || key === "printscreen") {
        e.preventDefault();
        onSecurityViolation("key_blocked");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMounted, onSecurityViolation]);

  // Disable right click
  // useEffect(() => {
  //   if (!isMounted) return;

  //   const disableRightClick = (e) => e.preventDefault();
  //   document.addEventListener("contextmenu", disableRightClick);
  //   return () => document.removeEventListener("contextmenu", disableRightClick);
  // }, [isMounted]);

  // Tab hide detection
  useEffect(() => {
    if (!isMounted) return;

    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === "hidden") {
        onSecurityViolation("tab_hidden");
        setSecurityWarning(true);
        try {
          playerRef.current?.pause?.();
        } catch (e) {
          // Silent fail
        }
      } else {
        setSecurityWarning(false);
        if (autoplay) {
          try {
            playerRef.current?.play?.();
          } catch (e) {
            // Silent fail
          }
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isMounted, autoplay, onSecurityViolation]);

  // Iframe load detection
  useEffect(() => {
    if (!isMounted || !iframeRef.current) return;

    const iframe = iframeRef.current;
    let loadingTimeout;

    const handleLoad = () => {
      // Wait a bit for video to buffer
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };

    const handleError = () => {
      setIsLoading(false);
      setError("Failed to load video");
    };

    // Set timeout to hide loading after 8 seconds max
    loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 8000);

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);

    return () => {
      clearTimeout(loadingTimeout);
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
    };
  }, [isMounted, video?.videoId, video?.libraryId]);

  // SSR safeguard
  if (!isMounted) {
    return (
      <div
        style={{
          width: "100%",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
          borderRadius: "8px",
          ...style,
        }}
        className={className}
      >
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  if (!video?.videoId || !video?.libraryId) {
    return (
      <div
        style={{
          width: "100%",
          background: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
          borderRadius: "8px",
          ...style,
        }}
        className={className}
      >
        <p className="text-muted-foreground">No video available</p>
      </div>
    );
  }

  const iframeUrl = `https://iframe.mediadelivery.net/embed/${video.libraryId}/${video.videoId}?autoplay=${autoplay}&muted=${muted}&responsive=true`;

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: getPaddingBottom(),
        height: 0,
        background: "#000",
        overflow: "hidden",
        borderRadius: "8px",
        userSelect: "none",
            zIndex: 0,
        ...style,
      }}
      className={className}
    >
      {(devToolsOpen || securityWarning) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-50 text-white text-center p-4 gap-4">
          <div className="text-5xl">🔒</div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Security Alert</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {devToolsOpen
                ? "Developer tools detected. Please close DevTools to continue watching."
                : "Suspicious activity detected. Video playback has been paused for security reasons."}
            </p>
          </div>

          <button
            onClick={() => {
              setDevToolsOpen(false);
              setSecurityWarning(false);
              if (autoplay) {
                try {
                  playerRef.current?.play?.();
                } catch (e) {
                  // Silent fail
                }
              }
            }}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
          >
            Continue
          </button>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-white bg-black/90 text-sm p-5 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {watermark && (
        <div
          style={{
            position: "absolute",
            [watermark.position?.includes("top") ? "top" : "bottom"]: 8,
            [watermark.position?.includes("right") ? "right" : "left"]: 8,
             zIndex: 1,
            pointerEvents: "none",
          }}
          className="bg-black/50 text-white/60 px-3 py-1 rounded text-xs font-semibold"
        >
          {watermark.text}
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={iframeUrl}
        title={video.title || "Video Player"}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-presentation"
        referrerPolicy="no-referrer"
        className="absolute top-0 left-0 w-full h-full border-0"
        onLoad={() => {
          setTimeout(() => setIsLoading(false), 1500);
        }}
        onError={() => {
          setIsLoading(false);
          setError("Failed to load video");
        }}
      />
    </div>
  );
};

export default UniversalVideoPlayer;