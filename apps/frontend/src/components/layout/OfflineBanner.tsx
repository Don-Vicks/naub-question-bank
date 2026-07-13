'use client';

import { IconWifiOff } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

// Unobtrusive strip, not a blocking modal - see design-system.md's states
// section. Downloaded/bookmarked content should keep working underneath it.
export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="flex items-center gap-2 bg-terracotta/10 px-4 py-2 text-xs text-terracotta-text">
      <IconWifiOff size={14} stroke={1.75} />
      Offline — showing downloaded subjects only
    </div>
  );
}
