---
id: 20261011T191345Z-security-nfr-decision-abc151-window-grades-and-result-fcf66342
kind: decision
by: security-nfr
at: 2026-10-11T19:13:45Z
verified_by:
confidence: high
refs:
  - ABC-151
  - ADR-0040
  - ADR-0035
  - NFR-008
  - RISK-ABC144-HEAT
  - RISK-ABC144-FCAP
  - RISK-ABC144-STALL
  - QE-151-d
  - .grugops/context/secnfr-ABC-151-window/notes/20261011T191345Z-security-nfr-observation-abc151-window-heat-a5-363fc14c.md
  - .grugops/context/secnfr-ABC-151-window/notes/20261011T191345Z-security-nfr-observation-abc151-window-readings-78a8c8ea.md
  - .grugops/context/secnfr-ABC-151-window/notes/20261011T191345Z-security-nfr-observation-abc151-window-method-and-limits-2983f397.md
  - .grugops/context/secnfr-ABC-151-window/probe/readout.out.txt
supersedes:
---

# `ABC-151` window: `A3` MET, `A4` MET, the lanes exit 0. **`A5`: k = 2 heats no later than k = 3, and on more reads, so it goes to the owner.** Result: **PASS_WITH_RISKS**

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`). It is graded against the
`ABC-151` page and `ADR-0040` addendum 2 as written, with `ADR-0035` d1's states.
- Base `B` = `f439c8fd` at k = 3. Twin `T` = the same commit, in a separate tree.
- Head `H` = `612b7b6d`, the branch tip (code `0035001c`) at k = 2.
- Resolved workers: B 3, T 3, H 2, `isolate: true`.
- Width 1. The run took 135 harness runs and 9 lane runs, with 0 harness errors.
- **Foreign load:** another project's test runner, from a different session, was alive during much of the window. See `…2983f397`.

Readings: `…78a8c8ea`. Heat: `…363fc14c`. Method and limits: `…2983f397`.

## Admissibility first

| set | twin T−B CPU median | sign (+) | twin CPU R | twin wall R | admissible |
|---|---|---|---|---|---|
| full lane, warm | +0.270 s (+1.04 % of B) | 5/8 | 0.680 s (2.63 %) | 0.230 s | **yes** |
| full lane, cooled | −0.115 s (−0.46 % of B) | 3/8 | 0.490 s (1.95 %) | 0.130 s | **yes** |

## The grades

| criterion | bar | reading | state |
|---|---|---|---|
| **`A3`** warm | H warm median wall + twin wall R ≤ 10 s | 9.035 + 0.230 = **9.265 s**. H load1 > 8 before 0 of 8 runs | **MET**, by 0.735 s. Because 9.265 s > 9.0 s, the cooled state was owed and was read |
| **`A3`** cooled (owed) | H cooled median + its own twin's wall R ≤ 10 s | 9.245 + 0.130 = **9.375 s** | **MET**, by 0.625 s. **The cooled state is the binding one at k = 2** (see below) |
| **`A4`** | head − base paired CPU, interval wholly below 0 | warm: **−2.345 s (−9.07 %)**, interval **[−11.25 %, −7.81 %]**, sign 0/8. Cooled, for the record: −1.080 s (−4.29 %), interval [−9.66 %, −0.95 %], sign 0/8 | **MET** (both intervals lie wholly below 0). Expected about −7.5 % |
| **`A5`** | reported, with no bar | k = 2: first read at level ≥ 1 at **run 5**, with **45 of 54** reads at ≥ 1. k = 3: first at **run 6**, with **43 of 54** reads. Both reached **level 2** (28 of 54 reads each) | **goes to the owner.** k = 2 reached level ≥ 1 no later, and on no fewer reads |
| **`A6`**, lanes' exits (`QE-151-d`) | each lane exits 0; counts equal base | 8 of 8 lanes at H **exit 0**. Files 56, and tests equal QE's base counts on every lane | **delivered** (QE graded the rest of `A6`) |

**Every run over 10 s** (`A3` asks that each be listed):
- warm: H round 5, 10.02 s;
- cooled: H round 1, 10.46 s, during a foreign load burst (load1 3.23 → 58.9);
- `A5` k = 2: **24 of 27** runs. The median was 10.27 s and the maximum 12.48 s;
- `A5` k = 3: 3 of 27 runs (10.01, 10.32 and 10.49 s).

The `A5` runs are not `A3`'s state, but they are listed here, as the page requires.

### The wall at k = 2, against the expectation

- **Expected about 8.2–8.5 s. Read: 9.04 s warm, 9.25 s cooled.**
- The paired cost against k = 3 is **+1.325 s warm** (interval [+1.14, +1.49], 8/8) and **+1.665 s cooled** ([+1.34, +1.85], 8/8). Window A's K2 − K3 arithmetic was +1.0 s.
- Today's base read 7.87 s warm, against Window B's head at k = 3 (7.54 s), so this session ran about 4 % slower. It ran on battery, and Window B ran on AC.
- **The cooled/warm factor at head is f = 9.245 / 9.035 = 1.023.** At base it is 0.971.
  - At k = 3, warm was the binding state (Window B, f = 0.939). **At k = 2, cooled binds.** This is `ABC-111`'s "the factor moves with parallelism".
  - Window B's proposed `NFR-008` trigger wording (`…e451fa31`) re-opens the warm/cold question when f > 1.0, with trigger W ÷ f = **9.77 s**. That wording is not in the catalog, and the row is not touched here.

## Security (ASVS L1)

**Not triggered.** The change is one runner literal and a value pin: no input surface, no dependency, no network, no
secret and no data path. **No security finding.**

## Result: **PASS_WITH_RISKS**. No required fixes

- **Nothing holds the merge** on the page's wording: `A3` ≤ W in both states, and `A4`'s interval is wholly below 0.
- **`A5` goes to the owner beside the merge.** Addendum 2 reads `A5` as not holding the merge, and BA/PM may overrule that.

| id | risk | severity (reason) | owner |
|---|---|---|---|
| `RISK-ABC151-HEAT-NOGAIN` (carries `RISK-ABC144-HEAT`) | **On this instrument, k = 2 did not buy the heat reduction it was picked for.** In 27 back-to-back head-only runs it reached moderate at run 5, against run 6 at k = 3. It spent 45 of 54 reads at level ≥ 1, against 43. It reached **level 2 (heavy)** at run 12, against run 13, with 28 reads at level 2 in each. By clock time it reached each level 5–17 s later than k = 3, which is within one run and one 15 s sample. **This is the first level-2 reading on record** (`…363fc14c`) | medium (the owner's stated goal and the ticket's reason; the page sets no bar) | **Olger Oeselg (owner)**: keep k = 2 (CPU −9 %, wall +1.3–1.7 s, no heat gain seen), return to k = 3 (addendum 2 Rollback), or another lever (Orchestrator width, idle between runs) |
| `RISK-ABC151-WALL-MARGIN` | k = 2's margin under W is **0.6–0.7 s** (cooled binds, f = 1.023). Under sustained heat, **24 of 27** k = 2 runs exceeded 10 s, against 3 of 27 at k = 3. `NFR-008`'s level reads warm and cooled medians, so `A3` is met, but back-to-back `npm test` on a hot machine runs over 10 s at k = 2 | medium (no bar is crossed, but the margin is the smallest on record for this level) | **Olger Oeselg (owner)**, who moves `NFR-008`'s level. Security/NFR re-reads at the next lane window |
| `RISK-ABC151-FOREIGN` | **The width-1 window shared the machine with another project's test runner** (`/Users/olgeroeselg/Projects/public/grugops`, a separate session). It was alive before 20 of 27 `A5` k = 2 runs, all 27 k = 3 runs, and most cooled runs. Its CPU is **unmeasured during `A5`** (the logger started at 17:36:46Z). In the cooled step and the lanes it averaged 12–22 % of one core, with bursts to 214–241 %. It touches both `A5` sequences, but not equally (20 vs 27 runs) | low (no grade flips on it; it blurs `A5`) | the Orchestrator (scheduling width 1 across the owner's other sessions) |
| `RISK-ABC144-FCAP` | Still open. This window's twins are base copies at k = 3 (R: warm 0.680 / 0.230 s, cooled 0.490 / 0.130 s), **listed, not used** (addendum 2 d4) | low | Architect/Design, at `ABC-152` `V9` |
| `RISK-ABC144-STALL` | One cooled H run took 10.46 s at a normal CPU of 26.12 s, while load1 jumped from 3.23 to 58.9. A foreign burst is the likely cause, but `UNKNOWN - verify` | low (no median moves) | Security/NFR |

**Recommendation to the Orchestrator** (the board is not touched here):
- the `In Security/NFR` exit;
- the UAT waiver applies on QE's reading (0 production `src/` lines);
- **the `A5` outcome goes to the owner beside the merge.**

Because the outcome undercuts the ticket's own reason, the Orchestrator may prefer to ask him before the merge rather than after it. Both routes are cheap: a return to 3 is addendum 2's Rollback.
