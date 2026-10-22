---
subtask: ticket-to-pr-ABC-178b
role: software-engineer
tickets: [ABC-178]
branch: grugops/ABC-178 (tip efaa0a76), in the existing worktree ../wt-ABC-178
ref: .grugops/context/ticket-to-pr-ABC-178b/
width: 3 (beside qe-ABC-189 and qe-ABC-190)
---

# SE: ABC-178 re-build. Fold QE-178-b into R1: one added line that re-reads session 1's output after session 2 has run. Test-only, additive, one file

## Read first
- ABC-178's page (main's tree). **The newest dated block (BA/PM `bapm-rule-QE-178`, 2026-10-22) governs**: B1 gains the re-read limb; B3 allows the re-check line and comments citing `QE-178-b`; B5's census sum must equal QE's tip reading of 608,965; B6 adds QP1c. B4, B7, B8 and B9 are unchanged.
- BA/PM `.grugops/context/bapm-rule-QE-178/notes/` (`…1f4936b2`, `…34bf730b`); QE `../wt-qe-ABC-178/.grugops/context/qe-ABC-178/` (verdict `…1ad5f522`, B6 `…f910b911`, and `probe/` incl. `gp-qe178.mjs` @ `d781e5e5`); your own `ticket-to-pr-ABC-178` notes (`.grugops/context/ticket-to-pr-ABC-178/notes/` in main's tree).

## Do
- In `../wt-ABC-178`: `git merge main` first (a merge, no rebase); report the sha.
- **Red first:** on scratch copies (full `node_modules`), QP1c passes the lane at the current tip and goes red at the new tip on R1; QP1 and QP1a stay red; QP0 stays green. Report QP1b, but don't grade it (accepted).
- Implement exactly the fold. Every line of base's file stays byte-identical; the change over base stays additive (B3). The test count is unchanged from `efaa0a76` (the re-read is an assertion, not a new row). B5's census sum is 608,965.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (60 / 1996); skip-count capture as spelled → `test-skip-integrity.js`; `UCI_DEEP`. Heap 128 multi-file, 400 one-file. **No timing claims**; B7/B8 come later, on a quiet host.
- UAT waiver form must print nothing.

## Fences
- Only `src/uci-session.test.ts`, plus your notes in `../wt-ABC-178/.grugops/context/ticket-to-pr-ABC-178b/` (the context root to pass; committing them on the branch is fine, since B3 reads `src/`). No other file, `plans/`, `AGENTS.md`, `memory-bank/`, git config, other worktrees. Commit on `grugops/ABC-178` only. Never push, merge into `main` or `--force`. Keep temp files in your scratch area, not `/tmp`.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-178b`). Every `at` from `date -u`. Include a `kind: decision`. Append-only.
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/ticket-to-pr-ABC-178b.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.

## Result

**Delivered.** Branch `grugops/ABC-178`: merge **`0fb19ab9`** (`main` `d12831c6`, no rebase), tip **`0036e5c6`**. One commit, one file, +2 lines (a `QE-178-b` comment and the re-check). Not pushed, not merged. No timing taken. `main` moved to `180ed863` during the hop (Orchestrator docs only, 0 `src/` lines) and was not re-merged.
Notes are sealed with `admitAndAppend` (each `sealVerdict` ok) and sit **uncommitted** in `../wt-ABC-178/.grugops/context/ticket-to-pr-ABC-178b/notes/`: decision `…5e69047b`, observations `…ac6b8407` (red-first), `…246ca01c` (census) and `…10cbb9ab` (gates). They are kept off the branch so that B3's `--name-only` stays literal.

### Per amended criterion
| crit | result |
|---|---|
| B1 | **MET**. Session 1 has no `bestmove` before session 2. Session 2 is a fresh `talk`, `out` `[]`. **After session 2, `held.out` is re-read and still has no `bestmove`** |
| B3 | **MET**. Against base (merge-base `d12831c6`): `--name-only` = `src/uci-session.test.ts`; 0 `-` lines; 1 hunk, 9 `+` lines (R1, its re-check line, comments citing ABC-178/QE-177-a/QE-178-b, the blank separator). Against `efaa0a76`: +2, 0 `-` |
| B4 | **MET**. File 127 (unchanged from `efaa0a76`); lane 1 996/1 996, `success: true`, 0 skipped; names equal QE's tip list; the only difference from base is R1's name |
| B5 | **MET**. R1 = 655 nodes; file census sum **608 965** = QE's tip reading; the TSV is `cmp`-equal to H0 and to QE's `census-H.tsv` |
| B6 | SE red-first only (QE owns the gate). QP0 0 red; QP1 and QP1a red on R1 alone; **QP1c 0/1 996 at the current tip → 1/1 996 at the new tip, on R1** (re-check line 289; the first check stays green); QP1b survives (reported, not graded) |
| B7, B8 | OWED (quiet-host timing hop). Not run. No timing claims |
| B9 | **MET**. lint/typecheck/build exit 0; `npm test` 60 files / 1 996, `success`; skip count 0 → `No findings.`; `UCI_DEEP` 5/5. The M4 sweep row is green; the scratch M4 kill was not re-run |

### Red-first (gp-qe178.mjs @ d781e5e5, sha256 12c0b8db…)
| probe | H0 file | H0 lane | H1 file | H1 lane |
|---|---|---|---|---|
| QP0 | 0/127 | 0/1 996 | 0/127 | 0/1 996 |
| QP1 | 1/127 R1 | 1/1 996 R1 | 1/127 R1 | 1/1 996 R1 |
| QP1a | 1/127 R1 | 1/1 996 R1 | 1/127 R1 | 1/1 996 R1 |
| QP1b | 0/127 | 0/1 996 | 0/127 | 0/1 996 |
| QP1c | 0/127 | 0/1 996 | **1/127 R1** | **1/1 996 R1** |

### UAT waiver form
`git -c core.quotePath=false diff --name-only 0036e5c6~1 0036e5c6 | grep -v '\.test\.ts$' | grep '^src/'` → **empty** (grep exit 1). The same is true against `d12831c6` and `43e4996f`. Zero production lines.

### Trace row
| ABC-178 (ticket-to-pr-ABC-178b) | QE-178-b folded into R1: session 1 re-read after session 2 (QP1c killed) | EPIC-007 | — | QE-178-b, QE-178-a (accepted); BA/PM …1f4936b2; NFR-008/N8-LANE: B7/B8 OWED | grugops/ABC-178 @ 0036e5c6 (merge 0fb19ab9)<br>src/uci-session.test.ts (+2 lines, additive) | lint/typecheck/build green; npm test 60/1996 success; file 127; skips 0 → No findings; UCI_DEEP 5/5; QP1c 0→1/1996 red on R1; QP1/QP1a red, QP0 green; R1 655 nodes, census 608965 | UAT waived (0 production lines) | — | In Development → In Review (QE re-read, then the timing hop) |
