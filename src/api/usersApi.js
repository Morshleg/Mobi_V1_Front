import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const USERS_URL = '/api/users';

export const userApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  reducerPath: 'userApiSlice',
  tagTypes: ['User'],
  endpoints: (build) => ({
    login: build.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),

    logout: build.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),

    register: build.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
      providesTags: ['User'],
    }),

    getUserProfile: build.query({
      query: () => `${USERS_URL}/profile`,
      method: 'GET',
    }),

    updateUserProfile: build.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
      providesTags: ['User'],
    }),

    getAllUsers: build.query({
      query: () => `${USERS_URL}`,
      method: 'GET',
    }),

    getUserById: build.mutation({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: 'GET',
        providesTags: ['getUserById'],
      }),
    }),

    updateUser: build.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: 'PUT',
      }),
      providesTags: (id) => [{ type: 'User', id }],
    }),

    deleteUser: build.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: 'DELETE',
      }),
      providesTags: (id) => [{ type: 'User', id }],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserProfileMutation,
  useGetUserProfileQuery,
  useGetAllUsersQuery,
  useGetUserByIdMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
