---
id: ABC-242
title: "On a blunder level (1–4), a root move that makes the third occurrence of a game position scores exactly 0, on the CLI and over UCI; every engine-path search is unchanged"
status: done
column: Done
closed: "2026-10-31, merged to main at af5b2b49; QE PASS_WITH_GAPS (qe-ABC-242, f24601b8), which signs UAT"
size: S
priority: P3
epic: EPIC-010
---

# ABC-242: the blunder path sees the third occurrence at its root (QE-230-a)

> **CLOSED 2026-10-31, Done, folded by BA/PM** (task `bapm-ABC-242-close`, records only, at `main` `d58f2d77`;
> nothing run, built or timed). QE's verdict is **PASS_WITH_GAPS** at code `6884d61a`, base `4387d4e8` (`qe-ABC-242`
> `…f24601b8`, by PREREG `5da281c9`, committed before any head run). It was merged at **`af5b2b49`**. **The QE verdict
> signs UAT** (Test note 3; the owner delegation). The SE's build is `se-ABC-242` `…8b42a94e`.
>
> - **A1–A7 MET, A8 confirmed** (QE's table in `…f24601b8`). A1–A3 were read against the real base tree, not only the
>   SE's test-local `base()` (SE-242-e confirmed on 42 of 42 checks). 20 of 20 plants matched the pre-registration.
> - **`G8`: H 9.41 s, B 9.21 s** (+0.21 s, against the +0.05..+0.15 s estimate). `NFR-008` ≤ 10 s MET. `ABC-244`'s
>   tranche-2 trigger (> 9.6 s) did not fire, with 0.19 s to spare.
> - **A1's `UNKNOWN - verify` entries, as read (recorded, not pinned):**
>   - the lane form (level 1's 100 ms, rate 1, seed 1, step 10): H `[d8e8 0, d8c8 −990, d8d7 −1012, d8e7 −1003,
>     d8c7 −1002]` plays `d8c8`; base `[−1005, −1000, −1012, −1003, −1002]` plays `d8c7` (`se-ABC-242` `…76069fd1`,
>     QE `…f041ddb3`);
>   - QE's probe set-up (2 000 ms, `virtualClock(1)`), out of tree: H `[0, −1041, −1030, −1015, −1031]` plays `d8e7`;
>     base `[−1020, −1030, −1030, −1015, −1031]`.
>   - In both, `scored[0]` is `{d8e8, 0}` and 4 child searches run for 5 legal moves. The played move is not `d8e8`.
> - **SE-242-a (INFO), answered by QE: the base probe value moved at a known merge.** QE's `blunder-probe.mjs`, run
>   unchanged, reads base `d8e8` at −1013 at the `ABC-230` merge `24f3e322`, and at **−1020 from the `ABC-228` merge
>   `e42b637b` on** (quiescence in check searches every evasion, `ADR-0053`). It is unchanged at `1f6abec4`, `5953c631`
>   and `4387d4e8`. The other entries moved with it. So the "−1013" on this page and in `ADR-0054` is the `ABC-230`
>   tree's reading, and nothing unexplained moved it. The page's −1013 lines carry a dated pointer here. The ADR's text
>   is the Architect's and is not edited on this hop.
> - **SE-242-b (LOW, design note): recorded, no ticket.** On a plain 2-cycle, base already scores the winner's third
>   occurrence 0 from inside the child search: the loser's shuttle reply is itself a twice-seen position at ply 1. So
>   the change bites the loser's repeat, and a winner's repeat only where the loser's replies are not themselves
>   repeats. Both of `ADR-0054` d4's measured classes stay covered. QE agrees (INFO). The A1 winning fixtures use an
>   asymmetric shuttle for that reason. § Problem's value line reads with this limit.
> - **QE-242-b (LOW, a regression gap): cut as `ABC-245`** (XS, P3, test-only, Backlog 9/10). Lowering the 100-key cap
>   to 8 (Q6) or 50 (Q8) survives the whole lane, because every `ABC-242` fixture has a 7-ply history with its matches
>   at −4 and −8. A third occurrence whose earlier occurrences lie further back is game-reachable (a 6-ply cycle
>   already reads −6 and −12). `ABC-245` adds one row that reads past −50, and also corrects the stale
>   `src/levels.test.ts` header count (SE-242-f, INFO). It waits on the QE-242-a ruling for its step. Q18 (the check
>   spends a clock read) is unpinned by design: INFO, no ticket.
> - **QE-242-c (INFO): recorded, no ticket.** The `LADDER_DEEP=1` short run was read pass/fail only (18/18, exit 0).
>   The default reporter did not print the per-pair lines, so the pair scores are `UNKNOWN - verify` from QE's hop.
>   A7's "levels 1–5 still ordered" rests on the rows' own assertions, which passed. The SE's run at the same code
>   printed 4/4, 3.5/4, 3/4, 3.5/4 and 10/10 (digest `f61f457801fe67af`).
> - **QE-242-a (MEDIUM): PENDING with the Architect** (`arch-qe242a-ruling`, claimed 2026-10-31). The question is
>   whether `ABC-244`'s condition 2 (`ADR-0046` § Addendum R2) reads a blunder per level call, which admits step 10 as
>   built, or per child search, which admits only step 1 at about +2.5 s of lane wall and so breaches `G8`. At step 10
>   the children are handed 10, −10, −30, −50 and −70 ms; kill sets are equal at every step, and the product is
>   unaffected. **BA/PM does not rule it here.** It did not block the merge. If the ruling names a change to a merged
>   row, BA/PM cuts that ticket then.
> - Other SE findings: SE-242-c (M7, M8 and the cap's removal are equivalent; QE agrees), SE-242-d (the `QE-244-a`
>   carry did not trigger) and SE-242-f (folded into `ABC-245`) are INFO.
> - The scope fence held: only the 4 named files changed, and the engine-path files are byte-identical B → H.
> - Notes: `.grugops/context/bapm-ABC-242-close/notes/`.

> **AMENDED 2026-10-30 by BA/PM** (task `bapm-g8-headroom-cut`, records only, at `main` `161e940d`). Source:
> `ADR-0046` § Addendum 2026-10-30 R1–R4 (`arch-g8-headroom`, `5fd3eee7`), given BA/PM's word on `ABC-244`'s page.
> `G8` read 9.90 s at `ABC-229` (`QE-229-a`), so the lane has 0.10 s of headroom.
>
> - **The lane form of this ticket's rows follows R1–R4** (§ NFR triggers, `NFR-008` line; Test note 5). Its
>   default-lane rows that search on a virtual clock are in `src/levels.test.ts` (A1–A6) and the `A4` rows in
>   `src/cli.test.ts` and `src/uci-session.test.ts`.
> - **The lane form is level 1's own 100 ms budget at the coarsest kill-set-preserving step.** It is not QE's probe
>   set-up (rate 1, 2 000 ms, `virtualClock(1)`, about 2 000 reads per scored list), which is a probe, not a lane
>   form (R4). Under R4 the estimate is +0.05 to +0.15 s of lane wall. Copying the probe form could add seconds.
> - **Pull order:** after `ABC-244`, which edits both of this ticket's `A4` files. This ticket rebases on it.
> - Acceptance A1–A8, size S, P3 and S2 with no smoke are unchanged. DoR stays **10/10**: rows 5 and 6 gain dated
>   lines.

> **ACCEPTED and RE-SCORED 2026-10-30 by BA/PM** (task `bapm-ABC-242-225-owner`, records only, at `main` `5090a4d6`;
> `src/`, `tools/` and `data/` untouched). **The owner accepted the Architect's design.** His words, verbatim
> (`orch-2026-10-30a` `…65848126`): *"ABC-242: accept, ABC-225 - approve to run one at a time"*.
>
> - **What he accepted:** `ADR-0054` § Proposed amendment 2026-10-30, and the bullet it adds to `ADR-0032` d1. On a
>   blunder move at levels 1–4, a root move whose child position stood twice before scores exactly 0, and its child
>   is not searched. The check lives in `src/levels.ts` `blunder`. The engine path is unchanged. Both ADRs' status
>   text is `arch-ABC-242-accept`'s hop. Where the ADR's words differ from this page, the ADR rules.
> - **Folded from the Architect's reading (block below):**
>   - **A1** pins the skipped child search: 4 child searches for 5 legal moves on the probe. It also gains the extra
>     fixture the Architect recommended, with the third-occurrence move **last** in `legalMoves` order, which gives
>     an exact pin on the whole list.
>   - **A4** is re-worded to how it can be read. Neither surface prints the scored list, so A4 is read through
>     determinism: the same move from three callers, with UCI's `nodes` and `depth` equal to a direct call's.
>   - **A8** is corrected. The ladder lane hands in no prior keys, so it is an identity row, not a check of the
>     change. **`A1`–`A5` are the checks.**
>   - The `NFR-004` line reads at most 49 comparisons per root move (was ≤ 50).
>   - The parent-root count is out of scope (§ Out of scope, dated line).
> - **Files it shares with work in flight** (read with `git diff --stat` at `5090a4d6`):
>   - **`ABC-229`** (In Review) changes `src/legal.ts`, `src/quiescence*.ts` and `src/search*.ts`, so the two
>     tickets share no file.
>   - **`ABC-243`** (Ready) touches `src/uci-session.test.ts`, which is also one of this ticket's two `A4` files. That
>     makes it rebase order only.
>   - Nothing else in flight touches `src/levels.ts`, `src/levels.test.ts` or `src/cli.test.ts`. `ABC-241`, the old
>     overlap, is Done (`1f6abec4`).
> - **DoR 9/10 → 10/10. Backlog → Ready.** Size S and P3 are unchanged. The board move and the pull are the
>   Orchestrator's. The Orchestrator's ruling, S2 with no smoke, stands as `A8` now reads.

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
  *(2026-10-31, `bapm-ABC-242-close`: −1013 is the `ABC-230` tree's reading. From the `ABC-228` merge `e42b637b` on,
  base reads −1020 on the same probe (SE-242-a, answered by QE; § CLOSED).)*
- **Value:** the blunder path ranks root moves the way the game will end them. Its "strict second-best"
  (`ADR-0032` decision 2) is then picked from a list that reads a third occurrence as a draw, as the engine path
  already does at the same level. The size of the effect in play is `UNKNOWN - verify`: `ABC-226`'s count read level
  5 games only, where this path never runs.
  *(2026-10-31, `bapm-ABC-242-close`, SE-242-b: on a plain 2-cycle base already scored the winner's third occurrence
  0 from inside the child search. The change bites the loser's repeat, and a winner's only where the loser's replies
  are not themselves repeats.)*

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
  rules it into this ticket, BA/PM re-scores the page. *(2026-10-30, `arch-ABC-242-reading` `…fec766ee`: the
  Architect ruled it **out**. It stays as `ADR-0054` d2 is written; changing it would be an engine change. No ticket
  is cut for it.)*

## Acceptance criteria

- **A1 (third occurrence, scored 0).** **Given** QE's probe fixture above and ≥ 3 more fixture games (both colours,
  at least one a winning side and one a losing side), **when** the blunder path scores the root moves with the
  game's prior keys, **then** the move that makes the third occurrence scores **exactly 0**, and base scores it
  otherwise (probe: `d8e8` −1013; *−1020 from `e42b637b` on, SE-242-a*). Read on the injected seam at a forced blunder (rate 1), on a virtual clock.
  *(Folded 2026-10-30 from the accepted design, `bapm-ABC-242-225-owner`:)*
  - **Its child is not searched.** The number of child searches equals the number of legal moves minus the moves
    scored 0 this way. On the probe that is **4 child searches for 5 legal moves**, and `scored[0]` is `{d8e8, 0}`
    exactly. The probe's entries 1–4 inherit `d8e8`'s slice through `ADR-0032` d1's single deadline. Their values
    are `UNKNOWN - verify` and are not pinned. The played move is not `d8e8`, unless those four entries collapse to
    one value.
  - **One of the ≥ 3 extra fixtures has its third-occurrence move last in `legalMoves` order** (the Architect's
    recommendation). On it, every entry before the last equals base's exactly, the last entry is exactly 0, and
    the number of child searches is `legalMoves` − 1. This is the exact pin on the whole list.
- **A2 (second occurrence, base).** **Given** the same fixture cut after `b1b2 e8d8 b2b1` (so `d8e8` is a **second**
  occurrence), **then** `d8e8`'s score equals base's.
- **A3 (clock bound).** **Given** A1's final position with its halfmove clock set to 0 in the FEN, and A1's prior keys
  handed in **untrimmed**, **then** the returning move keeps base's score: a key older than the child root's clock is
  never counted (as `ABC-230` `A9`).
- **A4 (both surfaces; re-worded 2026-10-30, `bapm-ABC-242-225-owner`, after the Architect's reading).** Neither
  surface prints the scored list, and UCI writes only `info depth … nodes … time … pv` (`src/uci-session.ts:318-333`).
  **Given** A1's fixtures, run three ways with the same seed, budget, virtual clock, position and trimmed prior keys:
  - the CLI seam: `createLevelSeam(1, …)`, with the keys injected;
  - UCI: `setoption name Skill Level value 1`, `position startpos|fen … moves …`, an injected `random` that gives
    the seed, then `go`;
  - a direct `createLevel(LEVELS[1], …)` call.

  **Then** all three play the **same move**. UCI's `info` `nodes` and `depth` **equal** the direct call's. The direct
  call's scored list carries the **0** for the third-occurrence move. The seed makes level 1's draw (< 0.4) call for
  a blunder, which the row asserts. *(Was: "UCI … and the CLI seam produce the **same scored list**, and the same
  played move." Not readable as worded: no surface prints the list.)*
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
  `EPIC-008`'s **S2**: A1–A7. **The checks of the change are `A1`–`A5`.** The ladder lane (`src/ladder.test.ts:179`,
  `choose(h.position)`) hands in no prior keys, so the check never fires there. It is an **identity row** inside A7
  (levels 1–5 still ordered), not a playing check of the change. *(Corrected 2026-10-30, `bapm-ABC-242-225-owner`,
  per `arch-ABC-242-reading` `…f3b8d750`. Was: "with the ladder lane as the one playing check on the changed
  levels". The Orchestrator ruled S2 with no smoke on 2026-10-30, so the confirmation this line asked for is given.)*

## NFR triggers

- **`NFR-004` / `G5`:** no new search time. The check is **at most 49 key comparisons per root move** (the walk
  `−4, −6, …` bounded by `min(c, |K|, 100)`), plus one key per root move. A check that fires saves a child search.
  The level layer's sum clamp is unchanged. The time is `UNKNOWN - verify` on this host and is read by `G5`.
  *(Was "`min(L, c)/2` ≤ 50"; corrected 2026-10-30 per the Architect.)*
- **`NFR-009`:** no new per-search storage. If the remedy appends to a list, at most one key per blunder call.
- **`NFR-008`:** fixed-seed, virtual-clock rows only; 0 real-clock rows in the default lane. The default-lane wall
  stays **≤ 10 s**. After `ABC-220` the headroom was 0.27–0.31 s (QE-220-c), which is the Orchestrator's watch line.
  `ABC-229`, `ABC-243` and this ticket all add rows.
  - *(2026-10-30, `bapm-g8-headroom-cut`; `ADR-0046` § Addendum R1–R4.)* After `ABC-229` the headroom is 0.10 s
    (`G8` 9.90 s, `QE-229-a`). **Every default-lane row this ticket adds or edits that searches on a virtual clock
    follows R1–R4:**
    - **R1:** the build note gives each such row's reads per search (⌈budget ÷ step⌉).
    - **R2:** a time-blind row takes the coarsest step in {1, 10, 100, 1 000} at which its assertions hold and QE's
      kill set for it equals its kill set at step 1. A new row has no base step, so step 1 is the reference. The
      budget of a level-1 row is level 1's own **100 ms**. `ABC-244`'s condition 2 applies: a search that runs ≥ 2
      clock-check intervals at step 1 still runs ≥ 2 at the chosen step. Which step that is for each row is
      `UNKNOWN - verify` until the SE's parity run reads it.
    - **R3:** `A4`'s three-way row (CLI seam, UCI, direct `createLevel`) uses one step on all three callers.
    - **R4:** QE's probe set-up (rate 1, 2 000 ms, `virtualClock(1)`) is **not** the lane form. A row that copies it
      makes about 2 000 reads per scored list.
    - Estimate under the rule: **+0.05 to +0.15 s** of lane wall, `UNKNOWN - verify` until `G8` reads it. `G8` ≤ 10 s
      stays the bar. If this ticket's `G8` head median reads > 9.6 s, `ABC-244`'s tranche-2 trigger fires.
- **Security (ASVS L1):** no new input path (`RISK-EPIC010-06` is bounded by `ABC-230` `A5`).

## Test notes

1. QE's probe is the A1 seed row; it runs out of tree as written (`blunder-probe.mjs <tree>`).
2. A1, A2 and A3 are pinned against base in the same run. If A2 turns red, the count has slipped to one.
3. UAT is owed (production lines in `src/levels.ts` or `src/engine.ts`). The QE verdict signs it.
4. *(2026-10-30.)* The SE's files are `src/levels.ts`, `src/levels.test.ts` (`A1`, `A2`, `A3`, `A5`, `A6`), and
   `src/cli.test.ts` plus `src/uci-session.test.ts` (`A4`). `src/levels.ts` gains the check, a private helper, a named
   100-key constant that points at the ADR, and doc lines. It gains no new import and no new export, so the
   `src/levels.test.ts` § A8 import pin and the `ABC-078` `A4` engine export pin both stay green unedited. The
   expected values are in the Architect-reading block above. Where they are marked `UNKNOWN - verify`, the SE
   records what the run gives and does not pin it.
5. *(2026-10-30, `bapm-g8-headroom-cut`.)* **The lane form (R1–R4).** The default-lane rows run level 1's own
   100 ms budget on a virtual clock, at the coarsest step that keeps the row's assertions and kill set (§ NFR
   triggers). QE's probe (`blunder-probe.mjs`: rate 1, 2 000 ms, `virtualClock(1)`) stays a probe. The SE may use it
   out of tree to derive expected values, and does not copy its budget or step into `src/`. A forced blunder is set by
   the seed (A4: level 1's draw < 0.4) or by a rate-1 level built in the test, with the same 100 ms budget. The build
   note carries one R1 line per row: title, budget, step, reads per search.

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
  **Pull it after `ABC-241`**; whichever merges second rebases. *(2026-10-30: met. `ABC-241` merged at `1f6abec4`, so
  this ticket builds on a `main` that carries it.)*
- *(2026-10-30, `bapm-ABC-242-225-owner`.)* **Met:** the Architect reading (`arch-ABC-242-reading`, merged
  `01c37946`), and the owner's acceptance of the amendment it proposes (`orch-2026-10-30a` `…65848126`). The ADR
  status text is `arch-ABC-242-accept`'s records hop. It is not a wait.
- **Shared files** (rebase order only): `ABC-243` (Ready) also edits `src/uci-session.test.ts`. `ABC-229`
  (In Review) shares no file.
- *(2026-10-30, `bapm-g8-headroom-cut`.)* **Pull after `ABC-244`** (cut 2026-10-30, P1, test-only). It changes the step
  literals of the `ABC-230` / `ABC-241` blocks in `src/cli.test.ts` and `src/uci-session.test.ts`, both of this
  ticket's `A4` files. This ticket rebases on it. That is order, not a wait on design.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ QE-230-a; probe `d8e8` −1013 with and without keys |
| 2 | scope and out-of-scope | ✅ 3 outcomes; engine-path root, `ADR-0032` pick, ep key out; parent-root count ruled out by the Architect (2026-10-30) |
| 3 | INVEST | ✅ one check on one path; S; testable |
| 4 | testable, measurable acceptance | ✅ A1–A7 exact (0, no child search, 4 of 5 child searches on the probe, a last-in-order fixture equal to base's except its 0, base-equal, node-equal; A4 by move, `nodes` and `depth` against a direct call); A8 S2, checks A1–A5 |
| 5 | dependencies known | ✅ `ABC-230` Done; `ABC-241` Done (`1f6abec4`); Architect reading merged; owner accepted 2026-10-30; `ABC-243` shares `src/uci-session.test.ts`. *2026-10-30:* pull after `ABC-244` (shares both `A4` files) |
| 6 | NFR triggers with targets | ✅ ≤ 49 comparisons per root move; `G5` 5 s; 0 real-clock rows; default lane ≤ 10 s. *2026-10-30:* R1 census line per virtual-clock row owed in the build note; level 1's 100 ms at the coarsest safe step, not the probe's 2 000 ms (R2–R4); est. +0.05..+0.15 s |
| 7 | test notes | ✅ 4 (*2026-10-30:* 5, the lane form) |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ✅ none. The owner accepted `ADR-0054` § Proposed amendment 2026-10-30 (*"ABC-242: accept"*, `…65848126`). *(Was ⬜: the Architect reading, and the owner's word.)* |

**Done 2026-10-31** (`bapm-ABC-242-close`): merged `af5b2b49`, QE PASS_WITH_GAPS signs UAT; QE-242-a pending
with the Architect; QE-242-b is `ABC-245`.

**DoR 10/10 (2026-10-30, `bapm-ABC-242-225-owner`). Ready.** S, P3, S2 with no smoke. The pull is the
Orchestrator's. *(Was: "DoR 9/10 (2026-10-30, `bapm-qe230a-followup`). Backlog.")*
