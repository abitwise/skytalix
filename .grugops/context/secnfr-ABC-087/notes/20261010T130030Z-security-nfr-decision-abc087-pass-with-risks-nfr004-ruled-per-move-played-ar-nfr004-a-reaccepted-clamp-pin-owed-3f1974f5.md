---
id: 20261010T130030Z-security-nfr-decision-abc087-pass-with-risks-nfr004-ruled-per-move-played-ar-nfr004-a-reaccepted-clamp-pin-owed-3f1974f5
kind: decision
by: security-nfr
at: 2026-10-10T13:00:30Z
verified_by:
confidence: high
refs:
  - ABC-087
  - ABC-085
  - ABC-101
  - EPIC-006
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
  - N8-LANE
  - AR-NFR004-A
  - QE-087-a
  - QE-087-b
  - QE-087-c
  - QE-087-d
  - ADR-0027
  - ADR-0032
  - ADR-0035
  - src/levels.ts
  - src/levels.test.ts
  - plans/nfr-catalog.md
  - plans/tickets/ABC-087-difficulty-levels-as-budget-plus-blunder-rate.md
  - .grugops/context/secnfr-ABC-087/notes/20261010T125954Z-security-nfr-observation-abc087-nfr004-level3-12ms-ceiling-5006ms-floor-589ms-clamp-pin-10ms-231d41c8.md
  - .grugops/context/qe-ABC-087/notes/20261010T123857Z-qe-e2e-decision-abc087-verdict-pass-with-gaps-5e6c0109.md
  - .grugops/context/qe-ABC-087/notes/20261010T123857Z-qe-e2e-observation-abc087-nfr004-clamp-bounds-deadline-not-return-df34cf5a.md
  - .grugops/context/qe-ABC-087/notes/20261010T123857Z-qe-e2e-observation-abc087-gap-register-62d79e31.md
  - .grugops/context/ticket-to-pr-ABC-087/notes/20261010T115230Z-software-engineer-claim-abc087-agents-md-line-nfr004-wording-a4-bias-53ebd6d1.md
  - .grugops/context/ticket-to-pr-ABC-087/notes/20261010T124744Z-software-engineer-observation-abc087-qe-fix-forward-a-b-e-closed-26fd4d9d.md
supersedes:
---

# `ABC-087` Security/NFR: **PASS_WITH_RISKS**. `NFR-004` holds per move played. The level layer's clamp bounds the deadline, and the return carries `AR-NFR004-A`'s residual (5 000–5 015 ms). **`AR-NFR004-A` is re-accepted at this hop with its number** (level 3: +12 ms max, 24/30). One LOW required fix: pin the clamp (QE-087-c). No security finding

Hand-authored and unsealed. This is a `decision`, not a stamp: `human_admission` is `off`, and this
install has no sanctioned writer.
- **Reviewed:** `94cf5e6b..42ab1b35` on `grugops/ABC-087-difficulty-levels`.
- **Settings:** `security.asvs_level` L1, `block_on` high, `compliance_regime` `[]`.
- **Readings:** observation `…231d41c8`. Every number below carries its load1 there.
- **The change.** Production is `src/levels.ts` (+182/−0) and nothing else. `src/engine.ts`,
  `src/search.ts`, `src/cli*.ts`, `src/turn-loop.ts` and `package.json` are untouched.

## Result

**PASS_WITH_RISKS.**
- Nothing is at or above `high`, so nothing blocks the merge.
- **One LOW required fix, `R1`.** It is owed before a blundering level can sit near the ceiling, not
  before this merge.
- Board moves are the Orchestrator's.

## Rulings

| # | item | evidence (load1 in `…231d41c8`) | severity | ruling |
|---|---|---|---|---|
| 1 | **`NFR-004` for the level layer: what the 5 s ceiling binds** | Engine path: one `chooseMove` call with the level's budget, clamped by the engine (`RF-1`). Blunder path: N calls under one shared deadline, `B = min(budget, HARD_CEILING_MS)` (`src/levels.ts:123`, `:144`) | — | **The ceiling binds per move PLAYED, not per engine call.** The engine's per-call clamp does not bound a sum, and the level clamps its own total. **MET on the delivered code.** |
| 2 | **What the clamp bounds** | Last deadline exactly start + 5 000 (QE `I5`, 1e-9). Real clock at a 20 s level: **5 000–5 006 ms** (6 runs, 6–48 children) and QE's 5 005 / 5 015. Floor of the blunder path (Σ unabortable depth-1 children): **≤ 535 ms** direct, **589 ms** through the module, over 246 positions | — | **The clamp bounds the DEADLINE, not the return.** The return overruns by one abort residual. That is `AR-NFR004-A`'s mechanism and bound (≤ 31 ms), not a new one. The shared deadline cannot cascade past the ceiling on any measured position. Positions with far more legal moves are `UNKNOWN - verify`, bounded by the floor sum |
| 3 | **`AR-NFR004-A` discharge** (the catalog names "`ABC-087` if that lands first") | Level 3 = `DEFAULT_BUDGET_MS` = 3 000, rate 0 (`A6`, QE `I6`). Real clock: **24/30 over 3 000 ms, max 3 012 (+12 ms, 0.40 %), median 3 002**. Hardest level: 179/180 ≤ +36 ms, one first-call +90 ms (4 590) | — | **Re-accepted in writing, with this hop's number** (below). The "pass ~2 900 ms" route is closed at this ticket: `A6` fixes level 3 at 3 000 = `DEFAULT_BUDGET_MS`, and `ADR-0032` d5 reads `NFR-005` there. Reopening it is a criterion change (BA/PM) with the owner's word. **The catalog row is not edited** (the catalog forbids discharge by editing it, and this hop is fenced from it) |
| 4 | **QE-087-c (clamp unpinned)** | `M4` is green on the shipped default lane (21/21, re-planted here) and on every deep row (QE). Live exposure today: none. Blundering levels are 100 and 500 ms; the 3 000–4 500 ms levels have rate 0; no table budget exceeds 4 500. A ~10 ms default-lane pin turns `M4` red (step 250, `…231d41c8` § 5) | **LOW** | **Required fix `R1`** (below). LOW, not MEDIUM: the control exists and was measured from outside (QE `I5`, this gate's readings). What is missing is a regression pin, and `RF-1`'s precedent (`ABC-078`) is that an `NFR-004` clamp carries one, on the injected clock. **QE's LOW grade is confirmed** |
| 5 | **The randomness seam** | mulberry32, seeded per instance and held in the `createLevel` closure (never at module level). The seed is caller-supplied, and a non-integer seed throws. `M3a` (seed into the engine budget) is now red on the default lane (`QE-087-a`), and `M3b` reds at typecheck. `M8` red (`QE-087-b`). `M5b` survives (`QE-087-d`, LOW) | — | **No security relevance.** The generator decides which move a local game engine plays against the user who launched it. It guards no secret, token, identifier, file name or access decision, so ASVS V6 "random values" does not apply. Predicting it gains the user nothing they do not already own. **It is not a CSPRNG and must not be reused as one.** The seed does not reach `chooseMove` (`ADR-0027` d1), and that is now pinned |
| 6 | **Security (ASVS L1)** | `src/levels.ts` imports only `apply`, `engine`, `gameend`, `legal`, `moves`, `position` and `search`. It has no `process`, `fs`, network, `eval`, dynamic `import()`, argv or prompt (`A8`, asserted). No dependency or config change. The borrowed position is restored in a `finally`. The test file reads its own sibling source by a fixed URL, and spawns nothing | — | **No finding.** The page's "Security — not triggered" is confirmed. Filtered by surface, not ticked line by line |
| 7 | **Degenerate level input** (forward) | `LEVELS["constructor"]` / `["__proto__"]` return prototype members, and `createLevel` turns them into an always-blunder depth-1 level. A `NaN` rate blunders on every move. Nothing throws (`…231d41c8` § 8) | info | **Not this ticket's**, because it has no input surface. It is a note for whoever wires a user's choice to the table (`EPIC-006`, `ABC-101`): look up by a validated own integer key (`Object.hasOwn`), and refuse anything else |
| 8 | **Level 1's budget on the real clock** | A blunder at 100 ms reads median 101, p90 164, max 498–589 ms; **17.9 %** of blunder moves exceed +20 %. Cause: depth 1 is unabortable, and the virtual clock does not charge it | LOW (info) | **No NFR is touched** (≪ 3 s). **`A2` is MET as test note 3 defines it**, on the injected clock. Recorded, so that nobody reads "±20 %" as a real-clock property of the weak levels. Owner below |
| 9 | **Cost: `N8-LANE`** | Re-scored independently, identical: **+0.555 s** (0.52–0.57), sign 8/8, twin −0.66 % at 3/8, **R 0.030 s** (load1 8.96–14.97). The narrow set is `src/levels.test.ts`: the production file is added, not modified, so `vitest related` adds nothing. Floor account: +1 file, 160 ms by count (Architect/Design). `N8-SPAWN`: 0 children | — | **MET on `ADR-0035` d1–d2, which is `proposed`.** If the owner declines `ADR-0035`, this reading has no admissible instrument at 650 ms: the full-lane F is 1.72 s, so it would be UNRESOLVED, never "NOT MET". The dependency is the owner's acceptance, as BA/PM `…52f042aa` already says |
| 10 | **Cost: the deep lane** (`ENGINE_DEEP=1 npx vitest run src/levels.test.ts`) | 196.5–200.8 s across four runs (load1 3.6–12.5). `A5` takes 135 s and is clock-bound (30 × 4.5 s), so load cannot inflate it beyond its stall tail. Guards: `A4` perft + puzzles 28–29 s / 300 s (10x); `A3` 21 s / 300 s; `A2` 5 s / 300 s; `A4` `ENDGAMES` < 0.3 s / 5 s default | — | **Accepted as an opt-in lane.** Every guard exceeds `ABC-127`'s 6.3x load-inflation rule. It is not a mandatory gate. The `AGENTS.md` lane line is the Scribe's and is owed before merge |
| 11 | `NFR-005` / `NFR-009` (read, not ruled) | Level 3 is `chooseMove` at 3 s (QE `I6`). Real clock: `kiwipete` 7, `position-6` 7 (5/5 each). The level layer holds an O(N) list, and the engine's module table is cleared on each call (code read; not re-measured) | info | Nothing new. `NFR-008` is not re-ruled (`ADR-0035` d5, `proposed`) |

## `R1` — the required fix (LOW, non-blocking under `block_on: high`)

- **What:** one row in `src/levels.test.ts` that turns red when the level-layer clamp is removed (`M4`).
  - **Shape (suggested, the Engineer's to choose):** a `{ budgetMs: 20 000, blunderRate: 1 }` level
    on a 5-move position, on `virtualClock(250)`, asserting `elapsedMs ≤ HARD_CEILING_MS + 4 · step`.
  - Measured out of tree: ~10 ms, pristine 5 750, `M4` 20 750 (red).
  - Default lane (~10 ms of the ~95 ms `N8-LANE` headroom), or `ENGINE_DEEP` at no lane cost.
- **When:** before `ABC-085` enters `In Development`, or before any edit to `LEVELS`, whichever is
  first. Both are the moments a blundering level can approach the ceiling: `ABC-085`'s harness can
  construct any `Level`, and `A1` does not bound a budget at `HARD_CEILING_MS`. Taking it on this
  branch before merge is cheaper still. That routing is the Orchestrator's.
- **Owner:** Software Engineer (the row); Orchestrator (routing); BA/PM (lane placement, if not the
  default lane).
- **If it is not taken by then:** the risk is "a blundering level near or above the ceiling has no
  regression guard on its total". It is MEDIUM from that moment, because the exposure becomes live.
  It goes to Olger Oeselg for acceptance. **This gate does not accept it.**

## `AR-NFR004-A` — re-accepted at this hop, with its number

> **Re-accepted 2026-10-10 by Security/NFR at `ABC-087` (`secnfr-ABC-087`).**
> - **Clause A at the delivered default** (`LEVELS[3]` = `DEFAULT_BUDGET_MS` = 3 000 ms, rate 0, the
>   shipped engine): **24/30 calls over 3 000 ms, max +12 ms (0.40 %), median +2 ms**, on the six
>   standing positions, real clock, load1 4.0–5.4, Apple M3 / Node v26.11.0.
> - **The ceiling residual through the level layer:** 5 000–5 015 ms at a 20 s level (8 readings).
> - **Same mechanism and the same ≤ 31 ms bound as recorded at `ABC-078`.** Not materially worse.
> - **Outside this acceptance, by its own scope rule:** the single +90 ms first-call reading at
>   4 500 ms. It missed no clause. **If a level-3 move ever reads it, that is a NEW question**, and
>   whether one can is `UNKNOWN - verify`.
> - **Owner: Security/NFR**, as the catalog names it. **Next reading:** the `EPIC-006` hop that first
>   routes a played move through a level. Today `src/cli.ts:175` builds
>   `createEngine({ budgetMs: DEFAULT_BUDGET_MS })` and no production file imports `levels.ts`, so
>   live exposure is unchanged from `ABC-078`.
> - **Discharge by ~2 900 ms is closed by `A6`.** Reopening it is BA/PM's criterion, with the owner's
>   word.
> - **Not written into the catalog by this hop.** It is transcribed by whichever hop next holds
>   `plans/nfr-catalog.md`.

## Accepted and recorded risks (each with an owner)

| id | risk | severity | owner | disposition |
|---|---|---|---|---|
| `AR-NFR004-A` | Clause A missed by ≤ 31 ms by the abort granularity, and the same residual over the ceiling | LOW | **Security/NFR** (the catalog's named owner) | **Re-accepted with this hop's number** (above) |
| `RR-LEVEL1-REALCLOCK` | Ruling 8: weak levels' blunder moves overshoot their budget on the real clock by up to ~5x (≤ 589 ms) | LOW | **BA/PM** (whether `A2` should say "on the injected clock"); **`ABC-085`'s Engineer** if any ladder reading is timed on the real clock | Recorded. No NFR exposure |
| `RR-ADR0035-DEP` | Ruling 9: `N8-LANE` MET rests on `ADR-0035`, which is `proposed` | LOW | **Olger Oeselg** (`ADR-0035` acceptance) | Recorded. Already on the owner's list (BA/PM `…52f042aa`) |
| QE-087-d | `M5b` (an extra draw per root move) survives | LOW | **Software Engineer**, routed by the Orchestrator | **Endorsed as QE graded it.** It is a determinism gap, not an NFR or a security gap |

## Proposed `NFR-004` catalog wording

The catalog is fenced from this hop, so this is a proposal for the hop that holds it. It goes beside
the `NFR-004` ruling section, as a new sub-section after CLAUSE B. It does **not** touch the row's
`Target` or its `Verified by` cell. That cell stays `UNKNOWN - verify` until `ABC-074` reports off the
M3, as the section's own fence says.

> **THE LEVEL LAYER (`ABC-087`, 2026-10-10, Security/NFR).** The 5 s ceiling binds **per move played**,
> not per engine call. The engine clamps each `chooseMove` call (`RF-1`), and that does not bound a
> SUM of calls.
> - **A caller that makes several engine calls for one move clamps its own total.** `ABC-087`'s
>   blunder path makes one call per legal root move (`ADR-0032` d1). It uses
>   `B = min(level budget, HARD_CEILING_MS)` and one shared deadline `start + B·(i+1)/N`.
> - **The clamp bounds the DEADLINE, not the return.** The return carries the single-call abort
>   residual (`AR-NFR004-A`). Real clock, 20 s level: 5 000–5 015 ms over 8 readings, 6–48 children.
> - **The shared deadline cannot carry a move past the ceiling while the sum of the children's
>   unabortable depth-1 searches stays under it.** Measured ≤ 589 ms on the 246-position deep corpus.
> - **"At default difficulty" means `LEVELS[3]`**, which is `DEFAULT_BUDGET_MS` at rate 0: the shipped
>   engine (`ABC-087` `A6`). Clause A there read +12 ms max on 24/30 calls (`AR-NFR004-A`,
>   re-accepted).
> - **Verified by:**
>   - `ABC-087` `A2`: the blunder total on the injected clock, 101.3 / 100;
>   - `A5`: the hardest level, real clock, 30/30 ≤ 5 s, max 4 526–4 590 ms over six runs;
>   - and the clamp pin owed as `R1`.
> - **A table or harness that puts a BLUNDERING level near or above the ceiling** re-reads `A5`'s
>   blunder clause on the real clock. A virtual reading cannot stand in: the virtual clock does not
>   charge depth 1.

## Notes handed on (each with an owner)

- **Orchestrator:** `R1` routing. The board move to `Ready for UAT` is yours (this role names the exit,
  and this hop is fenced from `plans/board.md`).
- **The catalog-holding hop:** the wording above, and the `AR-NFR004-A` re-acceptance block, to be
  transcribed, not paraphrased.
- **`EPIC-006` / `ABC-101` (BA/PM at the cut, the Engineer at the build):** ruling 7. Look up
  `LEVELS` by a validated own integer key. Also re-read `AR-NFR004-A` the first time a played move
  goes through a level.
- **`ABC-085`:** `R1` lands before it is built. Ruling 8 applies if the ladder is ever timed on the
  real clock.
- **AGENTS.md Scribe:** the levels deep-lane line (`…53ebd6d1`, "27 passed (21 default)") is owed
  before merge. The readings here agree with it (196.5–200.8 s).

## Fence

- Zero lines under `src/`, `tools/` and `package.json`.
- No `plans/nfr-catalog.md`, `plans/board.md`, `AGENTS.md` or ADR edits.
- Every probe and mutant ran out of tree, on `git archive 42ab1b35` copies in this gate's private
  scratch directory.
- No load was induced beyond the probes, which were logged. QE (`ABC-054`) and the catalog hop ran
  alongside, and their files were not touched.
- Nothing merged or pushed.
