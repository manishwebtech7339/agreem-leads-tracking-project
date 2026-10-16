import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { RootState } from "@/store/store";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Accept", "application/json");
      headers.set("X-Platform", "web");
      headers.set("X-App-Version", import.meta.env.VITE_APP_VERSION || "1.0.0");
      return headers;
    },
  }),
  tagTypes: ["Users", "Leads", "Notes", "Dashboard", "CurrentUser"],
  endpoints: () => ({}),
});

export default baseApi;
