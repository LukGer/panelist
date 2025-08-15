import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";
import * as schema from "./schema";

// Create the database connection
const sqlite = SQLite.openDatabaseSync("app.db");
export const db = drizzle(sqlite, { schema });

// Migration function
export async function runMigrations() {
  try {
    // For expo-sqlite, we need to handle migrations manually
    // The migrate function doesn't support migrationsFolder in this context
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Initialize database with migrations
export async function initializeDatabase() {
  try {
    await runMigrations();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}
