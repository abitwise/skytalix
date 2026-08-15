---
id: 20260815T164400Z-software-engineer-observation-lane-delta-at-the-null-floor-and-perft-deep-ruled-3ad20f6e
kind: observation
by: software-engineer
at: 2026-08-15T16:44:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - B1
  - N8-LANE
  - NFR-008
  - G1
  - PERFT_DEEP
  - src/cli.test.ts
  - src/perft.test.ts
supersedes: 
---

# The lane delta of this hop (at the null floor), and the `PERFT_DEEP` ruling

## `N8-LANE` — zero new spawns by construction, and a treatment indistinguishable from the null

**The hard limit was "any implementation that adds a spawn is the wrong implementation". This one adds
none, and it is proved mechanically, not argued:** both changed rows are **unit calls** into
`resolveOptions`, the suite still spawns exactly **ten** children (`spawned === 10` and
`Object.keys(CHILDREN).length === 10`, both green), `spawnSync` is still the only name taken from
`node:child_process` and still has **exactly one call site**. The `S2` repair reuses the child bar 3
already had — it changes how the captured stream is read, not how it is produced.

**By measurement, because "by construction" is an argument and this ticket is about instruments.**
Paired, order-rotated per round, round 0 discarded, n = 7, CPU = `user + sys` from `/usr/bin/time -p`
over the whole `npx` process tree — `N8-LANE`'s own instrument, not wall. `PERFT_DEEP` unset. An
instrument guard proved which variant was on disk before each timed run.

| condition | what it is |
|---|---|
| **A** | my tip's `src/cli.test.ts` — the 138-case family, the draw budget, `S2`, `S3` |
| **B** | base `59ea767`'s `src/cli.test.ts` — the old 18, the unbounded loop, the line-0 proxy |
| **N** | a byte-identical rerun of **A** — the **identity null control** |

| round | A | B | N | dTreat (A−B) | dNull (A−N) |
|---|---|---|---|---|---|
| 0 *(discarded)* | 2480 | 2440 | 2460 | 40 | 20 |
| 1 | 2550 | 2400 | 2440 | **150** | 110 |
| 2 | 2500 | 2440 | 2480 | **60** | 20 |
| 3 | 2460 | 2450 | 2440 | **10** | 20 |
| 4 | 2510 | 2469 | 2430 | **41** | 80 |
| 5 | 2430 | 2450 | 2460 | **−20** | −30 |
| 6 | 2450 | 2430 | 2470 | **20** | −20 |
| 7 | 2450 | 2480 | 2450 | **−30** | 0 |

```
median dTreat  =   20 ms CPU  (0.81% of A)   sign 5/7 positive
median dNull   =   20 ms CPU  (0.81% of A)   sign 4/7 positive  -> at chance
median A       = 2460 ms CPU
```

**The treatment's median and the identity null's median are the same number: +20 ms.** The null satisfies
both halves of the catalog's admissibility clause (magnitude 0.81% ≤ 1.5%, sign 4/7 at chance), so the
harness's own noise floor this session is 20 ms — and the treatment sits exactly on it. **I am NOT
claiming a zero delta this time** (my previous hop measured a true 0 and I will not round to match it);
I am claiming the effect is **not separable from noise on a harness whose null reads the same value**.

**This is consistent with BA/PM's pure-function pricing of +0.049 ms** — which is ~400x *below* this
harness's resolution and three orders below any `N8-LANE` reading taken on this ticket. Both numbers say
the same thing from opposite ends: the family is ~120 extra pure calls and costs nothing a lane
instrument can see. Per-row cost at the tip, from vitest's own verbose timing: the near-miss row **1 ms**,
`A6`(ii) **2 ms**.

**Two honest limits, unchanged from last hop and restated because they still apply.** (1) This is a
**per-file** harness, not a full-lane one; **it is a measurement of MY delta and must never be quoted as a
fourth `N8-LANE` reading**. (2) The absolute ~2460 ms sits above QE's ~970 ms single-file figure because
`/usr/bin/time -p` wraps the whole `npx` process tree; the paired delta is unaffected, both conditions
carrying the same overhead in the same run.

**`N8-LANE`'s breach is unchanged at Security/NFR's 2.00x. I did not improve it and I did not worsen it,
and it was not mine to move. `G1` stays with the project owner.**

## `PERFT_DEEP` — ruled NOT INDICATED, and run anyway

**The ruling, both halves.** *Can my diff reach the rules core (`moves` / `legal` / `apply` /
`position`)?* **No — and one step stronger than "no import path": my diff cannot reach ANY production
module.** It changes one test file, adds **no import statement** (verified against the added lines), and
every production module is byte-identical by git blob SHA — the two new ones across three commits, and
all 18 merged ones against `main@8dbc3db`. Unchanged code cannot produce changed node counts. That is
QE's own recommended rule: for a diff changing zero bytes in the rules core, the blob comparison is the
cheaper and strictly stronger check.

**I ran it anyway, for the same reason as last hop and I still think it is the right instinct here.** It
costs 36 s, the machine was idle, the ticket is held so there is no schedule to protect, and this hop
exists because a criterion's instrument was believed rather than watched.

```
PERFT_DEEP=1 npx vitest run src/perft.test.ts
  32/32 passed, 36.80 s
  startpos perft(5) = 4865609    kiwipete perft(4) = 4085603
  position-3 perft(5) = 674624   position-3 perft(6) = 11030083
  position-4 perft(4) = 422333   position-4 perft(5) = 15833292
  position-5 perft(4) = 2103487  position-6 perft(4) = 3894594
```

All eight deep counts exact and identical to QE's and to my last hop's. **GREEN — confirmation, not
discovery.**

**I am still not adopting a standing rule.** QE named Architect/Design as the owner of any
blob-comparison-instead-of-deep-perft rule and I agree; this is a third data point for that decision,
not the decision.
