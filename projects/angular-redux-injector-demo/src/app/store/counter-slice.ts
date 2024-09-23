import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  EnvironmentInjector,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { RandomNumberService } from '../services/random-number.service';

interface IncrementByAmountFromServiceProps {
  injector: EnvironmentInjector;
}

export const incrementByRandomNumber = createAsyncThunk(
  'counter/incrementByAmountFromService',
  (arg: IncrementByAmountFromServiceProps, _thunkAPI) => {
    return new Promise<number>((resolve, reject) => {
      runInInjectionContext(arg.injector, () => {
        const runValue = async () => {
          const service = inject(RandomNumberService);
          const newCount = await service.getRandomNumber();
          return newCount;
        };

        runValue()
          .then((value) => {
            resolve(value);
          })
          .catch((error) => {
            reject(error);
          });
      });
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
