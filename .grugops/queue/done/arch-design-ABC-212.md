---
subtask: arch-design-ABC-212
role: architect-design
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/arch-design-ABC-212/
width: 2 (beside arch-design-ABC-205; disjoint files)
---

# Design ruling for ABC-212 (levels 6–7) + the ADR-0045 amendment

## Do
- Write the ADR-0045 amendment exactly to the owner-accepted points (`…2c6fa3b1` item 2), Status "accepted by the owner (…2c6fa3b1), on the listed points". Any departure from a point → write that part as PROPOSED and STOP for the owner.
- Write the NFR-004 text the owner accepted (`…2c6fa3b1` item 1) into your ruling for Security/NFR to place in the catalog (do not edit the catalog).
- Rule: `HARD_CEILING_MS` shape (one clamp vs per-level), UCI bare-`go` budget, OQ-212-3 under ADR-0044 D5 (does the worker trigger force the UCI split?), the pins list (A13), and BA/PM's interactions 1–12. A dated `## Design ruling` on the page; recommend the next move.
- A NEW ADR, or a change to any other accepted ADR, is PROPOSED only and STOPs to the owner.

## Fences
- Worktree `../wt-arch-design-ABC-212` on `grugops/arch-design-ABC-212` from `main`. Only the ABC-212 page, ADR-0045 (and a proposed ADR if needed), your notes. No `src/`, tests, catalog, board/trace. ABC-205's page/ADR-0031 belong to the parallel hop. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/design212/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `arch-design-ABC-212`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**DONE. The `ADR-0045` amendment is written to the owner's accepted points (`…2c6fa3b1`) with no departure, and the
`ABC-212` design is ruled (`## Design ruling`, 2026-10-24). No new ADR was written, the STOP did not fire, and no
other accepted ADR was edited** (Architect/Design, 2026-10-24).

- **Branch:** `grugops/arch-design-ABC-212` @ `5e0942bf`, two commits on `main` `5717edec`: `ccbf95b6` (ADR plus page)
  and `5e0942bf` (notes). Records only.
- **Probes:** light, virtual clock only, in `design212/` (a scratch `git archive` of `5717edec`). No wall-clock figure
  was taken.

- **`ADR-0045` § AMENDMENT 2026-10-24.**
  - A1: D1 gains 6 = 5 000/0 and 7 = 30 000/0. "More than time alone" is retired for 5v6 and 6v7.
  - A2: `HARDEST_LEVEL` 7 and default 5. "Default = hardest" is retired.
  - A3: the mechanism is unchanged. `HARD_CEILING_MS` goes 5 000 → 32 000 (value only).
  - A4: `max 7`; rate 0 at 5–7; bare `go` = the level's budget; the `ADR-0044` D4.1, D4.4, D11 and D5 folds are named
    for BA/PM at the merge.
  - A5: the ladder is unchanged.
  - Consequences and Rollback are as listed. A Status pointer was added at the top, and nothing else above was edited.
- **`NFR-004` text for Security/NFR to place** (verbatim, OD-212-1 (a)): *"Engine returns a move in ≤ 3 s at default
  difficulty (level 5); hard ceiling per level: 5 s at levels 1–5, 7 s at level 6, 32 s at level 7 (a level above 5
  gets its budget + 2 s)."*
  - It carries a dated line (owner `…e44d2903`, accepted `…2c6fa3b1`, levels 1–5 unchanged).
  - It also carries a mechanism line: one clamp of 32 000, with each level's ceiling held by its budget at a margin of
    at least 2 000 ms. The "budget reaches `HARD_CEILING_MS`" bullet is retired.

- **Clamp: shape (i)**, one absolute clamp at 32 000. `ceiling(L)` is a test-local table.
  - (ii) would need a third `Level` field or an `EngineOptions` field, which departs from the points.
  - Stated: a raw `chooseMove` call is now bounded at 32 s. Every surface passes a level-derived budget.
- **UCI bare `go`:** no code change at `uci-session.ts:211`. `min(HARD_CEILING_MS, level budget)` is the level's
  budget.
  - Probe, step 1 000: L5 4 000, L6 6 000, L7 31 000. `go depth 3` at 7 gives depth 3 with a score.
  - Control, with the clamp at 5 000: L7 6 000.
  - `max` and the info text are read from the data.
- **OQ-212-3 / D5:** the latency is accepted at 6–7. The worker is not owed first, and the split is not taken. `A9`
  stays in `ABC-212`.
  - Cutechess source: pings only between moves, and a 15 s `IdleTimeout` after a mid-search `stop`, which comes only
    at a game end.
  - Other GUIs are `UNKNOWN - verify`.
- **Pins:** `A13` stands, made exact:
  - `RF-1` `STEP_MS` → `H/2`, because 32 000 is not a multiple of 2 500 and `:651` reds;
  - `:639` → 5 000;
  - `HANG_GUARD_MS` → 20 000.
  Four were added:
  - R1 `:405`–`:413`, which goes vacuous at 32 000 (probe); refixed to `2H` and step `H/20`, it reds the plant;
  - `levels.test.ts:601` → `ceiling(id)`;
  - `cli.real-engine.test.ts:408` → 5 000;
  - the comments with them.
- **Interactions:** 1–11 are ruled. 12 is new (the four unlisted ceiling readers). BA/PM's note lists 11.
- **Next move:**
  - The Orchestrator merges the records and reports the amendment to the owner (veto open).
  - Then `In Design` → `Ready for Dev`, and the SE pulls.
  - Then QE (`A4` `ENGINE_DEEP` at width 1, never beside an `EPIC-008` reading).
  - Then Security/NFR at the gate (`NFR-004` catalog, `NFR-009` at 30 s, `N8-LANE`).
  - BA/PM at the merge: the `ADR-0044` fold lines and the `ABC-204` erratum.
- **Notes** (in `.grugops/context/arch-design-ABC-212/notes/` on the branch; sealed by grugops 2.1.0 `admitAndAppend`
  with an explicit worktree context root; read back as 2 notes, index rendered):
  - `20261023T215005Z-architect-design-observation-2146d8c6`;
  - `20261023T215005Z-architect-design-decision-d2c68ace`.
- **Not touched:** `src/`, the tests, `plans/nfr-catalog.md`, the board, the trace, `ADR-0044`, and `ABC-205`/
  `ADR-0031`. No column moved. Nothing was pushed or merged.

### Trace row (10 cells, header order)

| ABC-212 (arch-design) | Architect/Design ruling + ADR-0045 AMENDMENT 2026-10-24 (accepted on the owner's points …2c6fa3b1, no departure): levels 6 = 5 000/0, 7 = 30 000/0, HARDEST 7, default 5; clamp shape (i) HARD_CEILING_MS 5 000 → 32 000, per-level ceilings held by budget (≥ 2 000 ms margin); bare go = level budget with no session code change; ADR-0044 D5 latency accepted at 6–7, no worker, split not taken; A13 made exact + 4 pins added; interactions 1–12; no new ADR, STOP not fired | EPIC-004 | difficulty levels | NFR-004 (accepted text, for Security/NFR to place); AR-NFR004-A hardest=default retired; NFR-005 untouched; NFR-009 re-read at 30 s owed; NFR-008 per A12; ADR-0045 amended; ADR-0044 D4.1/D4.4/D11/D5 folds named for BA/PM | `grugops/arch-design-ABC-212` @ `5e0942bf` (records only)<br>`.grugops/context/arch-design-ABC-212/notes/` (…2146d8c6, …d2c68ace) | records only; scratchpad virtual-clock probes: default lanes at 32 000 (engine 2 red, levels 1 red, uci 128/128), RF-1 step H/2 green + no-clamp plant 3 red, R1 vacuity + refix, bare go L5–L7 + P2 control; cutechess source read | — | — | In Design → recommend Ready for Dev after the owner is told (veto open); merge is the Orchestrator's |
