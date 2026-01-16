import { drizzle } from "drizzle-orm/neon-http";

export const db = drizzle(process.env.DATABASE_URL!); // ! (Non-Null Assertion Operator) is to tell typescript that DATABASE_URL is a string
