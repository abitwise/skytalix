---
id: 20260812T122000Z-qe-e2e-observation-the-kill-matrix-fourteen-builds-7f012309
kind: observation
by: qe-e2e
at: 2026-08-12T12:20:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A2
  - ABC-028-A3
  - ABC-028-A4
  - RISK-ABC028-01
  - RISK-ABC028-02
  - RISK-ABC017-01
  - ABC-017-A9
  - ABC-017-A11
  - ABC-017-A14
  - src/history-pane.ts
supersedes:
---

# The kill matrix — fourteen builds run against the delivered 750, every cell executed

> **Hand-authored, no stamp.** Nothing here is reasoned. Each build is the delivered
> `src/history-pane.ts` text plus **exactly one anchored edit**, the anchor asserted **unique**
> before substitution and the source md5 checked against `54fd4346dcc1a0060c4e66ae0149265d` first.
> Every build was **output-identity checked BEFORE its suite verdict was taken seriously** — a build
> that changes rendered output is not a survivor and proves nothing.

## Output identity, checked first at twelve fixtures

`A1`'s ten lengths (`0/1/3/19/20/40/80/120/300/2000`) plus the 20- and 21-ply black-anchored
windows. Digest of every rendered byte, plus a before/after digest of the caller's whole graph:

**All builds below render `c9faa3ec869bc4d272ca9eff0403e078` — byte-identical to the delivered
pane — and restore the caller's graph**, with the single intended exception of `WLEAD-ODD`, which
differs exactly at the 21-ply black-anchored window that is `A3`'s input class.

## The matrix

| # | build | new? | delivered suite (750) | killed by |
|---|---|---|---|---|
| 1 | `WPOSMID` | ticket | **1 failed / 749** | `ABC-028` `A4` |
| 2 | `WBOARDSET` | ticket | **1 failed / 749** | `ABC-028` `A4` (digest) |
| 3 | `WSPLICE` | ticket | **2 failed / 748** | `ABC-017` `A9` + `ABC-028` `A4` — stays dead |
| 4 | `WLEAD-ODD` | ticket | **1 failed / 749** | `ABC-028` `A3`, `expected '' to be 'Nc3'` |
| 5 | `WCACHE-LEN` | ticket | **3 failed / 747** | `A11` x2 (pre-existing) + `ABC-028` `A1` |
| 6 | `WCACHE` naive | ticket | **4 failed / 746** | `A11` x2 + `ABC-017` `A14` + `ABC-028` `A1` |
| 7 | `WBOARDBLIND` | ticket | **750 passed** | nothing — `RISK-ABC028-01`, re-run and still open |
| 8 | **`WCACHE-LAST`** | **MINE** | **2 failed / 748** | **`A11` x2 ONLY — nothing in `history-pane.test.ts`** |
| 9 | **`WPOSRAW`** | **MINE** | **750 passed** | **nothing** |
| 10 | **`WMOVEFIELDRAW`** | **MINE** | **750 passed** | **nothing** |
| 11 | **`WBOARDSUB`** | **MINE** | **750 passed** | **nothing** |
| 12 | **`WBOARDCACHED`** | **MINE** | **750 passed** | **nothing** |
| 13 | `WMOVESRAW` | MINE | **1 failed / 749** | `ABC-017` `A9`'s freeze — the honest negative |
| 14 | `WNOMAX` | MINE | **750 passed** | nothing — **equivalent mutant**, not a hole |

Plus **ten** further lanes for `A2`: each cache build × configuration (a) / (b) × `A1` present /
absent. Their verdicts are in the `A2` note.

## What the matrix says

- **The ticket's own builds behave exactly as recorded.** Items 1-7 reproduce the build hop cell for
  cell, on a harness written from the ticket's prose rather than from anyone's reproduction kit.
  **`A1`, `A3` and `A4` each kill their intended build and no other**, and `ABC-028`'s six `it`s add
  **zero** failures to any pre-existing test on any build.
- **Six new builds, five of them survivors.** Four are `A4` instrument-boundary probes (items 9-12);
  one is `WCACHE-LAST` (item 8), which is a different and more serious thing; one is an equivalent
  mutant (item 14) that no test can or should kill.
- **Item 13 is the honest negative** and I report it as prominently as the survivors: the descriptor
  escape is **closed** for the `moves` array contents — by `A9`'s freeze, not by `A4`.
- **Item 8 is the one that is not an instrument-boundary curiosity.** Every other survivor mutates
  the caller's graph invisibly, which is a property the criteria openly admit they cannot fully hold.
  `WCACHE-LAST` shows the player a **wrong move list** on a public-API path, and is caught only by an
  accident the tree now documents as removable.

## Zero code defects, and the fence held

**`src/history-pane.ts` is md5 `54fd4346dcc1a0060c4e66ae0149265d` — unchanged — and the delivered
pane is CORRECT on every one of the fourteen inputs**, including the redo path that breaks
`WCACHE-LAST`. **Every survivor above is a gap in what a criterion ASKS, not a defect in what the
pane DOES**, which is this ticket's own thesis holding for the fifteenth time.

**I do NOT certify that fourteen is the complete set of wrong builds** — the same limit the build hop
declined to claim for twelve, and `ABC-023`'s QE hop found fourteen where its ticket predicted two.
