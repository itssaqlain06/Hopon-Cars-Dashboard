import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const locations = createApi({
  reducerPath: 'locations',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://hoponcar-production.up.railway.app/',
  }),
  endpoints: (builder) => ({
    fetchLocations: builder.query({
      query: () => 'api/v1/location/getalllocation',
    }),
    addLocation: builder.mutation({
      query: (newLocation) => ({
        url: 'api/v1/location/location',
        method: 'POST',
        body: newLocation,
      }),
    }),
    updateLocation: builder.mutation<any, { id: string; updatedLocation: any }>(
      {
        query: ({ id, updatedLocation }) => ({
          url: `api/v1/location/updatelocation/${id}`,
          method: 'PUT',
          body: updatedLocation,
        }),
      },
    ),
    deleteLocation: builder.mutation<any, string>({
      query: (id) => ({
        url: `api/v1/location/deletelocation/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchLocationsQuery,
  useAddLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} = locations;
