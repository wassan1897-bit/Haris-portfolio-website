import { useEffect, useRef, useState } from 'react';
import '../../styles/IntroPreloader.scss';

/**
 * Exact files/ intro — served as-is from /files-intro/ (same HTML/CSS/JS).
 * No branding changes; only postMessage when the original timeline completes.
 */
const IntroPreloader = ({ onComplete }) => {
  const [isDone, setIsDone] = useState(false);
  const [fading, setFading] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const finishedRef = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setFading(true);
      window.setTimeout(() => {
        setIsDone(true);
        onCompleteRef.current?.();
      }, 450);
    };

    const onMessage = (event) => {
      if (event?.data?.type === 'files-intro-complete') finish();
    };

    window.addEventListener('message', onMessage);
    // Safety: never leave the site stuck on intro
    const safety = window.setTimeout(finish, 12000);

    return () => {
      window.removeEventListener('message', onMessage);
      window.clearTimeout(safety);
    };
  }, []);

  if (isDone) return null;

  return (
    <div className={`files-intro${fading ? ' files-intro--fade' : ''}`}>
      <iframe
        title="Intro"
        src="/files-intro/index.html"
        className="files-intro__frame"
      />
    </div>
  );
};

export default IntroPreloader;
