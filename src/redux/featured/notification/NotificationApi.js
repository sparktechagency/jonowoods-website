import { api } from "@/redux/baseUrl/baseUrl";


const notificationSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotification: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => {
        return {
          url: `/notifications?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: (result, error, { page }) => [
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: `PAGE_${page}` }
      ],
      keepUnusedDataFor: 0, // Don't cache for real-time updates
      refetchOnMountOrArgChange: true, // Always refetch on mount
      refetchOnFocus: true, // Refetch when window gains focus
      refetchOnReconnect: true, // Refetch on network reconnect

    }),
    readOneNotification: builder.mutation({
      query: (id) => {
        return {
          url: `/notifications/single/${id}`,
          method: "PATCH",
        };
      },
      invalidatesTags: [
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'PARTIAL-LIST' }
      ]

    }),
    readAllNotification: builder.mutation({
      query: () => {
        return {
          url: `/notifications`,
          method: "PATCH",
        };
      },
      invalidatesTags: [
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'PARTIAL-LIST' }
      ]

    }),
  }),
});

export const {
  useGetNotificationQuery,
  useReadOneNotificationMutation,
  useReadAllNotificationMutation,
} = notificationSlice;
