---
id: 20261026T134928Z-software-engineer-observation-3e3d0c55
kind: observation
by: software-engineer
at: 2026-10-26T13:49:28Z
verified_by: 
confidence: high (deterministic counts; each row watched red first or armed by a named mutant)
refs:
  - ABC-209
  - EPIC-008
  - ADR-0025
  - ADR-0032
  - ADR-0027
  - NFR-009
  - NFR-008
  - A1
  - A2
  - A3
  - A4
  - A5
  - plans/tickets/ABC-209-the-transposition-table-is-kept-across-the-moves-of-one-game.md
  - owner-word-2026-10-26b/20261026T132424Z-orchestrator-decision-2ae5fc12
  - arch-design-ABC-209/20261026T125648Z-architect-design-decision-2e73dcd9
  - arch-design-ABC-209/20261026T125648Z-architect-design-observation-b7d4b710
  - bapm-amend-ABC-209/20261026T130154Z-ba-pm-decision-3750aaf6
  - grugops/ABC-209
  - 9857bd1c
  - f76fbb62
  - 1da0a17f
  - 954eeb35
supersedes: 
seal: sha256:5f723c1ec8747f4e827919e480b3c0f26fc98e024d8f005d51a9b47cc9e8c1b3
---

# ABC-209 rows A1–A5 and the frozen-clock pre-check: 8 of 8 counts equal; every new row watched red or armed

- **Frozen-clock d7/d8** (`chooseMove`, `now: () => 0`, `maxDepth: k`, one first search per fresh process, plain node v26.11.1). Base `9857bd1c` = head `954eeb35` = head with a first token, 8 of 8:
  - kiwipete d7 590 489, d8 1 259 463; position-6 d7 180 941, d8 355 565. These equal the design's record (`…b7d4b710`).
- **Rows added to `src/transposition.test.ts`** (default lane unless named):
  - tracker and holder: 3 unit rows (strict prefix kept; equal / shorter / unrelated / other start give a new token; holder kept, a new token, no token and `search()` clear and release).
  - **A1:** position-6 d3: a no-token call after a tokened game, and the first call with a new token, equal a call before any game (move, score, depth, nodes).
  - **A2:** UCI `ucinewgame` (game B's first line EXTENDS game A's last line, so only the tracker replacement clears it), UCI non-continuing `position startpos moves e2e4`, and the CLI `new` (`createLevelSeam(5)`, virtual clock, 10 engine moves, then `takeBack` to the start) each equal a fresh session or seam in nodes and move. Game A is 12 UCI searches / 10 CLI engine moves.
  - **A3:** startpos d5 through one token; the reply is the stored hash move; the second search's first probe hits.
  - **A4:** the table is 4 MiB after tokened searches (default); the 40-search row under `ENGINE_DEEP`: `--expose-gc` child, self-play from the start position, depth 6 on a frozen clock, one token, `gc()` reads at search 1 and 40. **Read: heapUsed Δ 53 048 B, arrayBuffers Δ 0 B, table 4 194 304 B.** Bar ≤ 1 MiB each: met. No STOP.
  - **A5 (ADR-0027):** the same tokened sequence twice gives the same moves and nodes.
- **Red first:** before `src/` changed, 7 rows were red (missing symbols). With the tracker in and the engine not yet wired, A3 was red on behaviour (`expected false to be true`). The A2 rows are green at base by construction (base clears everywhere), so they were armed by mutants instead.
- **Mutants (each restored, `cmp` to the saved file):** ucinewgame keeps its tracker → the ucinewgame row red; the tracker never clears → the tracker row, UCI position and CLI new red; a per-instance token in the seam (the design's v1) → CLI new red; a new token keeps the table → 5 red incl. A1 and ADR-0027; no token keeps the table → the holder row and A1 red. One candidate (`game === holder`) was an equivalent mutant (`holder` is never `undefined`) and is not counted.
- **Pins:** 0 value pins, relations, levels or bounds moved; no existing row was edited for behaviour. See the decision note for the one static inventory row kept unmoved.
