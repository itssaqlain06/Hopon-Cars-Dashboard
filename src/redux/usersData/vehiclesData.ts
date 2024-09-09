import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CarType } from '../../types/cars';

export const vehiclesData = createApi({
  reducerPath: 'vehiclesData',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://hoponcar-production.up.railway.app/',
  }),
  endpoints: (builder) => ({
    fetchCars: builder.query<CarType[], void>({
      query: () => 'api/v1/vehicles/getall-vehicles',
      transformResponse: (response: { code: number; vehicles: CarType[] }) =>
        response.vehicles,
    }),
    fetchCarById: builder.query<CarType, number>({
      query: (id) => `api/v1/vehicles/${id}`,
    }),
    addCar: builder.mutation<CarType, Partial<CarType>>({
      query: (newCar) => ({
        url: 'api/v1/vehicles/creatvehicle',
        method: 'POST',
        body: newCar,
      }),
    }),
    updateCar: builder.mutation<CarType, { id: number; updatedCar: CarType }>({
      query: ({ id, updatedCar }) => ({
        url: `api/v1/vehicles/update-vehicle/${id}`,
        method: 'PUT',
        body: updatedCar,
      }),
    }),
    deleteCar: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `api/v1/vehicles/delete-vehicle/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchCarsQuery,
  useFetchCarByIdQuery,
  useAddCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
} = vehiclesData;
