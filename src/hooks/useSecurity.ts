
import { useEffect, useRef } from 'react';

interface SecurityConfig {
  antiRightClick: boolean;
  antiCopy: boolean;
  antiDevTools: boolean;
  antiDebug: boolean;
  alertMessage?: string;
}

export const useSecurity = (config: SecurityConfig) => {
  const devToolsOpenRef = useRef(false);
  const alertShownRef = useRef(false);

  useEffect(() => {
    const showSecurityAlert = () => {
      if (!alertShownRef.current) {
        console.warn('🔒 Security Alert: Unauthorized access attempt detected!');
        if (config.alertMessage) {
          // Instead of alert, we'll dispatch a custom event
          window.dispatchEvent(new CustomEvent('securityAlert', { 
            detail: { message: config.alertMessage }
          }));
        }
        alertShownRef.current = true;
        setTimeout(() => { alertShownRef.current = false; }, 5000);
      }
    };

    // Anti Right Click
    if (config.antiRightClick) {
      const preventRightClick = (e: MouseEvent) => {
        e.preventDefault();
        showSecurityAlert();
        return false;
      };
      document.addEventListener('contextmenu', preventRightClick);
    }

    // Anti Copy/Paste/Cut
    if (config.antiCopy) {
      const preventCopy = (e: KeyboardEvent) => {
        if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a')) {
          e.preventDefault();
          showSecurityAlert();
          return false;
        }
      };

      const preventSelect = () => {
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
      };

      document.addEventListener('keydown', preventCopy);
      preventSelect();
    }

    // Anti DevTools
    if (config.antiDevTools) {
      const preventDevTools = (e: KeyboardEvent) => {
        // F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+U
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C')) ||
          (e.ctrlKey && e.key === 'u')
        ) {
          e.preventDefault();
          showSecurityAlert();
          return false;
        }
      };

      document.addEventListener('keydown', preventDevTools);

      // DevTools detection
      const detectDevTools = () => {
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
          if (!devToolsOpenRef.current) {
            devToolsOpenRef.current = true;
            showSecurityAlert();
          }
        } else {
          devToolsOpenRef.current = false;
        }
      };

      const interval = setInterval(detectDevTools, 1000);
      
      return () => clearInterval(interval);
    }

    // Anti Debug
    if (config.antiDebug) {
      const antiDebug = () => {
        const start = performance.now();
        debugger;
        const end = performance.now();
        
        if (end - start > 100) {
          showSecurityAlert();
          // Redirect or take action
          window.location.reload();
        }
      };

      const debugInterval = setInterval(antiDebug, 4000);
      return () => clearInterval(debugInterval);
    }

    // Console monitoring
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
      if (!args[0]?.toString().includes('[GEOLOCATION]') && !args[0]?.toString().includes('🔒')) {
        showSecurityAlert();
      }
      originalLog.apply(console, args);
    };

    console.warn = (...args) => {
      if (!args[0]?.toString().includes('🔒')) {
        showSecurityAlert();
      }
      originalWarn.apply(console, args);
    };

    console.error = (...args) => {
      originalError.apply(console, args);
    };

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', () => {});
      document.removeEventListener('keydown', () => {});
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, [config]);

  return {
    isSecured: true
  };
};
