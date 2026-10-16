import baseApi from "@/store/rtk";
import type {
  ApiResponse,
  ApiFilterParams,
  LeadData,
  LeadsApiResponse,
  CreateLeadPayload,
  UpdateLeadPayload,
} from "@/lib/types";

export const leadsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeads: builder.query<LeadsApiResponse, ApiFilterParams | void>({
      query: (params) => ({
        url: "/leads",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          perPage: params?.perPage ?? 10,
          ...(params?.query ? { query: params.query } : {}),
        },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Leads" as const, id })),
              { type: "Leads", id: "LIST" },
            ]
          : [{ type: "Leads", id: "LIST" }],
    }),
    getLeadById: builder.query<ApiResponse<LeadData>, number | string>({
      query: (id) => ({
        url: `/leads/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Leads", id }],
    }),
    createLead: builder.mutation<ApiResponse<LeadData>, CreateLeadPayload>({
      query: (body) => ({
        url: "/leads",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Leads", id: "LIST" }],
    }),
    updateLead: builder.mutation<
      ApiResponse<LeadData>,
      { id: number | string; data: UpdateLeadPayload }
    >({
      query: ({ id, data }) => ({
        url: `/leads/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Leads", id: "LIST" },
        { type: "Leads", id },
      ],
    }),
    deleteLead: builder.mutation<ApiResponse, number | string>({
      query: (id) => ({
        url: `/leads/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Leads", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
} = leadsApi;
