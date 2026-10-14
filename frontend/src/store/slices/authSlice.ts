import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import cookieManager from "@/lib/cookieManage";
import encryptionManager from "@/lib/encryptionManager";

export type AuthState = {
  token: string | null;
};

const initialState: AuthState = {
  token: cookieManager.get(import.meta.env.VITE_AUTH_KEY)
    ? encryptionManager.decrypt(
        cookieManager.get(import.meta.env.VITE_AUTH_KEY) as string,
      )
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      cookieManager.set(
        import.meta.env.VITE_AUTH_KEY,
        encryptionManager.encrypt(action.payload),
      );
    },
    clearAuth(state) {
      state.token = null;
      cookieManager.remove(import.meta.env.VITE_AUTH_KEY!);
    },
  },
});

export const { setToken, clearAuth } = authSlice.actions;
export default authSlice;
