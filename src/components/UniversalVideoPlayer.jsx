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
  const callbacksRef = useRef({ onReady, onPlay, onPause, onEnded, onError });
  const isInitializedRef = useRef(false);
  const progressCheckIntervalRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const [securityWarning, setSecurityWarning] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current = { onReady, onPlay, onPause, onEnded, onError };
  }, [onReady, onPlay, onPause, onEnded, onError]);

  useEffect(() => {
    setIsMounted(true);
    setIsLoading(true);
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

  // Load Bunny.net Player.js script dynamically (only once globally)
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Check if script is already loaded or loading
    const existingScript = document.querySelector(
      'script[src="https://assets.mediadelivery.net/playerjs/playerjs-latest.min.js"]'
    );
    
    if (window.playerjs || existingScript) {
      return; // Script already loaded or loading
    }

    console.log("Loading Bunny.net Player.js script...");
    const script = document.createElement("script");
    script.src = "https://assets.mediadelivery.net/playerjs/playerjs-latest.min.js";
    script.async = true;
    
    script.onload = () => {
      console.log("✅ Bunny.net Player.js script loaded successfully");
    };
    
    script.onerror = () => {
      console.error("❌ Failed to load Bunny.net Player.js script");
    };
    
    document.body.appendChild(script);
  }, []);

  // Initialize Official Bunny.net Player.js
  useEffect(() => {
    if (!isMounted || !iframeRef.current || isInitializedRef.current) return;

    // Reset initialization flag when video changes
    if (video?.videoId && video?.libraryId) {
      isInitializedRef.current = false;
    }

    const iframe = iframeRef.current;

    let retryCount = 0;
    const MAX_RETRIES = 50; // Max 10 seconds (50 * 200ms)

    // Wait for iframe to load AND player.js to be available
    const initPlayer = () => {
      retryCount++;
      
      // Check if iframe is loaded
      if (!iframe.contentWindow) {
        if (retryCount < MAX_RETRIES) {
          setTimeout(initPlayer, 200);
        } else {
          console.error("❌ Timeout: Iframe failed to load");
          setError("Failed to load video player");
        }
        return;
      }

      // Check if player.js is loaded
      if (!window.playerjs) {
        if (retryCount < MAX_RETRIES) {
          setTimeout(initPlayer, 200);
        } else {
          console.error("❌ Timeout: player.js failed to load");
          setError("Failed to load video player library");
        }
        return;
      }

      // Prevent multiple initializations
      if (isInitializedRef.current || playerRef.current) {
        console.log("Player already initialized");
        return;
      }

      try {
        console.log("Initializing Bunny.net Player.js...");
        // Create official Bunny.net Player instance
        const player = new window.playerjs.Player(iframe);
        playerRef.current = player;
        isInitializedRef.current = true;

        // Track video progress for fallback detection
        let videoDuration = 0;
        let endedTriggered = false;

        // Official Bunny.net events - 100% reliable
        // Use callbacks from ref to avoid dependency issues
        player.on("ready", () => {
          console.log("✅ Bunny Player: Ready");
          setIsLoading(false);
          
          // Get video duration when ready
          try {
            player.getDuration((duration) => {
              console.log("📹 Video duration:", duration, "seconds");
              videoDuration = duration;
            });
          } catch (e) {
            console.log("Could not get duration:", e);
          }
          
          callbacksRef.current.onReady();
        });

        player.on("play", () => {
          console.log("▶️ Bunny Player: Play");
          endedTriggered = false; // Reset on play
          
          // Start progress checking as fallback
          if (progressCheckIntervalRef.current) {
            clearInterval(progressCheckIntervalRef.current);
          }
          
          progressCheckIntervalRef.current = setInterval(() => {
            if (endedTriggered || !playerRef.current) {
              if (progressCheckIntervalRef.current) {
                clearInterval(progressCheckIntervalRef.current);
                progressCheckIntervalRef.current = null;
              }
              return;
            }
            
            try {
              player.getCurrentTime((currentTime) => {
                if (videoDuration > 0 && currentTime >= videoDuration - 1) {
                  console.log("🏁 Video reached end via progress check - Duration:", videoDuration, "Current:", currentTime);
                  endedTriggered = true;
                  if (progressCheckIntervalRef.current) {
                    clearInterval(progressCheckIntervalRef.current);
                    progressCheckIntervalRef.current = null;
                  }
                  callbacksRef.current.onEnded();
                }
              });
            } catch (e) {
              // Silently fail
            }
          }, 1000); // Check every second
          
          callbacksRef.current.onPlay();
        });

        player.on("pause", () => {
          console.log("⏸️ Bunny Player: Pause");
          if (progressCheckIntervalRef.current) {
            clearInterval(progressCheckIntervalRef.current);
            progressCheckIntervalRef.current = null;
          }
          callbacksRef.current.onPause();
        });

        // Listen for ended event - Primary method
        player.on("ended", () => {
          if (endedTriggered) {
            console.log("⚠️ Ended event already triggered, ignoring duplicate");
            return;
          }
          endedTriggered = true;
          console.log("🏁 Bunny Player: Ended - Official event triggered");
          console.log("Calling onEnded callback...");
          
          if (progressCheckIntervalRef.current) {
            clearInterval(progressCheckIntervalRef.current);
            progressCheckIntervalRef.current = null;
          }
          
          callbacksRef.current.onEnded(); // ✅ 100% reliable completion tracking
        });

        // Also try alternative event names (some players use different names)
        player.on("complete", () => {
          if (endedTriggered) return;
          console.log("🏁 Bunny Player: Complete event triggered");
          endedTriggered = true;
          if (progressCheckIntervalRef.current) {
            clearInterval(progressCheckIntervalRef.current);
            progressCheckIntervalRef.current = null;
          }
          callbacksRef.current.onEnded();
        });

        player.on("error", (err) => {
          console.error("❌ Bunny Player: Error", err);
          setIsLoading(false);
          setError("Failed to load video");
          callbacksRef.current.onError(err);
        });

        console.log("✅ Bunny Player initialized successfully with all event listeners");

      } catch (err) {
        console.error("❌ Failed to initialize Bunny Player:", err);
        setIsLoading(false);
        setError("Failed to initialize video player");
        callbacksRef.current.onError(err);
      }
    };

    // Wait for iframe to load before initializing
    const handleIframeLoad = () => {
      console.log("Iframe loaded, initializing player...");
      setTimeout(initPlayer, 500); // Small delay to ensure iframe is ready
    };

    if (iframe.complete || iframe.contentWindow) {
      handleIframeLoad();
    } else {
      iframe.addEventListener("load", handleIframeLoad);
    }

    // Also try to initialize after a delay (fallback)
    const fallbackInit = setTimeout(() => {
      if (!isInitializedRef.current && !playerRef.current) {
        console.log("Fallback: Attempting player initialization...");
        initPlayer();
      }
    }, 2000);

    // Cleanup: Destroy player instance when component unmounts or video changes
    return () => {
      clearTimeout(fallbackInit);
      if (iframe) {
        iframe.removeEventListener("load", handleIframeLoad);
      }
      
      // Clear any intervals
      if (progressCheckIntervalRef.current) {
        clearInterval(progressCheckIntervalRef.current);
        progressCheckIntervalRef.current = null;
      }
      
      if (playerRef.current) {
        try {
          console.log("Cleaning up player instance...");
          playerRef.current.off(); // Remove all event listeners
          if (typeof playerRef.current.destroy === "function") {
            playerRef.current.destroy(); // Destroy player instance
          }
        } catch (err) {
          console.error("Error destroying player:", err);
        }
        playerRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, [isMounted, video?.videoId, video?.libraryId]);

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

  // Iframe load detection (fallback for initial loading state)
  useEffect(() => {
    if (!isMounted || !iframeRef.current) return;

    const iframe = iframeRef.current;
    let loadingTimeout;

    const handleLoad = () => {
      // Player.js ready event will handle loading state, this is just fallback
      loadingTimeout = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
        }
      }, 3000);
    };

    loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 8000);

    iframe.addEventListener('load', handleLoad);

    return () => {
      clearTimeout(loadingTimeout);
      iframe.removeEventListener('load', handleLoad);
    };
  }, [isMounted, video?.videoId, video?.libraryId, isLoading]);

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

  const iframeUrl = `https://iframe.mediadelivery.net/embed/${video.libraryId}/${video.videoId}?autoplay=${autoplay}&muted=${muted}&loop=false&preload=true&responsive=true`;

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
          // Player.js ready event handles this, but keep as fallback
          setTimeout(() => {
            if (isLoading) {
              setIsLoading(false);
            }
          }, 1500);
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
