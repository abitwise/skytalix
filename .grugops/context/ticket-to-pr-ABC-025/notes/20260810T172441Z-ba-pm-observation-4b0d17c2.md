---
id: 20260810T172441Z-ba-pm-observation-4b0d17c2
kind: observation
by: ba-pm
at: 2026-08-10T17:24:41Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - ABC-026
  - N5
  - src/san.qualifier.hardening.test.ts
  - src/san.suffix.hardening.test.ts
  - plans/tickets/ABC-025-san-qualifier-minimality-net.md
  - plans/nfr-catalog.md
supersedes: 
---

# `N5` on a FIFTH instrument — and the measurement none of the four took: **two EMPTY test files cost 5.4–6.1% of the lane, so `≤ 5%` stated gross is a bar no ticket adding two files can EVER meet**

Four roles have measured `N5` and reported five numbers. **Nothing below is inherited from any of
them.** Own trees, own harness, own aggregators, and two conditions nobody has run: a **fixed-cost
floor control** (the same file count, trivial content) and the **narrowed-corpus variant** whose cost
the ruling turns on. The ruling is in the `decision` note beside this one; this note carries numbers.

It is an `observation` and **not** a `finding`: there is no §14 gate verdict on this hop,
`context.human_admission` is `off`, so no stamp exists and none was invented.

## The instrument

Four out-of-tree working copies, `src/` copied to a scratchpad with `node_modules` **symlinked**,
`package.json` / `tsconfig.json` / `biome.json` copied; **every copy asserted byte-identical to the
repository's `src/` per file (37 files, md5 each) before any condition was applied**, and **the
repository's own `src/` was never written** — re-verified at the end (`git status --short -- src/`
empty, `src/san.ts` still `cbcc3be37c21414d16e8e6b4d0c68959`). Machine Apple M3 / Node v24.12.0 /
darwin arm64, vitest 3.2.7; `UNKNOWN - verify` on any other hardware.

```
A     neither hardening file                                  652 tests / 20 files
A'    IDENTITY NULL CONTROL — a byte-identical second tree     652 tests / 20 files
C     both hardening files = the whole ABC-025 delta           676 tests / 22 files
Bn23  A1's corpus narrowed to this ticket's 23 positions       676 tests / 22 files
Z     FIXED-COST FLOOR — two TRIVIAL one-assertion files       654 tests / 22 files
```

**Three interleaved harness runs**, condition order **rotated every round**, **one fresh OS process
per run**, round 0 discarded as warm-up, n = 8 usable rounds each. **Every run asserts its own test
count AND file count** — a run whose tree state is not what its label claims is a harness error and
never a datum. **0 harness errors across 108 runs.** Both wall and CPU (user + sys) recorded via
`/usr/bin/time -p`, reported separately and never blended. The statistic is the **median of paired
per-round deltas** against condition A, with the **sign test** reported beside it, because on a
right-tailed distribution the sign is what says whether an effect exists at all.

## 1 — the numbers

```
                                    CPU paired median          sign          WALL paired median
A'   null control by identity   +0.1% / +0.0% / -0.1%   4/8 4/8 4/8    +0.3% / +3.2% / +0.7%
C    the delivered tree        +12.8% / +13.9% / +14.1%  8/8 8/8 8/8    +5.5% / +3.2% / +4.2%
Z    two TRIVIAL files          +5.4% / +6.1%            8/8 8/8        +1.7% / +6.0%
Bn23 A1 over the 23 only        +8.7% / +10.5%           8/8 8/8        +0.0% / +2.8%

lane A: wall median 1,380-1,435 ms   CPU median 6,310-6,365 ms
5% of it:                ~71 ms wall              ~318 ms CPU
```

**`C` reproduces to within 1.3 points across three independent runs with the sign positive in 24 of
24 rounds.** The CPU null control reads within ±0.1% every time and its sign is **4 of 8 — exact
chance — in all three runs**, which is what a null control is supposed to look like and is a tighter
floor than the 0.4–0.5% Security/NFR reported.

## 2 — the wall clock is not merely noisy, it is ORDER-VIOLATING

Security/NFR's null control by identity showed the wall instrument reporting up to +6.0% for a change
that is nothing. **This hop reproduces that and adds something worse.** In run 3, in the same
interleaved harness, on the same machine, in the same minutes:

```
Z    TWO EMPTY TEST FILES, 2 assertions, no repository imports    wall +6.0%
C    THIS TICKET'S ENTIRE 24 TESTS, 7,314 renders                 wall +4.2%
```

**Two empty files measured more expensive on the wall clock than the whole delivered ticket.** A null
control tells you an instrument cannot resolve a difference; this tells you it can invert one. **An
instrument that ranks nothing above everything cannot rank anything**, and no choice of statistic
repairs that — the ordering violation is between two *real* conditions, not against a control.

Note also that the wall null floor is **session-dependent**: +0.3%, +3.2% and +0.7% across three runs
an hour apart on one machine, against Security/NFR's +0.7% to +6.0% on theirs. **A bar whose noise
floor varies tenfold between sessions cannot be relied on in either direction**, which is the
argument against wall stated without needing anyone's session to be the bad one.

## 3 — the measurement nobody took, and it changes what the bar can even ask for

`Z` is the fixed cost of *adding two test files to this lane at all* — two files, one `describe`, one
`it`, one `expect(1).toBe(1)`, importing nothing from the repository.

```
Z costs +5.4% / +6.1% of the lane's CPU, sign 8 of 8 both times.
```

**The lane's cost is dominated by per-file worker, transform and collect overhead rather than by test
content.** Two consequences:

1. **`N5` at `≤ 5%` stated gross is unmeetable by construction for any ticket that adds two test
   files — including a ticket that adds two empty ones.** That is not a property of `ABC-025`; it is
   a property of the bar. Four instruments measured the delta and none measured the floor of the
   delta's own species, so the bar has been read four times as if 0% were achievable.
2. **This ticket's content-attributable cost is `13.6% − 5.8% ≈ 7.8 points`**, which is the number
   the re-derived bar is charged against and is still **1.6x** over it.

## 4 — the candidate change nobody had priced: `A1` over the 23 positions instead of 207

Built out of tree as a **two-line** variant of the delivered file — `for (const { fen } of CORPUS)`
→ `TICKET_ENTRIES` in `A1`'s loop, and its non-vacuity floor `toBeGreaterThan(3000)` →
`toBeGreaterThan(80)` — and run **green** (676/676) as its own interleaved condition:

```
Bn23   +8.7% / +10.5% CPU gross   =  ~3.8% NET of the floor   ->  it MEETS the re-derived bar
C      +12.8% / +13.9% / +14.1%   =  ~7.8% NET                ->  it does not
```

It cuts `A1`'s corpus from 207 positions / 7,314 renders to 23 / 677 — **91% of the renders** — and
by the ticket's own arithmetic it keeps every named discriminating requirement: the ticket's
`PROP-NEW − PROP-OLD` deltas are the 23 positions' own contribution, so all five mutants still die on
them alone (`Q33` 44, `Q34` 24, `Q35` 18, `Q27` 80, `Q38` 30), and the 23 fill all 44 census cells by
themselves.

**It is refused, and the reasons are in the `decision` note.** It is recorded here with its price
because a refusal whose cost is not stated is an opinion.

**A second thing this measurement settles.** The Engineer diagnosed the cost as `A1`'s unassisted
half (~174 ms of the file's 263 ms isolated). On the *lane's CPU* that is not where most of it sits:
removing 91% of `A1`'s renders entirely still leaves **+8.7% to +10.5%** — so the cost is spread
across `A1`, `A2`'s census pass and `A4`'s injectivity pass over 207 positions, on top of the ~5.8%
per-file floor. Both readings are true of different quantities; the isolated file-time reading does
not predict the lane reading, which is one more reason the numerator had to be pinned.

## 5 — the security trigger's two readings, measured

```
git diff --numstat main                                    34 files, +4,340 / -2
  files touched that are NOT a *.test.ts under src/        32   (19 context notes, 8 queue
                                                                records, 5 under plans/)
git diff --numstat main -- src/                            655/0 + 168/0  = +823 / -0, two files
git diff --numstat main -- . :(exclude)plans :(exclude).grugops
                                                           the SAME +823 / -0, two files
  of those, files that are NOT a *.test.ts under src/      0
git diff --name-only main -- package.json package-lock.json   EMPTY
```

**Under the literal reading both clauses fire, and the count has GROWN since Security/NFR measured it
(26 files → 32, +3,560 → +4,340) purely because this task wrote more notes** — which is the defect
demonstrating itself. Under the corrected denominator (the diff outside `plans/` and `.grugops/`)
clause 1 is not fired (823 < 900) and clause 2 is not fired (0 files) — **identical to the verdict
the gate rendered**, which is the verdict-preservation test the re-wording had to pass before it was
allowed.

## 6 — the per-file census, re-derived rather than quoted

From the delivered 676-test lane (`--reporter=json`, per-test durations summed per file):

```
src/perft.test.ts                     24 tests   1,039 ms   39.5%
src/san.qualifier.hardening.test.ts   20 tests     564 ms   21.4%   <- ABC-025
src/san.test.ts                       22 tests     269 ms   10.2%
                                     676 tests   2,633 ms   total, skip 0
```

`ABC-025`'s two files are **21.7%** of suite test time and **2.3x** the castling-hardening,
en-passant-hardening and gameend files combined. Security/NFR measured 20.1% and 2.1x on their
session: **independent agreement within ~10%**, and the evidence under `ABC-026`.

## What these figures do NOT establish

**Not a figure for any other machine.** One machine, three runs in one session; `UNKNOWN - verify`
elsewhere. **Not that CPU is the only defensible instrument** — it is the one that resolves a delta of
this size here, and the choice is recorded as the bar author's rather than smuggled in as a fact.
**Not that the per-file floor is 5.8% in general** — it was measured at one file count (two) with
trivial content; the shape of that curve is `ABC-026`'s to establish, and this hop measured two points
of it, not a curve. **Not a re-measurement of `NFR-001`–`NFR-007`** — `plans/nfr-catalog.md` is not
edited and no catalog target moved.

## The substrate gap, re-verified rather than inherited

`scripts/` does not exist in the repository; there is no `context-io.*` and no `claim.*` anywhere in
the repository or in the kit at `/Users/olgeroeselg/.grugops/agent-factory` (which has no `scripts/`
directory at all), and `mcp__grugops__propose_note` is not in this session's tool set. Workflow 16's
stop condition is live on every hop of this install. **These two notes were hand-written into
`notes/` in the `agent-factory/contracts/context-note.md` format**, as every prior note on this task
did; the claim was taken by hand with an atomic `mkdir .grugops/queue/claimed/ticket-to-pr-ABC-025-bapm2`
exactly as Workflow 17 step 2 specifies. Nothing mechanically validated any of it and `index.md` /
`index.jsonl` do not exist for this task. Owner **Orchestrator**; this is the fourth consecutive hop
to record it.
