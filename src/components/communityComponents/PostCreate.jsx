"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "@/redux/featured/community/communityApi";
import { JoditEditor } from "./JoditTextEdito";
import { toast } from "sonner";

const PostCreate = ({ editPost = null, onEditCancel, onPostSuccess }) => {
  const [content, setContent] = useState("");
  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();

  // Set content when editing
  useEffect(() => {
    if (editPost) {
      setContent(editPost.content || "");
    }
  }, [editPost]);

  const handlePost = async () => {
    if (content.trim()) {
      try {
        if (editPost) {
          // Update existing post
          await updatePost({
            id: editPost._id,
            data: { content: content },
          });
          setContent("");
          toast.success("Post updated successfully!");
          if (onEditCancel) onEditCancel();
          if (onPostSuccess) onPostSuccess();
        } else {
          // Create new post
          await createPost({
            content: content,
          });
          setContent("");
          toast.success("Post created successfully!");
          if (onPostSuccess) onPostSuccess();
        }
      } catch (error) {
        console.error(
          `Failed to ${editPost ? "update" : "create"} post:`,
          error
        );
        toast.error(
          `Failed to ${editPost ? "update" : "create"} post. Please try again.`
        );
      }
    }
  };

  const handleCancel = () => {
    setContent("");
    if (onEditCancel) {
      onEditCancel();
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="w-full mb-6">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xl font-semibold text-red-500">
            {editPost ? "Edit Your Post" : "What's On Your Mind"}
          </div>
          {editPost && (
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>

        <JoditEditor
          value={content}
          onChange={(newContent) => setContent(newContent)}
          className="mb-4"
        />

        <div className="flex justify-end space-x-3">
          {editPost && (
            <Button
              onClick={handleCancel}
              variant="outline"
              className="rounded-full px-6"
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={handlePost}
            className="bg-red-500 text-white rounded-full px-6"
            disabled={isLoading || !content.trim()}
          >
            {isLoading
              ? editPost
                ? "Updating..."
                : "Posting..."
              : editPost
              ? "Update"
              : "Post"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PostCreate;
