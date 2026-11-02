# Verdict: NO winning form. No candidate is a WIN under the sealed rule. ADR-0062 is not amended with a new form. Recommendation: park ABC-266, so Threads stays at 1, and keep ADR-0062 PROPOSED as the design of record

Architect/Design, task `arch-ABC-266-repropose`. By the pre-registration `…decision-3c920b97`, graded by script (results: this task's results observation). No bar was loosened and nothing was graded by hand.

## By the rule
- **PASS-A:** only T4SDP (Threads 4 on CPUs 0–3, with skip blocks, deeper-entry cutoffs and root perturbation in helpers). It was a DEPTH-PASS in R2: D 8 against 7, ΔQ −1.67 (guard > −2). R2 was LOADED by (c), so the result is PASS (SHARED).
- **R5 (its confirmation):** D 8 against 7, ΔQ −1.67, but LOADED by (c). The rule requires an unloaded R5 for a WIN, so **not a WIN**. No other candidate was PASS-A, so no second confirmation was possible.
- **Everything else: MISS.** That covers T12S, T12D, T12P, T12SD, T12SDP (D 8 but ΔQ −2, which fails the guard) and T4SD in R1, plus T4 and T4SD in R2b, the allowed re-run of the VOID-LOAD cells, which was not loaded.
- **Information, consistent with the verdict:** in the unloaded R2b, T4SDP read D 8 and ΔQ −2, which would fail the guard.
- **Verdict: NO WIN.**

## Why the Architect does not lean against the verdict
- The load flag that voided R5 looks like an instrument artifact (the results note shows (c) tracks block length). Even so, the substance does not favour a WIN.
  - In all four reads of an S+D+P form at 100 ms (T12SDP in R1; T4SDP in R2, R5 and R2b), the extra ply comes with a quality-proxy loss of 1.67–2 positions of 20. None reads ΔQ ≥ 0.
  - The deeper-entry rule alone inflates the reported depth at Threads 1 (T1D +0.5 ply at 100 ms and +1.7 at 1 s, with Q −1). So the depth gain is not evidence of a stronger move.
- Lazy SMP's gain should show as a better move at equal time. Nothing here shows that at 100 ms.
- **1 s (info):** only T12SDP reads Q above T1's, 18 against 17. That is one position, in one pass, below the pre-registered ±2 noise band. It is not a basis for a 1 s read.

## Recommendation (the Architect's; the owner decides)
1. **Park `ABC-266`.** `Threads` stays at 1, and the build does not start. `ADR-0062` stays PROPOSED as the design of record, with a dated line (its mechanics hold: identity, D5's order, D6). `ADR-0044` D3 and D5 stand. `ABC-265`'s shared table stays: it is node-for-node today's engine at one writer and does not depend on this.
2. **Do not open a 1 s read** on this evidence.
3. **What would reopen it** (each needs its own pre-registration):
   - (a) `ADR-0058` comes into force through `ABC-257`, which changes the table for every thread count; or
   - (b) the owner asks for one more probe of the S+D+P form at Threads 12. That probe would use a load test on windows of at least 1 s, at least 60 positions, and a quality proxy without the ceiling, such as a score loss against a long reference. About 30 min of host time (estimate); or
   - (c) a later search change breaks the workers' lockstep.
- **Not recommended:** build `ABC-266` and let A7 decide. That is 15–35 h of build against an A7 GAIN bar the probes say would read near 50, and F4 says a miss is not re-played.

## ADR changes made
- `ADR-0062`: a dated Status line and a dated line under D12 (re-proposal: no winning form, recommendation park). No decision text changes.
- `ADR-0057`: a dated Status line saying D2.5's Elo estimate (+100 to +300 at 100 ms) is not supported by the D12 probe or this one. No decision changes.
- `ADR-0058`: untouched. Any form with D would switch its rule on at `Threads ≥ 2` ahead of `ABC-257`'s A8′ gate. That is the owner's call, so it is raised as an owner question, not taken here.

## Scope
Records only. No `src/`, tests, plans or board edits.

## Risks
The verdict rests on 20 positions and a ceilinged proxy. A real but small gain at 100 ms (below about 2 positions of 20) cannot be excluded. Parking is reversible at no cost.
