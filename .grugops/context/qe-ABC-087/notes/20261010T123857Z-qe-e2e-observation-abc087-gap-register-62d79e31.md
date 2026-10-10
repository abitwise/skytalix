---
id: 20261010T123857Z-qe-e2e-observation-abc087-gap-register-62d79e31
kind: observation
by: qe-e2e
at: 2026-10-10T12:38:57Z
verified_by:
confidence: high
refs:
  - ABC-087
  - ABC-085
  - ADR-0032
  - ADR-0027
  - ADR-0035
  - NFR-004
  - N8-LANE
  - src/levels.test.ts
  - 20261010T123857Z-qe-e2e-observation-abc087-invariants-reproved-eleven-mutants-62168263
  - .grugops/context/qe-ABC-087/probe/out-gen-spread.txt
  - .grugops/context/qe-ABC-087/probe/out-m3a-why.txt
supersedes:
---

# `ABC-087` QE gap register: 6 gaps, 2 MEDIUM and 4 LOW. All of them are holes in the regression net, not defects in the delivered behaviour

Hand-authored, unsealed.
- The code is correct on every invariant QE checked independently (`…62168263`).
- Each gap is a mutant, or a reading, that the shipped suite does not see.
- Every remedy is **test-only** (`src/levels.test.ts`). It is the Engineer's to write and BA/PM's to place.
- **Any default-lane row must be costed against `N8-LANE`.** The re-hop read +0.535 s against 650 ms,
  which leaves about 115 ms. That cost is `UNKNOWN - verify` until it is measured.

| id | sev | gap | evidence | remedy (suggested, not done) | owner |
|---|---|---|---|---|---|
| `QE-087-a` | **MEDIUM** | **The seed reaching the engine (`ADR-0027` d1) is unpinned.** `M3a`, where the seed scales the engine-path budget, is green in the default lane (19/19) and the full deep lane (25/25). A6's identity row runs one seed (7) at a 1 000 ms step. Seed 7's perturbed budget (2 737 ms) reads identically to 3 000 there | `mutants/M3a_*.out`, `out-m3a-why.txt` | A6's row at a step that resolves a budget change (120 ms resolves ±10 %) on ≥ 2 seeds, on 1–2 light positions. Or assert the options `chooseMove` receives (QE's `I1` shape) | Engineer (row), BA/PM (lane, cost) |
| `QE-087-b` | **MEDIUM** | **The honesty of the scored list is unpinned.** `M8` (child score sign-flipped, so the blunder plays the second-WORST by the engine's real scores) is green on every shipped lane, `A3` and both `A4` runs included. Cause: `ADR-0032` d3 has `A4` read the module's own list and not re-derive it. Test note 2 calls this clause "the one that means something", and a self-consistent lie satisfies it | `mutants/M8_*.out` | One default-lane row: on a coarse clock (every child at depth 1, so deterministic), each `scored[i].score` = −`chooseMove(child)`'s depth-1 score, plus a position where one capture wins a queen must have that move at the top of the list. Architect/Design FYI: d3's "does not re-derive" is where the blind spot comes from | Engineer (row); Architect/Design (FYI) |
| `QE-087-c` | LOW | **The level clamp is unpinned.** `M4` (no clamp) is green everywhere. It is equivalent on today's table (max budget 4 500 ms; the hardest level's rate is 0), so there is no live exposure. It becomes live when `ABC-085`/`EPIC-006` re-cut the table, and `A1` does not bound a budget at ≤ `HARD_CEILING_MS` | `mutants/M4_*.out` | A synthetic `{ 20 000 ms, rate ≈ 1 }` level on one light endgame, coarse step: elapsed ≤ 5 000 + a few readings (QE's `I5` shape, ~1 ms) | Engineer |
| `QE-087-d` | LOW | **"One draw per move" is unpinned.** `M5b` (an extra draw per root move, the decision intact) is green everywhere. `ADR-0032` d2: "no second draw is made: the seed is consumed once per move". `A7`/`A9`/`A10` cannot see it | `mutants/M5b_*.out` | On the moves `A7`/`A9` already play: kind ≠ `engine` ⇔ the k-th `seededRandom(seed)` draw < rate (QE's `I2`; no new search) | Engineer |
| `QE-087-e` | LOW | **Known, as the task named it:** the `A4` `ENDGAMES` run, moved to `ENGINE_DEEP`, still logs `A4 [default lane, ENDGAMES]`. It is cosmetic, but it misleads anyone reading the deep log or the `AGENTS.md` receipt. It was kept because the ruling said "unchanged" | `src/levels.test.ts:389`, `raw-deep-tip.log` | Re-label the string to `ENGINE_DEEP, ENDGAMES` | Engineer (one string) |
| `QE-087-f` | LOW | **`A4`'s ±5 pp is one fixed-seed draw, not a test with a stated error rate.** An honest build reads outside the band on **15.3 %** of seeds at n = 204 and **11.8 %** at n = 246 (exact binomial). The generator matches: 14.2 % and 12.1 % over 1 000 seeds, sd 3.38 vs 3.43 pp, so mulberry32 is honest. It is deterministic at seed 87 and not flaky, but a seed or corpus change has about a 1-in-7 chance of a false red. A rate mis-set by 5 pp passes about half the time | `out-gen-spread.txt` | A criterion question, not a code one: state the false-red rate the band accepts, or widen n / the band. Not urgent | BA/PM |

**Carried, not QE's gaps (owed before merge):**
- The `AGENTS.md` `ENGINE_DEEP` levels lane line, drafted in `…53ebd6d1`, is the Scribe's. QE's
  reading for it: 25 passed (19 default), 196.5 s at load1 3.62 → 6.74.
- `N8-LANE` MET rests on `ADR-0035`, which is `proposed`, and the owner's acceptance is owed.
- `NFR-004`'s level-layer wording is Security/NFR's (QE's facts are in `…df34cf5a`).
- The levels 3/4/5 budget-only risk sits on `ABC-085`.
