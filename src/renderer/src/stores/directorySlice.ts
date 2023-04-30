import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { genUUID } from '../lib/utils';

// Define a type for the slice state

export interface Directory {
  path: string;
}

// Define the initial state using that type
const initialState: Directory = {
  path: `D:/backup oneplus camera/archive-delete 2017-2018`,
};

export const labelSlice = createSlice({
  name: 'directory',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    update: (state, action: PayloadAction<string>) => {
      state.path = action.payload;
    },
  },
});

export const { update } = labelSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPath = (state: RootState) => state.directory.path;

export default labelSlice.reducer;
