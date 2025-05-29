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

    comingSoonLetestVideo: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/comingSoon/latest",
        };
      },
    }),

    inspirationLetestVideo: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/comingSoon/latest",
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
          url: "/challenge/letest",
        };
      },
      overrideExisting: true,
    }),

    singleChallengeVideo: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/challenge/single/${id}`,
        };
      },
      overrideExisting: true,
    }),


  }),
});

export const {
  useQuotationQuery,
  useComingSoonLetestVideoQuery,
  useInspirationLetestVideoQuery,
  useTodayLetestVideoQuery,
  useChallengeVideoQuery,
  useSingleChallengeVideoQuery
} = commignSoonSlice;
