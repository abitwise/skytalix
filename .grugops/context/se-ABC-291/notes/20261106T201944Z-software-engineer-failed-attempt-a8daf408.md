---
id: 20261106T201944Z-software-engineer-failed-attempt-a8daf408
kind: failed-attempt
by: software-engineer
at: 2026-11-06T20:19:44Z
verified_by: 
confidence: high: both read as run; neither settled here
refs:
  - ABC-291
  - ADR-0075
  - EPIC-011
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
  - G1
  - G2
  - orch-2026-10-30a/20261105T141318Z-orchestrator-decision-69ee96e7
  - orch-2026-10-30a/20261106T192323Z-orchestrator-decision-40ef8351
  - arch-ABC-291-probe/20261105T141205Z-architect-design-decision-2926c26b
supersedes: 
seal: sha256:6aa95f69ad2a425e87223ff4888f02ea88b3126d85e810ac5e71222fd556ef90
---

# se-ABC-291 STOP: the tip is do-not-merge. Six deep value pins in `ABC-282` A0-3 go to the Architect, and K1 (h) cannot hold to its letter beside d4

Nothing was re-pinned, tuned or settled. Tip `grugops/ABC-291`.

## 1. A deep value re-pin: `ABC-282` A0-3, six rows red in `ENGINE_DEEP` `src/uci-session.test.ts`
264 of 270. The six are the session's lines where W1 is off, all green on the base (6 of 6, `8e115110`). The session has no door, so d4's re-point has nowhere to go: `ABC-303` U2 pinned these lines on the bundle's tree for the same reason. They are identity rows, and ruling 2 sends a deep value re-pin to the Architect first. So they stay red.

| line | pinned | reads |
|---|---|---|
| D8, four rows (level ×2, simple-tournament `movetime`, uci-clock-mode `movetime`) | depth 8 cp 45 nodes 196681 | cp **74**, nodes, time, nps, move unchanged |
| D7, simple-tournament clock | depth 7 cp 43 nodes 69705 | cp **88**, the rest unchanged |
| D6, uci-clock-mode `go depth 6` | depth 6 cp 87 nodes 10513 time 17 nps 618412 | cp **99**, nodes **10614**, nps **624353**, time 17 |

- `bestmove c3d5` holds on all six. Only `cp` moves on the five, and those lines' `depth`, `nodes`, `time`, `nps` and move are what a W1 leak would change. `go depth 6` is a tree pin, so its nodes move too.
- The fields follow the term. No W1 leak is shown: "D3's row reads less than the base did" is green.
- **The Architect's call:** re-pin these three lines by a dated line, as U2 did, or another form. Not mine.

## 2. K1 (h) as written conflicts with d4
K1 (h) reads: `pawnShapeForTest` and `evaluateAtPhaseWithoutPawnShape` "are called from test files only". d4 calls the second "the evaluation those doors call", and the probe's form calls it at three off branches: two in `src/search.ts`, one in `src/quiescence.ts`.
- `pawnShapeForTest`: holds to the letter, by row.
- `evaluateAtPhaseWithoutPawnShape`: **does not hold to the letter.** The row I wrote pins what d4 builds, those three branches and no other caller, and says in its comment that it is not K1 (h)'s letter.
- **Forms open to the Architect:** (a) read K1 (h) as "no caller but the doors' off branches", which is this row; (b) pass the switch into the evaluation, so the export has test callers only. (b) changes `evaluateAtPhase`'s signature on the hot path, moves K2's group 6 rows, and departs from d4's sentence. I took neither as ruled.

## Open, not a STOP
- **QE's freeze of K1's fixtures is not on record** (test note 1). `SEAM_ROWS` is mine. Eight planted faults and two rank-guard faults were tried on a copy; one survived at first and a fixture was added for it, so all read red now.
- **The `ADR-0034` class of a `G1` miss by growth** stays the Architect's. Row 1632 did not move here.
- **The R7 re-point** (`ABC-303` depth-8 counts) and **the quiet filter line** are judgement calls, named for the Architect in the rows note and the decision note.
