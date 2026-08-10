const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("Creating fast light zip...");
try {
  // Use tar.exe with exclude
  execSync(`tar.exe -a -cf deploy-fast.zip --exclude=.next/cache .next public src server.js package.json package-lock.json middleware.ts next.config.ts .cpanel.yml .env.local`, { stdio: "inherit" });
  const stat = fs.statSync("deploy-fast.zip");
  console.log(`SUCCESS! Size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
} catch (e) {
  console.error("Tar failed:", e.message);
}
