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
import { Heart, MessageSquare, Edit, Trash } from "lucide-react";

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
  isLoading = false,
}) => {
  const [newComment, setNewComment] = useState("");
  const [replyTexts, setReplyTexts] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyingToReply, setReplyingToReply] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(postId, newComment);
      setNewComment("");
    }
  };

  const handleAddReply = (commentId, parentReplyId = null) => {
    const replyText = replyTexts[`${commentId}-${parentReplyId || ""}`];
    if (replyText && replyText.trim()) {
      onAddReply(postId, commentId, replyText, parentReplyId);

      // Clear the reply text and reset UI state
      setReplyTexts({
        ...replyTexts,
        [`${commentId}-${parentReplyId || ""}`]: "",
      });
      setReplyingTo(null);
      setReplyingToReply(null);
    }
  };

  const handleEditComment = (commentId) => {
    if (editText.trim()) {
      onEditComment(commentId, editText);
      setEditingComment(null);
      setEditText("");
    }
  };

  const startEditing = (comment) => {
    setEditingComment(comment._id);
    setEditText(comment.content);
  };

  const toggleReply = (commentId, replyId = null) => {
    if (replyId) {
      setReplyingToReply(replyingToReply === replyId ? null : replyId);
      setReplyingTo(commentId);
    } else {
      setReplyingTo(replyingTo === commentId ? null : commentId);
      setReplyingToReply(null);
    }

    const key = `${commentId}-${replyId || ""}`;
    if (!replyTexts[key]) {
      setReplyTexts({ ...replyTexts, [key]: "" });
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

        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-sm p-2 border rounded"
            disabled={isLoading}
          />
          <Button
            size="sm"
            onClick={handleAddComment}
            className="bg-red-500 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Posting..." : "Comment"}
          </Button>
        </div>

        <div className="space-y-4">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="border-t pt-3">
                <div className="flex items-start gap-2 mb-2">
                  <Avatar className="h-8 w-8">
                    {comment?.userId?.image ? (
                      <Image
                        src={getImageUrl(comment.userId.image)}
                        height={32}
                        width={32}
                        alt={comment?.userId?.name || "User"}
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        {(comment?.userId?.name || "U").charAt(0)}
                      </div>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {comment?.userId?.name || "Unknown User"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(comment?.createdAt)}
                      </span>
                    </div>

                    {editingComment === comment._id ? (
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 text-sm p-2 border rounded"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleEditComment(comment._id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingComment(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm mt-1">{comment.content}</p>
                    )}

                    <div className="flex items-center gap-3 mt-1">
                      <button
                        onClick={() => toggleReply(comment._id)}
                        className="text-sm text-blue-500 flex items-center gap-1"
                      >
                        <MessageSquare className="h-4 w-4" />
                        {replyingTo === comment._id && !replyingToReply
                          ? "Cancel"
                          : "Reply"}
                      </button>

                      <button
                        onClick={() => onLikeComment(comment._id)}
                        className={`text-sm flex items-center gap-1 ${
                          (comment.likedBy || []).includes(currentUserId)
                            ? "text-red-500"
                            : "text-blue-500"
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            (comment.likedBy || []).includes(currentUserId)
                              ? "fill-red-500"
                              : ""
                          }`}
                        />
                        Like ({comment.likes || 0})
                      </button>

                      {comment?.userId?._id === currentUserId && (
                        <>
                          <button
                            onClick={() => startEditing(comment)}
                            className="text-sm text-blue-500 flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteComment(comment._id)}
                            className="text-sm text-red-500 flex items-center gap-1"
                          >
                            <Trash className="h-4 w-4" />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {replyingTo === comment._id && !replyingToReply && (
                  <div className="ml-10 mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={replyTexts[`${comment._id}-`] || ""}
                      onChange={(e) =>
                        setReplyTexts({
                          ...replyTexts,
                          [`${comment._id}-`]: e.target.value,
                        })
                      }
                      placeholder="Write a reply..."
                      className="flex-1 text-sm p-2 border rounded"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddReply(comment._id)}
                      className="bg-red-500 text-white"
                    >
                      Reply
                    </Button>
                  </div>
                )}

                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-10 mt-2 space-y-3">
                    {comment.replies.map((reply) => (
                      <ReplyItem
                        key={reply._id}
                        reply={reply}
                        commentId={comment._id}
                        currentUserId={currentUserId}
                        replyingTo={replyingTo}
                        replyingToReply={replyingToReply}
                        replyTexts={replyTexts}
                        setReplyTexts={setReplyTexts}
                        toggleReply={toggleReply}
                        handleAddReply={handleAddReply}
                        onLikeReply={onLikeReply}
                        depth={1}
                        formatTimeAgo={formatTimeAgo}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

function ReplyItem({
  reply,
  commentId,
  currentUserId,
  replyingTo,
  replyingToReply,
  replyTexts,
  setReplyTexts,
  toggleReply,
  handleAddReply,
  onLikeReply,
  depth = 1,
  formatTimeAgo,
}) {
  const maxDepth = 5;
  const canReply = depth < maxDepth;

  return (
    <div
      className={`flex items-start gap-2 ${
        depth > 1 ? "border-l-2 border-gray-200 pl-2" : ""
      }`}
    >
      <Avatar className="h-6 w-6">
        {reply?.userId?.image ? (
          <Image
            src={getImageUrl(reply.userId.image)}
            height={24}
            width={24}
            alt={reply?.userId?.name || "User"}
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-xs">
            {(reply?.userId?.name || "U").charAt(0)}
          </div>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {reply?.userId?.name || "Unknown User"}
          </span>
          <span className="text-xs text-gray-500">
            {formatTimeAgo(reply?.createdAt)}
          </span>
        </div>
        <p className="text-sm mt-1">{reply.content}</p>

        <div className="flex items-center gap-3 mt-1">
          {canReply && (
            <button
              onClick={() => toggleReply(commentId, reply._id)}
              className="text-sm text-blue-500 flex items-center gap-1"
            >
              <MessageSquare className="h-3 w-3" />
              {replyingToReply === reply._id ? "Cancel" : "Reply"}
            </button>
          )}

          <button
            onClick={() => onLikeReply(reply._id)}
            className={`text-sm flex items-center gap-1 ${
              (reply.likedBy || []).includes(currentUserId)
                ? "text-red-500"
                : "text-blue-500"
            }`}
          >
            <Heart
              className={`h-3 w-3 ${
                (reply.likedBy || []).includes(currentUserId)
                  ? "fill-red-500"
                  : ""
              }`}
            />
            Like ({reply.likes || 0})
          </button>
        </div>

        {replyingToReply === reply._id && (
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              value={replyTexts[`${commentId}-${reply._id}`] || ""}
              onChange={(e) =>
                setReplyTexts({
                  ...replyTexts,
                  [`${commentId}-${reply._id}`]: e.target.value,
                })
              }
              placeholder="Write a reply..."
              className="flex-1 text-sm p-2 border rounded"
            />
            <Button
              size="sm"
              onClick={() => handleAddReply(commentId, reply._id)}
              className="bg-red-500 text-white"
            >
              Reply
            </Button>
          </div>
        )}

        {reply.replies && reply.replies.length > 0 && (
          <div className="mt-2 space-y-3">
            {reply.replies.map((nestedReply) => (
              <ReplyItem
                key={nestedReply._id}
                reply={nestedReply}
                commentId={commentId}
                currentUserId={currentUserId}
                replyingTo={replyingTo}
                replyingToReply={replyingToReply}
                replyTexts={replyTexts}
                setReplyTexts={setReplyTexts}
                toggleReply={toggleReply}
                handleAddReply={handleAddReply}
                onLikeReply={onLikeReply}
                depth={depth + 1}
                formatTimeAgo={formatTimeAgo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
