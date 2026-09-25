---
id: 20260925T093400Z-ba-pm-decision-abc081-rescore-10of10-ready-dc08995c
kind: decision
by: ba-pm
at: 2026-09-25T09:34:00Z
verified_by:
confidence: high
refs:
  - ABC-081
  - ABC-080
  - NFR-009
  - NFR-005
  - plans/tickets/ABC-081-transposition-table-and-in-tree-repetition.md
  - plans/tickets/ABC-080-move-ordering-mvv-lva-killers-hash-move.md
  - plans/traceability.md
  - .grugops/context/place-nfr009/notes/20260925T090444Z-security-nfr-decision-nfr009-placed-at-16mib-3830d8a4.md
  - .grugops/context/qe-ABC-080/notes/20260925T090400Z-qe-e2e-decision-abc080-pass-with-findings-9f72677b.md
  - .grugops/context/secnfr-ABC-080/notes/20260925T092800Z-security-nfr-decision-abc080-pass-with-risks-no-security-finding-n8lane-met-a7-met-868fc0fb.md
supersedes:
---

# `ABC-081` DoR re-score: **10/10, MET — Ready.** Hand-authored per `agent-factory/contracts/context-note.md`, no `seal` (degraded posture, `AGENTS.md`: `context-io.ts` / `claim.js` / `mcp__grugops__propose_note` absent, no `finding` is admissible here). Worked on `grugops/rescore-abc081` off `d585ece`; NOT merged, NOT pushed.

## Score: 10 of 10 clean

Re-scored against `agent-factory/checklists/definition-of-ready.md` on the current wave tree
(`grugops/wave-2026-09-24` @ `d585ece`), not the ticket page.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ unchanged |
| 2 | scope and out-of-scope clear | ✅ unchanged |
| 3 | INVEST-shaped | ✅ **flips from ⚠️** |
| 4 | acceptance testable and measurable | ✅ unchanged |
| 5 | dependencies known | ✅ unchanged (closed at the prior re-score) |
| 6 | security/NFR triggers with a measurable target | ✅ unchanged |
| 7 | test notes present | ✅ unchanged |
| 8 | size assigned | ✅ unchanged |
| 9 | priority assigned | ✅ unchanged |
| 10 | no major unresolved blocker | ✅ **flips from ⚠️** |

## Item 3 — is ⚠️(3) discharged by `ABC-080`'s code being on the build base? YES

`A3`'s ≤ 70% node-count bar (re-stated in the engine's cumulative iterative-deepening shape by
Architect/Design ruling `…a937c4bd`, R3) needs `ABC-080`'s move ordering and hash move **live at
the time `ABC-081` is built and measured**, not a fully signed-off `ABC-080`. `ABC-080`'s code
(QE `PASS WITH FINDINGS` at `add461f`, Security/NFR `PASS_WITH_RISKS` at `caabd13`) is merged
onto `grugops/wave-2026-09-24` at `d585ece` — the exact branch this ticket's own build hop starts
from. So the hash move `A3` needs is live on the base, regardless of whether `ABC-080` itself has
crossed `Ready for UAT` → `Done` (still pending the owner's UAT word and the `main` merge). INVEST
independence asks whether this ticket can be built and its acceptance measured without waiting on
another ticket's own board progress — the code dependency it actually needed is satisfied now.
Item 3 closes.

## Item 10 — the memory NFR row

`NFR-009` is placed in `plans/nfr-catalog.md` (Security/NFR, subtask `place-nfr009`, 2026-09-25,
on the owner's word, verbatim *"16MiB sounds small in todays standards, if more is needed you can
extend it to 128MiB. I approve otherwise."*): search-held memory ≤ 16 MiB total (TT + per-ply key
array + `ABC-080`'s killer table), `heapUsed` and `arrayBuffers` each ≤ 1 MiB growth between a 1 s
and a 3 s search, read after `gc()`. `A7` now has a project-level bar to check against. Item 10
closes.

## Folded into the ticket (criteria/scope inputs, not DoR items on their own)

1. **`NFR-009`'s placed level and the build-hop note.** A 2^20-entry table alone is 16.00 MiB and
   breaks the total; **2^19 entries (8 MiB) fits.** Written into `ABC-081`'s Security/NFR triggers.
2. **QE `ABC-080` `G1`** (the killer-update-on-cutoff-only mutant survives in `src/engine.ts`,
   caught in `src/search.ts`) is routed to the Engineer inside `ABC-081`, since this ticket
   touches `engine.ts` and is the next licensed touch. Not re-measured here — QE's own estimate
   (one exact node-count pin at a fixed injected-clock budget) is carried forward as written.
3. **The owner's open, undecided question — which runner `NFR-005` binds (plain node vs vitest).**
   Named in `ABC-081`'s Security/NFR triggers, not decided. Security/NFR's recommendation (plain
   node, matching `npm run chess`) is carried, not ratified — that is the owner's word, not this
   re-score's.
4. **`ABC-080`'s own page, `A6` wording firmed.** QE's `qe-ABC-080` hop flagged "cleared or
   invalidated between searches" as ambiguous on the unit of "search" (one `chooseMove` call vs
   one iteration) and accepted the build's reading (one call) as read, asking BA/PM to firm the
   wording. Fixed on `ABC-080`'s own ticket page, `A6` — states the accepted reading; no behavior
   changed, no criterion re-leveled.

## Not decided here

- Which runner binds `NFR-005` — named above, owner's word owed.
- `ABC-080`'s own `Done` / `main`-merge status — unrelated to this re-score; `ABC-081`'s item 3 no
  longer depends on it.

## Files touched

`plans/tickets/ABC-081-transposition-table-and-in-tree-repetition.md` (Security/NFR triggers, new
`§ DoR re-score`); `plans/tickets/ABC-080-move-ordering-mvv-lva-killers-hash-move.md` (`A6`
wording, no behavior change); `plans/traceability.md` (header line + `ABC-081 (rescore)` row).
Zero lines under `src/`. `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md` and every ADR:
untouched.

## Report

**Score: 10/10 — MET.** `ABC-081` is **pullable today**, size `M`, priority `P0`, unchanged.
Open items: none blocking. One item remains open but non-blocking and named, not decided — which
runner binds `NFR-005` (owner's word owed, Security/NFR recommends plain node). **Recommended
routing: pull `ABC-081` into `Ready` — the Orchestrator's board move, out of this subtask's own
fence (`plans/board.md` untouched here).**

sha (this hop's tip, on `grugops/rescore-abc081`): recorded at commit time below. Numstat:
`plans/tickets/ABC-080-move-ordering-mvv-lva-killers-hash-move.md` +9/−3,
`plans/tickets/ABC-081-transposition-table-and-in-tree-repetition.md` +47/−7,
`plans/traceability.md` +2/−0 (two rows appended, header line + table row).
