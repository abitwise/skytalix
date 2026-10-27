---
subtask: bapm-amend-ABC-210
role: ba-pm
ticket: plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
ref: .grugops/context/bapm-amend-ABC-210/
branch: new grugops/bapm-amend-ABC-210 from main, worktree ../wt-bapm-amend-ABC-210
width: 1 of 3 — records only (no npm, vitest, build or timing)
---

# ABC-210: place the Architect's page lines and the pin rulings; DoR re-score

## Do
- Read Orchestrator `orch-2026-10-27f` (this hop's routing note) and Architect `arch-design-ABC-210/…c5d0e464`, `…8e6a40c2`. The page lines are under "BA/PM page lines" in `.grugops/queue/done/arch-design-ABC-210.md`.
- **Place each line on the ABC-210 page as a dated amendment:**
  - `adr:` → ADR-0051 (PROPOSED).
  - Scope 1 and Scope 3.
  - A2: ADR-0051 d8's rows.
  - A3: d6 read against the door; strike "≥ base − 1"; add ADR-0051's drift bars and the same-depth mate floor.
  - A1 is cross-build.
  - Test notes 1 and 3.
- **The pin rulings, as dated lines:**
  - **P1** (`transposition.test.ts` A5 fixture-bites row, re-pinned d3 → d2, −502) is accepted by the Orchestrator. QE re-plants the bug at d2.
  - **P2** (`zugzwang.005` depth 12 → 13) waits on the owner's answer, which comes with ADR-0051's.
- **No criterion's bar is loosened** beyond what ADR-0051 states. If a line would loosen one, stop and say so.
- Re-score DoR. Put the board card lines in your Result: In Design → Ready for Dev if 10/10, noting that the build is held on the owner. Don't edit the board.

## Fences
- Work only in your worktree. No `src/`, and no npm/vitest/timing.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `bapm-amend-ABC-210`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result (ba-pm, 2026-10-27T04:19Z): **ABC-210 page amended from the design ruling and the pin rulings. No bar loosened beyond what `ADR-0051` states. DoR 10 of 10 → In Design → Ready for Dev, build HELD on the owner's one yes/no (`ADR-0051` + P2).**

Records only. Branch `grugops/bapm-amend-ABC-210` in `../wt-bapm-amend-ABC-210`, cut from `main` `5a9855b7`. One
commit, **`c389e3da`**, not merged and not pushed. No npm, vitest, build or timing. No `src/` edit. Scratch:
`<scratchpad>/bapm210amend/` (claim script, note bodies, seal script).

Notes are in `.grugops/context/bapm-amend-ABC-210/notes/`. They were sealed with grugops 2.1.0 `context-io.js`
`admitAndAppend` (context root: the worktree's `.grugops/context`, `at` from `date -u`), and `readContext` read back
2 of 2:
- `20261027T041844Z-ba-pm-decision-ae96d6d3`: the call;
- `20261027T041844Z-ba-pm-observation-6f7cb75e`: the re-reads at `5a9855b7`, four named readings with their
  alternatives, and flags.

**The lines** (each dated `2026-10-27 (BA/PM, bapm-amend-ABC-210)`):
1. **`adr:`** (front-matter): new `ADR-0051` (PROPOSED; the owner's). Form (a) at the horizon; it reverses no
   recorded decision; plus an `ADR-0026` off-door pair.
2. **Scope 1:** form (a) only, at a horizon node (remaining depth ≤ 0, in check), +1 ply. (b) is not shipped.
3. **Scope 3:** cap 1 per line; `QUIESCENCE_MAX_PLY` (8) and `src/quiescence.ts` untouched.
4. **`A1`:** cross-build. QE runs it out of tree, as `ABC-208`'s.
5. **`A2`:** the (b) bullet is struck (`~~`, with its dated reason). The (a) rows are `ADR-0051` d8's: five horizon
   rows, the instrument and the cap row (5 ≥ 4).
6. **`A3`:**
   - **"≥ base − 1" is struck**, so `G6` reads "≥ base". That is tighter; the flagged question is marked answered
     (moot).
   - d6 reads `search(…, 6)` against `searchWithoutCheckExtension(…, 6)`; ≤ 1.5 × base is kept.
   - **Added:** drift at d5, both recursions, on the 190: ≥ 90 % within 25 cp, none beyond 174 cp.
   - **Added:** the same-depth d5 mate floor on the 287.
7. **Test note 1:** the instrument is call-through spies on `src/apply.ts` and `src/quiescence.ts`.
8. **Test note 3:** the stop reads against "≥ base".
9. **§ Dependencies, the pin rulings and the hold:**
   - `ADR-0051` PROPOSED; the build is held until the owner answers. The ALONE reading and the merge wait on his
     acceptance.
   - **P1 is accepted** (`…75af453c`): `transposition.test.ts` `A5` "fixture bites" is re-pinned d3 → d2, −502
     (`ADR-0026` d7). **QE re-plants the fixture bug at d2** and checks that the row reds.
   - **P2** (`zugzwang.005`, d12 → d13; edits accepted `ADR-0050` d9) **waits on the owner**. His answer comes with
     his answer on `ADR-0051`.
   - The other moved rows re-point inside `ADR-0026` d4/d5.

**No bar loosened beyond `ADR-0051`, so no STOP.**
- Every line keeps or tightens a bar, or adds one `ADR-0051` states.
- The page had no drift bar for this ticket before. The added 90 % is below the 95 % of `ADR-0026` d9 and `ADR-0050`
  d8. It is `ADR-0051` d7's own figure, and you have already told the owner, inside his yes/no.
- 118 cp and 37 cp do not move.

| # | DoR item | verdict at `5a9855b7` |
|---|---|---|
| 1 | problem clear | ✅ unchanged |
| 2 | scope and out-of-scope clear | ✅ re-scored: form (a) at the horizon, +1 ply, cap 1; (b) not shipped; `src/quiescence.ts` untouched |
| 3 | INVEST-shaped | ✅ unchanged |
| 4 | acceptance testable and measurable | ✅ re-scored: `A1` cross-build; `A2` d8 rows; `A3` d6 against the door, − 1 struck, drift ≥ 90 % / 25 cp / 174 cp, same-depth mate floor |
| 5 | dependencies known | ✅ unchanged (plus the dated owner hold and pin rulings in § Dependencies) |
| 6 | security/NFR triggers with a measurable target | ✅ unchanged: `NFR-005` floor 6, unmoved |
| 7 | test notes present | ✅ re-scored: four; notes 1 and 3 amended |
| 8 | size assigned | ✅ re-scored: `M`, confirmed by the probe; no split |
| 9 | priority assigned | ✅ `P3` |
| 10 | no major unresolved blocker | ✅ re-scored: design ruled (`…c5d0e464`), P1 ruled. The one owner yes/no holds the pull into In Development, the ALONE reading and the merge, not the page. `QE-207-g`, `QE-209-f` open, not blocking |

Files on the branch:
- `plans/tickets/ABC-210-…md` (+61/−5; now 407 lines);
- 2 notes (+88, +57).

Not touched: `src/`, `memory-bank/` (`ADR-0051` included), `EPIC-008`, `plans/board.md`, `plans/traceability.md`, and
the config. In main's checkout, only this queue record and its claim moved, uncommitted, for the Orchestrator.

### Flags for the Orchestrator
- **Item 10 reading:** I scored ✅ with the hold named rather than ⏳. The hold is your routed delivery call, and the
  page needs no edit whichever way the owner answers. If he declines, the ticket goes back to In Design. Re-read it at
  your exit check if you weigh it differently.
- LOW: the front-matter `status: ready` / `column: Ready` is stale against the board (In Design). It was left as
  written (precedent). Sync it at the move if you want.
- LOW: the page is 407 lines. No written line budget was found in `AGENTS.md` or the kit.

### Board card line (for the Orchestrator; ABC-210 In Design → Ready for Dev, held; no other column moves)

- **ABC-210, In Design → Ready for Dev (HELD on the owner)**, appended to its card: `**2026-10-27: page amended, DoR 10/10 → Ready for Dev, build HELD until the owner answers ADR-0051 + P2 (bapm-amend-ABC-210, …ae96d6d3): adr: ADR-0051 PROPOSED, form (a) at the horizon, reverses nothing; cap 1 per line, QUIESCENCE_MAX_PLY untouched; A1 cross-build (QE); A2 = ADR-0051 d8 rows, (b) struck; A3 "≥ base − 1" STRUCK (G6 ≥ base), d6 vs searchWithoutCheckExtension, drift ≥ 90 %/25 cp/max 174 cp + same-depth mate floor added; P1 accepted (transposition A5 d3 → d2, −502; QE re-plants at d2); P2 (zugzwang.005 d12 → d13, ADR-0050 d9) waits on the owner with ADR-0051.**`

### Trace row (10 cells, header order)

| ABC-210 (bapm-amend-ABC-210) | page amended from the design ruling and pin rulings: adr: ADR-0051 (PROPOSED); form (a) at the horizon, cap 1 per line; A1 cross-build; A2 ADR-0051 d8 rows, (b) struck; A3 "≥ base − 1" struck (G6 ≥ base), d6 vs the door, drift ≥ 90 % / 25 cp / 174 cp and same-depth mate floor added; P1 accepted (d3 → d2, −502, QE re-plants at d2); P2 waits on the owner; no bar loosened beyond ADR-0051; DoR 10/10 | EPIC-008 | check extension at the horizon; low gain on the only evidence (UNKNOWN - verify); ships only on GAIN (S1) | NFR-005 via G6 "≥ base" (predicted MET, UNKNOWN - verify), floor 6 unmoved; A3 ≤ 1.5 × base at d6; NFR-004 unchanged; notes …ae96d6d3, …6f7cb75e | grugops/bapm-amend-ABC-210 @ c389e3da (records only)<br>ADR-0051 (PROPOSED) | — (records only) | — (UAT owed at delivery; QE signs) | owner accepts/declines ADR-0051 + P2 (ADR-0050 d9); Orchestrator merges records, board, trace; then Ready for Dev → In Development once he answers | In Design → Ready for Dev, 2026-10-27 (build HELD on the owner; ALONE reading and merge wait on ADR-0051) |
