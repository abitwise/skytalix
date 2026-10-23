---
subtask: qe-ABC-212
role: qe-e2e
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/qe-ABC-212/
branch: grugops/arch-runbook-ABC-212 (c0508fe9) — the full ABC-212 line: build + pins + AGENTS.md + runbook
width: 1 — ALONE (ENGINE_DEEP real-clock A4 ~7.5 min; never beside another hop or a harness reading). Dispatch only on an idle board, AC.
---

# QE gate for ABC-212 (levels 6–7)

## Do
- Own worktree from `grugops/arch-runbook-ABC-212` (`c0508fe9`); merge current `main` first (report sha); own `npm ci`.
- Verify the SE's criteria independently (re-run load-bearing plants). Then: **A3** 50/50 identity at levels 1–5 vs base; **A4** `ENGINE_DEEP` levels lane (level 6 30/30 in 5.0–7.0 s, level 7 10/10 in 30–32 s, max depth logged; depth ≥ 100 → Architect); **A10** pty at level 7 (thinking frame, 30–32 s/move, Ctrl-C ends within 1 s); **A15** level-7 depth ≥ level-5 + 1 on kiwipete and position-6. Preconditions per timed run: AC, load1 ≤ 8, no foreign vitest.
- Gates at your merge: lint, typecheck, build; `npm test` + `last-run.json`; skips; `CLI_DEEP`, `UCI_DEEP`.
- Verdict PASS / PASS_WITH_GAPS / FAIL; UAT is signed by your verdict (production lines); list what the owner should try by hand.

## Fences
- Only your worktree and `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe212/`. Notes + dated `## QE` addendum on the page. No `src/` edits. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `qe-ABC-212`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
