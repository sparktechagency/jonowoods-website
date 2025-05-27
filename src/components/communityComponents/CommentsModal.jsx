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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { getImageUrl } from "../share/imageUrl";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageSquare,
  Edit,
  Trash,
  Loader2,
  MoreVertical,
} from "lucide-react";

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
  isCommenting = false,
}) => {
  const [newComment, setNewComment] = useState("");
  const [replyTexts, setReplyTexts] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyingToReply, setReplyingToReply] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [loadingStates, setLoadingStates] = useState({
    commenting: false,
    replying: {},
    liking: {},
    editing: {},
    deleting: {},
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

  const handleAddReply = async (commentId, parentReplyId = null) => {
    const replyKey = `${commentId}-${parentReplyId || ""}`;
    const replyText = replyTexts[replyKey];

    if (replyText && replyText.trim()) {
      setLoadingState("replying", replyKey, true);
      try {
        await onAddReply(postId, commentId, replyText, parentReplyId);

        // Clear the reply text and reset UI state
        setReplyTexts({
          ...replyTexts,
          [replyKey]: "",
        });
        setReplyingTo(null);
        setReplyingToReply(null);
      } finally {
        setLoadingState("replying", replyKey, false);
      }
    }
  };

  const handleEditComment = async (commentId) => {
    if (editText.trim()) {
      setLoadingState("editing", commentId, true);
      try {
        await onEditComment(commentId, editText);
        setEditingComment(null);
        setEditText("");
      } finally {
        setLoadingState("editing", commentId, false);
      }
    }
  };

  const handleLikeComment = async (commentId) => {
    setLoadingState("liking", `comment-${commentId}`, true);
    try {
      await onLikeComment(commentId);
    } finally {
      setLoadingState("liking", `comment-${commentId}`, false);
    }
  };

  const handleLikeReply = async (replyId) => {
    setLoadingState("liking", `reply-${replyId}`, true);
    try {
      await onLikeReply(replyId);
    } finally {
      setLoadingState("liking", `reply-${replyId}`, false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setLoadingState("deleting", commentId, true);
    try {
      await onDeleteComment(commentId);
    } finally {
      setLoadingState("deleting", commentId, false);
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
            disabled={loadingStates.commenting || isLoading}
          />
          <Button
            size="sm"
            onClick={handleAddComment}
            className="bg-red-500 text-white min-w-[80px]"
            disabled={loadingStates.commenting || isLoading}
          >
            {loadingStates.commenting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Posting...</span>
              </div>
            ) : (
              "Comment"
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading comments...</span>
            </div>
          ) : comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="border-t pt-3">
                <div className="flex items-start gap-2 mb-2">
                  <Avatar className="h-8 w-8">
                    {comment?.commentCreatorId?.image ? (
                      <Image
                        src={getImageUrl(comment.commentCreatorId.image)}
                        height={32}
                        width={32}
                        alt={comment?.commentCreatorId?.name || "User"}
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {(comment?.commentCreatorId?.name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {comment?.commentCreatorId?.name || "Unknown User"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(comment?.createdAt)}
                        </span>
                      </div>

                      {/* 3-dot menu for edit/delete - only show for comment owner */}
                      {comment?.commentCreatorId?._id === currentUserId && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-gray-100"
                            >
                              <MoreVertical className="h-4 w-4 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem
                              onClick={() => startEditing(comment)}
                              disabled={loadingStates.editing[comment._id]}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteComment(comment._id)}
                              disabled={loadingStates.deleting[comment._id]}
                              className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700"
                            >
                              {loadingStates.deleting[comment._id] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash className="h-4 w-4" />
                              )}
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    {editingComment === comment._id ? (
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 text-sm p-2 border rounded"
                          disabled={loadingStates.editing[comment._id]}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleEditComment(comment._id)}
                          disabled={loadingStates.editing[comment._id]}
                        >
                          {loadingStates.editing[comment._id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Save"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingComment(null)}
                          disabled={loadingStates.editing[comment._id]}
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
                        className="text-sm text-blue-500 flex items-center gap-1 hover:text-blue-600"
                        disabled={loadingStates.replying[`${comment._id}-`]}
                      >
                        <MessageSquare className="h-4 w-4" />
                        {replyingTo === comment._id && !replyingToReply
                          ? "Cancel"
                          : "Reply"}
                      </button>

                      <button
                        onClick={() => handleLikeComment(comment._id)}
                        disabled={
                          loadingStates.liking[`comment-${comment._id}`]
                        }
                        className={`text-sm flex items-center gap-1 hover:scale-105 transition-transform ${
                          (comment.likedBy || []).includes(currentUserId)
                            ? "text-red-500"
                            : "text-blue-500"
                        }`}
                      >
                        {loadingStates.liking[`comment-${comment._id}`] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Heart
                            className={`h-4 w-4 ${
                              (comment.likedBy || []).includes(currentUserId)
                                ? "fill-red-500"
                                : ""
                            }`}
                          />
                        )}
                        Like ({comment.likes || 0})
                      </button>
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
                      disabled={loadingStates.replying[`${comment._id}-`]}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddReply(comment._id)}
                      className="bg-red-500 text-white min-w-[70px]"
                      disabled={loadingStates.replying[`${comment._id}-`]}
                    >
                      {loadingStates.replying[`${comment._id}-`] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Reply"
                      )}
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
                        onLikeReply={handleLikeReply}
                        depth={1}
                        formatTimeAgo={formatTimeAgo}
                        loadingStates={loadingStates}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
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
  loadingStates,
}) {
  const maxDepth = 5;
  const canReply = depth < maxDepth;
  const replyKey = `${commentId}-${reply._id}`;

  return (
    <div
      className={`flex items-start gap-2 ${
        depth > 1 ? "border-l-2 border-gray-200 pl-2" : ""
      }`}
    >
      <Avatar className="h-6 w-6">
        {reply?.commentCreatorId?.image ? (
          <Image
            src={getImageUrl(reply.commentCreatorId.image)}
            height={24}
            width={24}
            alt={reply?.commentCreatorId?.name || "User"}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
            {(reply?.commentCreatorId?.name || "U").charAt(0).toUpperCase()}
          </div>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {reply?.commentCreatorId?.name || "Unknown User"}
            </span>
            <span className="text-xs text-gray-500">
              {formatTimeAgo(reply?.createdAt)}
            </span>
          </div>

          {/* 3-dot menu for replies - only show for reply owner */}
          {reply?.commentCreatorId?._id === currentUserId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 hover:bg-gray-100"
                >
                  <MoreVertical className="h-3 w-3 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <Edit className="h-3 w-3" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700">
                  <Trash className="h-3 w-3" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <p className="text-sm mt-1">{reply.content}</p>

        <div className="flex items-center gap-3 mt-1">
          {canReply && (
            <button
              onClick={() => toggleReply(commentId, reply._id)}
              className="text-sm text-blue-500 flex items-center gap-1 hover:text-blue-600"
              disabled={loadingStates.replying[replyKey]}
            >
              <MessageSquare className="h-3 w-3" />
              {replyingToReply === reply._id ? "Cancel" : "Reply"}
            </button>
          )}

          <button
            onClick={() => onLikeReply(reply._id)}
            disabled={loadingStates.liking[`reply-${reply._id}`]}
            className={`text-sm flex items-center gap-1 hover:scale-105 transition-transform ${
              (reply.likedBy || []).includes(currentUserId)
                ? "text-red-500"
                : "text-blue-500"
            }`}
          >
            {loadingStates.liking[`reply-${reply._id}`] ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Heart
                className={`h-3 w-3 ${
                  (reply.likedBy || []).includes(currentUserId)
                    ? "fill-red-500"
                    : ""
                }`}
              />
            )}
            Like ({reply.likes || 0})
          </button>
        </div>

        {replyingToReply === reply._id && (
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              value={replyTexts[replyKey] || ""}
              onChange={(e) =>
                setReplyTexts({
                  ...replyTexts,
                  [replyKey]: e.target.value,
                })
              }
              placeholder="Write a reply..."
              className="flex-1 text-sm p-2 border rounded"
              disabled={loadingStates.replying[replyKey]}
            />
            <Button
              size="sm"
              onClick={() => handleAddReply(commentId, reply._id)}
              className="bg-red-500 text-white min-w-[70px]"
              disabled={loadingStates.replying[replyKey]}
            >
              {loadingStates.replying[replyKey] ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Reply"
              )}
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
                loadingStates={loadingStates}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
