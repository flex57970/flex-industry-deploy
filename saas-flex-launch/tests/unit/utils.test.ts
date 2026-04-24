import { describe, it, expect } from "vitest";
import { slugify, formatCurrency, cn, absoluteUrl } from "@/lib/utils";

describe("utils", () => {
  it("slugify removes accents and special chars", () => {
    expect(slugify("Café à Paris !")).toBe("cafe-a-paris");
  });
  it("slugify truncates to 60 chars", () => {
    const long = "a".repeat(100);
    expect(slugify(long).length).toBeLessThanOrEqual(60);
  });
  it("formatCurrency formats EUR", () => {
    expect(formatCurrency(19)).toMatch(/19/);
  });
  it("cn merges tailwind classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
  it("absoluteUrl adds base", () => {
    expect(absoluteUrl("/pricing")).toBe("http://localhost:3000/pricing");
    expect(absoluteUrl("pricing")).toBe("http://localhost:3000/pricing");
  });
});
