import { useEffect, useState } from "react";

export const useOrigin = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return "";
  }
  if (typeof window === undefined) return "";
  else {
    const origin =
      window && window?.location.origin ? window.location.origin : "";

    return origin;
  }
};
