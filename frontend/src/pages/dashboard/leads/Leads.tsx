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
import { Edit, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Leads = () => {
  const { query, handleSearch } = useDebounce();
  console.log(query, "query");
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-medium">Leads Management</h1>
        <p>
          View, organize, and manage all your leads. Track their status with
          notes.
        </p>
      </div>
      <div className="space-y-4">
        <SearchForm
          onChange={(e) => handleSearch(e.target.value ?? "")}
          className="w-full max-w-sm px-0!"
        />

        <div className="grid border rounded-md">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell>$250.00</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size={"icon"}>
                      <Edit />
                      <span className="sr-only">Edit</span>
                    </Button>
                    {/* ! - We can make this popover delete confirmation component as a common component for re-use */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size={"icon"} variant={"destructive"}>
                          <Trash2 />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-62">
                        <p>Are you sure you want to delete this user?</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button size={"sm"} variant={"outline"}>
                            No
                          </Button>
                          <Button size={"sm"} variant={"destructive"}>
                            Yes
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="border-t py-2 sm:py-4">
          <TablePagination
            pageIndex={1}
            pageSize={10}
            total={20}
            pageCount={2}
            onPageChange={console.log}
            nextPage={console.log}
            previousPage={console.log}
            firstPage={console.log}
            lastPage={console.log}
          />
        </div>
      </div>
    </div>
  );
};

export default Leads;
