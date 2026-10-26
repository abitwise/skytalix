---
id: 20261026T134928Z-software-engineer-decision-fb730791
kind: decision
by: software-engineer
at: 2026-10-26T13:49:28Z
verified_by: 
confidence: high for the build choices; the A4 game is my fixture and QE may re-fix it
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
seal: sha256:4686335c7a8dfddf7aaf2dece48949ed6333043ff143c83ac7320da0265f0c3b
---

# ABC-209 builder decisions: rows in transposition.test.ts, one gc-child construction kept so ABC-173 A6's inventory does not move, the UCI blunder path takes the token, the A4 game fixed

1. **Where the rows live.** In `src/transposition.test.ts`, the file with the probe instrument (A3) and the NFR-009 row (A7). No new test file, so no per-file floor and no new lane command. Two hoisted pass-through mocks were added there: `seen.firstHit` on `probeTable`, and a `chooseMove` pass-through that keeps the last node count (`seen.lastNodes`) so the CLI and UCI A2 rows read nodes. Every other row reads the real engine.
2. **ABC-173 A6's static inventory (`src/cli.test.ts` "the history-pane and transposition children inherit childOf's construction") lists ONE `spawnSync` site in `transposition.test.ts`.** My 40-search row first added a second site, and that row went red (2137/2138). I did not move the pin, which is outside the ruled tests. Both `--expose-gc` readings (A7 and the A4 40-search row) now go through one helper, `gcChild`, with A7's construction unchanged (`--expose-gc --input-type=module -e`, `encoding: "utf8"`, no env, no heap flag). The inventory stays at one site, and the A7 row reads as before.
3. **The UCI blunder path (levels 1–4) passes the token too**, through `createLevel`'s chooser. On the engine path it continues the game; on a blunder, the children carry none and `clearTable` releases the holder, as the amendment's test note 2 reads. Level 5–7 `go` passes it to `chooseMove`.
4. **Keys.** The UCI start key is the `position` tokens before `moves`, as sent (`startpos` and `fen <startpos fen>` are different starts, so they clear: errs towards clearing). The CLI key formats the promotion as its piece-type digit, not a letter. Only identity matters.
5. **The A4 40-search game** is fixed here as self-play from the start position, depth 6, frozen clock, one token. The page says QE fixes the game and its budget before the first reading. QE may re-fix it; the reading above is mine, not QE's.
6. **Depths were lowered for lane cost** (A1 and ADR-0027 rows at d3). Both stayed red under their mutants.
- **Owed by others:** the QE hop; UAT (production lines, 5 files: the waiver does not apply); the ALONE D reading (A6) and the merge (ADR-0025 accepted, `…2ae5fc12`). The board move (In Development → In Review) and the trace row are the Orchestrator's to apply; the row is in the brief.
