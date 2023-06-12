import { configureStore } from '@reduxjs/toolkit';
import globalReducer from './slices/globalSlice';
import { userApiSlice } from './api/usersApi';
import { productsApi } from './api/productsApi';
import { repairsApiSlice } from './api/repairsApi';

const store = configureStore({
  reducer: {
    auth: globalReducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [repairsApiSlice.reducerPath]: repairsApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApiSlice.middleware)
      .concat(productsApi.middleware)
      .concat(repairsApiSlice.middleware),
  devTools: true,
});

export default store;
