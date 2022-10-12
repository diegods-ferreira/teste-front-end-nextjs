/**
 * Sources from
 * https://jak-ch-ll.medium.com/next-js-preserve-scroll-history-334cf699802a
 * https://gusruss89.medium.com/next-js-keep-page-components-mounted-between-page-transitions-and-maintain-scroll-position-205b34539a26
 */

import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

const ROUTES_TO_RETAIN = ['/'];

export const usePreserveScroll = () => {
  const router = useRouter();

  const scrollPositions = useRef<{ [url: string]: number }>({});
  const isBack = useRef(false);

  const isRetainableRoute = ROUTES_TO_RETAIN.includes(router.asPath);

  useEffect(() => {
    router.beforePopState(() => {
      isBack.current = true;
      return true;
    });

    const onRouteChangeStart = () => {
      const url = router.pathname;
      scrollPositions.current[url] = window.scrollY;
    }

    const onRouteChangeComplete = (url: any) => {
      if (isBack.current && scrollPositions.current[url] && isRetainableRoute) {
        window.scroll({
          top: scrollPositions.current[url],
          behavior: 'auto'
        });
      }

      isBack.current = false;
    }

    router.events.on('routeChangeStart', onRouteChangeStart);
    router.events.on('routeChangeComplete', onRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart);
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    }
  }, [isRetainableRoute, router])
}