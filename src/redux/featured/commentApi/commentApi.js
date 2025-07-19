import { api } from "../../baseUrl/baseUrl";

const commentSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/videos/comments/create",
          body: data
        };
      },
      invalidatesTags: ['Comment']
    }),

    editComment: builder.mutation({
      query: ({ id, content }) => {
        return {
          method: "PATCH",
          url: `/videos/comments/edit/${id}`,
          body: { content }
        };
      },
      invalidatesTags: ['Comment']
    }),

    getComment: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/videos/comments/${id}`,
        };
      },
      providesTags: ['Comment']
    }),

    replyComment: builder.mutation({
      query: ({ data, id }) => {
        return {
          method: "POST",
          url: `/videos/comments/reply/${id}`,
          body: data
        };
      },
      invalidatesTags: ['Comment']
    }),

    likeReply: builder.mutation({
      query: (id) => {
        return {
          method: "POST",
          url: `/videos/comments/like/${id}`,
        };
      },
      invalidatesTags: ['Comment']
    }),

    deleteComment: builder.mutation({
      query: (id) => {
        return {
          method: "DELETE",
          url: `/comments/delete/${id}`,
        };
      },
      invalidatesTags: ['Comment']
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useEditCommentMutation,
  useGetCommentQuery,
  useReplyCommentMutation,
  useLikeReplyMutation,
  useDeleteCommentMutation
} = commentSlice;