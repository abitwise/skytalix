---
id: ABC-298
title: "V3, narrowed by ADR-0077: at full-width nodes below the root of remaining depth 1 and 2, the hash move is checked for legality without the move list and searched first; if it does not cut off, the list is built and ordered exactly as today and the hash move is skipped. Node-identical, value-identical, intent SPEED: no switch, no door, no games. A count probe can stop it before the build; then S2 at ≥ 1.03× on two of three boards and ≥ 1.00× on the third. Captures before quiets (stages 2 and 3) are out"
status: in-design
column: In Design
size: M
priority: P3
epic: EPIC-011
feature: —
adr: "ADR-0077, accepted by the owner 2026-11-08 (orch-2026-10-30a …44810861, \"accept ADR-0077 ; yes\"), in force only at this ticket's merge: the form gated at remaining depth 1 and 2 d1; the legality seam d2; the identity duty d3; captures before quiets out d4; no switch and no door d5; SG0–SG2 d6; SG3's bar and spread rule d7; no games d8; the order, count probe then QE's freeze then the build d9; kingExposure out d10; NFR-008 ≤ +0.10 s d11; intent SPEED and the stop d12. It amends no ADR. Its § Status is the Architect's"
---

# ABC-298: the hash move before the list, at remaining depth 1 and 2 (V3, narrowed)

> **`ADR-0077` ACCEPTED, IN FORCE ONLY AT THIS TICKET'S MERGE; NARROWED TO THE DEPTH-1–2 GATE; STAGES 2 AND 3 OUT;
> NODE-IDENTICAL, NO GAMES; A STOP OR A MISS ENDS V3; DoR 10/10, 2026-11-08, by BA/PM** (task `bapm-ABC-298-accept`,
> records only, at `main` `3458e31c`; nothing run). Sources: the owner's "accept ADR-0077 ; yes" (`orch-2026-10-30a`
> `…44810861`), and `ADR-0077` § Consequences ("Records owed by BA/PM") and d9 step 2.
> - **Copied from the ADR, no new bar:** the title and scope narrowed by d1, with d4's stages 2 and 3 out; SG0–SG2 from
>   d6 and SG3 from d7, in the ADR's words; d8's "no games" and why; d9's count probe, its STOP rule and the order with
>   QE's freeze after GO and before the build; `NFR-008` ≤ +0.10 s (d11); intent SPEED, value-identical, and the stop
>   (d12); F1–F8. This page's "the ADR is owed", "value-identical or not" and the value-changing branch are out, and the
>   old text is in git history. **If this page and the ADR disagree, the ADR holds.**
> - **The owner's two answers** (`ADR-0077` § The owner's questions): (1) `ADR-0077` accepted; (2) **yes: a count-probe
>   STOP, a miss on SG3, or identity not kept ends V3.** No wider form (captures first, a deeper gate) without a new ADR
>   and his word (`…44810861` item 2).
> - **Size stays M** (`ADR-0077` § Consequences). Priority stays P3. **Status and column read In Design,** as the board
>   has since `36baff11`; that move was the Orchestrator's.
> - **DoR 10/10.** Row 10's blocker, the owed ADR, is gone. The count probe and QE's freeze are steps of d9's order,
>   each with its own proof, not inputs this page still waits for. The next board move is the Orchestrator's.

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog** (task `bapm-epic011-areas`, records only, at `main` `b274711c`;
> nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` Phase 5,
> stub row V3.
> - **Its wait is met:** "after V2" (`ABC-254`, lazy legality) — `ABC-254` merged at `3bfe180e` on 2026-11-01
>   (`EPIC-010`).
> - **Hold:** the ADR only. It also waits its turn on `orderMoves` after `ABC-283` (which edits the order).
>   *2026-11-08 (`bapm-ABC-298-accept`): both met. `ADR-0077` is accepted; `ABC-283` merged `58e90d07`.*
> - **Named elsewhere as a re-open premise:** `ADR-0065` § Status re-open 2 (O3s: "ordering also saves generation work
>   that a node count cannot see") and `ADR-0063` § Status re-open 2 (O1h). Both are inside `ABC-283` now.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** every game; nodes per second.
- **Pain:** a full-width node generates every legal move before it searches the first, even when the hash move cuts off
  at once (82 % of cutoffs fall on the first move, `ADR-0063` § Context). The generation done for the other moves is
  wasted.
- **Value:** `ADR-0056` D2 row V3 estimates **+10–30 Elo** (an estimate, [J]). `ADR-0055`'s 50–100 Elo per speed
  doubling is the conversion basis ([D]). Not a reading.
  *2026-11-08 (`bapm-ABC-298-accept`; `ADR-0077` § Context "Why it can pay"): **+10–30 was for the full
  staged form.** `…5a155b2c` gave 1.03–1.10× nodes per second and +3 to +15 Elo before the gate; with the gate the
  Architect puts it lower, "a few Elo at best", the speed bar below even odds. All judgement, not a reading. How much of
  a node's time the gate can save is `UNKNOWN - verify`; the count probe bounds it.*
- **Where it costs** (`ADR-0077` § Context): at a node where the hash move exists and does not cut off, V3 pays for the
  check and then for the full list anyway. SG3's third-board floor of ≥ 1.00× is there for that case.

## Scope

`ADR-0077` governs each line. *2026-11-08 (`bapm-ABC-298-accept`): the cut's scope 1–4 (three stages) is replaced by
d1–d3; stages 2 and 3 are out (d4).*

1. **Where it acts** (d1): a full-width node below the root, in both recursions (`src/search.ts` `negamax` and
   `src/engine.ts` `negamax`), when all of these hold: the probe hit (`slot !== -1`); the table is on, and the ordering
   is `"full"`; **the remaining depth is 1 or 2.** One named constant holds the 2, with its reason in its comment.
   **Everywhere else the code path is today's:** every node of remaining depth 3 or more, the roots and quiescence,
   every door with the table off, and the two ordering doors.
2. **The sequence at such a node** (d1): today's steps up to and including the null move; read the slot's move bits,
   live, once, and `countermoveAt(previous)` there too; check the move for legality without the list (d2) — if it is
   not a legal move here, the node runs exactly as today from `legalMoves` on; search the hash move first as index 0 by
   today's loop body; **if it cuts off**, make today's index-0 cutoff writes (d3 item 10), store, and return, with
   nothing generated; **if not**, run `legalMoves` and `orderMoves` as today, and the loop runs from list position 1,
   carrying `best`, `bestMove`, `alpha` and `searchedQuiets`.
3. **The legality check without the list** (d2): an oracle of `entryMove(slot, legalMoves(position))` — `null`, or a
   `Move` whose six fields equal the listed move's, the position byte-identical on return. One export in
   `src/moves.ts` (exactly `generateMoves(position).filter((m) => m.from === from)`, from the same per-piece helpers;
   `generateMoves` itself not edited). One export in `src/legal.ts` (find the move, test it with make/test/unmake; it
   always tests). The move-bits read stays in `src/transposition.ts`, live word 2 (`ADR-0025`). Names and signatures
   are the Engineer's.
4. **The identity duty** (d3, items 1–15), in full in the ADR. The gate is part of identity, not a tuning knob.
5. **Nothing else changes** (d1): the order's keys and tiers; the killers, history and countermove tables; the table's
   layout and replacement; `generateMoves` and `legalMoves`; quiescence; the roots; the evaluation.

## Out of scope

- Bitboards (V4, `Q-3K-8`, the owner's). Any change to the evaluation or the order's keys. Lazy legality (`ABC-254`,
  merged).
- *2026-11-08 (`bapm-ABC-298-accept`; `ADR-0077` d4, d5, d10, § Alternatives):* **captures before quiets, and the killers
  and quiets as a stage (the cut's stages 2 and 3).** They come back only after V3 merges, with a fresh profile, under
  their own ADR and the owner's word. Also out: the gate above remaining depth 2; a switch or a door; hash first at the
  root; `kingExposure`'s cut (`ADR-0076` d6), neither in V3's held window nor on its head; a legality check by case
  analysis; pseudo-legal search; the read from the verified copy (`hitData`).

## Acceptance criteria

`ADR-0077` d6 and d7 fix the bars below. None is new in kind, none is loosened after Ready, and each can be met by a
correct build. **Intent: SPEED, value-identical** (d12), fixed here and never re-classed after a figure is seen.

| row | what | lane | the bar (`ADR-0077` d6, word for word) |
|---|---|---|---|
| **SG0** | perft | default and `PERFT_DEEP=1` | `src/perft.test.ts` passes 32 / 32 at the head. The file is byte-identical to the freeze's blob |
| **SG1 (a)** | the shipped path, frozen | `SEARCH_DEEP=1` (existing file) | `search()` at depth 8 on kiwipete and position-6. `chooseMove` with `maxDepth` and `now: () => 0` at kiwipete depths 8 and 9, and position-6 depths 8, 9 and 10. Nodes, root move and score equal the freeze exactly. Where a row on `main` already pins one (the `ABC-303` depth-8 rows), it is that row, figure unchanged |
| **SG1 (b)** | every door, out of tree | QE's, against the build's merge-base | `ABC-254` A3's `G4` form, by reference: the `ABC-078` A3 corpus and `ABC-121`'s 190 at fixed depth 5, every door, `chooseMove` at budgets 3 and 5 on `tickingClock(1)`. Move, score, depth, nodes and clock reads byte-equal to base |
| **SG1 (c)** | every existing row | all lanes | every door, count and deep row on `main` stays green, with no expected figure changed. `git diff <freeze>..<head> -- 'src/*.test.ts'` adds rows and changes none |
| **SG2 (a)** | the check, by hand | default (existing files: `src/legal.test.ts`, `src/moves.test.ts`) | returns the oracle's answer, with field-equal moves, and leaves the position byte-identical (FEN and Zobrist key). Cases: a legal castle; a castle whose right is set but which passes an attacked square, or whose rook is absent; a legal en passant; an en passant that exposes the king along the rank; a pinned piece leaving its line; a king stepping into attack; an under-promotion; a promotion field on a non-promotion move, and none on a last-rank push; an empty or enemy from-square; a slider through a blocker; a non-evasion in check; a non-king move in double check. Plus the per-square generator's oracle row |
| **SG2 (b)** | the check, by walk | `ENGINE_DEEP=1` | on `ABC-254` A1's two walks, at every position: each legal move's bits return a field-equal twin, and the bits of every legal move of the parent position (a natural stale set) return the oracle's answer. 0 mismatches, 0 mutations |
| **SG2 (c)** | never played | default | a search whose table holds an illegal or stale move at a node of remaining depth 1 or 2 that it reaches never makes that move (a `makeMove` spy), and returns a legal move with the position restored |
| **SG3** | speed | held host | d7, below |
| gates | as `ABC-254` A5 | — | `npm run lint`, `typecheck`, `test` and `build` green at every commit; `G1` 54 / 58 with rows equal (`PUZZLE_DEEP=1`, a virtual clock, so node-identical means equal); `G4` = SG1; `G6` "≥ base" (d7); `G7` growth 0; `NFR-008` (d11) |

**SG3, the bar and the spread rule** (`ADR-0077` d7, fixed before any reading):
- **The instrument: S2, by `ADR-0055` D3 as amended by D3-V2, unchanged.** `chooseMove` at 4 000 ms on the wall clock,
  one fresh process per run, base and head on the same Node binary; **boards:** kiwipete, position-6 and the start
  position; **statistic:** per board, head's median nodes per second ÷ base's median; 5 admitted pairs per board,
  interleaved, base first when the admitted count is even and head first when it is odd; **admission, blind to build and
  outcome:** no foreign vitest or `cutechess-cli`, both runs at ≤ 0.8 foreign cores, after-run Tctl below 85 °C, a pair
  not admitted is discarded and logged; at most 15 attempts per board per schedule, fewer than 5 admitted is VOID-LOAD.
- **The spread rule: D3's 5 %,** (max − min) / median per build and board. Above it, the board takes one re-run, then
  VOID. No term loosens it.
- **The agreement guard** (D3-V2 item 4) reads the two numbers 1.03 and 1.00. If the median paired ratio and the graded
  ratio fall on different sides of either, the board takes its one re-run, then VOID.
- **The bar: MET when head ÷ base is ≥ 1.03 on at least two boards and ≥ 1.00 on the third.**
- **`G6` "≥ base"** (`NFR-005`) is read in the same held window, after SG3.
- **The host:** a held host (the owner's word that the host is quiet, covering his other projects, with a `ps` check
  first); the host lock for the whole session, one process at a time; QE's pre-registration sealed before the first
  timed run; the brief records the window's start and end UTC, and that nothing else ran. About 15–30 min (estimate).
- **Outcomes:** **MET:** SG3 passes. **NOT MET:** SG0–SG2 green and the bar missed — not merged; QE records a
  `failed-attempt` note; BA/PM closes the ticket as dropped; by the owner's yes to question 2, V3 closes. **VOID or
  VOID-LOAD:** not a result and not a miss; it may be re-read under a fresh pre-registration, on its own runs alone, never
  pooled. **No sealed term is waived on a close figure.**

**No games, and why none are owed** (`ADR-0077` d8):
- `EPIC-011` § The per-change rule: *"Value-identical tickets keep the S2 nps reading and play no games."* The 100-game
  read is per strength-changing ticket; a node-identical search changes no value at any depth.
- Games add no safety: at a fixed depth the move, the score and every node are `main`'s, and SG1 checks that exactly.
  Under a clock the only difference is the depth reached, and S2 measures the rate behind it directly.
- Games could not see the gain: C2′ resolves about ± 48 Elo at 95 %; the gain here is a few Elo by estimate.
- It is counted in the epic's close read (`ABC-299`, R3), which carries every merged change.

**The count probe and its STOP** (`ADR-0077` d9 step 3; `arch-ABC-298-probe`, the Architect's, under the host lock,
untimed, no held host; its plan cites d9 and is sealed before it runs):
- **Instrument:** a scratch copy of `main` at the accepted tip (`git archive`, never `src/`), with counters in
  `src/engine.ts` `negamax`, the shipped `chooseMove` path; `chooseMove` with `maxDepth` 9 and `now: () => 0` on
  kiwipete, position-6 and the start position; one run each, on one core.
- **Counts per board:** G, full-width nodes below the root that reach `legalMoves` today; H, of those, the nodes inside
  d1's gate whose `entryMove` is not null; C, of H, the nodes whose hash move cut off at index 0. INFO: H and C at every
  depth, and the total node count. **The share: s = C ÷ G.**
- **The rule:** **STOP if s < 0.048 on at least two of the three boards.** V3 then closes as "none", with no freeze and
  no build. Otherwise GO, to the freeze. Basis: speed-up at most 1 / (1 − 0.6 × s); 1 / (1 − 0.6 × 0.048) ≈ 1.0297.
- **GO means only "it can pay".** It says nothing about the bar, and no figure of it enters SG3. The probe creates no V3
  code and reads no SG1 or SG3 figure; the freeze stays blind.

### Falsifiers

*2026-11-08 (`bapm-ABC-298-accept`): the cut's F1–F4 are replaced by `ADR-0077` § What would falsify this.*

| # | clause | fires when | disposition |
|---|---|---|---|
| F1 | SG0 | perft red at the head, or `src/perft.test.ts` changed | a defect: generation is wrong. Back to the Engineer |
| F2 | d1–d3, SG1 | any SG1 row, door row or deep pin differs from the freeze | a defect check first. If a fix inside d1 and d2 makes it green, it is fixed and read again. If none can: **the stop** (d12). Never a re-pin |
| F3 | d2, SG2 | the check differs from the oracle, mutates the position, or an illegal move is made | a defect. Back to the Engineer; the Architect reviews the fix against `ADR-0003` (1-A) |
| F4 | d7, SG3 | the bar is missed with SG0–SG2 green | NOT MET, not merged, a `failed-attempt` note, BA/PM closes it as dropped. With question 2 yes (it is): V3 closes |
| F5 | d9, the probe | s < 0.048 on at least two boards | STOP: V3 closes as "none". No freeze, no build |
| F6 | d9, the order | a build commit with no freeze commit behind it | SG1 is not met to the letter, and QE says so. Whether it may still merge is the owner's |
| F7 | d11 | `NFR-008` over +0.10 s | UNRESOLVED, not a defect; it does not merge while over. To the Architect |
| F8 | d10 | V3's head carries any evaluation change | SG3 is not graded. Back to the Engineer |

### The stop (`ADR-0077` d12, with the owner's yes to question 2)

- **If identity cannot be kept, V3 stops.** It does not become a move-changing ticket with a door and C2′; it closes as
  "none". "Cannot be kept" means an SG1 or SG2 row that reads red after a defect check, where no fix inside d1 and d2
  makes it green. A fix that changes the order, the keys, the gate or which moves are searched is outside d1, so it is
  a stop, not a fix.
- **The probe's STOP and a miss on SG3 close V3 the same way** (`…44810861` item 2). A VOID reading is not a miss.
- **No wider form** (captures first, a deeper gate) **without a new ADR and his word.**

## The pins this ticket moves

**None expected** (`ADR-0077` § The pins this ticket moves). Every row there must read its `main` figure; a change is a
failure of identity (F2), never a re-pin. A deep row outside that table that reddens in the build is a STOP to the
Architect.

## NFR triggers

- **`NFR-005`** (`G6`): "≥ base" binds, read in SG3's held window, after SG3.
- **`NFR-008`** (≤ 10 s): ~~units only; perft deep stays opt-in.~~ *2026-11-08 (`bapm-ABC-298-accept`; `ADR-0077` d11):*
  **≤ +0.10 s on the lane for this ticket.** No figure above it is proposed; one would move a bar. SG2 (a) and (c) add
  about 15–20 units in existing default-lane files; no new default-lane file; SG1 and SG2 (b) are deep-lane rows only.
  The cost is an estimate (`UNKNOWN - verify`). If it reads over, `NFR-008` is UNRESOLVED by `…a49d69d7` § 5's form,
  not a defect, and the ticket does not merge while over; the route comes to the Architect. Perft deep stays opt-in.
- **`NFR-009`:** no new table. ~~(per-ply move buffers stated in bytes if they change)~~ *2026-11-08 (`ADR-0077` d11):*
  if the Engineer uses a fixed scratch for the per-square list, its bytes join `NFR-009` (a)'s sum, with a line on this
  page. `G7`: growth 0.
- **`NFR-001`:** `generateMoves` is not edited, so the perft half does not move. Perft rates stay INFO.

## Test notes

1. ~~QE freezes SG1's counts on `main` before the build.~~ *2026-11-08 (`bapm-ABC-298-accept`):* **`ADR-0077` d9's order
   holds, and the dispatch can check it:** (1) the owner's answer, met (`…44810861`); (2) these records; (3) the count
   probe, `arch-ABC-298-probe`, GO or STOP in a sealed `decision` note; (4) **QE's freeze, `qe-ABC-298-freeze`, only on
   GO, after the probe and before the build,** on `main`'s tip, under the host lock, not a timing read: SG1 (a)'s table,
   base's SG1 (b) outputs as a digest, the blob hash of `src/perft.test.ts` with the deep perft read 32 / 32, every door
   and deep row on `main` by file and title with its figures, the files that mock `./legal.ts` or `./transposition.ts`,
   and the `src/` tree id; (5) the Orchestrator confirms `git merge-base --is-ancestor <freeze commit> main`, that
   `main`'s `src/` tree is the freeze's, and that the brief cites the freeze note's id — no id, no dispatch; (6) the
   build, whose first commit descends from the freeze commit; (7) QE: stage 0, then SG0, SG1, SG2, the gates and
   `NFR-008`, then SG3 and `G6` in one held window on a sealed pre-registration; (8) UAT.
2. UAT: production lines, so owed unless the standing waiver applies; the QE verdict signs it.
3. *2026-11-08 (`ADR-0077` d3 item 14):* QE's freeze lists every file that mocks `./legal.ts` or `./transposition.ts`,
   and each stays green unchanged.

## Size and priority

- **Size: M** (`ADR-0056` D2; `ADR-0077` § Consequences: "Size stays M"). **Priority: P3.**

## Dependencies

- ~~**The ADR** (the Architect's). DoR row 10.~~ *2026-11-08 (`bapm-ABC-298-accept`):* **`ADR-0077`, accepted**
  (`…44810861`), in force only at this merge.
- **d9's order:** the count probe (the Architect's), then QE's freeze on GO, then the Orchestrator's ancestor check,
  then the build. A held host for SG3 and `G6` only; the Orchestrator asks for it at the time.
- **After `ABC-283` on `orderMoves` / `src/search.ts` / `src/engine.ts`**, and one at a time with `ABC-288`. Shares
  `src/legal.ts` and `src/moves.ts` with any later legality ticket. *2026-11-08: `ABC-283` merged `58e90d07`; `ABC-288`
  was delivered by `ABC-303` (`434fa171`). Both met. File collisions now (`ADR-0077` § Consequences): `src/search.ts`,
  `src/engine.ts`, `src/legal.ts`, `src/moves.ts` and `src/transposition.ts`, one at a time with any ticket that edits
  the node order or legality. Whichever builds after V3 carries d3's duty.*

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ full generation before the first move; the value is an estimate *(2026-11-08: lower with the gate, "a few Elo at best", judgement)* |
| 2 | scope and out-of-scope | ✅ ~~scope 1–4~~ scope 1–5 from `ADR-0077` d1–d3; stages 2 and 3 out (d4) *(2026-11-08, `bapm-ABC-298-accept`)* |
| 3 | INVEST | ✅ M; one gate, one seam, both recursions, node-identical |
| 4 | testable, measurable acceptance | ✅ SG0 32 / 32 and a byte-identical file; SG1 exact against the freeze; SG2 0 mismatches, 0 mutations, never played; ~~SG3's number owed with the ADR~~ SG3 ≥ 1.03× on two boards and ≥ 1.00× on the third, S2 under D3-V2, 5 % spread rule; the probe's STOP at s < 0.048 on two boards *(2026-11-08)* |
| 5 | dependencies known | ✅ V2 met; ~~`ABC-283` first~~ `ABC-283` and `ABC-288` met; `ADR-0077` accepted; d9's order; the shared files *(2026-11-08)* |
| 6 | NFR triggers with targets | ✅ `NFR-005` ≥ base; `NFR-008` ≤ 10 s, ≤ +0.10 s on the lane *(2026-11-08)*; `NFR-009` no new table, `G7` growth 0 |
| 7 | test notes | ✅ 1–~~2~~ 3 *(2026-11-08)* |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ~~❌ **the ADR is owed** (value-identical or not, and the speed bar)~~ ✅ *2026-11-08 (`bapm-ABC-298-accept`):* `ADR-0077` is accepted (`…44810861`); value-identical, the speed bar fixed. The probe and the freeze are steps of d9's order, each a gate with its own proof; a STOP there closes the ticket by d12, it does not reopen this row |

~~**DoR 9/10. Backlog.**~~ **DoR 10/10. In Design** *(2026-11-08, `bapm-ABC-298-accept`)*. The board move is the
Orchestrator's.
