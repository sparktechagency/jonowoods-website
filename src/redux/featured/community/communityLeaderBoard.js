import { api } from "@/redux/baseUrl/baseUrl";

const favouriteVideoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    communityLeaderBoard: builder.query({
      query: () => {
        return {
          method: "GET",
          url: `/community/leaderboard`,
        };
      },
      invalidatesTags: ["Posts"],
    }),
    singleVideo: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/videos/${id}`,
        };
      },
    }),
  }),
});

export const { useCommunityLeaderBoardQuery,useSingleVideoQuery } = favouriteVideoApi;
