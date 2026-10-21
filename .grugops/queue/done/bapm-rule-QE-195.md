---
subtask: bapm-rule-QE-195
role: ba-pm
tickets: [ABC-195]
branch: main (records only; commit nothing — the Orchestrator commits)
ref: .grugops/context/bapm-rule-QE-195/
width: 1
---

# BA/PM (records only): rule QE-195-a (LOW proposed) from ABC-195's QE gate. ABC-195 is merged; this gates nothing

## Read first
- QE verdict and gap register `.grugops/context/qe-ABC-195/notes/20261021T203404Z-qe-e2e-decision-f36a06c3.md`, plants and drift copies `…741eebba`; Orchestrator close `20261021T203559Z-orchestrator-decision-ed1933d8`.
- ABC-195's page and `ADR-0036` § S1 (ABC-195 block); `.grugops/context/design-F-072-1/probe/r2-mutants.sh`; your own `bapm-cut-AR-193` notes.

## Do
- **QE-195-a:** the five new rows check limbs 2/3 only for equality with `341da4c1` on the twin, and the plant check guards only the header-shaped anchor; if PP-EDIT's in-place anchor `resolveOptions(process.argv.slice(2))` stops matching, the harness still reads 25 of 25 (measured by QE with a one-line drift copy). Rule cut / fold / accept. QE's fix shapes: assert each new row's expected limb 2/3 verdict, or make the plant check also require the capability line. If you cut, measure base red on a scratch copy outside the repository (own `.git`, private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR`, `GIT_CONFIG_NOSYSTEM=1`); next free id ABC-196.
- QE-195-b/-c are recorded INFO by the Orchestrator; agree or say why not.
- If anything is cut, one `_Updated:` line at the top of `plans/board.md` and the card. Otherwise only a dated line on ABC-195's page.

## Fences
- Only `plans/` and your notes. No `src/`, instrument, harness, ADR, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config, `node_modules/`. Commit nothing.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-rule-QE-195`). **Pass this repository root's `.grugops/context` as the context root explicitly.** Take every `at` from `date -u` (UTC). Include a `kind: decision`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line. Put it in your done record (`.grugops/queue/done/bapm-rule-QE-195.md` + `.claim.md`, main's tree, uncommitted).

## Result (ba-pm, 2026-10-21T20:57:39Z): **QE-195-a CUT → ABC-196 (Ready, XS, P3, DoR 10/10; builder Architect/Design; harness-only, gates no merge). QE-195-b and QE-195-c agreed INFO, no action. No Security/NFR rating needed. Ready 0/8 → 1/8; next free id ABC-197.**

Records only, uncommitted on `main` (`219e8e33` at start and finish). Notes are in `.grugops/context/bapm-rule-QE-195/notes/`. They were sealed with grugops 2.1.0 `context-io.js` `admitAndAppend`, with this checkout's `.grugops/context` passed explicitly, and both read back through `readContext`:
- `20261021T205709Z-ba-pm-decision-f0144de0`: the ruling per gap, with owners and triggers;
- `20261021T205709Z-ba-pm-observation-466ee18d`: the base-red and prototype readings.

| gap | ruling |
|---|---|
| QE-195-a (LOW proposed, unrated) | **CUT → ABC-196.** Each `TW` row (PP-TPL, PP-REDIR, RA-PLUS, PP-EDIT, SP-N5) fails, naming the row and limb, when its plant stops reading as expected on limbs 2/3. The builder may take either of QE's shapes. **Why cut:** a `src/cli.ts`-only refactor (scratch `99518856`) leaves today's harness at rc 0, `25 of 25`. That trigger sits in unrelated feature hops, so no diff-reading owner rule sits where the drift happens (unlike QE-194-a/-b). The class is bounded, one guard closes it, and the harness header promises it. **Base red** (`219e8e33`, head instrument `24b963b14fa4f1bf`, private env, scratch clone with its own `.git`): rc 0 with `25 of 25` for QE's D2, for R and for a dropped `leak()` line (L; also silent, not in QE's register). **Prototype (a)**: rc 1 naming only `PP-EDIT:limb2` (D2, R), and the six PP-TPL/PP-REDIR/RA-PLUS limbs (L). At head: rc 0, 177 lines byte-equal. On base's instrument `2c0c1985e6607110`: rc 1, the same `MISMATCH: RA-PLUS SP-N5` and the same 9-limb DIFFER line; the 20 rows' 139 lines are byte-equal throughout. |
| QE-195-b (INFO) | **Agree, no action.** `src/qt.ts ` is neither `isProduction` nor importable (QE). **Reopen:** `isProduction`'s suffix test changes, or such a name is shown importable. |
| QE-195-c (INFO) | **Agree, no action.** Cosmetic; it matches the ABC-193 heading style, and an ADR edit is fenced. |

Files:
- `plans/tickets/ABC-196-a-drifted-anchor-or-a-dropped-capability-line-turns-a-twin-row-of-r2-mutants-into-a-silent-control.md` (new);
- `plans/board.md` (one `_Updated:` line at the top; the ABC-196 card in Ready, WIP 0/8 → 1/8);
- `plans/tickets/ABC-195-…md` (+2 lines: a blank line and one dated ruling block).

Not touched: `plans/traceability.md` (the row is below, for the Orchestrator, as at bapm-rule-QE-192/-194), `src/`, the harness, the instrument, `ADR-0036`, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config or attributes, `node_modules/` (only resolved through a scratch symlink), the pending file and the claim directory. Main's `git status` was clean before. No stop.

### Trace row (10 cells, header order)

| ABC-195 (BA/PM QE-195 ruling) | ruled QE-195-a CUT into ABC-196 (each TW row of r2-mutants.sh fails, naming row and limb, when its plant stops reading as expected on limbs 2/3; harness-only, 0 src lines), QE-195-b and QE-195-c agreed INFO (no action); no Security/NFR rating needed | — | — | QE-195-a, QE-195-b, QE-195-c; AR-193-HUNKHDR; QE-182-a; QE-194-a/-b; ADR-0036 S1; notes …f36a06c3, …741eebba, …ed1933d8, …f0144de0, …466ee18d | main @ 219e8e33 (uncommitted, records only)<br>plans/tickets/ABC-196-a-drifted-anchor-or-a-dropped-capability-line-turns-a-twin-row-of-r2-mutants-into-a-silent-control.md, plans/board.md, plans/tickets/ABC-195-an-added-line-starting-plus-plus-hides-later-hunks-from-clause-b-and-a-production-file-whose-name-holds-a-space-goes-unseen.md | — (records only; scratch clone at 219e8e33: today's harness rc 0 25/25 on D2, a src/cli.ts-only refactor 99518856, and a dropped leak(); prototype rc 1 naming only the silent rows, head 177 lines byte-equal, base instrument rc 1 same 9 limbs) | — (ABC-196 expects the waiver: 0 production lines) | — | ABC-196 cut → Ready (XS, P3, DoR 10/10; Ready 0/8 → 1/8); ABC-195 stays Done; next free ABC-197 |
