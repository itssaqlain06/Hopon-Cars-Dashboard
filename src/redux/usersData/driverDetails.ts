import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const driverDetails = createApi({
    reducerPath: 'driverDetails',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://hoponcar-production.up.railway.app/',
    }),
    endpoints: (builder) => ({
        getDriverDetails: builder.query({
            query: () => 'api/v1/driver/getall',
        }),
        addDriverDetails: builder.mutation({
            query: (driverDetailsData) => ({
                url: 'api/v1/driver/adddriver',
                method: 'POST',
                body: driverDetailsData,
            }),
        }),
        // updateFixFare: builder.mutation({
        //   query: ({
        //     id,
        //     carId,
        //     pickuppostcode,
        //     destinationpostcode,
        //     normalhoursprice,
        //     outofhoursprice,
        //   }) => ({
        //     url: `api/v1/updatefix/updatefair/${id}`,
        //     method: 'PUT',
        //     body: {
        //       carId,
        //       pickuppostcode,
        //       destinationpostcode,
        //       normalhoursprice,
        //       outofhoursprice,
        //     },
        //   }),
        // }),

        // deleteFixFare: builder.mutation({
        //   query: (id) => ({
        //     url: `api/v1/updatefix/delete/${id}`,
        //     method: 'DELETE',
        //   }),
        // }),
    }),
});

export const {
    useGetDriverDetailsQuery,
    useAddDriverDetailsMutation,
    //   useUpdateFixFareMutation,
    //   useDeleteFixFareMutation,
} = driverDetails;
