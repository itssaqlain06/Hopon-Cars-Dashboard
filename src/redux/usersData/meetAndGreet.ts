import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const meetAndGreet = createApi({
  reducerPath: 'meetAndGreet',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://hoponcar-production.up.railway.app/',
  }),
  endpoints: (builder) => ({
    getMeetAndGreet: builder.query({
      query: () => 'api/v1/meetsandgreets/getall',
    }),
    addMeetAndGreet: builder.mutation({
      query: (meetandgreetData) => ({
        url: 'api/v1/meetsandgreets/addmeetsandgreets',
        method: 'POST',
        body: meetandgreetData,
      }),
    }),
    updateMeetAndGreet: builder.mutation({
      query: ({ id, fairData }) => ({
        url: `api/v1/meetsandgreets/update/${id}`,
        method: 'PUT',
        body: fairData,
      }),
    }),
    deleteMeetAndGreet: builder.mutation<any, number>({
      query: (id) => ({
        url: `api/v1/meetsandgreets/delete/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetMeetAndGreetQuery,
  useAddMeetAndGreetMutation,
  useUpdateMeetAndGreetMutation,
  useDeleteMeetAndGreetMutation,
} = meetAndGreet;
