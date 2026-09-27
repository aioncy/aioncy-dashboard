import { useState } from "react";
import { Info } from "lucide-react";
import Button from "../../components/Button";
import CreditTopUpModal from "../../components/CreditTopUpModal";
import ScanPayModal from "../../components/ScanPayModal";
import {
  INVOICES,
  SUBSCRIPTION,
  TOP_UPS,
  formatRupees,
  type CreditPackage,
  type Invoice,
} from "../../lib/billing";
import styles from "./PlanBillingTab.module.scss";

const RING_SIZE = 52;
const RING_STROKE = 5.2;

/** Remaining plan credits, drawn clockwise from 12 o'clock. */
const CreditRing = ({ value }: { value: number }) => {
  const clamped = Math.min(1, Math.max(0, value));
  const center = RING_SIZE / 2;
  const radius = center - RING_STROKE / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg
      width={RING_SIZE}
      height={RING_SIZE}
      viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
      className={styles.ring}
      aria-hidden="true"
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#f7f7f7"
        strokeWidth={RING_STROKE}
      />
      {clamped > 0 && (
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#a153ff"
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
          transform={`rotate(-90 ${center} ${center})`}
        />
      )}
    </svg>
  );
};

const downloadInvoice = (invoice: Invoice) => {
  const contents = [
    "Aioncy invoice",
    `Invoice: ${invoice.id}`,
    `Date: ${invoice.date}`,
    `Description: ${invoice.description}`,
    `Amount: ${formatRupees(invoice.amount)}`,
    `Status: ${invoice.status}`,
  ].join("\n");
  const url = URL.createObjectURL(new Blob([contents], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${invoice.id}.txt`;
  link.click();
  URL.revokeObjectURL(url);
};

const PlanBillingTab = () => {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [paymentPackage, setPaymentPackage] = useState<CreditPackage | null>(
    null,
  );

  const creditsRemaining = Math.max(
    0,
    SUBSCRIPTION.creditsTotal - SUBSCRIPTION.creditsUsed,
  );

  const handleProceed = (creditPackage: CreditPackage) => {
    setIsTopUpOpen(false);
    setPaymentPackage(creditPackage);
  };

  return (
    <div className={styles.billing}>
      <section className={styles.subscription}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Subscription</h2>
          <button type="button" className={styles.changeLink}>
            Change
          </button>
        </div>

        <div className={styles.card}>
          <div className={styles.planBlock}>
            <div className={styles.planRow}>
              <div className={styles.planName}>
                <span className={styles.planLabel}>{SUBSCRIPTION.planName}</span>
                <span className={styles.cyclePill}>
                  {SUBSCRIPTION.billingCycle}
                </span>
              </div>
              <div className={styles.reset}>
                <span className={styles.resetLabel}>Plan credits reset</span>
                <span className={styles.resetBadge}>
                  {SUBSCRIPTION.creditsReset}
                </span>
              </div>
            </div>

            <div className={styles.usageRow}>
              <div className={styles.usage}>
                <CreditRing
                  value={creditsRemaining / SUBSCRIPTION.creditsTotal}
                />
                <div className={styles.usageText}>
                  <span className={styles.creditsRemaining}>
                    {creditsRemaining} credits remaining
                  </span>
                  <span className={styles.creditsUsed}>
                    {SUBSCRIPTION.creditsUsed} of {SUBSCRIPTION.creditsTotal}{" "}
                    used
                  </span>
                </div>
              </div>
              <span className={styles.planPrice}>
                {formatRupees(SUBSCRIPTION.price)}
              </span>
            </div>
          </div>

          {TOP_UPS.length > 0 && (
            <div className={styles.topUps}>
              <h3 className={styles.topUpsTitle}>Top ups</h3>
              <ul className={styles.topUpList}>
                {TOP_UPS.map((topUp) => (
                  <li key={topUp.id} className={styles.topUp}>
                    <div className={styles.topUpUsage}>
                      <div className={styles.topUpMeta}>
                        <span>{topUp.purchasedOn}</span>
                        <span>
                          <span className={styles.topUpCredits}>
                            {topUp.credits}
                          </span>{" "}
                          credits
                        </span>
                      </div>
                      <div
                        className={styles.progressTrack}
                        role="progressbar"
                        aria-label={`Top-up from ${topUp.purchasedOn}`}
                        aria-valuemin={0}
                        aria-valuemax={topUp.credits}
                        aria-valuenow={topUp.creditsRemaining}
                      >
                        <div
                          className={styles.progressFill}
                          style={{
                            width: `${(topUp.creditsRemaining / topUp.credits) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className={styles.topUpRemaining}>
                      {topUp.creditsRemaining} credits remaining
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.cardFooter}>
            <div className={styles.hint}>
              <span>Running low? Top up your credits anytime</span>
              <span
                className={styles.hintIcon}
                title="Top-up credits never expire, even after your subscription ends."
              >
                <Info size={12} color="#484848" aria-hidden="true" />
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={styles.outlineButton}
              onClick={() => setIsTopUpOpen(true)}
            >
              Top-up
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.invoices}>
        <h2 className={styles.sectionTitle}>Invoice</h2>
        <table className={styles.table}>
          <colgroup>
            <col className={styles.colDate} />
            <col />
            <col className={styles.colAmount} />
            <col className={styles.colStatus} />
            <col className={styles.colAction} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className={styles.cellLead}>
                Date
              </th>
              <th scope="col" className={styles.cellLead}>
                Description
              </th>
              <th scope="col">Amount</th>
              <th scope="col">Status</th>
              <th scope="col">
                <span className={styles.srOnly}>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((invoice) => (
              <tr key={invoice.id}>
                <td className={styles.cellLead}>{invoice.date}</td>
                <td className={`${styles.cellLead} ${styles.ellipsis}`}>
                  {invoice.description}
                </td>
                <td>{formatRupees(invoice.amount)}</td>
                <td>
                  <span className={styles.statusBadge}>{invoice.status}</span>
                </td>
                <td className={styles.cellAction}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={styles.outlineButton}
                    onClick={() => downloadInvoice(invoice)}
                  >
                    Download
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {isTopUpOpen && (
        <CreditTopUpModal
          onClose={() => setIsTopUpOpen(false)}
          onProceed={handleProceed}
        />
      )}

      {paymentPackage && (
        <ScanPayModal
          creditPackage={paymentPackage}
          onClose={() => setPaymentPackage(null)}
        />
      )}
    </div>
  );
};

export default PlanBillingTab;
