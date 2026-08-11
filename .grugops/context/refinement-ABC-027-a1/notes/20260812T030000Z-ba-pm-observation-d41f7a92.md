---
id: 20260812T030000Z-ba-pm-observation-d41f7a92
kind: observation
by: ba-pm
at: 2026-08-12T03:00:00Z
verified_by:
confidence: high
refs:
  - refinement-ABC-027-a1
  - abc027-fail-2026-08-12
  - security-nfr-ABC-027
  - quality-gate-ABC-027-qe
  - ABC-027
  - ABC-018
  - ADR-0010
  - NFR-002
  - src/frame.ts
  - src/frame.test.ts
supersedes:
---

# EVERY NUMBER IN THE NEW `A1` WAS RUN BEFORE IT WAS WRITTEN — and two of my own claims came back FALSE and are recorded rather than dropped

> **Hand-authored, and saying so as the brief instructs.** `scripts/context-io.ts` does not exist in
> this repository (there is no `scripts/` directory) and is not in the kit at
> `/Users/olgeroeselg/.grugops/agent-factory/`; `mcp__grugops__propose_note` is not in this session's
> tools. Workflow 16 names `context-io.ts` as the only sanctioned writer; it is absent, so this note
> was written to the `notes/` path directly — the same route every note on this ticket has taken.
> **NOTHING in this task's notes is a `finding`.** No `§14-gate#<id>` stamp is issuable to this role,
> the §14 gate machinery does not exist here, and none is self-attested.

> **Clock note, because the timestamps disagree with the machine.** `date -u` on this host reads
> `2026-08-11T09:15Z`; the parent decision is stamped `02:00` on 08-12 and the subtask was enqueued at
> `02:15`. I have kept the logical ordering the task uses rather than silently introducing a third
> clock. Recorded so nobody reads the gap as tampering.

## Why I ran anything at all, given the brief handed me the numbers

The brief warned me that this role has twice had a **repair** corrected by a later hop, and named the
reason itself: *a repair arrives with the authority of having just fixed something and gets read as a
solution rather than as a new claim.* So I treated the handed-down counts as an untested claim. **Two
things I would have written down as obvious came back false, and both are below.**

## 0. Baseline verified before anything, so any red is attributable to me

Worktree `/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-ABC-027`, branch
`grugops/ABC-027-frame-clearing`, tree clean, tip `270224f`. `npm test` → **681/681 on 22 files**,
matching the Orchestrator's post-rebase figure. Machine: Apple M3 (Mac15,13) / Darwin 25.5.0 arm64 /
Node v24.12.0 — **`UNKNOWN - verify` on any other hardware**, though nothing here is a timing.

Every harness lived **outside the repository**, this project's standing rule: a copy of the
worktree's `src/` with `node_modules` symlinked, verified byte-identical to the worktree by
`diff -r` before use. **`git status --porcelain src/` is 0 lines at the start and at the end of this
hop.**

## 1. The three emissions, counted from the REAL writer rather than re-implemented

`H` = 23, `W` = 18, the reference layout (real `renderBoard` 9 × 18, 3-row status stub, 8-row history
stub). The **delivered** emission came out of `beginFrameSession` itself; **merged** is `main`'s
expression; **candidate** is `RF-1`.

| emission | chars | `\x1b[K` | `\x1b[0J` | `\x1b` | delta vs merged |
|---|---|---|---|---|---|
| merged | **425** | 0 | 1 | 2 | 0 |
| delivered | **491** | **22** = `H − 1` | 1 | **24** = `H + 1` | **66** = `(H − 1) × 3` |
| **candidate `RF-1`** | **494** | **23** = `H` | 1 | **25** = `H + 2` | **69** = `H × 3` |

**Every identity checked as an assertion, not by eye**, and all pass. The Security/NFR gate's figures
reproduce exactly. Two further facts I checked because the criterion rests on them:

- **The delta is content-independent** — 69 at `W` = 18, 37 and 39 alike, so `H × 3` is a law of the
  shape and not a property of the fixture.
- **The candidate's emission ends `\n\x1b[K\x1b[0J`.** The prompt row's leading erase and the
  erase-to-end-of-screen both fire at row `H − 1`, column 0, so **that erase is provably redundant.**
  This is the measured basis for the trailing-erase re-argument in the `decision` note — it is kept
  deliberately, not kept by oversight.

## 2. What `RF-1` moves in the suite, MEASURED by applying it and leaving the suite untouched

The ticket's merged table named **four** assertion sites, predicted by reading. Run:

| result | detail |
|---|---|
| **3 failed / 29 passed** | `:389` (the join shape), `:436` (the slice arithmetic), and `A1` |
| **`:391` MASKED** | the escape-count assertion never reports, because `:389` fails first — **the same masking the cut hop recorded at `:374`/`:376`, repeating.** A build that fixes only what the runner prints leaves `2 + (H − 1)` in place |
| **`A6` (`:790`) does NOT move** | it was on the merged list because clause 1 moved it; `RF-1` does not |
| `:437` cursor assertion does not move | the prompt row is empty, so the cursor still lands at `{row: H − 1, column: 0}` |

**`A2`, `A3`, `A4`, `A5` and `A6` are all GREEN under `RF-1` with no edit whatsoever.**

## 3. The new `A1`, WITNESSED against nine writers — one passes, eight fail

Built on the copy: the re-derived `A1` (counts `H` / 1 / `H + 2` / `H × 3`, the byte-exact text, and
the new column-0 clause), then each writer substituted at the same anchor.

| writer | new `A1` |
|---|---|
| **`RF-1` — the required shape** | **PASSES** |
| **delivered** — erase AFTER each row, at the margin | **FAILS** |
| merged — bare-newline join | **FAILS** |
| drop row 0's leading erase (`H − 1`) — QE's `M1` | **FAILS** |
| drop the prompt row's leading erase (`H − 1`, behaviourally identical) | **FAILS** |
| **`M2` — `map(row => row + \x1b[K)` joined by bare newlines** | **FAILS** |
| `M3` — leading erase on row 11 only | **FAILS** |
| `M4` — no `\x1b[0J` | **FAILS** |
| `M5` — `\x1b[0K` for `\x1b[K` (same sequence, different spelling) | **FAILS** |

### `M2` IS THE RESULT WORTH CARRYING, and it is the one nobody's brief predicted

**Once the counts move to `H` / `H + 2` / `H × 3`, `M2` matches ALL FOUR of them exactly** —
`\x1b[K` = 23, `\x1b[0J` = 1, `\x1b` = 25, delta = 69 — verified by arithmetic on both emissions.
And `M2` is **the unsafe shape**: every one of its `H` erases fires at the margin.

**Under the OLD `H − 1` counts, the count alone killed it. Under the new counts it does not.** So
moving the counts to `H` — which is forced, because `RF-1` emits `H` — **silently costs one of `A1`'s
kill mechanisms against exactly the failure mode this repair exists to prevent.** That is why the new
`A1` gains the column-0 clause rather than only new numbers: `M2` now dies on the byte-exact text and
on `no \x1b[K is immediately followed by a newline`, and on nothing else in the criterion.

**Had I written the re-derivation as three substituted numbers — which is what the contradiction table
in my brief describes, and it is correct as far as it goes — `A1` would have come out measurably
weaker against the margin than it is now, while looking like a faithful repair.** This is the second
time this ticket has produced a change that reads fine and measures wrong.

## 4. Two claims of my own that came back FALSE

**(a) That `A6` would go red under the repaired model with the delivered writer.** It does not.
Measured: **three existing tests go red and `A6` stays GREEN.** `A6` asserts only about the second,
**narrower** frame, whose 18-wide rows end at column 17 on its 24-column screen — below the margin,
where model and terminal agree. The wide frame's damaged cells are overwritten before anything looks
at them. **I had written the opposite into the ticket and corrected it before finishing.** The useful
consequence: **`A6` could not have caught this regression either**, so the list of criteria that could
have is exactly one long, and it is `A1`.

**(b) That the model's margin repair is confined to `eraseToEndOfLine`.** It is not — `ED` erases from
the cursor too, so a repair that fixes only the line-erase leaves the model disagreeing with itself.
Both helpers take the corrected column. This is in the ticket's `## Test notes` so the Engineer does
not find it by failing.

## 5. The screen model's margin: the measurement that decided it belongs in a criterion

| state of the copy | result |
|---|---|
| `RF-1` + repaired `A1` + model margin repair + `A7` | **682/682 on 22 files**, `tsc --noEmit` 0, `biome check` clean |
| the same, with the **model repair reverted** | **`A7` fails ALONE** (`expected 'ABCDEFGHIJ' to be 'ABCDEFGHI '`) |
| model repaired, **delivered writer left in place** | **3 existing `ABC-018` tests red** |

Two things follow, and both are measurements rather than positions:

1. **With `RF-1` in place the model's margin case is unreachable through the writer**, so `AR-1`
   assigned to the Engineer *without* a criterion has **zero enforcement** — skip it, or undo it a
   year later, and nothing anywhere goes red. The suite is 682/682 either way except for `A7`.
2. **The repair is not cosmetic.** With it, and with the delivered writer, the failure text is
   literally the lost h-file: ``expected '8 .♜:♞.♝:♛.♚:♝.♞: ' to be '8 .♜:♞.♝:♛.♚:♝.♞:♜'``. **The
   suite reproduces the real-terminal FAIL on its own instrument the moment the instrument stops
   lying.**

**`681` → `682` is one new test and ZERO new test files**, so `N8-LANE`'s floor allowance stays 0 ms
and only the content allowance applies, unchanged.
