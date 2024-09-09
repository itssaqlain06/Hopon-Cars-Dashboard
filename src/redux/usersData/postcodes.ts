import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const postcodes = createApi({
  reducerPath: 'postcodes',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://hoponcar-production.up.railway.app/',
  }),
  endpoints: (builder) => ({
    getPostcodes: builder.query({
      query: () => 'api/v1/postcode/getpostcode',
    }),
    addPostcodes: builder.mutation({
      query: (postcodeData) => ({
        url: 'api/v1/postcode/addpostcode',
        method: 'POST',
        body: postcodeData,
      }),
    }),
  }),
});

export const { useGetPostcodesQuery, useAddPostcodesMutation } = postcodes;
