// Validates the Claude Skills that live in .claude/skills.
// Each skill must be a folder containing a SKILL.md whose frontmatter
// (the block fenced by --- at the very top) has a non-empty `name` and
// `description`. If any skill is missing or malformed, this exits with a
// non-zero code so CI (the "Skills" check) turns red.
//
// Dependency-free on purpose: it uses only Node's built-in modules, so the
// CI job needs no `npm install`.

import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const SKILLS_DIR = ".claude/skills";
const errors = [];
const checked = [];

if (!existsSync(SKILLS_DIR)) {
  console.error(`✗ No skills folder found at ${SKILLS_DIR}`);
  process.exit(1);
}

const folders = readdirSync(SKILLS_DIR).filter((name) =>
  statSync(join(SKILLS_DIR, name)).isDirectory()
);

if (folders.length === 0) {
  console.error(`✗ No skills found in ${SKILLS_DIR}`);
  process.exit(1);
}

for (const name of folders) {
  const file = join(SKILLS_DIR, name, "SKILL.md");

  if (!existsSync(file)) {
    errors.push(`${name}: missing SKILL.md`);
    continue;
  }

  const text = readFileSync(file, "utf8");
  const frontmatter = text.match(/^---\s*\n([\s\S]*?)\n---/);

  if (!frontmatter) {
    errors.push(`${name}: no frontmatter block (--- ... ---) at the top of SKILL.md`);
    continue;
  }

  const body = frontmatter[1];
  const nameField = body.match(/^name:\s*(.+)$/m);
  const descField = body.match(/^description:\s*(.+)$/m);

  if (!nameField || nameField[1].trim() === "") {
    errors.push(`${name}: frontmatter is missing a non-empty 'name'`);
  }
  if (!descField || descField[1].trim() === "") {
    errors.push(`${name}: frontmatter is missing a non-empty 'description'`);
  }

  checked.push(name);
}

if (errors.length > 0) {
  console.error("✗ Skill validation failed:");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`✓ All ${checked.length} skills are valid: ${checked.join(", ")}`);
