---
id: 20261022T160354Z-software-engineer-decision-7e9699c3
kind: decision
by: software-engineer
at: 2026-10-22T16:03:54Z
verified_by: 
confidence: high
refs:
  - ABC-198
  - ABC-192
  - AR-1
  - RISK-ABC143-01
  - RISK-ABC173-STATE
  - 4952425a
  - a42f4bbb
  - d1a175f5
  - 20261022T154813Z-ba-pm-decision-1a123d24
  - 20261022T160059Z-software-engineer-observation-59297619
  - 20261022T160319Z-software-engineer-observation-f4334765
  - 20261022T160338Z-software-engineer-observation-240b63df
supersedes: 
seal: sha256:1862cafb2673f5f91c5bd5762fb96ec9e7b6d10766d054e0d3564c3f85c826de
---

# ABC-198 built as cut: the one scope command (vite IN, no fallback), and the literal re-pinned only after `BUMP_RERUN_LIST` (1)–(3) passed. No hand-trim, no range change, no other file. One exit-code-only transient is routed to QE as `UNKNOWN - verify`

Software Engineer, task `ticket-to-pr-ABC-198`, 2026-10-22. Branch `grugops/ABC-198`: `a42f4bbb` (lock), `d1a175f5` (literal and readings note), then this note's commit. The base is `main` `4952425a`.

## Decisions
1. **The lock comes from the page's command only.** The diff matched A1 on the first run (`53 53`, 10 packages, sha prefix `5d48a904…` = BA/PM V5), so nothing was trimmed or re-run. `package.json` is byte-equal.
2. **Vite stays in.** A5 is green with vite 7.3.7 (`…240b63df`), so the fallback's condition (red with vite, green without) never arose. BA/PM has nothing to re-rule.
3. **The literal was re-pinned in a separate commit after the readings were sealed.** `d1a175f5`'s message cites `…59297619`. The `4.1.11` comments (`vitest.config.ts`, `heap-guard.js`, `src/cli.test.ts:377`) are left as the ticket fences them.
4. **The plant rows ran in a scratch clone with the literal set to 4.1.12 there only,** so the green row was green and every red was the planted one. That is the code under test at the tip, minus the note.
5. **The exit-code-only transient is not fixed or explained away.** On 1 of 5 head runs a `src/engine.test.ts` `ABC-170 A2` row failed under coverage. Base read 3 of 3 clean. The message was lost (log overwritten), so the cause is `UNKNOWN - verify`.
   - The reporter still read `success: false` and named the test, so (2) is met on what it pins.
   - It does not touch `npm test` without coverage (A5 green; names equal base).
   - Routed: QE may re-run the row under `A6`/(2) and read the failure if it recurs.

## Board and trace
- The Software Engineer's move is `In Development → In Review`, but `plans/` is fenced for this hop. The trace row is in the done record. The Orchestrator applies the board move and the trace row.
- Owed next: QE (`A1`–`A7`, including the `A7` socket probe), then Security/NFR clause (a) (`A8`).
