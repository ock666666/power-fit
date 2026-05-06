import { useRef, useEffect, useState } from 'react';
import { motion, type MotionValue } from 'framer-motion';

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4';

export default function VideoBackground({
  videoX,
  videoY,
}: {
  videoX: MotionValue<number>;
  videoY: MotionValue<number>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const handleLoaded = () => setOpacity(1);
    const handleEnded = () => {
      setOpacity(0);
      timeoutId = setTimeout(() => {
        if (video) video.currentTime = 0;
        setOpacity(1);
      }, 600);
    };

    video.addEventListener('loadeddata', handleLoaded);
    video.addEventListener('ended', handleEnded);

    return () => {
      clearTimeout(timeoutId);
      video.removeEventListener('loadeddata', handleLoaded);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <motion.video
      ref={videoRef}
      className="absolute inset-0 h-[110%] w-[110%] -top-[5%] -left-[5%] object-cover"
      muted
      playsInline
      style={{ x: videoX, y: videoY }}
      animate={{ opacity }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      src={VIDEO_SRC}
    />
  );
}
