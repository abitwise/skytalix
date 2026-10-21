---
subtask: scribe-ABC-187
role: agents-md-scribe
tickets: [ABC-187]
branch: grugops/ABC-187 (tip 1151e7c8; SE code 494f7862) — commit ON THIS BRANCH in the SE's worktree ../wt-ABC-187
ref: .grugops/context/scribe-ABC-187/
width: 2 (beside qe-ABC-185)
---

# Scribe: ABC-187's folded-in `AGENTS.md:7` line — "targets ≤ 24,576 B" → "≤ 18,432 B" (byte-neutral)

The Orchestrator folded the owed line into ABC-187 (page § Out of scope, first bullet; `A6`'s "only if folded in" clause; BA/PM `…52428ef9`). The SE has lowered `AGENTS_MD_BUDGET_BYTES` to 18,432 on `grugops/ABC-187`.

## Do
- In `../wt-ABC-187` (branch `grugops/ABC-187`; the SE has finished and touches nothing more), change only the number on `AGENTS.md:7`: `24,576` → `18,432`. `wc -c AGENTS.md` must stay 15,606. No other `AGENTS.md` line changes.
- Gates on the new tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987; the `ABC-109` guard row green against 18,432); skip-integrity `--skip-count 0`. No timing.

## Fences
- Only `AGENTS.md:7`. No `src/`, `plans/`, `memory-bank/` edits. Commit on `grugops/ABC-187` only. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `scribe-ABC-187`). **Pass the worktree `../wt-ABC-187` as the context root explicitly.** Take every `at` from `date -u`. Write notes inside that worktree.
- Write `.grugops/queue/done/scribe-ABC-187.md` (brief + `## Result`: new tip, before/after line, bytes, gates) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**; do NOT append it yourself:
  `| ABC-187 (Scribe) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

## Result

- Code commit: `65ee533d` on `grugops/ABC-187` (worktree `../wt-ABC-187`), `docs(agents-md): grug budget line :7 24,576 -> 18,432 B, byte-neutral (ABC-187)`; AGENTS.md only, 1 insertion, 1 deletion. Notes commit on top: `9578481f` (new tip, `9578481ff30a9e776e4b76c95e69c12e4d149e3f`). Not pushed, not merged.
- Before, `AGENTS.md:7`: `**Byte budget: this file targets ≤ 24,576 B.** Why, ...`
- After, `AGENTS.md:7`: `**Byte budget: this file targets ≤ 18,432 B.** Why, ...` (only the number changed).
- Bytes: `wc -c AGENTS.md` 15,606 before and after (byte-neutral).
- Gates on the new tip: lint (biome, 116 files) clean; typecheck and build (`tsc --noEmit`) clean; `npm test` rc 0, 59 files / 1987 tests passed, `last-run.json` success true, 0 failed, snapshots 41/41 matched (`ABC-109` guard green against 18,432); `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` "No findings." No timing.
- Note: `.grugops/context/scribe-ABC-187/notes/20261021T134605Z-agents-md-scribe-observation-4a6061cb.md` (in the worktree, sealed through `admitAndAppend`, contextRoot = worktree). An `artifact-ref` was tried and refused (it needs sha / gate_run / content_hash provenance, which this hop does not have); not forced.
- Trace row (Orchestrator appends):
  `| ABC-187 (Scribe) | Folded-in AGENTS.md:7 budget line 24,576 → 18,432 B, byte-neutral, to match the lowered guard | — | — | ABC-109, QE-164-h | grugops/ABC-187 @ 9578481f<br>AGENTS.md (line 7), context note | lint, typecheck, build clean; npm test 59 files / 1987 tests, last-run.json success; skip-integrity --skip-count 0 No findings | — | — | AGENTS.md:7 owed line closed; branch ready for next hop |`
