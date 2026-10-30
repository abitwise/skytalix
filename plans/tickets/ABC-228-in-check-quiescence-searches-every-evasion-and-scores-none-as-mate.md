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
>   and the Orchestrator takes the question to him. *(Answered 2026-10-30: (ii), level 5's per-move time; see the
>   block below.)*
> - **The miss is borderline.** Head reaches depth 10 on `position-6` at 3 s only if the node rate rises ≈ 1.36×
>   (`ADR-0053` finding 4: 2 340 431 × 1.09 against 1 878 626). The Orchestrator reads `ABC-235` and `ABC-240`
>   together at ≈ 1.3–1.4×. Whether that is enough for `position-6` itself is `UNKNOWN - verify` until `A8` runs.
> - **Changed:** `A5`'s `G6`, `A7` (met by the acceptance), `A8` (new: the forecast), § Dependencies and the DoR.
>   **DoR 9/10 → 10/10. Backlog → Ready.**

> **FOLDED 2026-10-30 by BA/PM** (task `bapm-q3c-oq228ii-fold`, records only, at `main` `7b8eeb94`). The owner read
> "3s to 4s" as **(ii), level 5's per-move time**, verbatim *"QQ-228-1: ii"* (`orch-2026-10-29g` `…c4ab73de`).
> `ADR-0053` decision 10's 2026-10-30 block is the design (Architect `arch-q3c-oq228ii` `…b86f7d93`); where this page
> is shorter, the ADR rules.
>
> - **All of it is conditional on an `A8` miss.** If `A8` reads ≤ 100 % on both boards, nothing below happens and `G9`
>   holds as written.
> - **On a miss:** no new owner word is needed. The SE builds Scope 5 in this ticket, then re-reads the forecast at
>   4 000 ms (`A9`, bar ≤ 133 %). Above 133 % on either board, (ii) does not cover it: the SE stops, and it goes back
>   to the owner.
> - **The `rating.ts` R literal (3000 → 4000) is carried by this ticket**, in the same merge, before the R smoke.
>   `ABC-225` is Blocked (thermal) and unmerged, so it cannot land first. Its branch adds a second `3000` (`rpair`'s
>   budget); when it rebases onto a `main` that carries (ii), it moves that one too (dated line on `ABC-225`).
> - **Changed:** Scope 5 (new), § Out of scope, `A5`, `A6`, `A8`, `A9` (new), § NFR triggers, § Test notes 4,
>   § Dependencies, § Follow-ups (new). **DoR stays 10/10. Ready.**

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
5. **Only on an `A8` miss: OQ-228-1 (ii), data only** (`ADR-0053` d10, 2026-10-30):
   - `LEVELS[5].budgetMs` 3 000 → **4 000** (`src/levels.ts`) and `DEFAULT_BUDGET_MS` 3 000 → **4 000**
     (`src/engine.ts`), so `ADR-0045` D2's equality holds;
   - the test literals and the rows that read the constant follow them. The ADR names `src/levels.test.ts` `:250`,
     `:313`, `:346`, `:373`, `:264`, `src/engine.test.ts:914` and `src/cli.test.ts:4505`, read at `c0698ddd`; the SE
     greps for the rest (`UNKNOWN - verify` that the list is complete);
   - `tools/rating/rating.ts` R mode's skytalix literal `3000` → **4000** (`:405` on `main`; `st=4`, and
     `timemargin = CEILING_MS − ms` reads 1 000 with no further edit).

## Out of scope

- Quiet checks searched in quiescence (`ABC-210` form (b), not built; not re-proposed). Stalemate detection inside
  quiescence (`EPIC-010` § Out of scope). Quiet promotions (`ABC-229`). A full-width check extension (`ABC-210`).
- Under (ii): every other level value (`LEVELS[1..4]`, `LEVELS[6..7]`, `DEFAULT_LEVEL`, `HARDEST_LEVEL`,
  `HARD_CEILING_MS`) and `ADR-0045` D3's mechanism. Re-cutting levels 6–7 (the owner's). D's frozen B = 1 500 ms.
  The NFR catalog text, the `ADR-0045` fold, the `AGENTS.md` level line and the ladder re-take (§ Follow-ups).

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
  - **Under (ii)** (`A8` missed, `A9` met): `G5` reads level 5 at ≤ 4 s, with the 5 s ceiling. `G6` reads each build
    at its own `LEVELS[5]`, head at 4 000 ms against base at 3 000 ms, by the same rule (5 interleaved runs, the
    median, any run below depth 6 FAILs). `G11` reads level 5's choice at 4 s, reported. `G8` reads the real-clock
    rows at `DEFAULT_BUDGET_MS` (`src/search.pvs-lmr.test.ts:738`, `src/transposition.test.ts:674`); whether they run
    in the default lane is `UNKNOWN - verify`. **`G9` is waived on `LEVELS[5].budgetMs` only**; every other value it
    names is byte-identical to base.
- **A6 (the reading).** The smoke pair of `EPIC-010` § The merge rule (owner Q4 = (e), extended, 2026-10-29), on the candidate head rebased on `main`, before the merge: S-1 0 faults, S-2 0 losses on time, S-3 D ≥ 3.0 of 10 (else ≥ 7.0 of 20), S-4 R ≥ 3.0 of 10 (else ≥ 7.0 of 20). Reported: each smoke's W/L/D and score, the ledger's pooled R score since the last batch, and `G11`.
  - **Under (ii):** the R smoke runs `tools/rating/rating.ts` from the candidate head, whose R literal reads 4000;
    QE records the tool's commit. D is unchanged (B = 1 500 ms). S-4's bar (≥ 3.0 of 10) does not move. The R score
    is reported and **never compared with a 3 000 ms reference** (`EPIC-008`'s R(close) 64.75 %, 2 015.6 ± 49.5, the
    trend flag at ≤ 44.75 %). So this smoke's 4 000 ms R row is recorded in the ledger but not pooled with the
    3 000 ms rows (BA/PM's reading of that rule). The pooled score reported is the pool of the earlier rows, judged
    at 3 000 ms. **The trend pool closes at this merge**, and later rows wait for the next batch.
- **A7 (the ADR).** The ADR exists, names the evasion rule, the mate score and the door, and records that it was
  reported to the owner. *(Met 2026-10-30: `ADR-0053`, accepted by the owner.)*
- **A8 (the `G6` forecast; `ADR-0053` decision 9, OQ-228-1).** Before the graded `G6` and the smokes, on this ticket's
  base (`main` with `ABC-235` and `ABC-240`): base's completed depth and node count at 3 s from one real-clock
  `chooseMove` per board (kiwipete, position-6), ALONE, in plain `node`; then head's `chooseMove` on a frozen clock to
  that depth. Head's nodes × 1.09 are set against base's 3 s nodes, and both percentages are reported.
  - **≤ 100 % on both boards:** `G6` is read by its rule, and OQ-228-1's clause does not apply.
  - **> 100 % on either board:** the SE stops and reports. ~~`G6` and the smokes wait on the owner's reading of
    "increase 3s to 4s".~~ *(2026-10-30: the reading is (ii).)* The SE then builds Scope 5, and `A9` runs before the
    graded `G6` and the smokes.
  - Reference on pre-`ABC-235` `main`: 85 % and 125 %.
- **A9 (the re-forecast at 4 000 ms; only on an `A8` miss; `ADR-0053` d10).** **Given** Scope 5 built, **when** `A8`'s
  measure is re-read with head given 4/3 of base's time, **then** head's nodes × 1.09 are set against **4/3 × base's
  3 s node count** on kiwipete and position-6, and both percentages are reported in `A8`'s units.
  - **≤ 133 % on both boards:** `G6` is read under (ii) (`A5`), then the smokes.
  - **> 133 % on either board:** (ii) does not cover the miss. The SE stops, and the Orchestrator takes it to the
    owner.
  - Reference: 125 % (position-6) and 85 % (kiwipete). The linear time-to-nodes scale is `UNKNOWN - verify`; the
    graded `G6` decides.
  - **Data rows:** `LEVELS[5]` = `{ budgetMs: 4_000, blunderRate: 0 }`, `DEFAULT_BUDGET_MS` = 4 000, `ADR-0045` D2's
    equality row green, and `LEVELS[1..4]`, `LEVELS[6..7]`, `DEFAULT_LEVEL`, `HARDEST_LEVEL`, `HARD_CEILING_MS`
    byte-identical to base. `tools/rating/rating.ts` R mode passes skytalix 4000 (a source read at the candidate
    head: `mode === "r" ? 4000`).

## NFR triggers

- **`NFR-005`:** at risk from node growth (A4, A5's `G6`). The depth-6 floor does not move; a miss is NOT MET.
- **`NFR-004`:** `G5`. **`NFR-008`:** fixed-depth rows only in the default lane; 0 real-clock rows.
- **Under (ii)** (`ADR-0053` d10): `NFR-004` reads ≤ 4 s at the default, and the 5 s ceiling at levels 1–5 stays, so
  level 5's margin is 1 000 ms (about 30× `AR-NFR004-A`'s ≤ 31 ms overshoot). `NFR-005`'s referent becomes the
  default's 4 s; its depth-6 FAIL floor and depth-7 WARN do not move. The catalog text is Security/NFR's, at this
  ticket's gate. These moves are on the owner's word (`…c4ab73de`), not a new bound.
- **Security:** no input path changes.

## Test notes

1. `Q-SET`'s rows are frozen by QE before the build and committed as a test fixture.
2. A brute-force reference for A2 lives in the test only (no production counter).
3. UAT is owed (production lines). The QE verdict signs it.
4. Under (ii): the 3 000 ms references stay on record and are never compared with a 4 000 ms reading. From this
   merge on, both sides of later tickets' `G6` run at 4 000 ms, and both sides of every batch run at 4 000 ms
   (milestone 1's batch and the epic-close `M2` batch), so a batch measures code, not time. The passing batch's head
   score at 4 000 ms becomes the trend's new reference (`EPIC-010` § The merge rule). Its added wall time is
   `UNKNOWN - verify`.

## Size and priority

- **Size: M.** One function's control flow plus a door pair and an ADR; `ABC-210` was M.
- **Priority: P2.** The strongest code evidence of § B's list.

## Dependencies

- **`ADR-0053` ACCEPTED by the owner, 2026-10-30, as written.** It amends `ADR-0024` decision 4, supersedes
  `ABC-079`'s recorded decision (`src/quiescence.ts:21-24`) for these items, and adds the `ADR-0026` d10 door pair. It
  also names `ABC-229`'s quiet promotions.
- **OQ-228-1 answered 2026-10-30:** build it fully. Its "3s to 4s" clause is conditional on an `A8` miss, and its
  reading is ~~pending the owner~~ **(ii), level 5's per-move time** (2026-10-30, `…c4ab73de`; `ADR-0053` d10). It
  does not block the build. Above `A9`'s 133 %, it goes back to the owner.
- **The `rating.ts` R literal is this ticket's** (BA/PM, 2026-10-30). It must land before this ticket's R smoke, and
  `ABC-225` (the other candidate) is Blocked on the owner's thermal call and unmerged. `ABC-225`'s branch also edits
  `tools/rating/rating.ts` and adds `rpair`'s own `budget: 3000`; whichever merges second rebases, and if (ii) is on
  `main` by then, `ABC-225` moves its `rpair` budget to 4 000.
- **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`). `ABC-225` is no longer needed before this ticket; it is the batch's instrument.
- Shares `src/quiescence.ts` with `ABC-229`: this one first.

## Follow-ups (only if Scope 5 is built; `ADR-0053` d10's re-reads)

| what | who | when |
|---|---|---|
| `G5`, `G6`, `G11` at 4 s | QE | this ticket's gate (`A5`) |
| `NFR-004` and `NFR-005` catalog text | Security/NFR | this ticket's gate |
| `ADR-0045` dated in-place fold: D1's level-5 row, D2's "today's level 3" and `NFR-005`'s referent (history), § AMENDMENT A3's margin 2 000 → 1 000 at level 5, the 5 → 6 step at 1.25×; `ADR-0044` D11 (UCI `Skill Level` 5 plays 4 000 ms with no code change) recorded there | BA/PM | at this ticket's merge |
| `EPIC-008`'s `G6` and `G9` text | BA/PM | at this ticket's merge |
| the ladder verdict: STALE under `ADR-0038` d6 (a merge touching `src/levels.ts`); does not gate the merge | Orchestrator (schedules the re-take) | after the merge |
| `ABC-231` `A1` (replays `ABC-205`'s `G6`) reads at the new referent | BA/PM | at this ticket's merge |
| any `EPIC-009` reading that plays level 5 at its fixed budget (`UNKNOWN - verify` which) | BA/PM | at this ticket's merge |
| `AGENTS.md`'s "level 5 (≤3 s/move …)" line | Scribe | at this ticket's merge |
| `ABC-225`'s `rpair` budget 3 000 → 4 000 | the SE who rebases `ABC-225` | when it rebases onto (ii) |

**Rollback** (`ADR-0053` d10): `LEVELS[5]`, `DEFAULT_BUDGET_MS`, the `levels.test.ts` literals and the R literal go
back to 3 000. Any reference read at 4 000 ms is then stale.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ probes Q1, Q2 |
| 2 | scope and out-of-scope | ✅ 4 items; `ABC-210` forms out |
| 3 | INVEST | ✅ one mechanism; M; testable |
| 4 | testable, measurable acceptance | ✅ every row measurable; A6 is the smoke pair (`EPIC-010` § The merge rule, S-1–S-4); A8 ≤ 100 % on both boards, else Scope 5 and A9 ≤ 133 %, else stop |
| 5 | dependencies known | ✅ `ADR-0053` (ACCEPTED 2026-10-30); `ABC-235` merged; OQ-228-1 answered, reading (ii); the R literal placed here |
| 6 | NFR triggers with targets | ✅ nodes ≤ 1.5 × at depth 6; depth floor 6 |
| 7 | test notes | ✅ 3 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ none for the build. ~~The "3s to 4s" reading is needed only on an `A8` miss, and `A8` names the stop~~ The reading is (ii) (2026-10-30); only an `A9` reading above 133 % goes back to the owner, and `A9` names that stop |

**DoR 10/10 (re-scored 2026-10-30, `bapm-owner-adr-fold`; re-checked 2026-10-30, `bapm-q3c-oq228ii-fold`: rows 4, 5
and 10 carry (ii), still 10/10). Ready.** *(Was 9/10, waiting on the ADR.)*
