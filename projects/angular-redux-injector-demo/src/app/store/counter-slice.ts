import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { inject } from '@angular/core';
import { RandomNumberService } from '../services/random-number.service';
import {
  asyncRunInInjectionContext,
  RunInInjectionContextProps,
} from '../utils/async-run-in-injection-context';

export const incrementByRandomNumber = createAsyncThunk(
  'counter/incrementByAmountFromService',
  (arg: RunInInjectionContextProps<{}>, _thunkAPI) => {
    return asyncRunInInjectionContext(arg.injector, async () => {
      const service = inject(RandomNumberService);
      const newCount = await service.getRandomNumber();
      return newCount;
    });
  },
);

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(incrementByRandomNumber.fulfilled, (state, action) => {
      state.isLoading = false;
      state.value += action.payload;
    });
    builder.addCase(incrementByRandomNumber.pending, (state) => {
      state.isLoading = true;
    });
  },
});

export default counterSlice.reducer;
