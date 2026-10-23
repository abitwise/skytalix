---
subtask: ticket-to-pr-ABC-197
role: software-engineer
ticket: plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md
ref: .grugops/context/ticket-to-pr-ABC-197/
inputs: BA/PM re-rule …4bb78960, …b4d5793f; Architect …578a9290 (F = 0.070 s, the dated block on the page); Security/NFR …d0c770b5 (headroom 0.990 s); QE-178-f (…931fad2b, optional QP1d)
width: 2 (beside qe-ABC-201)
---

# Build ABC-197 (R2): one step-100 UCI row restores the 100 ms dropped-token budget band

## Do
- Create worktree `../wt-ABC-197` on `grugops/ABC-197` from `main`, with its own `npm ci --ignore-scripts`. Never run npm in main's checkout.
- Build exactly to the page: the row's shape and criteria, red-first on its named plants, and the Architect's dated block (pre-register A6 with F = 0.070 s, not `16pct`). QE-178-f's QP1d is optional, as the Orchestrator ruled.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` (expect 61 files / 2 019 tests if one row is added); skip capture → `test-skip-integrity.js`; `UCI_DEEP`. Heap 128 multi-file, 400 one-file. The UAT waiver form must print nothing.
- **No timing claims.** A6 (N8-LANE) and A7 (NFR-008) are taken by a later quiet-host QE timing hop.
- The page's cost line still cites the old 0.605 s headroom; the current figure is 0.990 s (`…d0c770b5`). Note it, and do not edit the estimate.

## Fences
- Only the file(s) the page names. No `package*.json`, `tools/`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se197/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `ticket-to-pr-ABC-197`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**Built to the page. A1–A4 MET; A8's SE part green. A5 carries a page defect, routed to BA/PM.** Branch `grugops/ABC-197` in worktree `../wt-ABC-197`, from `main` `051d557a`. Tip **`20e397c8`**, one commit (`src/uci-session.test.ts` +11/−0). Not pushed, not merged, no timing taken.

Notes are sealed via `admitAndAppend` and read back 4/4 by `readContext`. They are uncommitted in `../wt-ABC-197/.grugops/context/ticket-to-pr-ABC-197/notes/`, kept off the tip so A2's `--name-only` stays one file:
- observation `…eeec2b5f`: A1–A4 readings, red-first and plants, the G scan, M4;
- observation `…ba08acdc`: A5's QP6-2900/-3300 cannot go red under A1 as written;
- observation `…78292c2d`: gates, the timing hop's inputs, the cost-line drift;
- decision `…3c9e5d2b`.

| crit | result |
|---|---|
| A1 | **MET**. R2 sits in `ABC-167 A7` after U7's loop: `["position startpos","go depth 0"]` on step 100. 3 lines; `info string`; reads `time 3100` (bound [3 000, 3 200]); `bestmove g1f3` = the info move |
| A2 | **MET**. `--name-only 051d557a 20e397c8` = `src/uci-session.test.ts`. `-U0`: one hunk with 0 `-` lines; 1 comment line citing ABC-197/QE-177-b, the 9-line row, and 1 blank separator line (flagged, as at ABC-178) |
| A3 | **MET**. Lane 2 018 → 2 019 (61 files each), success true, 0 skipped. `uci-session` 127 → 128, all passed. The base names are a sub-multiset of the tip's; the difference is R2's name only |
| A4 | **MET**. 25 621 nodes (≤ 26 000) via the byte-copied `census.mjs`; the other 127 rows are unchanged. Not committed |
| A5 | QE's. **The page defect:** QP6-3300 is clipped by the level cap (`Math.min(G, level 3 000)`), so it is equivalent at the session boundary. QP6-2900 reads `time 3000`, which passes `≥ 3 000`. Both survive R2; QP6 (2 500) reds R2 alone. Route to BA/PM before the A5 gate |
| A6, A7 | owed: a quiet-host QE timing hop. A6 pre-registers F = 0.070 s (`readout174a.py <dir> n8-lane 0.070 changed`), with B = `git archive 051d557a` and H = `git archive 20e397c8` |
| A8 | SE part green. lint/typecheck/build 0; `npm test` 61/2 019, success true; skip capture 0 → `No findings.`; `UCI_DEEP` 5/5; the M4 row is green and a planted `write("done")` reds it. QE re-reads |

QP1d (QE-178-f) was **declined**: it edits R1, which A2 and § Out of scope forbid. The page's cost line still cites 0.605 s headroom; the current figure is 0.990 s (`…d0c770b5`). I noted this and did not edit it. The UAT waiver form prints nothing.

### Trace row
| ABC-197 (ticket-to-pr-ABC-197) | one additive step-100 dropped-token row R2 in ABC-167 A7 (go depth 0, time in [3 000, 3 200]) restores QE-177-b's kill of G 2 500 | EPIC-007 | — | QE-177-b; NFR-008; N8-LANE; ADR-0046; A5 defect (QP6-2900/-3300 unkillable under A1, → BA/PM) | grugops/ABC-197 @ 20e397c8<br>src/uci-session.test.ts (+11/−0), .grugops/context/ticket-to-pr-ABC-197/notes/ (4, uncommitted) | lint/typecheck/build 0; npm test 61/2019 = base + 1 (names ⊇ base), success true; skips 0, No findings.; UCI_DEEP 5/5; red-first QP6 1/128 (R2); census 25 621; M4 kill held | UAT waived (0 production lines; waiver form empty; not a signature) | — | In Development → In Review (QE A5–A7 owed; A5 needs a BA/PM re-rule first) |
