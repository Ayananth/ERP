import { useEffect, useState } from "react";
import { getItemDropdowns } from "../api/inventoryApi";

export default function useItemDropdowns() {
  const [dropdowns, setDropdowns] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getItemDropdowns()
      .then(setDropdowns)
      .finally(() => setLoading(false));
  }, []);

  return {
    dropdowns,
    loading,
  };
}