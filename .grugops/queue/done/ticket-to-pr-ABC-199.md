---
subtask: ticket-to-pr-ABC-199
role: software-engineer
ticket: plans/tickets/ABC-199-two-coverage-heavy-rows-time-out-at-vitests-5-s-default-under-load-lighten-them-and-keep-the-timeout.md
ref: .grugops/context/ticket-to-pr-ABC-199/
inputs: BA/PM …479ce351, …1563f813 (bapm-rule-QE-198); QE …0751bfeb (qe-ABC-198); owner ruling …6e1d9b47 (lighten, never raise the timeout); ABC-173 precedent
width: 2 (beside bapm-next-slice, records only)
---

# Build ABC-199: lighten two rows, add no timeout

## Do
- Create worktree `../wt-ABC-199` on `grugops/ABC-199` from `main`. Install its own `node_modules` with `npm ci --ignore-scripts`; never run npm in main's checkout.
- Build exactly to the page's criteria:
  - node counts at most 60 % of base;
  - K1–K4 red at the tip wherever they are red at base;
  - no added `timeout`;
  - test counts unchanged;
  - the written fallback applies if a row cannot get lighter without losing a kill.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success; skip-count capture → `test-skip-integrity.js`; `UCI_DEEP`. Heap 128 multi-file, 400 one-file. The UAT waiver form must print nothing.
- **No timing claims and no NFR-008 readings.**
- **Merge order:** ABC-199 merges only after ABC-178, so ABC-178's timing hop reads a tree without it. Do not merge into `main`. If `main` gains ABC-178 while you work, merge `main` in (a merge, not a rebase).
- Before every heavy run, check with `pgrep -fl '[v]itest'`. If a run named `qe-timing-ABC-178` is active, pause until it finishes.

## Fences
- Only the two files the page names. No `package*.json`, `tools/`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se199/`. Never push, force, amend or rebase.

## Publish
- Seal notes via the plugin writer (task `ticket-to-pr-ABC-199`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief, then move it to `done/`.

## Result

**Delivered.** Branch `grugops/ABC-199` in worktree `../wt-ABC-199` (own `node_modules`, `npm ci --ignore-scripts`), from `main` `08d42d01`. Tip **`8c0c5c81`**: `3d6856db` (the two test files), then `8c0c5c81` (notes). Not pushed, not merged. No timing or `NFR-008` reading was taken. **A4's fallback was not taken.** `main` had not gained `ABC-178` at 2026-10-22T18:59Z, so A5's base is `08d42d01`. After `ABC-178` lands, the branch owes a `main` merge (not a rebase) and an A5/A6 re-read before its gate.

Notes, sealed via `admitAndAppend` and read back 3/3 by `readContext`, in `../wt-ABC-199/.grugops/context/ticket-to-pr-ABC-199/notes/`:
- observation `…c662ec3c`: census and K1–K4 (A1–A3);
- observation `…925c7566`: A5/A6 gates;
- decision `…71bb85ca`.

### Per criterion
| crit | result |
|---|---|
| A1 | **MET**. `MAX_NODES` 20 000 → 6 000. Rows 1 and 2 pass. Row 1's bound is unchanged in form. d = 2 (≥ 2); `limited.nodes` 6 746 > `completedOnly.nodes` 2 538. Row 2 census 35 759 → **11 221 (31.4 %)**; row 1 alone 20 058 → 6 746. Row 3, `LONG_MS` and `tickingClock(1)` are byte-identical |
| A2 | **MET**. Unlimited `go` at step 100; free depth 6 → **5**, so the floor stays ≥ 5 and the title is unchanged. Capped half unchanged (step 50, 2 lines, depth 3, 655 nodes). Census 55 972 → **26 276 (46.9 %)** |
| A3 | **MET**. K2 red at base and tip (5 112 410 > 21 024 / 7 024); K3 red at both (6 ≠ 3); K4 red at both (4 ≠ 3). **K1 GREEN at base**: depth 4's partial at 20 058 nodes equals depth 3's result (e2a6/70). It is reported, not counted. K1 is RED at tip (70 ≠ 109) |
| A4 | Not taken; neither row needed it |
| A5 | **MET**. Name-only lists the two test files plus 3 notes. 0 `+` lines contain `timeout`; `vitest.config.ts` unchanged. One hunk each, inside the two describes. Sorted test names byte-equal (1 995); per-file counts equal on 60 files |
| A6 | **MET**. lint/typecheck/build 0. `npm test` 60/1 995 = base, `last-run.json` fresh, `success: true`. Skips 0 → `No findings.`. Both coverage commands: 2/2 runs each, 1 995 passed, 0 failed (summary line; rc also 0). ENGINE_DEEP 60/60, UCI_DEEP 5/5. Waiver form prints nothing |
| A7 | owed: QE |
| A8 | owed: Security/NFR |

### Trace row
| ABC-199 (ticket-to-pr-ABC-199) | lighten two coverage-heavy rows, no timeout (QE-198-a): ABC-170 A2 MAX_NODES 20 000 → 6 000 (d 3 → 2); ABC-167 A7 row 1 unlimited go step 50 → 100 (floor 5 kept) | EPIC-007 | — | N8-LANE (A8 owed); NFR-008 not read | grugops/ABC-199 @ 8c0c5c81 (tests 3d6856db)<br>src/engine.test.ts (8/1), src/uci-session.test.ts (8/1), .grugops/context/ticket-to-pr-ABC-199/notes/ (3) | census row 2 35 759 → 11 221 (31.4 %), A7 row 1 55 972 → 26 276 (46.9 %); K2–K4 red base+tip, K1 green base (not counted) / red tip; lint/typecheck/build 0; npm test 60/1995 = base (names equal), success true; skips 0, No findings.; coverage ×2 forms 2/2, 0 failed; ENGINE_DEEP 60, UCI_DEEP 5 | UAT waived (0 production lines; waiver form empty; not a signature) | — | In Development → In Review (QE A7, Security/NFR A8 owed; merges after ABC-178, main merge-in owed) |
