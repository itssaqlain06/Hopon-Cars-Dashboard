import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Admin } from '../../types/admin';

export const adminLogin = createApi({
  reducerPath: 'adminLogin',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://hoponcar-production.up.railway.app/',
  }),
  endpoints: (builder) => ({
    fetchAdmins: builder.query({
      query: () => ({
        url: '/api/v1/admin/get-users?usertype=admin',
      }),
    }),
    updateAdmin: builder.mutation<Admin, { id: number; updatedAdmin: Admin }>({
      query: ({ id, updatedAdmin }) => ({
        url: `api/v1/user/update-user/${id}`,
        method: 'PUT',
        body: updatedAdmin,
      }),
    }),
    addUser: builder.mutation({
      query: (user) => ({
        url: 'api/v1/admin/login-admin',
        method: 'POST',
        body: user,
      }),
    }),
    registerAdmin: builder.mutation({
      query: (admin) => ({
        url: 'api/v1/admin/register-admin',
        method: 'POST',
        body: admin,
      }),
    }),
  }),
});

export const {
  useFetchAdminsQuery,
  useAddUserMutation,
  useRegisterAdminMutation,
  useUpdateAdminMutation,
} = adminLogin;
