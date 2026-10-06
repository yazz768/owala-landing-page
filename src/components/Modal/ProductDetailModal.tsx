"use client";

import Modal from "./Modal";
import styles from "./Modal.module.css";
import { PRODUCT_DETAIL } from "@/lib/productInfo";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ open, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} eyebrow="Details" ariaLabel="Product details">
      <h2 className={styles.title}>{PRODUCT_DETAIL.name}</h2>
      <p className={styles.tagline}>{PRODUCT_DETAIL.tagline}</p>
      <p className={styles.paragraph}>{PRODUCT_DETAIL.description}</p>

      <h3 className={styles.sectionTitle}>Highlights</h3>
      <div className={styles.highlights}>
        {PRODUCT_DETAIL.highlights.map((h) => (
          <div key={h.title} className={styles.highlight}>
            <h4 className={styles.highlightTitle}>{h.title}</h4>
            <p className={styles.highlightBody}>{h.body}</p>
          </div>
        ))}
      </div>

      <h3 className={styles.sectionTitle}>Specifications</h3>
      <div className={styles.specs}>
        {PRODUCT_DETAIL.specs.map((s) => (
          <div key={s.label} className={styles.specRow}>
            <span className={styles.specLabel}>{s.label}</span>
            <span className={styles.specValue}>{s.value}</span>
          </div>
        ))}
      </div>

      <h3 className={styles.sectionTitle}>Available Sizes</h3>
      <div className={styles.sizes}>
        {PRODUCT_DETAIL.sizes.map((sz) => (
          <div key={sz.label} className={styles.sizeCard}>
            <span className={styles.sizeLabel}>{sz.label}</span>
            <span className={styles.sizeDim}>
              {sz.height} H · {sz.diameter} Ø
            </span>
          </div>
        ))}
      </div>

      <p className={styles.disclaimer}>{PRODUCT_DETAIL.disclaimer}</p>
    </Modal>
  );
}