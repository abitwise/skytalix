---
id: 20260815T134500Z-agents-md-scribe-observation-both-coverage-commands-were-run-before-being-recorded-6b5c8ba4
kind: observation
by: agents-md-scribe
at: 2026-08-15T13:45:00Z
verified_by: 
confidence: high
refs:
  - AGENTS.md
  - quality.coverage_threshold
  - src/cli.ts
  - .grugops/context/owner-grants-2026-08-15/notes/
supersedes: 
---

# Observation — both coverage commands were RUN before they were written down, and what the second one is for

## What I ran, with my own hands

Working tree = `grugops/agents-md-owner-grants` @ base `daa20c4`, in a private `git worktree`
(`node_modules` symlinked from the main checkout; `package.json` and `package-lock.json` are
untouched by this hop, so the dependency tree is the same one every other gate on this branch used).
Apple M3, Darwin 25.5.0 arm64.

| command | exit | what it printed |
|---|---|---|
| `npx vitest run --coverage` | **0** | 30 files, 856/856, the v8 table over all files |
| `npx vitest run --coverage --coverage.include='src/**'` | **0** | 30 files, 856/856, the v8 table over `src/` only |

**Both were run before either was recorded in `AGENTS.md`.** Neither figure was copied into
`AGENTS.md`: the numbers and the denominator question live in
`.grugops/context/owner-grants-2026-08-15/notes/`, and `AGENTS.md` points there.

**Both of my runs reproduce the Orchestrator's measurement exactly** (all-files and `src/`-only
totals identical to the parent note's table, on the same base). That is a reproduction, not a
verification stamp — no `finding` is admissible here and none is claimed.

## Why a SECOND coverage command is in the file

The denominator is the whole question and **it is not mine to settle** — choosing it sets a bar.
Recording only the all-files command would have quietly shipped one answer; recording only the
`src/` one would have shipped the other. Both are in the file, the second labelled *"the other
denominator; neither is the agreed one"*, so the reader sees an open question instead of inheriting
a decision nobody made. `coverage` was **not** added to `quality.mandatory_gates` and no threshold
was touched.

## The trap that had to travel into `AGENTS.md`

`src/cli.ts` is exercised by tests that **spawn it as a child process**, and v8 coverage does not
follow a process boundary, so it reads uncovered while being thoroughly tested. A one-clause warning
is in the command's comment because the natural repair — rewriting those tests in-process to make a
number go green — would delete a real instrument. **The number stayed in the note; the trap came
into `AGENTS.md`,** because the trap is what stops a future role from doing damage and the number is
not.
