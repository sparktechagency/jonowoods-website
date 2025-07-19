import { api } from "@/redux/baseUrl/baseUrl";

const homeSlice = api.injectEndpoints({
  endpoints: (builder) => ({


    comingSoonLetestVideo: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/comingSoon/latest",
        };
      },
    }),


    comingSoonLetestSingleVideo: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/comingSoon/latest/${id}`,
        };
      },
    }),

    getCategory: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/category",
        };
      },
    }),

    categoryWithSubcategory: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/category/subcategory/${id}`,
        };
      },
    }),

    categoryVideo: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/category/get-videos/${id}`,
        };
      },
    }),

    categoryVideoById: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/videos/${id}`,
        };
      },
    }),

    subCategoryVideo: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/subcategory/get-videos/${id}`,
        };
      },
    }),

    markVideoWatched: builder.mutation({
      query: (id) => {
        return {
          method: "POST",
          url: `/videos/mark-video-watched/${id}`,
        };
      },
    }),


    singleSubcategory: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/subcategory/single/${id}`,
        };
      },
    }),

    singleVidoe: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/videos/${id}`,
        };
      },
    }),





  }),
});

export const {
  useGetCategoryQuery,
  useCategoryWithSubcategoryQuery,
  useComingSoonLetestVideoQuery,
  useComingSoonLetestSingleVideoQuery,
  useCategoryVideoQuery,
  useCategoryVideoByIdQuery,
  useSubCategoryVideoQuery,
  useSingleSubcategoryQuery,
  useSingleVidoeQuery,
  useMarkVideoWatchedMutation
} = homeSlice;
