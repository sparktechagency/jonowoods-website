// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Loader2 } from "lucide-react";

// const UniversalVideoPlayer = React.forwardRef(({
//   video,
//   autoplay = false,
//   showControls = true,
//   muted = false,
//   aspectRatio = "16:9",
//   style = {},
//   className = "",
//   watermark = null,
//   completionThreshold = 95, // Percentage at which video is considered complete
//   onReady = () => {},
//   onPlay = () => {},
//   onPause = () => {},
//   onEnded = () => {},
//   onError = () => {},
//   onProgress = () => {}, // New callback for progress updates
//   onSecurityViolation = () => {},
// }, ref) => {
//   const iframeRef = useRef(null);
//   const playerRef = useRef(null);
//   const containerRef = useRef(null);
//   const callbacksRef = useRef({ onReady, onPlay, onPause, onEnded, onError, onProgress });
//   const isInitializedRef = useRef(false);
//   const completionTriggeredRef = useRef(false); // Track if completion was already triggered

//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [devToolsOpen, setDevToolsOpen] = useState(false);
//   const [securityWarning, setSecurityWarning] = useState(false);
//   const [isMounted, setIsMounted] = useState(false);

//   // Update callbacks ref when they change
//   useEffect(() => {
//     callbacksRef.current = { onReady, onPlay, onPause, onEnded, onError, onProgress };
//   }, [onReady, onPlay, onPause, onEnded, onError, onProgress]);

//   // Expose player controls to parent component
//   React.useImperativeHandle(ref, () => ({
//     play: () => {
//       if (playerRef.current) {
//         console.log("🎬 Playing video via exposed play method...");
//         try {
//           playerRef.current.play();
//           console.log("✅ Play command sent successfully");
//         } catch (error) {
//           console.error("❌ Error calling play():", error);
//         }
//       } else {
//         console.warn("⚠️ Player not initialized yet, cannot play");
//       }
//     },
//     pause: () => {
//       if (playerRef.current) {
//         try {
//           playerRef.current.pause();
//         } catch (error) {
//           console.error("❌ Error calling pause():", error);
//         }
//       }
//     },
//     getPlayer: () => playerRef.current,
//     isReady: () => isInitializedRef.current,
//   }));

//   // Reset completion trigger when video changes
//   useEffect(() => {
//     completionTriggeredRef.current = false;
//   }, [video?.videoId]);

//   // Set mounted state on client only (after hydration)
//   useEffect(() => {
//     setIsMounted(true);
//     setIsLoading(true);
//   }, []);

//   const getPaddingBottom = () => {
//     switch (aspectRatio) {
//       case "4:3":
//         return "75%";
//       case "1:1":
//         return "100%";
//       case "16:9":
//       default:
//         return "56.25%";
//     }
//   };

//   // Load Bunny.net Player.js script dynamically (only once globally)
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     // Check if script is already loaded or loading
//     const existingScript = document.querySelector(
//       'script[src="https://assets.mediadelivery.net/playerjs/playerjs-latest.min.js"]'
//     );

//     if (window.playerjs || existingScript) {
//       return; // Script already loaded or loading
//     }

//     console.log("Loading Bunny.net Player.js script...");
//     const script = document.createElement("script");
//     script.src = "https://assets.mediadelivery.net/playerjs/playerjs-latest.min.js";
//     script.async = true;

//     script.onload = () => {
//       console.log("✅ Bunny.net Player.js script loaded successfully");
//     };

//     script.onerror = () => {
//       console.error("❌ Failed to load Bunny.net Player.js script");
//     };

//     document.body.appendChild(script);
//   }, []);

//   // Initialize Official Bunny.net Player.js
//   useEffect(() => {
//     if (!isMounted || !iframeRef.current || isInitializedRef.current) return;

//     // Reset initialization flag when video changes
//     if (video?.videoId && video?.libraryId) {
//       isInitializedRef.current = false;
//     }

//     const iframe = iframeRef.current;

//     let retryCount = 0;
//     const MAX_RETRIES = 50; // Max 10 seconds (50 * 200ms)

//     // Wait for iframe to load AND player.js to be available
//     const initPlayer = () => {
//       retryCount++;

//       // Check if iframe is loaded
//       if (!iframe.contentWindow) {
//         if (retryCount < MAX_RETRIES) {
//           setTimeout(initPlayer, 200);
//         } else {
//           console.error("❌ Timeout: Iframe failed to load");
//           setError("Failed to load video player");
//         }
//         return;
//       }

//       // Check if player.js is loaded
//       if (!window.playerjs) {
//         if (retryCount < MAX_RETRIES) {
//           setTimeout(initPlayer, 200);
//         } else {
//           console.error("❌ Timeout: player.js failed to load");
//           setError("Failed to load video player library");
//         }
//         return;
//       }

//       // Prevent multiple initializations
//       if (isInitializedRef.current || playerRef.current) {
//         console.log("Player already initialized");
//         return;
//       }

//       try {
//         console.log("Initializing Bunny.net Player.js...");
//         // Create official Bunny.net Player instance
//         const player = new window.playerjs.Player(iframe);
//         playerRef.current = player;
//         isInitializedRef.current = true;

//         // Track video progress for percentage-based completion
//         let videoDuration = 0;

//         // Official Bunny.net events
//         player.on("ready", () => {
//           console.log("✅ Bunny Player: Ready");
//           setIsLoading(false);

//           // Get video duration when ready
//           try {
//             player.getDuration((duration) => {
//               console.log("📹 Video duration:", duration, "seconds");
//               videoDuration = duration;
//             });
//           } catch (e) {
//             console.log("Could not get duration:", e);
//           }

//           callbacksRef.current.onReady();
//         });

//         player.on("play", () => {
//           console.log("▶️ Bunny Player: Play");
//           callbacksRef.current.onPlay();
//         });

//         player.on("pause", () => {
//           console.log("⏸️ Bunny Player: Pause");
//           callbacksRef.current.onPause();
//         });

//         // ✅ PERCENTAGE-BASED COMPLETION - The reliable solution
//         // This is what Netflix, Udemy, Coursera all use
//         // Bunny's "timeupdate" event fires reliably, unlike "ended"
//         player.on("timeupdate", (data) => {
//           // data contains { seconds: currentTime, duration: totalDuration }
//           const currentTime = data?.seconds || 0;
//           const duration = data?.duration || videoDuration;

//           if (duration <= 0) return;

//           const watchedPercent = (currentTime / duration) * 100;

//           // Report progress
//           callbacksRef.current.onProgress({
//             currentTime,
//             duration,
//             percentage: watchedPercent
//           });

//           // Log progress every 5% for debugging
//           const percentInt = Math.floor(watchedPercent);
//           if (percentInt % 5 === 0 && percentInt > 0 && percentInt !== window.lastLoggedPercent) {
//             console.log(`⏱️ Video Progress: ${percentInt}% (${currentTime.toFixed(1)}s / ${duration.toFixed(1)}s)`);
//             window.lastLoggedPercent = percentInt;
//           }

//           // Trigger completion at threshold (default 95%)
//           if (watchedPercent >= completionThreshold && !completionTriggeredRef.current) {
//             completionTriggeredRef.current = true;
//             console.log("🎬 ===== VIDEO COMPLETION DETECTED =====");
//             console.log(`✅ Video watched: ${watchedPercent.toFixed(2)}% (Threshold: ${completionThreshold}%)`);
//             console.log(`📹 Current Time: ${currentTime.toFixed(2)}s / Duration: ${duration.toFixed(2)}s`);
//             console.log(`🆔 Video ID: ${video?.videoId}`);
//             console.log(`📚 Library ID: ${video?.libraryId}`);
//             console.log("🚀 Calling onEnded() callback now...");
//             console.log("📞 Callback function:", callbacksRef.current.onEnded);
//             callbacksRef.current.onEnded();
//             console.log("✅ onEnded() callback called successfully");
//           }
//         });

//         // Also listen for official ended event as backup
//         player.on("ended", () => {
//           if (completionTriggeredRef.current) {
//             console.log("⚠️ Completion already triggered via percentage, ignoring ended event");
//             return;
//           }
//           completionTriggeredRef.current = true;
//           console.log("🎬 ===== VIDEO ENDED EVENT (BACKUP) =====");
//           console.log("🏁 Bunny Player: Ended event triggered");
//           console.log(`🆔 Video ID: ${video?.videoId}`);
//           console.log("🚀 Calling onEnded() callback...");
//           callbacksRef.current.onEnded();
//           console.log("✅ onEnded() callback called successfully");
//         });

//         player.on("complete", () => {
//           if (completionTriggeredRef.current) {
//             console.log("⚠️ Completion already triggered, ignoring complete event");
//             return;
//           }
//           completionTriggeredRef.current = true;
//           console.log("🎬 ===== VIDEO COMPLETE EVENT (BACKUP) =====");
//           console.log("🏁 Bunny Player: Complete event triggered");
//           console.log(`🆔 Video ID: ${video?.videoId}`);
//           console.log("🚀 Calling onEnded() callback...");
//           callbacksRef.current.onEnded();
//           console.log("✅ onEnded() callback called successfully");
//         });

//         player.on("error", (err) => {
//           console.error("❌ Bunny Player: Error", err);
//           setIsLoading(false);
//           setError("Failed to load video");
//           callbacksRef.current.onError(err);
//         });

//         console.log("✅ Bunny Player initialized with percentage-based completion tracking");

//       } catch (err) {
//         console.error("❌ Failed to initialize Bunny Player:", err);
//         setIsLoading(false);
//         setError("Failed to initialize video player");
//         callbacksRef.current.onError(err);
//       }
//     };

//     // Wait for iframe to load before initializing
//     const handleIframeLoad = () => {
//       console.log("Iframe loaded, initializing player...");
//       setTimeout(initPlayer, 500); // Small delay to ensure iframe is ready
//     };

//     if (iframe.complete || iframe.contentWindow) {
//       handleIframeLoad();
//     } else {
//       iframe.addEventListener("load", handleIframeLoad);
//     }

//     // Also try to initialize after a delay (fallback)
//     const fallbackInit = setTimeout(() => {
//       if (!isInitializedRef.current && !playerRef.current) {
//         console.log("Fallback: Attempting player initialization...");
//         initPlayer();
//       }
//     }, 2000);

//     // Cleanup: Destroy player instance when component unmounts or video changes
//     return () => {
//       clearTimeout(fallbackInit);
//       if (iframe) {
//         iframe.removeEventListener("load", handleIframeLoad);
//       }

//       if (playerRef.current) {
//         try {
//           console.log("Cleaning up player instance...");
//           playerRef.current.off(); // Remove all event listeners
//           if (typeof playerRef.current.destroy === "function") {
//             playerRef.current.destroy(); // Destroy player instance
//           }
//         } catch (err) {
//           console.error("Error destroying player:", err);
//         }
//         playerRef.current = null;
//         isInitializedRef.current = false;
//       }
//     };
//   }, [isMounted, video?.videoId, video?.libraryId, completionThreshold]);

//   // DevTools Detection - Just log, don't pause video (to avoid blocking completion)
//   useEffect(() => {
//     if (!isMounted) return;

//     const detectDevTools = () => {
//       const threshold = 160;
//       const widthOpen = window.outerWidth - window.innerWidth > threshold;
//       const heightOpen = window.outerHeight - window.innerHeight > threshold;
//       const open = widthOpen || heightOpen;

//       if (open) {
//         if (!devToolsOpen) {
//           setDevToolsOpen(true);
//           setSecurityWarning(true);
//           onSecurityViolation("devtools_detected");
//           // ❌ DON'T pause - this blocks completion detection
//         }
//       } else {
//         if (devToolsOpen) {
//           setDevToolsOpen(false);
//           setSecurityWarning(false);
//         }
//       }
//     };

//     const intervalId = setInterval(detectDevTools, 1000);
//     window.addEventListener("resize", detectDevTools);

//     return () => {
//       clearInterval(intervalId);
//       window.removeEventListener("resize", detectDevTools);
//     };
//   }, [isMounted, devToolsOpen, onSecurityViolation]);

//   // Disable shortcuts
//   useEffect(() => {
//     if (!isMounted) return;

//     const handleKeyDown = (e) => {
//       const key = e.key?.toLowerCase();
//       if ((e.ctrlKey || e.metaKey) && ["s", "u", "i", "j", "c"].includes(key)) {
//         e.preventDefault();
//         onSecurityViolation("key_blocked");
//       }
//       if (key === "f12" || key === "printscreen") {
//         e.preventDefault();
//         onSecurityViolation("key_blocked");
//       }
//     };
//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, [isMounted, onSecurityViolation]);

//   // Tab hide detection - Just log, don't pause video (to avoid blocking completion)
//   useEffect(() => {
//     if (!isMounted) return;

//     const handleVisibilityChange = () => {
//       if (document.hidden || document.visibilityState === "hidden") {
//         onSecurityViolation("tab_hidden");
//         setSecurityWarning(true);
//         // ❌ DON'T pause - this blocks completion detection
//       } else {
//         setSecurityWarning(false);
//       }
//     };
//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () =>
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//   }, [isMounted, onSecurityViolation]);

//   // Iframe load detection (fallback for initial loading state)
//   useEffect(() => {
//     if (!isMounted || !iframeRef.current) return;

//     const iframe = iframeRef.current;
//     let loadingTimeout;

//     const handleLoad = () => {
//       // Player.js ready event will handle loading state, this is just fallback
//       loadingTimeout = setTimeout(() => {
//         if (isLoading) {
//           setIsLoading(false);
//         }
//       }, 3000);
//     };

//     loadingTimeout = setTimeout(() => {
//       setIsLoading(false);
//     }, 8000);

//     iframe.addEventListener('load', handleLoad);

//     return () => {
//       clearTimeout(loadingTimeout);
//       iframe.removeEventListener('load', handleLoad);
//     };
//   }, [isMounted, video?.videoId, video?.libraryId, isLoading]);

//   // Always render the same structure on server and client to avoid hydration mismatch
//   // Use isMounted only for client-side initialization, not for conditional rendering
//   if (!video?.videoId || !video?.libraryId) {
//     return (
//       <div
//         style={{
//           width: "100%",
//           background: "#000",
//           color: "#fff",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           minHeight: "200px",
//           borderRadius: "8px",
//           ...style,
//         }}
//         className={className}
//       >
//         <p className="text-muted-foreground">No video available</p>
//       </div>
//     );
//   }

//   const iframeUrl = `https://iframe.mediadelivery.net/embed/${video.libraryId}/${video.videoId}?autoplay=${autoplay}&muted=${muted}&loop=false&preload=true&responsive=true`;

//   // Always render the same structure - don't conditionally render based on isMounted
//   return (
//     <div
//       ref={containerRef}
//       style={{
//         position: "relative",
//         width: "100%",
//         paddingBottom: getPaddingBottom(),
//         height: 0,
//         background: "#000",
//         overflow: "hidden",
//         borderRadius: "8px",
//         userSelect: "none",
//         zIndex: 0,
//         ...style,
//       }}
//       className={className}
//     >
//       {isLoading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
//           <Loader2 className="w-12 h-12 text-white animate-spin" />
//         </div>
//       )}

//       {error && (
//         <div className="absolute inset-0 flex items-center justify-center text-white bg-black/90 text-sm p-5 text-center">
//           <p className="text-destructive">{error}</p>
//         </div>
//       )}

//       {watermark && (
//         <div
//           style={{
//             position: "absolute",
//             [watermark.position?.includes("top") ? "top" : "bottom"]: 8,
//             [watermark.position?.includes("right") ? "right" : "left"]: 8,
//             zIndex: 1,
//             pointerEvents: "none",
//           }}
//           className="bg-black/50 text-white/60 px-3 py-1 rounded text-xs font-semibold"
//         >
//           {watermark.text}
//         </div>
//       )}

//       {/* Always render iframe - initialization happens in useEffect (client-only) */}
//       <iframe
//         ref={iframeRef}
//         src={iframeUrl}
//         title={video.title || "Video Player"}
//         allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
//         sandbox="allow-scripts allow-same-origin allow-presentation"
//         referrerPolicy="no-referrer"
//         className="absolute top-0 left-0 w-full h-full border-0"
//         suppressHydrationWarning
//         onLoad={() => {
//           // Player.js ready event handles this, but keep as fallback
//           if (typeof window !== "undefined") {
//             setTimeout(() => {
//               if (isLoading) {
//                 setIsLoading(false);
//               }
//             }, 1500);
//           }
//         }}
//         onError={() => {
//           if (typeof window !== "undefined") {
//             setIsLoading(false);
//             setError("Failed to load video");
//           }
//         }}
//       />
//     </div>
//   );
// });

// UniversalVideoPlayer.displayName = "UniversalVideoPlayer";

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const UniversalVideoPlayer = ({
  video,
  autoplay = false,
  muted = false,
  aspectRatio = "16:9",
  completionThreshold = 95,
  nearCompletionOffset = 1,
  onReady = () => {},
  onPlay = () => {},
  onPause = () => {},
  onEnded = () => {},
  onError = () => {},
  onProgress = () => {},
  onNearCompletion = () => {},
}) => {
  const iframeRef = useRef(null);
  const playerRef = useRef(null);

  const durationRef = useRef(0);
  const completionTriggeredRef = useRef(false);
  const nearCompletionTriggeredRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const paddingBottom =
    aspectRatio === "4:3"
      ? "75%"
      : aspectRatio === "1:1"
      ? "100%"
      : "56.25%";

  /* Load Bunny Player.js */
  useEffect(() => {
    if (window.playerjs) return;

    const script = document.createElement("script");
    script.src =
      "https://assets.mediadelivery.net/playerjs/playerjs-latest.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  /* Init Player */
  useEffect(() => {
    if (!iframeRef.current) return;
    if (!video?.videoId || !video?.libraryId) return;

    let retries = 0;

    const init = () => {
      if (!window.playerjs || !iframeRef.current?.contentWindow) {
        if (retries < 30) {
          retries++;
          setTimeout(init, 300);
        }
        return;
      }

      if (playerRef.current) return;

      const player = new window.playerjs.Player(iframeRef.current);
      playerRef.current = player;

      /* READY */
      player.on("ready", () => {
        setLoading(false);
        onReady();

        let durationTries = 0;

        const fetchDuration = () => {
          player.getDuration((d) => {
            if (!d || isNaN(d)) {
              if (durationTries < 20) {
                durationTries++;
                setTimeout(fetchDuration, 500);
              }
            } else {
              durationRef.current = d;
              console.log("Duration locked:", d);
            }
          });
        };

        fetchDuration();
      });

      player.on("play", onPlay);
      player.on("pause", onPause);

      /* TIME UPDATE */
      player.on("timeupdate", (data) => {
        const currentTime = data?.seconds ?? 0;
        const duration = durationRef.current;

        if (!duration) return;

        const remaining = duration - currentTime;
        const percent = (currentTime / duration) * 100;

        onProgress({
          currentTime,
          duration,
          remainingTime: remaining,
          percentage: percent,
        });

        if (
          remaining <= nearCompletionOffset &&
          remaining > 0 &&
          !nearCompletionTriggeredRef.current
        ) {
          nearCompletionTriggeredRef.current = true;
          console.log("Near completion triggered");
          onNearCompletion({
            currentTime,
            duration,
            remainingTime: remaining,
            percentage: percent,
          });
        }

        if (
          percent >= completionThreshold &&
          !completionTriggeredRef.current
        ) {
          completionTriggeredRef.current = true;
          console.log("Completion triggered");
          onEnded();
        }
      });

      /* BACKUP EVENTS */
      player.on("ended", () => {
        if (!completionTriggeredRef.current) {
          completionTriggeredRef.current = true;
          onEnded();
        }
      });

      player.on("error", (e) => {
        setError("Video failed");
        setLoading(false);
        onError(e);
      });
    };

    init();

    return () => {
      try {
        playerRef.current?.off();
        playerRef.current?.destroy?.();
      } catch {}
      playerRef.current = null;
      durationRef.current = 0;
      completionTriggeredRef.current = false;
      nearCompletionTriggeredRef.current = false;
    };
  }, [
    video?.videoId,
    video?.libraryId,
    completionThreshold,
    nearCompletionOffset,
  ]);

  if (!video?.videoId || !video?.libraryId) {
    return (
      <div style={{ background: "#000", color: "#fff", padding: 40 }}>
        No video
      </div>
    );
  }

  const src = `https://iframe.mediadelivery.net/embed/${video.libraryId}/${video.videoId}?autoplay=${autoplay}&muted=${muted}`;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom,
        background: "#000",
      }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <Loader2 className="w-10 h-10 animate-spin text-white" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          {error}
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={src}
        allow="autoplay; fullscreen"
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
};

export default UniversalVideoPlayer;

