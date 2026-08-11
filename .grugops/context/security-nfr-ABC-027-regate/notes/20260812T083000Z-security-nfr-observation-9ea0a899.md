---
id: 20260812T083000Z-security-nfr-observation-9ea0a899
kind: observation
by: security-nfr
at: 2026-08-12T08:30:00Z
verified_by:
confidence: high
refs:
  - security-nfr-ABC-027-regate
  - security-nfr-ABC-027
  - ABC-027
  - ABC-016
  - ABC-018
  - NFR-002
  - NFR-007
  - NFR-008
  - N8-LANE
  - plans/nfr-catalog.md
  - src/frame.ts
  - 20260811T234500Z-security-nfr-observation-b5d29e17
supersedes:
---

# `NFR-002` RE-DERIVED AT `+69` AND MET WITH ~3,000x HEADROOM; `NFR-007`, `N8-LANE` AND `NFR-008` MET; THE CATALOG IS BYTE-IDENTICAL TO `main` AND NO ROW IS OWED — **AND THE INSTRUMENT CHECK THIS BRIEF ASKED FOR DID NOT REPRODUCE, WHICH IS REPORTED RATHER THAN SMOOTHED**

> **Hand-authored** — `scripts/context-io.ts` absent from this repository and from the kit,
> `mcp__grugops__propose_note` not in this session's tools. **`observation`, not a `finding`;** no
> stamp is issuable to me and none is self-attested.

## 0. The baseline, re-run rather than inherited — and the Orchestrator's figure is RIGHT this time

The brief asked me to re-run it because a wrong number has appeared in a brief on three consecutive
hops. Measured on this worktree, tree clean, tip `b9d8bb2`:

| what | brief said | measured here |
|---|---|---|
| tests | 717/717 on 24 files | **717 passed (717), 24 test files** |
| skip | 0 | **0** — `numPendingTests` 0 + `numTodoTests` 0 via `--reporter=json` |
| lint | 0 | **exit 0**, 43 files, 0 errors, 0 warnings, **2 infos** (pre-existing `biome.json` deprecation notices, untouched by this branch) |
| typecheck / build | 0 | **exit 0** / **exit 0** |

**The brief's figure is correct in every cell.** *(Guard the `RF-1` hop recorded and I re-hit:
`--reporter=json` reports `numTotalTestSuites: 129`, which is the `describe` count, NOT the file
count. The 24 is `ls src/*.test.ts | wc -l`, counted.)*

## 1. The emission, counted from the REAL writer

| emission | chars | `\x1b[K` | `\x1b[0J` | `\x1b` | delta vs un-cleared |
|---|---|---|---|---|---|
| un-cleared (merged, `main`) | **425** | 0 | 1 | 2 | 0 |
| old delivered (erase AT the margin) | 491 | 22 = `H − 1` | 1 | 24 = `H + 1` | 66 |
| **shipped `RF-1` (erase at COLUMN 0)** | **494** | **23** = `H` | **1** | **25** = `H + 2` | **69** = `H × 3` |

**The Engineer's figure reproduces exactly on my own generator, in BOTH glyph modes**, and the delta
is content-independent: 69 at `W` = 18 and 69 at `W` = 37 (843 → 912). `+69`, not the `+66` I
measured on the old shape.

## 2. THE INSTRUMENT CHECK FAILED TO REPRODUCE — stated first, because it is the thing a reader must know before reading any microsecond below

The brief asked me to reproduce `ABC-018`'s gate figures again as an instrument check, as my previous
cell did. **It did not reproduce.** For the same quantity (the merged writer to a regular file):

| source | merged → regular file | `assembleFrame` compute |
|---|---|---|
| `ABC-018`'s gate | 2.711 – 2.772 µs | 5.978 – 6.137 µs (a different decomposition; not comparable) |
| my FAIL-hop cell (2026-08-11) | **2.766 / 2.768 µs** — reproduced | 3.449 / 3.416 µs |
| **this hop** | **2.209 / 2.214 / 2.230 / 2.238 µs — BELOW the band** | **2.706 / 2.712 / 2.717 / 2.772 µs** |

**The shift is uniform across every cell, which is its signature**: merged→file 1.245x, compute
1.252x, merged→`/dev/null` 1.352x, in-memory 1.247x. Two controls were run before writing this down:
a six-cell harness matching the FAIL hop's exact cell set reproduced the seven-cell numbers (so the
cell set is not the cause), and the machine is on AC power with no thermal or performance warning
recorded. **The cause is `UNKNOWN - verify` and I am not inventing one.** What I will say is the
consequence:

> **Absolute microsecond figures on this board are not comparable across hops without a same-session
> paired baseline.** Every conclusion below rests on a PAIRED delta measured inside one process in
> the same rounds, which is unaffected by a whole-machine scale factor — and that is why the verdict
> does not move. **A future gate that compares its absolute number to a note's absolute number, with
> no same-session baseline beside it, will draw a wrong conclusion.** *(This is offered as a
> measurement about the instrument, not as a re-derivation of any bar. No bar is touched.)*

## 3. `NFR-002` — the `< 16 ms` per-frame bar. MET.

Own harness outside the repository, own process, `parseFen` / `renderBoard` hoisted out of every
clock, the frame and the writer built ONCE outside it, round 0 discarded, **11 rounds x 2,000
iterations per cell, cell order ROTATED every round, medians of per-round means, a character checksum
kept against elision, a `write` counter, and independent samples in separate processes.** The
pre-`ABC-027` expression and the FAILED `+66` shape were both reconstructed and run as their own
cells in the same harness, so every delta is paired rather than compared across sessions. The
quantity is this row's own: **serialize + exactly ONE `write(2)` to a real non-TTY fd, judged against
the most expensive honest sink (a regular file)**.

### At the ticket's own denominator — `H` = 23, `W` = 18, **425 → 494 characters**

| cell | s1 | s2 | s3 (6-cell control) | s4 (6-cell control) |
|---|---|---|---|---|
| **shipped `RF-1` → regular file** | **2.3844** | **2.3648** | **2.3842** | **2.3922** |
| old (+66) → regular file | 2.3728 | 2.3803 | — | — |
| merged → regular file | 2.2141 | 2.2378 | 2.2085 | 2.2300 |
| shipped → `/dev/null` | 1.3115 | 1.3146 | 1.3196 | 1.3243 |
| merged → `/dev/null` | 1.2310 | 1.2341 | 1.2328 | 1.2278 |
| shipped → in-memory (a floor; omits the syscall the row's words require) | 0.5080 | 0.5120 | 0.5161 | 0.5036 |
| compute — `assembleFrame` ONLY | 2.7720 | 2.7121 | 2.7171 | 2.7064 |

**The 69 characters cost +0.127 to +0.176 µs on the write half (median ≈ +0.166) — about +7.5% of
the write, and 0.001% of the 16 ms budget.** Write + compute ≈ **5.09 µs = 0.0051 ms against 16 ms —
0.032%, about 3,100x headroom. MET.**

**And the three characters `RF-1` costs over the shape that failed: +0.012 µs and −0.016 µs — the
sign flips between samples, so it is BELOW this instrument's resolution.** The correctness fix is
free at this bar.

### At the wide fixture — `W` = 37, 843 → 912 characters

shipped → file **3.5516 / 3.3441**, old **3.3639 / 3.2815**, merged **3.3460 / 3.5647** (the
shipped−merged sign flips here too), compute **3.5810 / 3.5004**. Sum ≈ **6.99 µs = 0.0070 ms —
0.044%, about 2,290x headroom. MET.**

### Where this sits against the record

- **The compute half remains a LOWER BOUND and its basis has NARROWED since the FAIL hop.**
  `ABC-016` has MERGED, so `src/status-panel.ts` is real code on `main` with its own suite
  (`src/status-panel.test.ts`, `src/status-panel.nfr.test.ts`). The history pane is still absent.
  `assembleFrame` takes `readonly string[]` (`src/frame.ts:194`), so **its own cost is
  panel-independent by construction** — what is unbounded is the CALLER's cost of producing panel
  rows, which belongs to those tickets. See `AR-4`.
- **The one way this bar can be busted is still an unbounded supplied string**, recorded at
  `ABC-018`'s gate with owner **BA/PM at `EPIC-003`**, and `ABC-027` does not touch it: `W` is a max
  over panel rows and `sanitize` strips but does not truncate, so a long enough panel row widens `W`
  and grows the frame. The writer's cost is linear in the frame's characters.
- **I did not import `src/status-panel.*` even read-only**, because the brief's limit names those
  paths; the narrowing above is established from what is on `main` and from `assembleFrame`'s
  signature, not from a measurement of that module.

## 4. `NFR-007` — one `write()` per frame. Verified on this gate's own counter.

**132,000 frame writes, 132,000 `write` calls — exactly 1 per frame**, across six sink cells over 11
rounds, per sample. The single-write constraint is untouched by `RF-1`, as `A1` asserts.

## 5. `N8-LANE` — MET, at zero within the instrument's resolution, with an ADMISSIBLE null control

Protocol taken from the catalog's `N8-LANE` block (`plans/nfr-catalog.md:823-850`) rather than
invented: CPU (user + sys) of the default lane, `npm test` with `PERFT_DEEP` unset, n ≥ 7 interleaved
rounds, condition order ROTATED every round, one fresh OS process per run, round 0 discarded, median
of PAIRED per-round deltas with the sign reported, and an IDENTITY NULL CONTROL. `/usr/bin/time -p`,
three out-of-tree trees (`pre` = `main`'s `src` by `git archive`, `post` = the shipped tree,
`twin` = a copy of `pre`), `node_modules` symlinked.

*(Instrument trap re-hit and re-avoided: redirecting the whole `/usr/bin/time` invocation's stderr
discards `time`'s own output as well as the command's. The command must be wrapped —
`sh -c '… >/dev/null 2>&1'` — so only its stderr is dropped.)*

**Tree identity verified before any round: `twin` byte-identical to `pre` by `diff -r` (exit 0) and
by per-file md5 aggregate `00b7ada18962faa9afe9b84f47327516` on both; `post` differs from `pre` in
exactly two files — `src/frame.ts` and `src/frame.test.ts` — and in nothing else.**

**ZERO test files were added, MEASURED rather than declared: 24 test files and 39 `.ts` files in all
three trees**, and `git ls-tree main src/` counts the same 24. So `N8-LANE`'s floor allowance is
**0 ms** (nothing to subtract at 160 ms per added file) and only the ≤ 650 ms content allowance
applies.

| sample | condition | median paired CPU delta vs `pre` | as % of the `pre` lane | sign |
|---|---|---|---|---|
| 1 (n = 8) | **post (shipped)** | **−5 ms** | −0.06% | 3/8 positive — chance |
| 1 (n = 8) | twin (identity null control) | −80 ms | −0.98% | 2/8 positive |
| 2 (n = 7) | **post (shipped)** | **+30 ms** | +0.38% | 4/7 positive — chance |
| 2 (n = 7) | twin (identity null control) | −20 ms | −0.26% | 2/7 positive |

**Against `N8-LANE`'s ≤ 650 ms CPU: MET.** Two independent samples bracket zero (−5 ms and +30 ms);
the larger of the two is **4.6% of the allowance** and its sign is at chance. Both null controls sit
inside the ≤ 1.5% admissibility floor with their signs at chance, consistent with the floors the
catalog already records (−0.43%, −0.52%, −1.26%; signs 3/8) — **so the harness is admissible rather
than merely quiet.** The bar was NOT re-derived and `NFR-008` was NOT re-opened.

## 6. `NFR-008` — the lane total. MET on the admissible sample, and sample 1 is recorded as INADMISSIBLE with its reason

`NFR-008` binds `≤ 3 s wall` **AND** `≤ 13 s CPU`, each the median of ≥ 7 interleaved runs.

| sample | condition | wall median | CPU median |
|---|---|---|---|
| **2 (admissible)** | **post** | **1.63 s (54% of 3 s) — MET** | **7.87 s (61% of 13 s) — MET** |
| 2 (admissible) | pre | 1.63 s | 7.84 s |
| 1 (INADMISSIBLE for the wall total) | post | **3.075 s — over the 3 s clause by 2.5%** | 8.365 s — MET |
| 1 | pre | 2.92 s | 8.18 s |
| 1 | **twin — byte-identical to `pre`** | **3.045 s** | 8.16 s |

**Sample 1 cannot adjudicate the wall clause and says so on its own instrument: the IDENTITY NULL
CONTROL differs from `pre` by 0.125 s = 4.3%, larger than the 2.5% the reading sits over the bar,
and the within-sample range on identical trees is 1.57 s – 3.25 s.** The machine's 1-minute load
average ran 5.26 → 19.31 → 20.64 across my runs; other agents are live on this host by the brief's
own account. **The honest statement is that sample 1's wall figures measure the machine, not the
branch** — and the branch is not implicated either way, because `pre` (which is `main`, without this
ticket) sits at 2.92 s in the same sample.

**One item is carried forward and it is NOT this ticket's** (see `AR-5` in the decision note):
`NFR-008`'s wall clause has become tight on `main` itself now that `ABC-016` has merged and the lane
is 717 tests. Nothing here re-derives that bar — the catalog is explicit that a gate does not move it.

## 7. `plans/nfr-catalog.md` — byte-identical to `main`, verified by hash, and NO row is owed

`git diff --stat main...HEAD -- plans/nfr-catalog.md` is **empty**, and the file's md5 is
**`96f0518d2f5ff0d9120225f143a3a4a8` on both `HEAD` and `main`.** No row was added, deleted,
re-derived, loosened or re-worded by this ticket, and this gate seeded none either — `+66 → +69` is
three characters on a change already measured at 0.001% of budget.

**A correction to my own FAIL-hop record, offered rather than hidden:** that note gives the catalog's
md5 as `975005524024a3bcd87378cc364fd3b7` "on both sides". That was true when measured — and `main`
has since moved (`799adbf`, the `ABC-016` gate, edited the catalog), so the hash no longer matches.
**The old figure is not corrected in place**, on exactly the principle the `RF-1` hop applied to my
`+66` measurements: a gate's record states what it measured, and a hash of a moving branch tip is
stale by design rather than wrong. Today's value is recorded here, beside it.

The branch's whole diff against `main` is **`src/frame.ts`, `src/frame.test.ts`,
`plans/traceability.md`, `plans/tickets/ABC-027-frame-writer-clears-each-row.md`, and context/queue
records.** No other file.
