---
id: 20260809T203336Z-software-engineer-observation-9e09b5f1
kind: observation
by: software-engineer
at: 2026-08-09T20:33:36Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - NFR-001
  - NFR-005
  - plans/nfr-catalog.md
  - src/perft-bench.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# `NFR-001` / `A10` — met on every clause, and the null control is why no per-cell cost is claimed

These are the **first throughput figures any role has taken on this ticket**. BA/PM stated plainly
that no throughput number in `ABC-022` was theirs and that `npm run perft` had not been run by that
role at any hop. Apple M3 / Node v24.12.0 / darwin-arm64; **`UNKNOWN - verify` on any other
hardware**.

## Primary — a COUNT, per the amended method

`331` evaluations, `0` rejections over the standing 518,474-node walk; `216,269` for the rejected
placement. Full derivation and the ordering decision are in the `decision` note published at
`2026-08-09T20:33:32Z`. Zero rejections is expected by construction — 0 of 518,474 reachable nodes
carry an occupied en-passant target — and it is what makes the arithmetic honest: **the change
cannot cost anything except the evaluation of two comparisons 331 times.**

## Floor — clock

`npm run perft` on the delivered tree: **11,377,922 nodes in 1.780 s = 6,393,713 nodes/sec**, against
the `>= 1,000,000` bar. **~6.4x clear.** The harness prints its own `AT OR ABOVE target` line.

This sits slightly above the catalog's transcribed 6.04M-6.21M band. That band is a baseline, not a
ceiling, and the catalog's 2026-08-09 header already records a measured floor of 6,030,518 — the
spread is the instrument's, and nothing is claimed from being above the band.

## Aggregate ratio — met, with the null control that decides how to read it

Three trees, **one OS process each**, tree order **rotated** across three rounds, node count
checksummed **identical at 11,377,922 on every tree and every round**:

```
t-pristine  mean 6,283,171/sec   (spread 3.10%)
t-fix       mean 6,236,937/sec   (spread 0.33%)
t-twin      mean 6,209,452/sec   (spread 1.10%)   <- byte-identical twin of t-fix

AGGREGATE   fix / pristine  = 0.9926    against the >= 0.98 bar  -> MET
NULL CTRL   twin / pristine = 0.9883
NULL CTRL   twin / fix      = 0.9956    identical CODE, so 100% of this is instrument
```

`t-twin` was verified byte-identical to `t-fix` by `cmp` over all 30 files in `src/`, 0 differing.
**The null control's deviation from the tree it is identical to (0.44%) and from the pre-fix
baseline (1.17%) both exceed the fix's apparent 0.74% cost.** The bar is met, and **no per-cell and
no per-run cost claim is admissible from this data** — the catalog's standing caution held again,
for the third ticket running.

`## Security / NFR triggers` demotes the per-cell ratio for exactly this reason and makes the count
primary. The count says the true cost is 331 evaluations of two comparisons over 11.4M nodes, which
is arithmetically indistinguishable from zero; the clock cannot see it and did not.

## Not measured, deliberately

**`NFR-005` was NOT measured and the Zobrist key benchmark was NOT re-run.** `src/zobrist.ts` gains
nothing and `src/legal.ts` gains **no executable line**, so the per-node key cost is untouched **by
construction**. The ticket says to state that structurally and not to re-run the benchmark to
"confirm" it, and that instruction was followed rather than quietly improved on.

**`plans/nfr-catalog.md` was NOT edited and no NFR target moved.**

**No wall-clock assertion was added to the test suite** — this project's standing rule; every figure
here comes from a harness run out of the gate path.
