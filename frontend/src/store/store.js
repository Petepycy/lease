import { configureStore } from '@reduxjs/toolkit';
import leasesReducer from './slices/leasesSlice';

export const store = configureStore({
  reducer: {
    leases: leasesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
}); 