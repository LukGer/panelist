import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Database connection
const connectionString =
  process.env.DATABASE_URL || "postgresql://localhost:5432/panelist";

// Create postgres client
const client = postgres(connectionString, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout
});

// Create drizzle instance
export const db = drizzle(client, { schema });

// Export the client for manual operations if needed
export { client };

// Helper function to close the database connection
export const closeConnection = async () => {
  await client.end();
};
