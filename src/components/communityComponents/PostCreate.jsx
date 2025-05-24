"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCreatePostMutation } from "@/redux/featured/community/communityApi";
import { JoditEditor } from "./JoditTextEdito";

const PostCreate = () => {
  const [content, setContent] = useState("");
  const [createPost, { isLoading }] = useCreatePostMutation();

  const handlePost = async () => {
    if (content.trim()) {
      try {
        await createPost({
          content: content,
          // Add any other fields required by your API
        });
        setContent(""); // Clear content after posting
      } catch (error) {
        console.error("Failed to create post:", error);
      }
    }
  };

  return (
    <div className="w-full mb-6">
      <Card className="p-4">
        <div className="text-xl font-semibold text-red-500 mb-2">
          What's On Your Mind
        </div>
        <JoditEditor
          value={content}
          onChange={(newContent) => setContent(newContent)}
          className="mb-4"
        />
        <div className="flex justify-end">
          <Button
            onClick={handlePost}
            className="bg-red-500 text-white rounded-full px-6"
            disabled={isLoading || !content.trim()}
          >
            {isLoading ? "Posting..." : "Post"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PostCreate;
