import { useRef, useState } from "react";

const useDebounce = () => {
  const [query, setQuery] = useState("");

  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (value: string) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => {
      setQuery(value);
    }, 700);
  };

  return { query, setQuery, handleSearch };
};

export default useDebounce;
