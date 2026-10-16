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
import { useGetUsersQuery, useDeleteUserMutation } from "@/store/rtk/usersApi";
import { format } from "date-fns";
const Users = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const { query, handleSearch } = useDebounce();
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);

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
  const usersList = data?.data ?? [];
  const pageCount = data?.totalPages ?? 1;

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Delete
  const handleDeleteUser = async (id: number) => {
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
        <p>Manage users, review details.</p>
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
                usersList.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.gender}</TableCell>
                    <TableCell>
                      {format(new Date(user.createdAt), "dd-MM-yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Popover
                          open={openPopoverId === user.id}
                          onOpenChange={(open) =>
                            setOpenPopoverId(open ? user.id : null)
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
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={isDeleting}
                              >
                                {isDeleting && openPopoverId === user.id
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
    </div>
  );
};

export default Users;
