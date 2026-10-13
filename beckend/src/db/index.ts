import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { relationsSchema } from "./schema.js";

const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  relations: relationsSchema,
});

export default db;
