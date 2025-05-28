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
        }),
        checkoutForSubscription: builder.mutation({
            query: (id) => {
                return {
                  method: "POST",
                  url: `/subscription/create-checkout-session/${id}`,
                };
            },
        }),
    }),
});

export const { useGetWebPackagesQuery, useCheckoutForSubscriptionMutation } = packagesApi;
