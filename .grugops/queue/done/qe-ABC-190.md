---
subtask: qe-ABC-190
role: qe-e2e
ticket: plans/tickets/ABC-190-the-lock-root-lacks-the-license-and-bin-that-package-json-carries.md
ref: .grugops/context/qe-ABC-190/
branch: grugops/ABC-190 (tip d79f4684; lock commit 15766056; base 823a9885); worktree ../wt-ABC-190 (read only)
width: 3 (beside ticket-to-pr-ABC-189 and bapm-rule-QE-178)
---

# QE gate for ABC-190: `package-lock.json` regenerated so the lock root carries `license` and `bin`. One file, 4 added lines, ZERO `src/` lines

## Do
- Create your own worktree `../wt-qe-ABC-190` on `grugops/qe-ABC-190` from the tip. **Merge the current `main` into it first** (a merge, not a rebase) and report the merge sha. If `main` moved its lock, regenerate nothing: report the conflict and stop.
- Verify every criterion on the page (A1–A3 and any others) with your own runs **before** opening the SE's notes (`…723e5ad8`, `…a451fa4c`, `…c86e3c83` on the branch).
- Independently: run the page's regeneration command on a fresh clone of base and confirm it produces byte-for-byte the same 4 lines, and that re-running it at the tip is a no-op. `npm ci --ignore-scripts` on a fresh clone of the tip exits 0 with a clean status. Check that no `version`/`resolved`/`integrity` line or dependency entry moved. Run `npm audit --json` at base and tip and compare the counts (expected 7 both; AR-1 is not yours to re-state).
- Check whether any test or tool reads the lock root (e.g. grep `package-lock` in `src/` and `tools/`) and whether this change can turn one red.
- Gates at your merge: lint, typecheck, build; `npm test` + `last-run.json` success; skip-count capture as spelled → `test-skip-integrity.js`. Heap 128. No timing.
- UAT waiver form must print nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register (`QE-190-x`). Say whether QE-172-a's close condition is met.

## Fences
- Work only in `../wt-qe-ABC-190`, plus fresh clones in your scratch area. Run npm only there, never in main's checkout. Commit typed notes inside your worktree (context root: `../wt-qe-ABC-190/.grugops/context`) and a `## QE` section on the ABC-190 page there.
- No edits to `package*.json` on the tip, `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`, other pages. Do not touch other worktrees. Never set git config. Never push, `--force`, `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-190`). Pass your worktree's `.grugops/context` explicitly. Every `at` from `date -u`. Include a `kind: decision`. Append-only.
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/qe-ABC-190.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.

## Result

**PASS.** Gap register: none (`QE-190-*` empty).
- Branch `grugops/qe-ABC-190` @ **`a0b42688`** (worktree `../wt-qe-ABC-190`, branched at the tip `d79f4684`). `git merge-tree --write-tree main a0b42688` is clean against `main` `d12831c6`.

**Merges of `main`:**
- First, `git merge main` printed `Already up to date` (`main` was the base `823a9885`), so there was no merge commit and the first readings were at `d79f4684`.
- `main` then moved to `d12831c6` (orch-2026-10-22g). It touched only `.grugops/`, `plans/` and the ABC-190 frontmatter, with 0 lines in `package*.json`, `src/` or `tools/`, so the lock did not move. I merged it at **`8c74547e`** with no conflict.
- At `8c74547e`, A1, A2, the waiver and every gate reproduce. The lock is `cmp`-equal to the base regeneration, and re-running the regeneration is a no-op.

**Commits:**
- `2f7f3865`: 4 sealed notes and a `## QE` section on the ABC-190 page.
- `8c74547e`: the merge of `main` `d12831c6`.
- `a0b42688`: 2 more notes (the re-merge, and a decision superseding the first) and the `## QE` update.
- No other edits. `package*.json`, `src/`, `AGENTS.md`, board and traceability were not touched. Not pushed, not merged.

**Notes**, sealed by `admitAndAppend` (grugops 2.1.0 plugin cache, task `qe-ABC-190`, context root `../wt-qe-ABC-190/.grugops/context` passed explicitly). `at` is 2026-10-22T15:30:05Z and 15:32:20Z, from `date -u`, and `findings` was `[]` for all 6. There is no `finding`, because there was no §14 gate run.
- `20261022T153005Z-qe-e2e-observation-c7e30f83`: A1–A3;
- `20261022T153005Z-qe-e2e-observation-6e8cf84f`: regeneration, audit and lock readers;
- `20261022T153005Z-qe-e2e-observation-b413b9cd`: gates and waiver;
- `20261022T153005Z-qe-e2e-decision-66c6c9d0`: the verdict at `d79f4684` (superseded);
- `20261022T153220Z-qe-e2e-observation-1021eac0`: the re-merge at `8c74547e`;
- `20261022T153220Z-qe-e2e-decision-d21b9a3a`: the verdict at `8c74547e`, superseding `66c6c9d0`.

**Criteria.** All are from my own runs, at `d79f4684` and again at `8c74547e`, read before I opened the SE's `…723e5ad8`/`…a451fa4c`/`…c86e3c83`, which agree on every shared number.
- **A1 MET.** `4	0	package-lock.json`: `license` plus the 3-line `bin` under `packages[""]`.
- **A2 MET.** The grep prints `0`. Apart from `.grugops/`, only `package-lock.json` changed. Structurally, only `packages[""]` differs, out of 123 entries.
- **A3 MET.** On a fresh tip clone, `npm ci --ignore-scripts` exits 0 with an empty status, and the regeneration re-run is a no-op.
- **A4 MET.** lint, typecheck and build exit 0. 60 / 1995 equals base, with the same names. Skip 0 → `No findings.` The waiver form prints nothing.

**Regeneration, byte-equality.** On a fresh clone of base `823a9885` with npm 11.20.0, the page's command gives `4 0`, and the result is `cmp`-equal to the tip's lock (sha256 `6ffeccdf3e5fc599b194621a24a4fcfc5749e462334e92e2ab3ddcbab510f40f` on both). Re-running at the tip is a no-op. npm 10.9.9 also leaves the tip unchanged.

**Audit.** `npm audit --json` reads 7 at base and 7 at the tip ({moderate 4, high 3}), and the vulnerabilities objects are JSON-equal.

**Lock readers.** None in `src/` or `tools/`; the only hit is a doc comment at `src/san.suffix.hardening.test.ts:35`. Nothing can turn red.

**QE-172-a.** `…216ceb43` Ruling 2's close condition is met on the branch. It closes on merge, which is the Orchestrator's, after the clause (a) Security/NFR hop.

**Trace row** (for the Orchestrator):
| ABC-190 (qe-ABC-190) | QE: A1–A4 met on own runs at d79f4684; lock regeneration byte-equal from a fresh base clone and idempotent at tip; npm ci rc 0 clean; no lock reader in src/ or tools/ | EPIC-007 | — | QE-172-a close condition met on branch (closes on merge); Security/NFR …216ceb43; audit 7 = 7 (4 mod / 3 high, AR-1 not re-stated); gaps none | grugops/qe-ABC-190 @ 8c74547e (main d12831c6 into tip d79f4684; lock 15766056); notes a0b42688<br>package-lock.json (+4 −0) | lint/typecheck/build 0; npm test 60 files / 1995 tests = base; skip 0, No findings.; A1 4 0; A2 0 | UAT waived (0 src/ lines) | — | PASS → In Security/NFR (clause (a)) |
