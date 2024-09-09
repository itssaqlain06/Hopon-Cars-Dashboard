import { createSlice } from '@reduxjs/toolkit';
import { Admin } from '../../types/admin';

interface AdminState {
  admins: Admin[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AdminState = {
  admins: [],
  status: 'idle',
  error: null,
};

const adminSlice = createSlice({
  name: 'admins',
  initialState,
  reducers: {
    addAdmin: (state, action) => {
      state.admins.push(action.payload);
    },
  },
});

export const { addAdmin } = adminSlice.actions;

export const selectAllAdmins = (state: { admins: AdminState }) =>
  state.admins.admins;

export default adminSlice.reducer;
