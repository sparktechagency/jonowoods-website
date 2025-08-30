import { api } from "@/redux/baseUrl/baseUrl";

const favoriteVideoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    favoriteVideoList: builder.query({
      query: (args) => {
        const urlPath = args?.length
          ? "/" + args.map((arg) => `${arg.name}/${arg.value}`).join("/")
          : "";

        return {
          method: "GET",
          url: `/favorite${urlPath}`, 
        };
      },
      providesTags: ["Favorite"],

    }),
    singleVideo: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/videos/${id}`, 
        };
      },
      providesTags: ["Favorite"],

    }),
  }),
});

export const { useFavoriteVideoListQuery,useSingleVideoQuery } = favoriteVideoApi;
