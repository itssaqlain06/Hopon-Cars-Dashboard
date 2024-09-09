import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const fixFares = createApi({
  reducerPath: 'fixFares',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://hoponcar-production.up.railway.app/',
  }),
  endpoints: (builder) => ({
    getFixFare: builder.query({
      query: () => 'api/v1/updatefix/getallfixfair',
    }),
    addFixFare: builder.mutation({
      query: (fairData) => ({
        url: 'api/v1/updatefix/addfair',
        method: 'POST',
        body: fairData,
      }),
    }),
    updateFixFare: builder.mutation({
      query: ({
        id,
        carId,
        pickuppostcode,
        destinationpostcode,
        normalhoursprice,
        outofhoursprice,
      }) => ({
        url: `api/v1/updatefix/updatefair/${id}`,
        method: 'PUT',
        body: {
          carId,
          pickuppostcode,
          destinationpostcode,
          normalhoursprice,
          outofhoursprice,
        },
      }),
    }),

    deleteFixFare: builder.mutation({
      query: (id) => ({
        url: `api/v1/updatefix/delete/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetFixFareQuery,
  useAddFixFareMutation,
  useUpdateFixFareMutation,
  useDeleteFixFareMutation,
} = fixFares;
