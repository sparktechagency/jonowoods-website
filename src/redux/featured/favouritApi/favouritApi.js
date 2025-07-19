import { api } from "../../baseUrl/baseUrl";

const favouriteSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getFavourite: builder.query({
      query: (data) => {
        return {
          method: "GET",
          url: "/favourit/",
        };
      },
      invalidatesTags: ['favourite']
    }),

    watchFavourite: builder.mutation({
      query: (id) => {
        return {
          method: "GET",
          url: `/favourit/watch/${id}`,
        };
      },
      invalidatesTags: ['favourite']
    }),

    videoFavourite: builder.mutation({
      query: (id) => {
        return {
          method: "POST",
          url: `/favourit/${id}`,
        };
      },
      providesTags: ['favourite']
    }),


  }),
});

export const {
  useGetFavouriteQuery,
  useWatchFavouriteMutation,
  useVideoFavouriteMutation
} = favouriteSlice;