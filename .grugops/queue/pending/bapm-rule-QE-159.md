---
subtask: bapm-rule-QE-159
role: ba-pm
ticket: ABC-159 (Done, merged 29e1d822)
ref: .grugops/context/qe-ABC-159/
width: 2 (beside qe-ABC-162)
---

# BA/PM: rule on QE-159-a…g

ABC-159 merged with QE at PASS_WITH_GAPS (`…10545147`); the gap register is in `…a1580e88`. Rule on each gap: cut a follow-up ticket, accept, or route elsewhere.

## The gaps
- **QE-159-a (LOW).** The san header's new clause, "a timing bar cannot fail on the regression it exists to catch", drops the ticket's "small headroom" qualifier and reads as a false universal. It also cites a catalog lesson (`plans/nfr-catalog.md:555-558`) that doesn't say it. The root is the ticket's own scope/A3 wording.
- **QE-159-b (LOW).** A4's command no longer runs as written: the ABC-173 heap guard needs the 128 prefix. It's a page-text fix.
- **QE-159-c (INFO).** No suite guard stops a tally from coming back, and A1's regex is narrow.
- **QE-159-d (INFO).** Two headers read as quoting the catalog, but the catalog has neither phrase.
- **QE-159-e (INFO, outside the ticket).** `src/cli.test.ts:1831` cites `history-pane.nfr.test.ts:329`; the real line is `:390`.
- **QE-159-f (INFO, process).** The Orchestrator's brief filter also exempted `__snapshots__` from the UAT waiver, but the AGENTS.md rule doesn't. Rule whether the brief or AGENTS.md is the reference. Note: the Orchestrator's own memory holds a snapshot-waiver rule from the owner, under which a snapshot-only src change keeps the waiver if the Orchestrator validates the `.snap` diff.
- **QE-159-g (INFO).** The SE notes are unsealed. This already goes to the Scribe for the AGENTS.md writer line.

## Do
- **Cuts.** Any cut gets the next free ticket id with DoR scored, and goes into Backlog or Ready per the DoR. Several comment-only fixes may share one XS ticket if they touch disjoint lines.
- **Notes.** Publish a `kind: decision` per gap, or one decision listing all of them.

## Fences
- Records only: `plans/tickets/`, `plans/board.md` (Backlog/Ready rows plus one `_Updated:` line), notes.
- No `src/`, no `AGENTS.md`. Never push or merge.

## Publish
- Seal notes with `/Users/olgeroeselg/.claude/plugins/cache/grugops/grugops/2.1.0/scripts/context-io.js` (`admitAndAppend`, task `bapm-rule-QE-159`).
- Write `.grugops/queue/done/bapm-rule-QE-159.md` (brief + `## Result` + trace row) and `.claim.md`, uncommitted on main.
