import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, NewUser } from '../../types/user';
import { Package } from '../../types/package';

export const booking = createApi({
    reducerPath: 'booking',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://hoponcar-production.up.railway.app/',
    }),
    endpoints: (builder) => ({
        fetchBooking: builder.query<Package[], void>({
            query: () => 'api/v1/ride/get-Booking-hopon',
        }),
        fetchBookingById: builder.query<Package, number>({
            query: (id) => `api/v1/user/user-details/${id}`,
        }),
        addBooking: builder.mutation({
            query: (newBooking) => ({
                url: 'api/v1/ride/add-Booking-hopon',
                method: 'POST',
                body: newBooking,
            }),
        }),
        updateBooking: builder.mutation<
            User,
            { id: number; updatedUser: Partial<User> }
        >({
            query: ({ id, updatedUser }) => ({
                url: `api/v1/user/update-user/${id}`,
                method: 'PUT',
                body: updatedUser,
            }),
        }),
        deleteBooking: builder.mutation<any, number>({
            query: (userId) => ({
                url: `api/users/${userId}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useFetchBookingQuery,
    useFetchBookingByIdQuery,
    useLazyFetchBookingByIdQuery,
    useAddBookingMutation,
    useUpdateBookingMutation,
    useDeleteBookingMutation,
} = booking;
