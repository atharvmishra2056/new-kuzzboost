import { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const TawkToWidget = () => {
  useEffect(() => {
    // Initialize Tawk.to only once
    if (!window.Tawk_API) {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://embed.tawk.to/687f9fdc1786aa1911e6fb9f/1j0p8gtn5';
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      }
    }

    // Cleanup function
    return () => {
      // Optional: You can add cleanup logic here if needed
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default TawkToWidget;
