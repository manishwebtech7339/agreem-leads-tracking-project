import baseApi from "@/store/rtk";
import type { ApiResponse, DashboardStats } from "@/lib/types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => ({
        url: "/dashboard/stats",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
