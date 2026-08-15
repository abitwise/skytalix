---
id: 20260815T142800Z-ba-pm-observation-i-measured-the-clause-before-i-ruled-it-8c62b1de
kind: observation
by: ba-pm
at: 2026-08-15T14:28:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - E1
  - Q1
  - Q4
  - A6
  - N8-LANE
  - src/cli-options.ts
  - src/cli.test.ts
supersedes: 
---

# I measured the clause against the delivered build and against four mutants BEFORE ruling it

**A criterion written without running it is the defect this ticket exists to stop.** Two hops have now
been spent because a repair was believed rather than watched, so I built the near-miss family, ran it
against the delivered resolver and against four rebuilt mutants, and ruled on the numbers.

**Method, and its one honest limit.** Mutants were applied to **COPIES of `src/cli-options.ts` in the
scratchpad**, never to `src/` — this hop is zero-code and `src/` is not mine. Each copy was
anchor-guarded (`if (token === COLOUR) {` must occur exactly once or abort — the false-KILLED guard), and
`git status --porcelain src/` was verified clean after the batch. The limit: I exercised
**`resolveOptions` directly**, not `npx vitest`, so these are the row's own verdicts, not a suite run. The
engineer's implementing hop should confirm against the real suite.

## The delivered build — the false-RED control, which had to come first

| row | cases | accepted by delivered resolver | verdict |
|---|---|---|---|
| old 18 | 18 | **0** | GREEN — unchanged |
| **new family** | **138** | **0** | **GREEN — my clause cannot red a correct build** |

Also checked: **zero** members of the family collide with `ACCEPTED_ARGUMENTS`, so the existing
non-vacuity guard still holds. **138 cases, 134 distinct** — four duplicates from deletions at repeated
characters (`--`, and `ascii`'s `ii`). The engineer must pin one number or the other deliberately.

## The four mutants — old row vs new row

| mutant | old 18 | new family | the token that does it |
|---|---|---|---|
| `token.endsWith(COLOUR)` — the fix hop's `MX5` | **GREEN (survives)** | **RED (killed)** | `["x--colour","white"]` |
| `token.trim() === COLOUR` — `MX4` | **GREEN (survives)** | **RED (killed)** | `[" --colour","white"]` |
| `token.startsWith(COLOUR)` — QE's `M7`/`MX1` | RED | RED | `["--colourx","white"]` |
| `token.toLowerCase() === COLOUR` — QE's `M19`/`MX2` | RED | RED | `["--COLOUR","white"]` |

**`E1`'s two survivors die and `Q1`'s two stay dead.** The new family strictly contains the old 18, so
the arming QE diagnosed and the fix hop verified is preserved, not traded away.

## `N8-LANE` pricing of the ruling — the number `G1` deserves

Paired, same process, 20 repetitions each:

```
per-pass over the new family (138 cases) : 0.0498 ms
per-pass over the old 18                 : 0.0011 ms
DELTA                                    : +0.0487 ms CPU, and ZERO new child processes
```

**+0.049 ms against a 650 ms bar is 0.0075% of it**, and roughly 0.004% of the ~1300 ms the lane actually
measures. It is two to three orders of magnitude below the resolution of every `N8-LANE` reading taken on
this ticket (Security/NFR, QE and the engineer all report in whole milliseconds). **This ruling does not
move `G1` and must not be cited as having improved or worsened it.**

## `Q4`'s draw budget — the 500 is measured, not chosen

The correct **whole-form** filter and QE's over-dropping **CONTAINS** filter (`M17`), each run to 250 kept
or 500 draws, per shape:

| filter | `--<word>` | `-<char>` | `<word>` | `--colour <word>` |
|---|---|---|---|---|
| **correct (whole form)** | 250 kept / **250 draws** | 250 / **250** | 250 / **250** | 250 / **250** |
| **`M17` (contains)** | 250 / 250 | 250 / 250 | 250 / 250 | **0 kept / 500 draws → RED** |

**The correct filter needs exactly 250 draws for 250 items — worst case over 20 full corpora is 250, a
drop rate of zero** (drawing exactly `--ascii` or `white` at random is ~1e-10). A **500-draw budget is
therefore 2x headroom and cannot flake**, and under `M17` the `--colour <word>` shape **exhausts the
budget and reds in milliseconds** instead of hanging to the 180 s timeout. That is precisely the detector
`A6`(ii) says it has and did not have.

## What I did NOT measure, so this is not read as more than it is

- **I did not run `npm test`, the gate, or `PERFT_DEEP`.** This hop changed one markdown page and wrote
  notes; no test file and no production byte moved, so there is nothing of mine for a suite to catch. The
  suite run that matters is the engineer's, after the row is written.
- **I did not re-measure `N8-LANE` itself.** My +0.049 ms is a delta on a pure-function loop, not a lane
  reading, and it must not be quoted as a fourth `N8-LANE` measurement — the fix hop made exactly this
  caveat about its own harness and it applies with more force to mine.
