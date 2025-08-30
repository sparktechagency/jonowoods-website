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

const ReplyItem = ({
  reply,
  commentId,
  currentUserId,
  onLikeReply,
  onDeleteReply,
  onEditReply,
  onAddReply,
  postId,
  formatTimeAgo,
  depth = 1,
}) => {
  const [replyTexts, setReplyTexts] = useState({});
  const [replyingToReply, setReplyingToReply] = useState(null);
  const [editingReply, setEditingReply] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [loadingStates, setLoadingStates] = useState({
    replying: {},
    editingReply: {},
    deletingReply: {},
  });

  const maxDepth = 2;
  const canReply = depth < maxDepth;

  const setLoadingState = (type, id, value) => {
    setLoadingStates((prev) => ({
      ...prev,
      [type]:
        typeof prev[type] === "object" ? { ...prev[type], [id]: value } : value,
    }));
  };

  const handleAddReply = async (parentReplyId) => {
    const replyKey = `${commentId}-${parentReplyId}`;
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
        setReplyingToReply(null);
      } finally {
        setLoadingState("replying", replyKey, false);
      }
    }
  };

  const handleEditReply = async () => {
    if (editReplyText.trim()) {
      setLoadingState("editingReply", reply._id, true);
      try {
        await onEditReply(reply._id, editReplyText);
        setEditingReply(null);
        setEditReplyText("");
      } finally {
        setLoadingState("editingReply", reply._id, false);
      }
    }
  };

  const handleDeleteReply = async () => {
    setLoadingState("deletingReply", reply._id, true);
    try {
      await onDeleteReply(reply._id);
    } finally {
      setLoadingState("deletingReply", reply._id, false);
    }
  };

  const handleLikeReply = async () => {
    try {
      await onLikeReply(reply._id);
    } catch (error) {
      console.error("Failed to like reply:", error);
    }
  };

  const startEditingReply = (reply) => {
    setEditingReply(reply._id);
    setEditReplyText(reply.content);
  };

  const toggleReply = (replyId) => {
    if (replyingToReply === replyId) {
      // Cancel reply
      setReplyingToReply(null);
      setReplyTexts((prev) => ({
        ...prev,
        [`${commentId}-${replyId}`]: "",
      }));
    } else {
      // Start reply, autofill with @username
      const username = reply.commentCreatorId?.name || "";
      setReplyingToReply(replyId);
      setReplyTexts((prev) => ({
        ...prev,
        [`${commentId}-${replyId}`]: `@${username} `,
      }));
    }
  };
  

  const replyKey = `${commentId}-${reply._id}`;

  return (
    <div
      className={`flex items-start gap-4 ${
        depth > 1 ? "border-l-6 border-gray-200 pl-6" : ""
      }`}
    >
      <Avatar className="h-9 w-9">
        <ProfileIcon 
          image={reply?.commentCreatorId?.image}
          size={36}
          className="h-full w-full"
        />
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
                  className="h-5 w-5 p-0 hover:bg-gray-100 cursor-pointer"
                >
                  <MoreVertical className="h-3 w-3 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                  onClick={() => startEditingReply(reply)}
                  disabled={loadingStates.editingReply[reply._id]}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteReply}
                  disabled={loadingStates.editingReply[reply._id]}
                  className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700"
                >
                 
                    <Trash className="h-3 w-3" />
                 
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {editingReply === reply._id ? (
          <div className="mt-1 flex items-center gap-2">
            <input
              type="text"
              value={editReplyText}
              onChange={(e) => setEditReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleEditReply();
                }
              }}
              className="flex-1 text-sm p-2 border rounded cursor-text"
            />
            <Button
              size="sm"
              onClick={handleEditReply}
              className="cursor-pointer p-[18px]"
            >
              {loadingStates.editingReply[reply._id] ? (
                <ButtonSpinner className="h-4 w-4 animate-spin" />
              ) : (
                "Update "
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditingReply(null)}
              disabled={loadingStates.editingReply[reply._id]}
              className="cursor-pointer border p-[18px]"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <p className="text-sm mt-1">{reply.content}</p>
        )}

        <div className="flex items-center gap-3 mt-1">
          {canReply && (
            <button
              onClick={() => toggleReply(reply._id)}
              className="text-sm text-blue-500 flex items-center gap-1 hover:text-blue-600 cursor-pointer transition-colors"
              disabled={loadingStates.replying[replyKey]}
            >
              <MessageSquare className="h-3 w-3" />
              {replyingToReply === reply._id ? "Cancel" : "Reply"}
            </button>
          )}

          <button
            onClick={handleLikeReply}
            className={`text-sm flex items-center gap-1 hover:scale-105 transition-all cursor-pointer ${
              reply.isLiked || (reply.likedBy || []).includes(currentUserId)
                ? "text-red-500"
                : "text-blue-500 hover:text-red-400"
            }`}
          >
            <Heart
              className={`h-3 w-3 transition-all ${
                reply.isLiked || (reply.likedBy || []).includes(currentUserId)
                  ? "fill-red-500 text-red-500"
                  : "hover:fill-red-100"
              }`}
            />
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddReply(reply._id);
                }
              }}
              placeholder="Write a reply..."
              className="flex-1 text-sm p-2 border rounded cursor-text"
              disabled={loadingStates.replying[replyKey]}
            />
            <Button
              size="sm"
              onClick={() => handleAddReply(reply._id)}
              className=" text-white min-w-[70px] cursor-pointer "
            >
              {loadingStates.replying[replyKey] ? (
                <ButtonSpinner className="h-4 w-4 animate-spin" />
              ) : (
                "Reply"
              )}
            </Button>
          </div>
        )}

        {reply.replies && reply.replies.length > 0 && depth < maxDepth && (
          <div className="mt-2 space-y-3">
            {reply.replies.map((nestedReply) => (
              <ReplyItem
                key={nestedReply._id}
                reply={nestedReply}
                commentId={commentId}
                currentUserId={currentUserId}
                onLikeReply={onLikeReply}
                onDeleteReply={onDeleteReply}
                onEditReply={onEditReply}
                onAddReply={onAddReply}
                postId={postId}
                formatTimeAgo={formatTimeAgo}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReplyItem;
