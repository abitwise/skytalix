---
id: 20260812T060000Z-software-engineer-observation-3f8c2a71
kind: observation
by: software-engineer
at: 2026-08-12T06:00:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-027-rf1
  - abc027-rf1-2026-08-12
  - refinement-ABC-027-a1
  - security-nfr-ABC-027
  - quality-gate-ABC-027-qe
  - ABC-027
  - ABC-016
  - ABC-018
  - ADR-0010
  - NFR-002
  - src/frame.ts
  - src/frame.test.ts
supersedes:
---

# THE COLUMN-0 CLAUSE WAS VERIFIED BY FAILING IT ON THE OLD EMISSION — and the first way of asking was measured USELESS, because the byte-exact `toBe` masks it

> **Hand-authored, and saying so as the brief instructs.** `scripts/context-io.ts` does not exist in
> this repository (there is no `scripts/` directory) and is not in the kit at
> `/Users/olgeroeselg/.grugops/agent-factory/`; `mcp__grugops__propose_note` is not in this session's
> tools. Workflow 16 names `context-io.ts` as the only sanctioned writer; it is absent, so this note
> was written to the `notes/` path directly — the route every note on this ticket has taken.
> **NOTHING in this task's notes is a `finding`.** No `§14-gate#<id>` stamp is issuable to this role,
> the §14 gate machinery does not exist here, and none is self-attested.

> **Clock note, because the timestamps disagree with the machine.** `date -u` on this host reads
> `2026-08-11T09:37Z`; the parent `failed-attempt` is stamped `05:00` on 08-12 and this subtask was
> enqueued at `05:15`. I have kept the logical ordering the task uses rather than introducing a third
> clock. Recorded so nobody reads the gap as tampering.

## 0. THE BASELINE MOVED AND BOTH FIGURES I WAS HANDED ARE WRONG — measured before a byte was written

Worktree `/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-ABC-027`, branch
`grugops/ABC-027-frame-clearing`, tree clean, tip `665e32f`. `main` **is** an ancestor of `HEAD`, so
the rebase the brief describes did happen, and `main` carries merged `ABC-016` (`149d643`).

| source | claimed baseline | measured here |
|---|---|---|
| my activating brief | 716/716 on **23** files | **716/716 on 24 files** |
| the subtask brief in the queue | **682/682 on 22** files | stale — written before `ABC-016` merged |

`npm test` → **716 passed (716), 24 test files**; `--reporter=json` skip count **0**. The 24 is
`ls src/*.test.ts | wc -l` = 24, counted rather than read off a reporter. **The subtask brief's
`682/682 on 22` is BA/PM's pre-merge projection and is not reachable on this tree; the expected
post-change figure is `717/717 on 24`, and that is what it came out at.**

*(Guard against a trap I nearly walked into: `vitest run --reporter=json` reports
`numTotalTestSuites: 129`, which is the `describe` count, NOT the file count. The file figure comes
from the default reporter and from `ls`. Anyone re-running this who takes 129 as "files" will think
the suite tripled.)*

Machine: Apple M3 (Mac15,13) / Darwin 25.5.0 arm64 / Node v24.12.0 / vitest 3.2.7 —
**`UNKNOWN - verify` on any other hardware**, though nothing here is a timing.

## 1. The emission, counted from the REAL writer

`H` = 23, `W` = 18, the reference layout (real `renderBoard` 9 × 18, 3-row status stub, 8-row
history stub, `messages: ["check"]` — `A1`'s own fixture). The `RF-1` emission was taken out of the
real `beginFrameSession`; the other three were constructed from the SAME frame value, so the only
thing varying between rows is where the erase sits.

| emission | chars | `\x1b[K` | `\x1b[0J` | `\x1b` | delta vs un-cleared |
|---|---|---|---|---|---|
| un-cleared (merged, `main`) | **425** | 0 | 1 | 2 | 0 |
| delivered (erase AT the margin) | 491 | 22 = `H − 1` | 1 | 24 = `H + 1` | 66 |
| **`RF-1` (shipped, erase at COLUMN 0)** | **494** | **23** = `H` | **1** | **25** = `H + 2` | **69** = `H × 3` |
| `M2` (QE's mutant, `H` erases ALL at the margin) | **494** | **23** | **1** | **25** | **69** |

**Security/NFR's and BA/PM's figures reproduce exactly.** The last row is the whole problem and it
is reproduced rather than quoted: **`M2` matches `RF-1` on every count and on the total length.**

## 2. THE VERIFICATION THE BRIEF ASKED FOR, AND WHY THE OBVIOUS FORM OF IT IS WORTHLESS

The brief asked how I verified the clause **fails on the old emission** rather than merely passing on
the new one. The obvious answer — *"`A1` goes red on the delivered writer"* — was run first and
**does not answer the question.** Substituting each writer at the same unique anchor in an
out-of-tree copy and running `npx vitest run src/frame.test.ts -t "A1 "`:

| writer | `A1` | what the runner PRINTS |
|---|---|---|
| `RF-1` (shipped) | **PASSES** | — |
| delivered (erase at the margin) | **FAILS** | the byte-exact `toBe` |
| `M2` | **FAILS** | the byte-exact `toBe` |
| merged (bare-newline join) | **FAILS** | the byte-exact `toBe` |

**In all three the `toBe` fails FIRST and the column-0 clause never reports. That is this project's
recorded masking pattern for the third time** — `:374`/`:376` at the cut hop, `:389`/`:391` at this
one, and now inside `A1` itself. A build that reads the runner's output would conclude the clause
works without ever having run it.

### So `A1` was REDUCED to the clause and re-run

On the out-of-tree copy, inside the `A1` block only (two of those assertion lines appear verbatim in
the `ABC-018` test above and editing those would have changed what was being measured), I removed
the byte-exact `toBe` **and all four counts**, leaving nothing in front of the clause:

| `A1` reduced to… | `RF-1` | delivered (THE OLD EMISSION) | `M2` | merged |
|---|---|---|---|---|
| **both halves of the clause, nothing else** | PASSES | **FAILS** | **FAILS** | **FAILS** |
| clause (a) only — *begins `\x1b[H\x1b[K`* | PASSES | **FAILS** | **FAILS** | **FAILS** |
| clause (b) only — *no `\x1b[K` immediately before a newline* | PASSES | **FAILS** | **FAILS** | **PASSES** |

**The clause fails on the old emission on its own merits, with nothing standing in front of it.**
That is the answer, and it is a different measurement from "`A1` went red".

### One result nobody's brief predicted, and it protects both halves

**Clause (b) alone PASSES on the merged writer — vacuously, because merged emits no `\x1b[K` at
all**, so "no `\x1b[K` is immediately followed by a newline" is trivially true of it. Clause (a)
alone kills all three unsafe shapes. **The two halves are NOT restatements of each other and neither
is redundant:** (b) is the one that names the actual defect shape (an erase at end-of-row), (a) is
the one that also catches *no erase at all*. A future hop that keeps only (b) as "the interesting
one" loses the merged writer; one that keeps only (a) loses the direct statement of the defect.

### And an assertion-by-assertion matrix, so a failure is attributable rather than just red

Each of `A1`'s seven assertions evaluated independently against each emission:

| shape | `toBe` | EL=`H` | ED=1 | ESC=`H+2` | delta=`H×3` | COL-0 (a) | COL-0 (b) |
|---|---|---|---|---|---|---|---|
| `RF-1` | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| delivered | FAIL | FAIL | PASS | FAIL | FAIL | **FAIL** | **FAIL** |
| **`M2`** | FAIL | **PASS** | **PASS** | **PASS** | **PASS** | **FAIL** | **FAIL** |
| merged | FAIL | FAIL | PASS | FAIL | FAIL | **FAIL** | PASS |

**`M2` passes all four counts and dies on the byte-exact text and the clause, and on nothing else.**
BA/PM's and the Orchestrator's measurement is confirmed independently. Corroborated a second way:
with the `toBe` removed but the counts left in, `M2` fails with `expected false to be true` — the
only assertion in the reduced set that can produce that is clause (a).

## 3. `A7` IS NOT VACUOUS AND `AR-1` NOW HAS ENFORCEMENT — re-measured on the post-`ABC-016` suite

BA/PM measured this on a 682-test suite. It is re-run here because the suite is a different one:

| state of the out-of-tree copy | result |
|---|---|
| shipped: `RF-1` + repaired `A1` + both erase helpers repaired + `A7` | **717/717 on 24 files** |
| **model margin repair REVERTED**, `RF-1` in place | **`A7` FAILS ALONE — 1 of 717, nothing else moves** |
| model repaired, **DELIVERED writer restored** | 5 red (4 existing + `A1`) |

**Row 2 is the one that matters:** without `A7` the margin repair could be skipped at this hop or
silently undone a year later and **nothing anywhere would go red**. That is the "check that cannot
fail" class in its purest form, and `A7` closes it.

**Row 3 differs from BA/PM's 3 and the difference is a configuration difference, not a
contradiction.** They measured the repaired model against the *delivered* test file, whose assertion
sites still described the delivered writer. Mine runs against the *repaired* test file, so `:389`,
`:436` and `A1` also redden — those are the assertion-site repair reporting, not the model repair.
The four existing tests are the three `ABC-018` "writing and redraw" tests and the longer-previous-
frame pin. **`A6` stays GREEN in both, exactly as BA/PM measured and contrary to their own earlier
prediction.**

### The repair is not cosmetic, and the suite now says so in the terminal's own words

With the model honest and the delivered writer restored, the `>=`-boundary test fails with:

```
expected '8 .♜:♞.♝:♛.♚:♝.♞: ' to be '8 .♜:♞.♝:♛.♚:♝.♞:♜'
```

**The h-file rook, gone — byte for byte the failure text BA/PM predicted, and the same damage
Security/NFR read out of GNU screen 5.0.2's own buffer.** The suite reproduces this project's first
real-terminal FAIL on its own instrument the moment the instrument stops lying.

## 4. `A2`–`A6` DID NOT MOVE

All green with no edit, `A6` included — the full suite is 717/717 and the only added test is `A7`.
The hop's stop condition (*if one reddens, STOP and report*) was not reached.

## 5. Gates, as they ran

`npm test` **717 passed (717), 24 test files**; skip count **0**
(`numPendingTests + numTodoTests`). `npm run lint` (`biome check .`) **exit 0**, 43 files, 0 errors,
**2 infos** — both pre-existing `biome.json` deprecation notices (schema 2.3.0 against CLI 2.5.5, and
the deprecated `recommended` field), untouched by this hop. `npm run typecheck` **exit 0**.
`npm run build` **exit 0**. **ZERO test files added: 24 before and 24 after, counted.**

**One lint error was mine and is recorded rather than quietly fixed:** my first form of the `:389`
repair wrapped the `toContain` across three lines and Biome's formatter wanted it on one. Caught by
`npm run lint`, fixed, re-run clean. The gate did its job on the person running it.

## 6. Every harness lived OUTSIDE the repository

Copy of the worktree's `src/` with `package.json` / `tsconfig.json` / `biome.json` copied and
`node_modules` symlinked, verified byte-identical by `/usr/bin/diff -r` **before** use **and again
after every substitution run** (exit 0 both times). Every script restores the files it edits and
asserts the restore. **`git status --porcelain src/` in this repository shows only the two files this
ticket owns.**
