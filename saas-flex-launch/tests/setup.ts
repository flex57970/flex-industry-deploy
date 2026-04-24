import { beforeAll, vi } from "vitest";

beforeAll(() => {
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("STRIPE_PRICE_PRO_MONTHLY", "price_test_pro");
  vi.stubEnv("STRIPE_PRICE_AGENCY_MONTHLY", "price_test_agency");
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
});
