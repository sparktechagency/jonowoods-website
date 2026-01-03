"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { getVideoAndThumbnail } from "../share/imageUrl";
import Pagination from "./PaginationComponent";
import Spinner from "@/app/(commonLayout)/Spinner";
import { useGetVideoCommentsQuery } from "@/redux/featured/community/videoCommentApi";

export default function CommentsDisplay() {
  const [currentPage, setCurrentPage] = useState(1);
  const [comments, setComments] = useState([]);

  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useGetVideoCommentsQuery([
    { name: "page", value: currentPage },
    { name: "limit", value: 10 },
  ]);

  // Extract comments and pagination from API response
  useEffect(() => {
    if (apiResponse?.data) {
      setComments(apiResponse.data || []);
    }
  }, [apiResponse]);

  const pagination = apiResponse?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format the timestamp to a relative time (e.g., "2 hours ago")
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "";
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  // Error state
  if (isError) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <div className="text-center bg-red-50 p-6 rounded-lg">
          <p className="text-red-600">
            Error loading comments. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-8">
      {comments && comments.length > 0 ? (
        <>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="flex gap-4 p-4 bg-gray-100 rounded-2xl  shadow-md"
              >
                {/* Video Thumbnail on Left */}
                <div className="flex-shrink-0">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-700">
                    {comment.videoId?.thumbnailUrl ? (
                      <Image
                        src={getVideoAndThumbnail(
                          comment.videoId.thumbnailUrl
                        )}
                        alt={comment.videoId.title || "Video thumbnail"}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600" />
                    )}
                  </div>
                </div>

                {/* Comment Text on Right */}
                <div className="flex-1 min-w-0 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-1 lg:gap-4">
                  <p className="text-black leading-relaxed flex-1">
                    <span className="font-semibold">
                      {comment.commentCreatorId?.name || "Unknown User"}
                    </span>{" "}
                    commented on{" "}
                    <span className="font-semibold">
                      {comment.videoId?.title || "Video"}
                    </span>
                    : {comment.content}
                  </p>
                  {/* Timestamp - only visible on large screens */}
                  {comment.createdAt && (
                    <p className="text-gray-500 text-xs hidden lg:block flex-shrink-0">
                      {formatTimeAgo(comment.createdAt)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPage > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No comments found.</p>
        </div>
      )}
    </div>
  );
}

