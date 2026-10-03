import { useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ChartLine,
  Coins,
  Columns3Cog,
  LayoutDashboard,
  Plug,
  TvMinimal,
  UsersRound,
  BrainCircuit,
} from "lucide-react";
import Logo from "../../components/Logo";
import Switch from "../../components/Switch";
import {
  PLANS,
  POPULAR_PLAN_ID,
  YEARLY_DISCOUNT_LABEL,
  type Plan,
  type PlanFeature,
  type PlanFeatureIcon,
} from "../../lib/plans";
import styles from "./PlansPage.module.scss";

const ICON_SIZE = 16;

const FEATURE_ICONS: Record<PlanFeatureIcon, ReactNode> = {
  credits: <Coins size={ICON_SIZE} />,
  members: <UsersRound size={ICON_SIZE} />,
  widget: <TvMinimal size={ICON_SIZE} />,
  dashboard: <LayoutDashboard size={ICON_SIZE} />,
  wingman: <BrainCircuit size={ICON_SIZE} />,
  wingmanMax: (
    <img
      src="/plans/wingman-max.svg"
      alt=""
      className={styles.maxIcon}
      width={14.4}
      height={14.4}
    />
  ),
  integration: <Plug size={ICON_SIZE} />,
  analytics: <ChartLine size={ICON_SIZE} />,
  customize: <Columns3Cog size={ICON_SIZE} />,
};

const PLATFORMS = ["instagram", "whatsapp", "facebook"];

const formatPrice = (amount: number) => `Rs ${amount.toLocaleString("en-US")}`;

const FeatureRow = ({ feature }: { feature: PlanFeature }) => (
  <li className={styles.feature}>
    <div className={styles.featureLine}>
      <span className={styles.featureIcon}>{FEATURE_ICONS[feature.icon]}</span>
      <span
        className={`${styles.featureText} ${feature.underline ? styles.underline : ""} ${
          feature.tooltip ? styles.hasTooltip : ""
        }`}
        tabIndex={feature.tooltip ? 0 : undefined}
      >
        {feature.segments.map((segment, index) => (
          <span key={index} className={segment.strong ? styles.strong : undefined}>
            {segment.text}
          </span>
        ))}
        {feature.tooltip && (
          <span className={styles.tooltip} role="tooltip">
            {feature.tooltip}
          </span>
        )}
      </span>
    </div>
    {feature.platforms && (
      <div className={styles.platforms}>
        {PLATFORMS.map((platform) => (
          <img
            key={platform}
            src={`/plans/${platform}.png`}
            alt={platform}
            className={styles.platform}
            width={16}
            height={16}
          />
        ))}
      </div>
    )}
  </li>
);

interface PlanCardProps {
  plan: Plan;
  yearly: boolean;
  onSelect: (plan: Plan) => void;
}

const PlanCard = ({ plan, yearly, onSelect }: PlanCardProps) => {
  const isPopular = plan.id === POPULAR_PLAN_ID;

  return (
    <article
      className={`${styles.card} ${styles[plan.id]} ${isPopular ? styles.popular : ""}`}
      aria-label={`${plan.name} plan`}
    >
      {isPopular && <span className={styles.badge}>Popular</span>}

      <div className={styles.cardTop}>
        <span className={styles.accent} style={{ background: plan.accent }} />
        <div className={styles.cardHead}>
          <div className={styles.titleBlock}>
            <p className={styles.planName}>{plan.name}</p>
            {plan.price === null ? (
              <p className={styles.priceLabel}>{plan.priceLabel}</p>
            ) : (
              <p className={styles.price}>
                <span className={styles.amount}>
                  {formatPrice(yearly ? plan.price.yearly : plan.price.monthly)}
                </span>
                <span className={styles.period}>{yearly ? "/year" : "/month"}</span>
              </p>
            )}
          </div>

          {plan.ctaVariant === "text" ? (
            <p className={styles.comingSoon}>{plan.cta}</p>
          ) : (
            <button
              type="button"
              className={`${styles.cta} ${plan.ctaVariant === "primary" ? styles.ctaPrimary : ""}`}
              onClick={() => onSelect(plan)}
            >
              {plan.cta}
            </button>
          )}
        </div>
      </div>

      <ul className={styles.features}>
        {plan.features.map((feature, index) => (
          <FeatureRow key={index} feature={feature} />
        ))}
      </ul>
    </article>
  );
};

export function PlansPage() {
  const navigate = useNavigate();
  const [yearly, setYearly] = useState(false);

  const handleSelect = (plan: Plan) => {
    if (plan.id === "enterprise") {
      window.location.href = "mailto:sales@aioncy.com?subject=Aioncy%20Enterprise%20plan";
      return;
    }
    navigate({ to: "/dashboard" });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headline}>
            <Logo className={styles.logo} />
            <h1 className={styles.title}>Choose your plan</h1>
          </div>

          <label className={styles.billing}>
            <Switch
              checked={yearly}
              onChange={setYearly}
              aria-label="Bill yearly"
              className={styles.switch}
            />
            <span className={styles.billingLabel}>Yearly ({YEARLY_DISCOUNT_LABEL})</span>
          </label>
        </header>

        <div className={styles.cards}>
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} yearly={yearly} onSelect={handleSelect} />
          ))}
        </div>
      </div>
    </div>
  );
}
