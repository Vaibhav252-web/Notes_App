import { configureStore } from '@reduxjs/toolkit';
import { authUserApi } from '../service/user.auth';
import { notesApi } from "../service/note.auth";

export const store = configureStore({
  reducer: {
    [authUserApi.reducerPath]: authUserApi.reducer,
    [notesApi.reducerPath]: notesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authUserApi.middleware)
      .concat(notesApi.middleware),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;