---
id: 20261012T151000Z-qe-e2e-observation-abc095-timing-a2-r3-n8-lane-3283096f
kind: observation
by: qe-e2e
task: qe-ABC-095
at: 2026-10-12T15:10:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - NFR-004
  - NFR-008
  - N8-LANE
  - ADR-0035
  - ADR-0037
  - 20261012T141400Z-software-engineer-observation-a2-cold-and-r3-warm-miss-not-read-a045086f
supersedes:
---

# `ABC-095` timing at `2307fc11`: `A2` **MET** (max 8.300 ms ≤ 30 ms, cold), R3 **MET** (max 0.0149 ms ≤ 5 ms, warm). `N8-LANE` **NOT READ** on both sets (4 windows, all VOID)

This note is hand-authored and unsealed. **Every figure here comes from a pre-registered window. Nothing was
estimated, and no void window was graded.**

**Pre-registration.** `probe/preregistration.txt`, committed as `386f8e6f`, with an erratum `536e2d5e` that changes
no rule. Both were committed on `grugops/qe-ABC-095` before the first window's first run (14:36:16Z). The
`ADR-0035` addenda A1 (`3017115c`) and B1 (`0fe43646`) are ancestors of both commits, so B1's order holds. QE was the
only grugops hop running.

**One global budget.** `probe/master.sh` ran 14:36:16Z–15:03:49Z against a 30-minute deadline of 15:06:16Z. Gate:
`secnfr-ABC-152-window/probe/gate.sh`, in place. It needs thermal 0 and no vitest runner process on 4 × 15 s samples.
load1 is logged, not gated. Machine: Apple M3 Mac15,13, Darwin 25.5.0 arm64, Node v26.11.0 (the reference stack), AC
power, low-power mode 0.

## `A2` and R3: window `t-w1`, CLEAN

- The gate passed at **14:37:16Z**. Readings ran 14:37:16Z–14:37:19Z.
- Before and after: load1 3.66 / 3.69, `thermalpressurelevel` 0, `pmset -g therm` with no warning recorded, AC power,
  and **no vitest** at either log.
- All 3 sampler rows in the interval are clean (no vitest, thermal 0, AC). The thermal-1 rows lie in the gate's
  settle, before the pass.
- The orphan `oeselg-labs/platform` process noted below started at about 14:38:29Z, after this window ended.
- The book is `H/data/opening-book/book.json`, sha256 `3802f52f…4bb41d`, the committed artifact.

| reading | instrument | n | min | median | max | bar | state |
|---|---|---|---|---|---|---|---|
| **`A2` cold hit** (the first `withBook(probe, stub)(start)` in a fresh process; the read and parse inside) | `probe/time-strict.ts` (QE's: nothing but imports, `newGame`, probe and stub before the timer) | 10 processes | 5.657 ms | 5.960 ms | **8.300 ms** | ≤ 30 ms | **MET** |
| `A2`, reported beside it | `wire-ABC-095/probe/time.ts cold-hit` (the SE's; warms `legalMoves` before the timer) | 10 | 5.201 | 5.385 | 7.139 ms | — | not graded |
| **R3 warm miss** (one warm-up hit, 200 timed `bookMove(P)`, P after 1. e4 e5 2. Ke2) | `wire-ABC-095/probe/time.ts warm-miss` | 3 processes × 200 | — | 0.0009 / 0.0008 / 0.0009 ms | **0.0081 / 0.0149 / 0.0102 ms** | max ≤ 5 ms | **MET** |

- R3's p99 values are 0.0069, 0.0070 and 0.0066 ms. Every hit reading shows `innerCalls` 0, `warned` 0 and a
  move. Every miss reading shows `warned` 0, `n` 200, and `P` out of book.
- **These are notes figures, never assertions** (test note 5). They hold on this machine only, and are
  `UNKNOWN - verify` elsewhere.
- They supersede nothing. The SE's `…a045086f` recorded NOT READ, which was correct for its 15 minutes.

## `N8-LANE`: two narrow sets against base `0974102f`, 650 ms CPU. **NOT READ on both**

Arms: B is `git archive 0974102f`, T is a `cp -R` twin of B (`diff -r` identical), and H is `git archive 2307fc11`.
The harness is `lane144b.mjs`, in place. n = 8 (9 rounds, round 0 discarded), rotated, `_DEEP` and `VITEST_` unset.
Round-0 counts were equal in all arms: S1 is 1 file / 69 tests, and S2 is 1 file / 1 test.

| window | set | gate pass → end | discarded rounds | why | state |
|---|---|---|---|---|---|
| `n8-cli-w1` | S1 `src/cli.test.ts` (F 0.100 s) | 14:46:28Z → 14:48:33Z | 8 of 8 | a **foreign grugops-kit vitest** (`npm exec vitest run --exclude **/scripts/e2e/** install/…`) appeared at 14:47:03Z: 15 of 23 sampler rows in the interval, rounds 2–8. Round 1 fell to the platform clause alone | **VOID** |
| `n8-cli-w2` (the one re-attempt) | S1 | 14:54:22Z → 14:56:25Z | 8 of 8 | foreign vitest in 18 of 23 rows, rounds 2–8; round 1 to the platform clause | **VOID** |
| `n8-real-w1` | S2 `src/cli.real-engine.test.ts`, default lane (F = 16 % of B, provisional) | 15:02:14Z → 15:02:39Z | 8 of 8 | **the platform clause only**: 0 foreign-vitest rows in the interval | **VOID** |
| `n8-real-w2` (the one re-attempt) | S2 | 15:03:25Z → 15:03:49Z | 8 of 8 | the platform clause only | **VOID** |

- **No re-attempt is left, and no window is pooled. `N8-LANE` stays `UNKNOWN - verify` on both named costs.** The
  void TSVs are kept in `probe/windows/` and are not graded. **No "would have read" figure is computed.** Computing
  one would grade a window after it has been seen.
- **The platform clause, stated rather than bent.** This rule was registered verbatim from `qe-ABC-154`: any 5 s
  sampler row with an `oeselg-labs/platform` process voids the round. From about 14:38:29Z one such process stayed
  up: PID 63446, `node …/platform/repos/product-template/scaffolder/src/cli.ts create acme-crm --workspace …`, at
  **0.0 % CPU** (`ps`). It was still up at 15:09Z, about 30 minutes old. It belongs to another session, and I did
  not touch it.
  - **On S1 it changes nothing.** Rounds 2–8 are void on a foreign vitest anyway.
  - **On S2 it is the only cause.**
  - Whether an idle orphan should void a narrow-set round is a protocol question for Architect/Design, forward-only
    (`QE-095-i`). It is not re-ruled here.
- **What still holds by count** (decision 3: where a count exists, the count is the pin):
  - **New test files: 1.** `src/book-engine.test.ts`; the lane is 57 → 58 files.
  - **New default-lane spawns: 0.** `N8_SPAWN` stays pinned at 27, and the `ABC-119` default row spawns nothing.
  - **The default lane reads the book 0 times** (plant P12, in `…e11e8176`).
  - Filesystem writes are under `os.tmpdir()` only.
- **Not in either set** (stated in the pre-registration): `src/book-engine.test.ts`, the added file, is not read
  here. Decision 2 puts it in the narrow set against a placeholder base, and no hop has read its content cost
  (`QE-095-h`).
