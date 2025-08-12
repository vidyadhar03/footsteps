'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { logEvent } from 'firebase/analytics';
import { getWebAnalytics } from '@/lib/firebase';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    (async () => {
      const analytics = await getWebAnalytics();
      if (!analytics) return;
      if (!pathname) return;
      const queryString = search?.toString() ?? '';
      const isDebugSession =
        process.env.NODE_ENV !== 'production' ||
        (typeof window !== 'undefined' && window.location.search.includes('firebase_debug=1'));
      logEvent(analytics, 'page_view', {
        page_location: window.location.href,
        page_path: pathname + (queryString ? `?${queryString}` : ''),
        page_title: document.title,
        // Force GA4 DebugView visibility in dev or when ?firebase_debug=1
        debug_mode: isDebugSession,
      });
    })();
  }, [pathname, search]);

  return <>{children}</>;
}


