import {
  configureStore,
  isRejectedWithValue,
  type Middleware,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import baseApi from "@/store/rtk";
import authSlice, { clearAuth } from "@/store/slices/authSlice";

// -- A Common middleware for checking apis fails --
const auth401Middleware: Middleware = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as unknown;
    if (
      payload &&
      typeof payload === "object" &&
      "status" in payload &&
      (payload as { status?: number }).status === 401
    ) {
      api.dispatch(clearAuth());
      api.dispatch(baseApi.util.resetApiState());
    }
  }
  return next(action);
};

// --
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, auth401Middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
