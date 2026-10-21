---
subtask: qe-ABC-164
role: qe-e2e
ticket: plans/tickets/ABC-164-agents-md-sits-at-its-byte-budget-with-two-stale-test-receipts.md
ref: .grugops/context/qe-ABC-164/
branch: grugops/ABC-164 (tip 3971302c; code e82a3798; base 49dc490c); Scribe worktree ../wt-ABC-164 (read only)
width: 1
---

# QE gate for ABC-164 (the owner's Option A split of `AGENTS.md`; 0 `src/` lines)

## Do
- Verify `A1`–`A7` against the page with your own scripts, on joined text, before opening the Scribe's notes (`.grugops/context/scribe-ABC-164/` on the branch).
- **The owner's goal is the yardstick:** `AGENTS.md` keeps what every role session needs; nothing becomes unreachable. Read the new `AGENTS.md` as a fresh role session would (Orchestrator, SE, QE, Security/NFR, BA/PM) and say, per role, whether anything it needs on start now sits behind a pointer. Name it.
- **`A4` strictly.** The Scribe says a literal whole-run match cannot reach 0 under Option A (each lane's command stays, its comment moves) and checked at token level; the only misses are the O3 rewording, three re-pointed `## X` references, and lines replaced by pointers. Run your own check, list every removed line not found word for word in a target file, and rule whether each is one of the page's named kinds.
- **Reachability:** every moved block is reached by one pointer from `AGENTS.md` or an index row in `memory-bank/00-index.md`; old `§` headings resolve in `memory-bank/45-standing-rulings.md`; 17 roles' `§ Kit vs state` citations and `src/`'s "AGENTS.md rule N" citations still resolve.
- **Pinned tests:** the `ABC-042`, `059`, `065`, `067`, `071`, `109` and `173` rows green; exactly 17 vitest commands parsed; no new backticked `npx vitest` text.
- **O1** (writer `contextRoot` pointer; the Scribe worded it for "the checkout you work in"), **O2**, **O3**: landed where the page says, and true.
- **Gates** on the code tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987); skip-integrity `--skip-count 0`. No timing. UAT waiver in AGENTS.md's form. `wc -c AGENTS.md` (Scribe: 15,606).
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-164` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-164 page there.
- No edits to `AGENTS.md`, `memory-bank/`, `src/`, `plans/board.md`, `plans/traceability.md` or other ticket pages.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-164`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/qe-ABC-164.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order** (rule `…d2b9bf09`); do NOT append it yourself:
  `| ABC-164 (QE) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
