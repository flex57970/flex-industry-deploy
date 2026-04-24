import { describe, it, expect } from "vitest";
import { signupSchema, loginSchema } from "@/lib/validations/auth";
import { createProjectSchema } from "@/lib/validations/project";

describe("auth validations", () => {
  it("accepts valid signup", () => {
    const r = signupSchema.safeParse({
      email: "jane@example.com",
      password: "Strong123",
      fullName: "Jane",
    });
    expect(r.success).toBe(true);
  });

  it("rejects weak password", () => {
    const r = signupSchema.safeParse({
      email: "jane@example.com",
      password: "weak",
    });
    expect(r.success).toBe(false);
  });

  it("normalizes email", () => {
    const r = loginSchema.safeParse({ email: "  Jane@EXAMPLE.com  ", password: "x" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe("jane@example.com");
  });
});

describe("project validations", () => {
  it("accepts valid project", () => {
    const r = createProjectSchema.safeParse({
      name: "Acme",
      description: "A concise but descriptive product description over twenty chars.",
      tone: "professional",
    });
    expect(r.success).toBe(true);
  });

  it("rejects short description", () => {
    const r = createProjectSchema.safeParse({
      name: "Acme",
      description: "too short",
      tone: "professional",
    });
    expect(r.success).toBe(false);
  });

  it("defaults tone to professional", () => {
    const r = createProjectSchema.safeParse({
      name: "Acme",
      description: "A concise but descriptive product description over twenty chars.",
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.tone).toBe("professional");
  });
});
