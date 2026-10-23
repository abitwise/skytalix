---
subtask: bapm-rerule-ABC-197-A5
role: ba-pm
ticket: plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md
ref: .grugops/context/bapm-rerule-ABC-197-A5/
inputs: SE …ba08acdc (the A5 problem), …eeec2b5f (G scan, plants), …3c9e5d2b in .grugops/context/ticket-to-pr-ABC-197/notes/ (copied from ../wt-ABC-197, where they stay uncommitted to keep A2's file list); branch grugops/ABC-197 @ 20e397c8; Security/NFR …d0c770b5 (headroom 0.990 s); Architect …578a9290
width: 1
---

# Re-rule ABC-197's A5: two of its four plants cannot go red under A1's bound

## The problem (the SE's reading; verify it from the code, not only the note)
- **QP6-3300:** `go` clips with `Math.min(request.budgetMs, level.budgetMs)`, and no level allows more than 3 000. Any G above 3 000 is output-identical to the correct build, so no test row on any level can catch it.
- **QP6-2900:** at step 100, G 2 900 reads `time 3000`, which passes `≥ 3 000`. R2 catches G ≤ 2 800 and misses about [2 850, 3 000).
- The page's Problem line has the same slip ("caught any G at or below 2 900 ms").

## Do
- Verify both claims by reading `src/` and the SE's evidence (`/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se197/`). Do not run timing; small scratch test runs to confirm a plant are allowed.
- Re-rule A5. Options:
  - drop QP6-3300 as unkillable by design, with a reason;
  - move the 2 900 probe to a G the row can catch;
  - tighten A1's bound, if that is within the ticket's scope and costs no new spawn;
  - your call.
- Correct the Problem line with a dated erratum. Refresh the stale headroom cost line (0.605 → 0.990 s, `…d0c770b5`).
- Keep DoR 10/10. If the fix needs code beyond the built row, say whether the SE must re-build. If a bound or requirement would move, STOP and raise it as an owner question.

## Fences
- Records only, plus scratch confirmations under `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm197/`. Work on `grugops/bapm-rerule-ABC-197-A5` (worktree `../wt-bapm-rerule-ABC-197-A5` from `main`). No `src/`, `tools/`, `package*.json` or `AGENTS.md`. On `plans/board.md`: one `_Updated` line. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `bapm-rerule-ABC-197-A5`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result (ba-pm, 2026-10-23T08:24Z): **The claims are verified. A5 is re-ruled: QP6-2900 → QP6-2800, and QP6-3300 is dropped as equivalent by design. A1 does not move, and there is no re-build. Problem erratum written, cost line refreshed, DoR 10/10. No owner question.**

These are records only, on `grugops/bapm-rerule-ABC-197-A5` in `../wt-bapm-rerule-ABC-197-A5`, cut from `main` `01bf3b8d`. There is one commit, **`a9a40877`**; it is not merged and not pushed. Scratch confirmations are in `…/scratchpad/bapm197/` (`scan.out`, `upper.out`, `vt.out`, `vtbase.out`): counts only, on `git archive` trees of `20e397c8` and `051d557a`, each source restored and `cmp`-checked. No timing ran.

Notes are in `.grugops/context/bapm-rerule-ABC-197-A5/notes/`. They were sealed with grugops 2.1.0 `context-io.js` `admitAndAppend` (context root: the worktree's `.grugops/context`) and read back 2/2 by `readContext`:
- `20261023T082311Z-ba-pm-observation-9712ad09`: the verification (from `src/`, the G scans at step 100 and step 1 000, the upper edge, the one-file vitest runs);
- `20261023T082318Z-ba-pm-decision-4df5ef95`: the rulings.

| item | ruling |
|---|---|
| The claims | **Verified, with one sharpening.** On the dropped-token path, the parse G is `HARD_CEILING_MS` 5 000. `go` caps it with `Math.min(request.budgetMs, level.budgetMs)`, and every level is ≤ 3 000. The virtual clock returns its reading and then adds `s`. `chooseMove` stops at the first reading ≥ G and reads once more. So `time = (⌈G/s⌉+1)·s`. At step 100: G ≤ 2 800 reads ≤ 2 900 (red). G 2 801–2 900 reads 3 000 and G 2 901–3 300 reads 3 100 (all green). The blind band is exactly **(2 800, 3 000)**, not "about [2 850, 3 000)". |
| QP6-2900 | **→ QP6-2800.** This is the largest whole-ms G that R2 catches. It reds R2 alone at the tip (1/128, "expected 2900 to be ≥ 3000"), and the base file survives it (127/127). It is the one scratch variant now. |
| QP6-3300 | **Dropped, not replaced.** It is output-identical to the correct build: `time 3100`, 25 621 nodes, `g1f3`. A skipped-cap probe was considered and declined: it reds R2, but 16 base rows red it too (17/128), so it shows no kill R2 adds. |
| A1 bound | **Unchanged (option 3 declined).** `≥ 3 100` would move a binding bound, need a re-build, and break the house `G ≤ time ≤ G + 2s` shape. It would buy 100 ms on a LOW gap, below what the base ever had. |
| Problem line | **A dated erratum.** The band is 2 × step. Step 100 kills G ≤ 2 800 (not 2 900), and step 1 000 kills G ≤ 1 000 (not 2 000). The band went from 200 to 2 000 ms, not from 100 to 1 000. The title's and § Scope's figures are corrected there. "The upper side gets pinned too" is struck. The slip came from QE `…02deb2e2`. |
| Cost line | ≈ +0.075 s is **≈ 7.6 % of the 0.990 s** headroom at `00f77f26` (`…d0c770b5`), up from 12 % of 0.605 s. The estimate is unchanged. |
| DoR | **10/10.** Item 10 flipped per `…8c94d901` / `…39e59d96`. Items 3–4 now read three probes, each with a reachable outcome. |
| Re-build | **None.** R2 at `20e397c8` meets the re-ruled A5 in scratch. Its comment's "U7's 1 000 band" reads 2 000 by the erratum; it is a comment only. |
| Owner | **No question.** No bound, level or requirement moved. |

Files on the branch:
- `plans/tickets/ABC-197-…md` (+50/−4): the erratum, A5's table and re-rule block, the cost line, the DoR re-check;
- `plans/board.md`: +1 `_Updated` line;
- `plans/traceability.md`: +1 row;
- 2 notes.

Not touched: `src/`, `tools/`, `package*.json`, `AGENTS.md`, every other card, other worktrees, git config. In main's checkout, only this queue record and its claim moved, uncommitted, for the Orchestrator.

**Next:** QE's A5 at the tip runs `gp.mjs` plus QP6-2800, at file and lane. A6/A7 stay with the quiet-host timing hop. The ticket stays In Development.

### Trace row (10 cells, header order)

| ABC-197 (bapm-rerule-ABC-197-A5) | A5 re-ruled: QP6-2900 → QP6-2800 (R2 kills G ≤ 2 800 only; red 1/128 at tip, base 127/127); QP6-3300 dropped as equivalent by design (level cap clips G ≤ 3 000); A1 unchanged; Problem erratum (band = 2 × step: 200 → 2 000 ms, not 100 → 1 000; "upper side pinned" struck); cost line 7.6 % of 0.990 s; DoR 10/10 | EPIC-007 | — | QE-177-b; NFR-008; N8-LANE (both unchanged); ADR-0046; notes …ba08acdc, …eeec2b5f, …d0c770b5, …02deb2e2, …8c94d901, …39e59d96, …9712ad09, …4df5ef95 | grugops/bapm-rerule-ABC-197-A5 @ a9a40877 (records only)<br>plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md | — (records only; scratch counts on 20e397c8/051d557a: QP6-2800 R2 red 1/128, base 127/127; QP6-2801 green; G ≥ 3 000 → time 3100 identical; no timing) | waiver expected (0 production lines) | — | In Development (unchanged); no re-build; QE A5 with QP0/QP6/QP6-2800, then A6/A7 timing hop |
