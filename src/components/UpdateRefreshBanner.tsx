import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

const VERSION_STORAGE_KEY = '711club-site-version';
const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 分钟

async function fetchVersion(): Promise<string | null> {
  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { Pragma: 'no-cache' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.version ?? null;
  } catch {
    return null;
  }
}

const UpdateRefreshBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  const checkUpdate = useCallback(async () => {
    const remote = await fetchVersion();
    if (remote == null) return;
    const local = sessionStorage.getItem(VERSION_STORAGE_KEY);
    if (local != null && local !== remote) {
      setShowBanner(true);
    } else if (local == null) {
      sessionStorage.setItem(VERSION_STORAGE_KEY, remote);
    }
  }, []);

  useEffect(() => {
    checkUpdate();
    const timer = setInterval(checkUpdate, CHECK_INTERVAL_MS);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') checkUpdate();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [checkUpdate]);

  const handleRefresh = () => {
    sessionStorage.removeItem(VERSION_STORAGE_KEY);
    // 通过带时间戳的 URL 强制绕过浏览器缓存，避免 Edge 等仍加载旧页面
    const url = new URL(window.location.href);
    url.searchParams.set('_', String(Date.now()));
    window.location.replace(url.pathname + url.search + url.hash);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* 占位，避免固定条遮挡导航栏 */}
      <div className="h-14 flex-shrink-0" aria-hidden />
      <div
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-4 px-4 py-3 bg-primary-600 text-white shadow-md"
        role="alert"
      >
      <span className="text-body font-medium">
        网站已更新，请刷新以获取最新内容
      </span>
      <button
        type="button"
        onClick={handleRefresh}
        className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-primary-700 shadow-sm hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        <RefreshCw className="h-4 w-4" />
        立即刷新
      </button>
    </div>
    </>
  );
};

export default UpdateRefreshBanner;
