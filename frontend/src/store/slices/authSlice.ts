import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import cookieManager from "@/lib/cookieManage";
import encryptionManager from "@/lib/encryptionManager";

export type AuthState = {
  token: string | null;
};

const AUTH_KEY = import.meta.env.VITE_AUTH_KEY || "auth_token";

const getInitialToken = (): string | null => {
  try {
    const raw = cookieManager.get(AUTH_KEY);
    if (!raw) return null;
    return encryptionManager.decrypt(raw) || null;
  } catch (error) {
    console.error("Failed to decrypt auth token:", error);
    return null;
  }
};

const initialState: AuthState = {
  token: getInitialToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      try {
        cookieManager.set(
          AUTH_KEY,
          encryptionManager.encrypt(action.payload),
        );
      } catch (error) {
        console.error("Failed to encrypt auth token:", error);
      }
    },
    clearAuth(state) {
      state.token = null;
      try {
        cookieManager.remove(AUTH_KEY);
      } catch (error) {
        console.error("Failed to remove auth cookie:", error);
      }
    },
  },
});

export const { setToken, clearAuth } = authSlice.actions;
export default authSlice;
