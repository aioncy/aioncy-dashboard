import { useEffect, useState } from "react";
import { Clock4 } from "lucide-react";
import Modal from "../Modal";
import {
  QR_EXPIRY_SECONDS,
  formatRupees,
  type CreditPackage,
} from "../../lib/billing";
import styles from "./ScanPayModal.module.scss";

export interface ScanPayModalProps {
  creditPackage: CreditPackage;
  onClose: () => void;
}

const formatCountdown = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const ScanPayModal = ({ creditPackage, onClose }: ScanPayModalProps) => {
  const [secondsLeft, setSecondsLeft] = useState(QR_EXPIRY_SECONDS);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // The QR code is only valid for a limited window; close once it lapses.
  useEffect(() => {
    if (secondsLeft === 0) onClose();
  }, [secondsLeft, onClose]);

  return (
    <Modal
      isOpen
      onClose={onClose}
      ariaLabel="Scan and pay"
      className={styles.panel}
      overlayClassName={styles.overlay}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Scan and pay</h2>
        <p className={styles.subtitle}>Scan the QR code with your banking app</p>
      </div>

      <div className={styles.body}>
        <div className={styles.content}>
          <div className={styles.summary}>
            <div className={styles.item}>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>AI Credits</span>
                <span className={styles.itemDetail}>
                  {creditPackage.credits} credits, one-time top-up
                </span>
              </div>
              <span className={styles.itemQuantity}>
                {creditPackage.credits}
              </span>
            </div>

            <div className={styles.total}>
              <span className={styles.totalLabel}>Total amount</span>
              <span className={styles.totalAmount}>
                {formatRupees(creditPackage.price)}
              </span>
            </div>
          </div>

          <div className={styles.qrColumn}>
            <img
              src="/billing/qr-code.png"
              alt={`QR code to pay ${formatRupees(creditPackage.price)}`}
              className={styles.qr}
              width={220}
              height={220}
            />
          </div>
        </div>

        <p className={styles.expiry} role="timer" aria-live="off">
          <Clock4 size={16} aria-hidden="true" />
          Expires in {formatCountdown(secondsLeft)}
        </p>
      </div>
    </Modal>
  );
};

export default ScanPayModal;
