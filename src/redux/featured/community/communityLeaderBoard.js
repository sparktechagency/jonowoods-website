import { api } from "@/redux/baseUrl/baseUrl";

const favoriteVideoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    communityLeaderBoard: builder.query({
      query: () => {
        return {
          method: "GET",
          url: `/community/leaderboard`,
        };
      },
      providesTags: ["Community"],
    }),
    singleVideo: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/videos/${id}`,
        };
      },
      

    }),

    getFeaturedPost: builder.query({
      query: () => {
        return {
          method: "GET",
          url: `/post/letest`,
        };
      },
      providesTags: ["Community"],

    }),
  }),
});

export const { useCommunityLeaderBoardQuery,useSingleVideoQuery,useGetFeaturedPostQuery } = favoriteVideoApi;

