import { useState } from "react";
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
import { Edit, Plus, Trash2 } from "lucide-react";
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

const Leads = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;
  const { query, handleSearch } = useDebounce();
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);

  // Dialog state for Create / Edit
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);

  const handleSearchChange = (value: string) => {
    handleSearch(value);
    setPageIndex(1);
  };

  // RTK Query hooks
  const { data, isLoading, isFetching } = useGetLeadsQuery({
    page: pageIndex,
    perPage: pageSize,
    query,
  });

  const [createLead, { isLoading: isCreating }] = useCreateLeadMutation();
  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();
  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();

  const leadsList = data?.data ?? [];
  const pageCount = data?.totalPages ?? 1;

  // React Hook Form
  const form = useForm<LeadFormSchemaType>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: "new",
    },
  });

  const handleOpenCreate = () => {
    setSelectedLead(null);
    form.reset({
      name: "",
      email: "",
      phone: "",
      status: "new",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (lead: LeadData) => {
    setSelectedLead(lead);
    const validStatus = (LEAD_STATUS_OPTIONS as readonly string[]).includes(
      lead.status,
    )
      ? (lead.status as LeadFormSchemaType["status"])
      : "new";

    form.reset({
      name: lead.name,
      email: lead.email,
      phone: lead.phone ?? "",
      status: validStatus,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (formData: LeadFormSchemaType) => {
    try {
      if (selectedLead) {
        const res = await updateLead({
          id: selectedLead.id,
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
      setIsDialogOpen(false);
      form.reset();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Operation failed");
    }
  };

  const handleDeleteLead = async (id: number) => {
    try {
      const res = await deleteLead(id).unwrap();
      toast.success(res.message || "Lead deleted successfully");
      setOpenPopoverId(null);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to delete lead");
    }
  };

  const formatDate = (dateString?: string | number | Date) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
      case "contacted":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";
      case "qualified":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
      case "lost":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium">Leads Management</h1>
          <p className="text-muted-foreground text-sm">
            View, organize, and manage all your leads. Track their status with
            notes.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="w-fit">
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
                <TableHead className="w-[150px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isFetching ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-muted-foreground"
                  >
                    Loading leads...
                  </TableCell>
                </TableRow>
              ) : leadsList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No leads found
                  </TableCell>
                </TableRow>
              ) : (
                leadsList.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone || "-"}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                          getStatusBadgeClass(lead.status),
                        )}
                      >
                        {lead.status}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(lead.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size={"icon"}
                          variant={"outline"}
                          onClick={() => handleOpenEdit(lead)}
                        >
                          <Edit />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Popover
                          open={openPopoverId === lead.id}
                          onOpenChange={(open) =>
                            setOpenPopoverId(open ? lead.id : null)
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              size={"icon"}
                              variant={"destructive"}
                              disabled={isDeleting}
                            >
                              <Trash2 />
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
                                disabled={isDeleting}
                              >
                                No
                              </Button>
                              <Button
                                size={"sm"}
                                variant={"destructive"}
                                onClick={() => handleDeleteLead(lead.id)}
                                disabled={isDeleting}
                              >
                                {isDeleting && openPopoverId === lead.id
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

      {/* Dialog for Create and Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FieldGroup>
              {/* Name */}
              <Field>
                <Controller
                  name="name"
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {selectedLead
                    ? isUpdating
                      ? "Updating..."
                      : "Update Lead"
                    : isCreating
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
