import { configureStore } from '@reduxjs/toolkit';
import globalReducer from './slices/globalSlice';
import { userApi } from './api/usersApi';
import { productsApi } from './api/productsApi';
import { repairsApi } from './api/repairsApi';

const store = configureStore({
  reducer: {
    auth: globalReducer,
    [userApi.reducerPath]: userApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [repairsApi.reducerPath]: repairsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(productsApi.middleware)
      .concat(repairsApi.middleware),
  devTools: true,
});

export default store;
