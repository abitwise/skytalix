---
id: 20260820T184000Z-uat-planner-observation-what-the-real-build-did-when-a-player-drove-it-3f7b2c15
kind: observation
by: uat-planner
at: 2026-08-20T18:40:00Z
verified_by: 
confidence: high
refs:
  - ABC-078
  - NFR-004
  - AR-NFR004-A
  - src/engine.ts
  - src/cli.ts
  - .grugops/context/uat-ABC-078-2026-08-20/uat-pack.md
supersedes: 
---

# Every number this UAT took, against the merged build, driven the way a player drives it

**This is not a stamp.** `context.human_admission` is `off` and no `finding` is admissible here, so
this is a hand-authored `observation`.

**Machine: Apple silicon `arm64` / Darwin 26.5.2 / Node v24.12.0. `UNKNOWN - verify` on any other
hardware** — `ABC-074`'s off-M3 reading is still owed and nothing below generalises past this box.

**Tree: `main` @ `2605163`, in a throwaway `git worktree` on `grugops/uat-abc078`.** `ABC-078` is
merged at `542887a`. **Measured, not asserted:** `git diff --name-only 542887a~1 542887a -- src/`
returns `src/engine.test.ts` and `src/engine.ts` — production lines shipped, so the 2026-08-17
zero-production-lines waiver is **unavailable** and this ticket needs the owner's word.

**No repository file was modified to take any reading.** The scenarios were driven by a throwaway
out-of-tree harness in the session scratchpad that spawns the real `node src/cli.ts` as a child
process, writes one move to its stdin, and stopwatches from that write to the next `> ` prompt — the
wait the player actually feels. Nothing under `src/` was touched, moved or reverted.

## 1. The waits — 21 timed replies at the product's own budget

| session | replies | min | max |
|---|---|---|---|
| `S1` — human White, 9 moves (`e4 Nf3 Bc4 d3 Nc3 O-O Be3 h3 a3`) | 9 | **3003 ms** | **3005 ms** |
| `S2` — human Black (`--colour black`), 12 moves | 12 | **3001 ms** | **3005 ms** |
| **pooled** | **21** | **3001 ms** | **3005 ms** |

**Zero replies at or above 5 s. Zero hangs. Every session exited 0.**

The machine's **opening** move as White (`--colour black`) landed **3067 ms** after process spawn —
and that figure *includes* Node's start-up and the first render, so it is an upper bound on the
engine's share, not a reading of it.

**`DEFAULT_BUDGET_MS` is the only budget any of this reaches.** `src/cli.ts:156` is
`createEngine({ budgetMs: DEFAULT_BUDGET_MS })`; there is no `--difficulty` (`ADR-0013`), no budget
flag and no FEN entry.

## 2. The overshoot is here too, and this hop does not clear it

**Every one of the 21 readings is over `NFR-004`'s 3 000 ms clause** — by 1 to 5 ms. Same direction
and the same order of magnitude as the gate's 3 025–3 031 ms worst cases, taken on longer runs. This
is `AR-NFR004-A`, an accepted risk with a named owner and a written discharge route, and **a passing
UAT does not discharge it**: the risk is owned by Security/NFR at `EPIC-006`'s difficulty hop and is
dischargeable only by passing ~2 900 ms or by re-accepting it in writing with its number. **It may
not be discharged by this pack, by the owner accepting the ticket, or by editing the `NFR-004` row.**

## 3. What the machine actually played — the three scenarios that are not "a legal move appeared"

- **Free queen taken.** `1. e4 Nc6  2. Qh5 Nf6  3. Qxh7??` → the engine replied **`Rxh7`** on its
  next move; the status panel's material counter moved to **−8**.
- **Poisoned pawn declined.** `1. e4 Nc6  2. d4` → it played **`e6`**, declining `Nxd4` (which loses
  a knight for a pawn after `Qxd4`). **This is the one that needs to see more than one move ahead.**
- **Mate in one found, and the game ended.** `1. f3 e5  2. g4` → **`Qh4#`**. The session stopped at
  the mate, two further typed moves were ignored, exit 0. **Run twice, byte-identical result both
  times.**
- **It also punished sloppy play unprompted** in `S1`: after eight moves of careless human play it
  was two queens up (`material: -22`), having taken a bishop left en prise and promoted a passed
  pawn.

## 4. What these observations do NOT establish, said here so the numbers are not over-read

They establish *a searching engine answers in about three seconds*. They do **not** establish
**iterative deepening**: a build with a fixed depth that happened to cost ~3 s would produce every
figure in this note. `RISK-002` is guarded by the repaired `A4` test that runs a search, not by
anything observable in the product. Nor do they touch the `HARD_CEILING_MS` clamp — the clamp only
engages above 5 000 ms and **no reading here came anywhere near it**, so "never near 5 s" is *not*
evidence the clamp works.
