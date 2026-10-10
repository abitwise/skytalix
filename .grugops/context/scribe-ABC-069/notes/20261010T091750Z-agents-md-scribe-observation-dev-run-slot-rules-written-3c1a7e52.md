---
id: 20261010T091750Z-agents-md-scribe-observation-dev-run-slot-rules-written-3c1a7e52
kind: observation
by: agents-md-scribe
at: 2026-10-10T09:17:50Z
verified_by:
confidence: high
refs:
  - ABC-069
  - ABC-065
  - ABC-067
  - ABC-071
  - AGENTS.md
  - src/cli.test.ts
  - plans/tickets/ABC-069-dev-run-slot-conventions-are-unwritten.md
supersedes:
---

# `AGENTS.md` § Commands `Dev / run` slot — the two rendering rules are now written (`ABC-069`)

No sanctioned writer (`scripts/context-io.ts`, `scripts/claim.js`, `mcp__grugops__propose_note`) is
present on this install and `context.human_admission` is `off`; hand-authored per
`agent-factory/contracts/context-note.md`, as `AGENTS.md` records. Not a `finding`.

## Re-verification (first step) — nothing moved

Guard re-read at `src/cli.test.ts` `describe("ABC-065 — …")` (line 1948 at the base):

- **Backtick coupling holds.** `A1` takes `advertisedTextOf(slot).split("`")[0]` — the text after the
  separator form `"npm run chess -- "`, cut at the first backtick — and requires every token to be in
  `ACCEPTED_ARGUMENTS`.
- **Vocabulary coupling holds.** `A3` collects `slot.match(/(?<![\w-])--[A-Za-z0-9-]*/g)`, filters
  only the exact string `"--"`, and requires set equality with the accepted `--` options. It still
  cannot tell "available" from "named as unavailable".
- **Both conventions were unwritten** in the slot's comment (it carried the separator rule only).
- **One thing HAS moved since the cut, and it is the one the page anticipated:** the `Q8` lane landed.
  The block now also requires exactly one `- Dev / run:` slot (`ABC-071`) and a comment that closes
  before the next list item (`ABC-067`). Neither changes the two rules; both are named in the same
  sentence, as the page's Dependencies said they might be.

## What changed

One HTML comment, one file: `AGENTS.md` lines 70-73 (`git diff -U0`: single hunk `@@ -70,2 +70,6 @@`).
Added a "WRITING RULES for this slot" sentence: enforcer cited as `ABC-065`'s block in
`src/cli.test.ts`; (1) invocation stays inside backticks, the guard reads to the first backtick
after it; (2) an option may be named only if the program accepts it, even to say it does not, and
such a sentence is written elsewhere in `AGENTS.md`; plus the `ABC-071`/`ABC-067` clause. The rule is
written with NO example of a forbidden option (`## Test notes` 1).

## Criteria

| # | verdict | reading |
|---|---|---|
| `A1` | MET | both rules in the slot's comment, 2 of 2 |
| `A2` | MET | "write that sentence elsewhere in `AGENTS.md`" |
| `A3` | MET | names `ABC-065` and `src/cli.test.ts` |
| `A4` | MET | collector regex run over the slot before and after: `["--ascii","--colour","--unicode"]` both times, 0 added; bare separator filtered as before; text after the separator form to first backtick is `--colour black`, unchanged |
| `A5` | MET | `npm test` 50 files / 1540 passed / 0 skipped before (base `85d0139`, AGENTS.md reverted) AND after — equal; `ABC-065` `A1`/`A3` and `ABC-042` `A1` rows pass |
| `A6` | MET | `AGENTS.md` only (plus ticket page, note, trace row, all non-`src/`); 0 files under `src/`; 0 new spawns; AGENTS.md changed lines inside the slot's comment only |

`AGENTS.md`: 23,464 B before, 23,879 B after (+415), cap 24,576 B, 697 B headroom. Test-count
receipts NOT refreshed (fence): `Test (all)` still says 1539 although the tip measures 1540 — the
next receipt refresh (`ABC-036`/`ABC-051` merge) corrects it.

`npm run chess -- --colour black` run once first (`## Test notes` 4): exit 0, the separator form
delivered `node src/cli.ts --colour black`, board played as black's opponent moved.
