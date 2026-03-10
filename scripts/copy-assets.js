const fs = require("fs");
const path = require("path");

const webRoot = path.resolve(__dirname, "..");
const publicDir = path.join(webRoot, "public");

// Prefer submodule path; fallback to sibling shared repo (local dev)
const submoduleAssets = path.join(webRoot, "packages", "shared", "shared", "assets");
const siblingAssets = path.join(webRoot, "..", "chromoscientia-shared", "shared", "assets");

const sourceDir = fs.existsSync(submoduleAssets) ? submoduleAssets : siblingAssets;

if (!fs.existsSync(sourceDir)) {
  console.warn("copy-assets: shared assets not found at", submoduleAssets, "or", siblingAssets);
  process.exit(0);
}

const files = fs.readdirSync(sourceDir);
for (const file of files) {
  const src = path.join(sourceDir, file);
  if (!fs.statSync(src).isFile()) continue;
  const dest = path.join(publicDir, file);
  fs.copyFileSync(src, dest);
  console.log("copy-assets:", file);
}
