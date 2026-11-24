// Generates TypeScript types from the API's OpenAPI document.
// Usage: npm run gen:api  (reads NEXT_PUBLIC_API_URL, or OPENAPI_URL / a local file path)
import { execFileSync } from "node:child_process";

const source =
  process.env.OPENAPI_URL ??
  `${(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787").replace(/\/$/, "")}/openapi.json`;

console.info(`Generating src/lib/api/schema.d.ts from ${source}`);
execFileSync("npx", ["openapi-typescript", source, "-o", "src/lib/api/schema.d.ts"], { stdio: "inherit" });
