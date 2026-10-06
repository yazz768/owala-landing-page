"use client";

import { useEffect, useRef } from "react";
import type { Feature } from "@/lib/features";
import styles from "./FeatureExperience.module.css";

/** Pilih kelas frame unik per feature number. */
function getFrameClass(stylesMap: Record<string, string>, number: string) {
  switch (number) {
    case "01":
      return stylesMap.frame01;
    case "02":
      return stylesMap.frame02;
    case "03":
      return stylesMap.frame03;
    case "04":
      return stylesMap.frame04;
    default:
      return stylesMap.frame01;
  }
}

export default function FeaturePanel({ feature }: { feature: Feature }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameClass = getFrameClass(
    styles as unknown as Record<string, string>,
    feature.number
  );

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const seek = () => {
      const duration = v.duration;
      if (!duration || !isFinite(duration) || duration <= 0) return;
      const t = Math.min(
        Math.max(feature.seekTime, 0),
        Math.max(0, duration * 0.9)
      );
      try {
        v.currentTime = t;
        v.pause();
      } catch {
        /* noop */
      }
    };

    if (v.readyState >= 1 && v.duration && isFinite(v.duration)) {
      seek();
    } else {
      v.addEventListener("loadedmetadata", seek, { once: true });
    }

    return () => v.removeEventListener("loadedmetadata", seek);
  }, [feature.seekTime]);

  return (
    <article className={styles.panel} data-panel>
      <div className={styles.copy}>
        <div className={styles.meta} data-reveal>
          <span className={styles.number}>{feature.number}</span>
          <span className={styles.eyebrow}>{feature.eyebrow}</span>
        </div>

        <h3 className={styles.title} data-reveal>
          {feature.title}
        </h3>

        <p className={styles.description} data-reveal>
          {feature.description}
        </p>
      </div>

      <div
        className={`${styles.visual} ${frameClass}`}
        data-reveal
        data-frame={feature.number}
      >
        <video
          ref={videoRef}
          className={styles.video}
          src="/videos/video1.mp4"
          muted
          playsInline
          preload="metadata"
          style={{ objectPosition: feature.objectPosition }}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
    </article>
  );
}