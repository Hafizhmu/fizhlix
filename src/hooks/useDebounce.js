// hooks/useDebounce.js
import { useState, useEffect } from "react";

export default function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Bersihkan timeout jika value berubah sebelum delay selesai
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
