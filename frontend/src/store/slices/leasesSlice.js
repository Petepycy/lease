import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Async thunk for fetching leases
export const fetchLeases = createAsyncThunk(
  'leases/fetchLeases',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/leases/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for creating a new lease
export const createLease = createAsyncThunk(
  'leases/createLease',
  async (leaseData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/leases/`, leaseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating a lease
export const updateLease = createAsyncThunk(
  'leases/updateLease',
  async ({ id, leaseData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/leases/${id}/`, leaseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for deleting a lease
export const deleteLease = createAsyncThunk(
  'leases/deleteLease',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/leases/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  leases: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const leasesSlice = createSlice({
  name: 'leases',
  initialState,
  reducers: {
    clearLeases: (state) => {
      state.leases = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch leases
      .addCase(fetchLeases.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeases.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leases = action.payload;
      })
      .addCase(fetchLeases.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create lease
      .addCase(createLease.fulfilled, (state, action) => {
        state.leases.push(action.payload);
      })
      // Update lease
      .addCase(updateLease.fulfilled, (state, action) => {
        const index = state.leases.findIndex(lease => lease.id === action.payload.id);
        if (index !== -1) {
          state.leases[index] = action.payload;
        }
      })
      // Delete lease
      .addCase(deleteLease.fulfilled, (state, action) => {
        state.leases = state.leases.filter(lease => lease.id !== action.payload);
      });
  },
});

export const { clearLeases } = leasesSlice.actions;

export default leasesSlice.reducer; 