import baseApi from "@/store/rtk";
import type {
  ApiResponse,
  NoteData,
  NotesApiResponse,
  CreateNotePayload,
  UpdateNotePayload,
} from "@/lib/types";

export const notesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotesByLeadId: builder.query<NotesApiResponse, number | string>({
      query: (leadId) => ({
        url: "/notes",
        method: "GET",
        params: { leadId },
      }),
      providesTags: ["Notes"],
    }),
    getNoteById: builder.query<ApiResponse<NoteData>, number | string>({
      query: (id) => ({
        url: `/notes/${id}`,
        method: "GET",
      }),
      providesTags: ["Notes"],
    }),
    createNote: builder.mutation<ApiResponse<NoteData>, CreateNotePayload>({
      query: (body) => ({
        url: "/notes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notes"],
    }),
    updateNote: builder.mutation<
      ApiResponse<NoteData>,
      { id: number | string; data: UpdateNotePayload }
    >({
      query: ({ id, data }) => ({
        url: `/notes/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Notes"],
    }),
    deleteNote: builder.mutation<ApiResponse, number | string>({
      query: (id) => ({
        url: `/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),
  }),
});

export const {
  useGetNotesByLeadIdQuery,
  useGetNoteByIdQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApi;
