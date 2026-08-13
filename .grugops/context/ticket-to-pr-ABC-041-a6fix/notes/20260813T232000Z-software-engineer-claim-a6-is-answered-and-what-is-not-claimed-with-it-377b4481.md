---
id: 20260813T232000Z-software-engineer-claim-a6-is-answered-and-what-is-not-claimed-with-it-377b4481
kind: claim
by: software-engineer
at: 2026-08-13T23:20:00Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - src/render-seam.test.ts
  - plans/tickets/ABC-041-render-seam-closure.md
  - 20260813T230500Z-qe-e2e-claim-the-a4-block-is-discharged-and-a-narrower-one-takes-its-place-22426ad6
supersedes: 
---

# `A6`'s block is ANSWERED: the criterion's four spellings are now four assertions, and the two that could be armed were watched red before I believed them.

Recorded as a `claim` because **no `finding` is admissible on this install** — `AGENTS.md`
§ Role/workflow files states why and it is not re-derived here. No `§14-gate#<id>` stamp was invented,
and nothing that could not be run is recorded as a pass. **Confidence is `high` because each statement
below is a run, not a reading — but "answered" is the strongest word I get: LIFTING the block is the
gate's, at the re-gate, and this hop does not do it.**

## What changed

`src/render-seam.test.ts` **+8/−1**, in the existing `A6 / A7` row. Where the row asserted one of the
criterion's four spellings it now asserts all four: `process.` (already there), the bare word
`process`, `globalThis`, `import.meta`. **No new test file, no new test, no new module, no production
line, no change to the criterion.** 11 tests in the file, 827/827 on 29, skip 0, `src/` at 49 files.

## The arming, which is the only reason to believe any of it

- **`X8` shipped GREEN on the delivered instrument** — 827/827, `tsc` 0, lint 0 — and with
  `CHESS_GLYPHS=ascii` set it reds `A1`, `A4` and `A5` **while `A6 / A7` stays green**. The harm is
  measured, not argued.
- **With the three lines added, `X8` reds `A6 / A7`** at `:292`; with the two `process` lines removed
  the `globalThis` line reds it **alone** at `:291`.
- **`X8b`, built because `X8` cannot reach the third line**, is `tsc`-clean, green on the delivered
  instrument, and reds the `import.meta` line **and nothing else** at `:294`.
- Both reverted; the module's md5 re-verified; the module never opened for writing in the worktree.

## What is NOT claimed

- **Not that the block is lifted.** That is the gate's call at the re-gate. `ABC-041` stays
  `In Review`; the board was not moved.
- **Not that `A6` is now unfalsifiable.** It is a grep and it loses to the next spelling, exactly as
  the criterion's own parenthetical says. The capability property is the firing threshold's, not this
  row's, and nothing here widens it.
- **Not that `X8b` is a realistic ambient read.** It is a spelling-discrimination mutant and is
  labelled as one in the `observation` note. `X8` is the behaviourally harmful one.
- **Not that the `process.` line was disposed of.** It is redundant under the bare-word line and it is
  **kept and flagged** — the disposal of a gate row is the gate's, and it is one revert away if QE
  wants it.
- **Not that `X5b` or `A8`'s import-statement blind spot moved.** They are `ABC-053`/`ABC-054`'s and
  they were left alone.
- **Not that the criterion was made easier to satisfy.** The ticket page was not opened; the
  substring form of the `process` check is deliberately **stronger** than the criterion's "bare word",
  never weaker, and that over-strictness is flagged rather than hidden.

## Hand-off

**Do not merge. Do not deploy.** The re-gate is QE's, and the `pending -> done` queue move is the
Orchestrator's.
