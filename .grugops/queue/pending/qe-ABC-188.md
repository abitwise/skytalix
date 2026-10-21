---
subtask: qe-ABC-188
role: qe-e2e
ticket: plans/tickets/ABC-188-a-deletion-only-edit-to-a-limb-1-holder-fires-nothing-on-clause-b-and-abc-168-adds-the-second-holder.md
ref: .grugops/context/qe-ABC-188/
branch: grugops/ABC-188 (tip 66d6a2f1; code 98487c1e, d722a6b6, eb097a7b; base 5cd279a4); worktree ../wt-ABC-188 (read only)
width: 1
---

# QE gate for ABC-188 (clause (b) limb 1 on `+`/`−` lines and deleted holders; harness rows; ADR-0036 § S1 block). Your read of A2–A7 closes `AR-163-DELONLY`

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase); run everything at that merge; report the merge sha.
- Verify every criterion against the page with your own runs, before opening the Architect's notes (`…7d78d7cc`, `…f83c0463` on the branch).
- **Re-plant independently:** run `r2-mutants.sh` yourself against (i) the head instrument (green, all rows as expected), (ii) base's instrument (fails on exactly `G1-IMP`, `G1-GRD`, `G1B`, `UNC1`, `REN`), (iii) a skip-only copy (fails on exactly `REN`). Build your own deletion and rename plants beyond the harness rows; read Security/NFR's D1 and D2 (drop `uci.ts`'s exit-70 line; drop its EPIPE handler) by hand at `b71f8902` (`grugops/ABC-168`): limb 1 must fire.
- **Limbs 2 and 3 byte-identical to `341da4c1`** on every plant; `(b1) capability` unchanged; the empty-holder case adds nothing and runs no pathspec diff.
- **QE-182-a fold:** a plant whose changed files differ from the files it names exits 2 and names the plant. Show it with a partly-applied two-edit plant.
- **`ADR-0036` § S1 block:** dated, consistent with the code, retires the by-hand `--name-only` check only to the extent the instrument now covers it.
- **Gates** on the code tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987); skip-integrity `--skip-count 0`. No timing. UAT waiver in AGENTS.md's form.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register; say plainly whether `AR-163-DELONLY`'s close condition is met.

## Fences
- Work in your own worktree `../wt-qe-ABC-188` on a branch from the tip. Plants only in scratch clones under a private `TMPDIR`.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-188 page there.
- No edits to the instrument, harness, ADR, `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` or other ticket pages.
- Never push, `--force`, `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-188`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/qe-ABC-188.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**; do NOT append it yourself:
  `| ABC-188 (QE) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
