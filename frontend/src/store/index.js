import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import carsReducer from './slices/carsSlice';
import leasesReducer from './slices/leasesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cars: carsReducer,
    leases: leasesReducer,
  },
}); 