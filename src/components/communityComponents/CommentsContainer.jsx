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
} from "@/redux/featured/community/commentsApi";

export const CommentsContainer = ({
  postId,
  currentUserId,
  commentsCount = 0,
}) => {
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
  console.log("Comments data:", commentsData);

  const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();
  const [addReply, { isLoading: isAddingReply }] = useAddReplyMutation();
  const [replyToReply] = useReplyToReplyMutation();
  const [likeComment] = useLikeCommentMutation();
  const [likeReply] = useLikeReplyMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [updateComment] = useUpdateCommentMutation();

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
      });
      refetch(); // Refresh comment data
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
        // Reply to a reply
        await replyToReply({
          replyId: parentReplyId,
          data: { content: replyText },
        });
      } else {
        // Reply directly to a comment
        await addReply({
          commentId,
          data: { content: replyText },
        });
      }
      refetch(); // Refresh comment data
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };

    const handleLikeComment = async (commentId) => {
      console.log("Comment ID to like:", commentId);
    try {
      await likeComment(commentId);
      refetch(); // Refresh comment data
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  const handleLikeReply = async (replyId) => {
    try {
      await likeReply(replyId);
      refetch(); // Refresh comment data
    } catch (error) {
      console.error("Failed to like reply:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      refetch(); // Refresh comment data
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      await updateComment({
        commentId,
        data: { content: newContent },
      });
      refetch(); // Refresh comment data
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  return (
    <>
      <button
        onClick={handleOpenComments}
        className="flex items-center text-xl"
      >
        <MessageSquare className="h-6 w-6 mr-1" />
        {commentsCount}
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
        isLoading={isLoading || isAddingComment || isAddingReply}
      />
    </>
  );
};

export default CommentsContainer;
