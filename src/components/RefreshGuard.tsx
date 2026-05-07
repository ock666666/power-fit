import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RefreshGuard() {
  const location = useLocation();

  useEffect(() => {
    // On fresh page load, redirect to hero page if not already there
    if (location.pathname !== '/' && location.pathname !== '/power-fit') {
      window.location.replace('/power-fit/');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
