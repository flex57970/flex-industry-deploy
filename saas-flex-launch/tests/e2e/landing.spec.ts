import { test, expect } from "@playwright/test";

test.describe("Public landing", () => {
  test("shows hero and primary CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/60 secondes/i);
    await expect(page.getByRole("link", { name: /commencer gratuitement/i }).first()).toBeVisible();
  });

  test("navigates to pricing", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /tarifs/i }).first().click();
    await expect(page).toHaveURL(/\/pricing/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("login page renders form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible();
  });

  test("signup page renders form", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: /crée ton compte/i })).toBeVisible();
  });

  test("legal pages accessible", async ({ page }) => {
    for (const path of ["/terms", "/privacy", "/refund"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });
});
