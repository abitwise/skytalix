---
id: 20260926T001500Z-ba-pm-decision-abc121-refold-dor-10of10-8af0aec6
kind: decision
by: ba-pm
at: 2026-09-26T00:15:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ABC-122
  - ADR-0026
  - plans/tickets/ABC-121-principal-variation-search-late-move-reductions.md
  - plans/traceability.md
  - .grugops/context/amend-adr0026/notes/20260925T235500Z-architect-design-decision-adr0026-accepted-amendments-written-d41c7a58.md
  - .grugops/context/validate-adr0026/notes/20260925T145600Z-architect-design-observation-bounded-oracle-misses-three-of-six-wrong-lmrs-7c1d05ab.md
  - .grugops/context/validate-adr0026/notes/20260925T145700Z-architect-design-decision-adr0026-accept-with-amendments-9a3f6e21.md
supersedes:
---

# `ABC-121` folds `ADR-0026`'s accepted amendments; DoR re-scored 10/10, 0 ⚠️ — MET

Hand-authored, no `seal`. This repo ships no `context-io` writer and no `propose_note` tool
surfaced at this hop (`AGENTS.md`'s degraded-writer posture); this note follows the precedent
already set by the `amend-adr0026` and `validate-adr0026` notes. A `decision` needs no stamp. No
test was run and no number was re-measured at this hop — every figure is cited from
`…7c1d05ab`, `…4e2b9c70`, `…9a3f6e21` and `…d41c7a58`, none re-derived.

## Scope

- In scope: `ABC-121`'s ticket page (Scope, `A1`, `A3`, `A4`, Dependencies, `N8-LANE`, Test
  notes, `## Definition of Ready`), one `plans/traceability.md` row, this note, and the queue
  move (`pending` → `claimed`, this hop closes it to `done`).
- Not touched: `src/`, `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, any ADR. Never
  merged, never pushed. Own worktree (`.claude/worktrees/refold-abc121`, branch
  `grugops/refold-abc121`), own queue claim (bare `mkdir`, Workflow 17).

## Both prior ⚠️ are discharged by fact, not by argument

- **Item 3 (INVEST)** — `ABC-122` is `Done`, merged to `main` at `26c0fe0`
  (`plans/board.md` line 2). Every dependency this ticket named as blocking `In Development` is
  now `Done`.
- **Item 10 (no major unresolved blocker)** — the owner accepted `ADR-0026` verbatim (*"4.
  accept"*, `.grugops/context/wave-2026-09-25/notes/…6a63f2b7`), and Architect/Design wrote the
  review's four amendments into the ADR at `.grugops/context/amend-adr0026/notes/…d41c7a58`.
  Status is now `accepted`, not `proposed`. The fallback named at the prior score (re-levelling
  `ABC-080` `A3` and `ABC-081` `A3`) no longer applies.

## What was folded into the ticket, with the measurable lines the task named

- **`A3`'s predicate contract (decision 6, amended):** the predicate returns the reduction in
  **plies (0 or 1)**, and each recursion subtracts exactly that value, never a literal. It
  **classifies the move itself** — capture, promotion, gives-check, in-check — derived from the
  position and move it is given, a pure-function criterion; the caller supplies only remaining
  depth, move index and the root flag.
- **`A1`'s drift bars now run at depth 5, in both recursions** (`search()` vs
  `searchWithoutReductions`; `chooseMove` vs `chooseMoveWithoutReductions`, each iterated to
  depth 5) — decision 9, amended. Measured: 99.47% within 25 cp, max 45 cp
  (`.grugops/context/validate-adr0026/notes/` `…4e2b9c70`).
- **`A1`'s mate floor is one extra ply of slack (d = 4 → 5), not the same depth**, measured on
  the frozen mate-rich corpus `src/search.mate-corpus.ts` — **287 positions per the probe,
  length-pinned; the Engineer builds it under this ticket, this hop does not.** "0 mate-status
  flips on the 190 corpus" is stated as a **report, not a bar** in the ticket now, since it held
  for every deliberately wrong LMR variant the review planted, `gross` included
  (`.grugops/context/validate-adr0026/notes/` `…7c1d05ab`).
- **`A4`'s constructed fail-high is pinned to a null-window node** (alpha + 1 = beta), through
  both recursions — the consequence amendment. At a PV node, PVS's own re-search would mask a
  missing LMR re-search; `noLmrResearch` is the wrong variant this specifically catches.
- **The review's planted-wrong-variant list is added as test note 6**, one line per variant,
  naming which row (`A3`'s predicate table, `A4`'s null-window fail-high, the depth-5 drift bar,
  or the mate floor) catches it — since the bounded oracle alone misses `tactical`, `r2` and
  `noLmrResearch` at both depths.

### `N8-LANE` — named, not measured

The task's own instruction: name which rows are deep-lane and say the Engineer measures. The
`N8-LANE` NFR trigger section now names the depth-5 190-corpus drift pass and the mate-corpus
floor pass as the deep-shaped candidates (11–19 s per depth pair under load, per both probes),
and the table-driven predicate test and the single constructed `A4` position as not. The
default-lane cost of the new rows is still **unmeasured** — the Engineer measures it and reports
the actual figure at build time, same as every other `UNKNOWN - verify` NFR bound this codebase
has shipped (`ABC-080`, `ABC-081`, `ABC-122`'s own pattern). DoR item 6 only requires a
**measurable target named**, which this now is; it does not require the measurement to exist yet.

### `AGENTS.md` headroom — named as a dependency for the follow-up, not for this build

`AGENTS.md` is **32 565 B of a 32 768 B cap — 203 B of headroom** (`plans/board.md` line 2,
re-measured `wc -c` at this hop: 32565, byte-identical). Any deep-lane `AGENTS.md` line
`ABC-121` owes the Scribe (naming its opt-in env var and a run figure, the established shape)
will overflow that headroom on the current pattern. `ABC-121`'s `## Dependencies` now names
`ABC-109` (the `AGENTS.md` size-budget ticket) as the dependency **for that Scribe follow-up
line, not for this ticket's own build** — this ticket adds no `AGENTS.md` line itself; its
Scope, doors, and tests are all under `src/`, `plans/tickets/`, and the corpus fixture.

## Re-scored DoR — 10/10, 0 ⚠️ — MET

Full table is on the ticket page (`## Definition of Ready`), the prior `rescore-abc121` (8/10,
2 ⚠️) score is kept as nested history, unedited. Summary:

1. problem clear — ✅ unchanged
2. scope/out-of-scope clear — ✅ (gains the accepted ADR's mate-fixture line)
3. INVEST-shaped — ✅ (was ⚠️) — `ABC-122` `Done`
4. acceptance testable/measurable — ✅ (six criteria; `A1`/`A3`/`A4` now carry the amended bars)
5. dependencies known — ✅ (`ABC-080`/`ABC-081`/`ABC-122` `Done`; `ADR-0026` accepted; `ABC-109`
   named for the follow-up; `ABC-084` non-blocking)
6. security/NFR triggers with a measurable target — ✅ (`NFR-005`, `N8-LANE` — target named, cost
   `UNKNOWN - verify`, Engineer's to measure)
7. test notes present — ✅ (six; adds the planted-variant catch-list)
8. size assigned — ✅ `M` (3) unchanged
9. priority assigned — ✅ `P1` unchanged
10. no major unresolved blocker — ✅ (was ⚠️) — `ADR-0026` accepted

**Ready to pull.** Size `M`, priority `P1`, both unchanged. Neither prior ⚠️ was BA/PM's to force
closed — both closed on fact (a `Done` merge, an owner's verbatim word) recorded elsewhere, and
this hop only folds and re-scores.

## Out of scope for this hop

- Building `src/search.mate-corpus.ts` — Engineer-owned, per `ADR-0026`.
- Measuring `N8-LANE`'s actual default-lane cost — Engineer's, at build.
- Landing the Scribe's `AGENTS.md` follow-up line or cutting/pulling `ABC-109` — separate hops.
- Moving `ABC-121` on `plans/board.md` — fenced out; the Orchestrator's move.
