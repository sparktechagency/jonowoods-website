import { api } from "@/redux/baseUrl/baseUrl";

export const commentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all comments for a post
    getCommentsByPostId: builder.query({
      query: (postId) => ({
        url: `/comments/${postId}`,
      }),
      providesTags: (result, error, postId) => [
        { type: "Comments", id: postId },
        { type: "Comments", id: "LIST" },
      ],
    }),

    // Add a comment to a post
    addComment: builder.mutation({
      query: ({ data }) => ({
        url: "/comments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { data }) => [
        { type: "Comments", id: data.postId },
      ],
    }),

    // Update a comment
    updateComment: builder.mutation({
      query: ({ commentId, data }) => ({
        url: `/comments/edit/${commentId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { commentId }) => [
        { type: "Comments", id: "LIST" },
      ],
    }),

    // Delete a comment
    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/comments/delete/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, commentId) => [
        { type: "Comments", id: "LIST" },
      ],
    }),

    // Like a comment
    likeComment: builder.mutation({
      query: (commentId) => ({
        url: `/comments/like/${commentId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, commentId) => [
        { type: "Comments", id: "LIST" },
      ],
    }),

    // Add a reply to a comment
    addReply: builder.mutation({
      query: ({ commentId, data }) => ({
        url: `/comments/reply/${commentId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { commentId }) => [
        { type: "Comments", id: "LIST" },
      ],
    }),

    // Like a reply
    likeReply: builder.mutation({
      query: (replyId) => ({
        url: `/comments/like/${replyId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, replyId) => [
        { type: "Comments", id: "LIST" },
      ],
    }),

    // Reply to a reply (nested deeper)
    replyToReply: builder.mutation({
      query: ({ replyId, data }) => ({
        url: `/comments/reply/${replyId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { replyId }) => [
        { type: "Comments", id: "LIST" },
      ],
    }),

    // Update a comment
    updateReply: builder.mutation({
      query: ({ replyId, data }) => ({
        url: `/comments/edit/${replyId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { replyId }) => [
        { type: "Comments", id: "LIST" },
      ],
    }),

    // Delete a comment
    deleteReply: builder.mutation({
      query: (replyId) => ({
        url: `/comments/delete/${replyId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, replyId) => [
        { type: "Comments", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCommentsByPostIdQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useAddReplyMutation,
  useLikeReplyMutation,
  useReplyToReplyMutation,
  useDeleteReplyMutation,
  useUpdateReplyMutation
} = commentsApi;
