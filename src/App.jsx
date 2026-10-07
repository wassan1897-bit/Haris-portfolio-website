import { useEffect } from 'react';

/**
 * Boot straight into the landing page. The branded intro (/files-intro) is no longer
 * part of the flow; the hero's own cinematic entrance opens the site instead.
 */
export default function App() {
  useEffect(() => {
    window.location.replace('/landing/about.html');
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0a0a0a',
      }}
    />
  );
}
