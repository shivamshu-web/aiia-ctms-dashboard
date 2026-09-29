import { useState, useEffect } from 'react';
import { MetricStats } from '@/types';

export function useMetrics() {
  const [metrics, setMetrics] = useState<MetricStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/safety-reports')
      .then((res) => res.json())
      .then((data) => setMetrics(data.metrics))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return { metrics, loading };
}
