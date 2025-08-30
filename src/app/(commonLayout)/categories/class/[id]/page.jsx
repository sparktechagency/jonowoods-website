"use client";


import { jwtDecode } from 'jwt-decode';
import { Heart, MoreHorizontal, Send } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import commectIcon from '../../../../../../public/assests/comment.png';
import { useCreateCommentMutation, useDeleteCommentMutation, useEditCommentMutation, useGetCommentQuery, useLikeReplyMutation, useReplyCommentMutation } from '../../../../../redux/featured/commentApi/commentApi';
import Spinner from '../../../Spinner';
import { useSingleVidoeQuery } from '@/redux/featured/homeApi.jsx/homeApi';
import { useVideoFavoriteMutation } from '@/redux/featured/favoriteApi/favoriteApi';
import { getImageUrl } from '@/components/share/imageUrl';

export default function FitnessVideoPage({ params }) {
  const { id } = React.use(params);
  const [isLiked, setIsLiked] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const currentUserId = decoded.id;

  // API hooks
  const { data, isLoading, refetch } = useSingleVidoeQuery(id, { skip: !id });
  const { data: commentData, isLoading: commentDataLoading, refetch: refetchComments } = useGetCommentQuery(id, { skip: !id });
  const [createComment, { isLoading: commentLoading }] = useCreateCommentMutation();
  const [editComment, { isLoading: editLoading }] = useEditCommentMutation();
  const [deleteComment, { isLoading: deleteLoading }] = useDeleteCommentMutation();
  const [replyComment, { isLoading: replyLoading }] = useReplyCommentMutation();
  const [likeReply, { isLoading: likeLoading }] = useLikeReplyMutation();
  const [favorite, { isLoading: favLoading }] = useVideoFavoriteMutation();

  // State management
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const commentInputRef = useRef(null);
  const replyInputRefs = useRef({});

  // Initialize comments from API data
  useEffect(() => {
    if (commentData?.data) {
      setComments(commentData.data);
    }
  }, [commentData]);

  // Initialize like count and status
  useEffect(() => {
    if (data?.data) {
      setLikeCount(data.data.likes || 0);
      // Set initial favorite status from API response
      setIsLiked(data.data.isFavorite || false);
    }
  }, [data]);

  const handleLike = async (id) => {
    try {
      const response = await favorite(id).unwrap();
      // Update local state immediately for better UX
      setIsLiked(!isLiked);
      refetch();
    } catch (error) {
      console.error('Error liking video:', error)
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      if (editingComment) {
        // Edit existing comment
        await editComment({
          id: editingComment,
          content: comment
        }).unwrap();
      } else {
        // Create new comment
        await createComment({
          videoId: id,
          content: comment
        }).unwrap();
      }

      setComment('');
      setEditingComment(null);
      setReplyingTo(null);
      refetchComments(); // Refresh comments after successful operation
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await replyComment({
        id: commentId,
        data: { content: replyText }
      }).unwrap();

      setReplyText('');
      setReplyingTo(null);
      refetchComments();
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(commentId).unwrap();
        refetchComments();
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await likeReply(commentId).unwrap();
      refetchComments();
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    setEditingComment(null);
    setTimeout(() => {
      replyInputRefs.current[commentId]?.focus();
    }, 100);
  };

  const handleEdit = (comment) => {
    setEditingComment(comment._id);
    setComment(comment.content);
    setReplyingTo(null);
    commentInputRef.current?.focus();
  };

  const handleCancel = () => {
    setEditingComment(null);
    setReplyingTo(null);
    setComment('');
    setReplyText('');
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - commentTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const renderComment = (comment, depth = 0) => {
    // TODO: Replace this with actual user authentication logic
    // For now, showing edit/delete buttons for all comments for testing
    // In production, you should check if the comment belongs to the current user
    const isCurrentUser = true; // Change this to proper user check: comment.userId === currentUser?.id
    // const isCurrentUser = comment.userId === currentUserId;
    console.log("comment", comment)
    return (
      <div key={comment._id} className="mb-4">
        <div className="flex items-start space-x-3 group" style={{ marginLeft: `${depth * 20}px` }}>
          {/* Avatar */}
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-gray-600">
              <Image
                src={getImageUrl(comment.commentCreatorId?.image) || '/assests/profile.png'}


                alt={comment.commentCreatorId?.name || 'User'}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
              {/* {comment.commentCreatorId ? comment.commentCreatorId.name.charAt(0).toUpperCase() : 'U'} */}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            {/* User info and time */}
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-gray-900">
                {comment.commentCreatorId?.name || 'Anonymous'}

              </span>
              <span className="text-xs text-gray-500">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>

            {/* Comment content */}
            <p className="text-sm text-gray-700 mb-2">{comment.content}</p>

            {/* Action buttons */}
            <div className="flex items-center space-x-4 text-xs">
              <button
                onClick={() => handleLikeComment(comment._id)}
                className="flex cursor-pointer items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                disabled={likeLoading}
              >
                <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{comment.likes || 0}</span>
                <span className={`${comment.isLiked ? 'text-red-500' : ''}`}>
                  {comment.isLiked ? 'Liked' : 'Like'}
                </span>
              </button>

              <button
                onClick={() => handleReply(comment._id)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
              >
                Reply
              </button>

              {/* Edit and Delete buttons - now visible */}
              {isCurrentUser && (
                <>
                  <button
                    onClick={() => handleEdit(comment)}
                    className="text-gray-500 cursor-pointer hover:text-blue-500 transition-colors"
                    disabled={editLoading}
                  >
                    {editLoading ? 'Editing...' : 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-gray-500 cursor-pointer hover:text-red-500 transition-colors"
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? 'Deleting...' : 'Delete'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* More options */}
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
          </div>
        </div>

        {/* Reply input */}
        {replyingTo === comment._id && (
          <form
            onSubmit={(e) => handleReplySubmit(e, comment._id)}
            className="mt-3 ml-11"
          >
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-gray-600">Y</span>
              </div>
              <div className="flex-1 relative">
                <input
                  ref={(el) => replyInputRefs.current[comment._id] = el}
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`@${comment.userName || 'User'} write your comment`}
                  className="w-full px-3 py-2 border cursor-pointer border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  disabled={replyLoading || !replyText.trim()}
                >
                  <Send className="w-8 h-8 text-red-500" />
                </button>
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Render replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3">
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <Spinner />
  }

  if (!data?.data) {
    return <div className="container mx-auto bg-white p-4">Video not found</div>;
  }

  const videoData = data.data;

  return (
    <div className="container mx-auto bg-white">
      {/* Video Section */}
      <div className="mt-10">
        <video
          controls
          src={`https://${videoData.videoUrl}`}
          className="w-full h-auto max-h-[70vh] mx-auto border rounded-md"
          autoPlay
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Details */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">{videoData.title}</h1>
          <p className="text-sm text-gray-600 mb-1">{videoData.duration} Min</p>
          <p className="text-xs text-gray-500 mb-3">About this {videoData.type}</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            {videoData.description}
          </p>
        </div>

        {/* Equipment */}
        {videoData.equipment && videoData.equipment.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700">Props/Equipment Needed</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {videoData.equipment.map((item, index) => (
                <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Engagement Section */}
        <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
          <button
            onClick={() => handleLike(videoData._id)}
            className="flex items-center space-x-2 min-w-[24px] min-h-[24px]"
            aria-label={isLiked ? 'Unlike video' : 'Like video'}
            disabled={favLoading}
          >
            <Heart
              className={`w-6 h-6 cursor-pointer transition-colors ${favLoading ? 'opacity-50' : ''} ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'
                }`}
            />
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <Image src={commectIcon} alt="comment icons" width={20} height={20} />
            </div>
            <span className="text-sm font-medium text-gray-900">{comments.length}</span>
          </div>
        </div>

        {/* Main Comment Input */}
        <form onSubmit={handleCommentSubmit} className="mt-6 mb-6">
          <div className="relative">
            <input
              type="text"
              ref={commentInputRef}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                editingComment
                  ? 'Edit your comment...'
                  : 'Write your comment here'
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12"
              disabled={commentLoading || editLoading}
            />
            <button
              type="submit"
              className="absolute right-6 top-1/2 transform -translate-y-1/2"
              disabled={commentLoading || editLoading || !comment.trim()}
            >
              <Send className="w-12 h-12 text-red-500" />
            </button>
          </div>
          {editingComment && (
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          )}
        </form>

        {/* Comments Section */}
        <div className="space-y-1">
          {commentDataLoading ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => renderComment(comment))
          )}
        </div>
      </div>
    </div>
  );
}