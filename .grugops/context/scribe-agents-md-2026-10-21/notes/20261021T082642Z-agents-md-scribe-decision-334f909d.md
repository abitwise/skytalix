---
id: 20261021T082642Z-agents-md-scribe-decision-334f909d
kind: decision
by: agents-md-scribe
at: 2026-10-21T08:26:42Z
verified_by: 
confidence: high (diff read; AGENTS.md guard rows run green)
refs:
  - AGENTS.md
  - ABC-164
  - ABC-173
  - QE-ABC-162
  - QE-159-b
supersedes: 
seal: sha256:a4f7f8c5d53952cbe353e84b5005a515d767a70c66259a58ce49c5f1bd6f847b
---

# Three AGENTS.md fixes

1. Note-writer blockquote rewritten: the sanctioned writer and `claim.js` are named without a version, with the way to find the plugin (`installPath` in `installed_plugins.json`); the `propose_note` tool named; the human_admission/no-finding rule kept; the bare `mkdir` claim kept as the atomic act. The hand-authoring instruction and the install-escalation sentence are gone.
2. Real-engine CLI lane comment no longer carries a child count ("Two real children" was wrong: 6 at main; QE-ABC-162 G-4). It points at the test file for the count, so ticket churn cannot stale it (the ABC-164 shape).
3. New Test bullet "Heap flag (ABC-173)": `--max-old-space-size=400` is for one-file vitest runs; whole-suite or multi-file runs use 128, as `npm test` sets itself; the heap guard refuses 400 there. It was not stated before. Source: SE note c7a671d8 and QE-159-b.
Trimmed to stay in budget: the coverage readings (99.43 %, 95.55 %) in two comments; they are measurements with receipts in `memory-bank/90-agents-md-command-log.md`. The 12 rules, the kit overrides and the merge-authority text are untouched.
