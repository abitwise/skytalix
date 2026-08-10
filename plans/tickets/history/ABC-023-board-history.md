# ABC-023 — board history

> **Created 2026-08-10 by the Orchestrator** at `ABC-023`'s `Ready → In Development` pull, per the
> board's own rule: *"when you replace [the `_Updated:` header], append the outgoing line verbatim to
> that ticket's `history/` file first."* The Orchestrator destroyed two such lines on 2026-08-09
> before noticing, which is why the rule exists. This file holds every board entry written about
> `ABC-023`, **verbatim** — nothing rewritten, summarised or dropped, and none of it duplicated back
> on the board.
>
> Ticket: [`ABC-023-castling-precondition-net-hardening.md`](../ABC-023-castling-precondition-net-hardening.md)

Entries appear newest-first, as the board was written.

---

## `Backlog → Ready` — the BA/PM promotion (outgoing `_Updated:` header, archived 2026-08-10)

_Updated: 2026-08-10 by BA/PM (task `ticket-to-pr-ABC-023`, subtask `ticket-to-pr-ABC-023-bapm`, Workflow 07): **`ABC-023` PROMOTED `Backlog` → `Ready`. Ready 1/8 → 2/8.** The Definition of Ready is MET on a tree measured today, not on the cutting hop's. **Six acceptance defects fixed — three named by the pre-check, THREE named by no pre-check**, two of them unsatisfiable-by-construction: `A4` pinned `src/moves.ts` at `0e247853…` (re-pinned to `6335b452…`, re-derived at this hop) AND required *"no existing test file is modified"* while `## Scope` says the hardening file GAINS rows — now additions-only; `A5` enumerated THIRTEEN behaviour-equivalent controls while requiring fifteen (colour-blind on BOTH squares, and the extra rook-square non-`EMPTY` condition, both restored); `A1`'s four rows varied colour but not castling side — the exact one-axis blindness `A3` exists to police — fixed at ZERO extra rows. **ALL 16 INHERITED MUTANT VERDICTS RE-MEASURED against the 559-test suite they had never been scored against (they were scored at 381 on 16 files); 34 mutants run, 0 broken builds, 0 harness errors, 0 verdict mismatches** — every survivor still survives, every kill still kills with the identical failure count, so only the suite size moved. **All 15 of `ABC-009`'s behaviour-equivalent controls still survive at 559/559, killed count ZERO**, and the two black destination mutants that were `UNKNOWN - verify` are now measured survivors (559/559 + deep 32/32), closing that unknown. The *"9 of 13 type/table pairs"* table was re-derived by parsing the live tables — 30 rows, 13 pairs, 9 gapped, unchanged — so size `S` and the 17-row estimate STAND. Escalation trigger re-checked and still NOT fired (`ABC-013` is the only ticket in `Ready` or beyond and it changes no rules-core line). `src/` NOT touched: `src/moves.ts` md5 `6335b452…` identical before and after, every mutant applied to a copy outside the repository, one OS process per tree state. **`ABC-009` NOT reopened.** Nothing merged, nothing deployed. Per-ticket detail is in `plans/tickets/history/`, not here._
