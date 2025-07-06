import { useState } from 'react';
import { generatePerformanceReport } from '@/utils/downloadReport';

export function usePerformanceReport(role: string, userId: string) {
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      return await generatePerformanceReport(role, userId);
    } catch (error) {
      console.error('Error fetching performance report:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { fetch, loading };
}