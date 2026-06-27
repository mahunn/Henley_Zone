import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { loadEnvConfig } from "@next/env";
import Module from "module";

// Mock 'server-only' package since tsx runs outside Next.js webpack environment
// @ts-ignore
const originalResolveFilename = Module._resolveFilename;
// @ts-ignore
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request === "server-only") {
    return "server-only";
  }
  return originalResolveFilename.apply(this, arguments);
};

// @ts-ignore
const originalLoad = Module._load;
// @ts-ignore
Module._load = function (request, parent, isMain) {
  if (request === "server-only") {
    return {};
  }
  return originalLoad.apply(this, arguments);
};

loadEnvConfig(process.cwd());

async function main() {
  console.log("Generating static products catalog...");
  try {
    // Dynamically import listProducts AFTER mocking the module system
    const { listProducts } = await import("../src/lib/products-repository");
    const products = await listProducts();
    const data = { products };
    const publicDir = join(process.cwd(), "public");
    mkdirSync(publicDir, { recursive: true });
    writeFileSync(
      join(publicDir, "products.json"),
      JSON.stringify(data, null, 2),
      "utf8"
    );
    console.log(`Successfully generated static catalog with ${products.length} products.`);
  } catch (error) {
    console.error("Error generating static catalog:", error);
    process.exit(1);
  }
}

void main();
