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

## Result

**DONE.** Records only, uncommitted on `main`. Note: `.grugops/context/bapm-rule-QE-159/notes/20261021T082841Z-ba-pm-decision-99559726.md`
(`kind: decision`, sealed via `admitAndAppend`, `validate` → `[]`). Every gap was re-read at `main` `63f09a81`,
where `src/` is unchanged since the merge `29e1d822`.

| gap | ruling |
|---|---|
| QE-159-a LOW | **CUT → ABC-179.** San makes no fail/catch claim, and attributes only what `nfr-catalog.md:555-558` says. No new headroom claim, because that needs a timing measurement. |
| QE-159-b LOW | **Fixed in records.** Erratum under ABC-159 A4 (the verdict stands). The 400 prefix is added to the bare `CLI_DEEP` commands in ABC-161 and ABC-164. The guard refuses one-file runs too. ABC-176's bare strings are deliberate. The AGENTS.md rule landed with the Scribe in `0297e802`. |
| QE-159-c INFO | **Accepted.** A prose regex is always narrower than the class, and it costs NFR-008 budget. Reopen trigger: a third recurrence of the tally class. |
| QE-159-d INFO | **CUT, bundled into ABC-179.** The quoted words are not in the catalog. The clock-to-count move is there in substance (`:25`, `:49`, `:53`, `:55`), so a pointer is fine and a quote is not. |
| QE-159-e INFO | **CUT, bundled into ABC-179.** Name the `runtimeImporters` equality instead of `:329`. Net-0 lines in `cli.test.ts`. |
| QE-159-f INFO | **AGENTS.md's form is the reference measurement; the brief's `__snapshots__` filter is retired from briefs.** The owner's 2026-10-17 `.snap` rule (`…be910aa8`) is conditional on the Orchestrator reading each snapshot, and the filter hides the trigger. No `.snap` has changed since `d22a709f`, so there is no harm so far. **Orchestrator → Scribe:** add the owner's clause inside the third override, which stays the third. |
| QE-159-g INFO | **Closed** by `scribe-agents-md-2026-10-21` (merged `0297e802`). |

- **Ticket:** `plans/tickets/ABC-179-three-test-comments-say-what-their-source-does-not.md`. XS, P3, EPIC-002, DoR 10/10, **Ready**. Ready is now 3/8.
  - Four files, comment lines only: `san`, `status-panel` and `history-pane` `*.nfr.test.ts`, plus `cli.test.ts` `A12`.
  - A1–A3 base readings were taken at `63f09a81`.
  - No blocker. It shares `cli.test.ts` with ABC-161 and ABC-168 on disjoint hunks.
  - Next free id: **ABC-180**.
- **Other pages:** ABC-159 (erratum), ABC-161, ABC-164 (heap prefix). The criteria are unchanged.
- **Board:** one `_Updated:` line, the ABC-179 Ready row, and the Ready header 2/8 → 3/8.
- **Fences:**
  - No `src/`, `AGENTS.md` or `plans/traceability.md` edit.
  - Nothing committed, pushed or merged.
  - No other worktree touched. The `ABC-095` page diff and the `security-nfr-ABC-162` files in the tree belong to another agent.

### Trace row (for the Orchestrator to append to `plans/traceability.md`)
| ABC-179 | Three test comments say what their source does not (QE-159-a, -d, -e) | EPIC-002 | — | NFR-008 (0/0/0) | — (not started; src/{san,status-panel,history-pane}.nfr.test.ts headers + src/cli.test.ts A12 comment) | A1–A4 on page; QE hop owed | waiver expected (0 production lines; AGENTS.md form) | — | Ready (DoR 10/10; cut in bapm-rule-QE-159, …decision-99559726) |
