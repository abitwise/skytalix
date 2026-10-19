---
subtask: secnfr-ABC-167
role: security-nfr
ticket: ABC-167
page: plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md
branch: grugops/ABC-167 @ 660a0d50 (read-only; not committed to)
base: e286526d
ref: .grugops/context/secnfr-ABC-167/
done_at: 2026-10-19T08:58:30Z
result: PASS_WITH_RISKS. No required fix. Two LOW accepted risks: R-167-1 (QE-167-g, owner Security/NFR) and R-167-2 (N8-LANE OWED, owner Olger Oeselg, needs his word). NFR-004 MET. Triggers (a)-(d) not triggered. Nothing pushed, merged or committed.
---

# Security/NFR ABC-167 (lean)

Config: `asvs_level` L1, `block_on` high, `compliance_regime` []. The notes are hand-authored and unsealed, under
`.grugops/context/secnfr-ABC-167/notes/`. The decision is `…99713c0e`.

## Rulings
1. **Triggers (a)–(d): not triggered** (`…baba8a03`).
   - Only `src/uci-session.ts` and `src/uci-session.test.ts` are in the diff. No manifest.
   - The canonical `design-F-072-1/probe/clause-b.mjs e286526d 660a0d50` gives, on each of limbs 1, 2 and 3:
     (b1) 0; 8 new edges, 0 reaching a holder; 0 word hits.
   - The test spawns nothing.
   - `src/uci-session.ts` is unchanged `6922f772..660a0d50`.
2. **QE-167-g (M40/M42): ACCEPTED RISK R-167-1, LOW.**
   - The tip holds no `globalThis`, `global`, `Reflect` or `.constructor`. No UCI input selects a property, an
     import or code, so the evasion exists only as a future source edit.
   - Any such edit meets ADR-0036's instrument. It lists `globalThis["process"]` as a limb-2 word hit, and the
     fail-safe makes a disputed hit fire. ABC-168, the entry point that holds the capability, routes through
     `In Security/NFR` anyway.
   - **Residual:** M40 (`Math.random`) is a determinism break (ADR-0027), not a limb, and it gives no word hit.
     Obfuscated forms evade every text check. Only human review catches either one.
   - **Owner:** Security/NFR, carried to the ABC-171 and ABC-168 gates. Each of those gates greps the added
     lines of `src/uci-session.ts` for `globalThis`, `global`, `Reflect` and `constructor`.
   - **Optional, not required:** add those tokens to A11 on ABC-171. No follow-up ticket is asked for.
3. **NFR-004: MET** (`…37084be2`).
   - The budget is `min(G, 3000)` after parsing, the engine clamps at 5 000 again, and `depth`/`nodes`/`mate`
     only shorten.
   - The A5 cap rows read 3 000, and so do A6-d1 and A7-f2.
   - Edge probe on `virtualClock(100)`: huge, `Infinity`, `NaN` (wtime +Inf, winc −Inf) and negative budgets all
     read ≤ 3 100. `NaN` and negative budgets give depth 1. This is not a wall-clock reading.
4. **NFR-008 N8-LANE: OWED** (`…a4316655`).
   - The window was taken in the foreground on MacBook-Air.local from 08:50:59Z, for 180 s with 181 polls. It
     failed:
     - foreign processes in 118 of 181 polls;
     - a foreign `vitest` (`Projects/public/grugops`), 410 process lines;
     - 35 `oeselg-labs/platform` iTerm `pidinfo` lines;
     - load1 4.74–7.70.
   - No lane run was started and nothing was estimated.
   - **Merge can carry it as R-167-2 (LOW), on the owner's word** (the ABC-105 precedent `…d8e82358`). The delta
     is +1 file, with 0 spawns, on the virtual clock only. The CPU delta is `UNKNOWN - verify`. Owner: Olger
     Oeselg. It is discharged by the next admissible N8-LANE reading.
5. **QE-167-i: no security or NFR weight.** It is a parse-correctness gap only. The cap is applied after parsing,
   so no wrong build raises a budget. A7-i1..i6 now cover it at the tip.
6. **INFO (no fix):** C1 characters (for example U+0085) are echoed back to the sending GUI in an `info string`,
   as the page rules (C0/DEL filter only). No trust boundary is crossed. This is noted for ABC-168's
   stdout-hygiene candidate row (iii).

## Required fixes
None.

## Accepted risks
| id | severity | what | owner |
|---|---|---|---|
| R-167-1 | LOW | Bracket or obfuscated global access evades A11's text guard (M40/M42). M40 also gives no clause-b word hit | Security/NFR (ABC-171/ABC-168 gates) |
| R-167-2 | LOW | N8-LANE delta for +1 default-lane file is unmeasured (OWED; no quiet window) | Olger Oeselg (owner word needed to merge on it) |

## Trace row (for the Orchestrator to append; plans/traceability.md not touched)
| ABC-167 | NFR-004, NFR-008 | Security/NFR `secnfr-ABC-167` @ `660a0d50` (base `e286526d`) | **PASS_WITH_RISKS**: triggers (a)–(d) not triggered; NFR-004 MET; N8-LANE OWED (R-167-2); QE-167-g accepted (R-167-1); no required fix | `.grugops/context/secnfr-ABC-167/notes/…99713c0e` |

## Scratch
The worktree `../wt-secnfr-ABC-167` was removed with `git worktree remove` and `prune`. Probes are in
`.grugops/context/secnfr-ABC-167/probe/`: `nfr004.ts`/`.out` and `window.mjs`/`window1.out`. `../wt-ABC-167`,
`../wt-ABC-146`, `src/`, `plans/board.md` and `plans/traceability.md` were not touched. No foreign process
was touched.
