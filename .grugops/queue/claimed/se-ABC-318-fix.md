---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-11T07:50:53Z
subtask: se-ABC-318-fix
role: software-engineer
ref: .grugops/context/se-ABC-318-fix/
branch: grugops/qe-ABC-318 (integration; commit there)
width: comment-only lines in src/levels.ts header, plus your notes. No code, test, README or ADR.
---
# ABC-318: the owed levels.ts header comment
ADR-0052 D8 (QE-221-b) and the ADR-0045 A3 fold say the next ticket that touches `src/levels.ts` corrects three stale words in its header (around lines 42 and 49–50). Read the Architect's observation …1c4c6d88 (in `.grugops/context/arch-ABC-318/notes/`) and se-ABC-318's "stale comment" finding in `.grugops/queue/done/se-ABC-318.md`. Two claims are stale:
- the budget is "at least 2 s under" its ceiling, but level 5 has had a 1 s margin since ABC-228;
- "`HARD_CEILING_MS` is the largest of them", but it has been 60 000 since ABC-221.

Correct exactly what those ADR lines name, as comment-only edits that state current facts. Then run lint, typecheck and `VITEST_MAX_WORKERS=1 npm test`, each alone under `flock <scratch>/host-test.lock` (the real path is in your dispatch prompt only). Publish one sealed observation. Add a `## Result` block to this brief. Run `node tools/grugops/records-path-check.js --base main`, then commit on `grugops/qe-ABC-318`. No push, merge, amend, force or rebase. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".

## Result
- **Branch** `grugops/qe-ABC-318` from `405f9c54`; one commit carries the comment and these records. No push, merge, amend, force or rebase.
- **Change, comment-only, `src/levels.ts` header:** the three words ADR-0052 D8 (QE-221-b) and ADR-0045's A3 fold owe. `:42` "`NFR-004`'s 3 s" -> 4 s; `:50` "at least 2 s under it" -> "at least 1 s under it (1 s at level 5)"; "`HARD_CEILING_MS` is the largest of them" -> "The clamp, `HARD_CEILING_MS`, sits at the largest ceiling in force (60 s, `uci-clock-mode`), at or above every level ceiling." This brief listed two; the ADR lines and Architect `…1c4c6d88` list three, so all three were done. No code, test, README or ADR line changed.
- **Gates** (each alone under the host lock, after the last edit): `npm run lint` exit 0; `npm run typecheck` exit 0; `VITEST_MAX_WORKERS=1 npm test` exit 0, 72 files, 2740 passed.
- **Left, outside the owed list:** `:43` "`NFR-005`'s reading on `chooseMove` at 3 s" is stale too (4 000 ms since ABC-228). Not edited; the Orchestrator rules.
- **Note:** `se-ABC-318-fix/20261111T075218Z-software-engineer-observation-981b24b7` (sealed).
