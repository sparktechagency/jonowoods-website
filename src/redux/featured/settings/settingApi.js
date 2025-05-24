import { api } from "@/redux/baseUrl/baseUrl";

const settingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSetting: builder.query({
      query: (id) => ({
        method: "GET",
        url: `/settings/${id}`,
       
      }),
    }),
  }),
});

export const {
  useGetSettingQuery,
} = settingApi;
