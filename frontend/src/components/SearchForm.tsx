import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

export function SearchForm({ ...props }: React.ComponentProps<"input">) {
  return (
    <InputGroup className="w-full max-w-sm gap-2">
      <InputGroupInput placeholder="Search..." {...props} />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
}
