import { api } from "@/redux/baseUrl/baseUrl";


const notificationSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotification: builder.query({
      query: () => {
        return {
          url: `/notifications`,
          method: "GET",
        };
      },
    }),
    readOneNotification: builder.mutation({
      query: (id) => {
        return {
          url: `/notifications/admin/single/${id}`,
          method: "PATCH",
        };
      },
    }),
    readAllNotification: builder.mutation({
      query: () => {
        return {
          url: `/notifications`,
          method: "PATCH",
        };
      },
    }),
  }),
});

export const {
  useGetNotificationQuery,
  useReadOneNotificationMutation,
  useReadAllNotificationMutation,
} = notificationSlice;
