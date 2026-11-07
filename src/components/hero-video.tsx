"use client";

import { useEffect, useRef, useState } from "react";

export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motionOk, setMotionOk] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMotionOk(!reduce);
    if (reduce) videoRef.current?.pause();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (motionOk) {
      v.play().catch(() => setMotionOk(false));
    } else {
      v.pause();
    }
  }, [motionOk]);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 -z-10 h-full w-full object-cover"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
