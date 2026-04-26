import { describe, it, expect } from "vitest";
import { PLANS, getPlan, planFromPriceId, getStripePriceId } from "@/lib/stripe/plans";

describe("plans", () => {
  it("has free, pro, agency tiers", () => {
    expect(Object.keys(PLANS)).toEqual(["free", "pro", "agency"]);
  });

  it("free plan has no trial and no stripe price", () => {
    const free = getPlan("free");
    expect(free.trialDays).toBe(0);
    expect(free.stripePriceEnv).toBeNull();
  });

  it("pro plan has no trial and 19€ price", () => {
    const pro = getPlan("pro");
    expect(pro.trialDays).toBe(0);
    expect(pro.priceMonthly).toBe(19);
  });

  it("agency plan has unlimited projects", () => {
    const agency = getPlan("agency");
    expect(agency.limits.projects).toBe(Number.POSITIVE_INFINITY);
    expect(agency.limits.apiAccess).toBe(true);
    expect(agency.limits.removeBranding).toBe(true);
  });

  it("planFromPriceId returns pro for pro price", () => {
    expect(planFromPriceId("price_test_pro")).toBe("pro");
    expect(planFromPriceId("price_test_agency")).toBe("agency");
    expect(planFromPriceId("price_unknown")).toBeNull();
  });

  it("getStripePriceId returns env var value", () => {
    expect(getStripePriceId("pro")).toBe("price_test_pro");
    expect(getStripePriceId("free")).toBeNull();
  });
});
