/**
 * Promotes an existing user to admin by setting plan=agency and adding their email
 * to the ADMIN_EMAILS env (manual step: add to .env.local).
 *
 * Usage: pnpm run create:admin -- email@example.com
 */
import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";

const email = process.argv[2];
if (!email) {
  console.error("Usage: pnpm run create:admin -- email@example.com");
  process.exit(1);
}
const adminEmail: string = email;

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("❌ DATABASE_URL not set");
    process.exit(1);
  }
  const client = postgres(url, { max: 1 });
  const db = drizzle(client, { schema });

  const [existing] = await db
    .select()
    .from(schema.profiles)
    .where(eq(schema.profiles.email, adminEmail))
    .limit(1);

  if (!existing) {
    console.error(`❌ No user found with email: ${adminEmail}`);
    console.error(`   → Have them sign up first via /signup, then rerun this script.`);
    process.exit(1);
  }

  await db
    .update(schema.profiles)
    .set({ plan: "agency", updatedAt: new Date() })
    .where(eq(schema.profiles.id, existing.id));

  console.log(`✅ Upgraded ${adminEmail} to agency plan`);
  console.log(`⚠️  Add this email to ADMIN_EMAILS in .env.local to grant /admin access:`);
  console.log(`ADMIN_EMAILS=${process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS + "," : ""}${adminEmail}`);
  await client.end();
}

main().catch((err) => {
  console.error("❌ create-admin failed:", err);
  process.exit(1);
});
