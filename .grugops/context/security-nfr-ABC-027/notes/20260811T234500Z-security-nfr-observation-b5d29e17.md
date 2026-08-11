---
id: 20260811T234500Z-security-nfr-observation-b5d29e17
kind: observation
by: security-nfr
at: 2026-08-11T23:45:00Z
verified_by:
confidence: high
refs:
  - security-nfr-ABC-027
  - ABC-027
  - ABC-018
  - NFR-002
  - NFR-007
  - NFR-008
  - N8-LANE
  - plans/nfr-catalog.md
  - src/frame.ts
supersedes:
---

# `NFR-002` RE-DERIVED ON THIS GATE'S OWN INSTRUMENTS AND MET WITH ~2,000x HEADROOM; `N8-LANE` MEASURED AT ZERO AND `NFR-008` MET; `plans/nfr-catalog.md` IS BYTE-IDENTICAL TO `main` AND NO BAR WAS CREATED, MOVED OR LOOSENED

> **Hand-authored** — `scripts/context-io.ts` absent here and from the kit,
> `mcp__grugops__propose_note` not in this session's tools. **`observation`, not a `finding`.**

## The catalog was not touched, verified by hash rather than asserted

`git diff --stat main...HEAD -- plans/nfr-catalog.md` is **empty**, and the file's md5 is
`975005524024a3bcd87378cc364fd3b7` on both `HEAD` and `main`. **No row was added, deleted, re-derived,
loosened or re-worded by this ticket, and this gate added none either — the decision does not need a
row.** Everything below is measured evidence recorded here, in the notes, exactly as the standing
practice on this file requires; the catalog stays as it is.

The branch's whole diff against `main` is **`src/frame.ts` (+20/−8), `src/frame.test.ts` (+248/−22),
`plans/traceability.md` (1 line) and seven context notes.** No other file.

## Gates re-run by this gate, not inherited

`npm test`, `PERFT_DEEP` unset: **681 passed (681) on 22 files, skip 0**. `npm run lint`
(`biome check .`): **exit 0**, 40 files, 0 errors, 0 warnings, 2 infos. `npm run typecheck` and
`npm run build` (`tsc --noEmit`): **exit 0**. Matches the Orchestrator's post-rebase figure.

## `NFR-002` — the `< 16 ms` per-frame bar. MET.

**The Engineer's and BA/PM's numbers were NOT inherited.** Own harness outside the repository, own
process, `parseFen` and `renderBoard` hoisted out of every clock, the frame built ONCE outside the
clock, the writer built once outside it, discarded warm-up round, **11 rounds × 2,000 iterations per
cell, cell order ROTATED every round, medians of per-round means, checksum kept against elision, and
two fully independent samples in separate processes.** The pre-`ABC-027` in-place expression was
reconstructed from `main`'s `src/frame.ts:216` and run as its own cell in the same harness, so the
delta is paired rather than compared across sessions.

Machine **Apple M3 (Mac15,13) / Darwin 25.5.0 arm64 / Node v24.12.0**, `UNKNOWN - verify` on any other
hardware. The quantity is this row's own: **serialize + exactly ONE `write(2)` to a real non-TTY fd,
judged against the most expensive honest sink (a regular file)**, with `/dev/null` and an in-memory
sink recorded beside it as the cheaper readings.

### At the ticket's own denominator — `H` = 23, `W` = 18, **425 → 491 characters**

| cell | sample 1 | sample 2 |
|---|---|---|
| **delivered → regular file** | **2.9141 µs** | **2.8955 µs** |
| merged → regular file | 2.7659 µs | 2.7677 µs |
| delivered → `/dev/null` | 1.7184 µs | 1.7535 µs |
| merged → `/dev/null` | 1.6605 µs | 1.6679 µs |
| delivered → in-memory (a floor; omits the syscall the row's words require) | 0.6355 µs | 0.6373 µs |
| compute — `assembleFrame` ONLY | 3.4489 µs | 3.4159 µs |

**The +66 characters cost +0.128 / +0.148 µs on the write half — +4.6% / +4.7% of the write, and
0.0009% of the 16 ms budget.** Write + compute ≈ **6.34 / 6.31 µs = 0.0063 ms against 16 ms — 0.040%,
about 2,500x headroom. MET.**

### At the wide fixture — `W` = 37, 843 → 909 characters

delivered → file **3.9245 / 3.8901 µs**, merged **3.7594 / 3.8094 µs**, compute **4.1045 / 4.1139 µs**.
Sum ≈ **8.03 / 8.00 µs = 0.0080 ms — 0.050%, about 2,000x headroom. MET.**

### Where this gate agrees with, and differs from, the record

- **It reproduces the `ABC-018` gate's figure for the same quantity.** That gate measured a regular
  file at **2.711–2.772 µs** for its 419-character frame; this gate's *merged* cell reads
  **2.766–2.768 µs**. The instrument is the same instrument.
- **The compute cell is NOT comparable to that gate's 5.978–6.137 µs and is not offered as a
  divergence.** This one times `assembleFrame` alone with `renderBoard` hoisted OUT of the clock; that
  is a different decomposition, not a different reading.
- **The compute half remains a LOWER BOUND**, unchanged by this ticket: `ABC-016` and `ABC-017` are
  stubs here, and the real panels' compute is still `UNKNOWN - verify`.
- **The one way this bar can be busted is still an unbounded supplied string**, recorded at `ABC-018`'s
  gate with owner **BA/PM at `EPIC-003`**. `ABC-027` does not touch it: the writer's cost is linear in
  the frame's characters and the frame's characters are bounded by `assembleFrame`.

## `NFR-007` — one `write()` per frame. Verified on this gate's own counter.

**120,000 frame writes, 120,000 `write` calls — exactly 1 per frame**, across five sink cells over 12
rounds. The single-write constraint is untouched by the change, as the ticket claims and `A1` asserts.

## `N8-LANE` — measured at ZERO, and the null control says the instrument could have seen it

Protocol taken from the catalog's `N8-LANE` block rather than invented: **CPU (user + sys) of the
default lane, `npm test` with `PERFT_DEEP` unset, n ≥ 7 interleaved rounds, condition order ROTATED
every round, one fresh OS process per run, round 0 discarded as warm-up, median of PAIRED per-round
deltas with the sign reported, and an IDENTITY NULL CONTROL — a byte-identical second tree run as its
own condition in the same harness.** `/usr/bin/time -p`, three out-of-tree copies (`pre` = `main`'s
`src` by `git archive`, `post` = delivered, `twin` = a copy of `pre`), `node_modules` symlinked.

Tree identity verified before any round: **`twin` byte-identical to `pre` by `diff -r` and by
per-file md5 aggregate `df71fb293d653eaa5e811986a81e04f7`; `post` differs from `pre` in exactly two
files — `src/frame.ts` and `src/frame.test.ts` — and in nothing else.**

**ZERO test files were added, and it is measured rather than declared: 22 test files and 36 `.ts`
files in all three trees.** So `N8-LANE`'s floor allowance is **0 ms** (nothing to subtract at 160 ms
per added file) and only the content allowance applies.

| condition | median paired CPU delta vs `pre`, n = 7 | sign |
|---|---|---|
| **post (delivered)** | **+0.0 ms (+0.00%)** | **4/7 positive — chance** |
| twin (identity null control) | −30 ms (−0.41%) | 2/7 positive |

**Against `N8-LANE`'s ≤ 650 ms CPU: MET, at 0 ms — the ticket's content cost is below what this
instrument can resolve, and the null control (−0.41%, inside the ≤ 1.5% admissibility floor and
consistent with the −0.43%/−0.52%/−1.26% the catalog already records) says the harness is admissible
rather than merely quiet.**

**Where this differs from the ticket's own figure, stated rather than smoothed:** the ticket reported
**~20 ms** as INDICATIVE, from n = 3 paired runs of `src/frame.test.ts` **alone**, and labelled it
below protocol. This gate measures the **lane**, n = 7, with a null control, and reads **0 ms**. The
two are not in conflict — a 20 ms effect on one file is inside this instrument's noise — and both are
two orders of magnitude under the bar. **`NFR-008` was not re-opened and no lane bar was re-derived.**

## `NFR-008` — the lane total, measured in passing

Medians over the same 7 usable rounds: **post wall 1.590 s against the 3 s clause (53%), post CPU
7.360 s against the 13 s clause (57%) — both MET.** (`pre` 1.610 s / 7.470 s.) One post round showed a
2.87 s wall outlier against 1.46–1.63 s elsewhere; the statistic is the median, and the outlier is
recorded rather than dropped silently.
