---
id: ABC-030
title: The four `*.nfr.test.ts` justification comments cite a LIVE count of a sibling file — two are already stale, and the two that hold are one commit from joining them
status: backlog
column: Backlog
size: XS
priority: P3
epic: EPIC-002
feature: —
---

# ABC-030 — the four `*.nfr.test.ts` justification comments cite a LIVE count of a sibling file

> **Cut 2026-08-12 by BA/PM** (task `refinement-ABC-028-shape-2026-08-13`, subtask
> `refinement-ABC-028-shape`, Workflow 07) to give an owner to two live instances QE found at
> `quality-gate-ABC-028-narrow` in files **`ABC-028` may not touch**.
>
> **THIS IS A RECORD TICKET, NOT A DEFECT TICKET. No test fails, no build is wrong, and no user is
> affected.** All four comments describe a real and correct design decision. What is wrong is that
> two of them describe it with a number that is no longer true.
>
> **WHY IT EXISTS AT ALL, when the obvious disposition is *"whoever next opens the block"*: that
> disposition was measured at this stack and it is 0-for-2.**
>
> ```
> src/zobrist.nfr.test.ts:18  "all 13 tests there"   exact at 584defa (13 static it(, 0 it.each)
>   2efe9ac and 862c687 each added an it.each table  -> the sibling is 23
>   d74476b RE-OPENED zobrist.nfr.test.ts (+30/-7) with the number ALREADY STALE and left it
> src/status-panel.nfr.test.ts:11  "all 26 tests there"  exact at 695a2e7
>   dc06b40 edited BOTH files IN ONE COMMIT (+109/-21 nfr, +129/-15 sibling) and took the sibling
>   TO 29 ITSELF — the number went stale inside the very commit that had the file open
> ```
>
> **Two opportunities, two misses, one of them by the commit that caused the staleness.** An
> unnamed owner is not an owner. **This page is the owner.**

## Problem

*User*: the next engineer who opens any `*.nfr.test.ts` file and wants to know why the assertions in
it were not simply put in the sibling `*.test.ts`.

*Pain*: the answer they find is correct in its **argument** and wrong in its **number**.

- `src/zobrist.nfr.test.ts:18` — *"putting this in `zobrist.test.ts` would re-route the module graph
  for **all 13 tests there**"*. **Measured 2026-08-12: `zobrist.test.ts` reports 23.**
- `src/status-panel.nfr.test.ts:11` — *"…for **all 26 tests there**"*. **Measured 2026-08-12:
  `status-panel.test.ts` reports 29.**

A reader who checks the number finds it wrong and has to decide whether the *argument* is wrong too.
It is not — `vi.mock` hoisting re-routes the module graph for **every** test in the file it sits in,
at 13, 23, 26, 29 or any other count — **so the number was never load-bearing, and it is the only part
that can rot.**

*Value*: **four standing comments stop being falsifiable by a stranger's commit.** The repair is one
sentence per site and it is the same sentence four times.

## Scope

**Comment text only, in four files that already exist. No production line, no new module, no new test
file, no new dependency, no test added or removed.**

| site | what it cites | measured 2026-08-12 on tip `ca6c424` | verdict |
|---|---|---|---|
| `src/zobrist.nfr.test.ts:18` | *"all 13 tests there"* | `zobrist.test.ts` = **23** | **STALE** |
| `src/status-panel.nfr.test.ts:11` | *"all 26 tests there"* | `status-panel.test.ts` = **29** | **STALE** |
| `src/gameend.nfr.test.ts:13` | *"all 45 tests there"* | `gameend.test.ts` = **45** | **HOLDS** |
| `src/san.nfr.test.ts:19` | *"the 52 rows in `san.test.ts`"* | `san.test.ts` has **one commit in its entire history** (`1e39511`) and has never been modified | **cannot have gone stale.** Whether 52 is arithmetically right today is **`UNKNOWN - verify`** — nobody has counted the rows, and this ticket does not need it counted |

**All four are in scope, and including the two that are CORRECT is the point of the ticket rather
than scope creep.** A correct live count is the same defect one commit from now; `gameend.nfr` holds
today only because nobody has added a test to `gameend.test.ts` yet. **Repairing the two stale ones
alone would be describing the hole per witness — the exact pattern `ABC-028`'s `## Test notes` 1
forbids, which is why a hole was re-found four times on that ticket.**

## Out of scope

- **Any production line.** Zero. If a criterion here appears to need one, stop and report.
- **Adding, removing, renaming, re-ordering or re-shaping any test**, in any of the eight files this
  ticket names or reads. **The counts must not be made true by changing the tree** — that would be a
  test-suite change to satisfy a comment, which is the tail wagging the dog.
- **Refreshing a number to its current value.** `13 → 23` and `26 → 29` are **explicitly refused**.
  It buys one hop of accuracy and re-arms the identical defect. This is `ABC-028`'s standing
  instruction for `src/history-pane.nfr.test.ts:115` and it is adopted here unchanged.
- **`src/history-pane.nfr.test.ts:115`, `src/history-pane.test.ts:493` and
  `src/history-pane.test.ts:1014`.** Same defect shape, but they are **`ABC-028`'s**, and `:493` is
  already routed to an Engineer there. **This ticket does not touch `src/history-pane.*`.**
- **Any `*.test.ts` sibling.** Read only, and only to count.
- **A lint rule, a CI check or any other control over comment text.** Named and refused at
  `ABC-028`'s `F4` with the measurement attached; **nothing here re-opens that.**

## Acceptance (Given/When/Then)

**A1 — the two stale sites state the MECHANISM and carry no live count. Given** `src/zobrist.nfr.test.ts`
and `src/status-panel.nfr.test.ts` as they stand, **when** the justification sentence in each is
rewritten, **then** each states why the file is separate in a form that is true at **every** sibling
test count — a `vi.mock` factory is hoisted to file scope, so it re-routes the module graph for
**every test in the file it sits in** — **and**

```
/usr/bin/grep -nE 'all [0-9]+ tests there' src/zobrist.nfr.test.ts src/status-panel.nfr.test.ts
  -> exit 1, ZERO hits
```

**A2 — the two sites that HOLD get the same repair, and the tree proves the class is closed rather
than the witnesses. Given** `src/gameend.nfr.test.ts` and `src/san.nfr.test.ts`, **when** the same
rewrite is applied, **then**

```
/usr/bin/grep -nE 'all [0-9]+ tests there|the [0-9]+ rows in' src/*.ts
  -> exit 1, ZERO hits across ALL of src/
```

**and** `git diff --numstat` for the whole ticket shows **exactly four files, every one
`*.nfr.test.ts`**, with **zero lines changed that are not inside a comment**.

**A3 — nothing was made true by moving the tree. Given** the suite before the change, **when** the
change lands, **then** the test count of every file is **identical** before and after — measured, not
assumed:

```
npx vitest run --reporter=json | jq -r '.testResults[] | "\(.assertionResults|length) \(.name)"' | sort -k2
  -> byte-identical before and after
suite total, lint, typecheck, skip -> unchanged and green (measure the tip; do not paste a number
                                      from this page — it will be stale, that is this ticket's
                                      whole subject)
```

**A4 — the repair is checkable by something that does not itself go stale. Given** the four repaired
comments, **then** each contains **no integer that refers to a quantity outside its own file**. This
is the criterion that distinguishes the repair from a refresh: **the `grep`s in `A1` and `A2` stay
green forever if the repair is right, and go red the moment anyone writes a live count back in.**

> **READ THIS BEFORE WRITING THE COMMENTS.** The argument in all four is **correct and must survive
> verbatim in substance** — `vi.mock` hoisting is a real constraint and the separate file is the right
> call. **Do not delete the justification while removing the number.** A comment that says only *"this
> is in its own file"* is worse than a stale one: the next reader merges it back.

## Dependencies

- **None blocking.** All four files are stable: `zobrist.nfr.test.ts` last moved at `d74476b`,
  `status-panel.nfr.test.ts` at `dc06b40`, and no ticket currently open names any of the four.
- **`ABC-028` must not be waiting on this and is not.** `ABC-028`'s own instance (`:493`) is routed
  to its own Engineer and repairs a different sentence in a different file.
- **Do not run concurrently with any hop live in one of the four files.** The Orchestrator checks this
  before pulling; it is cheap because the four are rarely touched.

## Security / NFR triggers

**NONE FIRE, and the threshold is stated so the claim is falsifiable rather than asserted.**

- **Firing threshold: any production line at all, or any new file.** This ticket adds **zero
  production lines and zero files** — it edits comments in four existing test files. **Measure it at
  the gate rather than trusting this sentence:** `git diff --numstat` must show four `*.nfr.test.ts`
  files and nothing else.
- **`NFR-008` / `N8-LANE`: the delta is ZERO BY CONSTRUCTION** — no test, no file and no line is added
  to the repository, so `ADR-0008`'s paired protocol has nothing to resolve and must not be run for
  it. **`ABC-026` still owns the lane total.**
- **No a11y surface, no latency surface, no data surface.** This project has no UI and deploys
  nowhere (`ADR-0007`).

## Test notes

1. **The number is not the property — measure the tree, then delete the number.** Both stale counts
   were **exact when written**. Nobody was careless. The defect is structural: **a comment that cites
   a live quantity in another file has a dependency nothing declares and no tool checks.**
2. **`zobrist.nfr.test.ts` contains its own repair, twelve lines above the defect.** `:12` is a
   **DATED** witness — *"Measured at the `ABC-011` QE gate: both mutations left all 189 tests
   green"* — and it is immune to staleness because it says what was true **at a named past hop**.
   `:18` is a **LIVE** claim and rotted. **Two forms, same author, same file, twelve lines apart.**
   Prefer the dated form when the number matters; prefer no number when it does not — and here it
   does not.
3. **Do not count the tests by hand.** `/usr/bin/grep -c 'it('` **undercounts every file that uses
   `it.each`** — that is precisely how `zobrist.test.ts` went from a true 13 to a real 23 while the
   static `it(` count stayed at 13. Use the runner:
   `npx vitest run <file> --reporter=json | jq '.testResults[0].assertionResults|length'`.
4. **A near-miss worth inheriting.** The Orchestrator nearly dismissed this whole ticket by measuring
   the **`.nfr` files themselves** (4 and 6) instead of their siblings, and catching it only by
   reading the comment: **"there" means the SIBLING file.** Read the sentence before running the
   command.
5. **`src/gameend.nfr.test.ts:13` holding at 45 is what makes this ticket trustworthy.** An
   instrument that flags everything flags nothing. **One of the four holds, and it is in scope anyway
   — because it holds by luck, not by construction.**

## Size and priority rationale

**Size `XS`.** Four comment edits in four existing files, one sentence each, no test, no fixture, no
instrument, no production line, no new file, no dependency change. The verification is three `grep`s
and one suite run. **Calibrated against this project's band:** `ABC-028` is `S` for `+496` lines of
new tests and a mutant instrument; this is a small fraction of one of its hops. **`SPLIT_REQUIRED`
bites at `XL` (8); this is 1.** A split would produce four tickets that each re-derive the same
sentence — the anti-pattern the ticket exists to end.

**Priority `P3`, and the reasoning is stated so it can be argued with.**

- **Not `P0`/`P1`** — nothing is broken, no criterion is unmet, no user is affected, and the tree is
  **stronger** than the comments say, not weaker. **Nothing waits on this.**
- **Not `P2`** — the harm is bounded and slow: a reader loses a few minutes deciding whether the
  argument survives the wrong number. It has cost that much twice, over three weeks.
- **`P3`, and it must NOT be pulled ahead of anything.** It is real debt with a real owner and a real
  check, and that is all. **If it is still sitting here in six months, that is the correct outcome
  and not a process failure** — the point of cutting it was to stop it being invisible, not to make
  it urgent.
- **The falsifiable statement:** *if any of the four sibling files gains a test and a reader is
  misled by one of these comments into merging an `nfr` file back into its sibling, this is `P1` and
  should be re-cut as one.*

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-12**. **Result: 10 of 10 MET.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear — user, pain, value stated | **✅** the next engineer to open an `*.nfr.test.ts`; a correct argument with a wrong number; four comments stop rotting |
| 2 | scope and out-of-scope clear | **✅** four named files, comment text only; six explicit exclusions, including a refusal to refresh the numbers and a refusal to touch `src/history-pane.*` |
| 3 | INVEST-shaped | **✅** independent (no ticket waits on it, it waits on none), negotiable, valuable, estimable, small, testable. **The one honest wrinkle: it touches files created by merged tickets** — which is the whole reason it exists as its own page rather than as work inside `ABC-028` |
| 4 | acceptance testable and measurable | **✅** four criteria, three of them a `grep` that must exit `1`, one a before/after equality of a JSON report. **No criterion says "works"** |
| 5 | dependencies known | **✅** none blocking; the one real constraint (do not run concurrently with a hop live in those files) is named with the reason |
| 6 | security/NFR triggers marked with a measurable target | **✅** threshold stated as *any production line at all, or any new file*, measured to be zero and **checkable at the gate by `git diff --numstat`**; `N8-LANE` delta zero by construction |
| 7 | test notes present | **✅** five, including the `grep -c 'it('` undercount that caused the original defect and the near-miss that almost dismissed the ticket |
| 8 | size assigned | **✅** `XS`, calibrated against `ABC-028` |
| 9 | priority assigned | **✅** `P3`, with a falsifiable statement of what would move it |
| 10 | no major unresolved blocker | **✅** none. The one `UNKNOWN - verify` on the page — whether `san.nfr.test.ts:19`'s *52 rows* is arithmetically right — **is not a blocker, because the repair deletes the number rather than checking it** |

### Requested board move 2026-08-12 by BA/PM at `refinement-ABC-028-shape`: `Backlog` (placement REQUESTED, not taken)

**`plans/board.md` was NOT opened for edit** — it is the Orchestrator's. This page exists and is
DoR-complete; **placing it is the Orchestrator's call.**

**I am requesting `Backlog`, not `Ready`, and the Definition of Ready being met is not a reason to
promote it.** `Ready` is the pull queue, and putting `P3` comment debt in it — on a board where
`Ready` currently stands at **0/8** — would fill an empty larder with the cheapest thing on the shelf
and make the column look stocked when it is not. **`Ready` is starved and this ticket is not the
cure.** That observation is routed to the Orchestrator as its own concern, separate from this page.

**The DoR score above is recorded so that the day someone does want to pull it, no refinement hop is
needed.**
