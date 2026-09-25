---
id: 20260925T110400Z-qe-e2e-observation-abc081-mutant-resample-and-a4-gap-hunt-c2d5f8a3
kind: observation
by: qe-e2e
at: 2026-09-25T11:04:00Z
verified_by:
confidence: high
refs:
  - ABC-081
  - ADR-0025
  - src/transposition.ts
  - src/search.ts
  - src/engine.ts
supersedes:
---

# ABC-081 QE: mutant re-sample (8/8 match the build's ledger), K3/K4 confirmed, and an independent A4 mate-in-2 gap-hunt (still none found)

Hand-authored, no `seal`. Probes: `probe/qe-mutants.mjs` (this hop's copy of the build's own
`.grugops/context/ticket-to-pr-ABC-081/probe/mutants.mjs`, timeout lowered 400 s → 30 s so a
hanging mutant is capped without burning the lane — per this subtask's own fence) and
`probe/qe-a4-scan.mjs` (new). `git status --porcelain -- src` asserted empty after every mutant,
every run.

**Mutant re-sample — thin spots and sanity kills, all 8 reproduce exactly:**

| id | build said | re-applied here |
|---|---|---|
| T3 | killed (unit row only, thin) | **KILLED**, 137/1 failed — same one unit row |
| T9 | killed | **KILLED**, 5 rows failed |
| E1 | killed (thin, one row) | **KILLED**, 1 row failed |
| E2 | killed | **KILLED**, 2 rows failed |
| E3 | killed (thin, one row) | **KILLED**, 1 row failed |
| S1 | killed (thin, 2-node margin) | **KILLED**, 1 row failed |
| **K3** | capacity guard removed — **SURVIVES** every lane | **SURVIVES**, 138/0 failed, confirmed |
| **K4** | `!(depth >= 1)` → `depth < 1` — **hangs** to the runner's cap | **SURVIVES / TIMES OUT** at this hop's 30 s cap (`status 143, signal null`); `src` restored clean by the harness's own `finally` even on a killed process |

**K3/K4, why they land where they do (traced, not just re-run).** Inside one `search()` or
`chooseMove` call the requested depth only ever decrements from a real integer, so `ply` cannot
reach `KEY_ARRAY_CAPACITY` (128) before `depth <= 0`/`remaining <= 0` already returns a leaf —
the branching factor alone makes a depth anywhere near 128 computationally unreachable regardless
of the guard. The ONLY path that reaches the guard is a **malformed `depth` argument** (`NaN` or
similar) that never satisfies `<= 0`, and that path is caught FIRST, at entry, by
`searchRoot`'s own `!(depth >= 1)` line (`ABC-081` decision 6a) — before `negamax` and its
capacity guard are ever reached. So **K3 alone is unreachable in this build**: it is genuinely
untested, but it is not a live gap while decision 6a's root guard stands; it is a bare defense
against a second, independent regression of that same class. K4 demonstrates the class directly:
removing decision 6a's fix, with everything else (the capacity guard included) intact, does not
crash and does not literally infinite-loop — `ply` IS bounded at 128 — but the tree beneath a
malformed depth is exponential in `ply`, so the process is unresponsive for as long as anyone is
willing to wait. **Operational finding, not in the build's own claim note:** vitest's
`testTimeout` cannot interrupt this — it is synchronous, CPU-bound JavaScript with no `await`
point, so vitest's own per-test timeout mechanism (which relies on the event loop) never fires.
Only an OS-level process timeout (what this probe's harness and the build's own supply via
`spawnSync`'s `timeout` option) stops it. `AGENTS.md`'s `Test (all)` command (`npm test` → plain
`vitest run`) carries **no such external wrapper**. A future regression of this exact class
(reverting decision 6a) would hang the actual gate/CI invocation indefinitely rather than fail
red in bounded time — named here as a gap the mutant found that the build's own note did not
call out as an operational risk, distinct from "is K3/K4 killed."

**A4 gap-hunt, independent and broader than the build's own scan.** The build's own claim note
says its search-level scan covered "182 endgame positions and four budgets" and found exactly
one case where the ±ply adjustment changes the answer, and that case is a reused **mate-in-ONE**
position, not mate-in-two. This hop built a T1-mutant (`stored ±ply` adjustment removed, same
mutation the build's own ledger calls T1) differential scan: 15 mating endgame roots (including
the build's own `kr-mid` case and several K+Q/K+R vs K and back-rank shapes) × 15 budgets
(3–250 injected ticks) = 225 `chooseMove` comparisons between the delivered code and the T1
mutant. **Result: still no reused mate-in-two entry that flips a root score.** The diffs found
were (a) depth-reached shifts — expected, since T1 changes cutoff decisions and therefore node
counts within the same budget, already covered by T1 being a confirmed KILL elsewhere; (b) the
SAME mate-in-one reuse the build found, on the same `kr-mid` position, at three budgets; (c) one
case (budget 250, `kr-mid`) where the T1 mutant reports a score of **−30 014**, whose magnitude
EXCEEDS `MATE_SCORE` (30 000) — an internally-inconsistent, out-of-range value that could not be
a real mate distance at all. That is not a mate-in-two case either, but it is a clean second
demonstration (independent of the build's own) that the ±ply adjustment is load-bearing: without
it, the table doesn't just mis-report a distance, it can emit a score outside the entire valid
range.

**Reading of the A4 gap, honestly:** the literal "mate-in-2 position" wording of `A4` is answered
at the table's own unit level (both `MATE_SCORE - 4` stored-and-read-at-two-plies cases in
`transposition.test.ts`, which are themselves mate-in-two by definition and pass), not by a
search-level fixture. Two independent scans (728 combinations from the build, 225 from this hop,
953 total, no overlap in FEN×budget pairs) have not produced a search-level mate-in-two reuse
example. This is not proof one cannot exist — the formula is generic in distance and the one
found case (mate-in-one) already exercises the same arithmetic path a mate-in-two would use — but
it remains, honestly, an absence of evidence rather than evidence of absence for the literal
search-level wording. Recorded as a **residual, low-severity gap**, not a blocking finding: the
underlying formula is proven correct at the unit level for arbitrary stored distances (the table
tests parametrize distance generically, not just for "2"), and two broad empirical scans agree.
