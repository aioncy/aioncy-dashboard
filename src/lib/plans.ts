export type PlanId = "free" | "essential" | "growth" | "enterprise";

export type PlanFeatureIcon =
  | "credits"
  | "members"
  | "widget"
  | "dashboard"
  | "wingman"
  | "wingmanMax"
  | "integration"
  | "analytics"
  | "customize";

export interface FeatureSegment {
  text: string;
  /** Rendered in the primary text colour instead of the muted one. */
  strong?: boolean;
}

export interface PlanFeature {
  icon: PlanFeatureIcon;
  segments: FeatureSegment[];
  underline?: boolean;
  /** Shows the connected-platform badges under the feature. */
  platforms?: boolean;
  tooltip?: string;
}

export interface Plan {
  id: PlanId;
  name: string;
  accent: string;
  /** Prices in rupees per billing period; null when the plan is priced on request. */
  price: { monthly: number; yearly: number } | null;
  priceLabel?: string;
  cta: string;
  ctaVariant: "outline" | "primary" | "text";
  features: PlanFeature[];
}

export const YEARLY_DISCOUNT_LABEL = "19% off";

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    accent: "#00a242",
    price: { monthly: 0, yearly: 0 },
    cta: "Get started",
    ctaVariant: "outline",
    features: [
      { icon: "credits", segments: [{ text: "20", strong: true }, { text: " Ai credits" }] },
      { icon: "widget", segments: [{ text: "Website widget" }] },
      { icon: "dashboard", segments: [{ text: "Limited dashboard access" }], underline: true },
      { icon: "wingman", segments: [{ text: "Wingman (mini)" }] },
    ],
  },
  {
    id: "essential",
    name: "Essential",
    accent: "#a153ff",
    price: { monthly: 28999, yearly: 30999 },
    cta: "Get started",
    ctaVariant: "primary",
    features: [
      { icon: "credits", segments: [{ text: "200", strong: true }, { text: " Ai credits / month" }] },
      { icon: "members", segments: [{ text: "2 members" }] },
      { icon: "widget", segments: [{ text: "Website widget" }] },
      { icon: "wingman", segments: [{ text: "Wingman (mini)" }] },
      {
        icon: "integration",
        segments: [{ text: "Any " }, { text: "2", strong: true }, { text: " platform integration" }],
        underline: true,
        platforms: true,
        tooltip: "Tool tip here",
      },
      { icon: "dashboard", segments: [{ text: "Full dashboard access" }], underline: true },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    accent: "#ec9a13",
    price: { monthly: 67999, yearly: 67999 },
    cta: "Coming soon",
    ctaVariant: "text",
    features: [
      { icon: "credits", segments: [{ text: "800", strong: true }, { text: " Ai credits / month" }] },
      { icon: "members", segments: [{ text: "8 members" }] },
      { icon: "widget", segments: [{ text: "Website widget" }] },
      {
        icon: "wingmanMax",
        segments: [{ text: "Wingman (" }, { text: "max", strong: true }, { text: ")" }],
      },
      {
        icon: "integration",
        segments: [{ text: "Unlimited platform integration" }],
        underline: true,
        platforms: true,
      },
      { icon: "dashboard", segments: [{ text: "Full dashboard access" }], underline: true },
      { icon: "analytics", segments: [{ text: "Access analytics" }], underline: true },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    accent: "#3888c1",
    price: null,
    priceLabel: "Let’s Talk",
    cta: "Contact sales",
    ctaVariant: "outline",
    features: [{ icon: "customize", segments: [{ text: "Customize your own" }] }],
  },
];

export const POPULAR_PLAN_ID: PlanId = "essential";
