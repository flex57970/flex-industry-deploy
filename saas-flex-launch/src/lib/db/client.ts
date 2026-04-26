import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var __postgresClient: ReturnType<typeof postgres> | undefined;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// Reuse the client across hot-reloads in dev AND across warm serverless invocations.
// Without this, each Lambda cold-start opens a new pool — exhausting Supabase connection limits.
const client =
  globalThis.__postgresClient ??
  postgres(connectionString, {
    prepare: false,
    max: 1, // Each serverless function gets its own pool of size 1; transaction pooler handles fan-out.
    idle_timeout: 20,
    max_lifetime: 60 * 30, // 30 min
  });

globalThis.__postgresClient = client;

export const db = drizzle(client, { schema });
export { schema };
