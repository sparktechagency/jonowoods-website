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
      providesTags: ["Leaderboard"],
    }),

    leaderboardGlobalStatus: builder.query({
      query: () => {
        return {
          url: `/preference/get-is-leaderboard-shown`,
          method: "GET",
        };
      },
      providesTags: ["Leaderboard"],
    }),

    singleVideo: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/videos/${id}`,
        };
      },
      providesTags: ["Community"],

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

export const { useCommunityLeaderBoardQuery,useSingleVideoQuery,useGetFeaturedPostQuery,useLeaderboardGlobalStatusQuery } = favoriteVideoApi;

