"use client";

import { jwtDecode } from "jwt-decode";
import { Heart, MoreHorizontal, Send } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSingleChallengeVideoQuery } from "@/redux/featured/CommingSoon/commingSoonApi";
import Spinner from "../../Spinner";
import ImageWithLoader from "@/components/share/ImageWithLoader";
import { getImageUrl, getVideoAndThumbnail } from "@/components/share/imageUrl";
import { Button } from "@/components/ui/button";
import commectIcon from "../../../../../public/assests/comment.png";
// import { useGetCommentQuery } from "@/redux/featured/commentApi/commentApi";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useEditCommentMutation,
  useGetCommentQuery,
  useLikeReplyMutation,
  useReplyCommentMutation,
  useVideoDeleteCommentMutation,
} from "@/redux/featured/commentApi/commentApi";

const ChallengePage = ({ params }) => {
  const { id } = React.use(params);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const queryParams = [
    {
      name: "page",
      value: currentPage,
    },
    {
      name: "limit",
      value: perPage,
    },
  ];
  const { data, isLoading, refetch } = useSingleChallengeVideoQuery({
    id,
    params: queryParams,
  });

  // Comment section state and hooks
  const [comment, setComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const decoded = token ? jwtDecode(token) : null;
  const currentUserId = decoded?.id;

  // Comment API hooks
  const {
    data: commentData,
    isLoading: commentDataLoading,
    refetch: refetchComments,
  } = useGetCommentQuery(id, { skip: !id });
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

  // Initialize comments from API data
  useEffect(() => {
    if (commentData?.data) {
      setComments(commentData.data);
    }
  }, [commentData]);

  // Refetch data when component mounts or page becomes visible
  useEffect(() => {
    refetch();
  }, [refetch]);
  const challengeInfo = data?.data?.categoryInfo;
  console.log(challengeInfo);
  console.log(data);

  const [videos, setVideos] = useState([]);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [thumbnailLoadingStates, setThumbnailLoadingStates] = useState({});

  // Initialize videos and completed videos
  useEffect(() => {
    if (data?.data?.result) {
      const sortedVideos = [...data.data.result];
      setVideos(sortedVideos);

      // Keep track of all videos across all pages
      setAllVideos((prev) => {
        const existing = prev.filter(
          (v) => !sortedVideos.find((sv) => sv._id === v._id)
        );
        return [...existing, ...sortedVideos];
      });

      const completed = sortedVideos
        .filter((video) => video.isVideoCompleted)
        .map((video) => video._id);
      setCompletedVideos((prev) => [...new Set([...prev, ...completed])]);
    }
  }, [data]);

  // Check if a video is accessible
  const isVideoAccessible = (index) => {
    const video = videos[index];
    return video && video.isEnabled;
  };

  // Calculate countdown for locked videos
  const calculateCountdown = (unlockTime) => {
    const now = new Date().getTime();
    const unlockTimestamp = new Date(unlockTime).getTime();
    const difference = unlockTimestamp - now;

    if (difference > 0) {
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return "Unlocked";
    }
  };

  // Get video countdown
  const getVideoCountdown = (video) => {
    if (video.nextUnlockTime) {
      return calculateCountdown(video.nextUnlockTime);
    }
    return null;
  };

  // Handle video click
  const handleVideoClick = (video, index) => {
    if (isVideoAccessible(index)) {
      // Navigate to individual video page
      router.push(`/challenge/${id}/video/${video._id}`);
    } else {
      const countdownText = getVideoCountdown(video);
      if (countdownText && countdownText !== "Unlocked") {
        toast.info("Video locked", {
          description: `This video will unlock in ${countdownText}.`,
        });
      } else {
        toast.info("Video locked", {
          description: "Complete the previous video to unlock this one.",
        });
      }
    }
  };

  // Find next available video from current page
  const findNextAvailableVideo = () => {
    // First check current page videos
    for (let i = 0; i < videos.length; i++) {
      if (isVideoAccessible(i) && !completedVideos.includes(videos[i]._id)) {
        return videos[i];
      }
    }
    return null;
  };

  // Handle Next Flow button click
  const handleNextFlow = () => {
    const nextVideo = findNextAvailableVideo();
    if (nextVideo) {
      router.push(`/challenge/${id}/video/${nextVideo._id}`);
    } else {
      toast.info("No available video", {
        description: "You have completed all available videos!",
      });
    }
  };

  const handlePageChange = (page) => {
    const meta = data?.data?.meta;
    if (page >= 1 && page <= meta?.totalPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
        // Create new comment - using challengeId instead of videoId
        await createComment({
          challengeId: id,
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

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await videoDeleteComment(commentId).unwrap();

      refetchComments();
      if (res?.success) {
        toast.success("Comment deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
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

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    setEditingComment(null);
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
                onClick={() => handleReply(comment._id)}
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

  if (isLoading) return <Spinner />;

  if (!data?.data?.result || data.data.result.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No challenge videos found</h2>
        <button
          onClick={() => router.push("/challenge")}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
        >
          Back to Challenges
        </button>
      </div>
    );
  }

  // Get challenge details from first video (assuming all videos belong to same challenge)
  const challengeData = data?.data?.challengeInfo || videos[0];
  console.log(challengeData);
  console.log("Pagination Debug:", {
    meta: data?.data?.meta,
    totalPage: data?.data?.meta?.totalPage,
    condition: data?.data?.meta?.totalPage > 1,
  });

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Challenge Details Header */}
      <div className="mb-8">
        {/* Back button */}
        {/* <button
          onClick={() => router.push("/challenge")}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
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
          Back to Challenges
        </button> */}

        {/* Challenge header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Challenge thumbnail */}
            <div className="md:w-1/3 lg:w-1/4">
              <ImageWithLoader
                src={getImageUrl(challengeInfo?.image)}
                alt={challengeData?.name || challengeData?.title || "Challenge"}
                containerClassName="h-72 md:h-72"
              />
            </div>

            {/* Challenge details */}
            <div className="p-6 md:w-2/3 lg:w-3/4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                <span className="font-medium text-base">Challenge Name:</span>{" "}
                {challengeInfo?.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600"></div>

              {challengeInfo?.description && (
                <p className="text-gray-700 leading-relaxed mb-4">
                  Description: {challengeInfo?.description}
                </p>
              )}

              {/* <p className="text-sm text-gray-600">
                Progress: {completedVideos.length} of {videos.length} videos
                completed
              </p> */}
              <p className=" ">
                Total Videos:{" "}
                <span className="font-bold text-primary">{videos.length}</span>
              </p>
              <p className=" ">
                Complete Videos:{" "}
                <span className="font-bold text-primary">
                  {completedVideos.length}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold mb-6">
            Challenge Video
          </h2>
          <div className=" hidden lg:block p-4   ">
            <div className="flex justify-end">
              <Button
                onClick={handleNextFlow}
                className="py-6 text-white font-semibold px-6 rounded-md transform transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
              >
                Next Flow
              </Button>
            </div>
          </div>
        </div>

        {/* Next Flow Button - Fixed at bottom on mobile only */}
        <div className="block lg:hidden fixed bottom-0 left-0 right-0 p-4   z-50">
          <div className="flex justify-end">
            <Button
              onClick={handleNextFlow}
              className="py-6 text-white font-semibold px-6 rounded-md transform transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              Next Flow
            </Button>
          </div>
        </div>

        {/* Add bottom padding to prevent content from being hidden behind fixed button */}
        <div className="block md:hidden h-20"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video, index) => {
            const isAccessible = isVideoAccessible(index);
            const isCompleted = completedVideos.includes(video._id);
            const videoCountdown = getVideoCountdown(video);
            const isThumbnailLoading =
              thumbnailLoadingStates[video._id] !== false;

            return (
              <div
                key={video._id}
                onClick={() => handleVideoClick(video, index)}
                className={`
                  relative rounded-lg overflow-hidden cursor-pointer border transition-all duration-300
                  ${
                    isAccessible
                      ? "hover:shadow-lg hover:scale-105 border-gray-200"
                      : "opacity-70 cursor-not-allowed border-gray-300"
                  }
                  ${isCompleted ? "ring-2 ring-green-500" : ""}
                `}
              >
                {/* Video thumbnail */}
                <div className="relative h-48">
                  <ImageWithLoader
                    src={getVideoAndThumbnail(
                      video.thumbnailUrl || video.image
                    )}
                    alt={video.title}
                    containerClassName="h-48"
                    onLoadComplete={() => {
                      setThumbnailLoadingStates((prev) => ({
                        ...prev,
                        [video._id]: false,
                      }));
                    }}
                  />

                  {/* Lock overlay for inaccessible videos - Only show when thumbnail is loaded */}
                  {!isAccessible && !isThumbnailLoading && (
                    <div className="absolute inset-0   flex items-center justify-center z-10">
                      <div className="text-center bg-red-600 text-white px-4 py-2 opacity-80 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 mx-auto mb-"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        {video.nextUnlockTime ? (
                          <div>
                            <p className="text-sm ">Unlocks in</p>
                            <p className="text-xs font-bold text-yellow-300">
                              {videoCountdown || "Calculating..."}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm">Locked</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Completion indicator */}
                  {isCompleted && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Play button overlay - Only show when thumbnail is loaded */}
                  {isAccessible && !isThumbnailLoading && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg- bg-opacity-30 z-10">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-white "
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video details */}
                <div className="p-4 bg-white">
                  <h3 className="font-medium text-sm line-clamp-2 text-gray-900 mb-1">
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{video.duration}</p>

                  {/* Status indicator */}
                  <div className="flex items-center justify-between">
                    {isCompleted ? (
                      <span className="text-xs text-green-600 font-medium flex items-center">
                        <svg
                          className="h-3 w-3 mr-1"
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
                      </span>
                    ) : isAccessible ? (
                      <span className="text-xs text-blue-600 font-medium flex items-center">
                        <svg
                          className="h-3 w-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Available
                      </span>
                    ) : video.nextUnlockTime && videoCountdown ? (
                      <p className="text-xs text-yellow-600 font-medium flex items-center">
                        ⏳ Unlocks in {videoCountdown}
                      </p>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium flex items-center">
                        <svg
                          className="h-3 w-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {video?.lockReason}
                      </span>
                    )}
                  </div>

                  <p>
                    {video?.description.length > 200
                      ? video?.description.slice(0, 120) + "..."
                      : video?.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {data?.data?.meta?.totalPage > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark"
              }`}
            >
              Prev
            </button>

            <span className="text-gray-700 font-medium">
              Page {currentPage} of {data?.data?.meta?.totalPage}
            </span>

            <button
              disabled={currentPage === data?.data?.meta?.totalPage}
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === data?.data?.meta?.totalPage
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Comment Section */}
      {/* <div className="mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
    
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
      </div> */}
    </div>
  );
};

export default ChallengePage;
