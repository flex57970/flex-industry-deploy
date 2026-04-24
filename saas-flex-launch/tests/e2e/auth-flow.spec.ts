import { test, expect } from "@playwright/test";

test.describe("Auth flow", () => {
  test("rejects weak password on signup", async ({ page }) => {
    await page.goto("/signup");
    await page.getByLabel(/nom complet/i).fill("Jane");
    await page.getByLabel(/email/i).fill(`jane+${Date.now()}@example.com`);
    await page.getByLabel(/mot de passe/i).fill("weak");
    await page.getByRole("button", { name: /créer mon compte/i }).click();
    await expect(page.getByText(/8 caractères/i)).toBeVisible();
  });

  test("redirects unauthenticated from /dashboard to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
