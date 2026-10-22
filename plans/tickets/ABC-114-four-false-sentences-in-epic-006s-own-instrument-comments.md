---
id: ABC-114
title: Four false sentences ship in `EPIC-006`'s own instrument comments — the guards are right and their narration is not
status: done
column: Done
size: XS
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
  *Pointer for the cut that closes `D4` (BA/PM, 2026-10-12, `QE2-148-a`; nothing above is changed):
  the open set is not `D4` alone. At least **11** binders are measured `tsc`-clean and green on every
  row of `src/cli.test.ts`. Eight are the ones the comment names after `ABC-148`. The other three come
  from QE's re-check (`.grugops/context/qe2-ABC-148/notes/…18ca4c99`): `let history;` then
  `for (history of …)`, `let history;` then `[history] = …`, and an object-method parameter typed
  through `satisfies`. Whether more exist is `UNKNOWN - verify`. Cut from the mechanism, not from
  the list: the count row's regex `/\bhistory\s*[:=]/g` sees `history` only where `:` or `=` directly
  follows it, so it misses any binder that puts neither there.*
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
  ~~`git show main:src/cli.test.ts`~~ **the ablation: this file with ONLY the count row's `expect`
  removed** *(control named 2026-10-11, BA/PM, on QE `…5d58ace9` §1; the struck words are kept.
  `main:` already held `ABC-113`'s count row at the cut, so it was never a control. The ablation
  changes one variable. `cc037b3e^:src/cli.test.ts` is admissible as a second control, read per
  row, because it carries 2 unrelated `ABC-042` drift reds)*, **then** the two row-level outcomes are recorded as numbers (failed /
  passed, and the failing row's message) **and** the replacement sentence states exactly what those two
  runs showed. **The sentence must distinguish `D3` from `M9`**: `D3` leaves both rows green; `M9` reds
  the shorthand row and the count row simply speaks first. **`tsc --noEmit` clean on the planted build;
  the build reverted and `git status --porcelain` empty afterwards.**
- **`A2` (S2 — the remainder, named and bounded).** **Given** `D4` (`const spare = { ...history }; for
  (const history of [spare])`) planted at the tip, **then** `tsc --noEmit` is **clean** and the lane is
  **GREEN on ~~both instruments~~ this file and on `A1`'s ablation, with `A1` green on
  `cc037b3e^` read per row** — re-measured at this hop — **and** the comment names the open remainder
  as the `[:=]`-free binder forms ~~**`for…of`, `for…in`, `catch (history)`, and a contextually-typed
  callback parameter**~~ **that pass BOTH `tsc --noEmit` and the lane: `for…of` and a parenthesised,
  contextually-typed callback parameter `(history) =>`**, with the count row's own regex `/\bhistory\s*[:=]/g` quoted as the reason. **The
  same narrowing is applied to `ABC-113` page line 64**: *closes `D3`* → *closes the annotated-rebind
  spelling of `D3`*. **No assertion is added** (that is `## Out of scope`).
  - *Corrected 2026-10-11 by BA/PM (`QE-114-c`, MEDIUM; QE `…168698b8`, readings `…94a87a28`; the
    struck words are kept). The struck list was too broad, and it was BA/PM's wording.
    `for (const history in …)` and `catch (history)` are regex-blind, but `tsc` reds both (exit 2:
    a string key is not a game; `unknown` under `strict`). So the typecheck, which `A1` names as part
    of its instrument, closes them. A bare `history =>` is not blind at all: the regex counts the `=`
    of `=>`. The delivered comment (`src/cli.test.ts`, "The open remainder is…") and the `ABC-113` page
    correction under line 64 met `A2` as it was written, so this ticket is not re-opened. Narrowing
    those two lists is follow-up **`ABC-148`** (`XS`, `P3`). Line 64's own narrowing stands.*
- **`A3` (S3 — `unconstructible`, re-constructed at this hop).** **Given** `M15` re-built in
  `src/result-screen.ts`'s `headline()` (fivefold → a TWO-row headline, threefold → one row), **then**
  `tsc --noEmit` is clean, the lane against this instrument reports **exactly one failed test and it is
  the retargeted headline row**, and the control ~~`git show main:src/result-screen.test.ts`~~
  **`git show cc037b3e^:src/result-screen.test.ts`, the pre-retarget instrument** *(named 2026-10-11,
  BA/PM, on QE `…5d58ace9` §1; the struck words are kept)* reports the lane **fully green**. **Only on those two readings** may the sentence say `M15` is constructible,
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
  on this platform, ~~for any program~~ **for a reader of Node's `process.stdin` stream, which is the
  product's input path**) and so cannot support a stable symptom claim. **Whichever is
  chosen, the reason is written beside it.**
  *(Corrected 2026-10-11 by BA/PM, `QE-114-c` part 2; the struck words are kept. QE measured that a
  FIFO whose writer closes DOES end `cat`, `wc -c`, `python3` and Node's own `fs.readFileSync(0)`. It
  never fired `end` for a bare `process.stdin` reader or for the product. The delivered comment
  already states the narrow scope, so it needs no follow-up.)*
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
- Controls are taken with ~~`git show main:src/cli.test.ts` / `git show main:src/result-screen.test.ts`~~
  **`A1`/`A2`: the ablation (this file with only the count row's `expect` removed); `A3`:
  `git show cc037b3e^:src/result-screen.test.ts`** *(2026-10-11, BA/PM, on QE `…5d58ace9` §1; struck
  words kept)* —
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

**Recorded 2026-10-11 by BA/PM** (subtask `bapm-fold-qe114-2026-10-11`; notes
`.grugops/context/bapm-fold-qe114-2026-10-11/notes/`):
- **Re-size `S` → `XS`. The pre-registered trigger FIRED.** The repair hop took `A4`'s STRIKE branch
  (`67296100`), and QE confirmed it on measurement (13 of 13 runs played the move; `…5d58ace9` §2–3).
  This is a record, not a re-argument. The front matter now reads `XS`.
- **`P1` promotion trigger: MET on its letter, promotion NOT taken. `P2` stays.**
  - **Met.** QE pass 1 found a fifth false sentence in `src/cli.test.ts` (`QE-114-a`, the "placed
    BEFORE the other two" sentence).
  - **Not taken, for three reasons.** (1) The trigger exists to move a waiting ticket up the queue.
    When it can be ruled, this ticket is built, has passed its second QE, and is merged (`87dc29a3`).
    A priority on a delivered ticket orders nothing. (2) The sentence was written inside this repair
    and caught by this ticket's own `A7` validator before merge. That is the outcome `## Risks`
    predicted, and `A7` is the mitigation working. It is not evidence that false narration steers
    work. The trigger's first clause, a routing decision made off one of these sentences, has never
    fired. (3) What is left (`QE-114-c`'s two comment lists) is sized on its own merits as `ABC-148`.
  - **The trigger's wording was the defect.** It should have said "found on `main`". Any future
    trigger of this kind on a repair ticket will say where the sentence must be found. **The owner may
    overrule this ruling.**

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

## Delivery

Software Engineer (Claude Opus 5.5, subagent of the Orchestrator), 2026-10-11. **This agent wrote
every replacement sentence (`A7`). It has not validated them. The `In Review` verdict belongs to a
separate QE hop that re-plants `M9`, `D4` and `M15` itself.** Branch `grugops/ABC-114-instrument-comments`,
code commit `67296100`, base `7411f73a`. The readings are in `.grugops/context/ticket-to-pr-ABC-114/notes/`.

- **Premise.** All six sentences were on disk at `7411f73a`: `src/cli.test.ts:2675` (S1/S2) and
  `:2742` (S4), `src/result-screen.test.ts:182` (S3), and `ABC-113` page lines 64 and 106.
- **The control moved.** `git show main:src/cli.test.ts` and `git show main:src/result-screen.test.ts`
  are byte-identical to the tip, because `ABC-113` is on `main`. A literal `main` control therefore
  re-runs this instrument. The control used for `A1`–`A3` is the pre-`ABC-113` file, `cc037b3e^`. On
  the delivered build it has 2 unrelated drift reds (`ABC-042` `A9`, `A10`), so it is read per row.
- **`A4`: STRIKE, chosen on measurement.** The hoisted `G03` build played the move in 6 of 6 FIFO
  runs. This hop never saw the "move eaten" outcome, so RE-MEASURE's two-outcome sentence would have
  been copied from a note. By the pre-registered trigger the ticket is now `XS`. That re-size is
  BA/PM's to record.
- **Scope kept.** 0 production lines, 0 assertions changed, 0 tests added. No column was moved here.

## QE

QE/E2E (Claude Opus 5.5, a separate dispatch from the author), 2026-10-11, subtask `qe-ABC-114`,
reviewed at `8895a9a0`. I re-planted every build myself: `M9`, `D3`, `D4`, `M15` and `G03`, plus a
row-order decoy `ORD` and an ablation control. No number here is quoted from the delivery note. The
readings and rulings are in `.grugops/context/qe-ABC-114/notes/`.

**Verdict: FAIL (`BLOCKED_NEEDS_FIX`).** `A1` is NOT MET. `A2`–`A7` are MET.

- **`A1`.** The `D3`/`M9` distinction is right on measurement. But the same block now says *"This row
  is placed BEFORE the other two, so on any decoy it is the row that speaks first"*, and that is
  false. The initializer row (`src/cli.test.ts:2669`) comes before the count row (`:2701`). On a
  `tsc`-clean decoy that reds both rows, the initializer row is the one that speaks. This is the
  fifth false sentence `## Risks` predicted (`QE-114-a`). The fix is comment-only, and it goes back
  to the Software Engineer. QE does not write it.
- **`A2`.** MET as written. Two gaps:
  - `QE-114-b`, LOW: the comment says "lane GREEN … on the control", but that file has 2 unrelated
    drift reds. Only `A1` is green on it.
  - `QE-114-c`, MEDIUM, owner BA/PM: the mandated remainder list is too broad. `tsc` reds `for…in`
    and `catch (history)`. Only `for…of` and a parenthesised `(history) =>` callback get past both
    `tsc` and the lane.
- **The control.** `cc037b3e^` is valid if read per row. It was degenerate from the cut, not since:
  `ABC-113` was already on `main` at `b03658f`. The cleaner `A1` control is the tip file with only
  the count row removed. BA/PM should name it in `A1`, `A3` and `## Test notes`.
- **`A4` STRIKE is right.** `G03` played the move in 13 of 13 of my runs. The comment's scope, "a
  bare `process.stdin` reader in Node", is the correct one. `A4`(b)'s "for any program" is false:
  `cat`, `python3` and Node's `fs.readFileSync(0)` all see end of input.
- **Re-size.** The pre-registered trigger fired, so the size goes `S` → `XS`. BA/PM records it; this
  page's size line is not edited here. The **`P1` promotion trigger** ("a fifth false sentence") is
  met on QE's reading. That ruling is BA/PM's.

## QE (2nd pass)

QE/E2E (Claude Opus 5.5), 2026-10-11, subtask `qe2-ABC-114`, reviewed at `d60cedb4` (fix `54644ee5`).
This is a separate dispatch from the author of the fix. I re-planted `M9`, `D3`, `ORD`, `D4` and
`M15` myself and ran them on the tip file, a one-row ablation and `cc037b3e^`. No number here is
quoted from the fix notes. Readings, gap status and verdict are in
`.grugops/context/qe2-ABC-114/notes/`.

**Verdict: PASS_WITH_GAPS.** `A1`–`A7` are MET. `QE-114-a` and `QE-114-b` are CLOSED.

- **`A1`.** The new ORDER sentence holds on measurement. The count row sits between the initializer
  row (`src/cli.test.ts:2669`) and the shorthand row (`:2712`). On `M9` and `D3` the count row is the
  one red at the tip. On `ORD` the initializer row is the one red. On `M9` the ablation and the
  control show the shorthand row's own red.
- **`A2`.** `D4` is `tsc`-clean and 67/67 on this file. On the control, `A1` is green and the only
  reds are `ABC-042` `A9` and `A10`. That is exactly what the rewritten sentence says.
- **`A3`–`A6`.** Unchanged by the fix. `M15` gives one red, the headline row, and the control is
  green. The diff is still `//` lines only, in the two test files. The lane reads 53 / 1680 / 0 at
  base and at tip.
- **Still open, not this hop's:** `QE-114-c` (MEDIUM, BA/PM), the `S` → `XS` re-size record, and
  the `P1` trigger ruling. `QE-114-d` stays INFO. `host-protection.js` is `UNKNOWN - verify`.
