import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pickupAndDropoff = createApi({
  reducerPath: 'pickupAndDropoff',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://hoponcar-production.up.railway.app/',
  }),
  endpoints: (builder) => ({
    fetchPickupDropoff: builder.query({
      query: () => 'api/v1/pickdrop/getall',
    }),
    addPickupDropoff: builder.mutation({
      query: (newPickupDropoff) => ({
        url: 'api/v1/pickdrop/add',
        method: 'POST',
        body: newPickupDropoff,
      }),
    }),
    updatePickupDropoff: builder.mutation<
      any,
      { id: string; updatedPickupDropoff: any }
    >({
      query: ({ id, updatedPickupDropoff }) => ({
        url: `api/v1/pickdrop/update/${id}`,
        method: 'PUT',
        body: updatedPickupDropoff,
      }),
    }),
    deletePickupDropoff: builder.mutation<any, string>({
      query: (id) => ({
        url: `api/v1/pickdrop/delete/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchPickupDropoffQuery,
  useAddPickupDropoffMutation,
  useUpdatePickupDropoffMutation,
  useDeletePickupDropoffMutation,
} = pickupAndDropoff;
