---
id: ABC-264
title: "P2: reverse futility (static null move) at shallow remaining depth in both recursions, behind an ADR-0026 test-only off-door pair, with mate, check and zugzwang guards"
status: backlog
column: Backlog
size: S
priority: P2
epic: EPIC-011
feature: —
adr: "owed: a new ADR (the Architect's; ADR-0026 d10 off-door pair). New ADRs are the owner's to accept"
---

# ABC-264: reverse futility (P2)

> **Cut 2026-11-02 by BA/PM** (task `bapm-phase1-pause`, records only, at `main` `e8495fc5`; nothing run). Source:
> `ADR-0056` D2 row P2 ("reverse futility (static null move) | +30–60 | [B] 6.0 (RFP + history +80–100) | S |
> low–medium | eval scale | none — new ticket") and the ruling `arch-phase1-replan` `…64e95bfa` item 5, which pauses
> Phase 1 and names this the next ticket. `EPIC-011` Phase 2, **first** (`ADR-0056` D6: P2 → P1 → P4 → P3 → P5 → P6).
> **Intent: GAIN.** The design is owed: this page fixes what is measured, and the ADR fixes the margin, the depth
> range, the exact guards and the door names.

## Problem

- **User:** the owner at level 5, and every later reading of this epic.
- **Pain:** the search has no futility pruning of any kind (`ADR-0056` § Inventory at `bae25131`: "Futility, reverse
  futility, razoring, late-move pruning | **no**"). A node near the leaves whose static score is already far above
  beta is still searched move by move, so shallow nodes that cannot fail low cost a full expansion.
- **Value:** +30–60 Elo self-play (estimate, `ADR-0056` D2 [B]), the top expected Elo per cost on the gap list. It
  acts at remaining depth 1–3, which the 100 ms read reaches (depth 6 median), so **the read can see it**: P(pass |
  +40) ≈ 0.95 (the ruling, `ADR-0056` C2′).

## Scope

1. Reverse futility in **both** recursions (`src/search.ts`, `src/engine.ts`), so the identity oracle still runs one
   algorithm (the `ADR-0025` d6 / `ABC-208` precedent): at a node with remaining depth in the ADR's shallow range,
   when the static evaluation minus a depth-scaled margin is ≥ beta, the node returns without searching its moves.
2. **Guards** (the ADR words each exactly): no cut **at the root**; none **while in check**; none when beta or the
   static score is **a mate score** (the ADR names the mate band); none where the side to move meets a **zugzwang
   guard** (the ADR names it; `ADR-0050` d6's "fewer than three non-pawn pieces" is the precedent). Whether it acts
   at null-window nodes only (`ADR-0050` d1's shape) is the ADR's.
3. **An `ADR-0026` d10 off-door pair**, one per recursion. Every door that exists before this ticket turns reverse
   futility off, so each reproduces its pre-ticket self node for node.
4. The new ADR, recording that the Orchestrator reported it to the owner; the module headers name the new switch,
   as they name `ABC-208`'s.

## Out of scope

- Futility pruning near the leaves (P3), razoring (P6), late-move pruning (P4), LMR tables (P1), null-move R (P5).
  Any evaluation change. The paused TT strand (`ABC-257`, `ABC-258`).

## Acceptance criteria

- **A1 (the door).** Node-equal, cross-build, on the `ABC-078` `A3` corpus (`G4`): the new doors equal base's shipped
  `search()` / `chooseMove` in move, score and nodes, and every older door equals its pre-ticket self. QE runs it out of
  tree, base tree against head tree (`ABC-208` `A1`'s form). The `ABC-077` `A6` and `ABC-078` `A4` export lists grow by
  exactly two names.
- **A2 (the rule and its guards).** Unit rows, instrumented by a test-side count (no production counter):
  - **Given** a node inside the ADR's depth range, not in check, with static score − margin ≥ beta, **then** it
    returns with 0 child moves searched; the door searches them.
  - **Given** the same position in check, **or** beta / the static score in the ADR's mate band, **or** the side to
    move under the zugzwang guard, **or** remaining depth above the range, **or** the root, **then** 0 reverse-futility
    cuts.
- **A3 (value safety).**
  - **Drift:** at depth 5 on `ABC-121`'s 190, in both recursions, against the door: ≥ 95 % of non-mate scores within
    25 cp, and 0 mate scores change sign (`ADR-0058` d6's bars, the latest search precedent). The largest drift is
    reported. The ADR may tighten these; loosening them is the owner's word.
  - **Mate floor:** on the 287 mate corpus (`src/search.mate-corpus.ts`) at depth 5, `SEARCH_DEEP=1`, every position
    the door scores as a mate the head scores as a mate of the same sign (distance reported, not barred).
  - **Zugzwang:** `ADR-0050` d9's seven rows (`zugzwang.001`, `.004`, `.005`, `kpk-b6c6`, `kpk-c6d6`, `kpk-d6e6`,
    `kpk-e6f6`) are all still played at their recorded depths by the shipped engine.
- **A4 (it pays).** At fixed depth 8 on `kiwipete` and `position-6`, nodes ≤ **0.90 ×** the door's on both; `G6` "≥
  base" by its rule (floor 6). *The 0.90 × is BA/PM's proposal; the ADR confirms or replaces it before Ready, after
  which it is not loosened. Two positions are fragile under about a 10 % effect (`…c0e9f5a0` Risks); P2's expected
  saving is larger (`UNKNOWN - verify` until the design's probe).*
- **A5 (gates).** `G1` (≥ 54/58, a red classed per row under `ADR-0034`), `G5`, `G8`, `G9`, `G10`. `G7` only if the
  design adds a structure held between nodes.
- **A6 (the reading).** One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the
  candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a
  time, QE with the host alone, through `ABC-255`. 100 of 100 games complete, 0 candidate faults, 0 losses on time at
  the 50 ms margin, and **≥ 50.0 of 100 (GAIN, `ADR-0056` C2′)**. A miss is NOT MET and is not re-played. Reported:
  W/L/D, score, `cutechess-cli`'s Elo ± error, `G11`, and the design's firing rate at 100 ms (it is depth-gated).
  **And the Stockfish smoke beside it:** 10 games at 0.5 s a move against Stockfish 19 `UCI_LimitStrength`, `r
  <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`, `skytalix` `timemargin` 50 ms: 10 of 10 complete, 0
  faults, 0 losses on time, and S-4 at E 1 650: ≥ 3.0 of 10, below that 10 more games and ≥ 7.0 of 20 (`ADR-0056` S′).
  **And the Levels deep lane on the candidate head:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest
  run src/levels.test.ts --reporter=verbose`, QE, host alone: exit 0 with every test passed (57 at `EPIC-010`'s close
  read, `qe-EPIC-010-close` `…388b3044`; QE counts its own run).
- **Falsifier dispositions.** A1, A2 or A3 red, or a lane red that no recorded re-pin explains — a defect, back to the
  Software Engineer. A4 missed, A6 NOT MET, or an S′ collapse — not merged; the ADR reads "accepted, not in force".

## NFR triggers

- **`NFR-005`:** expected to improve, read by `G6` (floor 6 never moves).
- **`NFR-004`:** abort granularity unchanged; a pruned node returns sooner, the clock check is untouched (`G5`).
- **`NFR-008`:** new rows on the virtual clock or at fixed depth; slow oracle rows behind `SEARCH_DEEP=1`. Report
  `N8-LANE`. **Security:** none.

## Test notes

1. Reuse sourced fixtures (the 190, the 287 mate corpus, `ADR-0050` d9's zugzwang set); no hand-labelled rows.
2. Deterministic mode (`ADR-0027`) holds: same input and virtual clock give the same move.
3. Shipped-path rows that move are re-pinned with old and new figures; **the PR lists every re-pointed and re-pinned
   row** (`ADR-0058` d5's practice). `ABC-249`'s row: as `ABC-238` test note 2 (QE-249-a/b).
4. UAT is owed (production lines). The QE verdict signs it.

## Size and priority

- **Size: S** (`ADR-0056` D2). One predicate per recursion, two doors, and the oracle rows. **Priority: P2** (top
  expected Elo per cost; Phase 2 first; the ruling's next ticket).

## Dependencies

- **Architect/Design:** a new ADR: the margin as a function of depth, the depth range, the four guards worded exactly,
  null-window-only or not, its order against null move in the node, the door names, the drift bound (A3) and the A4
  figure. **Owner:** acceptance of that ADR before the read and the merge (reading (b), the `ABC-208` / `ABC-238`
  precedent); the build may start once it is written.
- **Eval scale (`ADR-0056` D2):** the margin is in today's centipawns. E1/E2 (`ABC-239`) re-scale the evaluation, so
  the margin is re-read when they land (named here, not decided).
- Shares `src/search.ts` and `src/engine.ts` with every Phase 2 stub and `ABC-236`: one at a time. P3 and P6 follow it.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ `ADR-0056` D2 P2; § Inventory |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ S; independent of the paused TT strand |
| 4 | testable, measurable acceptance | ✅ every row has a number or a state; A4's 0.90 × is proposed, confirmed by the ADR |
| 5 | dependencies known | ✅ the ADR; owner acceptance gates the read and the merge |
| 6 | NFR triggers with targets | ✅ nodes ≤ 0.90 ×; drift 95 % / 25 cp; `G6` floor 6 |
| 7 | test notes | ✅ 1–4 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ the ADR (design row): not written |

**DoR 9/10. Backlog.** It reaches Ready when the ADR is written (reading (b)); the board move is the Orchestrator's.
