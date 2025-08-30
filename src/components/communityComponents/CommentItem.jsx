"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { getImageUrl } from "../share/imageUrl";
import ProfileIcon from "../profileIcon/ProfileIcon";
import { Heart, MessageSquare, Edit, Trash, MoreVertical } from "lucide-react";
import ButtonSpinner from "@/app/(commonLayout)/ButtonSpinner";
import ReplyItem from "./ReplyItem";

const CommentItem = ({
  comment,
  postId,
  currentUserId,
  onAddReply,
  onLikeComment,
  onDeleteComment,
  onEditComment,
  onLikeReply,
  onDeleteReply,
  onEditReply,
  formatTimeAgo,
}) => {
  const [replyTexts, setReplyTexts] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [loadingStates, setLoadingStates] = useState({
    replying: {},
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
    try {
      await onLikeComment(commentId);
    } catch (error) {
      console.error("Failed to like comment:", error);
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

  const toggleReply = (commentId, commentCreatorName) => {
    const key = `${commentId}-`;

    if (replyingTo === commentId) {
      setReplyingTo(null);
      setReplyTexts((prev) => ({
        ...prev,
        [key]: "",
      }));
    } else {
      setReplyingTo(commentId);
      setReplyTexts((prev) => ({
        ...prev,
        [key]: `@${commentCreatorName} `,
      }));
    }
  };
  

  return (
    <div className="border-t pt-3">
      <div className="flex items-start gap-5 mb-2">
        <Avatar className="h-12 w-12">
          <ProfileIcon 
            image={comment?.commentCreatorId?.image}
            size={48}
            className="h-full w-full"
          />
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
                    className="h-6 w-6 p-0 hover:bg-gray-100 cursor-pointer"
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
                    
                      <Trash className="h-4 w-4" />
                    
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleEditComment();
                }
              }}
              className="flex-1 text-sm p-2 border rounded cursor-text"
            />
              <Button
                size="sm"
                onClick={() => handleEditComment(comment._id)}
                className="cursor-pointer p-[18px]"
              >
                {loadingStates.editing[comment._id] ? (
                  <ButtonSpinner className="h-4 w-4 animate-spin" />
                ) : (
                  "Update "
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingComment(null)}
                disabled={loadingStates.editing[comment._id]}
                className="cursor-pointer border p-[18px]"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <p className="text-sm mt-1">{comment.content}</p>
          )}

          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={() =>
                toggleReply(comment._id, comment.commentCreatorId?.name || "")
              }
              className="text-sm text-blue-500 flex items-center gap-1 hover:text-blue-600 cursor-pointer transition-colors"
              disabled={loadingStates.replying[`${comment._id}-`]}
            >
              <MessageSquare className="h-4 w-4" />
              {replyingTo === comment._id ? "Cancel" : "Reply"}
            </button>

            <button
              onClick={() => handleLikeComment(comment._id)}
              className={`text-sm flex items-center gap-1 hover:scale-105 transition-all cursor-pointer ${
                comment.isLiked ||
                (comment.likedBy || []).includes(currentUserId)
                  ? "text-red-500"
                  : "text-blue-500 hover:text-red-400"
              }`}
            >
              <Heart
                className={`h-4 w-4 transition-all ${
                  comment.isLiked ||
                  (comment.likedBy || []).includes(currentUserId)
                    ? "fill-red-500 text-red-500"
                    : "hover:fill-red-100"
                }`}
              />
              Like ({comment.likes || 0})
            </button>
          </div>
        </div>
      </div>

      {replyingTo === comment._id && (
        <div className="ml-20 mt-2 flex items-center gap-2">
          <input
            type="text"
            value={replyTexts[`${comment._id}-`] || ""}
            onChange={(e) =>
              setReplyTexts({
                ...replyTexts,
                [`${comment._id}-`]: e.target.value,
              })
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddReply(comment._id);
              }
            }}
            placeholder="Write a reply..."
            className="flex-1 text-sm p-2 border rounded cursor-text"
            disabled={loadingStates.replying[`${comment._id}-`]}
          />
          <Button
            size="sm"
            onClick={() => handleAddReply(comment._id)}
            className=" text-white min-w-[70px] cursor-pointer "
          >
            {loadingStates.replying[`${comment._id}-`] ? (
              <ButtonSpinner className="h-4 w-4 animate-spin" />
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
              onLikeReply={onLikeReply}
              onDeleteReply={onDeleteReply}
              onEditReply={onEditReply}
              onAddReply={onAddReply}
              postId={postId}
              formatTimeAgo={formatTimeAgo}
              depth={1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
