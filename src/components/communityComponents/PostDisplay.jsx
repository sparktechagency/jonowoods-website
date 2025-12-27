"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { HeartIcon, MoreVertical, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "../share/imageUrl";
import ProfileIcon from "../profileIcon/ProfileIcon";
import { formatDistanceToNow } from "date-fns";
import {
  useLazyLikePostQuery,
  useDeletePostMutation,
} from "@/redux/featured/community/communityApi";
import { CommentsContainer } from "./CommentsContainer";
import { toast } from "sonner";

const PostDisplay = ({
  posts,
  currentUserId = "yourusername",
  onPostEdit,
  onPostDelete,
  onPostsUpdate,
}) => {
  const [likePost] = useLazyLikePostQuery();
  const [deletePost] = useDeletePostMutation();
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState({}); // Track expanded state for each post

  const handleLike = async (postId) => {
    try {
      // Optimistically update UI
      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          const isLiked = (post.likedBy || []).includes(currentUserId);
          return {
            ...post,
            likes: isLiked ? (post.likes || 1) - 1 : (post.likes || 0) + 1,
            likedBy: isLiked
              ? (post.likedBy || []).filter((id) => id !== currentUserId)
              : [...(post.likedBy || []), currentUserId],
          };
        }
        return post;
      });

      if (onPostsUpdate) {
        onPostsUpdate(updatedPosts);
      }

      await likePost(postId);
    } catch (error) {
      console.error("Failed to like post:", error);
      // Revert optimistic update on error
      if (onPostsUpdate) {
        onPostsUpdate(posts);
      }
    }
  };

  const handleEdit = (post) => {
    setDropdownOpen(null);
    if (onPostEdit) {
      onPostEdit(post);
    }
  };

  const handleDeleteConfirm = (postId) => {
    setDropdownOpen(null);
    setDeleteConfirmOpen(postId);
  };

  const handleDelete = async (postId) => {
    try {
      const response = await deletePost(postId).unwrap(); 
      console.log(response);

      if (response?.success) {
        toast.success("Post deleted successfully!");
        if (onPostDelete) {
          onPostDelete(postId);
        }
        setDeleteConfirmOpen(null);
      } else {
        toast.error(response?.message || "Failed to delete post.");
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("An error occurred while deleting the post.");
    }
  };
  
  const toggleDropdown = (postId) => {
    setDropdownOpen(dropdownOpen === postId ? null : postId);
  };

  // Toggle expanded state for a specific post
  const toggleExpanded = (postId) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: prev[postId] === 'full' ? 'collapsed' : 
                prev[postId] === 'medium' ? 'full' : 'medium'
    }));
  };

  // Get display content based on expansion state
  const getDisplayContent = (content, postId) => {
    const plainText = content.replace(/<[^>]*>/g, ''); // Strip HTML tags for character counting
    const expandState = expandedPosts[postId] || 'collapsed';
    
    if (plainText.length <= 300) {
      return { content, showButton: false, buttonText: '' };
    }
    
    if (expandState === 'collapsed') {
      const truncated = plainText.substring(0, 300);
      const htmlTruncated = content.substring(0, content.indexOf(plainText.substring(300)) || 300);
      return { 
        content: htmlTruncated + '...', 
        showButton: true, 
        buttonText: 'See More' 
      };
    }
    
    if (expandState === 'medium' && plainText.length > 1500) {
      const truncated = plainText.substring(0, 1500);
      const htmlTruncated = content.substring(0, content.indexOf(plainText.substring(1500)) || 1500);
      return { 
        content: htmlTruncated + '...', 
        showButton: true, 
        buttonText: 'See More' 
      };
    }
    
    return { content, showButton: false, buttonText: '' };
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
      {/* Masonry Layout using CSS columns */}
      <div className="columns-1 md:columns-2 gap-6 space-y-6">
        {posts?.map((post) => {
          const { content: displayContent, showButton, buttonText } = getDisplayContent(post.content, post._id);
          
          return (
            <div key={post?._id} className="break-inside-avoid mb-6">
              <Card className="p-4 relative w-full">
                <div className="flex items-center mb-3 justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-2">
                      <ProfileIcon 
                        image={post?.userId?.image}
                        size={48}
                        className="h-full w-full"
                      />
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

                  {/* Three dots menu for current user's posts */}
                  {post?.userId?._id === currentUserId && (
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(post._id)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {dropdownOpen === post._id && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <button
                            onClick={() => handleEdit(post)}
                            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteConfirm(post._id)}
                            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mb-3 max-w-2xl">
                  <div
                    dangerouslySetInnerHTML={{ __html: displayContent }}
                  />
                  {showButton && (
                    <button
                      onClick={() => toggleExpanded(post._id)}
                      className="text-blue-500 hover:text-blue-700 font-medium text-sm mt-2 cursor-pointer"
                    >
                      {buttonText}
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-10">
                  <button
                    className="flex items-center text-xl"
                    onClick={() => handleLike(post._id)}
                  >
                    <HeartIcon
                      className={`h-7 w-7 mr-1 ${
                        (post.likedBy || []).includes(currentUserId)
                          ? "text-white fill-primary"
                          : "text-primary"
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
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded-lg max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Delete Post</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmOpen(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmOpen)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setDropdownOpen(null)}
        />
      )}
    </div>
  );
};

export default PostDisplay;