import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, NewUser } from '../../types/user';
import { Package } from '../../types/package';

export const driver = createApi({
  reducerPath: 'driver',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://hoponcar-production.up.railway.app/',
  }),
  endpoints: (builder) => ({
    fetchDriver: builder.query({
      query: () => 'api/v1/ride/get-Booking-hopon',
    }),
    fetchUserById: builder.query<Package, number>({
      query: (id) => `api/v1/user/user-details/${id}`,
    }),
    addDriver: builder.mutation({
      query: (newDriver) => ({
        url: 'api/v1/ride/add-Booking-hopon',
        method: 'POST',
        body: newDriver,
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
  useFetchDriverQuery,
  useFetchUserByIdQuery,
  useLazyFetchUserByIdQuery,
  useAddDriverMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = driver;
