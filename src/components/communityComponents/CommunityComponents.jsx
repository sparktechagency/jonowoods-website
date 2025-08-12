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
import Spinner from "@/app/(commonLayout)/Spinner";
import Pagination from "./PaginationComponent";
import { FeaturedPostSection } from "./FeaturedPost";

export default function CommunityComponents() {
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);

  const { data } = useMyProfileQuery();
  const currentUserId = data?._id;

  const { data: leaderboard } = useCommunityLeaderBoardQuery();
  const leaderboardData = leaderboard?.data;

  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAllPostQuery([
    { name: "page", value: currentPage },
    { name: "limit", value: 10 },
  ]);

  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();

  // Extract posts and pagination from API response
  useEffect(() => {
    if (apiResponse?.data) {
      setPosts(apiResponse.data.posts || []);
    }
  }, [apiResponse]);

  const pagination = apiResponse?.data?.meta || {
    page: 1,
    limit: 2,
    total: 0,
    totalPage: 1,
  };

  const handleNewPost = async (postData) => {
    try {
      const response = await createPost(postData).unwrap();
      if (response?.success) {
        if (currentPage !== 1) {
          setCurrentPage(1);
        } else {
          setPosts([response.data, ...posts]);
        }
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handlePostEdit = (post) => {
    setEditingPost(post);
    // Scroll to top to show the edit form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditCancel = () => {
    setEditingPost(null);
  };

  const handlePostSuccess = () => {
    setEditingPost(null);
    // Refetch posts to get updated data
    refetch();
  };

  const handlePostDelete = (deletedPostId) => {
    // Remove the deleted post from the current posts array
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post._id !== deletedPostId)
    );
  };

  const handlePostsUpdate = (updatedPosts) => {
    setPosts(updatedPosts);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setEditingPost(null); // Cancel any editing when changing pages
  };

  if (isLoading) {
    return <Spinner />;
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
        <PostCreate
          editPost={editingPost}
          onEditCancel={handleEditCancel}
          onPostSuccess={handlePostSuccess}
        />

        <FeaturedPostSection />
        <PostDisplay
          posts={posts}
          currentUserId={currentUserId}
          onPostsUpdate={handlePostsUpdate}
          onPostEdit={handlePostEdit}
          onPostDelete={handlePostDelete}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPage}
          onPageChange={handlePageChange} 
        />

        <Leaderboard leaderboardData={leaderboardData} />
      </div>
    </main>
  );
}
