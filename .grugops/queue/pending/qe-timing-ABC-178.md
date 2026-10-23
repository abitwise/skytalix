---
subtask: qe-timing-ABC-178
role: qe-e2e
ticket: plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md
ref: .grugops/context/qe-timing-ABC-178/
branch: grugops/ABC-178 (tip 0036e5c6); QE re-read grugops/qe-ABC-178 @ 2aeeabda; main 397dca2a
width: 1 (ALONE: the owner has paused his other session; no other hop runs)
---

# The owed quiet-host timing hop for ABC-178: B7 (N8-LANE) and B8 (NFR-008), now on vitest 4.1.12

## Preconditions (check before EVERY scored window, and record each reading)
- `pmset -g batt` reads `AC Power`. A battery reading is not admissible (owner `…bfdc97e5`).
- load1 ≤ 8.
- `pgrep -fl '[v]itest'` shows no foreign vitest; only your own runs may appear.
- Thermal rule (ABC-178 page): "thermal kept and flagged". Keep the reading and flag thermal state if you see it.
- If a precondition fails, wait and re-check; do not score that window. If the host never becomes admissible, report UNRESOLVED with the readings. Do not guess.

## Do
- Create your own worktree `../wt-qe-timing-ABC-178` on `grugops/qe-timing-ABC-178` from `grugops/qe-ABC-178` (`2aeeabda`). **Merge the current `main` into it first** (a merge, not a rebase). `main` now carries ABC-198's vitest 4.1.12 lock. Report the merge sha. Install with your own `npm ci --ignore-scripts`.
- Before timing, a correctness check at the merge: lint, typecheck, build; `npm test` + `last-run.json` success (expect 60 files / 1 996 tests); `UCI_DEEP`.
- **B7** exactly as the page states (ABC-177 A8 protocol, `lane174.mjs` byte copy, 9 rounds, round 0 discarded, rotated, GAP 0, k = 2, CPU from `/usr/bin/time -p`). B is `git archive` of `main` at the merge base. H is `git archive` of your merge. Report the charge against ≤ 650 ms CPU, and the H−B CPU and wall medians with intervals.
- **B8** exactly as the page states (ABC-177 A9 protocol: `npm test` as spelled, B and H each with their own `npm ci`, `window.mjs` 180 s foreground, 0 foreign polls, load1 ≤ 8, AC on every scored run). The T/H2 twins are your option. Report H's R-1 median wall against ≤ 10 s. B8 also serves as the Architect's clean re-read (`…ee7527cc`), so report all the arms you ran.
- Also report B's full-lane median on vitest 4.1.12. It is the first admissible reading on the new runner, and ABC-197's pull trigger (≤ 9.2 s) reads it.
- **If H reads > 10 s, the reading goes to the owner** (ADR-0035 D6). Say so plainly and stop.
- Verdict for B7/B8: MET, NOT MET or UNRESOLVED, plus an overall ABC-178 verdict that includes your earlier B1–B6 and B9 re-read.

## Fences
- Work only in `../wt-qe-timing-ABC-178` and `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe178t/`. Commit notes plus a dated addendum to the `## QE` section on the ABC-178 page in your worktree. No `src/` edits, no `package*.json`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `qe-timing-ABC-178`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
