import { configureStore } from '@reduxjs/toolkit';
import leasesReducer from './slices/leasesSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    leases: leasesReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
}); 