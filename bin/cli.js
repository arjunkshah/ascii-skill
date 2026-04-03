#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

const ROOT = path.join(__dirname, "..");

function copyRecursive(src, dest) {
  const st = fs.statSync(src);
  if (st.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function installToSkillsParent(skillsParentDir) {
  const dest = path.resolve(skillsParentDir, "ascii-skill");
  fs.mkdirSync(dest, { recursive: true });

  const skillMd = path.join(ROOT, "SKILL.md");
  const refs = path.join(ROOT, "references");
  const assets = path.join(ROOT, "assets");

  if (!fs.existsSync(skillMd)) {
    console.error("ascii-skill: SKILL.md missing from package. Reinstall from GitHub/npm.");
    process.exit(1);
  }

  fs.copyFileSync(skillMd, path.join(dest, "SKILL.md"));
  if (fs.existsSync(refs)) {
    copyRecursive(refs, path.join(dest, "references"));
  }
  if (fs.existsSync(assets)) {
    copyRecursive(assets, path.join(dest, "assets"));
  }

  return dest;
}

function printHelp() {
  console.log(`
ascii-skill — install agent skill files (SKILL.md, references/, assets/)

Usage:
  npx ascii-skill                      # same as: install (default)
  npx ascii-skill install              # .claude/skills + ~/.codex/skills
  npx ascii-skill install --claude     # only <cwd>/.claude/skills/ascii-skill
  npx ascii-skill install --codex      # only ~/.codex/skills/ascii-skill
  npx ascii-skill install --dir <path> # <path>/ascii-skill

  npx ascii-skill --help
`);
}

const argv = process.argv.slice(2);

if (argv[0] === "-h" || argv[0] === "--help") {
  printHelp();
  process.exit(0);
}

let rest = argv;
if (rest[0] === "install" || rest[0] === "i") {
  rest = rest.slice(1);
}

const claudeOnly = rest.includes("--claude");
const codexOnly = rest.includes("--codex");
const dirIdx = rest.indexOf("--dir");
const customDir = dirIdx !== -1 && rest[dirIdx + 1] ? rest[dirIdx + 1] : null;

if (rest.includes("--help")) {
  printHelp();
  process.exit(0);
}

if (customDir) {
  const p = installToSkillsParent(customDir);
  console.log("ascii-skill: installed to", p);
  process.exit(0);
}

const installed = [];

if (codexOnly) {
  installed.push(installToSkillsParent(path.join(os.homedir(), ".codex", "skills")));
} else if (claudeOnly) {
  installed.push(installToSkillsParent(path.join(process.cwd(), ".claude", "skills")));
} else {
  installed.push(
    installToSkillsParent(path.join(process.cwd(), ".claude", "skills")),
    installToSkillsParent(path.join(os.homedir(), ".codex", "skills"))
  );
}

console.log("ascii-skill: installed to");
for (const p of installed) console.log("  ", p);
