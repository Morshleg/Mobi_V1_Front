import { configureStore } from '@reduxjs/toolkit';
import globalReducer from './slices/globalSlice';
import { userApiSlice } from './slices/usersApiSlice';
import { productsApiSlice } from './slices/productsApiSlice';

const store = configureStore({
  reducer: {
    auth: globalReducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [productsApiSlice.reducerPath]: productsApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApiSlice.middleware)
      .concat(productsApiSlice.middleware),
  devTools: true,
});

export default store;
