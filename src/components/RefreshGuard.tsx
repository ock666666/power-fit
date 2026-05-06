import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RefreshGuard() {
  const location = useLocation();

  useEffect(() => {
    // On fresh page load, always redirect to hero page
    if (location.pathname !== '/') {
      window.location.replace('/');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
