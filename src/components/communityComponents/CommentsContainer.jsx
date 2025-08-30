"use client";

import { useState, useEffect } from "react";
import { CommentsModal } from "./CommentsModal";
import { MessageSquare } from "lucide-react";
import {
  useGetCommentsByPostIdQuery,
  useAddCommentMutation,
  useAddReplyMutation,
  useReplyToReplyMutation,
  useLikeCommentMutation,
  useLikeReplyMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
  useDeleteReplyMutation,
  useUpdateReplyMutation,
} from "@/redux/featured/community/commentsApi";

export const CommentsContainer = ({ postId, currentUserId, commentsCount = 0 }) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [localComments, setLocalComments] = useState([]);

  // RTK Query hooks
  const {
    data: commentsData,
    isLoading,
    refetch,
  } = useGetCommentsByPostIdQuery(postId, {
    skip: !isCommentsOpen, // Only fetch when modal is open
  });

  const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();
  const [addReply, { isLoading: isAddingReply }] = useAddReplyMutation();
  const [replyToReply] = useReplyToReplyMutation();
  const [likeComment] = useLikeCommentMutation();
  const [likeReply] = useLikeReplyMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [deleteReply] = useDeleteReplyMutation();
  const [updateReply] = useUpdateReplyMutation();

  // Update local comments when API data changes
  useEffect(() => {
    if (commentsData?.data) {
      setLocalComments(commentsData.data);
    }
  }, [commentsData]);

  const handleOpenComments = () => {
    setIsCommentsOpen(true);
  };

  const handleCloseComments = () => {
    setIsCommentsOpen(false);
  };

  const handleAddComment = async (postId, commentText) => {
    try {
      await addComment({
        data: { content: commentText, postId },
      }).unwrap();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleAddReply = async (
    postId,
    commentId,
    replyText,
    parentReplyId = null
  ) => {
    try {
      if (parentReplyId) {
        await replyToReply({
          replyId: parentReplyId,
          data: { content: replyText },
        }).unwrap();
      } else {
        await addReply({
          commentId,
          data: { content: replyText },
        }).unwrap();
      }
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };

  const handleLikeComment = async (commentId) => {
    const updatedComments = localComments.map((comment) => {
      if (comment._id === commentId) {
        const isCurrentlyLiked =
          comment.isLiked || (comment.likedBy || []).includes(currentUserId);
        const newLikes = isCurrentlyLiked
          ? Math.max(0, comment.likes - 1)
          : (comment.likes || 0) + 1;
        const newLikedBy = isCurrentlyLiked
          ? (comment.likedBy || []).filter((id) => id !== currentUserId)
          : [...(comment.likedBy || []), currentUserId];

        return {
          ...comment,
          isLiked: !isCurrentlyLiked,
          likes: newLikes,
          likedBy: newLikedBy,
        };
      }
      return comment;
    });

    setLocalComments(updatedComments);

    try {
      await likeComment(commentId).unwrap();
    } catch (error) {
      console.error("Failed to like comment:", error);
      setLocalComments(localComments);
    }
  };



  const handleLikeReply = async (replyId) => {
    // Find and update reply optimistically inside comments
    const updatedComments = localComments.map((comment) => {
      if (!comment.replies) return comment;

      const updatedReplies = comment.replies.map((reply) => {
        if (reply._id === replyId) {
          const isCurrentlyLiked =
            reply.isLiked || (reply.likedBy || []).includes(currentUserId);
          const newLikes = isCurrentlyLiked
            ? Math.max(0, reply.likes - 1)
            : (reply.likes || 0) + 1;
          const newLikedBy = isCurrentlyLiked
            ? (reply.likedBy || []).filter((id) => id !== currentUserId)
            : [...(reply.likedBy || []), currentUserId];

          return {
            ...reply,
            isLiked: !isCurrentlyLiked,
            likes: newLikes,
            likedBy: newLikedBy,
          };
        }
        return reply;
      });

      return {
        ...comment,
        replies: updatedReplies,
      };
    });

    setLocalComments(updatedComments);

    try {
      await likeReply(replyId).unwrap();
    } catch (error) {
      console.error("Failed to like reply:", error);
      setLocalComments(localComments); // revert on error
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment( commentId ).unwrap();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      await updateComment({
        commentId,
        data: { content: newContent },
      }).unwrap();
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  const handleEditReply = async (replyId, newContent) => {
    try {
      await updateReply({
        replyId,
        data: { content: newContent },
      }).unwrap();
    } catch (error) {
      console.error("Failed to edit reply:", error);
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      await deleteReply(replyId ).unwrap();
    } catch (error) {
      console.error("Failed to delete reply:", error);
    }
  };

  return (
    <>
      <button
        onClick={handleOpenComments}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="text-sm">
          {commentsCount > 0 ? `${commentsCount} Comments` : "Comment"}
        </span>
      </button>

      <CommentsModal
        postId={postId}
        comments={localComments}
        currentUserId={currentUserId}
        open={isCommentsOpen}
        onClose={handleCloseComments}
        onAddComment={handleAddComment}
        onAddReply={handleAddReply}
        onLikeComment={handleLikeComment}
        onLikeReply={handleLikeReply}
        onDeleteComment={handleDeleteComment}
        onEditComment={handleEditComment}
        onEditReply={handleEditReply}
        onDeleteReply={handleDeleteReply}
        isLoading={isLoading}
        isCommenting={isAddingComment || isAddingReply}
      />
    </>
  );
};
