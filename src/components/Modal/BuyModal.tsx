"use client";

import { useState, type FormEvent } from "react";
import Modal from "./Modal";
import styles from "./Modal.module.css";
import { PRODUCT } from "@/lib/config";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SIZES = ["24 oz", "32 oz", "40 oz"] as const;

export default function BuyModal({ open, onClose }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    // Placeholder: nanti diganti dengan call ke backend / payment gateway.
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSuccess(true);
  };

  const handleClose = () => {
    onClose();
    // reset state setelah animasi close
    window.setTimeout(() => {
      setSuccess(false);
      setSubmitting(false);
    }, 400);
  };

  return (
    <Modal open={open} onClose={handleClose} eyebrow="Checkout" ariaLabel="Buy Owala">
      {success ? (
        <div className={styles.success}>
          <span className={styles.successMark}>✓</span>
          <h2 className={styles.successTitle}>Order received.</h2>
          <p className={styles.successBody}>
            Thank you. We will contact you shortly to confirm your order and
            complete payment.
          </p>
        </div>
      ) : (
        <>
          <h2 className={styles.title}>Complete your order.</h2>
          <p className={styles.tagline}>
            Fill in your details below to continue.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={`${styles.field} ${styles.full}`}>
                <label className={styles.label} htmlFor="buy-name">
                  Full name
                </label>
                <input
                  id="buy-name"
                  name="name"
                  type="text"
                  required
                  className={styles.input}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="buy-email">
                  Email
                </label>
                <input
                  id="buy-email"
                  name="email"
                  type="email"
                  required
                  className={styles.input}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="buy-phone">
                  Phone
                </label>
                <input
                  id="buy-phone"
                  name="phone"
                  type="tel"
                  required
                  className={styles.input}
                  placeholder="+62 812 3456 7890"
                  autoComplete="tel"
                />
              </div>

              <div className={`${styles.field} ${styles.full}`}>
                <label className={styles.label} htmlFor="buy-address">
                  Shipping address
                </label>
                <input
                  id="buy-address"
                  name="address"
                  type="text"
                  required
                  className={styles.input}
                  placeholder="Street, building, unit"
                  autoComplete="street-address"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="buy-city">
                  City
                </label>
                <input
                  id="buy-city"
                  name="city"
                  type="text"
                  required
                  className={styles.input}
                  autoComplete="address-level2"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="buy-zip">
                  Postal code
                </label>
                <input
                  id="buy-zip"
                  name="zip"
                  type="text"
                  required
                  className={styles.input}
                  autoComplete="postal-code"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="buy-size">
                  Size
                </label>
                <select
                  id="buy-size"
                  name="size"
                  required
                  className={styles.select}
                  defaultValue="32 oz"
                >
                  {SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="buy-qty">
                  Quantity
                </label>
                <select
                  id="buy-qty"
                  name="quantity"
                  required
                  className={styles.select}
                  defaultValue="1"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.summary}>
              <span className={styles.summaryLabel}>Total</span>
              <span className={styles.summaryValue}>
                {PRODUCT.currency === "USD" ? `$${PRODUCT.price}` : PRODUCT.price}
              </span>
            </div>

            <button
              type="submit"
              className={styles.submit}
              disabled={submitting}
            >
              {submitting ? "Processing…" : "Place order"}
            </button>
          </form>
        </>
      )}
    </Modal>
  );
}