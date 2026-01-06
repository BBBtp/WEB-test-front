import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FiltersState {
  categories: string[];
  searchQuery: string;
  filterParams: Record<string, any>;
}

const initialState: FiltersState = {
  categories: [],
  searchQuery: '',
  filterParams: {},
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    setFilterParams: (state, action: PayloadAction<Record<string, any>>) => {
      state.filterParams = { ...state.filterParams, ...action.payload };
    },
    resetFilters: (state) => {
      state.categories = [];
      state.searchQuery = '';
      state.filterParams = {};
    },
  },
});

export const { setSearchQuery, setCategories, setFilterParams, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;

