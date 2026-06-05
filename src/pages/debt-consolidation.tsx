import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DebtConsolidationRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/loans');
  }, [router]);
  return null;
}
