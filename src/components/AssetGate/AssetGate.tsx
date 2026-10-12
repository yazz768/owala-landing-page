"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createFrameSequence, type FrameSequenceHandle } from "@/components/Hero/imageSequence";
import styles from "./AssetGate.module.css";

type VideoName = "video1" | "video2";
type Assets = {
  sequence: FrameSequenceHandle;
  videos: Record<VideoName, string>;
};

const AssetsContext = createContext<Assets | null>(null);

export function useAssets(): Assets {
  const assets = useContext(AssetsContext);
  if (!assets) throw new Error("Assets must be used inside AssetGate");
  return assets;
}

export function useVideoAsset(name: VideoName): string {
  return useAssets().videos[name];
}

export default function AssetGate({ children }: { children: ReactNode }) {
  const [attempt, setAttempt] = useState(0);
  const [progress, setProgress] = useState(0);
  const [assets, setAssets] = useState<Assets | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    let completedFrames = 0;
    let completedVideos = 0;
    const controller = new AbortController();
    const urls: string[] = [];
    const sequence = createFrameSequence({
      basePath: "/frames",
      frameCount: 240,
      extension: "webp",
    });

    const updateProgress = () => {
      // Frames are about one third of the transfer; the videos make up the rest.
      if (active) setProgress(Math.floor((completedFrames / 240) * 35 + (completedVideos / 2) * 65));
    };

    const framesReady = new Promise<void>((resolve) => {
      sequence.load(
        (loaded) => {
          completedFrames = loaded + sequence.failedCount;
          updateProgress();
        },
        undefined,
        resolve
      );
    });

    const loadVideo = async (name: VideoName) => {
      const response = await fetch(`/videos/${name}.mp4`, { signal: controller.signal });
      if (!response.ok) throw new Error(`Failed to load ${name}`);
      const blob = await response.blob();
      if (!active) return "";
      const url = URL.createObjectURL(blob);
      urls.push(url);
      completedVideos++;
      updateProgress();
      return url;
    };

    Promise.all([framesReady, loadVideo("video1"), loadVideo("video2")])
      .then(([, video1, video2]) => {
        if (!active) return;
        if (sequence.failedCount || sequence.loadedCount !== 240) {
          setError(true);
          return;
        }
        setProgress(100);
        setAssets({ sequence, videos: { video1, video2 } });
      })
      .catch(() => {
        if (active) setError(true);
      });

    return () => {
      active = false;
      controller.abort();
      sequence.destroy();
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [attempt]);

  if (assets) return <AssetsContext.Provider value={assets}>{children}</AssetsContext.Provider>;

  return (
    <div className={styles.screen} role="status" aria-live="polite" aria-busy={!error}>
      <div className={styles.inner}>
        <div className={styles.brand}>OWALA<span className={styles.dot}>.</span></div>
        <div className={styles.bottom}>
          <div className={styles.copy}>
            <span>{error ? "Gagal memuat aset" : "Preparing your experience"}</span>
            <strong>{error ? "--" : `${progress.toString().padStart(2, "0")}%`}</strong>
          </div>
          <div className={styles.track} role="progressbar" aria-label="Loading assets" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className={styles.fill} style={{ width: `${progress}%` }} />
          </div>
          {error && <button className={styles.retry} type="button" onClick={() => { setError(false); setProgress(0); setAttempt((n) => n + 1); }}>Coba lagi</button>}
        </div>
      </div>
    </div>
  );
}
