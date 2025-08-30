import { api } from "../../baseUrl/baseUrl";

const favoriteSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getFavorite: builder.query({
      query: (data) => {
        return {
          method: "GET",
          url: "/favorite/",
        };
      },
      invalidatesTags: ['Favorite']
    }),

    watchFavorite: builder.mutation({
      query: (id) => {
        return {
          method: "GET",
          url: `/favorite/watch/${id}`,
        };
      },
      invalidatesTags: ['Favorite']
    }),

    videoFavorite: builder.mutation({
      query: (id) => {
        return {
          method: "POST",
          url: `/favorite/${id}`,
        };
      },
      invalidatesTags: ['Favorite']
    }),


  }),
});

export const {
  useGetFavoriteQuery,
  useWatchFavoriteMutation,
  useVideoFavoriteMutation
} = favoriteSlice;
