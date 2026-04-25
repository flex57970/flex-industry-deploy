/**
 * Seeds the database with 3 test users (admin, free, pro).
 *
 * ⚠️  Only runs if NODE_ENV !== "production"
 *
 * Usage: pnpm run db:seed
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });
import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { createClient } from "@supabase/supabase-js";
import * as schema from "../src/lib/db/schema";

if (process.env.NODE_ENV === "production") {
  console.error("❌ Refuse to run seed in production");
  process.exit(1);
}

const url = process.env.DATABASE_URL;
const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !supaUrl || !supaKey) {
  console.error("❌ DATABASE_URL / SUPABASE_* not set");
  process.exit(1);
}

const supabase = createClient(supaUrl, supaKey, { auth: { persistSession: false } });

function randomPassword(): string {
  return `FLEX-${randomUUID().slice(0, 12)}-Launch!`;
}

async function ensureAuthUser(email: string, password: string): Promise<string> {
  const { data: existingList } = await supabase.auth.admin.listUsers();
  const existing = existingList?.users?.find((u) => u.email === email);
  if (existing) {
    console.log(`  ✓ reuse auth user ${email}`);
    return existing.id;
  }
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) throw error ?? new Error("createUser failed");
  console.log(`  + created auth user ${email}`);
  return data.user.id;
}

async function main() {
  const client = postgres(url!, { max: 1 });
  const db = drizzle(client, { schema });

  console.log("🌱 Seeding test users...\n");

  const users: Array<{ email: string; plan: "free" | "pro" | "agency" | "admin" }> = [
    { email: "admin@test.local", plan: "admin" },
    { email: "free@test.local", plan: "free" },
    { email: "pro@test.local", plan: "pro" },
  ];

  const creds: string[] = [];
  for (const u of users) {
    const password = randomPassword();
    const id = await ensureAuthUser(u.email, password);
    const plan = u.plan === "admin" ? "agency" : u.plan;

    await db
      .insert(schema.profiles)
      .values({ id, email: u.email, plan })
      .onConflictDoUpdate({
        target: schema.profiles.id,
        set: { plan, updatedAt: new Date() },
      });

    creds.push(`${u.email.padEnd(22)} ${password}    [plan=${plan}]`);
  }

  console.log("\n✅ Seed done. Test credentials:\n");
  creds.forEach((c) => console.log(`  ${c}`));
  console.log("\n⚠️  Save these passwords now — they won't be shown again.\n");
  await client.end();
}

main().catch((err) => {
  console.error("❌ seed failed:", err);
  process.exit(1);
});
