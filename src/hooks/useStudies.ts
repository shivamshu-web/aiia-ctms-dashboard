import { useState, useEffect } from 'react';
import { Study } from '@/types/study';

export function useStudies() {
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/studies')
      .then((res) => res.json())
      .then((data) => setStudies(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return { studies, loading };
}
