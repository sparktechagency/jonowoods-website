import { api } from "@/redux/baseUrl/baseUrl";

const favouriteVideoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    favouriteVideoList: builder.query({
      query: (args) => {
        const urlPath = args?.length
          ? "/" + args.map((arg) => `${arg.name}/${arg.value}`).join("/")
          : "";

        return {
          method: "GET",
          url: `/favourit${urlPath}`, 
        };
      },
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

export const { useFavouriteVideoListQuery,useSingleVideoQuery } = favouriteVideoApi;
