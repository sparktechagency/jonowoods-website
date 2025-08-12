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
      const response = await deletePost(postId).unwrap(); // unwrap() করলে সরাসরি ডাটা পাওয়া যায়
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {posts?.map((post) => (
          <Card key={post?._id} className="p-4 relative">
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

            <div
              className="mb-3 max-w-2xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="flex items-center space-x-10">
              <button
                className="flex items-center text-xl"
                onClick={() => handleLike(post._id)}
              >
                <HeartIcon
                  className={`h-8 w-8 mr-1 ${
                    (post.likedBy || []).includes(currentUserId)
                      ? "text-white fill-red-500"
                      : "text-red-500"
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
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50">
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
