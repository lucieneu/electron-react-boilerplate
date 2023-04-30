import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { genUUID } from '../lib/utils';

// Define a type for the slice state
export interface LabelCreate {
  color: string;
  name: string;
  id?: string;
  active?: boolean;
  softDel?: Date;
  created?: Date;
  updated?: Date;
}

export interface Label {
  id: string;
  name: string;
  active: boolean;
  softDel?: Date;
  created: Date;
  updated: Date;
  color: string;
}

interface MyInterface {
  value: number;
  dict: {
    [key: string]: Label;
  };
  currentList: string[];
}

export interface SoftDelete {
  id: string;
}

// Define the initial state using that type
const initialState: MyInterface = {
  dict: {
    '123': {
      id: '123',
      name: 'deleted',
      active: true,
      color: '#ff0000',
      created: new Date('2020-00-0T00:00:00Z'),
      updated: new Date('2020-00-0T00:00:00Z'),
    },
  },
  currentList: ['123'],
  value: 0,
};

export const labelSlice = createSlice({
  name: 'label',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    add: (state, action: PayloadAction<LabelCreate>) => {
      const newLabel = {
        ...action.payload,
        id: genUUID(),
        created: new Date(),
        updated: new Date(),
        active: true,
      };

      state.dict[newLabel.id] = newLabel;
      state.currentList.push(newLabel.id);
    },
    update: (state, action: PayloadAction<Label>) => {
      const label = action.payload;
      state.dict[label.id] = label;
    },
    softDelete: (state, action: PayloadAction<SoftDelete>) => {
      const { id } = action.payload;
      state.dict[id].softDel = new Date();

      state.currentList = state.currentList.filter((_id) => _id !== id);
    },
  },
});

export const { add, update, softDelete } = labelSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectDict = (state: RootState) => state.label.dict;
export const selectCurrentList = (state: RootState) =>
  state.label.currentList.map((id) => state.label.dict[id]);

export default labelSlice.reducer;
