---
id: 20260817T213000Z-orchestrator-observation-criteria-review-at-ready-for-dev-exit-3f81c2d7
kind: observation
by: orchestrator
at: 2026-08-17T21:30:00Z
verified_by:
confidence: high
refs:
  - ABC-032
  - plans/tickets/ABC-032-parse-san.md
  - src/san.ts
  - src/perft.test.ts
supersedes:
---

# `ABC-032` criteria re-read against the built tree at the `Ready for Dev` exit

`AGENTS.md` § Process rules 1. The ticket was cut **2026-08-13**; `main` is at `bf371d7` and
`ABC-031` merged since. Every claim below was read from the tree at that commit, not from the page.

## What HOLDS — checked, not assumed

| the page says | the tree at `bf371d7` |
|---|---|
| `src/san.ts` with `toSan` is merged (`ABC-013`) | **TRUE** — `export function toSan(position, move, legal?: readonly Move[])` at `src/san.ts:146` |
| `parseSan` is what this ticket builds | **TRUE** — **no `parseSan` export exists**; the ticket is unbuilt, not half-built |
| `A1` hands `legal` to the call | **SUPPORTED** — `toSan`'s third parameter is already `legal?: readonly Move[]`, so the round-trip needs no signature change to `toSan` |
| `A6` fences `san.nfr.test.ts`, `san.qualifier.hardening.test.ts`, `san.suffix.hardening.test.ts` | **ALL THREE EXIST** — no fence names a file that is gone |
| `legalMoves`, `isInCheck`, the perft table merged | **TRUE** — `src/legal.ts:42`, `src/legal.ts:32`, `src/perft.test.ts` |
| § Dependencies: **None blocking** | **CONFIRMED** — and its "not dependent on `ABC-031`" is now moot in the safe direction: `ABC-031` merged 2026-08-17 anyway |

## Gaps found at this exit — 1, and it is a live hazard, not a stale line

**`G1` — `ABC-031` merged into this ticket's neighbourhood after it was cut, and the page predates
it.** `src/coordinate-move.ts` now exists and resolves `e2e4`-style input against the legal move
list. **`ABC-032` resolves a DIFFERENT grammar against the SAME list**, and the page's
"separate grammars, separate modules, separate tolerance" was written before the sibling existed.
**The engineer reads `src/coordinate-move.ts` before writing**, for the reject-vocabulary shape and
the reference-identity convention `ADR-0004` (2b) requires — **not to share code with it, and not to
edit it.** `ABC-104` is open against that module's docblock and is NOT this hop's.

**This is the whole gap list, and it is deliberately short.** `ABC-032` is the only DoR 10/10 P0 on
the board and the re-read did not lower it: **no line-number fence, no stale dependency, no
criterion naming a file that moved.** `A6` scopes by `git diff -U0` and by test-file identity rather
than by line number, which is why five merges into its neighbourhood cost it nothing — the failure
mode that cost `ABC-061` its whole re-read.

## Not decided here

`A5`'s 10,000-character input and `A7`'s single-table assertion are the two criteria with no
precedent in this repo. Neither is unclear; both are simply first-of-kind. Flagged so the engineer
measures rather than pattern-matches.
