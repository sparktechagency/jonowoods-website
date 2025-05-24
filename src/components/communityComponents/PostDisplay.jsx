"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "../share/imageUrl";
import { formatDistanceToNow } from "date-fns";
import CommentsContainer from "./CommentsContainer";
import { useLikePostMutation } from "@/redux/featured/community/communityApi";

const PostDisplay = ({ posts, currentUserId = "yourusername" }) => {
  
  const [likePost] = useLikePostMutation();

  const handleLike = async (postId) => {
    try {
      await likePost(postId);
      // The post data will be updated via RTK Query cache invalidation
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  // Format the timestamp to a relative time (e.g., "2 hours ago")
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "recently";
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };

  return (
    <div className="mb-8 mt-16 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {posts?.map((post) => (
          <Card key={post?._id} className="p-4">
            <div className="flex items-center mb-3">
              <Avatar className="h-12 w-12 mr-2">
                {post?.userId?.image ? (
                  <Image
                    src={getImageUrl(post.userId.image)}
                    height={50}
                    width={50}
                    alt={post?.userId?.name || "User"}
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    {(post?.userId?.name || "U").charAt(0)}
                  </div>
                )}
              </Avatar>
              <div className="flex flex-col gap-1">
                <span className="font-bold">
                  {post?.userId?.name || "Unknown User"}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(post?.createdAt)}
                </span>
              </div>
            </div>
            <div
              className="mb-3 max-w-2xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <div className="flex items-center space-x-10">
              <button
                className="flex items-center text-xl"
                onClick={() => handleLike(post._id)}
              >
                <HeartIcon
                  className={`h-8 w-8 mr-1 ${
                    (post.likedBy || []).includes(currentUserId)
                      ? "text-white fill-red-500"
                      : "text-red-500"
                  }`}
                />
                {post.likes || 0}
              </button>

              <CommentsContainer
                postId={post._id}
                currentUserId={currentUserId}
                commentsCount={(post.comments || []).length}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PostDisplay;
