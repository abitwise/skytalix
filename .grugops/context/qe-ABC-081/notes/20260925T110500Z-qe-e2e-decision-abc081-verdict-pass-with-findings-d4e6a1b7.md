---
id: 20260925T110500Z-qe-e2e-decision-abc081-verdict-pass-with-findings-d4e6a1b7
kind: decision
by: qe-e2e
at: 2026-09-25T11:05:00Z
verified_by:
confidence: high
refs:
  - ABC-081
  - ABC-080
  - ABC-078
  - ADR-0025
  - ADR-0006
  - ADR-0020
  - NFR-005
  - NFR-009
  - N8-LANE
  - src/transposition.ts
  - src/search.ts
  - src/engine.ts
supersedes:
---

# ABC-081 QE verdict: PASS WITH FINDINGS

Hand-authored, no `seal` — the degraded posture `AGENTS.md` records; not re-derived here.
Reviewed at `504f046` (branch `grugops/ABC-081-transposition-table`, off `grugops/wave-2026-09-24`
@ `6033d05`). Diff under review: `src/transposition.ts` +176 (new), `src/search.ts` +164/−24,
`src/engine.ts` +84/−14, plus test files. `src/history.ts`, `src/legal.ts`, `src/turn-loop.ts`
byte-identical, confirmed independently. QE's own diff touches nothing under `src/`
(`git status --porcelain -- src` empty throughout — sibling observation notes). Numstat and full
evidence: sibling notes under this `ref:`.

## Per-criterion ruling

- **`A1`** MET. Six-position depth-4 sweep and the `G6` (`ADR-0006` `knight-g1`) pair both
  reproduced independently (default lane); `SEARCH_DEEP` rows for the remaining positions
  reproduced (40/40 lane run).
- **`A2`** MET, **narrowly** (kiwipete 15.95%, position-6 15.38% vs a 15% bar). **Checked for
  "coin-flip": it is not one.** Three independent re-runs of the fixed-depth-5 measurement
  returned byte-identical percentages each time (negamax here is fully deterministic — no clock,
  no randomness in the measured path). The margin is real and stable, not noise. It IS thin: a
  future ordering or replacement-policy change could plausibly tip it under 15% with no early
  warning short of re-running this exact test. Named as a fragility note, not a defect.
- **`A3`** MET (kiwipete 63.94%, position-6 49.90% vs ≤ 70%), reproduced independently in the same
  `SEARCH_DEEP` run.
- **`A4`** MET at the table (unit-level mate-in-two cases both correct, reproduced). The literal
  "mate-in-2 position reached at two plies" search-level wording is answered honestly by the
  build as satisfied at the table rather than by a search-level fixture, because the only reused
  mate entry found in 728 (position, budget) combinations is a mate-in-one. This hop's own,
  independent 225-combination scan (see sibling observation) agrees: no search-level mate-in-two
  reuse found, and produces a second, different demonstration that the ±ply adjustment matters
  (an out-of-range score under the T1 mutant). **Ruling: MET, with a named residual gap** — two
  broad scans agreeing is strong but not proof; the formula is unit-tested generically for
  arbitrary distance, which is what actually carries the correctness claim.
- **`A5`** MET, reproduced (both fixtures, table on and off, `SEARCH_DEEP`).
- **`A6`** MET, reproduced by direct grep and by an independent `git diff --name-only` on the
  three named files.
- **`A7`** MET, reproduced under `ENGINE_DEEP` (`node --expose-gc` child): heapUsed/arrayBuffers
  growth both effectively 0.01/0.00 MiB between 1 s and 3 s, against `NFR-009`'s ≤ 1 MiB bar.
- **`A8`** MET, reproduced (suite green, skip 0, the three named files byte-identical).

## Design calls — ruled

1. **Exact-depth-only cutoff (`stored === needed`) vs `≥ depth`.** ACCEPTED. Makes `A1`'s
   guarantee true by construction rather than true only on the measured corpus; the
   forgone-depth cost (a `≥` rule reaches one ply deeper on one rook ending at 80 ticks) is
   measured and disclosed, not hidden, and named for a future re-level rather than pulled in
   quietly.
2. **Always-replace.** ACCEPTED. Consistent with a one-search-lifetime table; no counter-evidence
   found in this hop's own probing.
3. **`ABC-080`'s ordering doors keep the table off.** ACCEPTED. Preserves `ABC-080`'s
   single-lever-per-rung ladder; the affected tests (`search.ordering.test.ts`, `engine.test.ts`
   `A3` identity sweep) reproduced green in this hop's own gate run.
4. **Three new exports, widening `ABC-077` `A6`'s list.** ACCEPTED. The alternative (duplicating
   `KEY_ARRAY_CAPACITY`/`repeatsInPath` in `engine.ts`) is worse — two copies of a correctness
   rule instead of one shared one — and the widened-list assertion passed.
5. **The two forced edits** (`!(depth >= 1)` root guard; `Parameters<EngineSeam>[0]`).
   ACCEPTED, both independently confirmed load-bearing/inert respectively: K4 (reverting the
   root guard) demonstrably reintroduces a practically-unbounded hang (see mutant note); the type
   change is erased at runtime and `A6`'s grep is unaffected either way.
6. **The three re-measured pins** (`ABC-080` G4 275→261; `ABC-078` `A3` budget 4→3; the identity
   sweep's 6/368 equal-score acceptance). ACCEPTED — all three are exercised by tests that
   reproduced green in this hop's independent gate run.

## Mutant ledger

27 claimed, 25 killed by the build. This hop re-applied 8 by hand (6 "thin-spot" kills named by
the build itself — T3, T9, E1, E2, E3, S1 — plus K3 and K4): **all 8 reproduce exactly as
claimed.** K3 (capacity guard) genuinely survives and is genuinely untested, but this hop traced
why it is unreachable given the other guard (decision 6a) standing — not a live gap while that
guard stands, a bare defense-in-depth line. K4 (reverting decision 6a) survives by timing out,
and this hop's own probing surfaces an **operational finding the build's note did not**: the hang
is a synchronous CPU-bound computation that vitest's `testTimeout` cannot interrupt, and
`AGENTS.md`'s plain `npm test` command carries no OS-level timeout wrapper — a real regression of
this class would hang the gate itself rather than fail red in bounded time.

## Gaps, named plainly

1. **K3/K4 class — the capacity guard is untested and its only real protection (decision 6a) is
   unguarded against test regression at the gate level, since a hang doesn't fail fast under
   plain `vitest run`.** Non-blocking today (decision 6a stands, verified), but worth a follow-up:
   either a direct test that exercises the capacity guard itself (independent of decision 6a), or
   wrapping the test command with a process-level timeout so a future hang fails loudly instead
   of stalling the gate. Owner: next licensed touch of `src/search.ts`/`AGENTS.md`'s Test slot.
2. **`A4`'s literal search-level mate-in-two wording remains unexercised by a fixture**, satisfied
   instead by the table's own generic unit tests plus two independent, non-overlapping empirical
   scans (953 combinations total) finding no counterexample. Non-blocking; named for whoever next
   touches `src/transposition.ts` or wants to close it with a constructed fixture.
3. **`A2`'s margin is thin (0.95 / 0.38 points above the 15% bar) though stable.** Non-blocking;
   a fragility note for whoever next changes ordering, replacement policy or table size.
4. **`NFR-005`, `NFR-009`, `N8-LANE` are REPORTED here, not ruled** — per this subtask's own
   fence. `NFR-005` (depth 6/6 plain node) and `NFR-009` (heapUsed/arrayBuffers growth) were
   independently re-measured and match. `N8-LANE` (+220 ms gross / +60 ms net, medium confidence
   per the build's own note on very high load during its run) was **not** independently re-run
   this hop — its harness is expensive (27 runs) and the fence routes NFR verdicts to
   Security/NFR, not QE. Recorded as reported, unruled.

## Overall

**PASS WITH FINDINGS.** All eight acceptance criteria MET, all six design calls ACCEPTED, all
gates green and independently reproduced (not merely re-read), the mutant ledger re-sampled and
confirmed exactly. Two non-blocking gaps named (K3/K4 test-and-timeout coverage; `A4`'s
search-level fixture) plus one fragility note (`A2`'s margin). `ABC-081` MAY LEAVE `In Review`;
the board move (toward `In Security/NFR`, per the queue task's `workflow:` pointer at
`agent-factory/workflows/05-pr-quality-gate.md`) is the Orchestrator's.
