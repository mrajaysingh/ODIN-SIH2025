"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from '../login/login.module.css';

interface BackgroundSliderProps {
  images?: string[];
  videos?: string[];
  interval?: number; // Time in ms for each slide
  fadeMs?: number;
  muted?: boolean;
  loop?: boolean; // when true, loop through provided sources
}

export default function BackgroundSlider({ images = [], videos = [], interval = 5000, fadeMs = 1500, muted = true, loop = true }: BackgroundSliderProps): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoMode] = useState(videos.length > 0);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  useEffect(() => {
    if (!isVideoMode) {
      if (!images.length) return;
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [isVideoMode, images, interval]);

  // For videos, auto-advance when current video ends (or by interval fallback)
  useEffect(() => {
    if (!isVideoMode || videos.length === 0) return;

    const currentVideo = videoRefs.current[currentIndex];
    const handleEnded = () => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    };

    if (currentVideo) {
      currentVideo.removeEventListener('ended', handleEnded);
      currentVideo.addEventListener('ended', handleEnded, { once: true });
    }

    return () => {
      if (currentVideo) currentVideo.removeEventListener('ended', handleEnded);
    };
  }, [isVideoMode, currentIndex, videos, interval]);

  useEffect(() => {
    if (!isVideoMode) return;
    // Ensure only the active video plays
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIndex) {
        // Try to play; browsers may block until user interacts
        try {
          // Always start active video from the beginning
          if (!vid.ended && vid.currentTime !== 0) {
            vid.currentTime = 0;
          }
        } catch {}
        const p = vid.play();
        if (p && typeof p.catch === 'function') {
          p.catch(() => {});
        }
      } else {
        vid.pause();
        try {
          // Reset inactive videos so they start from the beginning next time
          vid.currentTime = 0;
        } catch {}
      }
    });
  }, [isVideoMode, currentIndex]);

  if (!isVideoMode) {
    return (
      <div className={styles.sliderBackground}>
        {images.map((image, index) => (
          <div
            key={image}
            className={`${styles.sliderImage} ${index === currentIndex ? styles.active : ''}`}
            style={{ backgroundImage: `url(${image})`, transitionDuration: `${fadeMs}ms` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.sliderBackground}>
      {videos.map((src, index) => (
        <video
          key={src}
          ref={(el) => (videoRefs.current[index] = el)}
          className={`${styles.sliderVideo} ${index === currentIndex ? styles.active : ''}`}
          src={src}
          muted={muted}
          controls={false}
          playsInline
          autoPlay={index === currentIndex}
          loop={false}
          preload="auto"
        />
      ))}
    </div>
  );
}
