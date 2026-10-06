"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  ariaLabel: string;
  children: ReactNode;
  maxWidth?: number;
}

export default function Modal({
  open,
  onClose,
  eyebrow,
  ariaLabel,
  children,
  maxWidth,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<"closed" | "open">("closed");
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  // Mount/unmount with animation
  useEffect(() => {
    if (open) {
      setState("open");
    } else {
      const t = window.setTimeout(() => setState("closed"), 400);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  // Lock scroll + Lenis + focus management
  useEffect(() => {
    if (!open) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;

    type LenisLike = { stop: () => void; start: () => void };
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
    lenis?.stop();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus first focusable element in the panel
    const focusTimer = window.setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (focusables[0] ?? panel).focus();
    }, 60);

    // ESC to close
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      // Focus trap
      if (e.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) return;
        const focusables = Array.from(
          panel.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled"));
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      lenis?.start();
      lastFocusedRef.current?.focus();
    };
  }, [open, onClose]);

  if (!mounted) return null;
  if (!open && state === "closed") return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  return createPortal(
    <div
      ref={backdropRef}
      className={styles.backdrop}
      data-state={state}
      onClick={handleBackdropClick}
      aria-hidden={!open}
    >
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        style={maxWidth ? { maxWidth } : undefined}
      >
        <div className={styles.header}>
          <span className={styles.eyebrow}>{eyebrow ?? ""}</span>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        <div className={styles.body} data-lenis-prevent>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}