---
subtask: qe2-ABC-171
role: qe-e2e
ticket: ABC-171
branch: grugops/ABC-171 @ 5dee231c
ref: .grugops/context/qe2-ABC-171/
---

# QE re-check of ABC-171 after the rows hop (lean)

## Background
- Your first pass, `qe-ABC-171`, was PASS_WITH_GAPS.
- Since then BA/PM amended A8 and added A13a–d (`bapm-adr0045-cut`).
- The SE added those rows at `b62baabc` (tip `5dee231c`). See the done file `ticket-to-pr-ABC-171-rows.md`.

## What to check
1. Each of A8, A13a, A13b, A13c and A13d is present, passes, and kills its named mutant. The mutants are S12, S25, S31, S32, S33, S38 and S39. Re-run your `mutants3.mjs` set on a scratch copy.
2. Rule each gap QE-171-a to QE-171-f as closed, accepted or open.
3. Run the gates at the tip:
   - `last-run.json` shows `success: true` with the full count;
   - integrity at skip 0;
   - `merge-tree` against main is clean.

## Timing
- N8-LANE may be read only in a foreground-verified 180 s quiet window. Otherwise record it as OWED.
- Never estimate it.
- An ABC-173 SE hop may be running lanes in parallel. If so, the window is not quiet.

## Fences
- Work in a scratch detached worktree, `../wt-qe2-ABC-171`, and remove it at the end.
- Do not touch:
  - `src/`
  - `plans/board.md`
  - `plans/traceability.md`
  - `../wt-ABC-171`
  - `../wt-ABC-173`
  - any process you did not start
- Do not fix anything. Never push, merge or self-sign.

## Publish
- Hand-authored, unsealed notes under `ref:` in main's working tree, including a `kind: decision` note authored by `qe-e2e`.
- `.grugops/queue/done/qe2-ABC-171.md` and `.claim.md`, uncommitted. Include the verdict, each gap's state, the mutants, the gates, N8-LANE and a trace row.

---

## Result (qe-e2e, 2026-10-19): **PASS**, with N8-LANE OWED

- **Where:** the scratch worktree `../wt-qe2-ABC-171`, detached at `5dee231c`, now removed. The mutants ran on a
  fresh scratchpad copy made by `git archive`. It was `diff -rq`-identical to the tip, and it is now deleted.
- **What I did not touch:** `src/`, `plans/board.md`, `plans/traceability.md`, `../wt-ABC-171`, `../wt-ABC-173`, or
  any process I did not start.
- Nothing was fixed, pushed or merged. Nothing was self-signed.
- **Notes**, under `.grugops/context/qe2-ABC-171/notes/` (hand-authored, unsealed, uncommitted):
  - the rows and gates: `…90488973`;
  - the mutants: `…443377ed`;
  - N8-LANE: `…7a2a5442`;
  - **the decision, `…d60ef4d9`, PASS**, authored by `qe-e2e`. It supersedes `…9d61b7e3`.
  - The window script, its output and the mutant logs are in `probe/`.

### 1. Rows and mutants
| row | present and green | named mutants |
|---|---|---|
| A8 (reworded) | yes: the existing row is now at step 100; +1 row, each `BLUNDER_LEVELS` searched `go` draws exactly 1 | — (its book-hit half is A13b) |
| A13a | yes: 2 non-vacuity rows + k = 1..8, 8/8 | S32 **KILLED**, S33 **KILLED** |
| A13b | yes: a precondition row + levels 1 and 2 | S25 **KILLED**, S31 **KILLED** |
| A13c | yes: `go nodes 100`; `go depth 3 nodes 100 mate 2` | S38 **KILLED**, S39 **KILLED** |
| A13d | yes: `OwnBook value maybe`, then the book answers | S12 **KILLED** |

- **Full `mutants3.mjs` set** (file mode, harness md5 unchanged): **94 run, 80 killed, 14 survived** (was 73/21).
  - ABC-167 set: 37/44, unchanged.
  - ABC-171 set: 43/50, was 36.
  - Exactly the 7 named mutants flipped to KILLED, and none flipped back.
- **Survivors, all ruled:**
  - M09, M10 and N08: equivalent;
  - M38 and M41: lint;
  - M40 and M42: R-167-1;
  - S02, S03 and S07: QE-171-f, accepted;
  - S29, S45 and S47: equivalent;
  - S46: not observable.

### 2. Gaps
- **QE-171-a: CLOSED** (A13a).
- **QE-171-b: CLOSED** (A8 reworded, and A13b).
- **QE-171-c: CLOSED** (A13c).
- **QE-171-d: CLOSED** (A13d).
- **QE-171-e: ACCEPTED for ABC-171, routed to ABC-168.**
  - ABC-168's page already pins the `warn` → `info string <message>` binding (Scope 1) and one book warning away
    from the clone.
  - D10's exact wording is not pinned there. That residue is INFO for ABC-168's QE.
- **QE-171-f: ACCEPTED.** BA/PM ruled f1–f4 ACCEPT with no row.
- **New: QE2-171-g, INFO, routed to ABC-174.**
  - ABC-174's § Pins that move cites the ABC-171 A8 row at `src/uci-session.test.ts:877-893`. At `5dee231c` it is at
    `:882-897`.
  - Every other pin line checked holds.

### 3. Gates at `5dee231c`
- lint 0, typecheck 0, build 0.
- `npm test` exit 0: 59 files, 1962/1962.
- `.test-results/last-run.json`: **`success: true`**, `numTotalTests` **1962**, 1962 passed, 0 failed, 0 pending.
- `test-skip-integrity .grugops/test-skips.md --skip-count 0`: **`No findings.`**
- `git merge-tree --write-tree main 5dee231c`, against main `68bbf33f`: **clean**.
- **A12:** the `src` diff against main is exactly the two files.
- **R-167-1:** only the test's A2 `"constructor"` literal.

### N8-LANE: **OWED**
- **The window:** in the foreground on MacBook-Air.local, from 2026-10-19T12:41:50Z for 180 s, with 181 polls. This
  was before any QE load.
- **Foreign processes in 181 of 181 polls:**
  - the `oeselg-labs/platform` workers;
  - a `Projects/public/grugops` vitest run, which started inside the window.
- An ABC-173 SE hop (`../wt-ABC-173`) started during this hop.
- load1 was 3.67–6.41.
- Nothing was timed or estimated.

### Next column
- **Recommended:** `In Security/NFR`, for N8-LANE, or an owner word like R-167-2's.
- **Then the owner's UAT:** `src/uci-session.ts` is +97/−15 against main, so the waiver does not apply.
- The Orchestrator decides.

### Trace row (for the Orchestrator to append; QE did not edit `plans/traceability.md`)
| ABC-171 | EPIC-007 / ADR-0044 D2, D3, D10, D11; amended bapm-adr0045-cut | `grugops/ABC-171` @ `5dee231c` (rows `b62baabc`; code `b6afd021`) | `src/uci-session.ts`, `src/uci-session.test.ts` | QE `qe2-ABC-171`: A8 reworded + A13a–d present and green; S12/S25/S31/S32/S33/S38/S39 killed by their rows; mutants 94 run / 80 killed / 14 survived (all ruled; ABC-167 set 37/44 unchanged); 1962/1962, success true; skips 0 No findings; merge-tree clean vs main `68bbf33f`; N8-LANE OWED (no quiet window) | PASS: QE-171-a..d CLOSED, -e ACCEPTED (routed to ABC-168, substance pinned there), -f ACCEPTED (BA/PM); new QE2-171-g INFO → ABC-174 (A8 pin line ref drift); → In Security/NFR, then owner's UAT |
