/**
 * Reusable image-sequence loader.
 * Menyimpan frame sebagai HTMLImageElement di memory, sekali load, di-reuse.
 */

export interface FrameSequenceOptions {
  basePath: string;
  frameCount: number;
  padding?: number;
  extension?: string;
}

export interface FrameSequenceHandle {
  readonly frames: HTMLImageElement[];
  readonly loadedCount: number;
  readonly failedCount: number;
  load: (
    onProgress?: (loaded: number, total: number) => void,
    onFirstFrame?: () => void
  ) => void;
  destroy: () => void;
  getFrame: (index: number) => HTMLImageElement | null;
}

export function getFrameUrl(
  basePath: string,
  index: number,
  padding = 5,
  extension = "png"
): string {
  const num = (index + 1).toString().padStart(padding, "0");
  return `${basePath}/${num}.${extension}`;
}

export function createFrameSequence(
  opts: FrameSequenceOptions
): FrameSequenceHandle {
  const { basePath, frameCount, padding = 5, extension = "png" } = opts;

  const frames: HTMLImageElement[] = new Array(frameCount);
  let loadedCount = 0;
  let failedCount = 0;
  let destroyed = false;
  let firstFrameFired = false;

  let progressCb: ((loaded: number, total: number) => void) | null = null;
  let firstFrameCb: (() => void) | null = null;

  const fireProgress = () => {
    if (destroyed) return;
    progressCb?.(loadedCount, frameCount);
    if (!firstFrameFired && frames[0] && frames[0].naturalWidth > 0) {
      firstFrameFired = true;
      firstFrameCb?.();
    }
  };

  const loadOne = (index: number): Promise<void> =>
    new Promise((resolve) => {
      if (destroyed) return resolve();
      const img = new Image();
      img.decoding = "async";
      const url = getFrameUrl(basePath, index, padding, extension);

      img.onload = async () => {
        try {
          if (typeof img.decode === "function") {
            await img.decode().catch(() => undefined);
          }
        } catch {
          /* noop */
        }
        frames[index] = img;
        loadedCount++;
        fireProgress();
        resolve();
      };

      img.onerror = () => {
        failedCount++;
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn(`[HeroImageSequence] failed to load frame ${index + 1}`);
        }
        frames[index] = undefined as unknown as HTMLImageElement;
        fireProgress();
        resolve();
      };

      img.src = url;
    });

  const load = (
    onProgress?: (loaded: number, total: number) => void,
    onFirstFrame?: () => void
  ) => {
    progressCb = onProgress ?? null;
    firstFrameCb = onFirstFrame ?? null;

    // PHASE A — eager load (8 frame awal, parallel)
    const eager = Math.min(8, frameCount);
    const eagerPromises: Promise<void>[] = [];
    for (let i = 0; i < eager; i++) eagerPromises.push(loadOne(i));

    // PHASE B+C — sisa frame, batch + idle scheduling
    const startRest = () => {
      const batchSize = 8;
      let i = eager;
      const pump = () => {
        if (destroyed || i >= frameCount) return;
        const batch: Promise<void>[] = [];
        for (let b = 0; b < batchSize && i < frameCount; b++, i++) {
          batch.push(loadOne(i));
        }
        Promise.all(batch).then(() => {
          if (destroyed) return;
          type IdleWindow = Window & {
            requestIdleCallback?: (
              cb: () => void,
              opts?: { timeout?: number }
            ) => number;
          };
          const w = window as IdleWindow;
          if (typeof w.requestIdleCallback === "function") {
            w.requestIdleCallback(pump, { timeout: 200 });
          } else {
            window.setTimeout(pump, 16);
          }
        });
      };
      pump();
    };

    Promise.all(eagerPromises).then(() => {
      if (!destroyed) startRest();
    });
  };

  const destroy = () => {
    destroyed = true;
    progressCb = null;
    firstFrameCb = null;
    for (let i = 0; i < frames.length; i++) {
      const f = frames[i];
      if (f) {
        f.onload = null;
        f.onerror = null;
      }
    }
    frames.length = 0;
  };

  const getFrame = (index: number): HTMLImageElement | null => {
    if (index < 0 || index >= frameCount) return null;
    return frames[index] ?? null;
  };

  return {
    frames,
    get loadedCount() {
      return loadedCount;
    },
    get failedCount() {
      return failedCount;
    },
    load,
    destroy,
    getFrame,
  };
}