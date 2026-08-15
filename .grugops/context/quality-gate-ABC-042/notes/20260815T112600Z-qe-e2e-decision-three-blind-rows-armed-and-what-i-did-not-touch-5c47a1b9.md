---
id: 20260815T112600Z-qe-e2e-decision-three-blind-rows-armed-and-what-i-did-not-touch-5c47a1b9
kind: decision
by: qe-e2e
at: 2026-08-15T11:26:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - A6
  - A9
  - A2
  - src/cli.test.ts
supersedes: 
---

# I armed three blind rows in the delivered test file, and left two survivors alone — the reasons for both

## What I changed

**`src/cli.test.ts` only** — one of `A12`'s own six paths, so `A12`'s file list is unaffected.
**Zero production bytes. Zero new tests (still 29). Zero new spawns.** Three existing rows got
stronger assertions:

1. **`A6(i) — the 18 near misses`** — `--colour`'s three near misses move from the one-token form
   `[miss]` into `--colour`'s **legal argv position** `[miss, "white"]`, which is what the criterion
   already says (*"rejected in its legal argv position"*). `--ascii` and `--unicode` keep `[miss]`,
   which **is** their legal position. `derived` is still 18 and the "no near miss collides with an
   accepted spelling" control is untouched.
2. **`A9 — process.argv occurs EXACTLY once`** — adds the **whole process surface, transcribed**,
   the same instrument shape `A8` already uses for numeric literals:
   `expect((entry.match(/process\.\w+/g) ?? []).sort()).toEqual(["process.argv","process.exitCode","process.stderr","process.stdout"])`
   plus `not.toMatch(/process\s*\[/)`. This is the resolver's own stronger form applied to the one
   module that legitimately names the handles.
3. **`A2 — the entry point exports nothing`** — adds `not.toContain("globalThis")`, so the row
   proves the *purpose* (nothing can import a binding from it) and not only the keyword.

## Why this is arming and not repairing

The subtask draws the line: *"You may add tests and probes. You may NOT change production behaviour
and you may not repair a criterion."* **No criterion was touched.** `A6`(i) already says "in its
legal argv position"; `A9`(2) already says "no second read and no branch on argv after the resolver
returns"; `A2` already says "nothing can import a binding from it". In all three cases the
**criterion was right and the assertion did not implement it**. That is a test defect, and tests are
what I am licensed to add. Nothing was shrunk to fit what the instrument happened to assert — the
opposite.

## Verified both directions, because an assertion that only ever passes is the thing I am here to find

- **Green on the delivered build:** `npx vitest run src/cli.test.ts` → 29/29. Full gate re-run with
  the armed file: lint PASS, typecheck PASS, build PASS, **856/856 on 30 files**, skip **0**,
  test-integrity `No findings.` exit **0**.
- **Red on the mutants it exists for:** `M7` and `M19` (prefix / case weakening on `--colour`) →
  **now killed** by the near-miss row. `M11` (`process["argv"]`) → **now killed** by the `A9` row.
  `M14` (`globalThis`) → **now killed** by the `A2` row. All four previously shipped green.
- **Costs nothing in the lane** — the additions are regex over sources the file already reads.
  Interleaved CPU of `src/cli.test.ts` alone, delivered vs armed: `−20 / 0 / +50 ms`, i.e.
  indistinguishable from zero against a per-file noise floor I measured at ~110 ms.

## What I deliberately did NOT do

- **`M15` — the merged licence guard's `toEqual`.** Left alone. Asserting textually over another
  test file's comparator is brittle, and `src/history-pane.nfr.test.ts` is a **merged** file whose
  permitted change `A12` bounds to one array element plus a citation. Adding an assertion there would
  breach `A12` to protect `A12`. **Reported as a gap with its owner instead** (`Q3`).
- **`M17` — `A6(ii)`'s tautological 250-check.** Left alone. Fixing it means changing how the corpus
  is drawn (count generator draws, not kept items), which is a re-design of the criterion's
  instrument rather than a missing assertion. **`A6`(ii) is MET as written** and the delivered filter
  is correct; the control is what is weak. Owner is BA/PM (`Q4`).
- **`A11`'s reading, `plans/board.md`, `plans/traceability.md`, the ticket page,
  `plans/nfr-catalog.md`, `ADR-0008`, `.grugops/test-skips.md`** — all untouched, all out of my hand.
- **No criterion was ticked off.** MET/NOT MET is evidence I report; ticking is BA/PM's.

## Where this lives, and the routing question that is the Orchestrator's

The armed file is committed on **`grugops/quality-gate-ABC-042`** only. **The delivered branch
`grugops/ticket-to-pr-ABC-042` is untouched by me.** If the Orchestrator merges the engineer's branch
as-is, `M7`/`M19`/`M11`/`M14` go back to shipping green — so the arming needs to ride along, either by
merging this branch's `src/cli.test.ts` change or by routing the three-row patch back to the
engineer. **That choice is the Orchestrator's, not mine, and I have not made it by acting.**
