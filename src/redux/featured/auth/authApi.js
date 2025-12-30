import { api } from "@/redux/baseUrl/baseUrl";

const authSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    otpVerify: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/verify-email",
          body: data,
        };
      },
    }),
    register: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/users",
          body: data,
        };
      },
      transformResponse: (data) => {
        return data;
      },
      transformErrorResponse: ({ data }) => {
        const { message } = data;
        return message;
      },
    }),

    login: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/login",
          body: data,
        };
      },
      transformResponse: (data) => {
        return data;
      },
      // transformErrorResponse: ({ data }) => {
      //   const { message } = data;
      //   return message;
      // },
    }),

    forgotPassword: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/forget-password",
          body: data,
        };
      },
    }),
    resendOtp: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/resend-otp",
          body: data,
        };
      },
    }),
    resetPassword: builder.mutation({
      query: (data) => {
        const resetToken = localStorage.getItem("verifyToken");
        return {
          url: "/auth/reset-password",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            resetToken: `${resetToken}` || undefined,
          },
          body: data,
        };
      },
    }),
    changePassword: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/change-password",
          body: data,
        };
      },
    }),

    updateProfile: builder.mutation({
      query: ({ data }) => {
        return {
          method: "PATCH",
          url: "/users/profile",
          body: data,
        };
      },
      invalidatesTags: ["User"],
    }),
    getUser: builder.query({
      query: (data) => {
        return {
          method: "GET",
          url: "/users/profile",
          body: data,
        };
      },
    }),

    myProfile: builder.query({
      query: () => ({
        method: "GET",
        url: "/users/profile",
      }),
      transformResponse: ({ data }) => {
        return data;
      },
      providesTags: ["User"],
    }),

    userDeleteAccount: builder.mutation({
      query: (data) => ({
        method: "DELETE",
        url: "/users/delete",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // GET: Get all push notifications with filtering and pagination
    getGreetingMessage: builder.query({
      query: () => {
        return {
          url: `/preference/get-getting`,
          method: "GET",
        };
      },
      providesTags: ["GreetingMessage"],
    }),
  }),
});

export const {
  useOtpVerifyMutation,
  useForgotPasswordMutation,
  useRegisterMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useProfileQuery,
  useGetUserQuery,
  useMyProfileQuery,
  useLoginMutation,
  useUserDeleteAccountMutation,
  useGetGreetingMessageQuery,
} = authSlice;
