---
id: 20261104T025651Z-security-nfr-decision-8a4fb936
kind: decision
by: security-nfr
at: 2026-11-04T02:56:51Z
verified_by: 
confidence: high: recommendation grounded in the two readings above; no level, bar, test or config moved
refs:
  - secnfr-nfr008-headroom
  - NFR-008
  - NFR-010
  - R-N8H-1
  - R-N8H-2
  - R-N8H-3
  - Q-N8H-1
  - QE-280-b
  - QE-279-e
  - ADR-0008
  - ADR-0035
  - ADR-0040
  - ADR-0046
  - T-QEHOP-GROWTH
  - ABC-248
  - ABC-244
  - src/cli.test.ts
  - src/uci-session.test.ts
  - src/search.null-move.test.ts
  - src/engine.test.ts
  - src/levels.test.ts
  - tools/grugops/qe-hop-integrity.test.ts
  - plans/nfr-catalog.md
  - qe-ABC-280/20261104T024152Z-qe-e2e-observation-29cd8440
  - qe-ABC-279/20261104T003652Z-qe-e2e-observation-c49b050d
  - 08843504
supersedes: 
seal: sha256:0a5c03e03b1e2948af4677148ff2a2dc2b837a1fd3221e49783dfd74b1863228
---

# Security/NFR decision, secnfr-nfr008-headroom: PASS_WITH_RISKS. Move three named rows to their files' existing deep lanes (≈ −0.4 s wall, measured); do not re-state `NFR-008` now; one owner question held, not escalated

Readings: the observation "main's default lane read ALONE" (this task). Probe: observation "a scratch probe with three named rows skipped" (this task). No security surface is touched (records only; no auth, data, input or secret path). No §14 stamp, so no `finding`; every item below is an observation-grade risk with a named owner.

## Result: PASS_WITH_RISKS
`main`'s default lane is under 10 s in 15 of 15 scored runs (median 9.77 / 9.90 s, max 9.98 s), but the headroom (0.10–0.23 s on the median) is smaller than the window-to-window spread (≈ 0.3–0.5 s). Not a graded `NFR-008` verdict (no twin, `ADR-0035` D1).

## Recommendation (the brief's option 1: move named slow rows to an existing deep lane; test-only, no config)
One small ticket (BA/PM cuts it; Architect/Design confirms, as owner of the floor account; QE re-reads `NFR-008` with a twin after):

| row | from (default) | to | coverage that leaves the default lane | what stays in the default lane |
| --- | --- | --- | --- | --- |
| "QE-208-a …" › "position-6, the even readings 4 to 24: 0 mutated roots, and aborts landing inside a null subtree" (365 ms) | `src/search.null-move.test.ts` | the same file's `SEARCH_DEEP=1` block (`RUN_DEEP`) | the sweep of 11 aborts landing inside an open null move, root byte-identity | `src/engine.test.ts` "leaves every searched position byte-identical, aborted iteration or not"; "unmakeNullMove leaves every position byte-identical"; the QE-208-b key rows |
| "ABC-230 A3 and A4 …" › "A4: an empty list is node-equal to an absent one over the endgames and the thirty" (236 ms) | `src/engine.test.ts` | the same file's `ENGINE_DEEP=1` block | node equality of `[]` vs absent prior keys over the endgames + 30 | the same describe's "the three test-only doors ignore prior keys" row |
| "A9 — different seeds actually differ" (135 ms) | `src/levels.test.ts` | the same file's `ENGINE_DEEP=1` block | the property that the seed is actually used (≥ 2 distinct sequences over 5 seeds) | "A7 — seeded" (a fixed seed repeats) |

Measured on a scratch probe: **−0.38 s paired median wall (7 / 7), −1.09 s CPU** → the lane would sit ≈ 9.4 s. The ticket owes `AGENTS.md`'s deep-lane row counts (e.g. the null-move lane's "44 rows") and each moved row's `[deep, …=1]` suffix. A slice per row (fewer readings or positions kept in default, the full set deep) is an acceptable variant at part of the saving; that is the SE's and Architect's design.

**Not recommended:**
- `src/cli.test.ts`'s collect-time children (3.4 s slot, 30 % of the lane): they are the default lane's only end-to-end runs of the delivered command (`npm run chess`, refusals, exit codes, closed readers). Running them concurrently would break the synchronous-child form `ADR-0008` Ruling 4 / `C2` pins under the owner's 2-executor word. Its fixed 0.6 s `A9_SETTLE_SECONDS` sleep (≈ 0.3 s wall) is a second-tranche candidate for Architect/Design only, because it guards a race.
- More `src/uci-session.test.ts` rows: `ABC-248` already moved the time-blind ones; the rest read time at fine steps.
- `tools/grugops/qe-hop-integrity.test.ts`: no deep lane exists under `tools/`; its growth already has a trigger (below).

## Risks
- **`R-N8H-1` (MEDIUM): `NFR-008` has ≈ 0.1–0.2 s headroom on `main`, less than the window spread.** The next default-lane addition can put the median over 10 s on a normal window; a breach goes to the owner (`ADR-0035`). +0.52 s since `ABC-244`'s 9.25 s (2026-10-30), across windows. Owner: **Orchestrator** (routes the cut above and holds the watch); remedy owner **Architect/Design** (floor account). Not accepted: open until the moved-rows ticket's QE re-read.
- **`R-N8H-2` (LOW): `qe-hop-integrity.test.ts` cost grows with the note store** (367–417 ms slot at 5 064 note files; its A9 sweep 176 ms). `T-QEHOP-GROWTH` re-arms at 5 500 note files, ≈ 440 notes away. Owner: **Architect/Design** (the trigger's owner). No new control.
- **`R-N8H-3` (INFO): per-file start-up dominates small files** (49–51 files with < 60 ms of tests cost ≈ 3.0–3.4 s of slot; ≈ 67 ms worker turnover per file). Every new test file costs ≈ 0.1 s wall before its first assertion. A note for BA/PM at each cut (prefer adding rows to an existing file). Owner: **BA/PM**.

## Owner question, framed (held by the Orchestrator; not an escalation today)
**Q-N8H-1 — re-state `NFR-008`?** Options: (a) keep `npm test` wall ≤ 10 s and keep moving heavy rows to deep lanes as they appear; (b) re-state W for the 24-CPU reference (e.g. 12 s); (c) revisit the 2-worker cap (the owner's 2026-10-19 word, set for M3 heat), the only structural lever. **Recommendation: (a).** It costs one small ticket and keeps the bar and the cap. Ask (b) or (c) only if the lane's median is back at ≥ 9.6 s after the moves land.
