---
id: ABC-118
title: A type-valid `exclude` glob silently changes what the default lane collects — nothing in this repository asserts the lane's inventory
status: backlog
column: Backlog
size: S
priority: P1
epic: —
feature: —
---

# ABC-118 — assert what the lane COLLECTS, not just what the config's types are

> **Cut 2026-08-21 by BA/PM** (task `cut-050-exclude-and-g06-2026-08-21`, subtask
> `cut-050-exclude-and-g06`, Workflow 07), on the project owner's instruction in session
> (*"cut `ABC-050`'s exclude residual and `G-06`"*), out of QE/E2E's `A2` residual at
> `qe-ABC-050-2026-08-20`, which **named the instrument and refused to cut the ticket**.
>
> **`ABC-050` IS NOT RE-OPENED AND IS NOT DEFECTIVE.** This gap was never `ABC-050`'s to close —
> that ticket brought `vitest.config.ts` under `tsc` and Biome, which is what it promised and what
> it delivered, and its own engineer declared this limit rather than letting a green imply
> otherwise. **A residual of a ticket is not a defect of that ticket.** `ADR-0008`,
> `plans/nfr-catalog.md`, `NFR-008` and `ABC-108` are not re-opened, not re-scored and not moved.
>
> **THIS IS NOT `ABC-050`'s OTHER RESIDUAL.** The vitest sequencer / cached-durations trap that
> needs `--no-cache` for armed probes is a DIFFERENT item, is not this ticket, and is not cut here.

## Problem

`vitest.config.ts`'s `test.exclude` is a `string[]`. **Every glob in it is type-valid**, so the two
static tools `ABC-050` pointed at the file — which catch wrong TYPES and wrong KEYS — cannot see a
wrong VALUE. **Nothing in this repository asserts what the default lane actually collects.**

The user is the next hop that edits `exclude` — to add a directory, to fix a typo, to "tidy" the
repeated stock entries the file's own comment warns about. The pain is that they get four green
gates whether the edit is right or wrong. The value is one assertion that turns a silent inventory
change into a red line.

**Two directions, both measured at this cut, both fully green on all four gates:**

| mutant (one type-valid `exclude` string) | lane collects | verdict |
|---|---|---|
| add `"**/glyph-mode.nfr.test.ts"` — deletes a guard | 40 → **39** | green |
| typo `".claude/**"` → `".cluade/**"` | 40 → **80** | green, **1213 → 2426 tests** |

**The second one is the reason this is `P1` today and was not on 2026-08-20.** QE recorded it as
*"harmless only because the 37 agent worktrees were deleted"* and as having **counts identical**.
**Both halves have expired, and I measured that rather than repeating it.** A LIVE worktree exists
in this repository at `.claude/worktrees/residual-gqe115-3` carrying **40 `*.test.ts` files** of its
own; `.claude/worktrees/` is in `.gitignore`, so it is invisible to `git status` and to every gate
**except that one glob**. One character in one string doubles the lane, silently, today.

Measurements, the four probes, the mutant configs and the disagreements with the record are in
`.grugops/context/cut-050-exclude-and-g06-2026-08-21/notes/`, not on this page (`AGENTS.md`
`## Process rules` 2).

## The sentence of record this page corrects

**QE's verdict and the Orchestrator's note both say `ABC-050`'s `## Out of scope` fences this
instrument "by name". IT DOES NOT.** Read at this cut, `ABC-050`'s `## Out of scope` (lines 60–74)
has seven bullets and **none names a lane-inventory assertion**. The nearest is
*"A CI job, a pre-commit hook, or any control over config drift beyond the two tool scopes"* — which
fences it **in substance**, and that fence holds and is not disputed here. **"By name" is false, and
this factory has cut two tickets this week for sentences that sounded true.** The scoping conclusion
is unchanged; only the claim about how it was written down is corrected.

## Scope

- **One instrument that asserts the default lane's collected test-file inventory** — the set, or the
  count, against a recorded expectation — such that changing what the lane collects **forces an
  edit to the expectation and a stated reason**.
- **A ruling, argued on the page, on WHERE the instrument lives** (see `## The placement question`).
- **Two planted mutants, each watched RED**, one per direction of the table above.
- The recorded expectation and its update rule.

## Out of scope

- **Any change to `test.exclude`, `pool`, `isolate`, or any other runner option.** The delivered
  configuration does not move. This ticket asserts the current inventory; it does not re-decide it.
- **Any production line under `src/`.** Zero.
- **`plans/nfr-catalog.md`, `ADR-0008`, `NFR-008`, `ABC-108`.** Owner-ratified or open elsewhere.
  Nothing here amends any of them, and the eight `NFR-001`–`NFR-008` rows are pinned by hash in
  `A5`.
- **`AGENTS.md`.** `ABC-109` holds a byte cap on that file. **If the delivering hop concludes a
  `## Test integrity` or `## Test` line is owed there, it is NAMED OWED and left to `ABC-109`'s
  owner — not written here.**
- **Removing, moving or cleaning `.claude/worktrees/residual-gqe115-3`.** It is the Orchestrator's,
  and removing it would destroy the evidence this page rests on. **Measure it; do not touch it.**
- **A CI job or a pre-commit hook.** `ABC-050` refused these on `ABC-028` `F4`'s measurement and
  that refusal stands. This is an in-repository assertion, not a repository control.
- **`ABC-050`'s second residual** (the sequencer / cached-durations `--no-cache` trap). Named,
  deliberately not cut, and not authorised.

## The placement question — ruled by the delivering hop, and the trap is named here

**The obvious placement is a test file inside the lane. That placement is partly self-defeating and
this page will not let it ship unexamined.** A guard that lives in the lane it guards can be removed
by the very edit it exists to catch: a type-valid glob naming the guard file deletes the guard, the
count returns to a number nothing compares, and all four gates stay green. **Measured at this cut:
excluding a not-yet-existing `**/lane-inventory.test.ts` leaves the collected count at 40 — the
exclusion is completely silent.** This is QE's own recurring shape, *"guards that pass by being
unable to look"*, and it would be built into the guard against it.

**The delivering hop must rule this explicitly and record the argument** — in-lane, out-of-lane
(e.g. a step over `npx vitest list --filesOnly`, measured at this cut at **0.32–0.59 s wall /
~0.45 s CPU** in a separate process, so charging `NFR-008` nothing), or both. **A partial mitigation
is acceptable; an unstated one is not.** `A4` makes the ruling a deliverable.

## Acceptance (Given/When/Then)

- **`A1` (the inventory is recorded and the instrument is armed in the DELETION direction).**
  **Given** the tip tree, **when** a single type-valid `exclude` entry that removes exactly one
  collected file is planted **in a copy of the tree outside this repository**, **then** the
  instrument goes **RED and names the missing file or the changed count**, while `npm run lint`,
  `npm run typecheck` and `npm run build` all still exit **0** — the three readings recorded, so the
  page shows the instrument is the only thing that saw it.
- **`A2` (armed in the INFLATION direction, against the live worktree).** **Given** the same
  discipline, **when** `".claude/**"` is replaced by a one-character typo of itself, **then** the
  instrument goes **RED**. The delivering hop **records the collected count both ways at its own
  hop** and **states whether a live checkout under `.claude/worktrees/` was present** — because the
  inflation is only observable while one is. **If none is present at delivery, `A2` is met by
  creating a throwaway checkout for the probe and removing it, NOT by asserting the number from this
  page.** *Read at this cut: 40 → 80, and one live worktree present.*
- **`A3` (the expectation forces a reason).** **Then** adding a new `*.test.ts` file under `src/`
  makes the default lane **RED** until the recorded expectation is edited — demonstrated by planting
  one throwaway file in a copy outside the repository and observing the red, then reverting.
- **`A4` (the placement ruling is on the page, with its limit).** **Then** the delivering hop's
  ticket/notes state which placement was chosen, which was rejected and why, and — **if the
  instrument lives in the lane** — state in one sentence that **a glob naming the guard file itself
  removes the guard silently**, with whatever mitigation was taken and an honest statement of what
  is left uncovered. **A delivery that claims this hole is closed without a runnable red FAILS this
  criterion.**
- **`A5` (the fence, checkable from git and from a hash).** **Then**
  `git diff --numstat main...HEAD -- 'src/' ':!src/*.test.ts'` is **empty**;
  `git diff --numstat main...HEAD -- vitest.config.ts AGENTS.md plans/nfr-catalog.md` is **empty**;
  and `sed -n '28,35p' plans/nfr-catalog.md | shasum -a 256` returns
  **`63f667958eeabcaa884d45b18b513c7bbe9855266c4959dfd16f87b0802eca31`** on **8** rows.
  **Hashed, never promised.** *Verified at this cut.*
- **`A6` (the lane's own budget does not move materially).** **Then** the default lane is green with
  the same test count plus this ticket's own additions, the skip count is **0**
  (`npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'`), and the wall/CPU delta
  against the base is measured as the **median of ≥ 5 interleaved paired runs** with the sign
  agreeing on ≥ 4 of 5, both readings recorded. **No `N8-LANE` line is claimed** — see
  `## NFR / security`.

## Dependencies

- **None blocking. Pullable today.** `ABC-050` is merged; `vitest.config.ts` is under both static
  tools at `main` @ `565c623`; the live worktree is present — all three verified at this cut.
- **`ABC-119` (this cut's sibling): ORDERING ONLY, and it runs one way.** Whatever lane `ABC-119`
  builds is **one more thing a type-valid `exclude` edit could silently delete with all four gates
  green** — so this ticket protects that one, and doing this first is worth more. It is **not** a
  block in either direction, and `ABC-119` landing first simply means this ticket's recorded
  expectation is one file larger (`A3` is exactly the mechanism that forces that edit).
- **`ABC-108` / `ABC-111`:** ordering only. They own `NFR-008`'s total and its measurement protocol;
  this ticket claims nothing against either.
- **`ABC-109`** (`AGENTS.md` byte cap): mutual awareness, non-blocking; this ticket writes zero bytes
  to that file (`A5`).

## Risks

- **The guard is placed in the lane and is therefore removable by the defect it guards.** The
  central risk, measured above, mitigated by `A4` requiring it stated rather than by a mechanism
  that does not exist. **Not eliminated, and the page says so.**
- **The recorded expectation becomes a chore and gets loosened.** A hop that finds it in the way can
  weaken it to something that always passes. `A3` makes the forcing behaviour itself a watched red,
  which is the only defence available in-repository.
- **The inflation direction is untestable when no worktree is live.** `A2` handles this explicitly
  by requiring a throwaway checkout rather than a quoted number — because that is precisely the
  assumption that went stale between 2026-08-20 and this cut.
- **The instrument is read as covering `ABC-050`'s other residual.** It does not. Named in
  `## Out of scope`.

## Test notes

- Lane is `npx vitest run --dir src`; the repo-root form is what makes the whole question visible
  and is used only inside the probes.
- **Every mutant is planted in a COPY of the tree outside this repository**, `node_modules`
  symlinked, base measured first, each reverted, and `git status --porcelain` empty afterwards.
  **`vitest.config.ts` in this repository is never edited** (`A5`).
- `npx vitest list --filesOnly` enumerates the collected set without running it and is the cheapest
  known probe — **verified runnable at this cut**. Note that the CLI `--exclude` flag **appends to**
  the config's array rather than replacing it, so a deletion probe works from the flag but an
  **inflation probe requires a replacement config** — this cost one wrong reading at this cut and is
  recorded so the delivering hop does not pay it again.
- Mandatory gates: `npm run lint`, `npm run typecheck`, `npm run build`, unit — all four, on the
  branch tip before merge and on `main` after, both recorded.
- **Test integrity:** `.grugops/test-skips.md` is **human-owned** — read it and run the check, never
  write a row into it. `quality.test_integrity` is `warn`.
- **QE hop is owed** (owner's standing rule, 2026-08-17) before `In Review` is exited. **QE is not
  UAT.** The delivered diff is expected to carry **zero production lines**, so the 2026-08-17 UAT
  waiver is expected to apply — **measured from git at the exit, never asserted here.**

## NFR / security

- **`N8-LANE`: no line is claimed, deliberately.** `ABC-108` is open, `NFR-008` is **BREACHED**, and
  `ABC-111` has the wall clause's measurement protocol unsettled. **Read at this cut on a scratch
  copy, 5 interleaved rounds after a discarded warm-up: ~4.1–4.3 s wall and ~16.5–17.3 s CPU against
  a 3 s / 13 s bar.** That is a READING, not a re-ratification — it is not the ratified ≥ 7-round
  protocol on the reference machine — and it is reported to `ABC-108`, which owns the total.
- **`N8-SPAWN`: 0 added children expected**, and `T1`/`T2` **not fired** — this ticket changes no
  child's argv, stdin script, substitution hook or settle in `src/cli.test.ts`. **If the delivering
  hop's chosen placement spawns anything, it re-derives that row and says so; this line is an
  expectation, not a grant.**
- **Measurable target for `A6`:** default-lane CPU delta **≤ 0.30 s** and wall delta **≤ 0.30 s**,
  median of ≥ 5 interleaved paired runs, sign agreeing ≥ 4 of 5. Chosen because the probe that would
  dominate the cost costs ~0.45 s CPU **in its own process**; an in-lane instrument that globs the
  filesystem should cost far less, and a delivery that exceeds this bar has built the wrong thing.
- **Security: ASVS L1 not engaged.** No input path, no network, no filesystem write outside the
  repository's own test tree. **One honest note:** the instrument reads a directory tree that
  includes git-ignored agent worktrees. It must assert on **path shape and counts**, never read or
  echo file CONTENTS from `.claude/`.

## Size and priority — the argument, not the label

**`S`.** One assertion site, one recorded expectation, two planted mutants each watched red, one
throwaway-file probe, and a placement ruling that has to be argued. **Not `XS`:** the comparable
`XS` on this board is `ABC-116` — one comment block and one one-line mutant — and this has three
distinct reds to produce plus a genuine design question. **Not `M`:** nothing is constructed, no new
harness, no new lane, no production line, and the probe command already exists.

**`P1`, and I differ from the proposing role, which classified the residual without a priority and
called the worst mutant harmless.** The difference is a measurement, not a judgement:

- **The harm is LIVE, not hypothetical.** A one-character typo in one string takes the lane from
  **40 files / 1213 tests to 80 files / 2426 tests, fully green**, because a git-ignored checkout
  with 40 test files is sitting in this repository right now. QE's reason for calling that harmless
  — *"the 37 agent worktrees were deleted"* — was true when written and is **false today**.
- **The doubling direction is worse than the deletion direction and was rated lower.** The deletion
  mutant at least moves a count someone might notice. The doubling mutant **passes green while
  running a stale checkout's tests as if they were this repository's** — the lane would report on
  code that is not `main`.
- **It guards the other ticket.** `ABC-119`'s lane is one more file a type-valid glob can delete.

- **NOT `P0`:** nothing is broken at `main`, no gate is wrong today, no player sees anything, and
  the correct configuration is currently in the tree. This is an absent control, not a live failure.
- **NOT `P2`:** the pull the other way, stated rather than smoothed — **no such edit has actually
  happened**, `exclude` is edited rarely, and the file carries a long comment warning about exactly
  this area. What defeats that argument is the **cost asymmetry**: the control is one assertion, and
  the failure mode is a green gate reporting on the wrong tree.
- **`P0` PROMOTION TRIGGER:** any lane run observed collecting a file from outside this checkout, or
  any gate result found to have been produced by an inflated lane.
- **`P2` DEMOTION TRIGGER:** `.claude/worktrees/` becomes structurally impossible to check out
  inside the repository **and** the deletion direction is covered by some other instrument. Two
  events, not one.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-21**. **Result: 9 of 10, ⚠️x1 — PULLABLE TODAY. The ⚠️ is item 4, and it is a DISCLOSED
LIMIT OF THE INSTRUMENT authorised on the page, not an open question.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the user is the next hop that edits `exclude`; the pain is four green gates either way; the value is one assertion. Both directions measured at this cut — 40→39 and 40→80, all four gates green |
| 2 | scope and out-of-scope clear | **✅** eight fences, including `ABC-050`'s second residual by name, the live worktree marked measure-not-touch, `AGENTS.md` under `ABC-109`'s cap named-owed-not-written, and the CI/hook refusal inherited with its reason |
| 3 | INVEST-shaped | **✅** independent of `ABC-119` in both directions (ordering only), small, one hop, one agent. No split trigger registered — the placement ruling is a decision inside the ticket, not a second ticket |
| 4 | acceptance testable and measurable | **⚠️ FIVE OF SIX ARE, AND `A4` IS PARTLY NOT — NOT SMOOTHED.** `A1`/`A2`/`A3` are watched reds with recorded counts and three exit codes; `A5` is two git predicates and a **sha256 on 8 lines**; `A6` is a skip count, a test count and a paired-run bound with a sign rule. **`A4` requires a RULING and a stated limit — a written artefact, not a number.** It is written so the artefact's existence is checkable and so a false closure claim FAILS, but the underlying hole (an in-lane guard removable by the defect it guards) **has no mechanical closure in this repository and the page refuses to imply one** |
| 5 | dependencies known | **✅** four, each with direction: none blocking, `ABC-119` ordering one-way with the reason, `ABC-108`/`ABC-111` ordering only, `ABC-109` mutual non-blocking |
| 6 | security/NFR triggers with a measurable target | **✅** `A6`'s bound is **≤ 0.30 s wall AND ≤ 0.30 s CPU**, median of ≥ 5 interleaved paired runs, sign ≥ 4/5, with the derivation of the number; `N8-LANE` written in `ADR-0014` decision 4's form — reading recorded **and** clause state BREACHED, so it cannot read as a pass; `N8-SPAWN` stated as an expectation with a re-derivation instruction; ASVS L1 with the one real note (paths and counts, never contents) |
| 7 | test notes present | **✅** seven, including the out-of-repository mutant discipline, the `--exclude`-appends-not-replaces trap paid for at this cut, the human-owned skips file, the owed QE hop, and the UAT waiver named as measured at the exit |
| 8 | size assigned | **✅** `S`, with the `ABC-116` comparable and both the not-`XS` and not-`M` arguments |
| 9 | priority assigned | **✅** `P1`, with the disagreement with the proposing role stated as a measurement, the not-`P0` and not-`P2` arguments, the argument AGAINST this ticket stated, and two named triggers |
| 10 | no major unresolved blocker | **✅** none. The one edit this ticket may imply elsewhere (`AGENTS.md`) is named owed with its owner and deliberately not made — a disclosed hand-off, not a blocker |

Column moves are the Orchestrator's.

## Delivery

**Built 2026-09-19 by the Software Engineer** (task `wave-2026-09-19`, subtask
`ticket-to-pr-ABC-118`, Workflow 04) on branch `grugops/ABC-118-lane-inventory` @ **`1d0ce2a`**,
off `grugops/wave-2026-09-19` @ `129f53d`. **Unmerged; not deployed.** Full numbers, the raw
transcripts and the argument are in `.grugops/context/ticket-to-pr-ABC-118/notes/`
(`AGENTS.md` `## Process rules` 2); this section is the summary.

- **One file, measured from git:** `tools/grugops/lane-inventory.js` (+93, `node:` builtins
  only). `git diff --numstat 129f53d HEAD -- src/` is **empty** — zero production lines AND zero
  test lines under `src/`. `vitest.config.ts`, `AGENTS.md`, `plans/nfr-catalog.md` byte-identical
  to `main` (`A5`'s numstat, empty). No `package.json` change.
- **The shape:** `node tools/grugops/lane-inventory.js` compares what vitest collects at the
  repository root (`vitest list --filesOnly` — the `npm test` form, the one a `.claude/**` typo
  inflates) with every `*.test.ts` git tracks (`git ls-files`). Exit 0 equal; exit 1 naming each
  missing or extra path (paths only, never contents); exit 2 when git or vitest could not run.
  **The recorded expectation is the git index, not a number** — so a merge bringing a new test
  file (`ABC-079`'s `src/quiescence.test.ts`, unmerged today) brings it into both sets at once and
  nothing goes stale; a new untracked test file is collected-but-untracked and goes red until it
  is `git add`ed (`A3`, with the adding commit as the stated reason — the Orchestrator's
  no-hard-coded-count instruction taken over this page's earlier wording, said rather than
  silent).
- **`A4` — THE RULING: OUT OF THE LANE.** Rejected in-lane on three grounds: (1) an in-lane guard
  is removable by the glob it guards — BA/PM measured the silent exclusion at the cut, and a `.js`
  under `tools/` is not collected by vitest, so no `test.exclude` entry reaches it (`M4` below is
  the runnable demonstration); (2) a new lane file's ~370 ms floor cannot fit `A6`'s 0.30 s CPU
  bound; (3) a test file cannot see the lane's inventory from inside an isolated worker without a
  second vitest instance at about the same cost. **THE LIMIT, stated rather than smoothed: this
  is a FIFTH step like `test-skip-integrity.js`, not one of `quality.mandatory_gates`. Under
  `M1` and `M2` lint, typecheck and build stay 0/0/0; only this step, when run, goes red.** The
  `AGENTS.md` `## Test integrity` line recording the command is **NAMED OWED** to the Scribe under
  `ABC-109` and was not written.
- **`A1`–`A3`, watched red in a copy outside the repository** (rsync without `.git`, re-initialised
  as its own git repo, `node_modules` symlinked, config reverted and `git status --porcelain`
  EMPTY after every round; `vitest.config.ts` here never edited): **`M1`** `exclude` +=
  `"**/glyph-mode.nfr.test.ts"` → 42→**41**, RED naming `src/glyph-mode.nfr.test.ts`,
  lint/typecheck/build 0/0/0. **`M2`** `".claude/**"`→`".cluade/**"` with a throwaway checkout of
  42 files planted at `.claude/worktrees/probe/` → 42→**84**, RED naming all 42 foreign paths,
  0/0/0; 84→42 with the checkout removed. **Live checkouts under `.claude/worktrees/` ARE present
  in this repository at delivery** (`residual-gqe115-3` and 24 agent worktrees), measured and not
  touched. **`M3`** untracked `src/zz-abc118-throwaway.test.ts` → 43/42 RED, GREEN after
  `git add` (43/43). **`M4`** globs aimed at the guard (`"**/tools/**"`, `"**/lane-inventory*"`)
  → still runs, still 42/42. `M5` (stock `node_modules` entry dropped) 42 — a control, NOT a
  catch: the symlinked `node_modules` was not descended.
- **`A5`:** both numstats empty. The hash of rows 28–35 reads
  `b848732bcb13892fc1c25aba1cf9f54111597da3f27fde39f75fcc6991ac719f` on 8 rows, **not the pinned
  `63f66795…`** — the pinned value reproduces at `565c623`; the rows moved on `main` by
  `70a92f9` / `e40d160` / `258582f` / `569efbc` / `c9c5eb2` before this hop, and this hop wrote
  zero bytes to the file. **Met in substance, unmeetable as pinned; the pin is BA/PM's to
  refresh.**
- **`A6` / NFR:** four gates at `1d0ce2a`: `npx biome check .` 76 files clean; `npx tsc --noEmit`
  0; `npx vitest run --dir src` **42 / 1325 / 0 skipped** (9.1 s wall, 26.4 s CPU, load 9.95);
  JSON skip **0**; `test-skip-integrity` `No findings.`. 5 interleaved paired runs vs `129f53d`:
  median Δ wall **−0.04 s**, median Δ CPU **−0.32 s** (the lanes are byte-identical; the sign
  rule holds 4/5 for CPU, 3/5 for wall — noise at load 12–22, recorded as such). **`N8-LANE`
  0 ms, 0 files, no line claimed.** **`N8-SPAWN` 0 added children**; the instrument's own three
  children run outside the lane. **`NFR-008` read 7.0–9.2 s wall / 25.7–27.0 s CPU under load
  10–22 — REPORTED non-conforming to `ABC-108`, not ruled.**
- **QE hop owed** before `In Review` is exited; QE is not UAT. UAT: the diff carries zero
  production lines, so the 2026-08-17 waiver is expected to apply — measured from git at the
  exit, never asserted here.
