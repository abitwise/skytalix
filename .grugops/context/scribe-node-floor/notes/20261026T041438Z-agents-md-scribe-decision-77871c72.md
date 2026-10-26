---
id: 20261026T041438Z-agents-md-scribe-decision-77871c72
kind: decision
by: agents-md-scribe
at: 2026-10-26T04:14:38Z
verified_by: 
confidence: high (package.json and package-lock.json engines.node re-read on main 08b44f94 before the edit)
refs:
  - AGENTS.md
  - ABC-216
  - QE-216-h
supersedes: 
seal: sha256:af5f23a57a07857fe6dd9690cea3c260fb464bf3bd8f69e612e9351006402a90
---

# AGENTS.md Stack: Node floor ">= 22" -> ">= 22.18"

Branch `grugops/scribe-node-floor` from `main` `08b44f94`. One line in one file: `AGENTS.md` § Stack, "TypeScript on Node (>= 22), ESM." -> "TypeScript on Node (>= 22.18), ESM." (+1 / -1; 17,098 -> 17,101 B).

Why: `package.json` and `package-lock.json` have declared `"engines": { "node": ">=22.18" }` since ABC-216 merged (`39b93505`); QE-216-h (INFO) flagged the stale floor. No dated line added: AGENTS.md carries no dated-correction convention in § Stack, and the brief said only "if the file's convention asks for one". Nothing else moved: no command-log entry (no command changed), no `src/`, no `package*.json`, no board edit. No npm, vitest or timing run.
