---
id: 20260919T105000Z-software-engineer-observation-n8-lane-55-ms-net-met-nfr-008-base-16-920-tip-17-300-both-over-15-s-adr-0019-trigger-a-3e7f1a29
kind: observation
by: software-engineer
at: 2026-09-19T10:50:00Z
verified_by:
confidence: high
refs:
  - ABC-034
  - NFR-008
  - N8-LANE
  - N8-SPAWN
  - ADR-0019
  - ADR-0014
  - plans/nfr-catalog.md
  - src/rejection.test.ts
supersedes:
---

# `N8-LANE`: **+215 ms gross, +55 ms net — MET (≤ 650 ms).** `NFR-008` CPU: **base 16.920 s, tip 17.300 s, BOTH over 15 s** in this session — `ADR-0019` revisit trigger (a) fires on the reading; handed up, nothing trimmed or moved

**This is not a stamp.** Hand-authored `observation`. Confidence `high` on the paired delta and the
null control; the absolute lane figures are load-sensitive and reported with their load.

## Instrument — the row's own protocol, three conditions

Contained lane `npx vitest run --dir src`, `/usr/bin/time -p`, CPU = user + sys, one fresh OS
process per run, **9 rounds, round 0 discarded, n = 8**, order rotated every round over three
conditions: **A** = base `grugops/wave-2026-09-19` @ `4f0ef01` (40 files / 1213 tests), **T** =
ticket tip `6ee7cde` (41 / 1266), **N** = byte-identical twin of T (identity null control). Every run
asserted its own file and test count; **27 of 27 `ok`**. Copies were `rsync -a` of the worktree
(excluding `.git`, `node_modules`, `coverage`, `.claude`), outside the repository; A's two changed
files were restored from the base and verified by **blob hash** against `4f0ef01`
(`git hash-object` = `git rev-parse 4f0ef01:<path>`: `49c6a642…`, `869823ec…`), A's two added
files removed; `/usr/bin/diff -rq` A↔T lists exactly the four files, T↔N is empty. `node_modules`
symlinked into each copy (the inherited deviation every lane reading here carries). Harness as text,
raw TSV, load log and summary sit beside this note. Machine: Apple M3, 8 logical cores, Node
v24.12.0, vitest 3.2.7 — `UNKNOWN - verify` elsewhere.

## The numbers (rounds 1–8)

```
condition medians, n = 8            CPU (user+sys)       WALL
A  base  4f0ef01   40/1213            16.920 s          4.255 s    range 16.62-17.29
T  tip   6ee7cde   41/1266            17.300 s          4.320 s    range 16.84-17.38
N  twin of T       41/1266            17.230 s          4.320 s    range 16.80-17.47

IDENTITY NULL CONTROL  N-T per round CPU (s):  -0.04 +0.09 -0.09 -0.10 +0.19 -0.19 +0.13 +0.01
                       median -15 ms = -0.09%, sign 4/8  ->  <= 1.5%, sign at chance: ADMISSIBLE
                       (recorded before any figure was compared to a level)

TICKET CHARGE          T-A per round CPU (s):  +0.15 +0.40 +0.58 +0.61 +0.13 +0.18 +0.25 +0.05
                       median +215 ms = +1.27% of base, sign 8/8  ->  an effect exists
                       net of the 160 ms per-file floor x 1 file:  +55 ms

N8-LANE  <= 650 ms   ->   55 ms net (215 ms gross)  =  8.5% (33%) of the bar     <- MET
N8-SPAWN             ->   0 ms: no child process added; the harness ran outside the repo

NFR-008 CPU <= 15 s  ->   base 16.920 s = 112.8%  |  tip 17.300 s = 115.3%      <- OVER at BOTH
NFR-008 WALL <= 3 s  ->   4.255 s / 4.320 s                                       <- DATA ONLY, NOT A VERDICT (ABC-111)
```

**What the ticket owns of that: +215 ms gross, and the file it added is the whole of it** (the
`A2` corpus property is two tests of a few ms; the file's 53 tests ran in 22 ms in-tree). The
ticket's own cut estimate was ≈ 160 ms (one file at the floor); the measurement is 215 ms — 55 ms of
content, which is `A2`, `A5`'s nine frame assemblies and the fixture parses.

## The level, and why the base is over it too

`ADR-0019` measured the SAME base shape (40 / 1213) at **14.940 s** on 2026-09-19 at 1-min load
4.0–7.5. This session read it at **16.920 s** at 1-min load **6.7–18.7** (median 14.1 — sibling
hops of this wave live on the machine; how many is `UNKNOWN - verify`). That is +13% on an
unchanged tree, well past the instrument's stated load sensitivity (+1.1% / +1.63%); the reading is
load-driven and the paired design is what keeps the ticket's delta meaningful inside it (null
−0.09%). **It is nonetheless a conforming reading (n = 8, rotated, round 0 dropped, null ≤ 1.5% at
chance, counts asserted) with median CPU > 15 s at named commits — which is the letter of
`ADR-0019` revisit trigger (a).** `ADR-0019` decision 4 said to expect exactly this on the next
ticket that adds a test file; its consequences said not to treat it as news needing a fresh
escalation, and the sized remedy is QE's `OPT-1` (`engine.test.ts` + `perft.test.ts` behind an
opt-in lane, 2.550 s, 12 criteria — `ticket-to-pr-ABC-110-a1a4-2026-08-20`).

**Per the subtask's rule: NOTHING was trimmed, no assertion softened, no file moved to an opt-in
lane. This is handed up as trigger (a), with the delta beside it, for the owner's call.** The
honest sentence for the trace, in the catalog's standing form: **`N8-LANE` 55 ms net, MET; `NFR-008`
CPU clause OVER at the tip (17.300 s) AND at the base (16.920 s) under this session's load —
verdict is the owner's under `ADR-0019` (a)**. A quieter-session re-read (`ABC-111`'s protocol) is
the thing that separates "the lane grew past 15 s" from "the machine was busy"; on this session's
own numbers the base would have to lose ~1.9 s to be under, and this ticket's 215 ms is not the
difference either way.

## Not measured, so nobody reads it in

No cooled series; no second session; no `isolate: false` (forbidden); no per-file removal; the
in-tree single run at `6ee7cde` (17.54 s CPU) ran concurrently with `PERFT_DEEP` and is discarded.
