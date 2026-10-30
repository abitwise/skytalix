---
subtask: qe-ABC-225-w1
role: qe-e2e
ticket: ABC-225
ref: .grugops/context/qe-ABC-225-w1/
branch: grugops/ABC-225 @ 933d9f35 (main 14c8aafa merged in 3dca0e67; tools/rating only); QE commits on new grugops/qe-ABC-225-w1 from 933d9f35 (worktree .claude/worktrees/qe-ABC-225-w1)
width: ALONE (40 games, ~2.2–2.4 h)
---
# QE ABC-225: A5/A6 at --concurrency 1 (owner word …65848126), A1–A4 re-check
## Read
ABC-225 ticket (A1–A6 as re-worded 2026-10-30), the first QE's records on grugops/qe-ABC-225 @ 3da78303 (FAIL on THERMAL STOP at width 2;
A1–A4 met; its scripts), se-ABC-225-main notes (`…0813b232`, `…a9f5834c`, `…2f0a5298` — the A5 command shape and what to confirm).
## Do
- PREREG first, sealed and committed before any game.
- A1–A4 re-check (offline: `node --test tools/rating/pair-check.ts`, dry-run argv vs `r`). Gates via `npm run …`.
- A5 ALONE, `--concurrency 1`, per the ticket (dry-run first; literal shas; base/candidate as the ticket names). Wait-clear by polling
  `kill -0 <pid>` on any foreign vitest/cutechess (never `while pgrep -f`). Thermal stop: Tctl median > 85 °C → STOP (not read).
  If the run dies without a thermal stop, record it VOID and STOP — do not loop.
- A6: wall from schedule.log, games/hour, projected 400-game pair at width 1.
- Confirm what the SE flagged: cutechess honours start=S, nps in every block, Tctl via k10temp, block Elo vs pooled formula.
- Rule the SE's LOW (r literal 4000 vs passed-but-unread budget).
## Fences
No src/, tools/, data/ edits. Never push, force, amend, rebase, merge into main. No board edits. Never bare npx/npm exec. No host paths
in commits. Scratch `qe-225-w1/`. Tool env file outside the repo, mode 600, pins verified.
## Publish
Sealed notes (task `qe-ABC-225-w1`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-10-30, QE/E2E. PASS_WITH_GAPS. Branch `grugops/qe-ABC-225-w1` (worktree `.claude/worktrees/qe-ABC-225-w1`, from `933d9f35`): PREREG `b4d7d5d5` (sealed before any game), records `f37afe5c`. Records only; `tools/`, `src/`, `data/` untouched; not merged, nothing pushed.**

- **A1–A4 MET** (observation `…5d562743`): `pair-check` 22/22; QE's own dry-run compare, 20 + 2 block-runs, 4 differing positions each, `st=4 timemargin=1000`, `-concurrency 1`; ABBA, 1–100 once per build. Gates via `npm run`: lint/typecheck/build 0, `npm test` 63 files / 2 322, skips 0, `No findings.`
- **A5 MET** (observation `…7e9bd36f`): `rpair 02fa9556 baf99a7c <out> --rounds 10 --concurrency 1`, 20:38:03–22:29:08Z, rc 0, no thermal stop, ALONE (a foreign vitest in 1 of 111 watcher samples, logged). `nps.log` 2 lines (1 635 048 / 1 753 018); `thermal.log` 666 samples, max gap 11 s, Tctl **median 74.1 °C, max 78.8 °C**; block Elo lines = QE's formula copy (52.5 ± 151.0; −17.4 ± 158.6); coverage clean; 0 host-path hits; `SHA256SUMS` OK.
- **A6 MET:** play wall 20:38:07Z → 22:28:52Z = **1.846 h**, **21.67 games/h**; 400-game pair at width 1 projected at **18.46 h** (17.5–19.4 h), against the ticket's estimate of about 22–24 h.
- **SE's four points confirmed:** `start=S` (direct `start=51` probe → EPD 51/52), nps per block, k10temp Tctl, block Elo = pooled formula.
- **SE's LOW ruled:** confirmed, LOW, non-blocking (the `r` path ignores `budget`; A1 holds by construction). Follow-up for the backlog.
- **Elo (INFO):** pair −69.9 ± 219.0 NEUTRAL; pentanomial −69.9 ± 214.0.
- **Gaps:** QE-225w1-a LOW (budget field), -b LOW (projection below estimate; BA/PM may restate), -c/-d/-e INFO. Verdict decision `…d0807789`.
- STOP: none.

### Trace row (10 cells, header order)

| ABC-225 | One command reads an interleaved R pair: base and candidate against the same Stockfish, alternating blocks, opening-paired error, host log | EPIC-010 | — | NFR-008 (0 lane files); ADR-0049 d4 (0 host-path hits in real records); heat: width 1 Tctl median 74.1 °C / max 78.8 °C under the 85 °C line | grugops/ABC-225 @ 933d9f35 (code 3dca0e67): tools/rating/rating.ts, pair.ts, pair-check.ts (unchanged by QE) | pair-check 22/22; QE A1/A2 dry-run compare; real rpair 40 games --concurrency 1 (A5 MET, A6 1.846 h / 21.67 g/h / 400-game 18.5 h); start=51 probe; QE records grugops/qe-ABC-225-w1 @ f37afe5c | — (tools only, no UAT); QE PASS_WITH_GAPS (qe-ABC-225-w1 …d0807789) | — | In Review → QE PASS_WITH_GAPS (branch, not merged; merge is a human's) |
