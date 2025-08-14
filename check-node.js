#!/usr/bin/env node
// Simple Node version check without external deps
const [maj, min, pat] = process.versions.node.split('.').map(Number);
const ok = maj > 18 || (maj === 18 && (min > 18 || (min === 18 && pat >= 0))) || maj > 18;

if (!ok) {
  console.error(`\nYour Node.js version is ${process.versions.node}.\nThis project (Storybook 9 + Vite 7) requires Node >=18.18.0.\nPlease upgrade Node.js and try again.\n`);
  process.exit(1);
}
