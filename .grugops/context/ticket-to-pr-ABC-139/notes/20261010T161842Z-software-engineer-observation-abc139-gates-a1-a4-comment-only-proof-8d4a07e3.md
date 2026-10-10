---
id: 20261010T161842Z-software-engineer-observation-abc139-gates-a1-a4-comment-only-proof-8d4a07e3
kind: observation
by: software-engineer
at: 2026-10-10T16:18:42Z
verified_by:
confidence: high
refs:
  - ABC-139
  - QE-129-a
  - QE-129-b
  - N8-LANE
  - src/command-input.test.ts
  - .grugops/context/qe-ABC-132/probe/exit132.mjs
  - 20261010T161842Z-software-engineer-decision-abc139-cadence-comment-quotes-docblock-form-with-arithmetic-5b2e91c4
supersedes:
---

# `ABC-139` readings: the gate is green (52 files / 1,608 tests, skip 0); `A1`–`A4` are met; both Q4 measures hold, on QE's committed `exit132.mjs` and on an SE harness

This note is hand-authored and unsealed.
- Branch `grugops/ABC-139-cadence-comment`, from `e7641dea`. The code commit is `0d22d9d6`.
- Not merged, not pushed. Apple M3 (arm64), Node v26.11.0.
- Raw output is in `../probe/RUN.txt`.

**Premise re-verified at `e7641dea` before the edit:** grep count 1. The comment was at `:412`–`:414`, directly above `expect(run.renders).toBe(4);`
(`:415`), and the docblock formula was at `src/turn-loop.ts:279`. The premise was not stale.

| criterion | reading | verdict |
|---|---|---|
| `A1` | `grep -cF '1 + one per non-advancing outcome' src/command-input.test.ts`: base 1 → tip **0** | MET |
| `A2` | the block `:412`–`:416` contains `RE-EMITTING` (1) and `"The render cadence"` (1). The arithmetic is 1 + 0 + 0 + 3 = **4**, and `eof` is counted as emitting no frame | MET |
| `A3` | `git diff --name-only e7641dea..0d22d9d6 -- src` = `src/command-input.test.ts` only; numstat 5/3. Q4 holds on both harnesses (below) | MET |
| `A4` | lint 0 (100 files), typecheck 0, build 0, `npm test` 0: 52 files, **1,608** passed (= base), JSON skip count **0**; `test-skip-integrity.js --skip-count 0` "No findings."; `lane-inventory.js` 52/52 "No findings." | MET |

**Comment-only proof (owner Q4: both measures, never one alone, per `QE-129-b`):**
- **QE's committed `exit132.mjs` ran.** The permission layer did NOT refuse it. On the real diff: (i) 8 changed lines, scanner-comment
  8/8 → HOLDS; (ii) removeComments emit `49f5f1b78b96cf9a` (50,392 B) IDENTICAL under the repo tsconfig and under
  ESNext → HOLDS; (iii) token stream IDENTICAL. Q4 conjunction **HOLDS**. Its four NEG controls all FAIL, as they should.
  - **Caveat for QE:** the probe's `POS-comment-only` control also FAILS on this file. It inserts a ` * ` line "in header", and
    `src/command-input.test.ts` has no block-comment header (line 1 is an `import`), so the inserted line is code.
    The control was built for `ABC-132`'s file. It does not apply here, and it says nothing about this diff.
  - The "ticket-regex 0" column is `ABC-132`'s `*`-docblock regex. Every line of this diff is `//`, so a reading of 0 is expected.
- **SE harness `../probe/q4-abc139.mjs`.** It uses TS AST comment ranges (`getLeading/TrailingCommentRanges` over every node)
  plus a `createPrinter({ removeComments: true })` print. Real diff: 8 changed (−3/+5), 0 non-comment → HOLDS.
  Stripped print IDENTICAL. Q4 **HOLDS**. Controls fitted to this file: POS (an added `//` line) HOLDS; NEG
  (`toBe(4)`→`toBe(5)`) FAILS; NEG (`//` line plus `void 0;`) FAILS.

**Cost:** no new test file, `it` or spawn, so `N8-LANE` is 0. 0 production lines: `git diff --name-only
e7641dea 0d22d9d6 | grep -v '\.test\.ts$' | grep '^src/'` is empty, so UAT is waived by the 2026-08-17 rule. QE still hops.

**Not done by the SE (fenced):** the board move `In Development` → `In Review` is the Orchestrator's on this hop (`plans/board.md` is fenced).
