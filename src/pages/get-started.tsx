import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function GetStarted() {
  const router = useRouter();
  useEffect(() => { router.replace('/loans#apply'); }, [router]);
  return null;
}
