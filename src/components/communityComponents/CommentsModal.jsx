"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { getImageUrl } from "../share/imageUrl";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare, MoreVertical } from "lucide-react";
import Spinner from "@/app/(commonLayout)/Spinner";
import ButtonSpinner from "@/app/(commonLayout)/ButtonSpinner";
import CommentItem from "./CommentItem";

export const CommentsModal = ({
  postId,
  comments,
  currentUserId,
  open,
  onClose,
  onAddComment,
  onAddReply,
  onLikeComment,
  onDeleteComment,
  onEditComment,
  onLikeReply,
  onDeleteReply,
  onEditReply,
  isLoading = false,
  isCommenting = false,
}) => {
  const [newComment, setNewComment] = useState("");
  const [loadingStates, setLoadingStates] = useState({
    commenting: false,
  });

  const setLoadingState = (type, id, value) => {
    setLoadingStates((prev) => ({
      ...prev,
      [type]:
        typeof prev[type] === "object" ? { ...prev[type], [id]: value } : value,
    }));
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      setLoadingState("commenting", null, true);
      try {
        await onAddComment(postId, newComment);
        setNewComment("");
      } finally {
        setLoadingState("commenting", null, false);
      }
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-96 md:min-w-xl lg:min-w-3xl max-h-[72vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>

        <div className="flex items-center  mb-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
            placeholder="Add a comment..."
            className="flex-1 text-sm p-[9px] border rounded rounded-r-none  cursor-text"
            disabled={loadingStates.commenting}
          />
          <Button
            size="sm"
            onClick={handleAddComment}
            className=" text-white min-w-[80px] rounded-l-none p-5 cursor-pointer "
          >
            {loadingStates.commenting ? (
              <div className="flex items-center gap-2">
                <ButtonSpinner className="h-4 w-4 animate-spin" />
                <span>Posting...</span>
              </div>
            ) : (
              "Comment"
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {/* Show loading only when initially loading comments */}
          {isLoading && !comments ? (
            <div className="flex justify-center py-8">
              <ButtonSpinner className="h-4 w-4" />
            </div>
          ) : comments && comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                postId={postId}
                currentUserId={currentUserId}
                onAddReply={onAddReply}
                onLikeComment={onLikeComment}
                onDeleteComment={onDeleteComment}
                onEditComment={onEditComment}
                onLikeReply={onLikeReply}
                onDeleteReply={onDeleteReply}
                onEditReply={onEditReply}
                formatTimeAgo={formatTimeAgo}
              />
            ))
          ) : isLoading ? (
            <Spinner />
          ) : (
            <div className="text-center py-6 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
