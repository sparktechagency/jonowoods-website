"use client";

import { jwtDecode } from "jwt-decode";
import { Heart, MoreHorizontal, Send } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useMarkWatchChallengeVideoMutation,
  useSingleChallengeVideoQuery,
} from "@/redux/featured/CommingSoon/commingSoonApi";
import ImageWithLoader from "@/components/share/ImageWithLoader";
import { getImageUrl, getVideoAndThumbnail } from "@/components/share/imageUrl";
import Spinner from "@/app/(commonLayout)/Spinner";
import UniversalVideoPlayer from "@/components/UniversalVideoPlayer";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import commectIcon from "../../../../../../../public/assests/comment.png";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useEditCommentMutation,
  useGetCommentQuery,
  useLikeReplyMutation,
  useReplyCommentMutation,
  useVideoDeleteCommentMutation,
} from "@/redux/featured/commentApi/commentApi";
import ConfirmModal from "@/components/share/ConfirmModal";

const VideoPlayerPage = ({ params }) => {
  const { id: challengeId, videoId } = params;
  const router = useRouter();
  const { data, isLoading, refetch } = useSingleChallengeVideoQuery(
    { id: challengeId },
    { skip: !challengeId }
  );

  const [markWatchChallengeVideo, { isLoading: isMarkingComplete }] =
    useMarkWatchChallengeVideoMutation();

  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [nextVideoUnlockTime, setNextVideoUnlockTime] = useState(null);
  const [countdown, setCountdown] = useState("");
  const completionProcessedRef = useRef(new Set());
  const countdownIntervalRef = useRef(null);
  const isProcessingCompletionRef = useRef(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const hasCheckedAccessRef = useRef(false);
  const [showVideo, setShowVideo] = useState(false);
  const [thumbnailLoading, setThumbnailLoading] = useState(true);
  const videoPlayerRef = useRef(null); // Ref to control video player

  // Comment section state and hooks
  const [comment, setComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const decoded = token ? jwtDecode(token) : null;
  const currentUserId = decoded?.id;

  // Comment API hooks - using videoId for comments
  const {
    data: commentData,
    isLoading: commentDataLoading,
    refetch: refetchComments,
  } = useGetCommentQuery(videoId, { skip: !videoId });
  const [createComment, { isLoading: commentLoading }] =
    useCreateCommentMutation();
  const [editComment, { isLoading: editLoading }] = useEditCommentMutation();
  const [videoDeleteComment, { isLoading: deleteLoading }] =
    useVideoDeleteCommentMutation();
  const [replyComment, { isLoading: replyLoading }] = useReplyCommentMutation();
  const [likeReply, { isLoading: likeLoading }] = useLikeReplyMutation();

  // Comment state management
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const commentInputRef = useRef(null);
  const replyInputRefs = useRef({});

  const [commentToDelete, setCommentToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);

  // Initialize comments from API data
  useEffect(() => {
    if (commentData?.data) {
      setComments(commentData.data);
    }
  }, [commentData]);

  // Function to calculate countdown
  const calculateCountdown = (unlockTime) => {
    const now = new Date().getTime();
    const unlockTimestamp = new Date(unlockTime).getTime();
    const difference = unlockTimestamp - now;

    if (difference > 0) {
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return {
        formatted: `${hours}h ${minutes}m ${seconds}s`,
        isExpired: false,
      };
    } else {
      return {
        formatted: "Unlocked",
        isExpired: true,
      };
    }
  };

  // Initialize videos and find current video
  useEffect(() => {
    if (data?.data?.result && videoId) {
      const sortedVideos = [...data.data.result];
      setVideos(sortedVideos);

      const current = sortedVideos.find((video) => video._id === videoId);
      setCurrentVideo(current);

      // Reset thumbnail loading when video changes
      if (current?.thumbnailUrl) {
        setThumbnailLoading(true);
      }

      const completed = sortedVideos
        .filter((video) => video.isVideoCompleted)
        .map((video) => video._id);
      setCompletedVideos(completed);

      // Only check accessibility once on initial load
      if (
        current &&
        !current.isEnabled &&
        !hasCheckedAccessRef.current &&
        !isNavigating
      ) {
        hasCheckedAccessRef.current = true;
        toast.error("This video is locked", {
          description: "Please complete previous videos first.",
        });
        router.push(`/challenge/${challengeId}`);
      }
    }
  }, [data, videoId, challengeId, router, isNavigating]);

  // Countdown timer effect
  useEffect(() => {
    if (nextVideoUnlockTime) {
      const updateCountdown = () => {
        const countdownInfo = calculateCountdown(nextVideoUnlockTime);
        setCountdown(countdownInfo.formatted);

        if (countdownInfo.isExpired) {
          setNextVideoUnlockTime(null);
          refetch();
          toast.success("New video unlocked!", {
            description: "You can now watch the next video.",
            duration: 5000,
          });
        }
      };

      updateCountdown();
      countdownIntervalRef.current = setInterval(updateCountdown, 1000);

      return () => {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
      };
    }
  }, [nextVideoUnlockTime, refetch]);

  // Handle video completion - Navigate back to challenge list page
  const handleVideoComplete = useCallback(
    async (videoId) => {
      // console.log("📋 ===== HANDLE VIDEO COMPLETE CALLED =====");
      // console.log(`🆔 Video ID: ${videoId}`);
      console.log(
        `📊 Already processed: ${completionProcessedRef.current.has(videoId)}`
      );
      console.log(`⏳ Is processing: ${isProcessingCompletionRef.current}`);

      // Prevent duplicate processing
      if (
        completionProcessedRef.current.has(videoId) ||
        isProcessingCompletionRef.current
      ) {
        console.log("⚠️ Already processing or completed, skipping...");
        return;
      }

      isProcessingCompletionRef.current = true;
      completionProcessedRef.current.add(videoId);
      console.log("✅ Starting completion process...");

      try {
        console.log("📡 ===== API CALL STARTING =====");
        console.log(
          `🆔 Calling markWatchChallengeVideo API for video: ${videoId}`
        );

        const response = await markWatchChallengeVideo(videoId).unwrap();

        

        // Check if there are more videos
        const currentIndex = videos.findIndex((v) => v._id === videoId);
        const hasMoreVideos = currentIndex < videos.length - 1;
        console.log(
          `📊 Current Index: ${currentIndex}, Total Videos: ${videos.length}, Has More: ${hasMoreVideos}`
        );

        // Handle time-locked next video - Still navigate back but show message
        if (response?.data?.nextVideoInfo?.nextUnlockTime) {
          console.log(
            `🔒 Next Unlock Time: ${response.data.nextVideoInfo.nextUnlockTime}`
          );

          const countdownInfo = calculateCountdown(
            response.data.nextVideoInfo.nextUnlockTime
          );
          console.log(`⏳ Countdown: ${countdownInfo.formatted}`);

          toast.success("Video completed!", {
            description: `Next video will unlock in ${countdownInfo.formatted}`,
            duration: 3000,
          });

          // Small delay for toast to show
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Navigate back to challenge list page
          console.log("🔙 Navigating back to challenge list page...");
          setIsNavigating(true);
          router.push(`/challenge/${challengeId}`);
          console.log("✅ Navigation initiated");
          return;
        }

        // Show success message based on whether there are more videos
        if (hasMoreVideos) {
          console.log("🎉 ===== NEXT VIDEO UNLOCKED =====");
          console.log("✅ Next video is now available!");
          toast.success("Video completed!", {
            description:
              "Next video is now unlocked. You can watch it from the challenge list.",
            duration: 3000,
          });
        } else {
          toast.success("Congratulations!", {
            description: "You have completed all challenge videos!",
            duration: 3000,
          });
        }

        // Important: Wait for mutation to fully settle before navigation
        // This ensures RTK Query mutation completes and doesn't get cancelled
        console.log("⏳ Waiting 300ms for mutation to settle...");
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Navigate back to challenge list page
        // console.log("🔙 Navigating back to challenge list page...");
        setIsNavigating(true);
        router.push(`/challenge/${challengeId}`);
        // console.log("✅ Navigation initiated");
        // console.log("🎬 ===== COMPLETION PROCESS FINISHED =====");
      } catch (error) {
        // console.error("❌ ===== API CALL FAILED =====");
        // console.error("🚨 Error marking video as completed:", error);
        // console.error("📦 Error Response:", error?.data);
        // console.error("📝 Error Message:", error?.data?.message);
        toast.error("Failed to mark video as completed", {
          description: error?.data?.message || "Please try again later.",
        });
        // Remove from processed set if failed
        completionProcessedRef.current.delete(videoId);
        isProcessingCompletionRef.current = false;
        console.log("🔄 Reset processing state due to error");
      }
    },
    [videos, markWatchChallengeVideo, challengeId, router]
  );

  // Manual complete button handler
  const handleManualComplete = async () => {
    console.log("🔄 Manual complete button clicked");

    // If we're already navigating or processing/completing, do nothing
    if (isNavigating || isMarkingComplete || isProcessingCompletionRef.current) {
      return;
    }

    // If video is already completed, just navigate back without re-calling API
    if (isCurrentVideoCompleted) {
      toast.info("Video already completed. Redirecting to challenge list...");
      setIsNavigating(true);
      router.push(`/challenge/${challengeId}`);
      return;
    }

    // If not completed yet, call completion handler (will also navigate back)
    if (currentVideo?._id) {
      await handleVideoComplete(currentVideo._id);
    }
  };

  // Video ended handler - Automatically trigger the "Mark Complete & Go Back" button action
  // IMPORTANT: Don't await here - fire and forget to prevent component unmount issues
  const handleVideoEnded = useCallback(() => {
    console.log("🎬 ===== VIDEO ENDED EVENT TRIGGERED IN PAGE =====");
    console.log("📹 Current video ID:", currentVideo?._id);
    console.log("✅ Completed videos list:", completedVideos);
    console.log("⏳ Is marking complete (RTK):", isMarkingComplete);
    console.log("⏳ Is processing (ref):", isProcessingCompletionRef.current);

    if (!currentVideo?._id) {
      console.log("❌ No current video ID found, skipping completion");
      return;
    }

    // Check if already completed - same check as button uses (isCurrentVideoCompleted)
    if (completedVideos.includes(currentVideo._id)) {
      console.log(
        "⚠️ Video already in completed list, skipping duplicate completion"
      );
      return;
    }

    // Check if already processing - same check as button
    if (isMarkingComplete || isProcessingCompletionRef.current) {
      console.log("⚠️ Completion already in progress, skipping duplicate call");
      return;
    }

    // Fire and forget - don't await to prevent unmount issues
    // handleVideoComplete will handle the async operations
    console.log("✅ All checks passed - Starting completion process");
    console.log("🚀 Calling handleVideoComplete for video:", currentVideo._id);
    handleVideoComplete(currentVideo._id).catch((error) => {
      console.error("❌ Error in handleVideoComplete callback:", error);
    });
  }, [currentVideo, completedVideos, isMarkingComplete, handleVideoComplete]);

  // Reset state when video changes
  useEffect(() => {
    // Reset processing state when video changes
    isProcessingCompletionRef.current = false;
    setIsNavigating(false);

    return () => {
      setIsNavigating(false);
      isProcessingCompletionRef.current = false;
    };
  }, [videoId]);

  // Comment handlers
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      if (editingComment) {
        // Edit existing comment
        await editComment({
          id: editingComment,
          content: comment,
        }).unwrap();
      } else {
        // Create new comment - using videoId
        await createComment({
          videoId,
          content: comment,
        }).unwrap();
      }

      setComment("");
      setEditingComment(null);
      setReplyingTo(null);
      refetchComments(); // Refresh comments after successful operation
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to submit comment");
    }
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await replyComment({
        id: commentId,
        data: { content: replyText },
      }).unwrap();

      setReplyText("");
      setReplyingTo(null);
      refetchComments();
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error("Failed to submit reply");
    }
  };

  const handleDeleteComment = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      setIsDeletingComment(true);
      const res = await videoDeleteComment(commentToDelete).unwrap();

      refetchComments();
      if (res?.success) {
        toast.success("Comment deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    } finally {
      setIsDeletingComment(false);
      setShowDeleteConfirm(false);
      setCommentToDelete(null);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await likeReply(commentId).unwrap();
      refetchComments();
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleReply = (comment) => {
    if (!comment) return;

    const commentId = comment._id;
    setReplyingTo(commentId);
    setEditingComment(null);

    const mentionName =
      comment.commentCreatorId?.name?.trim() ||
      comment.commentCreatorId?.username?.trim() ||
      "User";
    setReplyText(`@${mentionName} `);

    setTimeout(() => {
      replyInputRefs.current[commentId]?.focus();
    }, 100);
  };

  const handleEdit = (comment) => {
    setEditingComment(comment._id);
    setComment(comment.content);
    setReplyingTo(null);
    commentInputRef.current?.focus();
  };

  const handleCancel = () => {
    setEditingComment(null);
    setReplyingTo(null);
    setComment("");
    setReplyText("");
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - commentTime) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const renderComment = (comment, depth = 0) => {
    const isCurrentUser = comment.commentCreatorId?._id === currentUserId;
    
    return (
      <div key={comment._id} className="mb-4">
        <div
          className="flex items-start space-x-3 group"
          style={{ marginLeft: `${depth * 20}px` }}
        >
          {/* Avatar */}
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-gray-600">
              <Image
                src={
                  getImageUrl(comment.commentCreatorId?.image) ||
                  "/assests/profile.png"
                }
                alt={comment.commentCreatorId?.name || "User"}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            {/* User info and time */}
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-gray-900">
                {comment.commentCreatorId?.name || "Anonymous"}
              </span>
              <span className="text-xs text-gray-500">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>

            {/* Comment content */}
            <p className="text-sm text-gray-700 mb-2">{comment.content}</p>

            {/* Action buttons */}
            <div className="flex items-center space-x-4 text-xs">
              <button
                onClick={() => handleLikeComment(comment._id)}
                className="flex cursor-pointer items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                disabled={likeLoading}
              >
                <Heart
                  className={`w-3 h-3 ${
                    comment.isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span>{comment.likes || 0}</span>
                <span className={`${comment.isLiked ? "text-red-500" : ""}`}>
                  {comment.isLiked ? "Liked" : "Like"}
                </span>
              </button>

              <button
                onClick={() => handleReply(comment)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
              >
                Reply
              </button>

              {/* Edit and Delete buttons */}
              {isCurrentUser && (
                <>
                  <button
                    onClick={() => handleEdit(comment)}
                    className="text-gray-500 cursor-pointer hover:text-blue-500 transition-colors"
                    disabled={editLoading}
                  >
                    {editLoading ? "Editing..." : "Edit"}
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-gray-500 cursor-pointer hover:text-red-500 transition-colors"
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* More options */}
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
          </div>
        </div>

        {/* Reply input */}
        {replyingTo === comment._id && (
          <form
            onSubmit={(e) => handleReplySubmit(e, comment._id)}
            className="mt-3 ml-11"
          >
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-gray-600">Y</span>
              </div>
              <div className="flex-1 relative">
                <input
                  ref={(el) => (replyInputRefs.current[comment._id] = el)}
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`@${
                    comment.commentCreatorId?.name || "User"
                  } write your comment`}
                  className="w-full px-3 py-2 border cursor-pointer border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  disabled={replyLoading || !replyText.trim()}
                >
                  <Send className="w-8 h-8 text-red-500" />
                </button>
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Render replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3">
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Get next and previous video
  const currentIndex = videos.findIndex((v) => v._id === videoId);
  const nextVideo =
    currentIndex < videos.length - 1 ? videos[currentIndex + 1] : null;
  const prevVideo = currentIndex > 0 ? videos[currentIndex - 1] : null;

  if (isLoading || isNavigating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner />
          {isNavigating && (
            <p className="mt-4 text-gray-600">
              Completing video and redirecting...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Video not found</h2>
        <button
          onClick={() => router.push(`/challenge/${challengeId}`)}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Back to Challenge
        </button>
      </div>
    );
  }

  const isCurrentVideoCompleted = completedVideos.includes(currentVideo._id);
  const canGoToNext =
    nextVideo && (nextVideo.isEnabled || isCurrentVideoCompleted);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-6 lg:py-8">
      {/* Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => router.push(`/challenge/${challengeId}`)}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Challenge
        </button>
      </div>

      {/* Video Player Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            {console.log(currentVideo)}
            <UniversalVideoPlayer
              video={{
                videoId: currentVideo.videoId,
                libraryId: currentVideo.libraryId,
                title: currentVideo.title,
              }}
              autoplay={false}
              muted={false}
              nearCompletionOffset={1}
              onReady={() => console.log("Video ready")}
              onPlay={() => console.log("Video playing")}
              onPause={() => console.log("Video paused")}
              onNearCompletion={() => {
                console.log(
                  "🎯 Triggering handleManualComplete() from onNearCompletion"
                );
                handleManualComplete();
              }}
              onEnded={() => console.log("Video Completed`")}
              onProgress={({
                currentTime,
                duration,
                percentage,
                remainingTime,
              }) => {
                if (Math.floor(currentTime) % 5 === 0 && currentTime > 0) {
                  console.log(
                    `Progress ${percentage.toFixed(
                      1
                    )}% | Remaining ${remainingTime?.toFixed(1)}s`
                  );
                }
              }}
              onError={(err) => console.log(`Error ${err}`)}
            />
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            {/* Player always mounted - never unmount */}
            {/* <UniversalVideoPlayer
              ref={videoPlayerRef}
              video={currentVideo}
              autoplay={false} // Don't autoplay, we'll control via ref
              aspectRatio="16:9"
              watermark={{
                text: `Yoga With Jen`,
                position: "top-right",
              }}
              onSecurityViolation={(type) => {
                fetch("/api/security-log", {
                  method: "POST",
                  body: JSON.stringify({
                    videoId: currentVideo._id,
                    violationType: type,
                  }),
                });
              }}
              onPlay={() => {
                console.log("▶️ Video started playing");
                setShowVideo(true); // Hide thumbnail when playing starts
              }}
              onProgress={(progress) => {
                // Log progress every 10% to avoid spam
                const percent = Math.floor(progress.percentage);
                if (percent % 10 === 0 && percent > 0) {
                  console.log(
                    `📊 Video Progress: ${percent}% (${progress.currentTime.toFixed(
                      1
                    )}s / ${progress.duration.toFixed(1)}s)`
                  );
                }
              }}
              onEnded={handleVideoEnded}
            /> */}

            {/* Thumbnail overlay - shown when video not started */}
            {!showVideo && (
              <div
                className="absolute inset-0 cursor-pointer group z-30"
                onClick={() => {
                  console.log(
                    "🖱️ Thumbnail clicked - Starting video playback..."
                  );
                  setShowVideo(true);

                  // Trigger video play via ref with retry mechanism
                  const tryPlay = (retries = 0) => {
                    if (videoPlayerRef.current?.isReady()) {
                      console.log("✅ Player ready, calling play()");
                      videoPlayerRef.current.play();
                    } else if (retries < 10) {
                      console.log(
                        `⏳ Player not ready yet, retry ${retries + 1}/10...`
                      );
                      setTimeout(() => tryPlay(retries + 1), 200);
                    } else {
                      console.error("❌ Failed to play video after 10 retries");
                      toast.error(
                        "Failed to start video. Please refresh the page."
                      );
                    }
                  };

                  tryPlay();
                }}
              >
                <ImageWithLoader
                  src={getVideoAndThumbnail(currentVideo?.thumbnailUrl)}
                  alt="Video thumbnail"
                  containerClassName="rounded-2xl w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1280px"
                  quality={85}
                  onLoadComplete={() => setThumbnailLoading(false)}
                />

                {/* Play Button Overlay - Only show when thumbnail is loaded */}
                {!thumbnailLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="bg-red-500 rounded-full p-4 transition hover:scale-110">
                      <svg className="w-12 h-12 text-white" viewBox="0 0 24 24">
                        <polygon points="5,3 19,12 5,21" fill="white" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Completion status overlay */}
          {isCurrentVideoCompleted && (
            <div className="absolute top-4 right-4 bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-full flex items-center z-10">
              <svg
                className="h-4 w-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Completed
            </div>
          )}
        </div>
      </div>

      {/* Video Info */}
      <div className="p-6 rounded-lg mt-6 shadow-md">
        <div className="w-full flex justify-between">
          <h1 className="md:text-xl lg:text-2xl font-bold mb-2">
            {currentVideo.title}
          </h1>
          <div></div>
        </div>

        <p className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Clock className="w-4 h-4 text-gray-600 mr-2" />
          {currentVideo.duration}
        </p>

        {/* Equipment */}
        {currentVideo.equipment && currentVideo.equipment.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mt-2">
              {currentVideo.equipment.map((item, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 px-4 py-2 rounded-xl"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {currentVideo.description && (
          <p className="text-gray-700 leading-relaxed mb-4">
            Description: {currentVideo.description}
          </p>
        )}

        {/* Completion status and next unlock info */}
        {isCurrentVideoCompleted && nextVideoUnlockTime && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mt-4">
            <p className="text-sm text-yellow-800">
              🎉 Video completed! Next video unlocks in{" "}
              <strong>{countdown}</strong>
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <div>
          <button
            onClick={handleManualComplete}
            disabled={
              isMarkingComplete ||
              isProcessingCompletionRef.current ||
              isNavigating
            }
            className="flex items-center px-2 py-1 lg:px-6 lg:py-3 bg-primary cursor-pointer text-white rounded-sm hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isNavigating ? (
              <>Redirecting...</>
            ) : isMarkingComplete || isProcessingCompletionRef.current ? (
              <>Marking Complete...</>
            ) : isCurrentVideoCompleted ? (
              <>Go Back to Challenge</>
            ) : (
              <>Mark Complete & Go Back</>
            )}
          </button>
        </div>
      </div>

      {/* Comment Section */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Engagement Section */}
          <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 flex items-center justify-center">
                <Image
                  src={commectIcon}
                  alt="comment icons"
                  width={20}
                  height={20}
                />
              </div>
              <span className="text-sm font-medium text-gray-900">
                {comments.length}
              </span>
            </div>
          </div>

          {/* Main Comment Input */}
          <form onSubmit={handleCommentSubmit} className="mt-6 mb-6">
            <div className="relative">
              <input
                type="text"
                ref={commentInputRef}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  editingComment
                    ? "Edit your comment..."
                    : "Write your comment here "
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12"
                disabled={commentLoading || editLoading}
              />
              <button
                type="submit"
                className="absolute right-6 top-1/2 transform -translate-y-1/2"
                disabled={commentLoading || editLoading || !comment.trim()}
              >
                <Send className="w-8 h-8 text-primary" />
              </button>
            </div>
            {editingComment && (
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>

          {/* Comments Section */}
          <div className="space-y-1">
            {commentDataLoading ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => renderComment(comment))
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete comment?"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText={isDeletingComment ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        onConfirm={confirmDeleteComment}
        onCancel={() => {
          if (isDeletingComment) return;
          setShowDeleteConfirm(false);
          setCommentToDelete(null);
        }}
        isLoading={isDeletingComment}
      />
    </div>
  );
};

export default VideoPlayerPage;
