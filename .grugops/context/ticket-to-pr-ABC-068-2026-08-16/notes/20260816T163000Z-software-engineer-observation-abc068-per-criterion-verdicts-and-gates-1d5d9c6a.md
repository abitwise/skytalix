---
id: 20260816T163000Z-software-engineer-observation-abc068-per-criterion-verdicts-and-gates-1d5d9c6a
kind: observation
by: software-engineer
at: 2026-08-16T16:30:00Z
verified_by: 
confidence: high
refs:
  - plans/tickets/ABC-068-shared-test-helpers-have-no-written-contracts.md
  - src/cli.test.ts
  - .grugops/context/ticket-to-pr-ABC-068-2026-08-16/notes/20260816T160000Z-orchestrator-observation-criteria-review-at-ready-for-dev-exit-7c31a0d9.md
supersedes: 
---

# `ABC-068` — `A1`–`A7` answered with measured numbers, and every gate run on the branch tip

Branch `grugops/abc068-helper-contracts` off `main` @ `f566304`. Comments only in `src/cli.test.ts`.
No `finding` and no stamp: none is emittable on this install (`AGENTS.md` § "Role / workflow files").

## The before, measured on `main` @ `f566304` BEFORE one character changed

`npm test` — **861 passed (861)**, **30 files passed (30)**, exit 0.
Skip count, `npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'` — **0**.
`grep -c "npm run chess -- " src/cli.test.ts` — **1**.

This is my own measurement, not the `861` the `Ready for Dev` note relays; that note explicitly said
not to quote it, and `A5`'s parenthetical `859` is stale for the reason it gives (`G-D`).

## Per-criterion verdicts

- **`A1` (both contracts written) — MET, 2 of 2.** Method: read both doc comments in the delivered
  tree. `usageLineOf`'s doc comment now says it THROWS on bad input (it previously said so only in a
  body comment inside the function, which is why I wrote it into the doc comment rather than
  counting the body line); `advertisedTextOf`'s says it RETURNS A MEANINGLESS VALUE AND NEVER
  THROWS. Before: 1 of 2, and only if a body comment counts as a doc comment.
- **`A2` (precondition at three sites) — MET, 3 of 3.** Method: `grep -n "advertisedTextOf("` located
  both call sites (`:867` and `:948` before the edit — never by the page's `:923`, which is inside
  `devRunSlotIn`'s merged comment, per `G-A`); the precondition sentence now appears in
  `advertisedTextOf`'s doc comment, at call site 1 (`ABC-066`'s block, one added line) and at call
  site 2 (`ABC-065`'s `A1`, one added line). Per `G-B` the true before was **1 of 3**, not 0 of 3:
  site 2's existing five-line explanation already carried it, and I did NOT rewrite those lines.
- **`A3` (the divergence is a decision) — MET, 1 sentence.** Method: read the helper block. The
  sentence lives in `advertisedTextOf`'s doc comment, states the divergence is deliberate, and names
  what forbids unifying: making this one throw would change `ABC-066`'s merged and gated block's
  semantics, so it is a new ticket with its own gate. Written in the helper block, not appended to a
  merged guard's comment (`G-C`).
- **`A4` (no count that can go stale) — MET, 0 disagreements.** Method: read the comment above the
  block and every numeral inside it. The line now NAMES the shared names (`SEPARATOR_FORM`,
  `usageLineOf`, `advertisedTextOf`, `invocationsAdvertisedBy`) and carries no count. Numerals that
  remain in the block — `ADR-0011` "clause 4", `` `A5` ``, and `invocationsAdvertisedBy`'s "twelve
  combinations / six single-option forms" — describe a clause id, a criterion id and that helper's
  expansion arithmetic, not the block's contents; **0** disagree with the block.
- **`A5` (zero behaviour change, measured two ways) — MET.** `npm test` on the branch tip: **861
  passed (861)**, 30 files, exit 0 — equal to the number measured on `main` immediately before. Skip
  **0**. Changed executable lines: **0**, confirmed by reading the diff and mechanically —
  `git diff -U0 -- src/cli.test.ts | grep '^+[^+]' | grep -vcE '^\+\s*(//|\*|/\*\*)'` returns **0**,
  i.e. every added line is a comment line, and the three removed lines were comment lines. Nothing
  was re-flowed or renumbered: the untouched tail of the block-header sentence stays on its own line
  rather than being re-wrapped, which is deliberately why that line reads short in the diff.
- **`A6` (`ABC-065`'s `A5` property intact) — MET.** Method: count over the ADDED lines only.
  Members of `ACCEPTED_ARGUMENTS` spelled: **0** (`--ascii` 0, `--unicode` 0, `--colour` 0, `white`
  0, `black` 0, `random` 0 — and 0 occurrences of a bare `--` in added text). Second spellings of
  `SEPARATOR_FORM`: **0**. File-wide `grep -c "npm run chess -- " src/cli.test.ts` — **1**, the same
  as before. The identifier `SEPARATOR_FORM` is used in prose; the literal is never re-spelled.
- **`A7` (nothing else moved) — MET.** `git diff --name-only <delivered>~1 <delivered>` excluding
  `.grugops/` is exactly **`src/cli.test.ts`** — one path, **0** other files under `src/`. New child
  processes: **0**; `spawned` is still pinned at **10** by the live assertion in `ABC-066`'s block
  and the suite is green. Suite green, skip **0**. The exact command output is in the `artifact-ref`
  note beside this one, which carries the delivered sha.

## Gates on the branch tip

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | `Checked 54 files in 141ms. No fixes applied.` exit 0 |
| typecheck | `npm run typecheck` | `tsc --noEmit`, no output, exit 0 |
| build | `npm run build` | `tsc --noEmit`, no output, exit 0 |
| test | `npm test` | `Test Files 30 passed (30)`, `Tests 861 passed (861)`, exit 0 |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | `0` |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.` exit 0 |

All six were re-run after the last wording change, so the table describes the delivered tree and not
an earlier one. The Orchestrator re-runs the gate itself and holds the merge; I merged nothing and
deployed nothing.
