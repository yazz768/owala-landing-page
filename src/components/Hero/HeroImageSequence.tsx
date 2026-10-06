"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styles from "./Hero.module.css";
import {
  createFrameSequence,
  type FrameSequenceHandle,
} from "./imageSequence";

export interface HeroImageSequenceHandle {
  setFrame: (index: number) => void;
  forceRender: () => void;
  totalFrames: number;
}

interface HeroImageSequenceProps {
  basePath: string;
  frameCount: number;
  padding?: number;
  extension?: string;
  onProgress?: (loaded: number, total: number) => void;
  onReady?: () => void;
}

const HeroImageSequence = forwardRef<
  HeroImageSequenceHandle,
  HeroImageSequenceProps
>(function HeroImageSequence(
  {
    basePath,
    frameCount,
    padding = 5,
    extension = "png",
    onProgress,
    onReady,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const seqRef = useRef<FrameSequenceHandle | null>(null);

  const pendingFrameRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const lastDrawnRef = useRef<number>(-1);
  const currentImageRef = useRef<HTMLImageElement | null>(null);
  const dprRef = useRef<number>(1);

  const [ready, setReady] = useState(false);

  // keep latest callbacks without re-running the main effect
  const progressRef = useRef(onProgress);
  const readyRef = useRef(onReady);
  useEffect(() => {
    progressRef.current = onProgress;
  }, [onProgress]);
  useEffect(() => {
    readyRef.current = onReady;
  }, [onReady]);

  /** Draw an image into canvas with "contain" fit + DPR scaling. */
  const draw = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Display size = CSS box of canvas (controlled by .canvas { width:100%; height:100% }).
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (cw === 0 || ch === 0) return;

    const dpr = dprRef.current;
    const targetW = Math.round(cw * dpr);
    const targetH = Math.round(ch * dpr);

    // Set drawing buffer only. NEVER set canvas.style.* — CSS owns display size.
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    if (!imgW || !imgH) return;

    const scale = Math.min(targetW / imgW, targetH / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const dx = (targetW - drawW) / 2;
    const dy = (targetH - drawH) / 2;

    ctx.clearRect(0, 0, targetW, targetH);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";  // ← balikin
    ctx.drawImage(img, dx, dy, drawW, drawH);
  };

  /** Nearest-available-frame lookup: fallback if a frame failed. */
  const findNearestLoaded = (index: number): HTMLImageElement | null => {
    const seq = seqRef.current;
    if (!seq) return null;
    const direct = seq.getFrame(index);
    if (direct) return direct;
    for (let d = 1; d < frameCount; d++) {
      const a = seq.getFrame(index - d);
      if (a) return a;
      const b = seq.getFrame(index + d);
      if (b) return b;
    }
    return null;
  };

  /** Pending-frame scheduler: rAF coalesces rapid scroll updates. */
  /** Pending-frame scheduler: rAF coalesces rapid scroll updates. */
  const requestFrame = (index: number) => {
    pendingFrameRef.current = index;
    if (rafRef.current !== null) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      const i = pendingFrameRef.current;
      if (i === lastDrawnRef.current) return;
      const img = findNearestLoaded(i);
      if (!img) return;
      lastDrawnRef.current = i;
      currentImageRef.current = img;
      draw(img);
    });
  };

  useImperativeHandle(
    ref,
    () => ({
      setFrame(index: number) {
        const clamped = Math.max(
          0,
          Math.min(frameCount - 1, Math.round(index))
        );
        requestFrame(clamped);
      },
      forceRender() {
        const img = currentImageRef.current ?? findNearestLoaded(0);
        if (img) draw(img);
      },
      totalFrames: frameCount,
    }),
    [frameCount]
  );

  useEffect(() => {
    dprRef.current = Math.min(window.devicePixelRatio || 1, 2);

    const seq = createFrameSequence({
      basePath,
      frameCount,
      padding,
      extension,
    });
    seqRef.current = seq;

    seq.load(
      (loaded, total) => progressRef.current?.(loaded, total),
      () => {
        setReady(true);
        const first = seq.getFrame(0);
        if (first) {
          currentImageRef.current = first;
          lastDrawnRef.current = 0;
          draw(first);
        }
        readyRef.current?.();
      }
    );

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            dprRef.current = Math.min(window.devicePixelRatio || 1, 2);
            const img = currentImageRef.current;
            if (img) draw(img);
          })
        : null;
    if (ro && containerRef.current) ro.observe(containerRef.current);

    const onWinResize = () => {
      dprRef.current = Math.min(window.devicePixelRatio || 1, 2);
      const img = currentImageRef.current;
      if (img) draw(img);
    };
    window.addEventListener("resize", onWinResize);

    return () => {
      window.removeEventListener("resize", onWinResize);
      ro?.disconnect();
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      seq.destroy();
      seqRef.current = null;
      currentImageRef.current = null;
    };
  }, [basePath, frameCount, padding, extension]);

  return (
    <div
      ref={containerRef}
      className={styles.canvasWrap}
      data-ready={ready ? "true" : "false"}
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
    </div>
  );
});

export default HeroImageSequence;