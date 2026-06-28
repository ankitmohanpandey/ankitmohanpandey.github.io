'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function Analytics() {
  useEffect(() => {
    // Google Analytics 4
    if (process.env.NEXT_PUBLIC_GA_ID) {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
      };
      window.gtag('js', new Date());
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID);
    }

    // Microsoft Clarity
    if (process.env.NEXT_PUBLIC_CLARITY_ID) {
      const script = document.createElement('script');
      script.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
      `;
      document.head.appendChild(script);
    }

    // Vercel Analytics
    if (process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID) {
      const script = document.createElement('script');
      script.src = `https://analytics.vercel-scripts.com/${process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID}`;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  return null;
}
