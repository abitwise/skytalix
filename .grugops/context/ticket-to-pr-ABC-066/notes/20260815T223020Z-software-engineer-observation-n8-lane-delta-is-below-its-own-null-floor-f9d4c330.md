---
id: 20260815T223020Z-software-engineer-observation-n8-lane-delta-is-below-its-own-null-floor-f9d4c330
kind: observation
by: software-engineer
at: 2026-08-15T22:30:20Z
verified_by: 
confidence: medium
refs:
  - ABC-066
  - N8-LANE
  - NFR-008
  - plans/nfr-catalog.md
  - src/cli.test.ts
supersedes: 
---

# `N8-LANE` for `ABC-066` — **+70 ms median CPU, which is BELOW this session's own null floor**

Bar: **≤ 650 ms CPU**, inherited by name, on `plans/nfr-catalog.md`'s standing per-ticket row.
Instrument as that row words it: CPU (user + sys) of the default lane, `npm test`, `PERFT_DEEP`
unset; median of paired per-round deltas; n ≥ 7 interleaved rounds; condition order rotated every
round; one fresh OS process per run; round 0 discarded as warm-up; sign test reported beside the
median; admissible only with a `cmp`-verified identity null control reading ≤ 1.5 % with its sign at
chance.

Machine: **Apple M3, Darwin 25.5.0, Node v24.12.0, npm 11.7.0**.

## Conditions

- **A** — `main` @ `4e9ed1d`, a detached worktree, untouched.
- **B** — this branch's tree.
- **N** — the identity null control: a second worktree at `4e9ed1d`, verified byte-identical to
  **A** over `src/` by `diff -r` (clean) and by a per-file `cmp` sweep over all **50** `.ts` files.

Rotation, 8 rounds: `A B N`, `B N A`, `N A B`, `A N B`, `B A N`, `N B A`, `A B N`, `B N A`. Round 0
discarded, **n = 7** paired rounds analysed.

## Result

| condition | median paired delta vs A | as % of A | sign |
|---|---|---|---|
| **B − A — this ticket** | **+70 ms CPU** | **+0.60 %** | **5 / 7 positive** |
| N − A — identity null control | +100 ms CPU | +0.87 % | 4 / 7 positive |

Median lane CPU for **A**: 11.51 s. Per-round `B − A` deltas (ms):
`+140, −90, +70, +130, −100, +50, +230`.

**The ticket's measured delta is SMALLER than the identity null control's on the same run**, and the
null's sign is 4/7 — exactly chance. **The honest reading is that this ticket's lane cost is not
distinguishable from zero on this instrument**, bounded above by the noise floor, at **0.11 × the
650 ms bar**. `N8-LANE` is **MET** and **the row does not move**, which is what the ticket required.

**No floor subtraction and no spawn-account subtraction were taken, because neither is owed:**
**0 new test files** (so no 160 ms per-file floor) and **0 new child processes** (so nothing is
charged to `N8-SPAWN`). The figure above is the raw delta, undiscounted — the most conservative
reading available.

## Two honesty notes on these numbers, stated rather than smoothed

1. **The null floor this session (+0.87 %) is worse than the catalog's recorded floors** (−0.43 %,
   −0.52 %, −1.26 %; signs 3/8). It is still inside the row's ≤ 1.5 % admissibility clause, so the
   measurement is admissible — but it is a noisier session than the ones the catalog recorded, and
   the reason is known: three checkouts and a second agent hop (`ABC-065`'s Scribe) were live on
   this machine throughout. **A delta this small is being read against a floor this size; that is
   why the claim above is "not distinguishable from zero" and not a point estimate.**
2. **The absolute lane CPU here (11.51 s median) is inflated by that same contention** and is NOT a
   clean `NFR-008` total reading. The clean uncontended runs on this tree are the ones in the gate
   observation: **10.68 s CPU before the change, 10.77 s after**, both against the 13 s clause.
   Paired deltas are valid under contention because every condition pays it; absolute totals are
   not, and are not quoted as such.

`confidence: medium`, and deliberately so: the direction and the bound are solid, the point estimate
is not.
