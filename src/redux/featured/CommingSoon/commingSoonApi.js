import { api } from "@/redux/baseUrl/baseUrl";

const commignSoonSlice = api.injectEndpoints({
  endpoints: (builder) => ({

      quotation : builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/quotation",
        };
      },
    }),

    comingSoonLatestVideo: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/comingSoon/latest",
        };
      },
    }),

    inspirationLatestVideo: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/dailyInspiration/letest",
        };
      },
    }),

    todayLetestVideo: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/today",
        };
      },
    }),

    challengeVideo: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/admin/challenge-category/get-all-challenge-category-for-user",
        };
      },
      overrideExisting: true,
    }),

    singleChallengeVideo: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/challenge/get-challenges-videos-for-users/${id}`,
        };
      },
      overrideExisting: true,
    }),
    
    markWatchChallengeVideo: builder.mutation({
      query: (id) => {
        return {
          method: "POST",
          url: `/challenge/mark-video-watched/${id}`,
        };
      },
    }),
    markWatchCoursesVideo: builder.mutation({
      query: (id) => {
        return {
          method: "POST",
          url: `/videos/mark-video-watched/${id}`,
        };
      },
    }),

  }),
});

export const {
  useQuotationQuery,
  useComingSoonLatestVideoQuery,
  useInspirationLatestVideoQuery,
  useTodayLetestVideoQuery,
  useChallengeVideoQuery,
  useSingleChallengeVideoQuery,
  useMarkWatchChallengeVideoMutation,
  useMarkWatchCoursesVideoMutation,

} = commignSoonSlice;
