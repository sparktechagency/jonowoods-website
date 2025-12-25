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
      providesTags: ["Videos"],
    }),

    comingSoonLetestSingleVideo: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/comingSoon/latest/${id}`,
        };
      },
      providesTags: ["Videos"],
    }),

    getCategory: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/category",
        };
      },
      providesTags: ["Videos"],
    }),

    categoryWithSubcategory: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/category/subcategory/${id}`,
        };
      },
      providesTags: ["Videos"],
    }),

    categoryVideo: builder.query({
      query: ({ id, params }) => {
        const urlParams = new URLSearchParams();
        if (params) {
          params.forEach((arg) => {
            urlParams.append(arg.name, arg.value);
          });
        }
        return {
          method: "GET",
          url: `/category/get-videos/${id}`,
          params: urlParams,
        };
      },
      providesTags: ["Videos"],
    }),

    categoryVideoById: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/videos/${id}`,
        };
      },
      providesTags: ["Videos"],
    }),

    subCategoryVideo: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/subcategory/get-videos/${id}`,
        };
      },
      providesTags: ["Videos"],
    }),

    markVideoWatched: builder.mutation({
      query: (id) => {
        return {
          method: "POST",
          url: `/videos/mark-video-watched/${id}`,
        };
      },
      providesTags: ["Videos"],
    }),

    singleSubcategory: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/subcategory/single/${id}`,
        };
      },
      providesTags: ["Videos"],
    }),

    singleVidoe: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/videos/${id}`,
        };
      },
      providesTags: ["Videos","Favorite"],
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
  useMarkVideoWatchedMutation,
} = homeSlice;
