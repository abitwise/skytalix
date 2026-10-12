---
id: ABC-119
title: No automated test anywhere spawns the delivered CLI and lets the REAL engine choose a move — the product's strongest end-to-end evidence is a transcript
status: done
column: Done
size: M
priority: P2
epic: EPIC-006
feature: —
---

# ABC-119 — `G-06`: give the real search an opt-in lane, and pay for it OUT of the default lane rather than into it

> **Cut 2026-08-21 by BA/PM** (task `cut-050-exclude-and-g06-2026-08-21`, Workflow 07), on the
> project owner's instruction in session, out of QE/E2E's gap register at
> `quality-gate-ABC-043-qe-2026-08-19` (`G-06`, MEDIUM, *"BA/PM to cut; `ENGINE_DEEP` is the
> precedent"*).
>
> **Re-cut 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `recut-abc119`) after the build
> hop stopped before any code (`66bec27`, note `…5b1e7c04`) on three moved premises. Each is ruled
> here, and the reasons are in `.grugops/context/recut-abc119/notes/`:
> - **`A5`.** The literal line-range hash is dropped. A git predicate on the whole file is kept.
> - **Placement.** The lane is ruled OUT of `src/cli.test.ts`, so the `N8_SPAWN` conditional is gone.
> - **`A3`(ii).** It is re-bound to `NFR-004`'s **5 s hard ceiling**, because 3 s is `AR-NFR004-A`.
>
> Every line and number below is re-anchored to `grugops/wave-2026-09-25` @ `2287959`.
>
> **`ABC-043` IS NOT RE-OPENED AND IS NOT DEFECTIVE.** It declared this exclusion before any gate
> ran, and `src/cli.test.ts:656-663` states it in the tree. **A gap a ticket declared and fenced is
> not a defect of that ticket.** No other ticket, ADR or QE verdict is re-opened.
>
> **NAMING TRAP.** `G6` (no hyphen) is a DIFFERENT and CLOSED `ABC-037` gap. `G-QE115-1..5` are
> unrelated. **This ticket is `G-06`, with the hyphen, and nothing else.**

## Problem

**No automated test in this repository spawns the delivered CLI composition and lets the real
`src/engine.ts` search choose a move.** Re-verified at `2287959`:

- Every child in `src/cli.test.ts` that would reach an engine turn substitutes `./engine.ts` with a
  double exporting `DEFAULT_BUDGET_MS = 0` — **four such substitutions** (`:595`, `:617`, `:732`,
  `:750`). Children without a hook never reach an engine turn.
- The wiring is asserted **textually**: `src/cli.test.ts:2512` matches the entry point's SOURCE
  against `/engine:\s*createEngine\(\{\s*budgetMs:\s*DEFAULT_BUDGET_MS\s*\}\)/` (`src/cli.ts:175`).
  That proves the line is written. It does not run it.
- **`ENGINE_DEEP` exists and does NOT close this**, and that is the reading to refuse in advance: it
  drives `chooseMove` / `createEngine` **in-process, as a unit**. It never spawns the CLI, so it
  exercises the seam and not the delivered composition. The gap is composition, not search.

**The only end-to-end evidence is hand runs transcribed in context notes.** QE wrote of its own
transcript: *"That is not a criterion and I am not recording it as one."* This page agrees. The user
is the next hop that changes how `cli.ts` composes the engine. The pain is that the whole default
lane can stay green while the real search is wired to nothing. The value is one opt-in lane that
actually plays.

Measurements and paired runs: `.grugops/context/cut-050-exclude-and-g06-2026-08-21/notes/` (cut),
`.grugops/context/recut-abc119/notes/` (re-cut) — not on this page (`AGENTS.md` `## Process rules` 2).

## The ruling this page owes: an OPT-IN LANE, in a NEW FILE, and the arithmetic that forces it

**Ruled: a new opt-in lane on the existing `*_DEEP` precedent. NOT a default-lane row.** One
real-engine child in the default lane is arithmetically excluded. One real engine ply at
`DEFAULT_BUDGET_MS` costs **3.07–3.21 s real** per child (three runs at the cut; six at the re-cut,
three each by the Engineer and BA/PM, at load1 13–26). Against `src/cli.test.ts`'s `N8-SPAWN` clause
in force (**≤ 7 added children AND ≤ 2.0 s added wall AND ≤ 0.30 s added CPU per added child**):

| clause | one real-engine child | verdict |
|---|---|---|
| ≤ 7 added children | **27 = `17 + 7 + 1 + 2`** (`:1832`), raised at `ABC-045` and `ABC-046` | not this ticket's to raise |
| ≤ 2.0 s added wall | **~3.1–3.2 s from one child** | breached ~1.6x |
| ≤ 0.30 s added CPU per child | **~2.8–3.4 s** (user + sys) | breached **~10x** |

**The lane it would join has no room either.** `NFR-008` is **≤ 3 s wall AND ≤ 15 s CPU** (`ADR-0019`,
the owner's level since 2026-09-19). The CPU clause read **MET by 60 ms and NOT robust** at
`2c96dbd`. The wall clause is reported, not ruled (`ABC-111`).

**Placement, ruled 2026-10-10: the lane lives in a NEW test file and `src/cli.test.ts` is not
touched.** The cut left placement to the delivering hop. The tree now decides it. The pin at
`src/cli.test.ts:1832-1845` counts every child made through `childOf`. Those children are spawned at
module scope, and the file is held to **exactly one** `spawnSync` call site. A real-engine child
inside that file can therefore do one of three things. It can go through `childOf`, and then
`expect(spawned).toBe(N8_SPAWN)` is red with the variable set. It can be spawned lazily after the pin
runs, which is green only by test order. Or it can add a second `spawnSync`, which reds the pin's
own source check. None of the three is buildable.

**The price is paid outside the default lane.** At the cut, one extra always-collected file whose
deep cases are undefined when the variable is unset was measured as **median +0.09 s wall and
+0.06 s CPU**. That is 5 interleaved paired rounds, sign positive 4 of 5, skip count 0 both ways.
`A2` re-measures it on the build.

## Two construction constraints, MEASURED at the cut, that defeat the obvious build

1. **`describe.runIf(RUN_DEEP)` REPORTS A SKIP and must not be used.** Measured: `1 skipped`, which
   moves the gate's test-integrity count off **0**. `.grugops/test-skips.md` is **human-owned**.
   Every existing deep lane uses `if (RUN_DEEP) { describe(...) }`, so its cases are **not defined**
   rather than skipped. `src/engine.test.ts:68-73` states the reason, and `:931` shows the form.
2. **A new file that registers NOTHING when the variable is unset FAILS the default lane**
   (`Error: No test suite found in file …`, `Test Files 1 failed`). The placement ruling makes this
   binding: **the new file defines at least one default-lane test that spawns nothing and can fail.**
   `A2` makes that a watched green. *(Neither re-run at the re-cut; `vitest` is still `^3.0.0`.)*
   *(2026-10-12: that default-lane row is amended, and the amendment is delivered by `ABC-095`'s diff.
   See § Amendment — 2026-10-12.)*

## Scope

- One **opt-in lane** in **one new test file under `src/`**, env-gated on the `*_DEEP` precedent. It
  **spawns the delivered entry point with no engine substitution and no hook** and lets the real
  search answer.
- Acceptance that is **deterministic against a non-deterministic opponent** — see `A3`.
- The lane's **default-lane cost measured** and its **command recorded**.

## Out of scope

- **Any production line under `src/`.** Zero. `src/cli.ts`, `src/engine.ts`, `src/turn-loop.ts` and
  `src/search.ts` are read, never written. **This ticket adds coverage; it fixes no bug.**
- **`src/cli.test.ts`, in full.** It is not touched (placement ruling), so `N8_SPAWN`, `CHILDREN`,
  every default-lane row, argv, stdin script, hook and settle are byte-identical by construction.
  *`ADR-0017` `T2` does not fire.* **No `N8-SPAWN` raise is needed, and none is available here.**
- **Any change to `ENGINE_DEEP` or any other existing deep lane.**
- **`plans/nfr-catalog.md`, `NFR-004`, `NFR-008`, `AR-NFR004-A`, `ADR-0008`, `ADR-0014`,
  `ADR-0019`, `ABC-108`, `ABC-111`.** Not amended, not re-measured as a verdict, not claimed
  against. See `## Named owed`.
- **`AGENTS.md`** (see `## Named owed`) and **`ABC-050`'s residuals** (different subject).
- **Promoting any hand-run transcript to a criterion.** Refused, on QE's own words and mine.

## Named owed, deliberately not written — two documents, each with its owner

- **`AGENTS.md` `### Test`.** Every deep lane has a command line there with a `RUN` stamp, and this
  lane owes one. `ABC-109` is `Done`. The file targets ≤ 24,576 B and is at 23,879 B. **This ticket
  writes zero bytes to it.** The line goes to the **`AGENTS.md` Scribe** after merge, on the
  `scribe-deep-lanes-081` precedent.
- **`plans/nfr-catalog.md` `NFR-008`.** The row bounds *"`npm test` with **`PERFT_DEEP`** unset"*
  and names one variable by hand. **It is already under-inclusive by five**: `SEARCH_DEEP`,
  `ENGINE_DEEP`, `INPUT_DEEP`, `ZOBRIST_DEEP` and `PUZZLE_DEEP` all exist and none is named. This
  ticket's variable makes **six**. That is a **pre-existing debt this ticket extends, not one it
  creates**. It is **Architect/Design's**, and it is non-blocking. `A5` pins the file from git.

## Acceptance (Given/When/Then)

- **`A1` (the lane exists, is opt-in, and actually runs the real search).** **Given** the variable
  set, **when** the lane runs, **then** at least one child is spawned that runs the delivered entry
  point *— amended 2026-10-12, delivered by `ABC-095`'s diff (§ Amendment — 2026-10-12): **from a
  temporary copy of the tree**, made under `mkdtemp(os.tmpdir() …)`, **a real copy** in which no entry
  under `src/` is a symbolic link (`lstat`), **whose `src/` is byte-identical to the repository's,
  asserted before the spawn**, **and in which `data/opening-book/book.json` is absent**; the copy is
  removed by a recursive `rmSync` of exactly the path `mkdtemp` returned —* **with no `--import`, no
  substitution hook and no double**, the child's own wall time is **≥ 1.0 s** ~~(an instant reply
  proves a double leaked in)~~ **(an instant reply proves a double, or the book, leaked in)**, it
  **exits 0**, and the recorded run states the measured wall and the command verbatim.
- **`A2` (the default lane pays nothing, and both traps are cleared).** *Two clauses re-worded
  2026-10-10 by BA/PM (subtask `rule-abc119-a2`). Neither bound moved. Ruling:
  `.grugops/context/rule-abc119-a2/notes/`.* `<base>` is `git merge-base <wave> HEAD`, which is
  `A5`'s three-dot base. **Given** the variable **unset**, **then** the default lane is **green**;
  the skip count from `npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'` is
  **0**; the new lane contributes **zero spawned children**; and:
  - **(i) Inventory — `ABC-118`'s control, read as a delta.** `node tools/grugops/lane-inventory.js`
    is run on `<base>` and on `HEAD`. **Every finding `HEAD` prints is also printed on `<base>`.**
    `HEAD`'s collected and tracked counts are each **exactly one** higher than `<base>`'s, and the new
    file appears in neither finding list. **When `<base>` exits 0, this is exactly "`HEAD` exits 0".**
    `ABC-130` is the predecessor of that literal reading; this ticket does not wait for it.
  - **(ii) Paired cost — read under `plans/nfr-catalog.md`'s `N8-LANE` protocol.** QE runs the
    default lane in **three** trees outside the repository, with `node_modules` symlinked:
    - `<base>`;
    - `HEAD`;
    - a `cmp`-verified byte-identical twin of `<base>`, which is the **identity null control**.

    The protocol is **n ≥ 7** interleaved rounds, the order rotated every round, one fresh process
    per run, and round 0 discarded. load1 is logged beside every run, and the runner command is
    stated.
    - **Admissible only if** the twin's median CPU delta against `<base>` is **≤ 1.5 %** of `<base>`'s
      CPU **and** its sign is at chance (two-sided sign test p ≥ 0.05; for n = 7 or 8, anything but
      0/n or n/n).
    - **On an admissible reading:** the median paired `HEAD − <base>` delta is **≤ 0.30 s CPU** with
      its sign reported, **and** **≤ 0.30 s wall**.
    - **No sign-agreement rule applies.** The catalog measures a per-file wall delta as
      indistinguishable from zero, so a wall sign rule is a coin flip. The null twin is what says the
      reading is not noise.
    - **An inadmissible set is re-run and read as neither pass nor fail.** After two inadmissible
      sets, QE stops and hands up to Security/NFR.
    - The same admissible reading, net of the 160 ms per-file floor, is this ticket's `N8-LANE` line.

  *Read at the cut: +0.09 s wall, +0.06 s CPU. At `ba20d25`, three sets with no null twin
  (inadmissible either way): pooled +0.02 s wall, +0.115 s CPU.* **If QE's admissible reading
  disagrees, QE's number is recorded and the disagreement is written down** — `ABC-114` `A3`'s
  discipline.
- **`A3` (deterministic assertions against a non-deterministic opponent — the criterion that makes
  this lane worth having).** *(Amended 2026-10-12, delivered by `ABC-095`'s diff: **Given** the same
  children as `A1`, run from `A1`'s book-absent copy.)* **Then** every assertion is on a property the
  real search cannot
  legally violate, and **no assertion names a specific move, score, depth or node count**:
  (i) the engine's reply is a **legal move in the position it was played in**, checked by the
  project's own move generator, not by a literal; (ii) it arrives **within `NFR-004`'s 5 s HARD
  CEILING** (`HARD_CEILING_MS`, clause B), measured as the child's whole wall time from spawn to
  exit, which bounds the reply from above — **not** the 3 s clause, which is `AR-NFR004-A` (missed by
  abort granularity at `budgetMs = 3000`) and so red by construction; (iii) the session **advances**
  — the side to move and the ply number both change; (iv) `stderr` carries **no stack trace** and the
  exit code is **0**, never `70` *— amended 2026-10-12, delivered by `ABC-095`'s diff:* **and `stderr`
  carries the probe's one book-absent warning line, asserted PRESENT, exactly once** (`ABC-095` `A5`).
  It is the leak detector: if it is missing, the child read a book. **A criterion that would go red on a different machine or a
  different search is not a criterion, and this page will not accept one.**
- **`A4` (the rejection path against the real engine).** *(Amended 2026-10-12, delivered by
  `ABC-095`'s diff: **Given** `A1`'s book-absent copy.)* **Then** one child feeds an illegal or
  unparseable input into a real-engine session and observes `ABC-019`'s **non-advancing-with-a-message
  cadence** — the same side to move and the same ply number before and after — with the session
  continuing rather than exiting. *This is the one behaviour a hand run has already shown against
  the real engine and a suite never has.*
- **`A5` (the fence, checkable from git).** **Then**, with `<wave>` the branch the build task file
  names as `base:` (today `grugops/wave-2026-09-25`),
  `git diff --numstat <wave>...HEAD -- 'src/' ':!src/*.test.ts'` is **empty**;
  `git diff --numstat <wave>...HEAD -- src/cli.test.ts AGENTS.md plans/nfr-catalog.md vitest.config.ts`
  is **empty**; and `git diff --numstat <wave>...HEAD -- src/` names **exactly one** file, the new
  lane's. **Run, never promised.** *Why `<wave>` and not `main`: parallel builds land on the wave ahead
  of `main`, and `main...HEAD` would charge their lines to this ticket.*
- **`A6` (the lane is watched RED, not merely watched green).** **Then** a mutant that reverts the
  composition to a double — or removes `budgetMs: DEFAULT_BUDGET_MS` from the entry point — is
  planted **in a copy of the tree outside this repository**, the new lane goes **RED**, and the
  **default lane stays GREEN** on the same mutant. **That second half is the whole point of the
  ticket** and is the number to report: a lane that only ever goes green has proved nothing.

## Dependencies

- **None blocking. Pullable today.** `src/cli.ts` (unchanged since the cut), `src/engine.ts` and the
  deep-lane precedents all exist at `2287959`. This was verified at the re-cut.
- **`ABC-118`: `Done`. The ordering is satisfied.** The lane is born guarded.
  `tools/grugops/lane-inventory.js` derives its expectation from `git ls-files`, so a tracked new
  file needs no edit there. `A2` runs it.
- **`ABC-108` / `ABC-111`** (both `Backlog`): ordering only. They own `NFR-008`'s total and the wall
  clause's protocol. This ticket claims no line against either.
- **`AR-NFR004-A`** (Security/NFR's, discharged at `EPIC-006`'s difficulty hop): not a dependency.
  `A3`(ii) asserts clause B only and claims nothing against clause A.
- **`AGENTS.md` lane line:** named owed to the Scribe, non-blocking.

## Risks

- **A hook or double leaks into the "real" child and the lane proves nothing.** It would be invisible
  — an instant green. `A1`'s **≥ 1.0 s** floor and `A6`'s watched red are the two defences, and they
  are deliberately redundant. *A `createEngine({})` mutant was probed at the re-cut: it exits 0 in
  0.14 s, so the floor alone reds it.*
- **`A3`(ii) is loose by design.** A budget regression that lands between 3 s and 5 s passes it.
  That is accepted: the tight bound is `AR-NFR004-A`'s ground, and `ENGINE_DEEP` covers the budget
  in-process.
- **The lane is written with a machine-dependent assertion and flakes.** Then it gets disabled, and
  the gap returns with a file standing where the coverage should be. `A3` bars specific moves,
  scores, depths and node counts outright.
- **`AR-N8SPAWN-DRIFT`-shaped drift into the default lane.** A later hop removes the env guard "just
  to see it run", and the default lane inherits ~3.1 s of wall per child. This is mitigated by `A2`'s
  paired bound being re-run at every hop that touches the file, not by a mechanism — **stated, not
  claimed**.
- **The lane is read as re-measuring `NFR-004`.** It is not. `A3`(ii) uses clause B's number as an
  upper bound on a child, on unspecified hardware. **No `NFR-004` line is claimed.**
- **A hop reads this ticket as alleging a bug in `ABC-043` or in the engine.** It alleges neither.

## Test notes

- The lane is `npx vitest run --dir src` for the default reading. The new lane's own command is
  recorded by `A1` and owed to `AGENTS.md` `### Test`.
- **Every mutant is planted in a COPY of the tree outside this repository.** `node_modules` is
  symlinked, the base is measured first, everything is reverted, and
  `git status --porcelain -- src/` is empty afterwards.
- **Use `if (RUN_DEEP) { describe(...) }`, never `describe.runIf` / `it.runIf` / `.skipIf`**
  (constraint 1). **The file always defines at least one default-lane test** (constraint 2).
- **The new file brings its own spawn.** `src/cli.test.ts`'s one-call-site pin is local to that
  file and is not touched. Follow its discipline (fixed argv, fixed stdin, `timeout`, the
  `child.error` guard) by reading it, not by importing from it.
- **`A2`'s two readings (ruled 2026-10-10).** The inventory delta runs the tool twice: once in a
  checkout at `<base>`, once at `HEAD`. Diff the finding lines. **This machine cannot be made quiet**
  (`nfr-catalog.md`, `ABC-108` `A1`), so load1 is logged and never gates. **The identity twin is
  what gates.** For the twin, use `git archive <base>` twice and `diff -r` them before the first
  round. One harness reading serves `A2`(ii), `N8-LANE` and Security/NFR's check.
- Mandatory gates are `npm run lint`, `npm run typecheck`, `npm run build` and unit. Run all four on
  the branch tip before merge and on `main` after, and record both. **The new lane is NOT a mandatory
  gate**, on the precedent of every existing deep lane. It runs at the QE hop and after any change to
  `src/cli.ts` or `src/engine.ts`.
- **Test integrity:** `.grugops/test-skips.md` is **human-owned**. Read it and run the check, but
  never write a row into it. `quality.test_integrity` is `warn`.
- **The QE hop is owed** (the owner's standing rule, 2026-08-17) before `In Review` is exited. **QE is
  not UAT.** The diff is expected to carry **zero production lines**, so the 2026-08-17 UAT waiver is
  expected to apply. **That is measured from git at the exit, never asserted here.**

## NFR / security

- **`N8-LANE` (≤ 650 ms CPU per ticket).** Write it in `ADR-0019` decision 5's form: the measured
  milliseconds first, then `NFR-008`'s clause state from the last conforming reading. `A2`'s
  ≤ 0.30 s CPU bound sits inside 650 ms. **`ADR-0019` Consequences expects a new test file to
  re-breach the 15 s CPU level**, because it has 60 ms of headroom. Write that state if it reads so,
  and do not escalate it as news.
- **`N8-SPAWN`: `T1` and `T2` NOT FIRED, by construction.** The default lane spawns zero new
  children, and `src/cli.test.ts` is byte-identical (`A5`). **The deep child's ~3.1 s wall / ~3 s CPU
  is charged to the opt-in lane and to nothing else.** `A2` is where that is proved.
- **`NFR-004`: used as a BOUND, never re-measured.** `A3`(ii) asserts that the child stayed inside
  clause B's 5 s. The whole child read 3.14–3.21 s at the re-cut, which leaves ~1.8 s of headroom.
  Clause A (≤ 3 s) is `AR-NFR004-A` and is not touched.
- **`NFR-008`: not graded here.** The contribution is reported. It read +0.09 s wall / +0.06 s CPU at
  the cut for a lane of this shape.
- **Security: ASVS L1, and genuinely engaged.** The lane spawns a child process and writes to its
  stdin. **No spawn argument or stdin script may be built by string concatenation from anything
  outside the file.** The child gets a fixed argv and a fixed script. `timeout` is set so that a
  search that never returns cannot hang the lane. The child inherits no secret.

## Size and priority — the argument, not the label

**`M`, unchanged by the re-cut.** The placement ruling removes a decision. It adds no work: the new
file was always one of the two placements the cut allowed. Comparables: `ABC-116` (`XS`) is one
comment site, and `ABC-114` (`S`) is four comment sites plus three planted builds. This ticket is a
**new lane**: a new env contract, a hook-free spawn harness, two criteria that are genuine design
work (`A3`, `A6`), a paired-run measurement, a watched red **and** green on the same mutant, and two
measured construction traps. **Not `S`:** a lane contract is created. **Not `L`/`XL`:** zero
production lines, one file, one variable, and precedents to copy.

**`P2`, unchanged — a severity is not a priority.** Re-checked at the re-cut. **For higher:** this is
the largest coverage hole in the flagship path. **Against higher, and decisive:** `src/cli.ts` has
not changed since the cut, and its composition is asserted textually at `:2512`. Its seam is
unit-covered by `ENGINE_DEEP`, and every hand run since the cut shows it working. Nothing is failing
and nothing is blocked.

- **NOT `P1`:** there is no live defect, no wrong gate and no blocked ticket.
- **NOT `P3`:** two QE hops declined to absorb it, and the cost of leaving it rises monotonically.
- **`P1` PROMOTION TRIGGER (not fired):** any change to how `src/cli.ts` composes the engine, or a
  real defect in the delivered composition that the default lane missed.
- **`P3` DEMOTION TRIGGER (not fired):** `EPIC-006` produces a packaged artifact with its own
  end-to-end acceptance on the real engine.

## Definition of Ready

**Re-scored 2026-10-10 by BA/PM (subtask `rule-abc119-a2`) at `ba20d25`, after the `A2` ruling.
Result: 10 of 10, 0 ⚠️.** Items 4, 5, 6 and 7 are re-written below; the rest are unchanged.
**The re-cut's 10 of 10 was wrong on item 4.** Its line *"No criterion is red by construction"*
was false at `2287959`, on two counts:
- `lane-inventory.js` had exited 1 on every tree since `b324cb6` (2026-09-24), and `ABC-122` had
  named that twice. The re-cut did not run the tool.
- A wall sign rule on a near-null delta is a coin flip.

The build found both of these, not the cut.

*Re-cut, kept as history:* re-assessed against `agent-factory/checklists/definition-of-ready.md` at
`2287959`, **10 of 10**. The cut scored 9 of 10 (⚠️ item 5, the `N8-SPAWN` conditional), and the
placement ruling closed that ⚠️. No fix here needs an NFR-catalog or ADR change.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** The user, the pain and the value are re-derived at `2287959`: four substitutions and one source regex at `:2512`. This is coverage, not a repair, and no bug is alleged |
| 2 | scope and out-of-scope clear | **✅** One new file. `src/cli.test.ts` is fenced in full. `ENGINE_DEEP` is explicitly not the fix, and the transcript is explicitly not promotable. Two documents are named owed, each with its owner |
| 3 | INVEST-shaped | **✅** One hop, one agent, one file. `ABC-118` is `Done`, so it is no longer even an ordering. The `XL` rule is answered in `## Size` |
| 4 | acceptance testable and measurable | **✅** `A1`: a wall floor and an exit code. `A2`: a skip count, a spawn count, an inventory finding-set delta with exact +1 counts, and a paired bound (≤ 0.30 s CPU and wall) on a reading that an identity twin admits, with a numeric admissibility rule. `A3`: four properties, including a 5 s ceiling that leaves ~1.8 s of headroom, with literals banned. `A4`: a before/after equality. `A5`: three git predicates. `A6`: a watched RED **and** a watched GREEN. Re-checked against the built tree at `ba20d25`: `A2`(i) reads met there (50→51 collected, 53→54 tracked, the same three findings). No criterion is red by construction, and none says "works" |
| 5 | dependencies known | **✅** `ABC-118` is satisfied. **`ABC-130`** is the predecessor of the literal "`lane-inventory.js` exits 0" and **does not block**: `A2`(i)'s delta reading is equivalent to it once `ABC-130` merges. `ABC-108`/`ABC-111` are ordering only. `AR-NFR004-A` is explicitly not a dependency. The Scribe line is owed. No placement can reach the `N8-SPAWN` pin |
| 6 | security/NFR triggers with a measurable target | **✅** `A2`(ii): ≤ 0.30 s CPU AND wall, admissible only with null ≤ 1.5 % and its sign at chance. `A1`: ≥ 1.0 s. `A3`(ii): ≤ 5 s, against `NFR-004` clause B. `N8-LANE`: ≤ 650 ms CPU net, from the same reading, in `ADR-0019`'s form. `N8-SPAWN`: 0 by construction. ASVS L1 on the spawn |
| 7 | test notes present | **✅** Eight notes, covering both traps, the out-of-repo mutants, the file's own spawn discipline, `A2`'s two readings and the twin, deep lanes as non-gates, the human-owned skips file, the QE hop, and the waiver as measured |
| 8 | size assigned | **✅** `M`, with comparables and the not-`S` / not-`L` arguments |
| 9 | priority assigned | **✅** `P2`, argued both ways, with both triggers re-checked and not fired |
| 10 | no major unresolved blocker | **✅** None. The owed `NFR-008` wording is pre-existing and Architect/Design's. The `AGENTS.md` line is the Scribe's |

Column moves are the Orchestrator's.

## Delivery

**2026-10-10, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-119-r2`).
Branch `grugops/ABC-119-r2` from `242b624`, code in `d45ca68`. Not merged, not pushed. Lane:
`CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`. Readings and raw files:
`.grugops/context/ticket-to-pr-ABC-119-r2/notes/`.

**Criteria: 5 of 6 met. `A2` is not met as written, and BA/PM rules it.**

| # | verdict | reading |
|---|---|---|
| `A1` | MET | Two hook-free children with an empty environment, 3098–3108 ms, exit 0. The command and wall time are logged on every run |
| `A2` | **NOT MET as written** | Met: lane green (51 / 1541), skip count 0, 0 spawned children. Not met: `lane-inventory.js` **exits 1 on the base too**, because of three tracked `.grugops/context/` probe files; the new file is tracked and collected. Paired medians: pooled +0.02 s wall / +0.115 s CPU (n=18). Set 2 read **+0.79 s CPU** at load1 up to 26, and the sign rule fails in every set. Recorded and handed up, not claimed |
| `A3` | MET | (i) The reply is one of `legalMoves(start)` by `toSan`, and the board read back equals `toFen` after `makeMove`. (ii) 3.10 s ≤ 5 s. (iii) The side changes and the ply is +1. (iv) No stack trace, exit 0 |
| `A4` | MET | After `zz9`: same side, ply and board, `rejectionMessage(unreadable)` shown, back to the prompt, ends on `input ended`, exit 0 |
| `A5` | MET | The first two predicates are empty. `-- src/` names only `src/cli.real-engine.test.ts` (+244/−0) |
| `A6` | MET | M2 (`DEFAULT_BUDGET_MS` rebound in the import, line 175 untouched): new lane **RED** at `A1` (120 ms), default lane **GREEN** 1541/1541. M1 (a double) reds both lanes |

**`N8-LANE`: +115 ms CPU pooled, not cleanly read** (set 2 alone exceeds 650 ms).
**`N8-SPAWN`:** `T1`/`T2` not fired. **Owed:** BA/PM's ruling on `A2`, the Scribe's `AGENTS.md`
line (drafted in `…2409b286`), the QE hop, and the `In Review` move (Orchestrator).

## Amendment — 2026-10-12 (delivered by `ABC-095`'s diff)

BA/PM (task `wave-2026-09-25`, subtask `bapm-amend-ABC-095`), at `main` `85e9d5cc`. **This page stays
`Done`. The amended criteria are delivered by `ABC-095`'s diff, not by a re-opening of this ticket.**
Rulings: `ADR-0037` § Addendum — 2026-10-12 R2, and Security/NFR's S3 item 7
(`.grugops/context/secnfr-ABC-095-placement/notes/…a096cf43`). Reasons:
`.grugops/context/bapm-amend-ABC-095/notes/`.

**Why the Givens change.** With the book wired, both of this lane's children only ever meet the book:
the engine moves at ply 0, from the start position, which is always in book. `A1`'s floor caught it
(201 ms and 187 ms on the SE's attempted wiring, `…ef39c9a6`). Without the change, `A3` and `A4` would
pass while testing the book. **This is a re-scope in form, not in substance.** `A1`–`A4` still read
the real search, through the delivered composition, with no hook. An absent artifact is a state the
product handles itself (`ABC-095` `A5`: one warning, then the search).

**What changed, each marked in place with the original words kept:**
- **`A1`'s Given.** The child runs from a temporary copy of the tree. The copy is real: no entry under
  `src/` is a symbolic link (`lstat`). Its `src/` is byte-identical to the repository's, asserted
  before the spawn, and `data/opening-book/book.json` is absent. It is made under
  `mkdtemp(os.tmpdir() …)` and removed by a recursive `rmSync` of exactly the path `mkdtemp`
  returned. "With no `--import`, no substitution hook and no double" is unchanged.
  - **Why "real".** Node resolves an ES module's `import.meta.url` to its real path. A copy whose
    `src/` (or `src/book-file.ts`) is a link reads the repository's book, and a byte-identity check
    reads through the link and cannot see it (`…f0bf8b4a` § 3).
- **`A1`'s parenthetical.** It now reads "a double, or the book, leaked in". The ≥ 1.0 s floor is
  unchanged.
- **`A3` and `A4`.** They take `A1`'s Given, because they read the same children.
- **`A3`(iv).** The book-absent warning is asserted **present**, exactly once, on the child's stderr.
  It is the leak detector. No stack trace and exit 0 are unchanged.
- **The default-lane row** ("the deep child runs the delivered entry point with no `--import`, loader
  or hook, and an empty environment"). Its entry path moves to the copy, and the copy's checks join it:
  - every entry under the copy's `src/` is a regular file;
  - the copy's `src/` is byte-identical to the repository's;
  - `book.json` is absent from the copy;
  - the deep children's entry point is the copy's `src/cli.ts`;
  - the copy is removed by the exact `mkdtemp` path.

  **It still spawns nothing.** Its filesystem writes go under `os.tmpdir()` only (`ABC-041` clause
  (c)). The cost is `UNKNOWN - verify` and is charged to `ABC-095`'s `N8-LANE` line.

**Unchanged:**
- **`A2`.** The default lane pays nothing, and the new lane contributes zero spawned children.
- **`A5`.** It is the fence on this ticket's own delivered diff, and it is not re-read against
  `ABC-095`'s diff.
- **`A6`.** Its mutant is still planted in a copy outside the repository, and it must still red `A1`
  on the amended lane. QE reads that at `ABC-095`'s hop.

**Rejected by the ruling, recorded here so they are not re-proposed:**
- hooking the book out (`A1`'s Given forbids a hook);
- having the human play `1. c3`, the one first move that leaves book (it ties the lane to the
  artifact's content);
- re-scoping `A1` (it would re-open `G-06`).

**The book-present real session is `ABC-095` `A7`'s `CLI_DEEP` row, not this lane's.**
