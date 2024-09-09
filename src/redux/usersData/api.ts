import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, NewUser } from '../../types/user';
import { Package } from '../../types/package';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://hoponcar-production.up.railway.app/',
  }),
  endpoints: (builder) => ({
    fetchUsers: builder.query<Package[], void>({
      query: () => '/api/v1/admin/get-users?usertype=passenger',
    }),
    fetchUserById: builder.query<Package, number>({
      query: (id) => `api/v1/user/user-details/${id}`,
    }),
    addUser: builder.mutation<User, NewUser>({
      query: (newUser) => ({
        url: 'api/users/new',
        method: 'POST',
        body: newUser,
      }),
    }),
    updateUser: builder.mutation<
      User,
      { id: number; updatedUser: Partial<User> }
    >({
      query: ({ id, updatedUser }) => ({
        url: `api/v1/user/update-user/${id}`,
        method: 'PUT',
        body: updatedUser,
      }),
    }),
    deleteUser: builder.mutation<any, number>({
      query: (userId) => ({
        url: `api/users/${userId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchUsersQuery,
  useFetchUserByIdQuery,
  useLazyFetchUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = api;
