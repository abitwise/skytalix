---
id: 20261017T131800Z-security-nfr-observation-abc096-timing-a4-nfr007-window-w1-clean-8d3f6c15
kind: observation
by: security-nfr
task: secnfr-ABC-096
at: 2026-10-17T13:18:00Z
verified_by:
confidence: high
refs:
  - ABC-096
  - ABC-095
  - NFR-002
  - NFR-007
  - NFR-008
  - QE-096-d
  - ADR-0035
  - ADR-0043
  - AR-096-DISKCOLD
  - 20261012T151000Z-qe-e2e-observation-abc095-timing-a2-r3-n8-lane-3283096f
  - 20261017T124700Z-qe-e2e-decision-abc096-verdict-pass-with-gaps-e5a80c37
supersedes:
---

# `ABC-096` timing (`QE-096-d`): window w1 CLEAN. `A4` **MET** (max 0.447 ms < 16 ms). `NFR-007` first call **MET** (max 6.047 ms ≤ 30 ms, cold, in a real `npm run chess` child). `NFR-007` end to end **MET** (max 222 ms < 2 s)

Hand-authored and unsealed. **Every figure here comes from one pre-registered, clean window. Nothing was estimated.**
The raw files are in `../probe/windows/w1/`. The readout output is `readout.out.txt` there, from
`python3 -I probe/readout096.py`.

**Pre-registration.** `probe/preregistration.txt`, committed as `92b73c49` at 13:03:31Z on
`grugops/ABC-096-opening-name`. Its instruments are named by sha256, and `once.txt` re-hashes them at the window: all
equal. The commit came before the gate started (13:03:40Z) and before the first timed run (13:13:03Z). `ADR-0035` A1
(`3017115c`) and B1 (`0fe43646`) are its ancestors. Before the commit, only `SMOKE=1` runs were made, and those print no
timing figure. The readout's self-test ran on synthetic rows.
- **Erratum, changes no rule:** the header says "Written … ~13:10Z". It was written and committed by 13:03:31Z.

**The window.**
- **Gate** (`probe/gate096.sh`: thermal 0, 0 vitest, 0 `oeselg-labs/platform`, 4 × 15 s):
  - started 13:03:40Z, blocked by a foreign grugops-kit vitest (4–5 processes) until 13:12:02Z;
  - **passed at 13:13:03Z.**
- **Readings:** 13:13:03Z–13:14:00Z. `utc_end` 13:14:03Z.
- **Sampler:** 27 rows at 2 s from `gate_pass` to `utc_end`. Every row has vitest 0, platform 0, thermal 0 and low-power
  mode 0, on AC power. load1 4.52–5.17 (logged, not gated).
- **Per-run lines:** the before and after lines of all 100 runs (200 lines) read vitest 0, platform 0 and thermal 0.
- **Power:** the host was on battery until 13:12:18Z, inside the gate's settle. The whole reading interval was on AC.
  Power was pre-registered as logged and not a void.
- **Post-window.** At 13:14:46Z a re-check read 0 foreign runners. An earlier snapshot read "vitest 4", but that was
  a self-match: the snapshot's own command line held the word. `probe/windows/w1/post-window.txt` records both.
- **No `src/cli.ts` child was left running** (0 at 13:14:35Z).
- **Machine:** Apple M3 Mac15,13, Darwin 25.5.0, macOS 26.5.2, Node v26.11.1, npm 11.20.0.
- **Arms:** H = `git archive c11bfec8`, whose production bytes equal `a48da51c`. B = `git archive 6edadcf0`.
  `book.json` sha256 `3802f52f…` in both, which is the committed artifact.
- **Validity:** 0 void conditions. Every reading's checks passed:
  - 23 rows, the expected row-1 text, no `more)` marker and no lone surrogate;
  - exit 0, 0 stderr bytes and ASCII-only output on every child;
  - every first-call line is `openingName` with 1 read inside it.

## T1: `A4` and `NFR-002` (< 16 ms per frame): MET on all six cases

10 fresh processes per case. The timed span is the seam call alone. "First" is the first call in the process (cold JIT);
"warm" is 200 calls after it.

| case | what | first frame, min / median / max | warm max, max of 10 | warm median | state |
|---|---|---|---|---|---|
| `a4-ascii` | **`A4`**: "x" × 100,000, ascii | 0.344 / 0.353 / **0.372 ms** | **0.447 ms** | 0.017–0.020 ms | **MET** |
| `a4-unicode` | **`A4`**: the same, unicode | 0.341 / 0.351 / **0.362 ms** | **0.294 ms** | 0.018–0.019 ms | **MET** |
| `a4-astral` | **`A4`**: `U+1D11E` × 100,000 code points (200,000 units), unicode | 0.386 / 0.420 / **0.441 ms** | **0.263 ms** | 0.023–0.025 ms | **MET** |
| `x-sep` | Security/NFR's: 100,000 chars of `"a: "` (split-heavy), ascii | 0.857 / 0.872 / 0.925 ms | 0.799 ms | 0.477–0.488 ms | MET |
| `x-max` | Security/NFR's: "x" × 1,048,576 (`BOOK_MAX_BYTES`), ascii | 0.439 / 0.466 / 0.517 ms | 0.268 ms | 0.034–0.035 ms | MET |
| `x-real` | Security/NFR's: the real probe, shipped book, `Ruy Lopez`, unicode | 0.616 / 0.645 / 1.057 ms | 1.861 ms | 0.054–0.057 ms | MET |

- **`A4`'s `< 16 ms` is MET.** The worst `A4` reading is 0.447 ms, which is 2.8 % of the budget.
- **The unbounded parse-side length does not matter for the frame.** The largest name a parse-admitted book could carry
  (1 MiB) costs a warm median of 0.035 ms. The split-heavy shape is the costliest per frame, at about 0.48 ms, because
  `name.split(": ")` builds about 33,000 strings. That is 3 % of the budget. **Nothing is raised.** A tighter split
  (`indexOf` on the first `": "`) would be an optimisation with no budget reason behind it.
- **The real probe frame** (warm median 0.054–0.057 ms) is the SE's ≤ 0.06 ms, read independently. The 1.861 ms warm
  max is one outlier in 2,000 calls (p99 ≤ 0.462 ms), consistent with a GC pause.

## T2: `NFR-007`, on a real `npm run chess` startup path

10 rounds. Each round runs (a), (b), (c) and (d), in that order. Each child is `npm run --silent chess -- --colour white --ascii`, and is sent
`quit` twice after frame 0.

| series | measured | n | min / median / max | bar | state |
|---|---|---|---|---|---|
| **(a) H + `first-call-hook.mjs`** | the probe's **first call**, which is `openingName` in frame 0, with the read and parse inside. This is ticket § NFR triggers' "first call … ≤ 30 ms cold" | 10 | 5.223 / 5.587 / **6.047 ms** | ≤ 30 ms | **MET** |
| (a), beside it | the `read` alone inside that call | 10 | 0.107–0.163 ms | — | reported |
| (a), beside it | spawn to frame 0 with the hook loaded | 10 | 203.2 / 209.8 / 244.3 ms | — | reported |
| **(b) H, no hook** | spawn to frame 0 whole on stdout (23 newlines). This is `NFR-007`'s "to first rendered board" | 10 | 201.8 / 210.8 / **222.1 ms** | < 2,000 ms | **MET** |
| (c) B, no hook | the same at the base, where frame 0 reads no book | 10 | 192.4 / 202.6 / 213.7 ms | — | reported, **not a charge** |
| (d) H replica, in process | frame 0 with the load inside, in the composition root's order | 10 | 5.485 / 5.620 / 7.594 ms | — | reported |

- **The first call is `openingName` in every one of the 10 children, with exactly 1 read inside it.** That is
  `ADR-0043` D7 observed on the live path: the load has moved to just before frame 0.
- **The parse dominates the read.** The read is about 0.1–0.16 ms (page cache warm), and the call is about 5.2–6.0 ms.
  This matches the Architect's 6.4–6.9 ms (`ADR-0043`) and QE's `ABC-095` `A2` max of 8.300 ms.
- **(b) − (c) is not graded.** The medians differ by +8.2 ms, but there is no twin and no R (`ADR-0035` decision 1), so
  this is context and not a charge. It agrees in size with the moved parse.
- **"Cold" means the first call in a fresh process** (`ABC-095` `A2`'s amended Given), and that is what was read.
  **A disk-cache-cold read was NOT READ.** Purging the page cache needs `sudo purge`, which this hop does not run.
  - The Architect's one 24.4 ms run (`ADR-0043`) is the only disk-cold figure on record. It is 81 % of the bar, from a
    single run.
  - It stays `UNKNOWN - verify`, recorded as `AR-096-DISKCOLD` in the decision note.
- **`NFR-007`'s `< 2 s`.** The reading is on an archive copy with no `node_modules`. `npm run chess` is `node src/cli.ts`,
  which has no runtime dependency, so that copy is a completed clone for this purpose.
  - This is the first end-to-end `npm run chess` reading this row has had, on this machine.
  - The catalog row still reads `UNKNOWN - verify`. Recording the reading there belongs to the row's catalog hop; this
    brief scopes this hop to notes, the page and one trace row. **Owed:** the `NFR-007` row's next catalog edit cites
    this note.

## `NFR-008`: held by count, not timed

- 0 new test files (58 → 58, QE) and 0 new spawns (`N8_SPAWN` 27 unchanged). That is the page's target, and the count
  is the pin (`ADR-0035` decision 3).
- No `N8-LANE` bound was cut on this ticket, and the brief asks for none. **The content cost of the +12 rows in
  `src/render-seam.test.ts` was not read.** It is `UNKNOWN - verify`, and no figure is estimated here.
