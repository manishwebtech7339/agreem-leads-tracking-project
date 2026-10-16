import { useState } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Edit, FileText, Plus, Trash2 } from "lucide-react";
import {
  useGetNotesByLeadIdQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from "@/store/rtk/notesApi";
import { noteFormSchema, type NoteFormSchemaType } from "@/lib/formSchema";
import type { LeadData, NoteData } from "@/lib/types";
import { format } from "date-fns";

interface LeadNotesSubTableProps {
  lead: LeadData;
}

const LeadNotesSubTable = ({ lead }: LeadNotesSubTableProps) => {
  const { data, isLoading } = useGetNotesByLeadIdQuery(lead.id);
  const notesList = data?.data ?? [];

  const [createNote, { isLoading: isCreatingNote }] = useCreateNoteMutation();
  const [updateNote, { isLoading: isUpdatingNote }] = useUpdateNoteMutation();
  const [deleteNote, { isLoading: isDeletingNote }] = useDeleteNoteMutation();

  const [deletePopoverId, setDeletePopoverId] = useState<number | null>(null);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteData | null>(null);

  // Form
  const noteForm = useForm<NoteFormSchemaType>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      leadId: String(lead.id),
      content: "",
    },
  });

  // --
  const handleOpenAddNote = () => {
    setSelectedNote(null);
    noteForm.reset({
      leadId: String(lead.id),
      content: "",
    });
    setIsNoteDialogOpen(true);
  };

  // --
  const handleOpenEditNote = (note: NoteData) => {
    setSelectedNote(note);
    noteForm.reset({
      leadId: String(note.leadId),
      content: note.content,
    });
    setIsNoteDialogOpen(true);
  };

  // --
  const onNoteSubmit = async (formData: NoteFormSchemaType) => {
    try {
      if (selectedNote) {
        const res = await updateNote({
          id: selectedNote.id,
          data: {
            content: formData.content,
          },
        }).unwrap();
        toast.success(res.message || "Note updated successfully");
      } else {
        const res = await createNote({
          leadId: formData.leadId,
          content: formData.content,
        }).unwrap();
        toast.success(res.message || "Note added successfully");
      }
      setIsNoteDialogOpen(false);
      noteForm.reset();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Operation failed");
    }
  };

  // --
  const handleDeleteNote = async (id: number) => {
    try {
      const res = await deleteNote(id).unwrap();
      toast.success(res.message || "Note deleted successfully");
      setDeletePopoverId(null);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to delete note");
    }
  };

  return (
    <div className="space-y-3 rounded-lg border bg-background/60 p-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <h4 className="text-sm font-semibold">Notes for {lead.name}</h4>
        </div>
        <Button size="xs" variant="outline" onClick={handleOpenAddNote}>
          <Plus className="size-3" />
          <span>Add Note</span>
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">Note</TableHead>
              <TableHead className="w-[25%]">Created At</TableHead>
              <TableHead className="w-[15%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-4 text-center text-xs text-muted-foreground"
                >
                  Loading notes...
                </TableCell>
              </TableRow>
            ) : notesList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-4 text-center text-xs text-muted-foreground"
                >
                  No notes for this lead yet. Click &quot;Add Note&quot; to
                  create one.
                </TableCell>
              </TableRow>
            ) : (
              notesList.map((note) => (
                <TableRow key={note.id}>
                  <TableCell className="text-xs font-normal whitespace-pre-wrap">
                    {note.content}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(note.createdAt), "dd-MM-yyyy hh:mm a")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => handleOpenEditNote(note)}
                        title="Edit note"
                      >
                        <Edit className="size-3" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Popover
                        open={deletePopoverId === note.id}
                        onOpenChange={(open) =>
                          setDeletePopoverId(open ? note.id : null)
                        }
                      >
                        <PopoverTrigger asChild>
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            disabled={isDeletingNote}
                            title="Delete note"
                          >
                            <Trash2 className="size-3" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60">
                          <p className="mb-2 text-xs">
                            Are you sure you want to delete this note?
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => setDeletePopoverId(null)}
                              disabled={isDeletingNote}
                            >
                              No
                            </Button>
                            <Button
                              size="xs"
                              variant="destructive"
                              onClick={() => handleDeleteNote(note.id)}
                              disabled={isDeletingNote}
                            >
                              {isDeletingNote && deletePopoverId === note.id
                                ? "Deleting..."
                                : "Yes"}
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog for Note Create and Edit */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedNote ? "Edit Note" : "Add Note"}</DialogTitle>
            <DialogDescription>
              {selectedNote
                ? "Update your note for this lead."
                : `Add a new note for ${lead.name}.`}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={noteForm.handleSubmit(onNoteSubmit)}
            className="space-y-4"
          >
            <FieldGroup>
              <Field>
                <Controller
                  name="content"
                  control={noteForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`note-content-${lead.id}`}>
                        Note Content
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id={`note-content-${lead.id}`}
                        placeholder="Write your note here..."
                        rows={4}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </Field>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNoteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreatingNote || isUpdatingNote}
                >
                  {selectedNote
                    ? isUpdatingNote
                      ? "Updating..."
                      : "Update Note"
                    : isCreatingNote
                      ? "Adding..."
                      : "Add Note"}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadNotesSubTable;
