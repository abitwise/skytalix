---
id: ABC-114
title: Four false sentences ship in `EPIC-006`'s own instrument comments — the guards are right and their narration is not
status: backlog
column: Backlog
size: S
priority: P2
epic: EPIC-006
feature: —
---

# ABC-114 — repair four false comment sentences (and two page sentences) about `EPIC-006`'s guards: ZERO assertions changed, ZERO production lines

> **Cut 2026-08-20 by BA/PM** (task `cut-false-sentences-2026-08-20`, subtask `cut-false-sentences`,
> Workflow 07), out of three separate QE/E2E hops that each **found** a false sentence, **named** it in
> three places, and **deliberately refused to correct it**.
>
> **NOTHING HERE IS A BEHAVIOUR DEFECT.** Every assertion under every false sentence is sound and was
> watched RED against a wrong build before it shipped. The defect is in the *narration* — what a comment
> tells the next reader the row buys. Nothing under `src/` outside `*.test.ts` is touched; `A5` makes
> that checkable from git rather than asserted.
>
> **`ABC-043`, `ABC-044` AND `ABC-113` ARE NOT RE-OPENED, NOT RE-SCORED AND NOT MOVED.** `ABC-043` is in
> `Ready for UAT` awaiting the owner's word; `ABC-113` and `ABC-044` are `Done`. This ticket edits
> delivered *comments* in two of their files and two *sentences* on one of their pages, and no column.
>
> **THE CONFLICT RULE IS A CRITERION HERE, NOT A COURTESY (`A7`).** Three QE hops declined to author
> these corrections because authoring and adjudicating the same instrument is the conflict that produced
> `ABC-113` in the first place. This ticket inherits that discipline: **the agent that writes a
> replacement sentence is not the agent that validates it**, and the validator re-plants every build
> itself rather than reading a number out of a note.

## Problem

Four sentences on `main` @ `b03658f` state, as measured fact, things that were measured FALSE — three by
`ABC-113`'s QE hop, one by `ABC-043`'s. Each sits in a comment a next reader opens when deciding whether
a row is worth keeping, and each mis-prices the row it describes: two UNDERstate what a guard buys, one
OVERstates it, one narrates a symptom that is a race. **A note nobody reads does not correct a comment
everybody reads** — that sentence is in the `ABC-113` QE note and it is this ticket's whole reason.

The four sites, located by content because line numbers drift:

| | file | the false sentence | falsified by |
|---|---|---|---|
| S1 | `src/cli.test.ts` ≈2057 | *"…hands the loop a different object **with both of those rows still green**"* | `M9` reds the anchored shorthand row on `main`'s instrument |
| S2 | `src/cli.test.ts` ≈2053–2059 | the same comment names `D3` as the class the count row answers, and is **silent on the remainder** | `D4` — a `for…of` shadow, `tsc`-clean, lane GREEN on BOTH instruments |
| S3 | `src/result-screen.test.ts` ≈182 | *"…a mutant that the headline rows kill **ALONE is unconstructible** while those word rows stand"* | `M15`, constructed, `tsc`-clean, ONE red row in 1207 and it is the retargeted row |
| S4 | `src/cli.test.ts` ≈2119–2127 | *"that build renders ONE board, writes THREE prompts and **NEVER PLAYS THE MOVE**, where the delivered build plays it and renders TWO"* | re-run FIFO harness: delivered 3/2/1481 move played, mutant 3/3/1483 move played, 6/6 |

**S4 is self-contradicting on its own figures** and that is what makes it the sharpest of the four: a
build that rendered one board instead of two cannot be **two bytes longer** than the build that rendered
both, when a frame in this product is ~470 bytes. The numbers in that sentence disagree with each other
before any re-measurement touches them.

**Two of the same sentences are also on a BA/PM page**, `plans/tickets/ABC-113-…md` — line 64
(*"`A1` below closes `D3`"*) and line 106 (the `unconstructible` sentence). **BA/PM's ruling: both are IN
SCOPE of this ticket and were NOT corrected at the cut hop** — the reasoning is under `## Ruling`.

**Measurements, rejected shapes and the full site inventory are in
`.grugops/context/cut-false-sentences-2026-08-20/notes/`, not on this page** (`AGENTS.md`
`## Process rules` 2).

## Scope

- **Comment prose only**, in `src/cli.test.ts` and `src/result-screen.test.ts`. **Zero assertions
  changed, zero `it` blocks added or removed, zero production lines.**
- **Two sentences on `plans/tickets/ABC-113-two-instrument-residuals-in-epic-006s-own-test-files.md`**
  (lines 64 and 106 as of `b03658f`), corrected in place with the correction declared on the page and
  **not one word of the original deleted silently**.
- Each replacement sentence is **earned by a re-measurement at the repair hop** (`A1`–`A4`), never copied
  out of a context note.

## Out of scope

- **`D4`'s CLOSE.** Naming the remainder is in scope; adding an assertion that kills it is a new
  instrument and its own ticket. `A2` names it, `A5` forbids the assertion.
- **`M15`'s exploitation.** `A2` of `ABC-113` stays exactly as written; this ticket corrects what the
  comment CLAIMS about it, not what the rows DO.
- The **EPIPE session-death regression**, the **lane-inventory gap** and **`G-06`** — all three are real,
  all three are queued, none is this ticket's. If a repair hop believes a site belongs to one of them, it
  stops and says so rather than folding it in.
- The **nine off-shape `plans/traceability.md` rows** — unowned, nine separate decisions.
- Any file under `src/` that is not `*.test.ts`; `vitest.config.ts`; `biome.json`;
  `.grugops/test-skips.md` (**human-owned — no agent writes a row**).
- Moving, re-scoring or amending `ABC-043`, `ABC-044` or `ABC-113` beyond the two named page sentences.

## Acceptance criteria

- **`A1` (S1 — the `M9` sentence, re-measured not re-read).** **Given** `M9` (`const decoy = {
  ...history }` with `history: decoy,` at the `runTurnLoop(` call) planted at the branch tip, **when**
  `npx vitest run --dir src` runs against **this** instrument **and** against the control
  `git show main:src/cli.test.ts`, **then** the two row-level outcomes are recorded as numbers (failed /
  passed, and the failing row's message) **and** the replacement sentence states exactly what those two
  runs showed. **The sentence must distinguish `D3` from `M9`**: `D3` leaves both rows green; `M9` reds
  the shorthand row and the count row simply speaks first. **`tsc --noEmit` clean on the planted build;
  the build reverted and `git status --porcelain` empty afterwards.**
- **`A2` (S2 — the remainder, named and bounded).** **Given** `D4` (`const spare = { ...history }; for
  (const history of [spare])`) planted at the tip, **then** `tsc --noEmit` is **clean** and the lane is
  **GREEN on both instruments** — re-measured at this hop — **and** the comment names the open remainder
  as the `[:=]`-free binder forms **`for…of`, `for…in`, `catch (history)`, and a contextually-typed
  callback parameter**, with the count row's own regex `/\bhistory\s*[:=]/g` quoted as the reason. **The
  same narrowing is applied to `ABC-113` page line 64**: *closes `D3`* → *closes the annotated-rebind
  spelling of `D3`*. **No assertion is added** (that is `## Out of scope`).
- **`A3` (S3 — `unconstructible`, re-constructed at this hop).** **Given** `M15` re-built in
  `src/result-screen.ts`'s `headline()` (fivefold → a TWO-row headline, threefold → one row), **then**
  `tsc --noEmit` is clean, the lane against this instrument reports **exactly one failed test and it is
  the retargeted headline row**, and the control `git show main:src/result-screen.test.ts` reports the
  lane **fully green**. **Only on those two readings** may the sentence say `M15` is constructible,
  killed by the headline rows ALONE, and **evidence FOR** the retarget. **If this hop's numbers DISAGREE
  with the `ABC-113` QE note, the sentence follows THIS hop's measurement and the disagreement is
  written down** — copying the note is a FAIL of this criterion.
- **`A4` (S4 — no non-deterministic symptom stated as fact).** **Then** the delivered comment contains
  **no board count, no prompt count and no "never plays the move" claim that a re-run of the same
  harness does not reproduce 3/3.** Two shapes are admissible and the repair hop picks one **on
  measurement**: **(a) RE-MEASURE** — re-run the FIFO harness against the delivered build and the `G-03`
  hoisted build, record boards / prompts / bytes / move-played per run at ≥3 timings each, and write BOTH
  reachable outcomes with the single-slot overwrite in `createLineInputSeam` (`src/line-input.ts` ≈232)
  named as the cause; or **(b) STRIKE** — remove the empirical clause and keep only what the assertion
  itself proves, stating that the harness cannot terminate (a FIFO stdin produces no end-of-input in Node
  on this platform, for any program) and so cannot support a stable symptom claim. **Whichever is
  chosen, the reason is written beside it.**
- **`A5` (the fence — checkable from git, and it is stricter than `ABC-113` `A3`).** **Then**
  `git diff --name-only main...HEAD -- src/` lists **exactly** `src/cli.test.ts` and
  `src/result-screen.test.ts`; `git diff --numstat main...HEAD -- 'src/' ':!src/*.test.ts'` is
  **empty**; **and every added or removed line in `git diff main...HEAD -- src/` is a `//` comment
  line** — zero assertion lines moved, in either direction. That last clause is the one that makes
  "narration only" a measurement rather than a promise.
- **`A6` (the lane does not move).** **Then** `npx vitest run --dir src` reports the **same** file count,
  test count and skip count before and after, both green, both readings recorded. *Base measured at this
  cut on `main` @ `b03658f`: **40 files / 1207 tests / 0 skipped, green.** Re-measure at pull time rather
  than quoting this — the lane has moved twice this week.* **0 new test files, 0 new tests, 0 new
  spawns.**
- **`A7` (the conflict rule — author ≠ validator, and the validator re-plants).** **Then** the delivery
  note names the agent that authored the replacement sentences, and **the `In Review` verdict is taken by
  a different agent that re-plants `M9`, `D4` and `M15` itself** and re-derives `A1`–`A3`'s numbers from
  its own runs, not from the delivery note. **A verdict that quotes the delivery note's numbers for any
  of `A1`–`A4` FAILS this criterion.** Every planted build reverted; `git status --porcelain` empty at
  the exit.

## Ruling — the two sentences on the `ABC-113` page (BA/PM's own pen)

`ABC-113`'s QE hop explicitly declined to amend a BA/PM page and left the call here. **Ruling: IN SCOPE
of this ticket (`A2` for line 64, `A3` for line 106), NOT a same-hop correction.** Three reasons, in
order of weight:

1. **A same-hop correction would be exactly the conflict this ticket exists to preserve.** BA/PM cut
   `ABC-113`, BA/PM wrote both sentences, and BA/PM is cutting the ticket that governs their repair. If
   BA/PM also repairs them at this hop, the author, the adjudicator and the ticket-writer are one agent
   and nothing validates the fix.
2. **The correct wording for line 106 is only earnable by re-constructing `M15`**, which `A3` requires
   and which a refinement hop has no business doing. Rewriting it now would mean copying a note — the
   precise failure `A3` forbids in the same breath.
3. **`ABC-113` is `Done`.** Its page is an accepted record; moving text on it is a change to what was
   accepted and deserves a named, reviewed hop rather than a quiet edit inside a cut.

**The cost of that ruling, stated rather than smoothed: two false sentences stay on a `Done` page for as
long as this ticket sits in `Backlog`.** They are named as false here, on the board row and in this
task's notes, so the record is not silent about them in the meantime.

## Dependencies

- **None blocking.** Pullable today.
- **Ordering, not a block: `ABC-043` is `Ready for UAT`** and S4 lives in its delivered diff. If its UAT
  or a follow-up repairs that comment first, **`A4` is CANCELLED, not re-argued**, and this ticket drops
  to `XS`/`P3` (see the trigger below). Whichever runs second re-measures.
- `ABC-113` and `ABC-044` are `Done` and stay `Done`.

## Risks

- **The repair hop authors a fifth false sentence.** This is the recursion that produced `ABC-113` and
  then produced this ticket. `A1`–`A4` mitigate it by requiring measurement over re-reading, and `A7`
  mitigates it by separating the pen from the verdict. **Neither eliminates it** and the page says so.
- **`A4`'s harness is racy and cannot terminate.** Mitigated by admitting **STRIKE** as a first-class
  outcome, so the ticket cannot stall on a measurement that may not stabilise.
- **The two files are shared with other in-flight work.** `src/cli.test.ts` is touched by `ABC-057`,
  `ABC-058` and `ABC-060`'s queued work. Comment-only edits rebase cheaply, but a repair hop that finds
  the surrounding assertions moved **re-measures rather than re-uses** `A1`–`A3`'s numbers.

## Test notes

- Lane is `npx vitest run --dir src` and **never** the repo root (`AGENTS.md` `## Test notes` 5).
- Every wrong build is planted **at the branch tip**, `tsc --noEmit`-checked, watched, and reverted with
  `git checkout --`; `git status --porcelain` empty after each.
- Controls are taken with `git show main:src/cli.test.ts` / `git show main:src/result-screen.test.ts` —
  the ordering inside `ABC-043` `A1` means the shorthand row's independent status on `M9` is **invisible
  from this instrument's own output**, and `A1` depends on it.
- Mandatory gates: `npm run lint`, `npm run typecheck`, `npm run build`, unit. `npm run lint`
  (`biome check .`) exits 0 since the owner's lane-scope commit — the old "known-environmental exit 1"
  caveat is **stale**; run the real command.
- **Test integrity:** `.grugops/test-skips.md` is human-owned. `quality.test_integrity` is `warn`. Its
  absence is `UNKNOWN - verify` and **must not be read as a pass**.

## NFR / security

- **`N8-LANE`: no line is claimed, deliberately** — `ABC-108` is open and `NFR-008` is **BREACHED on the
  CPU clause / UNRULED on wall**, so a 5% slice of a spent total is not a slice. Same posture as
  `ABC-113` and `ABC-110`, for the same reason. **`N8-SPAWN`: 0 ms** — 0 new spawns.
- **Falsifiable zeroes instead of a budget:** 0 new test files, 0 new tests, 0 new spawns, 0 production
  lines, **0 assertions changed** (`A5`).
- **Security: not engaged.** No input path, no process boundary, no filesystem write outside `plans/`,
  no network. ASVS L1 has nothing to bite on in a comment diff.

## Size and priority — the argument, not the label

**`S`, and the comparable is `ABC-113` (`XS`/`P2`), which changed two ASSERTIONS in these same two
files.** On edit surface this is smaller than its comparable — zero assertions, four comment blocks. It
is sized **up** anyway because the criteria are not edits: `A1`–`A3` are three planted builds with
controls (`ABC-113`'s own `XS` covered three), and **`A4` adds a FIFO harness that a QE hop has already
shown cannot terminate and whose mutant symptom is a documented race**. That is the whole delta between
`XS` and `S`.

**SPLIT/RE-SIZE TRIGGER, pre-registered so a later hop does not re-argue it: if the repair hop takes
`A4`'s STRIKE branch, or if `ABC-043`'s UAT repairs S4 first, this ticket is `XS`.** It is not split
today because splitting on a decision nobody has taken is how a ticket becomes two half-tickets.

**`P2`, the same as its comparable.** **NOT `P1`:** nothing is blocked, no gate is wrong, no player is
affected, and every assertion beneath every false sentence is sound — contrast `ABC-112` (`P1`), where
the *product* lies to the *player*. **NOT `P3`:** these are on `main` today, three independent QE hops
found them, and each one mis-prices a guard in the direction that gets guards deleted or over-trusted —
`S3` and `S2` UNDERsell, `S1` and `S4` OVERsell. The project has been bitten twice by documents that were
true and unread; a document that is read and false is the same failure with the evidence removed.

- **`P1` PROMOTION TRIGGER:** any hop measured making a routing decision off one of these four sentences
  (e.g. a ticket cut to "close" something `S2` implies is already closed), **or** a fifth false sentence
  found in the same two files.
- **`P3` DEMOTION TRIGGER:** `ABC-043`'s UAT or follow-up repairs S4 in place, leaving three sites and no
  harness work.

## Re-score — 2026-10-10 (BA/PM, subtask `bapm-rescore-backlog-r1-2026-10-10`, wave tip `39d87491`)

**Verdict: READY. DoR 10/10. `S` and `P2` kept.** `column`/`status` are not moved here.

**Premise re-measured at `39d87491`, and all four sites plus both page sentences are STILL FALSE ON
DISK:**
- **S1/S2:** `src/cli.test.ts:2674–2675`, the `D3`/`M9` block with *"with both of those rows still
  green"*.
- **S3:** `src/result-screen.test.ts:182`, *"ALONE is unconstructible"*.
- **S4:** `src/cli.test.ts:2742`, *"NEVER PLAYS THE MOVE"*.
- **`ABC-113` page:** `:64` (*"closes `D3`"*) and `:106` (*"unconstructible"*).

**The `P3`/`XS` demotion trigger did NOT fire.** `ABC-043` is `Done`, and S4 is still on disk, so its
UAT did not repair it. `A4` stays live, and so does `S`.

**Amendments:**
- **`A6` and test notes, the lane:** read `npx vitest run --dir src` as **`npm test`** (52 vs 53 files
  since `ABC-093`). The *"`AGENTS.md` `## Test notes` 5"* cite is gone. **`A1`–`A3`'s planted-build runs**
  may stay on the narrow file. They compare a row's state, not a lane total.
- **`## NFR / security`, `N8-LANE`:** comment-only, so **the count is the pin** (`ADR-0035` decision
  3): 0 files, 0 tests, 0 spawns, no timing bound. The *"`ABC-108` open / BREACHED"* sentence is
  history.
- **Dependencies:** `ABC-043` is `Done`, so the ordering note is void. `ABC-060` was dropped on the
  owner's word on 2026-10-10, so the `## Risks` mention is void. `ABC-116` and `ABC-117` share
  `src/cli.test.ts` but sit in disjoint regions (`:319`/`:336`, `:3342`). Whichever lands second
  rebases.
- **`A7` (author ≠ validator)** is met by the owner's standing QE hop, which re-plants the builds
  itself. Nothing extra is owed.

**DoR. The page had no table, though the board quoted 9/10; this is the first one on the page.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** six false sentences re-located on disk today |
| 2 | scope and out-of-scope clear | **✅** unchanged |
| 3 | INVEST-shaped | **✅** independent; `S` justified by `A4`'s harness, with the `XS` trigger pre-registered |
| 4 | acceptance testable and measurable | **✅** planted builds, red/green counts, a comment-line-only diff predicate |
| 5 | dependencies known | **✅** re-read above |
| 6 | security/NFR triggers with a measurable target | **✅** count pin 0/0/0 |
| 7 | test notes present | **✅** lane re-pointed |
| 8 | size assigned | **✅** `S` |
| 9 | priority assigned | **✅** `P2`; neither trigger fired |
| 10 | no major unresolved blocker | **✅** — *the board's ⚠️.* `A7`'s separate validator is the standing QE hop, so no human decision is owed |
