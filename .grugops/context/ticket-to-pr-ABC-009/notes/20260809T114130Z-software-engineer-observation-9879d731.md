---
id: 20260809T114130Z-software-engineer-observation-9879d731
kind: observation
by: software-engineer
at: 2026-08-09T11:41:30Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - NFR-001
  - NFR-005
  - A10
  - plans/nfr-catalog.md
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - src/perft-bench.ts
  - src/moves.ts
supersedes: 
---

# `NFR-001` / `A10` measured — the first throughput figure taken on this ticket by anyone

**No role on this ticket had measured any throughput number before this.** Both Orchestrator notes and
both BA/PM notes say so explicitly, and the 6.04M–6.21M range in the ticket is **quoted from
`plans/nfr-catalog.md`**, which is the authority. Every figure below is this role's own.

**Machine:** Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64. **`UNKNOWN - verify` on any
other hardware.**

## Clause 1 — the floor. MET.

`npm run perft` on the delivered tree, three runs:

```
6,078,622 nodes/sec   (11,377,922 nodes in 1.872 s)
6,131,325 nodes/sec   (11,377,922 nodes in 1.856 s)
6,151,559 nodes/sec   (11,377,922 nodes in 1.850 s)
```

**6.08M–6.15M nodes/sec against the ≥ 1,000,000 bar — about 6.1x, MET.** The range sits inside the
catalog's standing 6.04M–6.21M, so nothing here indicts the baseline either.

## Clause 2 — the ratio, in one process. MET on two independent samples.

The bar is the machine-independent one BA/PM's correction 6 installed: **the ratio to the same
measurement on the pre-fix tree in the SAME process, ≥ 0.98**.

**Protocol**, following `plans/nfr-catalog.md`'s standing benchmarking caution rather than quoting it:
three trees imported into a **single** process — the **pre-fix** tree (`main`'s `src/`, `moves.ts` at
`fb4fa40934e768dffeaeed0b43548842`), the **delivered** tree, and a **byte-identical twin of the
delivered tree as a null control by identity** (all six files verified equal by md5). Seven rounds,
**tree order and cell order rotated every round**, one discarded warm-up round, medians of per-round
rates, node counts checksummed across every tree and round (**238,936,362** nodes, so nothing could be
optimised away and no tree could be silently mismatched), harness held outside the repository, and
**two fully independent samples** in their own processes, quoted separately and never averaged.

```
                       sample 1                    sample 2
cell         rights    post/pre   twin/post        post/pre   twin/post
position-3   -         1.0084     0.9991           1.0041     0.9937    <- structurally zero
position-6   -         0.9918     1.0053           0.9989     1.0055    <- structurally zero
kiwipete     KQkq      0.9930     1.0107           0.9967     0.9988
startpos     KQkq      1.0002     1.0080           0.9880     1.0126
position-4   kq        1.0003     1.0043           0.9949     0.9986
position-5   KQ        1.0026     1.0065           0.9981     1.0013

AGGREGATE              0.9987     1.0087           0.9974     0.9983
```

**Aggregate post/pre 0.9987 and 0.9974 against ≥ 0.98 — MET on both samples.** Worst single cell across
both, 0.9880 (startpos, sample 2), is also above the bar. Aggregate rates: pre-fix 6,368,198 and
6,371,927/sec; delivered 6,359,950 and 6,355,226/sec.

## The structurally-zero cell was read FIRST, and it is why no per-cell claim is made

The catalog's caution says to check a cell where the delta is structurally zero **before** believing the
cell you care about. Two cells qualify and they were chosen for that reason:

**`position-3` and `position-6` carry no castling rights at all**, and `makeMove` can only **clear** a
castling right, never create one (`src/apply.ts:142`, `position.castling &= ~(...)`). So the right-held
test at the top of `addCastlingMoves` fails at every node of those two subtrees, and **the two added
byte compares execute exactly zero times** anywhere in them. Their true ratio is **1.0000** by
construction.

They measured **1.0084, 0.9918, 1.0041, 0.9989**.

The identity twin — the same bytes as the delivered tree — read **1.0087 and 0.9983** aggregate and up
to **1.0126** on a single cell.

**So this instrument's own floor is about ±1% per cell, which is larger than any signal the change could
produce.** Two consequences, stated rather than smoothed:

- **The bar is met with margin, and the margin is larger than the resolution** — which is the strongest
  honest form of this result.
- **No per-cell regression or improvement is claimed from this instrument.** In particular the
  **kiwipete 0.9930** reading is *not* a 0.7% regression: it sits inside noise established by cells
  whose delta is provably zero and by a byte-identical twin. Reading it as a regression would be the
  same class of mistake `plans/nfr-catalog.md` has now recorded nine times.

## The denominator fence, carried rather than quoted

**97.3% of the nodes `npm run perft` counts are free leaves** (a leaf at depth 0 returns 1 without
generating). This figure is therefore *generation-with-free-leaves* and is **never** evidence for
`NFR-005`. Strip the free leaves and the same CPU-seconds yield ~167k generating nodes/sec, per the
catalog.

## `NFR-005` — not measured, and deliberately not measured

The ticket excludes it **structurally**: `zobristKey` → `hasLegalEnPassant` (`src/legal.ts:85-134`)
synthesises its own probe move and calls neither `generateMoves` nor `legalMoves`, so nothing this fix
does to the castling route can touch the per-node key cost. Re-read at the source here rather than
inherited. The ticket says *"do not re-run the key benchmark to 'confirm' it"* and **the key benchmark
was not run.**

## What did NOT happen to the catalog or the suite

- **`plans/nfr-catalog.md` was NOT edited.** It is Security/NFR's file, that role re-derives on its own
  instruments, and no target moved.
- **No wall-clock assertion was added to the test suite** — this project's standing rule
  (`src/zobrist.nfr.test.ts:112`). The figures live in the notes and the ticket, with their machine.
- **No `*.nfr.test.ts` file was added.** `NFR-001`'s three `gameStatus` bars are already pinned as spied
  assertions in `src/gameend.nfr.test.ts`, and this change adds no new call and no new allocation to
  that path; a throughput assertion would be a test that passes or fails on the machine that runs it.

## What this note does NOT establish

- **That the 6.04M–6.21M baseline still holds as a standing figure.** My three `npm run perft` runs land
  inside it, which is consistent with it, but one machine on one afternoon does not re-establish a
  five-run baseline. The ratio form is what makes that question moot, which is exactly why the bar
  carries it.
- **Any figure for non-M3 hardware.** `UNKNOWN - verify`, per the ticket and the catalog.
- **The gate's verdict.** Security/NFR owns the `NFR-001` discharge on its own instruments; this is the
  engineer's measurement, labelled as such, and it is offered to be re-derived rather than inherited.
- **Anything about allocation.** Not measured. The change adds two `Uint8Array` index reads and one
  integer local per call; no allocation figure was taken and none is claimed.
