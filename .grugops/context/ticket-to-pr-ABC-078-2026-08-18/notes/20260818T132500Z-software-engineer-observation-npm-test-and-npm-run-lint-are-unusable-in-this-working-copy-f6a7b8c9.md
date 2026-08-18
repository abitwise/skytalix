---
id: 20260818T132500Z-software-engineer-observation-npm-test-and-npm-run-lint-are-unusable-in-this-working-copy-f6a7b8c9
kind: observation
by: software-engineer
at: 2026-08-18T13:25:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - AGENTS.md
  - NFR-008
  - vitest.config.ts
  - biome.json
supersedes:
---

# `npm test` and `npm run lint` are both unusable in this working copy today, and neither has anything to do with this ticket — six sibling agent worktrees live under `.claude/worktrees/`

## What was measured, at the `ABC-078` branch tip

`.claude/worktrees/` contains **seven live sub-checkouts** of this repository
(`abc033-sw-engineer`, `agent-a3172b98…`, `agent-a39ced3b…`, `agent-a95a43a6…`,
`agent-ab105162…`, `agent-abb8f8d4…`, `agent-af5af456…`). `.gitignore` ignores the directory —
*"agent worktrees — live sub-checkouts, never part of this repo"* — but **git-ignoring it does not
hide it from the two tools whose commands `AGENTS.md` records.**

- **`npm test` (`vitest run`) collects the worktrees' test files as if they were this repo's.**
  Measured: **282 test files, 8 049 tests** against this repository's own **36 files, 1 016
  tests**. It is GREEN, which is worse than red — every count in it is inflated ~8x, and a lane
  timing taken from it is meaningless.
- **`npm run lint` (`biome check .`) EXITS NON-ZERO before checking anything.** Each worktree
  carries its own `biome.json`, and biome refuses: *"Found a nested root configuration, but
  there's already a root configuration."* → *"Biome exited because the configuration resulted in
  errors."*

**Both were confirmed to be independent of this ticket by measurement, not by argument:** with
`src/engine.ts` and `src/engine.test.ts` moved out of the tree, `npm run lint` fails identically
and `npm test` still collects 282 files.

## What was run instead, and why it is the same gate

- unit: `npx vitest run --exclude '**/node_modules/**' --exclude '.claude/**'` — the recorded
  command with the sub-checkouts excluded and `node_modules` re-supplied (passing `--exclude`
  replaces vitest's defaults). **36 files, 1 016 tests, 0 skipped, exit 0.**
- lint: `npx biome check src tools spike vitest.config.ts` — every directory in this repository
  that holds source, and no sub-checkout. **61 files, exit 0.**

Neither is a softened gate: both cover strictly more of this repository's own code than the
recorded command manages to check today.

## Why this is NOT written into `AGENTS.md`

The worktrees are **transient** — they are other agents' live working copies during this wave,
not a property of the project. A permanent trap paragraph about a temporary condition is how
`AGENTS.md` fills with folklore. It is recorded here, in this task's context, where the numbers
in the gate note can be read against it. **If these worktrees are still present a wave from now,
that IS a project-level problem and it wants a ticket** — either a `vitest.config.ts` `exclude`
and a `biome.json` `files.includes` fence, or a rule that worktrees live outside the repo.
Neither is cut here: it is out of `ABC-078`'s scope and I am not widening the diff to take it.

## One thing this DOES contaminate, and it is named rather than smoothed

**`NFR-008`'s lane budget (≤ 3 s wall AND ≤ 13 s CPU, median of ≥ 7 interleaved runs on the
reference machine) could not be measured under its own protocol at this hop.** The reference
machine was concurrently running six other agents' worktrees. What was measured, repo-scoped and
paired (8 rounds, round 0 discarded):

| | CPU (user+sys) | wall |
|---|---|---|
| branch tip | **13.4–14.0 s** | 2.2–3.6 s |
| the same tree without `src/engine.test.ts` | **12.2–13.1 s** | 2.8–3.0 s |

So **the lane is at or over `NFR-008`'s 13 s CPU ceiling BEFORE this ticket**, and this file adds
a median **860 ms** (n=7, sign 7/7, spread 750–1 370 ms). **I am reporting both halves and ruling
neither** — the base figure is not this ticket's to explain, and a contaminated machine is not
evidence that a bar is breached. `N8-LANE`'s own ≤ 650 ms figure comes out at **~700 ms net** of
the 160 ms per-file floor: **over by ~50 ms, inside the run-to-run spread, and NOT claimed as
MET.** Every wall-clock case in the new file is already opt-in and every default-lane repetition
already sits behind `ENGINE_DEEP=1`; what remains in the lane is the criteria themselves.
