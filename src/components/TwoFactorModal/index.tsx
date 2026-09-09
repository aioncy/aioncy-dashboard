import { useEffect, useRef, useState } from "react";
import Modal from "../Modal";
import Button from "../Button";
import styles from "./TwoFactorModal.module.scss";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 45;

export interface TwoFactorModalProps {
  email: string;
  onClose: () => void;
  onConfirm: (code: string) => void;
}

const formatCountdown = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const TwoFactorModal = ({ email, onClose, onConfirm }: TwoFactorModalProps) => {
  const [digits, setDigits] = useState<string[]>(
    Array(CODE_LENGTH).fill(""),
  );
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const code = digits.join("");
  const isComplete = code.length === CODE_LENGTH;

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < CODE_LENGTH - 1) focusInput(index + 1);
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault();
      setDigits((prev) => {
        const next = [...prev];
        next[index - 1] = "";
        return next;
      });
      focusInput(index - 1);
    }
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
    }
    if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (
    index: number,
    event: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH - index);
    if (!pasted) return;
    event.preventDefault();
    setDigits((prev) => {
      const next = [...prev];
      pasted.split("").forEach((digit, offset) => {
        next[index + offset] = digit;
      });
      return next;
    });
    focusInput(Math.min(index + pasted.length, CODE_LENGTH - 1));
  };

  const handleResend = () => {
    setDigits(Array(CODE_LENGTH).fill(""));
    setSecondsLeft(RESEND_SECONDS);
    focusInput(0);
  };

  const renderDigits = (from: number, to: number) =>
    digits.slice(from, to).map((digit, offset) => {
      const index = from + offset;
      return (
        <input
          key={index}
          ref={(node) => {
            inputRefs.current[index] = node;
          }}
          className={styles.codeInput}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="0"
          maxLength={1}
          value={digit}
          aria-label={`Digit ${index + 1}`}
          autoFocus={index === 0}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={(e) => handlePaste(index, e)}
        />
      );
    });

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Two factor authentication"
      width={459}
      radius={8}
    >
      <div className={styles.body}>
        <p className={styles.intro}>
          <span>
            We've sent a 6-digit verification code to{" "}
            <span className={styles.introEmail}>{email}</span>
          </span>
          <span>Enter the code below to continue.</span>
        </p>

        <div className={styles.codeGroup}>
          <span className={styles.label}>Secure code</span>
          <div className={styles.codeRow}>
            {renderDigits(0, CODE_LENGTH / 2)}
            <span className={styles.codeDash} aria-hidden="true" />
            {renderDigits(CODE_LENGTH / 2, CODE_LENGTH)}
          </div>
        </div>

        {secondsLeft > 0 ? (
          <span className={styles.resend}>
            Didn't receive a code?{" "}
            <span className={styles.timer}>{formatCountdown(secondsLeft)}</span>
          </span>
        ) : (
          <span className={styles.resend}>
            Didn't receive a code?{" "}
            <button
              type="button"
              className={styles.resendButton}
              onClick={handleResend}
            >
              Resend code
            </button>
          </span>
        )}

        <div className={styles.footer}>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={!isComplete}
            onClick={() => onConfirm(code)}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TwoFactorModal;
