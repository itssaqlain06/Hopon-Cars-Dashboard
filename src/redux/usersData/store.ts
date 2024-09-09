import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import { vehiclesData } from './vehiclesData';
import { adminLogin } from './adminLogin';
import adminReducer from '../admins/adminSlice';
import { fairApi } from './fairApi';
import { fixFares } from './fixFares';
import { locations } from './locations';
import { postcodes } from './postcodes';
import { meetAndGreet } from './meetAndGreet';
import { pickupAndDropoff } from './pickupAndDropoff';
import { booking } from './booking';
import { driver } from './driver';
import { driverDetails } from './driverDetails';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [vehiclesData.reducerPath]: vehiclesData.reducer,
    [adminLogin.reducerPath]: adminLogin.reducer,
    admins: adminReducer,
    [fairApi.reducerPath]: fairApi.reducer,
    [fixFares.reducerPath]: fixFares.reducer,
    [locations.reducerPath]: locations.reducer,
    [postcodes.reducerPath]: postcodes.reducer,
    [meetAndGreet.reducerPath]: meetAndGreet.reducer,
    [pickupAndDropoff.reducerPath]: pickupAndDropoff.reducer,
    [booking.reducerPath]: booking.reducer,
    [driver.reducerPath]: driver.reducer,
    [driverDetails.reducerPath]: driverDetails.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      api.middleware,
      vehiclesData.middleware,
      fairApi.middleware,
      fixFares.middleware,
      adminLogin.middleware,
      locations.middleware,
      postcodes.middleware,
      meetAndGreet.middleware,
      pickupAndDropoff.middleware,
      booking.middleware,
      driver.middleware,
      driverDetails.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
