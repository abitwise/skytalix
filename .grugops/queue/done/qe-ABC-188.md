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

## Result

**PASS_WITH_GAPS** (`QE-188-a` LOW, `QE-188-b` INFO; 0 blocking). Branch `grugops/qe-ABC-188` @ **`da348a79`**
(worktree `../wt-qe-ABC-188`, from the tip `66d6a2f1`).

- **Merge of `main`:** `2c29a603` merged at **`85b462f0`** with no conflict. It brought only queue, board, trace and
  page records, and `src/` is byte-equal to `96dc3fa3`. `main` was still `2c29a603` at finish.
- **Commit `da348a79`:** 5 sealed notes and a `## QE` section on the ABC-188 page. There are no edits to the
  instrument, harness, ADR, `src/`, `AGENTS.md`, the board, the trace or other pages.
- **Notes** (sealed with `admitAndAppend`, task `qe-ABC-188`, worktree context root, `at` 2026-10-21T15:23:54Z from
  `date -u`):
  - observations: `…8ea32c43` (A2–A5, A7), `…b2674938` (A6 and 17 QE plants), `…36ec80ab` (A1, A8, gates, waiver),
    `…0b73ec04` (gap register);
  - decision: `…bfbbb83f` (verdict and the `AR-163-DELONLY` close).
  - There is no finding, because there was no §14-gate run.

**Criteria** (QE's own runs at `85b462f0`, before reading the Architect's `…7d78d7cc` / `…f83c0463`; those notes
agree on each):
- **A1 MET:** the 4 Scope files plus the Architect's 2 notes (`QE-182-d`). The waiver form is empty over the range and
  per commit.
- **A2 MET:** base instrument (blob `0407b581`), rc 1, `limb 1 MISMATCH: G1-IMP G1-GRD G1B UNC1 REN`, 0 `DIFFER`.
- **A3 MET:** skip-only copy, rc 1, `MISMATCH: REN` only.
- **A4 MET:** head, rc 0, 10/10, limbs 2/3 identical 10/10. Repo status, `HEAD` and refs are unchanged. The committed
  `.out.txt` equals this run, apart from plant shas.
- **A5 MET:** 0/1, 0/1, 0/17, 1/1.
- **A6 MET:** D1 and D2 FIRE on `src/uci.ts` at `b71f8902` (0/1, 0/4, `<base> and <head>`). Base is silent, and
  limbs 2/3 match `341da4c1`.
- **A7 MET:** a partly-applied two-edit P2c on drift `a090f354` gives rc 2, and stderr names `P2c`.
- **A8 MET:** 25 `+` / 0 `−`; dated; (i)–(vi) consistent with the code.
- **A9 / gates MET:** lint, typecheck and build rc 0. `npm test` 59 / 1987, `last-run.json` success. Skip-count 0,
  `No findings.`
- **Own plants (17):**
  - Holders deleted, moved out of `src/`, renamed (to production, `.test.ts`, `.d.ts`), truncated, blank-line-only,
    and `uci.ts` delete/rename/import-drop all FIRE.
  - The controls (a non-holder deletion, a caller-line deletion, mode only) do not.
  - Limbs 2/3 match `341da4c1` on all 29 plants (harness, D and Q).
  - Limb-1 output outside Ruling 2 equals base on all 29, so `(b1) capability` is unchanged.
  - The git shim shows the empty case runs one diff call, `-- src`.

**`AR-163-DELONLY`: the close condition is MET.** G-1b and the import-line drop fire (the term `…3e4b4a08`), D1 and
D2 fire (`…75a45be0` § 2), and QE's read of A2–A7 is done (ADR (v)). The Orchestrator records the close.

**Gaps**
- **`QE-188-a` LOW (QE's rating; Security/NFR rates it, Architect/Design fixes it):**
  - One NUL byte in a holder comment makes git treat the file as binary. The instrument then sees no changed line on
    any limb (pre-existing), and `biome` and `tsc` pass.
  - `--name-only` lists the file, and ADR (iv) retires that check.
  - **Interim, for the Orchestrator:** `git diff --numstat <base> <head> -- src | awk '$1=="-"'` must be empty.
  - It does not touch the `AR-163-DELONLY` close.
- **`QE-188-b` INFO:** an in-file partial plant exits 1 (MISMATCH), not 2. The reading rule is to check the plant's
  diff first.
- The Architect's `R-188-a` and the `production files changed` omission are confirmed by measurement, with no new id.

**Trace row (for the Orchestrator to append; 10 cells):**
`| ABC-188 (QE) | QE gate on the AR-163-DELONLY fix: A1–A9 by own runs at the merge of main; A2/A3 red as specified, A4 10/10; D1/D2 fire on src/uci.ts; 17 own plants; A7 exit 2 naming P2c | — | — | AR-163-DELONLY (close condition met), ADR-0036, QE-182-a, QE-188-a (LOW), QE-188-b (INFO), R-188-a | grugops/qe-ABC-188 @ da348a79 (from 66d6a2f1; merge of main 2c29a603 = 85b462f0)<br>ABC-188 page (## QE); .grugops/context/qe-ABC-188/ | A2 rc 1 (5 named); A3 rc 1 (REN); A4 rc 0, 10/10, L2/L3 10/10; A7 rc 2; lint, typecheck, build rc 0; npm test 59 files / 1987, last-run success; skip-count 0 "No findings." | waiver (0 production lines) | — | PASS_WITH_GAPS; In Review → next (Orchestrator's move) |`
