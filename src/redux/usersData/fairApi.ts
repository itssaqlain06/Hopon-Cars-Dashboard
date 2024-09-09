import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const fairApi = createApi({
  reducerPath: 'fairApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://hoponcar-production.up.railway.app/',
  }),
  endpoints: (builder) => ({
    getFairs: builder.query({
      query: () => 'api/v1/fair/getall',
    }),
    getSingleFair: builder.query({
      query: (id) => `api/v1/fair/getsinglefair/${id}`,
    }),
    addFair: builder.mutation({
      query: (fairData) => ({
        url: 'api/v1/fair/milefair',
        method: 'POST',
        body: fairData,
      }),
    }),
    updateFair: builder.mutation({
      query: ({ id, fairId, fairData }) => ({
        url: `api/v1/fair/update/${id}/${fairId}`,
        method: 'PUT',
        body: fairData,
      }),
    }),
    deleteFair: builder.mutation<any, number>({
      query: ({ id, fairId }: any) => ({
        url: `api/v1/fair/delete/${id}/${fairId}`,
        method: 'DELETE',
      }),
    }),
    updateHours: builder.mutation({
      query: ({ id, hoursData }) => ({
        url: `api/v1/hours/updatehours/${id}`,
        method: 'PUT',
        body: hoursData,
      }),
    }),
  }),
});

export const {
  useGetFairsQuery,
  useGetSingleFairQuery,
  useAddFairMutation,
  useUpdateFairMutation,
  useDeleteFairMutation,
  useUpdateHoursMutation,
} = fairApi;
