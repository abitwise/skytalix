---
id: ABC-119
title: No automated test anywhere spawns the delivered CLI and lets the REAL engine choose a move — the product's strongest end-to-end evidence is a transcript
status: in-development
column: In Development
size: M
priority: P2
epic: EPIC-006
feature: —
---

# ABC-119 — `G-06`: give the real search an opt-in lane, and pay for it OUT of the default lane rather than into it

> **Cut 2026-08-21 by BA/PM** (task `cut-050-exclude-and-g06-2026-08-21`, subtask
> `cut-050-exclude-and-g06`, Workflow 07), on the project owner's instruction in session
> (*"cut `ABC-050`'s exclude residual and `G-06`"*), out of QE/E2E's gap register at
> `quality-gate-ABC-043-qe-2026-08-19` (`G-06`, MEDIUM, *"BA/PM to cut; `ENGINE_DEEP` is the
> precedent"*), handed forward unchanged by a second QE hop at `qe-ABC-043-review-exit-2026-08-20`.
> **Two QE hops named it and neither cut it. This is the first BA/PM hop to see it.**
>
> **`ABC-043` IS NOT RE-OPENED AND IS NOT DEFECTIVE.** `ABC-043` declared this exclusion in its own
> words in three places before any gate ran — `## Test notes` 8, its `A5`/`A2` testability ruling,
> and its `NFR-004` trigger — and `src/cli.test.ts:655-671` states it in the tree itself. **A gap a
> ticket declared and fenced is not a defect of that ticket.** `ABC-042`, `ABC-050`, `ABC-078`,
> `ABC-108`, `ADR-0014`, `ADR-0015` and every QE verdict are not re-opened, not re-scored, not moved.
>
> **NAMING TRAP.** `G6` (no hyphen) is a DIFFERENT and CLOSED item — an `ABC-037` gap about
> overlapping `seam()` calls that became an `ABC-043` acceptance criterion. `G-QE115-1..5` are
> unrelated and dispositioned. **This ticket is `G-06`, with the hyphen, and nothing else.**

## Problem

**No automated test in this repository spawns the delivered CLI composition and lets the real
`src/engine.ts` search choose a move.** Re-derived at this cut:

- Every child in `src/cli.test.ts` that would reach an engine turn substitutes `./engine.ts` with a
  double exporting `DEFAULT_BUDGET_MS = 0` — **four such substitutions in the file**. Children
  without a hook never reach an engine turn.
- The wiring is asserted **textually**: `src/cli.test.ts:2447` matches the entry point's SOURCE
  against `/engine:\s*createEngine\(\{\s*budgetMs:\s*DEFAULT_BUDGET_MS\s*\}\)/`. That proves the
  line is written. It does not run it.
- **`ENGINE_DEEP` exists and does NOT close this**, and that is the reading to refuse in advance: it
  drives `chooseMove` / `createEngine` **in-process, as a unit**. It never spawns the CLI, so it
  exercises the seam and not the delivered composition. The gap is composition, not search.

**The only end-to-end evidence in this repository is hand runs transcribed in context notes** — two
by QE, and I added a third at this cut. QE wrote of its own transcript: *"That is not a criterion and
I am not recording it as one."* This page agrees. The user is the next hop that changes how `cli.ts`
composes the engine; the pain is that the whole default lane can stay green while the real search is
wired to nothing; the value is one opt-in lane that actually plays.

Measurements, the paired runs and the disagreements with the record are in
`.grugops/context/cut-050-exclude-and-g06-2026-08-21/notes/`, not on this page (`AGENTS.md`
`## Process rules` 2).

## The ruling this page owes: an OPT-IN LANE, and the arithmetic that forces it

**Ruled here: a new opt-in lane on the `PERFT_DEEP` / `SEARCH_DEEP` / `ENGINE_DEEP` / `INPUT_DEEP`
precedent. NOT a default-lane row.** The alternative — one real-engine child in `src/cli.test.ts`'s
default lane — is not a judgement call; it is arithmetically excluded, and I re-measured every term
rather than inheriting it.

**Re-measured at this cut, 3 consecutive runs, `node src/cli.ts --colour black --ascii </dev/null`:
real 3.09 / 3.07 / 3.07 s, user 3.19 s each.** One real engine ply at `DEFAULT_BUDGET_MS`. This
**confirms** the 3.09 s / 3.192 s recorded at `ABC-043` — that number has not gone stale.

Against `src/cli.test.ts`'s `N8-SPAWN` clause **in force** (the 2026-08-21 budget ruling: **≤ 7
added children AND ≤ 2.0 s added wall AND ≤ 0.30 s added CPU per added child**):

| clause | one real-engine child | verdict |
|---|---|---|
| ≤ 7 added children | the count is **at its ceiling — 24 = 17 + 7, 7 of 7 spent** | no room |
| ≤ 2.0 s added wall | **3.07 s from one child** | breached 1.5x |
| ≤ 0.30 s added CPU per child | **3.19 s** | breached **~10.6x** |

**And the lane it would join is already over its own bar.** `NFR-008` is **≤ 3 s wall AND ≤ 13 s
CPU**; `ADR-0014` has it **BREACHED** and `ABC-108`'s `OQ-1` open. Read at this cut on a scratch
copy, 5 rounds after a discarded warm-up: **~4.1–4.3 s wall, ~16.5–17.3 s CPU.**

**So the lane is priced, and the price is paid outside the default lane.** Measured at this cut —
one extra always-collected test file whose deep cases are undefined when the variable is unset, base
vs mutant, 5 interleaved paired rounds after a discarded warm-up, `node_modules` symlinked:
**median +0.09 s wall and +0.06 s CPU, sign positive 4 of 5, skip count 0 both ways.** That is
noise-level. **A ticket that ignored the price is not cuttable; this one pays it and the payment is
a number.**

## Two construction constraints I MEASURED, because both defeat the obvious build

1. **`describe.runIf(RUN_DEEP)` REPORTS A SKIP and must not be used.** Built and run at this cut:
   `41` files, **`1 skipped`**. That moves the gate's test-integrity count off **0**, and
   `.grugops/test-skips.md` is **human-owned** — an agent may not write a justification to clear its
   own gate. The four existing deep lanes all use `if (RUN_DEEP) { describe(...) }` so the cases are
   **not defined** rather than skipped; `src/engine.test.ts:64-69` states that reason in the tree.
   **Re-run with the guard form: skip count 0.**
2. **A new file that registers NOTHING when the variable is unset FAILS the default lane.** Built and
   run at this cut: `Error: No test suite found in file …`, `Test Files 1 failed`. **This is why all
   four existing deep lanes live inside files that also carry default-lane tests.** The delivering
   hop either registers the deep cases in a file that always defines something, or gives the new file
   at least one default-lane test — and `A2` makes that a watched green rather than an assumption.

## Scope

- One **opt-in lane**, env-gated on the four-lane precedent, that **spawns the delivered entry point
  with no engine substitution and no hook** and lets the real search answer.
- Acceptance that is **deterministic against a non-deterministic opponent** — see `A3`.
- The lane's **default-lane cost measured** and its **command recorded**.

## Out of scope

- **Any production line under `src/`.** Zero. `src/cli.ts`, `src/engine.ts`, `src/turn-loop.ts` and
  `src/search.ts` are read, never written. **This ticket adds coverage; it fixes no bug**, and no bug
  is alleged — the composition works, and three hand runs say so.
- **Any change to a default-lane row, to `ENGINE_DEEP`, or to any existing child's argv, stdin
  script, substitution hook or settle.** *(`ADR-0017` `T2` therefore does not fire. If the delivering
  hop touches one anyway, `T2` fires and it re-measures.)*
- **`plans/nfr-catalog.md`, `NFR-004`, `NFR-008`, `ADR-0008`, `ADR-0014`, `ABC-108`, `ABC-111`.**
  Not amended, not re-measured as a verdict, not claimed against. See `## Named owed, deliberately
  not written`.
- **`AGENTS.md`.** See the same section — `ABC-109` holds a byte cap on it.
- **Raising `N8-SPAWN`'s ceiling at the bench.** The ceiling has been raised twice, both times by
  **BA/PM on a ticket page with the derivation written**. If the delivering hop finds it needs a
  raise, it **stops and asks for one**; it does not take it. See `## Dependencies`.
- **Promoting any hand-run transcript to a criterion.** Refused, on QE's own words and mine.
- **`ABC-050`'s residuals** (either of them). Different subject; `ABC-118` is this cut's sibling.

## Named owed, deliberately not written — two documents, each with its owner

- **`AGENTS.md` `### Test`.** Every one of the four existing deep lanes has a command line there with
  a `RUN` stamp. A fifth lane owes a fifth line. **`ABC-109` holds a byte cap on that file and this
  ticket writes zero bytes to it.** Named owed; `ABC-109`'s owner rules whether it fits.
- **`plans/nfr-catalog.md` `NFR-008`.** The row bounds *"`npm test` with **`PERFT_DEEP`** unset"* —
  it names one variable by hand. **That wording is ALREADY under-inclusive by three today**
  (`SEARCH_DEEP`, `ENGINE_DEEP`, `INPUT_DEEP` all exist and none is named), so this is a **pre-existing
  debt this ticket makes fourth, not a debt this ticket creates** — an honest distinction, because a
  hop could otherwise read it as this lane breaking the row. **Architect/Design's.** Nothing here
  moves a target, bar, level, floor, account, instrument, statistic, null control or
  `UNKNOWN - verify` marker in that file; the eight rows hash to `63f66795…ca31` and `A5` pins it.

## Acceptance (Given/When/Then)

- **`A1` (the lane exists, is opt-in, and actually runs the real search).** **Given** the variable
  set, **when** the lane runs, **then** at least one child is spawned that runs the delivered entry
  point **with no `--import`, no substitution hook and no double**, the child's own wall time is
  **≥ 1.0 s** (an instant reply proves a double leaked in), it **exits 0**, and the recorded run
  states the measured wall and the command verbatim.
- **`A2` (the default lane pays nothing, and both traps are cleared).** **Given** the variable
  **unset**, **then** the default lane is **green**; the skip count from
  `npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'` is **0**; the new lane
  contributes **zero spawned children**; and the wall and CPU deltas against the base are the
  **median of ≥ 5 interleaved paired runs** (warm-up round discarded, `node_modules` symlinked, both
  trees outside the repository), each **≤ 0.30 s**, sign agreeing on **≥ 4 of 5**. *Read at this cut
  for a placeholder of this shape: +0.09 s wall, +0.06 s CPU.* **If it disagrees, THIS hop's number
  is recorded and the disagreement is written down** — `ABC-114` `A3`'s discipline.
- **`A3` (deterministic assertions against a non-deterministic opponent — the criterion that makes
  this lane worth having).** **Then** every assertion is on a property the real search cannot
  legally violate, and **no assertion names a specific move, score, depth or node count**:
  (i) the engine's reply is a **legal move in the position it was played in**, checked by the
  project's own move generator, not by a literal; (ii) it arrives **within `NFR-004`'s ≤ 3 s at
  default difficulty**, measured on the child; (iii) the session **advances** — the side to move and
  the ply number both change; (iv) `stderr` carries **no stack trace** and the exit code is **0**,
  never `70`. **A criterion that would go red on a different machine or a different search is not a
  criterion, and this page will not accept one.**
- **`A4` (the rejection path against the real engine).** **Then** one child feeds an illegal or
  unparseable input into a real-engine session and observes `ABC-019`'s **non-advancing-with-a-message
  cadence** — the same side to move and the same ply number before and after — with the session
  continuing rather than exiting. *This is the one behaviour a hand run has already shown against
  the real engine and a suite never has.*
- **`A5` (the fence, checkable from git and from a hash).** **Then**
  `git diff --numstat main...HEAD -- 'src/' ':!src/*.test.ts'` is **empty**;
  `git diff --numstat main...HEAD -- AGENTS.md plans/nfr-catalog.md vitest.config.ts` is **empty**;
  `sed -n '28,35p' plans/nfr-catalog.md | shasum -a 256` returns
  **`63f667958eeabcaa884d45b18b513c7bbe9855266c4959dfd16f87b0802eca31`** on **8** rows; and, **if the
  lane is registered inside `src/cli.test.ts`**, `const N8_SPAWN` is **byte-identical** and
  `expect(spawned).toBe(N8_SPAWN)` is **green with the variable both set and unset**. **Hashed and
  run, never promised.** *Hash verified at this cut.*
- **`A6` (the lane is watched RED, not merely watched green).** **Then** a mutant that reverts the
  composition to a double — or removes `budgetMs: DEFAULT_BUDGET_MS` from the entry point — is
  planted **in a copy of the tree outside this repository**, the new lane goes **RED**, and the
  **default lane stays GREEN** on the same mutant. **That second half is the whole point of the
  ticket** and is the number to report: a lane that only ever goes green has proved nothing.

## Dependencies

- **None blocking. Pullable today.** `src/cli.ts`, `src/engine.ts` and the four deep-lane precedents
  all exist at `main` @ `565c623`; verified at this cut.
- **`ABC-118` (this cut's sibling): ORDERING ONLY, one way, and worth honouring.** **The lane this
  ticket builds is one more file a type-valid `exclude` glob could silently delete with all four
  gates green** — measured at this cut: excluding a not-yet-existing test file changes the collected
  count by nothing anyone compares. `ABC-118` is the control for that, and landing it first means
  this lane is born guarded. **Neither blocks the other**; if this lands first, `ABC-118`'s recorded
  expectation is simply one file larger.
- **`N8-SPAWN` ceiling — a CONDITIONAL BA/PM hand-off, not a block.** If the delivering hop registers
  the deep child inside `src/cli.test.ts`, `expect(spawned).toBe(17 + 7)` must hold **with the
  variable set as well as unset** (`A5`). If it cannot, the hop **stops and a BA/PM amendment raises
  the ceiling with the derivation written**, per the precedent that raised it twice. It is not the
  engineer's to take at the bench.
- **`ABC-108` / `ABC-111`:** ordering only. They own `NFR-008`'s total and the wall clause's
  measurement protocol. This ticket claims no line against either.
- **`ABC-109`** (`AGENTS.md` byte cap): named-owed, non-blocking, zero bytes written (`A5`).

## Risks

- **A hook or double leaks into the "real" child and the lane proves nothing.** The exact failure
  this ticket exists to prevent, and it would be invisible — an instant green. `A1`'s **≥ 1.0 s**
  wall floor and `A6`'s watched red are the two defences, and they are deliberately redundant.
- **The lane is written with a machine-dependent assertion and flakes.** Then it gets disabled, and
  the gap returns with a file standing where the coverage should be. `A3` bars specific moves,
  scores, depths and node counts outright.
- **`AR-N8SPAWN-DRIFT`-shaped drift into the default lane.** A later hop removes the env guard "just
  to see it run" and the default lane inherits 3.07 s of wall per child. Mitigated by `A2`'s paired
  bound being re-run at every hop that touches the file, not by a mechanism — **stated, not claimed**.
- **The lane is read as re-measuring `NFR-004`.** It is not: `A3`(ii) uses `NFR-004`'s number as an
  upper bound on a child, on unspecified hardware. **No `NFR-004` line is claimed.**
- **A hop reads this ticket as alleging a bug in `ABC-043` or in the engine.** It alleges neither.

## Test notes

- Lane is `npx vitest run --dir src` for the default reading; the new lane's own command is recorded
  by `A1` and owed to `AGENTS.md` `### Test` (named owed above).
- **Every mutant is planted in a COPY of the tree outside this repository**, `node_modules`
  symlinked, base measured first, reverted, `git status --porcelain -- src/` empty afterwards.
- **Use `if (RUN_DEEP) { describe(...) }`, never `describe.runIf` / `it.runIf` / `.skipIf`** —
  measured at this cut to report a skip and move the gate's count off 0.
- **The new lane's file must always define at least one default-lane test** — measured at this cut:
  a file that registers nothing fails with `No test suite found in file`.
- Mandatory gates: `npm run lint`, `npm run typecheck`, `npm run build`, unit — all four, on the
  branch tip before merge and on `main` after, both recorded. **The new lane is NOT a mandatory
  gate**, on the precedent of all four existing deep lanes; it is run at the QE hop and after any
  change to `src/cli.ts` or `src/engine.ts`.
- **Test integrity:** `.grugops/test-skips.md` is **human-owned** — read it and run the check, never
  write a row into it. `quality.test_integrity` is `warn`.
- **QE hop is owed** (owner's standing rule, 2026-08-17) before `In Review` is exited. **QE is not
  UAT.** The delivered diff is expected to carry **zero production lines**, so the 2026-08-17 UAT
  waiver is expected to apply — **measured from git at the exit, never asserted here.**

## NFR / security

- **`N8-LANE`: no line is claimed, deliberately.** `ABC-108` is open and `NFR-008` is **BREACHED**;
  a slice of a spent total is not a slice. Same posture as `ABC-110`, `ABC-113`, `ABC-114`, `ABC-116`.
  **Reading recorded at this cut: ~4.1–4.3 s wall / ~16.5–17.3 s CPU against a 3 s / 13 s bar, on a
  scratch copy over 5 rounds — a READING, not the ratified ≥ 7-round protocol, reported to `ABC-108`.**
- **`N8-SPAWN`: `T1` and `T2` both expected NOT FIRED in the default lane.** No existing child's argv,
  stdin script, substitution hook or settle changes (`## Out of scope`), and the count literal is
  expected byte-identical (`A5`). **The deep child's ~3.07 s wall / ~3.19 s CPU is charged to the
  opt-in lane and to nothing else** — that is this ticket's entire pricing argument, and `A2` is where
  it is proved rather than asserted.
- **`NFR-004` (engine ≤ 3 s at default difficulty): used as a BOUND, never re-measured.** `A3`(ii)
  asserts the child stayed inside it; no row here may be read as a re-measurement of that NFR, on
  `ABC-043`'s own wording.
- **`NFR-008`: not graded here.** Contribution reported: **+0.09 s wall / +0.06 s CPU** measured for a
  lane of this shape.
- **Security: ASVS L1, and this is the one place it is genuinely engaged on this cut.** The lane
  spawns a child process and writes to its stdin. **No spawn argument or stdin script may be built by
  string concatenation from anything outside the file**; the child gets a fixed argv and a fixed
  script, `timeout` is set so a search that never returns cannot hang the lane, and the child inherits
  no secret. Existing discipline in `src/cli.test.ts` — followed, not re-invented.

## Size and priority — the argument, not the label

**`M`, and I differ upward from the shape a "one more test" reading suggests.** The comparables on
this board: `ABC-116` (`XS`) is one comment site; `ABC-114` (`S`) is four comment sites plus three
planted builds. This is a **new lane** — a new env contract, a spawn harness that must run
hook-free, four criteria of which two (`A3`, `A6`) are genuine design work, a paired-run measurement,
a watched red **and** a watched-green-on-the-same-mutant control, plus two measured construction
traps that defeat the obvious build. **Not `S`:** something is constructed and a lane contract is
created. **Not `L`/`XL`:** zero production lines, one file, one variable, and four working
precedents to copy — there is no unestimated risk left after the pricing above, which is exactly what
the `XL`-split rule is for.

**`P2`, and I decline to inherit QE's MEDIUM as a priority — a severity is not a priority.** The
argument, both directions:

- **For higher:** this is the largest coverage hole in the product's flagship path. **The product's
  strongest end-to-end evidence is a person at a terminal**, and it grows with every `EPIC-006`
  ticket.
- **Against higher, and this is what decides it:** the composition is not suspected of being broken —
  it is asserted textually at `:2447`, its seam is unit-covered by `ENGINE_DEEP`, and **three
  independent hand runs** (two QE's, one mine at this cut) show it working. **Nothing is failing and
  nothing is blocked.** This buys future protection, not a present repair.

- **NOT `P1`:** no live defect, no wrong gate, no player-visible fault, no blocked ticket. Its sibling
  `ABC-118` **is** `P1` because a defect there is live in the tree today; this one is not, and cutting
  both `P1` would say the two are equally urgent when I measured them not to be.
- **NOT `P3`:** two QE hops declined to absorb it into a PASS, it travelled into `Ready for UAT` as a
  named unowned gap, and the cost of leaving it is monotonically increasing.
- **`P1` PROMOTION TRIGGER:** any change to how `src/cli.ts` composes the engine, or any real defect
  found in the delivered composition that the default lane did not catch. **Either event and the
  textual assertion has been shown insufficient in fact rather than in argument.**
- **`P3` DEMOTION TRIGGER:** `EPIC-006` produces a packaged artifact with its own end-to-end
  acceptance that exercises the real engine through the delivered composition. One event, and this
  ticket is then largely redundant rather than merely lower.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-21**. **Result: 9 of 10, ⚠️x1 — PULLABLE TODAY. The ⚠️ is item 5, and it is a DISCLOSED
CONDITIONAL HAND-OFF with a named stop, not an open question.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the user is the next hop that changes the engine composition; the pain is a fully green lane over an unexercised composition — re-derived here: four `DEFAULT_BUDGET_MS = 0` substitutions and one source regex at `:2447`; the value is stated without overclaiming — coverage, not a repair, and no bug is alleged |
| 2 | scope and out-of-scope clear | **✅** eight fences, including `ENGINE_DEEP` explicitly not the fix, the transcript explicitly not promotable, the `N8-SPAWN` raise refused at the bench, and two documents named owed with their owners |
| 3 | INVEST-shaped | **✅** independent of `ABC-118` in both directions (ordering only, argued), one hop, one agent, one file. The `XL`-split rule is answered in `## Size` — the estimable risk was priced before the cut, not left for mid-build |
| 4 | acceptance testable and measurable | **✅** `A1` a wall floor plus an exit code; `A2` a skip count, a spawn count and a paired-run bound with a sign rule and a disagreement clause; `A3` four properties with a machine-independence rule and an explicit ban on move/score/depth/node literals; `A4` a before/after equality on side-to-move and ply; `A5` two git predicates, a **sha256 on 8 lines** and a literal run both ways; `A6` a watched RED **and** a watched GREEN on the same mutant. **No criterion says "works"** |
| 5 | dependencies known | **⚠️ FIVE, AND ONE IS CONDITIONAL — NOT SMOOTHED.** Four are plain (none blocking; `ABC-118` ordering one-way; `ABC-108`/`ABC-111` ordering; `ABC-109` named-owed). **The fifth cannot be resolved at this cut: whether the `N8-SPAWN` ceiling needs raising depends on a placement decision that is the delivering hop's to make.** It is written as a **named stop** — the hop halts and asks BA/PM rather than taking the raise — so the unknown has a defined behaviour instead of a guess. **A page scoring ✅ here would be pretending I had made a placement decision I deliberately did not make** |
| 6 | security/NFR triggers with a measurable target | **✅** `A2`'s bound is **≤ 0.30 s wall AND ≤ 0.30 s CPU**, median of ≥ 5 interleaved paired runs, sign ≥ 4/5, with the reading behind it; `A1`'s **≥ 1.0 s** floor; `A3`(ii)'s **≤ 3 s** used as a bound with `NFR-004` explicitly not re-measured; `N8-LANE` in `ADR-0014` decision 4's form — reading **and** BREACHED state, so it cannot read as a pass; `N8-SPAWN` charged to the opt-in lane with the arithmetic on the page; ASVS L1 engaged with four concrete rules on the spawn |
| 7 | test notes present | **✅** eight, including the two measured construction traps (`runIf` reports a skip; an empty file fails collection), the out-of-repository mutant discipline, the human-owned skips file, the new lane explicitly NOT a mandatory gate with its precedent, the owed QE hop, and the UAT waiver measured at the exit |
| 8 | size assigned | **✅** `M`, with the `ABC-116`/`ABC-114` comparables and both the not-`S` and not-`L` arguments |
| 9 | priority assigned | **✅** `P2`, with the refusal to inherit a severity as a priority, both directions stated including the one arguing against this ticket, the explicit contrast with `ABC-118`'s `P1`, and two named triggers |
| 10 | no major unresolved blocker | **✅** none. The two edits this ticket implies elsewhere are named owed with their owners and deliberately not made, and one of them is disclosed as a **pre-existing** debt rather than one this ticket creates |

Column moves are the Orchestrator's.
