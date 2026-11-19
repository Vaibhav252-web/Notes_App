import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
}

export interface VerifyOtpRequest {
  userID: string;
  otp: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface RegisterData {
  userID: string;
}


export interface UnverifiedLoginData {
  userID: string;
}

export const authUserApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/user' }),
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse<RegisterData>, RegisterRequest>({
      query: (credentials) => ({
        url: '/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    verifyOtp: builder.mutation<ApiResponse<string>, VerifyOtpRequest>({
      query: (data) => ({
        url: '/verifyOTP',
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation<
      ApiResponse<string | UnverifiedLoginData>,
      LoginRequest
    >({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyOtpMutation,
  useLoginMutation,
} = authUserApi;