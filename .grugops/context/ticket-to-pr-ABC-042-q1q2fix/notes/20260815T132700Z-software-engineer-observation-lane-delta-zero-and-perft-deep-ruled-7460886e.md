---
id: 20260815T132700Z-software-engineer-observation-lane-delta-zero-and-perft-deep-ruled-7460886e
kind: observation
by: software-engineer
at: 2026-08-15T13:27:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - N8-LANE
  - NFR-008
  - PERFT_DEEP
  - G1
  - src/cli.test.ts
  - src/perft.test.ts
supersedes: 
---

# The lane delta of this hop (zero), and the `PERFT_DEEP` ruling

## `N8-LANE` — my hard limit was "≤ 0 by construction". It is ≤ 0 by construction AND by measurement

**By construction.** The change adds **no child process**: the suite still spawns exactly ten, and
the file now *proves* that mechanically (`spawnSync` is the only name taken from `node:child_process`
and has exactly one call site). The added work is one `readFileSync` of a file the suite already
reads plus three regex scans over strings already in memory — the `A9` additions reuse the `entry`
variable the row had already computed, so they add **no file read at all**.

**By measurement, because "by construction" is an argument and this ticket is about instruments.**
Paired, order-rotated, round 0 discarded, n = 7, CPU = `user + sys` from `/usr/bin/time -p` over the
whole process tree — `N8-LANE`'s own instrument, not wall. `PERFT_DEEP` unset.

| condition | what it is |
|---|---|
| **A** | my tip's `src/cli.test.ts` — QE's arming **plus my two additions** |
| **B** | base `257d023`'s `src/cli.test.ts` — QE's arming alone |
| **N** | a byte-identical rerun of **A** — the **identity null control** |

| round | A | B | N | dTreat (A−B) | dNull (A−N) |
|---|---|---|---|---|---|
| 0 *(discarded)* | 2430 | 2410 | 2420 | 20 | 10 |
| 1 | 2560 | 2440 | 2460 | **120** | 100 |
| 2 | 2430 | 2430 | 2480 | **0** | −50 |
| 3 | 2460 | 2460 | 2470 | **0** | −10 |
| 4 | 2440 | 2450 | 2470 | **−10** | −30 |
| 5 | 2430 | 2420 | 2480 | **10** | −50 |
| 6 | 2500 | 2440 | 2490 | **60** | 10 |
| 7 | 2450 | 2460 | 2430 | **−10** | 20 |

```
median dTreat  =    0 ms CPU  (0.00% of A)   sign 3/7 positive  -> at chance
median dNull   =  -10 ms CPU (-0.41% of A)   sign 3/7 positive  -> at chance
median A       = 2450 ms CPU
```

**The treatment's median is zero and its sign is at chance — it is not merely small, it is
indistinguishable from the null control by both halves of the catalog's own clause.** My null reads
**−0.41% with sign 3/7**, which satisfies **magnitude (≤ 1.5%) AND sign-at-chance** — the pair QE
withdrew its own null against when it scored 1/7 and correctly downgraded itself.

**Lane delta of this hop: 0 ms CPU. `N8-LANE`'s breach is unchanged at Security/NFR's 2.00x — I did
not improve it and I did not worsen it, and it was not mine to move.** `G1` stays exactly where the
Orchestrator carried it.

**Two honest limits on this reading.** (1) It is a **per-file** harness, not a full-lane one: a 0 ms
effect is far below the resolution of an ~11 s full-lane measurement, which is why the sensitive
instrument is the right one and why this is a measurement of *my delta*, not a fourth `N8-LANE`
reading. Nobody should cite it as one. (2) The absolute figures (~2450 ms) sit above QE's ~970 ms
single-file number because `/usr/bin/time -p` here wraps the whole `npx` process tree; **the paired
delta is unaffected**, since both conditions carry the same overhead in the same run.

## `PERFT_DEEP` — ruled NOT INDICATED, and run anyway

**The ruling, both halves.** *Can my diff reach the rules core (`moves` / `legal` / `apply` /
`position`)?* **No — and one step stronger than "no import path": my diff cannot reach ANY production
module.** It changes one test file, adds **no import statement** (verified: the only `import` text in
the diff is inside a comment and a regex literal), and every production module is byte-identical by
git blob SHA — the two new ones and all 18 merged ones, 18/18. Unchanged code cannot produce changed
node counts.

This is exactly the case QE recommended a rule for: *"for a diff that changes zero bytes in
`moves`/`legal`/`apply`/`position`, the blob comparison is the cheaper and strictly stronger check."*
On that recommendation `PERFT_DEEP` is **not indicated** here.

**I ran it anyway, and I want the reason recorded rather than looking indecisive.** It costs 36 s
once, the machine was idle, the ticket is held so there is no schedule to protect, and this hop
exists **because a fix was believed instead of watched**. Declining a 36-second confirmation on the
strength of my own reasoning, on this ticket, would have been the wrong instinct even where the
reasoning is right.

```
PERFT_DEEP=1 npx vitest run src/perft.test.ts
  32/32 passed, 36.19 s
  startpos perft(5) = 4865609    kiwipete perft(4) = 4085603
  position-3 perft(5) = 674624   position-3 perft(6) = 11030083
  position-4 perft(4) = 422333   position-4 perft(5) = 15833292
  position-5 perft(4) = 2103487  position-6 perft(4) = 3894594
```

All eight deep counts exact, identical to QE's. **GREEN — confirmation, not discovery, and it could
not have been anything else.**

**I am not adopting a standing rule.** QE named Architect/Design as the owner of any
blob-comparison-instead-of-deep-perft rule and I agree; this note is a second data point for that
decision, not the decision.
