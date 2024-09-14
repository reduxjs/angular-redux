import type { Action, ThunkAction } from '@reduxjs/toolkit';
import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import { injectDispatch, injectSelector, injectStore } from '../public-api';

export interface CounterState {
  counter: number;
}

const initialState: CounterState = {
  counter: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.counter++;
    },
  },
});

export function fetchCount(amount = 1) {
  return new Promise<{ data: number }>((resolve) =>
    setTimeout(() => resolve({ data: amount }), 500),
  );
}

export const incrementAsync = createAsyncThunk(
  'counter/fetchCount',
  async (amount: number) => {
    const response = await fetchCount(amount);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  },
);

const { increment } = counterSlice.actions;

const counterStore = configureStore({
  reducer: counterSlice.reducer,
});

type AppStore = typeof counterStore;
type AppDispatch = typeof counterStore.dispatch;
type RootState = ReturnType<typeof counterStore.getState>;
type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;

describe('injectSelector.withTypes<RootState>()', () => {
  test('should return injectSelector', () => {
    const injectAppSelector = injectSelector.withTypes<RootState>();

    expect(injectAppSelector).toBe(injectSelector);
  });
});

describe('injectDispatch.withTypes<AppDispatch>()', () => {
  test('should return injectDispatch', () => {
    const injectAppDispatch = injectDispatch.withTypes<AppDispatch>();

    expect(injectAppDispatch).toBe(injectDispatch);
  });
});

describe('injectStore.withTypes<AppStore>()', () => {
  test('should return injectStore', () => {
    const injectAppStore = injectStore.withTypes<AppStore>();

    expect(injectAppStore).toBe(injectStore);
  });
});
