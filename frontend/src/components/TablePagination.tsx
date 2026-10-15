import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";

type PaginationProps = {
  pageIndex: number;
  pageSize: number;
  total: number;
  pageCount: number;

  onPageChange: (pageIndex: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
};

const TablePagination = ({
  pageIndex,
  pageSize,
  total,
  pageCount,
  onPageChange,
  nextPage,
  previousPage,
  firstPage,
  lastPage,
}: PaginationProps) => {
  const totalPages = pageCount;
  const page = pageIndex + 1;
  const start = pageSize * pageIndex + 1;
  const end = Math.min(start + pageSize - 1, total);

  return (
    <div className="w-full space-y-2">
      <Pagination className="w-fit max-sm:mx-0">
        <PaginationContent>
          <PaginationItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size={"icon-sm"}
                  variant={"outline"}
                  onClick={firstPage}
                  disabled={page === 1}
                  aria-label="First page"
                  title="First page"
                >
                  <ChevronFirstIcon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>
                First page
              </TooltipContent>
            </Tooltip>
          </PaginationItem>
          <PaginationItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size={"icon-sm"}
                  variant={"outline"}
                  onClick={previousPage}
                  disabled={page === 1}
                  aria-label="Previous page"
                  title="Previous page"
                >
                  <ChevronLeftIcon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>
                Previous page
              </TooltipContent>
            </Tooltip>
          </PaginationItem>
          {/* Pages */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(Math.max(0, page - 3), page + 2) // windowed pagination
            .map((p) => (
              <PaginationItem key={p + "-page"}>
                <Button
                  type="button"
                  size={"icon-sm"}
                  variant={page === p ? "default" : "outline"}
                  onClick={() => onPageChange(p - 1)}
                >
                  {p}
                </Button>
              </PaginationItem>
            ))}
          <PaginationItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size={"icon-sm"}
                  variant={"outline"}
                  onClick={nextPage}
                  disabled={page === totalPages}
                  aria-label="Next page"
                  title="Next page"
                >
                  <ChevronRightIcon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>
                Next page
              </TooltipContent>
            </Tooltip>
          </PaginationItem>
          <PaginationItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size={"icon-sm"}
                  variant={"outline"}
                  onClick={lastPage}
                  disabled={page === totalPages}
                  aria-label="Last page"
                  title="Last page"
                >
                  <ChevronLastIcon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>
                Last page
              </TooltipContent>
            </Tooltip>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p
        className="text-muted-foreground text-sm whitespace-nowrap text-center"
        aria-live="polite"
      >
        Showing <span>{start}</span> to <span>{end}</span> of{" "}
        <span>{total}</span>
      </p>
    </div>
  );
};

export default TablePagination;
