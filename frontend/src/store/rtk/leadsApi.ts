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
          query: params?.query ?? "",
        },
      }),
      providesTags: ["Leads"],
    }),
    getLeadById: builder.query<ApiResponse<LeadData>, number | string>({
      query: (id) => ({
        url: `/leads/${id}`,
        method: "GET",
      }),
      providesTags: ["Leads"],
    }),
    createLead: builder.mutation<ApiResponse<LeadData>, CreateLeadPayload>({
      query: (body) => ({
        url: "/leads",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Leads"],
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
      invalidatesTags: ["Leads"],
    }),
    deleteLead: builder.mutation<ApiResponse, number | string>({
      query: (id) => ({
        url: `/leads/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Leads"],
    }),
  }),
});

export const {
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
} = leadsApi;
