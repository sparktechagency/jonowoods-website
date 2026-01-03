import { api } from "@/redux/baseUrl/baseUrl";

const videoCommentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVideoComments: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          method: "GET",
          url: `/videos/comments/all-comments`,
          params: params,
        };
      },
      providesTags: ["VideoComments"],
    }),
  }),
});

export const { useGetVideoCommentsQuery } = videoCommentApi;

