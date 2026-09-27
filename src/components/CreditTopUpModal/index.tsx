import { useState } from "react";
import { CircleAlert, X } from "lucide-react";
import Modal from "../Modal";
import Button from "../Button";
import AlertBar from "../AlertBar";
import {
  CREDIT_PACKAGES,
  DEFAULT_PACKAGE_ID,
  formatRupees,
  type CreditPackage,
} from "../../lib/billing";
import styles from "./CreditTopUpModal.module.scss";

export interface CreditTopUpModalProps {
  onClose: () => void;
  onProceed: (creditPackage: CreditPackage) => void;
}

const CreditTopUpModal = ({ onClose, onProceed }: CreditTopUpModalProps) => {
  const [selectedId, setSelectedId] = useState(DEFAULT_PACKAGE_ID);
  const selected = CREDIT_PACKAGES.find((pkg) => pkg.id === selectedId);

  return (
    <Modal
      isOpen
      onClose={onClose}
      ariaLabel="Credit top-up"
      className={styles.panel}
      overlayClassName={styles.overlay}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Credit top-up</h2>
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Close"
          onClick={onClose}
        >
          <X size={16} />
        </button>
      </div>

      <AlertBar
        className={styles.alert}
        icon={<CircleAlert size={20} color="#6155f5" />}
        message={
          <span className={styles.alertText}>
            Top-up credits never expire, even after your subscription ends.
          </span>
        }
      />

      <div className={styles.body}>
        <fieldset className={styles.packages}>
          <legend className={styles.label}>Select package</legend>
          <div className={styles.grid}>
            {CREDIT_PACKAGES.map((pkg) => {
              const isSelected = pkg.id === selectedId;
              return (
                <label
                  key={pkg.id}
                  className={`${styles.card} ${isSelected ? styles.cardSelected : ""}`}
                >
                  <input
                    type="radio"
                    name="credit-package"
                    value={pkg.id}
                    checked={isSelected}
                    onChange={() => setSelectedId(pkg.id)}
                    className={styles.radioInput}
                  />
                  <span
                    className={`${styles.radio} ${isSelected ? styles.radioSelected : ""}`}
                    aria-hidden="true"
                  >
                    {isSelected && (
                      <img
                        src="/billing/radio-indicator.svg"
                        alt=""
                        width={12}
                        height={12}
                      />
                    )}
                  </span>
                  <span className={styles.cardText}>
                    <span className={styles.credits}>{pkg.credits} Credits</span>
                    <span className={styles.price}>{formatRupees(pkg.price)}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className={styles.footer}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={styles.outlineButton}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={!selected}
            onClick={() => selected && onProceed(selected)}
          >
            Proceed to pay
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreditTopUpModal;
