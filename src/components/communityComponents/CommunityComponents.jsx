"use client";

import { useState, useEffect } from "react";
import PostCreate from "./PostCreate";
import PostDisplay from "./PostDisplay";
import Leaderboard from "./Leaderboard";
import {
  useCreatePostMutation,
  useGetAllPostQuery,
} from "@/redux/featured/community/communityApi";
import { useMyProfileQuery } from "@/redux/featured/auth/authApi";
import { useCommunityLeaderBoardQuery } from "@/redux/featured/community/communityLeaderBoard";

// Mock leaderboard data - keeping this as it doesn't appear to be from the API yet


export default function CommunityComponents() {
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const { data } = useMyProfileQuery()
  const currentUserId = data?._id; 
  const { data: leaderboard } = useCommunityLeaderBoardQuery()

  console.log(leaderboard)
  
  const leaderboardData = leaderboard?.data 
  console.log(leaderboardData)
  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useGetAllPostQuery([{ name: "page", value: currentPage }]);

  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  console.log(currentPage)

  // Extract posts and pagination from API response
  useEffect(() => {
    if (apiResponse?.data) {
      setPosts(apiResponse.data.posts || []);
    }
  }, [apiResponse]);

  const pagination = apiResponse?.data?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  };

  const handleNewPost = async (postData) => {
    try {
      const response = await createPost(postData).unwrap();
      if (response?.success) {
        // If we're not on page 1, go back to page 1 to see the new post
        if (currentPage !== 1) {
          setCurrentPage(1);
        } else {
          // Otherwise refresh the current posts
          setPosts([response.data, ...posts]);
        }
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handlePostsUpdate = (updatedPosts) => {
    setPosts(updatedPosts);
  };

  const handlePageChange = (newPage) => {
    // Update page number which will trigger a new API call via the query hook
    setCurrentPage(newPage);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading posts...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <div className="text-center bg-red-50 p-6 rounded-lg">
          <p className="text-red-600">
            Error loading posts. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center mt-6 mx-3">
      <div className="w-full">
        <PostCreate onPostCreate={handleNewPost} isCreating={isCreating} />

        <PostDisplay
          posts={posts}
          currentUserId={currentUserId}
          onPostsUpdate={handlePostsUpdate}
        />

        {pagination.totalPage > 1 && (
          <div className="flex justify-center my-6">
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex items-center px-4">
                Page {currentPage} of {pagination.totalPage}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pagination.totalPage}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        <Leaderboard leaderboardData={leaderboardData} />
      </div>
    </main>
  );
}
