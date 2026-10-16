import { useState, Fragment } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchForm } from "@/components/SearchForm";
import TablePagination from "@/components/TablePagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import useDebounce from "@/hooks/useDebounce";
import { ChevronRight, Edit, FileText, Plus, Trash2 } from "lucide-react";
import {
  useGetLeadsQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
} from "@/store/rtk/leadsApi";
import {
  leadFormSchema,
  LEAD_STATUS_OPTIONS,
  type LeadFormSchemaType,
} from "@/lib/formSchema";
import type { LeadData } from "@/lib/types";
import { cn } from "cn";
import LeadNotesSubTable from "./LeadNotesSubTable";
import { format } from "date-fns";

const Leads = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const { query, handleSearch } = useDebounce();
  const [openPopoverId, setOpenPopoverId] = useState<string | number | null>(null);

  // Expanded lead rows state (for notes sub-table)
  const [expandedLeadIds, setExpandedLeadIds] = useState<(string | number)[]>([]);

  // Lead Dialog state for Create / Edit
  const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);

  const handleSearchChange = (value: string) => {
    handleSearch(value);
    setPageIndex(1);
  };

  // Toggle row expansion for notes sub-table
  const toggleExpandLead = (id: string | number) => {
    setExpandedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // RTK Query
  const { data, isLoading, isFetching } = useGetLeadsQuery({
    page: pageIndex,
    perPage: 10,
    query,
  });
  const leadsList = data?.data ?? [];
  const pageCount = data?.totalPages ?? 1;

  const [createLead, { isLoading: isCreatingLead }] = useCreateLeadMutation();
  const [updateLead, { isLoading: isUpdatingLead }] = useUpdateLeadMutation();
  const [deleteLead, { isLoading: isDeletingLead }] = useDeleteLeadMutation();

  // Form
  const leadForm = useForm<LeadFormSchemaType>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: "new",
    },
  });

  // --
  const handleOpenCreateLead = () => {
    setSelectedLead(null);
    leadForm.reset({
      name: "",
      email: "",
      phone: "",
      status: "new",
    });
    setIsLeadDialogOpen(true);
  };

  // --
  const handleOpenEditLead = (lead: LeadData) => {
    setSelectedLead(lead);

    leadForm.reset({
      name: lead.name,
      email: lead.email,
      phone: lead.phone ?? "",
      status: (lead.status as "new") ?? "new",
    });
    setIsLeadDialogOpen(true);
  };

  // --
  const onLeadSubmit = async (formData: LeadFormSchemaType) => {
    try {
      const targetId = selectedLead?.id ?? selectedLead?._id;
      if (targetId) {
        const res = await updateLead({
          id: targetId,
          data: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || "",
            status: formData.status,
          },
        }).unwrap();
        toast.success(res.message || "Lead updated successfully");
      } else {
        const res = await createLead({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "",
          status: formData.status,
        }).unwrap();
        toast.success(res.message || "Lead created successfully");
      }
      setIsLeadDialogOpen(false);
      leadForm.reset();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Operation failed");
    }
  };

  // --
  const handleDeleteLead = async (id: string | number) => {
    try {
      const res = await deleteLead(id).unwrap();
      toast.success(res.message || "Lead deleted successfully");
      setOpenPopoverId(null);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to delete lead");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium">Leads Management</h1>
          <p className="text-muted-foreground text-sm">
            View, organize, and manage all your leads. Expand any lead to review
            and manage its notes.
          </p>
        </div>
        <Button onClick={handleOpenCreateLead} className="w-fit">
          <Plus className="size-4" />
          <span>Add Lead</span>
        </Button>
      </div>

      <div className="space-y-4">
        <SearchForm
          onChange={(e) => handleSearchChange(e.target.value ?? "")}
          className="w-full max-w-sm px-0!"
        />

        <div className="grid border rounded-md">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-10 px-2"></TableHead>
                <TableHead className="w-40">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-40">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isFetching ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-muted-foreground"
                  >
                    Loading leads...
                  </TableCell>
                </TableRow>
              ) : leadsList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No leads found
                  </TableCell>
                </TableRow>
              ) : (
                leadsList.map((lead, index) => {
                  const leadId = (lead.id ?? lead._id) as string | number;
                  const isExpanded = !!leadId && expandedLeadIds.includes(leadId);
                  return (
                    <Fragment key={leadId || index}>
                      <TableRow
                        className={cn(isExpanded && "bg-muted/15 border-b-0")}
                      >
                        <TableCell className="w-10 px-2 text-center">
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            onClick={() => leadId && toggleExpandLead(leadId)}
                            title={
                              isExpanded ? "Collapse notes" : "Expand notes"
                            }
                          >
                            <ChevronRight
                              className={cn(
                                "size-4 transition-transform duration-200",
                                isExpanded && "rotate-90",
                              )}
                            />
                            <span className="sr-only">Toggle notes</span>
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">
                          {lead.name}
                        </TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.phone || "-"}</TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                            )}
                          >
                            {lead.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {lead.createdAt
                            ? format(new Date(lead.createdAt), "dd-MM-yyyy")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Button
                              size={"icon-sm"}
                              variant={isExpanded ? "secondary" : "outline"}
                              onClick={() => leadId && toggleExpandLead(leadId)}
                              title={isExpanded ? "Hide Notes" : "View Notes"}
                            >
                              <FileText className="size-4" />
                              <span className="sr-only">Notes</span>
                            </Button>
                            <Button
                              size={"icon-sm"}
                              variant={"outline"}
                              onClick={() => handleOpenEditLead(lead)}
                              title="Edit lead"
                            >
                              <Edit className="size-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Popover
                              open={Boolean(leadId && openPopoverId === leadId)}
                              onOpenChange={(open) => {
                                setOpenPopoverId(open && leadId ? leadId : null);
                              }}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  size={"icon-sm"}
                                  variant={"destructive"}
                                  disabled={isDeletingLead}
                                  title="Delete lead"
                                >
                                  <Trash2 className="size-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-62">
                                <p className="mb-2 text-sm">
                                  Are you sure you want to delete this lead?
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                  <Button
                                    size={"sm"}
                                    variant={"outline"}
                                    onClick={() => setOpenPopoverId(null)}
                                    disabled={isDeletingLead}
                                  >
                                    No
                                  </Button>
                                  <Button
                                    size={"sm"}
                                    variant={"destructive"}
                                    onClick={() =>
                                      leadId && handleDeleteLead(leadId)
                                    }
                                    disabled={isDeletingLead}
                                  >
                                    {isDeletingLead && openPopoverId === leadId
                                      ? "Deleting..."
                                      : "Yes"}
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Sub-table row for Notes */}
                      {isExpanded && (
                        <TableRow
                          key={`${leadId}-notes-row`}
                          className="hover:bg-transparent"
                        >
                          <TableCell
                            colSpan={7}
                            className="bg-muted/20 px-6 py-3"
                          >
                            <LeadNotesSubTable lead={lead} />
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        <div className="border-t py-2 sm:py-4">
          <TablePagination
            pageIndex={pageIndex}
            pageCount={pageCount}
            onPageChange={(newPageIndex) => setPageIndex(newPageIndex)}
            nextPage={() =>
              setPageIndex((prev) => Math.min(prev + 1, pageCount))
            }
            previousPage={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
            firstPage={() => setPageIndex(1)}
            lastPage={() => setPageIndex(pageCount)}
          />
        </div>
      </div>

      {/* Dialog for Lead Create and Edit */}
      <Dialog open={isLeadDialogOpen} onOpenChange={setIsLeadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedLead ? "Edit Lead" : "Create Lead"}
            </DialogTitle>
            <DialogDescription>
              {selectedLead
                ? "Update the lead details and current status."
                : "Fill in the details to add a new lead to the system."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={leadForm.handleSubmit(onLeadSubmit)}
            className="space-y-4"
          >
            <FieldGroup>
              {/* Name */}
              <Field>
                <Controller
                  name="name"
                  control={leadForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="lead-name">Name</FieldLabel>
                      <Input
                        {...field}
                        id="lead-name"
                        placeholder="e.g. John Doe"
                        autoComplete="off"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </Field>

              {/* Email */}
              <Field>
                <Controller
                  name="email"
                  control={leadForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="lead-email">Email</FieldLabel>
                      <Input
                        {...field}
                        id="lead-email"
                        type="email"
                        placeholder="john@example.com"
                        autoComplete="off"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </Field>

              {/* Phone */}
              <Field>
                <Controller
                  name="phone"
                  control={leadForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="lead-phone">Phone</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        id="lead-phone"
                        placeholder="+1-555-0100"
                        autoComplete="off"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </Field>

              {/* Status */}
              <Field>
                <Controller
                  name="status"
                  control={leadForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="lead-status">Status</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="lead-status"
                          className="w-full capitalize"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {LEAD_STATUS_OPTIONS.map((status) => (
                            <SelectItem
                              key={status}
                              value={status}
                              className="capitalize"
                            >
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                  onClick={() => setIsLeadDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreatingLead || isUpdatingLead}
                >
                  {selectedLead
                    ? isUpdatingLead
                      ? "Updating..."
                      : "Update Lead"
                    : isCreatingLead
                      ? "Creating..."
                      : "Create Lead"}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leads;
