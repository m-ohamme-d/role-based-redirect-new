import { useState } from "react";
import { generatePerformanceReport } from "@/utils/downloadReport";

/** 
 * Returns { fetch(), loading } to drive report downloads.
 */
export function usePerformanceReport(role: string, id: string) {
  const [loading, setLoading] = useState(false);
  async function fetch() {
    setLoading(true);
    try {
      return await generatePerformanceReport(role, id);
    } finally {
      setLoading(false);
    }
  }
  return { fetch, loading };
}