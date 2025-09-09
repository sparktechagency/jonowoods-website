import { api } from "@/redux/baseUrl/baseUrl";

const packagesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getWebPackages: builder.query({
            query: () => {
                return {
                    method: "GET",
                    url: `/package/users`,
                };
            },
            providesTags: ["Package"],

        }),
        runningPackage: builder.query({
            query: () => {
                return {
                  method: "GET",
                  url: `/subscription/details`,
                };
            },
            providesTags: ["Package"],

        }),
        checkoutForSubscription: builder.mutation({
            query: (id) => {
                return {
                  method: "POST",
                  url: `/subscription/create-checkout-session/${id}`,
                };
            },
            invalidatesTags: ["Package"],

        }),
        getMyAccess: builder.query({
            query: () => {
                return {
                  method: "GET",
                  url: `/subscription/check-access`,
                };
            },
            providesTags: ["Package"],
        }),
        getMyTransactions: builder.query({
            query: () => {
                return {
                  method: "GET",
                  url: `/subscription/transaction-history`,
                };
            },
            providesTags: ["Package"],
        }),

    }),
});

export const { useGetWebPackagesQuery, useCheckoutForSubscriptionMutation,useRunningPackageQuery,useGetMyAccessQuery,useGetMyTransactionsQuery } = packagesApi;

