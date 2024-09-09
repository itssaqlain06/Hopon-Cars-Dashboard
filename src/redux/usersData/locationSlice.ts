import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Location } from '../../types/location';

interface LocationsState {
  locations: Location[];
}

const initialState: LocationsState = {
  locations: [],
};

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    addLocation(state, action: PayloadAction<Location>) {
      state.locations.push(action.payload);
    },
  },
});

export const { addLocation } = locationsSlice.actions;
export default locationsSlice.reducer;
