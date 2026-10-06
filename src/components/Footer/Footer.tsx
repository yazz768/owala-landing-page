import styles from "./Footer.module.css";
import { FOOTER } from "@/lib/config";

export default function Footer() {
  return (
    <footer className={styles.footer} data-nav-theme="light" aria-label="Footer">
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <span className={styles.brand}>{FOOTER.brand}</span>
          <span className={styles.tagline}>{FOOTER.tagline}</span>
        </div>

        <nav className={styles.links} aria-label="Footer navigation">
          {FOOTER.links.map((link) => (
            <a key={link.label} href={link.href} className={styles.link}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.copyright}>{FOOTER.copyright}</div>
      </div>
    </footer>
  );
}