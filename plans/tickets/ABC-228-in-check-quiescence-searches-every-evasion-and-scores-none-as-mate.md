---
id: ABC-228
title: "In check, quiescence searches every evasion instead of standing pat, and a side in check with no evasion is mated"
status: ready
column: Ready
size: M
priority: P2
epic: EPIC-010
---

# ABC-228: evasions in check inside quiescence

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 1,
> verified by the SA (`…306a4012` rows 1b, 1c, 1e). **Waits in Backlog on:** an ADR (below) and the owner's Q4.

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only): the owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`). This ticket's reading is now the smoke pair before merge (`EPIC-010` § The
> merge rule), with a batched validation later. Q4 no longer holds it. **Next real wait:** the ADR (In Design: `ADR-0024` d4 and `ABC-079`'s decision, an `ADR-0026` d10 door). DoR 8/10 → 9/10.

> **FOLDED 2026-10-30 by BA/PM** (task `bapm-owner-adr-fold`, records only, at `main` `a046e839`). The owner
> **accepted `ADR-0053` as written** (`orch-2026-10-29g` `…3dd61448`; the ADR's status line is the Architect's hop
> `arch-adr-accept-0052-0053-0054`). The design is `ADR-0053` decisions 1–4 and 6–9; where this page is shorter, the ADR
> rules.
>
> - **OQ-228-1, his words:** *"If engine requires more effort then increase 3s to 4s, build it fully."* "Build it
>   fully" means the full evasion design (decision 2), not option (b), the mate-test-only form.
> - **The "3s to 4s" clause applies only on a forecast miss** (`A8`, decision 9's forecast on this ticket's own base,
>   with `ABC-235` and `ABC-240` merged). Which 3 s it means is **pending the owner**: `G6`'s measurement budget, or
>   level 5's per-move time. No meaning is chosen here. On a miss the SE stops before the graded `G6` and the smokes,
>   and the Orchestrator takes the question to him.
> - **The miss is borderline.** Head reaches depth 10 on `position-6` at 3 s only if the node rate rises ≈ 1.36×
>   (`ADR-0053` finding 4: 2 340 431 × 1.09 against 1 878 626). The Orchestrator reads `ABC-235` and `ABC-240`
>   together at ≈ 1.3–1.4×. Whether that is enough for `position-6` itself is `UNKNOWN - verify` until `A8` runs.
> - **Changed:** `A5`'s `G6`, `A7` (met by the acceptance), `A8` (new: the forecast), § Dependencies and the DoR.
>   **DoR 9/10 → 10/10. Backlog → Ready.**

## Problem

- **User:** the owner at level 5.
- **Pain:** `quiesce` stands pat unconditionally (`src/quiescence.ts:100-101`), also when the side to move is in check.
  SA probe Q2 (`4k3/8/8/8/8/8/4R3/4K3 b - - 0 1`, only quiet king evasions): `quiesce` = static = −548. A capture
  inside quiescence that gives check is then scored as if the checked side could pass, and a capture that mates is not
  scored as mate past the leaf (row 1c; probe Q1: `quiesce` = 78 where Qxf7 mates).
- **Value:** quiescence scores checks and mates that arise inside a capture sequence correctly.
- **Honest prior:** `ABC-210` (a +1 ply extension at a frontier node in check) read NEUTRAL −4.8 ± 16.2 over 800
  games. This ticket is not that: it searches evasions inside quiescence, at every quiescence ply, which was never
  built. Its play effect is `UNKNOWN - verify` (`RISK-EPIC010-02`).

## Scope

1. In `quiesce`: when the side to move is in check, no stand pat; generate all legal evasions (quiet included) and
   search them; if there are none, return a mate score at that ply.
2. Bounded: `QUIESCENCE_MAX_PLY` (8) stays the runaway guard; an evasion node counts toward it.
3. An `ADR-0026` d10 off-door pair: one door per recursion reproduces the pre-ticket search node for node.
4. The ADR (Dependencies).

## Out of scope

- Quiet checks searched in quiescence (`ABC-210` form (b), not built; not re-proposed). Stalemate detection inside
  quiescence (`EPIC-010` § Out of scope). Quiet promotions (`ABC-229`). A full-width check extension (`ABC-210`).

## Acceptance criteria

- **A1 (the door).** **Given** the `ABC-078` `A3` corpus, **then** the new door is node-equal, cross-build, to base's
  shipped path, and every pre-existing door is node-equal to its pre-ticket self (`G4`).
- **A2 (in check).** **Given** `Q-SET`'s ≥ 6 in-check rows (probe Q2 among them), **when** `quiesce` runs at qply 0
  with a full window, **then** on every row the score differs from the static eval, and equals the best evasion's
  quiescence score (checked against a reference by a brute-force evasion search in the test).
- **A3 (mate).** **Given** `Q-SET`'s ≥ 6 capture-mate rows (probe Q1 among them), **when** quiescence reaches the
  mated side, **then** it returns a mate score of the right sign and distance on every row.
- **A4 (growth).** **Given** `kiwipete` and `position-6` at fixed depth 6, **then** `search(…, 6).nodes` ≤ **1.5 ×**
  the door's (`ADR-0024` d3 headroom). The frozen-clock pre-check runs before the real-clock `G6`.
- **A5 (gates).** `G1` ≥ 54/58 (a newly solved row is reported; raising the baseline is QE's), `G2` (the evaluator
  is untouched, so read only if `ADR-0034` asks), `G5`, `G6` "≥ base" by its rule when `A8` fits (on a miss, under the
  owner's reading of OQ-228-1), depth floor 6, `G8`, `G9`, `G10`.
- **A6 (the reading).** The smoke pair of `EPIC-010` § The merge rule (owner Q4 = (e), extended, 2026-10-29), on the candidate head rebased on `main`, before the merge: S-1 0 faults, S-2 0 losses on time, S-3 D ≥ 3.0 of 10 (else ≥ 7.0 of 20), S-4 R ≥ 3.0 of 10 (else ≥ 7.0 of 20). Reported: each smoke's W/L/D and score, the ledger's pooled R score since the last batch, and `G11`.
- **A7 (the ADR).** The ADR exists, names the evasion rule, the mate score and the door, and records that it was
  reported to the owner. *(Met 2026-10-30: `ADR-0053`, accepted by the owner.)*
- **A8 (the `G6` forecast; `ADR-0053` decision 9, OQ-228-1).** Before the graded `G6` and the smokes, on this ticket's
  base (`main` with `ABC-235` and `ABC-240`): base's completed depth and node count at 3 s from one real-clock
  `chooseMove` per board (kiwipete, position-6), ALONE, in plain `node`; then head's `chooseMove` on a frozen clock to
  that depth. Head's nodes × 1.09 are set against base's 3 s nodes, and both percentages are reported.
  - **≤ 100 % on both boards:** `G6` is read by its rule, and OQ-228-1's clause does not apply.
  - **> 100 % on either board:** the SE stops. `G6` and the smokes wait on the owner's reading of "increase 3s to
    4s".
  - Reference on pre-`ABC-235` `main`: 85 % and 125 %.

## NFR triggers

- **`NFR-005`:** at risk from node growth (A4, A5's `G6`). The depth-6 floor does not move; a miss is NOT MET.
- **`NFR-004`:** `G5`. **`NFR-008`:** fixed-depth rows only in the default lane; 0 real-clock rows.
- **Security:** no input path changes.

## Test notes

1. `Q-SET`'s rows are frozen by QE before the build and committed as a test fixture.
2. A brute-force reference for A2 lives in the test only (no production counter).
3. UAT is owed (production lines). The QE verdict signs it.

## Size and priority

- **Size: M.** One function's control flow plus a door pair and an ADR; `ABC-210` was M.
- **Priority: P2.** The strongest code evidence of § B's list.

## Dependencies

- **`ADR-0053` ACCEPTED by the owner, 2026-10-30, as written.** It amends `ADR-0024` decision 4, supersedes
  `ABC-079`'s recorded decision (`src/quiescence.ts:21-24`) for these items, and adds the `ADR-0026` d10 door pair. It
  also names `ABC-229`'s quiet promotions.
- **OQ-228-1 answered 2026-10-30:** build it fully. Its "3s to 4s" clause is conditional on an `A8` miss, and its
  reading is pending the owner. It does not block the build.
- **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`). `ABC-225` is no longer needed before this ticket; it is the batch's instrument.
- Shares `src/quiescence.ts` with `ABC-229`: this one first.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ probes Q1, Q2 |
| 2 | scope and out-of-scope | ✅ 4 items; `ABC-210` forms out |
| 3 | INVEST | ✅ one mechanism; M; testable |
| 4 | testable, measurable acceptance | ✅ every row measurable; A6 is the smoke pair (`EPIC-010` § The merge rule, S-1–S-4); A8 ≤ 100 % on both boards, else stop |
| 5 | dependencies known | ✅ `ADR-0053` (ACCEPTED 2026-10-30); `ABC-235` merged; OQ-228-1 answered |
| 6 | NFR triggers with targets | ✅ nodes ≤ 1.5 × at depth 6; depth floor 6 |
| 7 | test notes | ✅ 3 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ none for the build. The "3s to 4s" reading is needed only on an `A8` miss, and `A8` names the stop |

**DoR 10/10 (re-scored 2026-10-30, `bapm-owner-adr-fold`). Ready.** *(Was 9/10, waiting on the ADR.)*
