export interface Subscription {
  planName: string;
  billingCycle: string;
  creditsReset: string;
  creditsTotal: number;
  creditsUsed: number;
  price: number;
}

export interface CreditTopUp {
  id: string;
  purchasedOn: string;
  credits: number;
  creditsRemaining: number;
}

export interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "Paid";
}

export interface CreditPackage {
  id: string;
  credits: number;
  price: number;
}

export const SUBSCRIPTION: Subscription = {
  planName: "Essential plan",
  billingCycle: "Monthly",
  creditsReset: "12 Aug 2026",
  creditsTotal: 100,
  creditsUsed: 20,
  price: 2999,
};

export const TOP_UPS: CreditTopUp[] = [
  {
    id: "top-up-1",
    purchasedOn: "9/19/2026",
    credits: 1000,
    creditsRemaining: 1000,
  },
];

export const INVOICES: Invoice[] = [
  {
    id: "inv-3",
    date: "Jun 18, 2026",
    description: "Credit top-up",
    amount: 999,
    status: "Paid",
  },
  {
    id: "inv-2",
    date: "Jun 12, 2026",
    description: "Essential plan - Monthly",
    amount: 2999,
    status: "Paid",
  },
  {
    id: "inv-1",
    date: "Jun 1, 2026",
    description: "Free plan",
    amount: 0,
    status: "Paid",
  },
];

export const CREDIT_PACKAGES: CreditPackage[] = [
  { id: "credits-500", credits: 500, price: 500 },
  { id: "credits-1000", credits: 1000, price: 999 },
  { id: "credits-5000", credits: 5000, price: 4499 },
];

export const DEFAULT_PACKAGE_ID = "credits-1000";

/** Seconds a Scan and pay QR code stays valid. */
export const QR_EXPIRY_SECONDS = 5 * 60;

export const formatRupees = (amount: number) =>
  `Rs ${amount.toLocaleString("en-US")}`;
