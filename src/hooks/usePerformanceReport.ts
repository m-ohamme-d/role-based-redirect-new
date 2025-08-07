import { useState } from "react";
import { generatePerformanceReport } from "@/utils/downloadReport";

/** 
 * Returns { fetch(), loading } to drive report downloads.
 */
export function usePerformanceReport(role: string, id: string) {
  const [loading, setLoading] = useState(false);
  async function fetch() {
    console.log("🔍 [usePerformanceReport] Starting fetch with role:", role, "id:", id);
    setLoading(true);
    try {
      const result = await generatePerformanceReport(role, id);
      console.log("🔍 [usePerformanceReport] Generate function returned:", result);
      console.log("🔍 [usePerformanceReport] Result length:", result?.length);
      return result;
    } finally {
      setLoading(false);
    }
  }
  return { fetch, loading };
}