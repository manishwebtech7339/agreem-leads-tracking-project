import baseApi from "@/store/rtk";
import type {
  ApiFilterParams,
  ApiResponse,
  PaginatedApiResponse,
  UserData,
} from "@/lib/types";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<
      PaginatedApiResponse<UserData[]>,
      ApiFilterParams | void
    >({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          perPage: params?.perPage ?? 10,
          query: params?.query ?? "",
        },
      }),
      providesTags: ["Users"],
    }),
    getUserById: builder.query<ApiResponse<UserData>, number | string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    deleteUser: builder.mutation<ApiResponse, number | string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useDeleteUserMutation } =
  usersApi;
