import type { Config } from "drizzle-kit"
import "dotenv/config"

console.log("Loading database configuration...")

/**
 * Parse a PostgreSQL connection string (DATABASE_URL) into its components
 * @param url The PostgreSQL connection string to parse
 * @returns Object containing host, user, password, database, and ssl settings
 */
function parseDatabaseUrl(url: string) {
  try {
    const parsed = new URL(url);
    const user = decodeURIComponent(parsed.username);
    const password = decodeURIComponent(parsed.password);
    const host = parsed.hostname;
    const database = parsed.pathname?.replace(/^\//, "");
    const sslmode = parsed.searchParams.get("sslmode");
    const sslRequired = sslmode === "require" || sslmode === "true";

    if (!user || !host || !database) {
      throw new Error("Invalid PostgreSQL connection string format");
    }

    return {
      host,
      user,
      password,
      database,
      ssl: sslRequired ? ("require" as const) : true as const,
    };
  } catch (error) {
    console.error("Error parsing DATABASE_URL:", error);
    return null;
  }
}

// Debug: Show if DATABASE_URL is defined
console.log(`DATABASE_URL exists: ${!!process.env.DATABASE_URL}`);

// Extract database credentials from DATABASE_URL if available
const dbConfig = process.env.DATABASE_URL 
  ? parseDatabaseUrl(process.env.DATABASE_URL)
  : null;

// Fallback to individual environment variables if DATABASE_URL parsing failed
if (!dbConfig && !(process.env.PGHOST && process.env.PGUSER && process.env.PGDATABASE && process.env.PGPASSWORD)) {
  throw new Error("No database credentials found in environment variables. Please add them to your .env file.");
}

// Configuration for drizzle-kit
export default {
  schema: "./lib/db.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: dbConfig || {
    host: process.env.PGHOST! ,
    user: process.env.PGUSER! ,
    password: process.env.PGPASSWORD! ,
    database: process.env.PGDATABASE! ,
    ssl: "require" as const,
  },
  verbose: true,
} satisfies Config
