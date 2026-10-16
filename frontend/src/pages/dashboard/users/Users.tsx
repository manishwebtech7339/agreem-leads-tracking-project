import { useState } from "react";
import { toast } from "sonner";
import { SearchForm } from "@/components/SearchForm";
import TablePagination from "@/components/TablePagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDebounce from "@/hooks/useDebounce";
import { Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetCurrentUserQuery,
} from "@/store/rtk/usersApi";
import { format } from "date-fns";
const Users = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const { query, handleSearch } = useDebounce();
  const [openPopoverId, setOpenPopoverId] = useState<string | number | null>(
    null,
  );

  const handleSearchChange = (value: string) => {
    handleSearch(value);
    setPageIndex(1);
  };

  // RTK Query
  const { data, isLoading, isFetching } = useGetUsersQuery({
    page: pageIndex,
    perPage: 10,
    query,
  });
  const { data: currentUserData } = useGetCurrentUserQuery();
  const currentUser = currentUserData?.data;
  const currentUserId = currentUser?.id ?? currentUser?._id;

  const usersList = data?.data ?? [];
  const pageCount = data?.totalPages ?? 1;

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Delete
  const handleDeleteUser = async (id: string | number) => {
    try {
      const res = await deleteUser(id).unwrap();
      toast.success(res.message || "User deleted successfully");
      setOpenPopoverId(null);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-medium">User Management</h1>
        <p className="text-muted-foreground text-sm">
          Manage users, review details.
        </p>
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isFetching ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-muted-foreground"
                  >
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : usersList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                usersList.map((user, index) => {
                  const userId = (user.id ?? user._id) as string | number;
                  const isCurrentUser = Boolean(
                    currentUserId && String(userId) === String(currentUserId),
                  );
                  return (
                    <TableRow key={userId || index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span>{user.name}</span>
                          {isCurrentUser && (
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                              You
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">
                        {user.gender}
                      </TableCell>
                      <TableCell>
                        {user.createdAt
                          ? format(new Date(user.createdAt), "dd-MM-yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isCurrentUser ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span tabIndex={0} className="inline-block">
                                  <Button
                                    size={"icon"}
                                    variant={"destructive"}
                                    disabled={true}
                                    className="opacity-50 cursor-not-allowed"
                                  >
                                    <Trash2 />
                                    <span className="sr-only">
                                      Cannot delete own account
                                    </span>
                                  </Button>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Can&apos;t delete current session account</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <Popover
                              open={Boolean(userId && openPopoverId === userId)}
                              onOpenChange={(open) =>
                                setOpenPopoverId(open && userId ? userId : null)
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
                                  Are you sure you want to delete this user?
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
                                    onClick={() =>
                                      userId && handleDeleteUser(userId)
                                    }
                                    disabled={isDeleting}
                                  >
                                    {isDeleting && openPopoverId === userId
                                      ? "Deleting..."
                                      : "Yes"}
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
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
    </div>
  );
};

export default Users;
