---
id: 20260809T152940Z-ba-pm-artifact-ref-7c6ef27a
kind: artifact-ref
by: ba-pm
at: 2026-08-09T15:29:40Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - A13
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - plans/traceability.md
  - .grugops/queue/done/ticket-to-pr-ABC-009-bapm4/
supersedes: 
---

# Artifacts of the fourth BA/PM hop on `ABC-009`

## Edited in this repository — two files, both `plans/`

- **`plans/tickets/ABC-009-legalmoves-position-mutation.md`** — `A13` added after `A12` as the
  full-byte-space quantifier, with the value-by-value discharge map for both home squares, the two
  exclusions named and measured with their reasons, the eight newly-required configurations measured,
  the row-writing warning about interchangeable counts, and an explicit *what `A13` does not claim*
  section naming the three regions outside its dimension. Five statements my own edit made stale were
  corrected in place with a date: the `## Acceptance` preamble's `A1`–`A12` completeness claim and its
  *"one criterion ever unsatisfied"* sentence, `A11`'s pointer to an unrouted gap, the retirement note's
  *"no more the last than any before it"* (**left as written and falsified beside it**), and the
  Definition-of-Ready block's `A1`–`A12` claim. **No criterion, count, FEN or parenthetical belonging to
  `A1`–`A12` was edited**; `A11`'s rows and MET verdict are untouched.
- **`plans/traceability.md`** — **one row (`ABC-009`), one cell (`Status`)**, plus this hop's `_Updated:`
  header line. Verified the corrected way: every table row counted at **ten cells on unescaped pipes
  before and after**, with exactly one row line changed.

`node tools/grugops/reference-check.js plans/tickets/ABC-009-legalmoves-position-mutation.md` reports
**No findings**.

## NOT edited — checked rather than asserted

`src/` **not one file** (`git status --short -- src/` empty; `src/moves.ts` still md5
`0e247853ab2c05887c76105ff83d8621`; **no test row written** — QE's file, QE's hop). `plans/board.md`,
`ABC-022`, `ABC-010`, `ABC-011`, `ABC-018`, `plans/nfr-catalog.md` — none edited. `## Implementation`,
`## QE`, `## QE — second hop`, `## Security / NFR`, `## Test notes`, `## Scope`, `## Out of scope`,
`## Reproduction`, `## Dependencies`, `## Size and priority rationale` and the ticket **frontmatter** —
all left alone. **Nothing merged, nothing deployed.**

## Measurement scripts — outside the repository, deliberately

All four probes live in this session's scratchpad, **never in the repository**, and every one of them
only ever *reads* `src/`:

- `bytedomain.ts` — first byte-domain probe. **Returned 11 and was WRONG** (single probe board refused
  both KING bytes). Kept as the record of the instrument failure.
- `bytedomain2.ts` — corrected byte-domain probe, three king configurations per square: **13 values on
  each of `e1`, `h1`, `a1`, identical, with a witness character per value**; 243 of 256 container bytes
  unreachable, sub-16 being `7`, `8`, `15`.
- `maskcheck.ts` — the equivalence exclusion on a second instrument: `isSquareAttackedBy` over the
  kingside `kingPath`, **polarity-checked before any verdict was read**, six enemy types × two squares,
  **12/12 agreement with hop 3's mutation verdicts**.
- `accounting.ts` — the 13-value accounting per square. **Its own-`KING`-on-the-rook's-square row was
  wrong** (drifted onto `A4`'s shape); caught because it prints the FEN it used.
- `newlyrequired.ts` — the eight newly-required configurations with setups **asserted** (0/8 labels lie)
  and inertness checked (0/8 masked or blocked).

## Gates on the tip, re-run by this role and never inherited

`npx vitest run` → **371 passed (371) on 16 files**. Skip count **0** by the `AGENTS.md` command
(`npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'`). **No perft, deep-lane or
throughput figure is this role's** — none was run, at any of its four hops.

## Queue

`.grugops/queue/done/ticket-to-pr-ABC-009-bapm4/` — the subtask file and the claim record, moved
`pending → claimed → done` **by hand**; `scripts/claim.js` does not exist (re-checked at the source: the
repository has no `scripts/` directory at all, and neither does the kit root).

## Context notes published this hop — five, task total 51

`20260809T152740Z-ba-pm-observation-22f5359e` (the 13 measured, and the probe that said 11) ·
`20260809T152810Z-ba-pm-observation-da1be0db` (equivalence on a second instrument, 12/12; the eight
configurations) · `20260809T152840Z-ba-pm-decision-71ce381e` (`A13` not a widened `A11`; the
exhaustiveness argument; the six-bucket correction) · `20260809T152910Z-ba-pm-claim-edebf200` (soft
results and both instrument failures) · this note.

**No `finding`** — none is admissible on this task (no §14 gate to issue a `§14-gate#<id>` stamp;
`context.human_admission` is `off`). Nothing self-stamped. **No `index.md` / `index.jsonl` was
hand-faked** — `scripts/context-io.ts` is absent and the `mcp__grugops__propose_note` tool is not in
this session's tool set, so these notes are hand-written in the exact shape of
`agent-factory/contracts/context-note.md` and the deviation is recorded rather than glossed.
