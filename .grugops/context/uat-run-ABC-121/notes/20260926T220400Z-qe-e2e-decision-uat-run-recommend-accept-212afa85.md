---
id: 20260926T220400Z-qe-e2e-decision-uat-run-recommend-accept-212afa85
kind: decision
by: qe-e2e
at: 2026-09-26T22:04:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ADR-0026
  - AR-N8LANE-121
  - NFR-005
  - N8-LANE
  - grugops/ABC-121-pvs-lmr
supersedes:
---

# `ABC-121` UAT run on the owner's standing word: every acceptance criterion and business scenario reproduced at HEAD `6570343`. Recommendation: ACCEPT

Hand-authored and unsealed — `context-io.ts` is absent from this install and `human_admission` is
`off` (`AGENTS.md`), so no `finding` is admissible and this is not the owner's signature. Per
`AGENTS.md` § "Test and UAT authority": running this UAT is the agent's, standing since
2026-08-15/2026-08-16; **the owner's own word is still the `In UAT` exit signature**, and a green
agent report is explicitly not that word. This note is the report the owner's word would answer,
not the acceptance itself.

## Per-criterion result, reproduced independently at HEAD `6570343`

| criterion | result | evidence |
|---|---|---|
| `A1` bounded drift + mate floor | **PASS** — 99.47% within 25 cp (both recursions), max 45 cp, 0/180 mate-status violations | `…77854a65` |
| `A2` depth floor, plain node | **PASS** — 7/7 (kiwipete, position-6) vs the door's 6/6, 3 rounds | `…80a5e0a0` |
| `A2` clock-free companion | **PASS** — 532363/467461 nodes vs 1922235/1923320 | `…77854a65` |
| `A3` predicate table + source assertion | **PASS** — default lane green (`npm test`, part of 48/1466) | this hop's `npm test` run |
| `A4` null-window re-search | **PASS** — default lane green (same run) | this hop's `npm test` run |
| `A5` node count on named positions | **PASS** — 80.2% / 70.8% | `…77854a65` |
| `A6` bounded memory | **PASS** — unchanged (Security/NFR `NFR-009` MET, not re-measured here; no new heap-growing structure in this ticket's diff) | inherited from `secnfr-ABC-121` |

`A3`/`A4` are asserted through the default lane's own pass/fail rather than re-derived by hand in
this hop — QE already spot-checked their rows against the tree (`…b2f12ced`, and the re-pointed
row list) and re-applying five of the planted variants; this UAT run's job is the business-facing
and full-gate layer, not re-litigating QE's row-by-row work.

## Business-facing behaviour

- Three CLI games (non-interactive, piped, as `src/cli.test.ts` itself drives the product): every
  engine reply legal; two games show sensible/tactically alert play — attacking the queen with
  tempo, and capturing a hung queen outright. Full detail: `…b8f72386`.
- No move's timing broke `AR-NFR004-A`'s accepted ≤31 ms-over-3 000 ms band, across nine engine
  moves. Detail: `…b8f72386`.
- The test-only doors (`pvs`/`reductions` off) are independently confirmed unreachable from
  `src/cli.ts` — the player always faces the shipped, fully-heuristic engine. Detail: `…e68ff1b0`.

## Full gate

- `npm test`: 48/1466/0 skipped, exit 0.
- `npm run lint`: clean, 85 files. `npm run typecheck`: exit 0.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings."
- `SEARCH_DEEP=1 npx vitest run src/search.pvs-lmr.test.ts`: 29/29 passed, exit 0, 926.18 s wall,
  every deep-lane figure matching the build/QE/Security-NFR readings to the exact number. Scoped
  to this ticket's own file, per `…77854a65`'s stated reasoning.

Every number here matches the build's, QE's and Security/NFR's own readings exactly — no drift,
no new failure, nothing re-derived differently.

## `N8-LANE` / `AR-N8LANE-121`

Not re-measured in this hop (out of a UAT run's fence; Security/NFR's instrument). Recorded as a
fact, not re-judged: the owner accepted `AR-N8LANE-121` as drafted, 2026-09-26, verbatim "2.
accept the extra" (Orchestrator note `…52aaf5f3`, on the wave `grugops/wave-2026-09-25`). Folded
into the ticket's `## Security/NFR` section as a recorded acceptance line, not re-worded.

## Gaps, named honestly

- `A3`/`A4` were not independently re-derived by this hop beyond the default-lane pass/fail and
  QE's prior row-by-row check — no new independent construction of the `A4` null-window position
  or the `A3` table was attempted here, since that is QE's already-discharged job and this hop's
  fence is the business/UAT layer.
- `A6` is inherited from Security/NFR's `NFR-009` reading, not re-measured in this hop.
- The CLI play-through used constructed sequences (deliberate blunders to elicit tactics), not a
  from-FEN tactical position — `src/cli.ts` has no FEN-loading option, so a genuinely different
  starting tactical position could not be tested through the shipped CLI surface. Named, not
  worked around.
- Per-move timing was measured as an average over a short game, not instrumented per individual
  move; the observed averages are comfortably inside `AR-NFR004-A`'s band but a per-move outlier
  cannot be ruled out by this method alone (Security/NFR's own per-call instrument, `…76eb826c`,
  is the tighter reading and is unchanged).
- Other hardware and a quiet-machine reading remain unverified, as at every prior gate on this
  ticket.

## Recommendation: **ACCEPT**

Every acceptance criterion holds at HEAD, the full gate and the deep lane are green and
figure-identical to every prior hop, the business-facing behaviour is correct and tactically
sound, the test-only doors cannot leak to a real game, and the one open item (`N8-LANE`) is
already a recorded owner acceptance rather than an open question. Nothing found here withholds
acceptance. **The owner's own word is still required for the `In UAT` signature** — this
recommendation is not that word.
