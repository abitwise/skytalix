---
id: 20260812T023000Z-qe-e2e-observation-lane-cost-and-suite-verdicts-6c81ba40
kind: observation
by: qe-e2e
at: 2026-08-12T02:30:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-029
  - ABC-026
  - NFR-008
  - ADR-0008
  - N8-LANE
supersedes:
---

# The lane verdicts and the lane cost — the FIRST shape breached the margin by 3.4x and the shape that ships does not

> **Hand-authored**, no stamp. Harness: `artifacts/lane-n8.py`. Machine: Apple M3 (`Mac15,13`),
> 8 cores, macOS 26.5.2, node `v24.12.0`, vitest `3.2.7`. `UNKNOWN - verify` on any other machine.

## 1. The suite verdicts — run, not reasoned

Four out-of-tree trees, each extracted from the object database, `node_modules` symlinked to the
worktree's (no second `npm install`):

- **`laneA`** — pristine. **`744 passed (744)` on `26` files, skip `0`, `tsc --noEmit` 0.** The
  briefed baseline reproduces exactly.
- **`laneD`** — `laneA` **plus the `A4` block appended to the EXISTING `src/history-pane.test.ts`**.
  No new file, no new module, no new dependency; **file count stays 26**. `748 passed (748)`,
  `tsc --noEmit` **0**, `biome check` **clean** (it needed one `--write` formatting pass, which did
  not touch a byte of the pre-existing 744-test body — verified by comparison against `laneA`).
- **`laneN`** — a `cmp`-verified byte-identical copy of `laneA`, the identity null control.
- **`laneB` / `laneC`** — the two rejected shapes, kept because their cost is the finding in §3.

**Every mutant, run against both lanes** (each mutant = the delivered pane plus one anchored edit):

| build | `laneA` (delivered suite) | `laneD` (suite + `A4`) |
|---|---|---|
| `WCLEAN` | 744 passed (744) | **748 passed (748)** |
| `WFENMID` | 744 passed (744) | **1 failed, 747 passed** |
| `WPOSMID` | 744 passed (744) | **1 failed, 747 passed** |
| `WBOARDMID` | 744 passed (744) | **1 failed, 747 passed** |
| `WBOARDSET` | 744 passed (744) | **1 failed, 747 passed** |
| `WBOARDBUF` | 744 passed (744) | **1 failed, 747 passed** |
| `WBOARDBLIND` | 744 passed (744) | 748 passed (748) — the measured blind spot |
| `WMOVESWAP` | 744 passed (744) | **1 failed, 747 passed** |
| `WSPLICE` | **1 failed, 743 passed** (`A9`'s freeze) | **2 failed, 746 passed** (`A9` + `A4`) |

**The `744/744` survivor claim in `ABC-028` is re-measured here, not inherited, and it holds** for
`WFENMID`, `WPOSMID`, `WBOARDMID` and `WMOVESWAP`.

**FAILS ZERO PRE-EXISTING TESTS**, and the failure is exactly one test with a diagnostic that names
the slot and the detector:

```
FAIL src/history-pane.test.ts > ABC-028 A4 — candidate instrument
     > A4 — no reachable slot of the supplied GameHistory differs during a render, at all ten lengths
AssertionError: 0 plies: expected [ { detector: 'board-digest', …(2) } ] to deeply equal []
```

## 2. The method, stated because `N8-LANE` prescribes it and this hop did not invent one

CPU (user + sys) of a **fresh OS process tree per run**, read from `wait4` rusage (µs resolution, not
`time`'s 10 ms). **Runner invoked DIRECTLY** — `node node_modules/vitest/vitest.mjs run` — stated per
the clause that requires it. `PERFT_DEEP` unset. **9 rounds, round 0 discarded as warm-up, condition
order rotated every round, median of paired per-round deltas, sign test reported beside it, identity
null control run as its own condition in the same interleaved harness.** **The ticket adds ZERO test
files, so the 160 ms per-file floor subtraction does not apply** — the whole delta is content.

## 3. The measurement, and the shape that failed it

| shape | median delta | % of lane CPU | sign | null control in the SAME session |
|---|---|---|---|---|
| **`laneB` — first shape**, 4 `it`s, two fixture rebuilds, the distortion check at ten lengths | **+252.7 ms** | +2.79% | **8/8 positive** | −7.2 ms, −0.08%, 3/8 |
| `laneB`, that one FILE only (`vitest run src/history-pane.test.ts`) | +168.1 ms | +11.62% | 8/8 | +18.7 ms, +1.30%, 5/8 |
| `laneC` — lean: shared fixtures, distortion check dropped | −6.9 ms | −0.08% | 4/8 | +26.2 ms, +0.29%, 5/8 |
| **`laneD` — the shape that ships**: lean + the distortion check at ONE length | **−21.9 ms** | −0.24% | **3/8** | −71.0 ms, −0.77%, 3/8 |

**The first shape BREACHED.** `ABC-028`'s margin is **~75 ms** of the 650 ms content allowance and the
first shape cost **+252.7 ms — 3.4x the whole remaining margin, with the sign at 8/8.** It was not
rejected because it looked expensive; it was rejected because it was measured.

**The shape that ships is at the null floor.** −21.9 ms at **3/8 positive** against a null control
reading −71.0 ms at 3/8 in the same session: **the delta is not distinguishable from zero on
`N8-LANE`'s own instrument.** I claim *below this instrument's resolution*, **not** *zero* — the
honest statement is that no cost can be demonstrated at n = 8 on this machine.

**Where the 253 ms went**, profiled in-process (median of 7): one `buildLengthCases()` rebuild
**9.8 ms warm / 20.3 ms cold**; ten watched renders **14.6 ms** (the 2000-ply case is **6.6 ms** of
it); ten plain renders 0.7 ms. **Two of the four `it`s each rebuilt all ten fixtures**, and `A4` — 
unlike `A9` — does **not** need an object nothing has rendered: it asserts a property of **its own**
render, so `D23` does not apply to it and the shared `LENGTH_CASES` are correct for it. Dropping the
two rebuilds and moving the distortion check to one length is the whole difference between the two
rows.

## 4. `ADR-0008`'s ratified clauses, re-run on the shape that ships

`npm test`, `PERFT_DEEP` unset, three runs each:

```
laneA   real 1.81 / 1.73 / 1.67 s      CPU 8.76 / 8.86 / 8.80 s
laneD   real 1.69 / 1.74 / 1.72 s      CPU 8.99 / 8.93 / 8.99 s
bar     <= 3 s wall                    <= 13 s CPU
```

**Both clauses hold, with room.** File count TWO for this pane, 26 in the lane — unchanged.

## 5. Three limits on this number, stated so nobody inherits it wrongly

1. **It is `A4`'s criterion ALONE.** `A1`, `A2` and `A3` add their own fixtures and their own cost,
   and they are **not** in this measurement. The ticket's ~75 ms margin is for the whole ticket.
2. **It is a DELTA, not the TOTAL.** `ABC-028`'s own rule stands: whichever of `ABC-028` / `ABC-029`
   lands second **re-measures the total**. This hop does not discharge that, and `ABC-026` still owns
   the lane total.
3. **It was measured on the 16-file tree** (`../cli-chess-ABC-029`, no `src/turn-loop.ts`).
   `ABC-019`'s tip has 17 and would read a slightly larger denominator. The delta is a per-file
   content cost and the missing file is not a test file, so I expect no change — **`UNKNOWN - verify`
   on the 17-file tree**, and I did not enter that worktree.
