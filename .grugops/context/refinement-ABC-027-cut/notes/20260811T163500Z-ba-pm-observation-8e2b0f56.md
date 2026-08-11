---
id: 20260811T163500Z-ba-pm-observation-8e2b0f56
kind: observation
by: ba-pm
at: 2026-08-11T16:35:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-018
  - ABC-019
  - ABC-027
  - ADR-0010
  - EPIC-002
  - NFR-008
  - src/frame.ts
  - src/frame.test.ts
supersedes:
---

# The merged suite ALREADY has a narrowing fixture — and it asserts the defect is PRESENT. `ADR-0010`'s "three test changes" is five sites across four tests.

> **Hand-authored**; `scripts/context-io.ts` absent, `mcp__grugops__propose_note` unavailable. **No
> `finding`.** Everything below was RUN against merged `src/` on an out-of-tree copy
> (`src/` byte-identical in this repository, `git status --porcelain src/` = 0 lines). Machine:
> **Apple M3 (Mac15,13), Node v24.12.0, darwin/arm64** — `UNKNOWN - verify` on any other hardware.

## 1. One correction to `ADR-0010`'s `## Consequences`. **The ADR is NOT edited.**

The ruling is unaffected; what changes is what the engineer will find. Measured by applying clause 1
to a copy and running the suite.

| `ADR-0010` says | measured |
|---|---|
| *"**Three** test changes ride with that production line"* | **five assertion sites across four tests** |
| the screen model must learn `\x1b[K` or the suite goes red | **CONFIRMED — 5 tests THROW without it** |
| `:376`'s `occurrences(redraw, "\x1b") === 2` becomes `24` | confirmed, **but MASKED**: `:374`'s `toContain(second.join("\n"))` fails first |
| — | **`:419`'s `expect(body).toBe(frame.join("\n"))` also fails — not named by the ADR** |
| *"the file needs its **FIRST** narrowing fixture"* | **FALSE** |

**`src/frame.test.ts:735-771` already builds a narrowing**, with `expect(widthOf(wide)).toBe(24)` and
`expect(widthOf(narrow)).toBe(18)` both asserted. The ADR's sweep (301 plies × thinking × 4 message
shapes) yields `W` ∈ {18} and that measurement is right; the sweep simply did not cover the one test
that passes a bespoke `status:` override into `partsFor`.

**And it is the sharpest instance yet of this project's most-recorded defect class.** The test is
titled *"CHARACTERIZES: `W` is recomputed per frame, so a narrowing frame leaves the wider one's
tail"* and it **asserts the defect is present**. Its own comment says it *"pins today's behaviour and
fails loudly the day someone changes it"* and routes the decision to *"BA/PM +
`ABC-016`/`ABC-017`"* — so it is a **tripwire doing its job**, not a bad test, and `ADR-0010` is the
day it fires. The consequence is concrete: **an assertion in the merged suite that no correct build
can satisfy after `ABC-027`**, and the ADR's change list does not mention it. `ABC-027`'s `A6` owns
it, and requires it **replaced, not deleted**.

**Owner: Architect/Design**, whenever `memory-bank/50-decisions/` is free. Non-blocking.

## 2. The four assertion sites, read at source

| site | today | why it breaks |
|---|---|---|
| `:374` | `expect(redraw).toContain(second.join("\n"))` | rows no longer joined by a bare newline; **fails BEFORE `:376`** |
| `:376` | `expect(occurrences(redraw, "\x1b")).toBe(2)` | becomes `2 + (H − 1)` = **24** |
| `:419` | `expect(body).toBe(frame.join("\n"))` | same cause as `:374` |
| `:768` | `expect(stale).toEqual([<the stale row>])` | the characterization — `stale` becomes `[]` |

## 3. Which assertion form catches it — one column `ADR-0010`'s table does not have

Measured on a four-frame sequence (`W` = **37, 18, 39, 18**; two narrowings, one widening; every
frame exactly `H` = 23 rows), at three screen widths:

| form | narrowing @ `W`(frame 1) | narrowing @ 80/120 | steady @ 80/120 | **on the CORRECT build** |
|---|---|---|---|---|
| **F1** epic `4b` / merged `:381` | catches | **BLIND** | pass | **FALSE POSITIVE at `W`(frame 1)** |
| **F2** merged `:379`, untrimmed | catches | catches | **FALSE POSITIVE** | false-positives with it |
| **F3** trimmed screen == frame | catches | **catches** | pass | **passes** |
| **F4** every frame's `W` == session `W` | catches | catches | pass | **FAILS the correct build** |

**`F1`'s extra failure mode is new and is not in the ADR's table**: at the artificial screen width
`W`(frame 1) it flags the **correct** build, because `rowsOnlyIn` compares rows padded to two
different widths. So `F1` is not merely blind at real widths — it is unusable for a narrowing test at
any width. **`:381`'s form must not be reused, in either direction.**

`F4` is the measured basis for the **prohibition** `ADR-0010` cl. 7 puts on `ABC-019` and that
`ABC-027` carries in `## Out of scope`.

## 4. What the player sees, and what the fix costs

Stale rows after **every** redraw of the four-frame sequence:

| writer | @ 80 columns | @ 120 columns |
|---|---|---|
| merged | **2** | **2** |
| clause 1 | **0** | **0** |

The residue, on rows the frame says are **empty**: `hreefold repetition`, then
` to move out of check`.

Emission accounting for one 23-row frame on a 24-row TTY:

| | `write()` calls | characters | `\x1b` | `\x1b[0J` | `\x1b[K` |
|---|---|---|---|---|---|
| merged | 1 | **425** | 2 | 1 | 0 |
| clause 1 | 1 | **491** | **24** | 1 | **22** |

**+66 characters exactly** = `(H − 1) × 3`, confirming the ADR. Both append paths (non-TTY and
short-TTY) are **byte-identical** before and after with **0 escape bytes**, confirming `4c`
untouched.

## 5. The criteria were witnessed against three mutants, not argued

`ABC-027`'s `A1`–`A5` were written as runnable tests and executed against each build:

| build / mutant | `A1` | `A2` | `A3` | `A4` | `A5` |
|---|---|---|---|---|---|
| clause 1 (correct) | PASS | PASS | PASS | PASS | PASS |
| **merged writer (the defect)** | **FAIL** | **FAIL** | PASS | PASS | PASS |
| **partial fix — only the first 5 rows cleared** | **FAIL** | **FAIL** | PASS | PASS | PASS |
| **degenerate fixture — `W` no longer narrows** | PASS | **FAIL** | **FAIL** | PASS | PASS |

Three things this table settles:

- **`A2` catches the defect at a REAL terminal width**, which is the whole point and which epic `4b`
  as worded does not do.
- **The degenerate-fixture mutant is the one that matters most.** `ADR-0010` measured that the merged
  file's entire fixture space yields `W` ∈ {18}; a fixture that quietly stops narrowing would turn
  `A2` green forever. `A2`'s explicit narrowing assertion and `A3` both fail on it. **The criteria
  refuse to be vacuous.**
- **`A3` passes on both writers by construction** — it tests the FIXTURE, not the build. That is
  correct and deliberate: it is a check on the check, and this project has recorded *a bar that
  cannot fail on the regression it exists to catch* **six times**, most recently in `ADR-0010`'s own
  cost table.

## 6. Gate shape, projected on a copy

| stage | measured |
|---|---|
| production change + the four assertion sites repaired, no new tests | **676/676 on 22 files** |
| **+ the five new criteria, in the EXISTING file** | **681/681 on 22 files, skip 0** |
| `N8-LANE` files added | **ZERO** — floor allowance 0 ms |
| `src/frame.test.ts` CPU, paired n = 3 | 1.43 s without → 1.47 s with, **~20 ms** median delta, ~3% of the 650 ms content allowance |

**The lane figure is INDICATIVE and no bar is re-derived** — n = 3 is below `N8-LANE`'s own n ≥ 7
protocol and the Security/NFR gate owns the real measurement on delivered code. Re-deriving a lane
bar has cost this board two ruling hops.

## 7. Two flags recorded, NOT fixed — both tickets left untouched

- **`ABC-019` is owed ONE new criterion AND one PROHIBITION.** The criterion is `ADR-0010` cl. 7's
  `F3` form: over a played game containing a narrowing, the screen after **every** redraw equals the
  frame it was given. The prohibition: **NO constant-frame-width criterion**, because `W` varies by
  design and `F4` was re-measured here to fail the **correct** build. **`ABC-019` was NOT edited — an
  Engineer is live in its worktree building `A9b`.** Owner: BA/PM; the Orchestrator sequences it when
  the branch is free.
- **`ABC-016` is owed NOTHING that changes a criterion and ZERO production lines** — one stale
  rationale sentence only (`A7` and the panel comment at `src/status-panel.ts:95-101` justify the
  reserved thinking cell by *"makes the whole frame breathe"*, which is no longer the reason after
  `ADR-0010` cl. 5). `A7` itself **stands**. **Non-blocking. `ABC-016` was NOT edited — QE is live in
  its worktree.** Owner: BA/PM, whenever convenient.

## 8. One flag carried on epic `4b`, not owned here

**Epic `4b`'s *"zero rows from frame N"* is worded over ROWS and is blind to this defect at any real
terminal width** (`F1` above) — and, newly measured here, it also false-positives on the correct
build at the artificial width. `ADR-0010` cl. 8 covers it at ticket level on purpose and does not
amend the epic. It becomes a BA/PM wording hop **only** if the owner reads `4b`'s *"in one
operation"* as forbidding the additional erase — a reading `ADR-0010` explicitly does not take.
Recorded on `ABC-027` as a carried flag. Non-blocking.
