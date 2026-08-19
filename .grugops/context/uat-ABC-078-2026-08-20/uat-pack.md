# UAT pack — `ABC-078`, iterative deepening and the `EngineSeam`

**Task:** `uat-ABC-078-2026-08-20` · **Role:** UAT Planner · **Workflow:** `06-uat-pack.md`
**Conducted:** 2026-08-20, against the real build on `main` @ `2605163` (`ABC-078` merged @ `542887a`).

> ## Read this before anything else in this pack
>
> **Nobody has accepted `ABC-078`.** This pack was **conducted by an agent**. Every "PASS" below
> means *"the scenario was executed against the real product and it did what the pack says it should
> do"*. It does **not** mean a human looked at it, agreed with it, or accepted the work. The `In UAT`
> exit signature on this project is **the owner's word in session** (`AGENTS.md` § *Test and UAT
> authority*, 2026-08-16), a green agent report was explicitly ruled **not** his acceptance, and
> `context.human_admission` is `off` so no `finding` and no stamp exists. This pack is an
> `artifact-ref`; its result is a `decision`. Quoting "UAT passed" as acceptance would be a
> misreading this pack names in advance and refuses.
>
> **The waiver does not apply.** Measured, not asserted:
> `git diff --name-only 542887a~1 542887a -- src/` returns `src/engine.ts` and `src/engine.test.ts`.
> Production lines shipped ⇒ the 2026-08-17 zero-production-lines waiver is unavailable and this
> ticket needs the owner's word.

---

## 1. UAT goal, in the user's words

> *"When it is the machine's turn, it answers me — with a real chess move, and quickly enough that I
> am not left staring at the screen."*

That sentence is the whole of what a non-engineer can grade about `ABC-078`. Section 6 says, without
smoothing it, which parts of the ticket **cannot** be graded that way at all.

## 2. Entry criteria (all met before conducting)

| # | entry criterion | state |
|---|---|---|
| E1 | The change is merged and gated | `ABC-078` merged to `main` @ `542887a`; board records the gate green on the branch tip and on `main` (1152 tests / 38 files, skip 0, `ENGINE_DEEP` 33/33). **Not re-run by this hop** — a UAT is not a gate. |
| E2 | It is exercisable by a person | `npm run chess` is live and drives the merged engine — `src/cli.ts:156`, `createEngine({ budgetMs: DEFAULT_BUDGET_MS })`. |
| E3 | The gates' own results are read, including what they did NOT verify | `.grugops/context/security-nfr-ABC-078-2026-08-18/notes/` read in full: `RF-1` landed, `AR-NFR004-A` / `AR-N8LANE-078` / `AR-ENGINE-DOC` open, `NFR-005` a waypoint. |
| E4 | The known-not-met items are known BEFORE signoff, not disputed after | Section 7. |

## 3. Test users, roles and data

- **One role: "the player"** — a chess-literate person at a terminal. No accounts, no fixtures, no
  data set-up: the product has one entry point, one starting position and no options that touch the
  engine.
- **Test data is the moves typed**, nothing else. The CLI accepts **no FEN**, **no budget flag** and
  **no difficulty flag** (`ADR-0013`: no placeholder difficulty), so a scenario can only reach a
  position by *playing to it*. This is a real constraint on what can be tested here and it shapes
  section 6.
- **Environment:** Apple silicon (`arm64`), Darwin 26.5.2, Node v24.12.0. **Every timing below is
  true of this machine and of nothing else** (`UNKNOWN - verify` elsewhere; `ABC-074` still owes the
  off-M3 reading).
- **How the waits were taken:** the scenarios were driven through a throwaway out-of-tree harness
  that spawns the real `node src/cli.ts` as a child process, types one move, and stopwatches from
  Enter to the next `> ` prompt — i.e. exactly the wait the player feels. **No repository file was
  read for state, modified, or written by the harness**; nothing under `src/` was touched.

## 4. The business scenarios

Six scenarios. `S1`/`S2` are the "it answers, and in time" pair; `S3`–`S5` are the ones that
distinguish a chess engine from something that merely returns a legal move — **a legal reply is not
the criterion, and a pack made only of `S1`/`S2` would pass on a random-move engine and prove
nothing** (the ticket's own trap, named and avoided). `S6` is the whole-session stability question.

| # | the player's question | how it is graded | pass/fail criterion |
|---|---|---|---|
| `S1` | *"I play a normal game as White. Does it answer every move, and does the wait feel acceptable?"* | Play 9 moves; watch every reply appear and time it | Every move answered with a legal move; **no wait above 5 s** and the typical wait around 3 s; the session ends cleanly |
| `S2` | *"I choose Black, so the machine moves first. Does it open the game, and does it keep answering deep into the game?"* | `--colour black`, then play 12 moves | The first board arrives with the machine's move already played; every subsequent move answered; **no wait above 5 s**; clean exit |
| `S3` | *"I blunder my queen where it can simply be taken. Does it take it?"* | Play `1.e4 2.Qh5 3.Qxh7??` — the h7 pawn is defended by the rook | The machine captures the queen on its next move, and the material counter moves against me |
| `S4` | *"I offer it a pawn that is protected. Does it grab it and lose a piece?"* | Play `1.e4 2.d4` — its knight on c6 can take d4, but my queen recaptures | The machine **declines** `Nxd4` |
| `S5` | *"I walk into a mate in one. Does it see it, play it, and end the game?"* | Play `1.f3 2.g4` | It plays mate (`Qh4#`), the game stops, further typing is ignored, exit code 0 |
| `S6` | *"Across a whole session, does it ever freeze on me?"* | All timed replies from `S1`+`S2` pooled | **Zero** replies at or above 5 s; zero hangs; every session exits 0 |

## 5. Results

**6 conducted · 6 PASS · 0 FAIL · 0 unrun · 0 blocked.** Full numbers are in this task's
`observation` notes and are not restated here.

| # | result | the evidence a person can check |
|---|---|---|
| `S1` | **PASS** | 9 replies, every one legal, waits **3003–3005 ms**; exit 0. The machine also punished the sloppy moves — it was two queens up by move 8 (`material: -22`). |
| `S2` | **PASS** | Opening board with the machine's move already on it after **3067 ms** (that figure *includes* Node's start-up); 12 further replies, waits **3001–3005 ms**; exit 0 at move 13. |
| `S3` | **PASS** | `3. Qxh7??` → the machine answered **`Rxh7`** on its very next move; `material` went to **−8**. |
| `S4` | **PASS** | After `2. d4` it played **`e6`** — it declined `Nxd4`, which would have cost it a knight for a pawn. |
| `S5` | **PASS** | `1. f3 e5 2. g4 Qh4#`. The session stopped at the mate; two further typed moves were ignored; exit 0. **Reproduced identically in a second run.** |
| `S6` | **PASS** | **21 pooled replies: min 3001 ms, max 3005 ms. Zero at or above 5 s, zero hangs, every session exit 0.** |

### What `S3`–`S5` actually discriminate — stated honestly, because "it passed" is not enough

| scenario | would a **random-move** engine pass? | would a **greedy 1-ply** engine pass? |
|---|---|---|
| `S3` take the free queen | ≈ 1 time in 30 | yes |
| `S4` decline the poisoned pawn | probably yes, **by accident** (it would rarely pick that one move) — so `S4` is weak against random | **no** — this is the one that needs looking further than one move |
| `S5` mate in one | ≈ 1 in 30 for the mate, and it had to create the mating position itself first | usually yes |

**Read the three together, not one at a time:** `S3` and `S5` rule out random, `S4` rules out
one-move-greedy. That is the strongest statement business observation supports here. It is **not** a
statement about iterative deepening (section 6).

## 6. What has NO business-observable acceptance — named rather than smoothed

This is the honest half of the pack and it is longer than the pass table on purpose.

**The product exposes exactly one engine setting: none.** `src/cli.ts:156` constructs the engine at
`DEFAULT_BUDGET_MS` and there is no `--difficulty`, no budget flag, no FEN entry and no depth
display. **Therefore no act available to a player can vary the time budget or reveal the search
depth**, and the following criteria of `ABC-078` cannot be put in front of a human at all:

| criterion | why no scenario can grade it |
|---|---|
| `A2` — a 50 ms budget still returns a legal move | No player can produce a 50 ms budget. There is no flag and no caller but the CLI's fixed 3 s. |
| `A3` — a partial iteration is discarded, not used | Invisible by construction: the player sees *a move*, never which iteration produced it. Only an instrumented run can tell, and that is a test, not a UAT. |
| `A4` — no depth constant drives a per-move decision | A property of the source text. There is no observation of the product that differs between a build with a depth constant and one without. |
| `A5` — deeper when given longer | Needs two different budgets. The product offers one. |
| `RF-1` / `HARD_CEILING_MS` — the 5 s clamp | **Unreachable from the product**: the clamp only bites above 5 000 ms and no caller in existence passes anything but 3 000. Its `S6` evidence ("never near 5 s") is *not* evidence the clamp works — the clamp was never approached. |
| `A7` at 1 ms | Same reason as `A2`. `S1`/`S2`/`S6` show "always a legal move, never null, never a throw" **at the default budget only** — the tail of `A7` is not graded here. |
| `NFR-005` depth floor | Depth is not displayed and, per the ticket, is not a verdict yet — a waypoint due at the close of `ABC-079`/`080`/`081`. |
| `A6` — assignable to `EngineSeam`, `src/turn-loop.ts` byte-identical | Code property, verified by blob hash at the gate. Its *consequence* is observable and was observed: a full game runs end to end through the merged loop (`S1`, `S2`, `S5`). |

**The load-bearing one, said plainly: business observation cannot distinguish iterative deepening
from a fixed depth.** A build with a hard depth cap that happened to take about three seconds would
pass all six scenarios in this pack — that is precisely QE's `G2` mutant. `RISK-002` — this epic's
non-negotiable inherited constraint, and the reason `ABC-078` exists — **is not acceptable by a human
looking at the product.** It is guarded by the repaired `A4` test that runs a search, and by nothing a
UAT can do. **The mechanism this ticket is named after is therefore NOT signed off by any scenario
here, and no scenario was invented to pretend otherwise.**

**QE is not UAT and this pack does not stand in for it** (`AGENTS.md` § *QE validation authority*).
`ABC-078`'s QE hop happened, found 7 gaps (2 HIGH), and the repair closed them. Nothing above
re-does, re-grades or replaces that work.

## 7. Known limitations — stated BEFORE signoff, not after a dispute

1. **`NFR-004` clause A (≤ 3 s at default difficulty) is still NOT MET, and this UAT does not
   discharge it.** This hop's own readings are **3001–3005 ms** — over the clause, in the same
   direction and of the same size as the gate's. It is `AR-NFR004-A`, an accepted risk owned by
   Security/NFR at `EPIC-006`'s difficulty hop, dischargeable only by passing ~2 900 ms or by
   re-accepting it in writing with its number, **never by editing the `NFR-004` row and never by
   this pack passing.** A human cannot perceive 3 ms; a requirement can.
2. **Every timing is true of one machine.** Apple silicon / Darwin 26.5.2 / Node v24.12.0. The
   off-M3 generalisation is `ABC-074`'s and is still `UNKNOWN - verify`.
3. **`AR-ENGINE-DOC` and the degenerate-clock behaviour are untested here** — unreachable from the
   product.
4. **`AR-N8LANE-078` is discharged, not charged** (`ADR-0014`), and is not re-opened by this hop.
5. **Two things were noticed while playing that are NOT `ABC-078`'s** — the product announces no
   result at checkmate, and the status panel reads `CHECK` on a mated position. Reported, not fixed,
   and routed in this task's `observation` note. `ABC-078`'s delivered diff is two files and neither
   is theirs.

## 8. Rollback plan

Not applicable in the usual sense and said rather than left blank: this project **deploys nowhere**
(`ADR-0007`), so there is nothing to roll back from. Reverting the change would mean reverting the
merge `542887a` on `main` — which is a human's call, not this role's, and would put `EngineSeam` back
to having no implementation and stop `npm run chess` from playing a game at all.

## 9. Exit criteria for `In UAT`

1. Every scenario in section 4 conducted against a real build and its result recorded — **met**.
2. The not-observable set named rather than papered over — **met** (section 6).
3. The known limitations recorded before signoff — **met** (section 7).
4. **The owner's word in session, given against the checklist in `signoff-checklist.md`** —
   **NOT MET, and it is not this role's to give.** Until it is given, `ABC-078` stays in `In UAT`.

**An agent may not self-sign, and this pack does not.**
