---
id: ABC-242
title: "On a blunder level (1–4), a root move that makes the third occurrence of a game position scores exactly 0, on the CLI and over UCI; every engine-path search is unchanged"
status: backlog
column: Backlog
size: S
priority: P3
epic: EPIC-010
---

# ABC-242: the blunder path sees the third occurrence at its root (QE-230-a)

> **Cut 2026-10-30 by BA/PM** (task `bapm-qe230a-followup`, records only, at `main` `691f9436`). Source: QE gap
> **QE-230-a** (MEDIUM, design) in `qe-ABC-230` `…ba5a249a`. `ABC-230` met its `A1` as worded, and `ADR-0054` prescribes
> the hand-off that leaves this gap. This is a design gap, not a build fault. **Waits in Backlog on one thing: an
> Architect reading** (§ Dependencies).

> **Architect reading 2026-10-30** (task `arch-ABC-242-reading`, records only, at `main` `ee7da249`; nothing was run).
> The design is `ADR-0054` § Proposed amendment 2026-10-30. **It is PROPOSED, so the owner's acceptance is the
> second wait** (§ Dependencies). Below are the facts for BA/PM to fold. Nothing else on this page was edited here,
> and the DoR re-score is BA/PM's.
>
> - **Where the check lives:** in `src/levels.ts` `blunder`. After a root move is made, and before its child search,
>   the child's repetition key is matched against the children's list (prior keys plus the root key). The walk is
>   `−4, −6, …`, bounded by `min(child clock, list length, 100)`.
>   - **Two or more matches: the move scores exactly 0, and its child is not searched.**
>   - `src/engine.ts` and `src/search.ts` are untouched (`ADR-0032` d1's fence). So is `createLevel`'s engine branch.
>   - The amendment adds to `ADR-0032` decision 1, by addition, and to `ADR-0054` decision 2's blunder bullet. That is
>     why it is PROPOSED.
> - **The owner's question:** *"On a blunder move at levels 1–4, should a root move that makes the third occurrence of
>   a game position score exactly 0, without its child search? The engine path does not change."* The answer that
>   settles it: "ADR-0054 ABC-242: accept" or "decline". Without an answer, nothing changes and this page stays in
>   Backlog.
> - **The parent-root count** (§ Out of scope, "Recorded for the Architect"): **ruled out of this ticket.** It stays
>   as `ADR-0054` d2 writes it. Changing it would make the engine count one prior key as path, which is an engine
>   change. Its effect is `UNKNOWN - verify`, and no ticket is cut for it (amendment A6).
> - **SE files:**
>   - `src/levels.ts`: the check, a private helper, a named 100-key constant that points at the ADR, and the doc
>     lines. It gains no new import and no new export.
>   - `src/levels.test.ts`: `A1`, `A2`, `A3`, `A5`, `A6`.
>   - `src/cli.test.ts` and `src/uci-session.test.ts`: `A4`.
>   - Nothing else under `src/`, `tools/` or `data/`.
> - **Expected values, derived by reasoning** (QE's probe set-up: rate 1, 2 000 ms, `virtualClock(1)`, seed 1;
>   `legalMoves` order is `d8e8 d8c8 d8d7 d8e7 d8c7`, read from `qe-ABC-230/raw/spot/blunder-probe.txt`).
>   - **A1, probe:**
>     - `scored[0]` is `{d8e8, 0}` exactly, and base scores it −1013.
>     - Exactly 4 child searches run for 5 legal moves, because only `d8e8` makes a repeat.
>     - Entries 1–4 inherit `d8e8`'s slice, so their values are `UNKNOWN - verify`. If they keep base's values
>       (`−1030 −1020 −1010 −1031`), the move played is `d8e7`, kind `blunder`. Either way the played move is not
>       `d8e8` unless those four entries collapse to one value.
>   - **A1, a strong pin (test note):** at least one of the extra fixtures should have its third-occurrence move
>     **last** in `legalMoves` order. Then every other entry equals base's exactly, and the last entry is 0.
>   - **A2:** the child list is `[P0 P1 P2 P3]` and the child clock is 4. The walk reads index 0 only, which gives
>     one match. So all 5 children run, and the whole list (and the played move) equals base's keyed list exactly.
>   - **A3:** the FEN is `3k4/8/8/8/8/8/8/1Q2K3 b - - 0 4`, with the 7 keys untrimmed. The child clock is 1, so the
>     walk reads nothing. All 5 children run, and the list equals base's with the same keys exactly.
>   - **A5:** unchanged code. The move played is the strict second-best of the returned list.
>   - **A6:** with no keys, or with an empty list, the list, `depth`, `nodes` and `elapsedMs` all equal base's.
>     Levels 5–7 and non-blunder draws are node-equal by construction, because the engine files are byte-identical.
> - **A4, how it is read:** neither surface prints the scored list. Three things run on the same seed, budget,
>   virtual clock, position and trimmed keys:
>   - the CLI seam (`createLevelSeam(1, …)`, with keys injected);
>   - UCI (`Skill Level 1`, an injected `random` that gives that seed, then `go`);
>   - a direct `createLevel(LEVELS[1], …)` call.
>
>   All three must give the same move. UCI's `info` `nodes` and `depth` must equal the direct call's. The direct
>   call's list must carry the 0. The seed must make level 1's draw (< 0.4) call for a blunder.
> - **Size and smoke:** **S stands.** The Orchestrator's **S2, no smoke** ruling fits: `tools/rating/rating.ts` sets
>   no `Skill Level`, so every D, R and batch move runs the unchanged level-5 engine path.
>   - **Correct `A8`:** the ladder lane (`src/ladder.test.ts:179`, `choose(h.position)`) hands in no prior keys, so it
>     is an identity row and not "the one playing check on the changed levels". `A1`–`A5` are the only reads of the
>     change.
>   - The `NFR-004` line: at most 49 comparisons per root move (not 50), and a check that fires saves a child search.

## Problem

- **User:** the owner (or a GUI over UCI) playing skytalix at levels 1–4 (`--difficulty 1..4`, UCI `Skill Level` 1–4).
- **Pain:** on a blunder move, `src/levels.ts` `blunder` scores each legal root move as minus `chooseMove` on its
  child. Each child search's root is the position after the move. `ADR-0054` decision 3 scans for repetition at
  nodes at ply ≥ 1 only, so no search checks its own root. A root move that makes the **third** occurrence is scored
  as if the position were new.
- **Evidence** (QE probe `qe-ABC-230/raw/qe-scripts/blunder-probe.mjs` → `raw/spot/blunder-probe.txt`): KQ v K,
  `4k3/8/8/8/8/8/8/1Q2K3 w - - 0 1` + `b1b2 e8d8 b2b1 d8e8 b1b2 e8d8 b2b1`, blunder forced (rate 1, 2 000 ms, virtual
  clock, seed 1). `d8e8` (the third occurrence) is scored **−1013 with the prior keys and −1013 without**. The
  whole scored list is identical: the keys change nothing on this path's root moves.
- **Value:** the blunder path ranks root moves the way the game will end them. Its "strict second-best"
  (`ADR-0032` decision 2) is then picked from a list that reads a third occurrence as a draw, as the engine path
  already does at the same level. The size of the effect in play is `UNKNOWN - verify`: `ABC-226`'s count read level
  5 games only, where this path never runs.

## Scope

The design is the Architect's (§ Dependencies). This page states the outcomes.

1. **The root move's third occurrence.** On the blunder path, a root move whose resulting position stood **twice**
   before in the reversible window (the prior keys handed to the level, within the child root's halfmove clock)
   scores **exactly 0**. One earlier occurrence (a second occurrence) keeps base's score: `ADR-0054`'s two-match rule
   before the root.
2. **Both surfaces, one change.** The CLI (`level-seam.ts`) and UCI (`uci-session.ts` `go` at `Skill Level` 1–4)
   both play through `createLevel`, so one change reaches both. No new input: the prior keys `ABC-230` hands in are
   the only data.
3. **The engine path is untouched.** Levels 5–7, a non-blunder draw at levels 1–4, and UCI `go` at the default
   level search exactly as on `main`, node for node.

## Out of scope

- The engine path's own root (a game position that is itself a third occurrence) and `chooseMove`'s root
  semantics for any caller other than the blunder path.
- The blunder construction otherwise (`ADR-0032` decisions 1–2: the shared deadline, the strict second-best), the
  levels' budgets and rates (`G9`), and the game-end threefold in `src/history.ts`.
- The repetition key itself (`ABC-241`, Q3 (c)).
- **Recorded for the Architect, not scoped:** inside a child search, the parent root's key sits in the child's
  prior list, so a line that returns to the parent root counts it as **before** the root (two matches needed). On
  the engine path the same position is the search's root and counts as **path** (one match). BA/PM's reading of
  `ADR-0054` decision 3 and `src/levels.ts:142`; whether it changes any score is `UNKNOWN - verify`. If the Architect
  rules it into this ticket, BA/PM re-scores the page.

## Acceptance criteria

- **A1 (third occurrence, scored 0).** **Given** QE's probe fixture above and ≥ 3 more fixture games (both colours,
  at least one a winning side and one a losing side), **when** the blunder path scores the root moves with the
  game's prior keys, **then** the move that makes the third occurrence scores **exactly 0**, and base scores it
  otherwise (probe: `d8e8` −1013). Read on the injected seam at a forced blunder (rate 1), on a virtual clock.
- **A2 (second occurrence, base).** **Given** the same fixture cut after `b1b2 e8d8 b2b1` (so `d8e8` is a **second**
  occurrence), **then** `d8e8`'s score equals base's.
- **A3 (clock bound).** **Given** A1's final position with its halfmove clock set to 0 in the FEN, and A1's prior keys
  handed in **untrimmed**, **then** the returning move keeps base's score: a key older than the child root's clock is
  never counted (as `ABC-230` `A9`).
- **A4 (both surfaces).** **Given** A1's fixtures, **then** UCI (`setoption name Skill Level value 1`,
  `position startpos|fen … moves …`, a forced blunder seed) and the CLI seam produce the **same scored list**, and
  the same played move.
- **A5 (the pick is unchanged in kind).** On every A1 fixture, the played move is the strict second-best of the new
  list, ties to the first (`ADR-0032` decision 2, unchanged).
- **A6 (identity).** **Given** no prior keys, **then** the blunder path's scored list equals base's. **Given** any
  position at levels 5–7, or a non-blunder draw at levels 1–4, **then** the search is node-equal to base: the
  `ABC-078` `A3` corpus and the `ABC-230` identity rows (`choose`, `choose-empty`, `clock0`).
- **A7 (gates).** `G4`, `G5` (5 s ceiling at levels 1–4, the level layer's sum clamp unchanged), `G8`, `G9`
  (`LEVELS`, `DEFAULT_LEVEL`, `HARD_CEILING_MS` byte-identical), `G10`. The levels deep lane (`ENGINE_DEEP`,
  `src/levels.test.ts`) and the ladder lane in short mode (`LADDER_DEEP`, `ABC-085`: levels 1–5 still ordered) are
  green. The `ABC-230` rows stay green unedited.
- **A8 (the reading).** **No smoke pair** (BA/PM's reading of `EPIC-010` § The merge rule, for the Orchestrator to
  confirm): `tools/rating/rating.ts` sets no `Skill Level`, so every D and R smoke move, and every batch move, runs
  at the default level 5's engine path, which A6 proves node-equal. A smoke would play base's code. The reading is
  `EPIC-008`'s **S2**: A1–A7, with the ladder lane as the one playing check on the changed levels.

## NFR triggers

- **`NFR-004` / `G5`:** no new search time. The check is at most `min(L, c)/2` ≤ 50 key comparisons per root move,
  and the level layer's sum clamp is unchanged. The time is `UNKNOWN - verify` on this host and is read by `G5`.
- **`NFR-009`:** no new per-search storage. If the remedy appends to a list, at most one key per blunder call.
- **`NFR-008`:** fixed-seed, virtual-clock rows only; 0 real-clock rows in the default lane.
- **Security (ASVS L1):** no new input path (`RISK-EPIC010-06` is bounded by `ABC-230` `A5`).

## Test notes

1. QE's probe is the A1 seed row; it runs out of tree as written (`blunder-probe.mjs <tree>`).
2. A1, A2 and A3 are pinned against base in the same run. If A2 turns red, the count has slipped to one.
3. UAT is owed (production lines in `src/levels.ts` or `src/engine.ts`). The QE verdict signs it.

## Size and priority

- **Size: S.** One check on one path, reaching both surfaces through `createLevel`; no new input.
- **Priority: P3.** Levels 1–4 only, on blunder moves only (5–40 % of moves by rate), and only when a third
  occurrence is on the board. The default level, every smoke and every batch are unaffected. Not in milestone 1.

## Dependencies

- **`ABC-230` Done** (`24f3e322`). Its prior-key hand-off is this ticket's input.
- **An Architect reading** (task suggestion `arch-ABC-242-reading`): where the check lives (`src/levels.ts`
  `blunder`, or a root check in `chooseMove` that only the blunder path enables), whether it adds to `ADR-0054`
  decision 2 or 3 or to `ADR-0032` decision 1, and the parent-root count in § Out of scope. **If the reading amends
  an accepted ADR, the owner's acceptance is a second wait** (standing ruling 2026-10-22).
- **Overlap with `ABC-241`** (Ready): both edit `src/levels.ts` `createLevel`'s child-key line (`:142`, where
  `ABC-230` appends the root's key). `ABC-241` makes every prior key a repetition key. A child root with a halfmove
  clock ≥ 1 carries no ep square (`makeMove` sets one only on a double push, which resets the clock: `ADR-0054`
  § Context), so its raw key is its repetition key, and this ticket's result does not depend on the merge order.
  **Pull it after `ABC-241`**; whichever merges second rebases.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ QE-230-a; probe `d8e8` −1013 with and without keys |
| 2 | scope and out-of-scope | ✅ 3 outcomes; engine-path root, `ADR-0032` pick, ep key out; parent-root count recorded for the Architect |
| 3 | INVEST | ✅ one check on one path; S; testable |
| 4 | testable, measurable acceptance | ✅ A1–A7 exact (0, base-equal, list-equal, node-equal); A8 S2 |
| 5 | dependencies known | ✅ `ABC-230` Done; Architect reading; `ABC-241` overlap |
| 6 | NFR triggers with targets | ✅ ≤ 50 comparisons per root move; `G5` 5 s; 0 real-clock rows |
| 7 | test notes | ✅ 3 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ⬜ the Architect reading (and the owner's word if it amends an accepted ADR) |

**DoR 9/10 (2026-10-30, `bapm-qe230a-followup`). Backlog.** On the Architect's reading, BA/PM folds it, and the
ticket is 10/10 and Ready, unless the reading amends an accepted ADR, which then waits on the owner.
