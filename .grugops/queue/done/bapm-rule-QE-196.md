---
subtask: bapm-rule-QE-196
role: ba-pm
tickets: [ABC-196]
branch: main (records only; commit nothing, the Orchestrator commits)
ref: .grugops/context/bapm-rule-QE-196/
width: 2 (beside qe-ABC-178, which may be taking timing; take no timing and run no vitest)
---

# BA/PM (records only): rule QE-196-a (LOW proposed) from ABC-196's QE gate. ABC-196 itself is not gated by this

## Read first
- QE verdict and gap register: `../wt-qe-ABC-196/.grugops/context/qe-ABC-196/notes/` (the current verdict `…decision-df052eb2` supersedes `…fd211043`), and the `## QE` section on ABC-196's page in that worktree. QE's R3 drift clone and run outputs: `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe196/` (read only).
- Your own `bapm-rule-QE-195` notes (`…f0144de0`, `…466ee18d`); ABC-196's page; `ADR-0036` § S1.
- The owner delegation `.grugops/context/owner-delegation-2026-10-22/notes/20261022T140148Z-orchestrator-decision-5aaf7cec.md`. You rule LOW gaps yourself; nothing here goes to the owner.

## Do
- **QE-196-a:** a mergeable `src/cli.ts`-only refactor (R3: `main` as an arrow `const`, `printableOf` below it) leaves the fixed harness at 25 of 25. PP-EDIT still reads FIRES, but on a line the pre-ABC-195 instrument also sees, so PP-EDIT's part of AR-193-HUNKHDR goes silent. The other three `++` rows still cover the class. Rule cut / fold / accept, giving the reason. Weigh it against QE-195-a's cut and against diminishing returns: the guard keeps growing to chase drift in one harness. QE's unmeasured shapes: twin rows require the pre-ABC-195 instrument to NOT read as expected; or the plant check requires limb 2's line to come after the stand-in line. If you cut, measure base red on a scratch copy outside the repository (own `.git`, private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR`, `GIT_CONFIG_NOSYSTEM=1`; harness runs only, no vitest); next free id ABC-198.
- QE-196-b/-c are INFO: agree, or say why not.
- If anything is cut, one `_Updated:` line at the top of `plans/board.md` and the card. Otherwise only a dated line on ABC-196's page (main's tree).

## Fences
- Only `plans/` and your notes (context root: this repository's `.grugops/context`). No `src/`, instrument, harness, ADR, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config, `node_modules/`. Commit nothing. Run no vitest and take no timing.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-rule-QE-196`). Pass this repository root's `.grugops/context` as the context root explicitly. Every `at` from `date -u`. Include a `kind: decision`.
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/bapm-rule-QE-196.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.

## Result (ba-pm, 2026-10-22T14:50:48Z): **QE-196-a ACCEPTED, no ticket, plus one standing acceptance rule for instrument hops. QE-196-b and QE-196-c agreed INFO, no action. No Security/NFR rating needed. ABC-196 not gated; no card moves; next free id stays ABC-198.**

Records only, uncommitted on `main` (`7c312c42` at start and finish). Notes are in `.grugops/context/bapm-rule-QE-196/notes/`. They were sealed with grugops 2.1.0 `context-io.js` `admitAndAppend`, with this checkout's `.grugops/context` passed explicitly, and both read back through `readContext`:
- `20261022T145007Z-ba-pm-decision-47a3f08b`: the ruling per gap, the acceptance rule, and the reopen triggers;
- `20261022T145007Z-ba-pm-observation-8c7b8b8c`: read-only readings (QE's R3 outputs, the harness at `0492a007`, ADR-0036's `ABC-195` block, the fold-target search).

| gap | ruling |
|---|---|
| QE-196-a (LOW proposed, unrated) | **ACCEPT, no ticket.** The trigger class is QE-195-a's, but every reason that cut QE-195-a is weaker here. (1) PP-EDIT is narrowed, not dead: it still FIRES on an in-place edit in a limb-2 holder. (2) PP-TPL, PP-REDIR and RA-PLUS still cover `AR-193-HUNKHDR` at R3, all 6 limbs under the pre-`ABC-195` instrument, and only a harness edit silences them (QE-196-b). (3) The header now states the verdict-word-only limit, so it promises nothing false (QE-196-c). (4) A silent PP-EDIT can hide only an instrument regression, which only a `clause-b.mjs` hop can make. At such a hop, `ABC-196` `A5`'s pre-`ABC-195` reading detects R3 (QE's `fix-R3-pre195`: 8 limbs, `PP-EDIT:limb2` absent). (5) Diminishing returns: this would be the third layer on one harness, for one row's evidence, on a LOW that gates nothing. **Rule (BA/PM-owned):** any ticket that edits `clause-b.mjs` or a `TW` row or its plant function carries that reading at base and head, names every `TW` limb the base names (9 today), and re-anchors a dropped row in the same diff. **Reopen** if the other three `++` rows stop discriminating, if `AR-193-HUNKHDR` reopens, or if R3 is shown live on `main`. |
| QE-196-b (INFO) | **Agree, no action.** The limit for PP-TPL, PP-REDIR and RA-PLUS needs a harness edit, which shows in its own diff (the QE-194-a precedent). SP-N5 was not reached. **Reopen:** `pp`'s or `sp`'s anchor or append changes; the rule above then applies. |
| QE-196-c (INFO) | **Agree, no action.** Cosmetic. The next hop that edits the header may rewrap it. |

Files:
- `plans/tickets/ABC-196-a-drifted-anchor-or-a-dropped-capability-line-turns-a-twin-row-of-r2-mutants-into-a-silent-control.md` (+2 lines: one dated ruling paragraph inside the opening blockquote, above `## Problem`). A three-way `git merge-file` against `../wt-qe-ABC-196`'s copy, which appends `## QE`, merges with no conflict.
- `.grugops/context/bapm-rule-QE-196/notes/` (2 notes, new).
- This done record and `bapm-rule-QE-196.claim.md`.

Not touched:
- `plans/board.md` (nothing was cut) and `plans/traceability.md` (the row is below, for the Orchestrator);
- `src/`, the harness, the instrument, `ADR-0036`, `AGENTS.md`, `memory-bank/`;
- branches, worktrees (QE's worktree and scratch were only read), git config or attributes, `node_modules/`;
- the pending file and the claim directory.

No harness run, no vitest, no timing. No stop.

### Trace row (10 cells, header order)

| ABC-196 (BA/PM QE-196 ruling) | ruled QE-196-a ACCEPT (no ticket; PP-EDIT narrowed not dead, class covered by PP-TPL/PP-REDIR/RA-PLUS, header states the limit, the pre-ABC-195 reading detects R3 at any instrument hop), with a standing acceptance rule for clause-b.mjs/TW-row hops; QE-196-b and QE-196-c agreed INFO (no action); no Security/NFR rating needed | — | — | QE-196-a, QE-196-b, QE-196-c; QE-195-a; QE-194-a; AR-193-HUNKHDR; ADR-0036 S1; notes …df052eb2, …7e6804d4, …c6b997d0, …f0144de0, …5aaf7cec, …47a3f08b, …8c7b8b8c | main @ 7c312c42 (uncommitted, records only)<br>plans/tickets/ABC-196-a-drifted-anchor-or-a-dropped-capability-line-turns-a-twin-row-of-r2-mutants-into-a-silent-control.md | — (records only; QE's R3/R3' outputs read: fixed harness 25/25, pre-ABC-195 instrument names 8 limbs, PP-EDIT:limb2 absent) | — (no ticket cut) | — | ABC-196 stays In Review (merge not gated by this ruling); no card moves; next free ABC-198 |
