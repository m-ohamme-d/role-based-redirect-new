import { useState } from "react";
import { generatePerformanceReport } from "@/utils/downloadReport";

/** 
 * Returns { fetch(), loading } to drive report downloads.
 */
export function usePerformanceReport(role: string, id: string) {
  const [loading, setLoading] = useState(false);
  async function fetch() {
    console.log("[usePerformanceReport] fetch called with role:", role, "id:", id);
    setLoading(true);
    try {
      console.log("[usePerformanceReport] Calling generatePerformanceReport...");
      const result = await generatePerformanceReport(role, id);
      console.log("[usePerformanceReport] generatePerformanceReport result:", result);
      return result;
    } catch (error) {
      console.error("[usePerformanceReport] Error in fetch:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }
  return { fetch, loading };
}