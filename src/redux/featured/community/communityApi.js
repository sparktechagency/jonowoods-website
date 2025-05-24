import { api } from "@/redux/baseUrl/baseUrl";


export const communityApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // If backend expects path param like /community/page/1
    getAllPost: builder.query({
      query: (args) => {
        // args is array of { name, value }, e.g. [{ name: "page", value: 2 }]
        const queryString =
          args && args.length
            ? "?" +
              args
                .map(
                  ({ name, value }) =>
                    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
                )
                .join("&")
            : "";

        return {
          method: "GET",
          url: `/community${queryString}`, // e.g. "/community?page=2"
        };
      },
      providesTags: ["Posts"],
    }),

    getPostById: builder.query({
      query: (id) => ({
        method: "GET",
        url: `/community/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Posts", id }],
    }),

    createPost: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/community",
        body: data,
      }),
      invalidatesTags: ["Posts"],
    }),

    updatePost: builder.mutation({
      query: ({ id, data }) => ({
        method: "PATCH",
        url: `/community/${id}`,
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Posts", id },
        "Posts",
      ],
    }),

    deletePost: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/community/${id}`,
      }),
      invalidatesTags: ["Posts"],
    }),

    likePost: builder.mutation({
      query: (postId) => ({
        method: "POST",
        url: `/community/like/${postId}`,
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Posts", postId },
        "Posts",
      ],
    }),

    unlikePost: builder.mutation({
      query: (id) => ({
        method: "PATCH",
        url: `/community/unlike/${id}`,
      }),
      invalidatesTags: (result, error, id) => [{ type: "Posts", id }, "Posts"],
    }),
  }),
});

export const {
  useGetAllPostQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
} = communityApi;
