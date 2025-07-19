"use client";
import { useState } from "react";
import { SendHorizontal, MoreVertical } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

// Mock data for initial comments
const initialComments = [
  {
    id: 1,
    user: "Sirazam Monira",
    content: "That sounds great! I'm in. What time works for you?",
    timeAgo: "20minutes ago",
    likes: 0,
    avatarSrc: "https://i.ibb.co/qHGmP2p/Ellipse-1.png",
    replies: [],
  },
  {
    id: 2,
    user: "Sirazam Monira",
    content: "That sounds great! I'm in. What time works for you?",
    timeAgo: "20minutes ago",
    likes: 0,
    avatarSrc: "https://i.ibb.co/qHGmP2p/Ellipse-1.png",
    replies: [],
  },
  {
    id: 3,
    user: "Sadia Afrin",
    content: "That sounds great! I'm in. What time works for you?",
    timeAgo: "",
    likes: 0,
    avatarSrc: "https://i.ibb.co/qHGmP2p/Ellipse-1.png",
    replies: [],
  },
  {
    id: 4,
    user: "Sirazam Monira",
    content: "That sounds great! I'm in. What time works for you?",
    timeAgo: "20minutes ago",
    likes: 0,
    avatarSrc: "https://i.ibb.co/qHGmP2p/Ellipse-1.png",
    replies: [],
  },
];

// Comment component for rendering individual comments
const Comment = ({ comment, onReply, currentUser }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [liked, setLiked] = useState(false);

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent("");
      setIsReplying(false);
    }
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="mb-6">
      <div className="flex items-start gap-3">
        <Avatar className="h-16 w-16">
          <Image
            src={comment.avatarSrc || "/avatars/default.png"}
            alt={comment.user}
            width={100}
            height={100}
            className="h-full w-full object-cover rounded-full"
          />
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{comment.user}</span>
              {comment.timeAgo && (
                <span className="text-xs text-gray-500">{comment.timeAgo}</span>
              )}
            </div>
            {comment.user !== currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Report</DropdownMenuItem>
                  <DropdownMenuItem>Block User</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <p className="text-sm mt-1">{comment.content}</p>
          <div className="flex items-center mt-2 space-x-4">
            <button
              className="text-xs font-medium flex items-center"
              onClick={toggleLike}
            >
              {liked ? (
                <span className="text-red-700 font-black">{comment.likes + 1} Like</span>
              ) : (
                <span>{comment.likes || 0} Like</span>
              )}
            </button>
            <button
              className="text-xs font-medium"
              onClick={() => setIsReplying(!isReplying)}
            >
              Reply
            </button>
          </div>

          {/* Reply input */}
          {isReplying && (
            <div className="mt-3 flex items-center gap-2">
              <Avatar className="h-12 w-12">
                <Image
                  src="/avatars/current-user.png"
                  alt={currentUser}
                  width={100}
                  height={100}
                  className="h-full w-full object-cover rounded-full"
                />
              </Avatar>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`@${comment.user} write your comment`}
                  className="w-full border rounded-full py-2 px-4 text-sm pr-10"
                />
                <button
                  onClick={handleReplySubmit}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-rose-500"
                >
                  <SendHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 pl-6 border-l-2 border-gray-100">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="mt-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-6 w-6">
                      <Image
                        src={reply.avatarSrc || "/avatars/default.png"}
                        alt={reply.user}
                        width={100}
                        height={100}
                        className="h-full w-full object-cover rounded-full"
                      />
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-xs">
                          {reply.user}
                        </span>
                        {reply.timeAgo && (
                          <span className="text-xs text-gray-500">
                            {reply.timeAgo}
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-1">{reply.content}</p>
                      <div className="flex items-center mt-1 space-x-3">
                        <button className="text-xs">
                          {reply.likes || 0} Like
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CommentsSection() {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const currentUser = "Current User"; // This would come from auth context in a real app
  const likesCount = 20;
  const commentsCount = 10;

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: Date.now(),
        user: currentUser,
        content: newComment,
        timeAgo: "Just now",
        likes: 0,
        avatarSrc: "/avatars/current-user.png",
        replies: [],
      };
      setComments([newCommentObj, ...comments]);
      setNewComment("");
    }
  };

  const handleAddReply = (commentId, content) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [
            ...comment.replies,
            {
              id: Date.now(),
              user: currentUser,
              content: content,
              timeAgo: "Just now",
              likes: 0,
              avatarSrc: "/avatars/current-user.png",
            },
          ],
        };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  return (
    <div className="mt-6">
      {/* Engagement metrics */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-rose-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-rose-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="ml-1 font-medium">{likesCount}</span>
        </div>
        <div className="flex items-center">
          <div className="p-2 bg-gray-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="ml-1 font-medium">{commentsCount}</span>
        </div>
      </div>

      {/* New comment input */}
      <div className="relative mb-6">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment here"
          className="w-full border rounded-full py-3 px-4 pr-12"
        />
        <button
          onClick={handleAddComment}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-500"
        >
          <SendHorizontal className="h-6 w-6" />
        </button>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={handleAddReply}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
}
