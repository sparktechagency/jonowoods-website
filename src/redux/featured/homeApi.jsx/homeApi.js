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

    subCategoryVideo: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/subcategory/get-videos/${id}`,
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
  useSubCategoryVideoQuery,
  useSingleSubcategoryQuery,
  useSingleVidoeQuery
} = homeSlice;
