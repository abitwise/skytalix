---
subtask: bapm-page-closes
role: ba-pm
ref: .grugops/context/bapm-page-closes/
branch: new grugops/bapm-page-closes from main (worktree .claude/worktrees/bapm-page-closes)
width: records only (no vitest, no engine, no games). qe-ABC-246 holds the host for timing; you must not run anything.
---
# BA/PM: close the ABC-243, ABC-244 and ABC-245 pages (records only, LOW)
## Read
- Each page's front matter and body; the board's Done rows for them; their QE hand-backs in .grugops/queue/done/qe-ABC-24{3,4,5}.md and the QE notes under .grugops/context/qe-ABC-24{3,4,5}/ (and secnfr-ABC-244).
## Do
- Per page: front matter → done / Done with a `closed:` line; a CLOSED block (QE verdict note id, merge SHA from the board); disposition every QE gap (fold, carried with a named carrier, or closed). A gap that needs a new ticket: propose it in your Result, do not cut it unless it is plainly XS and test-only.
- ABC-248's page is out of scope (it is Ready and next to be pulled).
## Fences
- plans/tickets/ABC-243*, ABC-244*, ABC-245* only (plus your context notes). No board, trace, epics, ADRs, src/, tools/, data/. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `bapm-page-closes`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.

## Result

**2026-11-01, BA/PM. Done, records only.** Branch `grugops/bapm-page-closes` from `main` `55fbc90e`; nothing run, built or timed (`qe-ABC-246` holds the host). Page commit `b76b821e`; notes commit `c12969f8`. Only the three ticket pages and this task's context were edited. Not merged, nothing pushed.
Notes (task `bapm-page-closes`): decision `…1bf0cc8f`; observation `…9ddd7118` (supersedes `…72d14dd7`, which listed `ABC-246`'s files incompletely).
- **ABC-243 → done / Done.** QE PASS `qe-ABC-243` `…2d790e40`; merged `3628fe99`; UAT waived. QE-243-a, -b and SE-243-a/-c/-d/-e closed. **QE-243-c carried to proposed ticket P-1.**
- **ABC-244 → done / Done.** QE PASS `qe-ABC-244` `…4fe9bfe1` + Security/NFR PASS `secnfr-ABC-244` `…9087cb39`; merged `24b22339`; UAT waived. **QE-244-a carried** (BA/PM's R4 DoR line at every cut; `ABC-248` already fences the U2 rows out). QE-244-b, -d (overtaken by `ABC-248`), -e, -f, SE-244-c/-d/-e closed. QE-244-c closed for this ticket (4 of 9 survivors killed elsewhere on record; 5 `UNKNOWN - verify`, proposal P-2). Secnfr carries closed; the `ADR-0046` status line it owed is met.
- **ABC-245 → done / Done.** QE PASS `qe-ABC-245` `…b2ebc183`; merged `2cce84e0`; UAT waived. QE-242-b and SE-242-f closed. **QE-245-b carried by `ABC-248`.** QE-245-a, -c (accepted maintenance cost), -d, SE-245-a/-b closed.
- **Proposed, not cut** (the fence allows only the three pages):
  - **P-1 (ticket, XS, P3, test-only):** the `NFR-009` deep row's printed label (`src/transposition.test.ts:695`, "3 s" for the 4 s search) and its `const three` (`:676`) name the `DEFAULT_BUDGET_MS` search by its budget. Deep lane only, no `G8` cost. Or fold into the next ticket that edits that file; nothing in flight names it.
  - **P-2 (a read, not a ticket):** run S241M5, QPARITY, QCLOCK, QPLY4 and QPATHOFF against the whole default lane in a later QE hop that already runs mutants (for example `qe-ABC-248`). A survivor there becomes a gap for BA/PM.
- **Still owed (LOW, outside this brief):** `ABC-248`'s page reads `status: ready` / `column: Backlog` while the board has it Ready.

### Trace row (10 cells, header order)

| ABC-243 / ABC-244 / ABC-245 page closes | Three Done tickets' pages closed (done / Done, CLOSED block with QE verdict note and merge SHA); every QE/SE/secnfr gap dispositioned | EPIC-010 | ADR-0046 § Addendum 2026-10-30 R4; § Ruling 2026-10-31 | none (records only) | plans/tickets/ABC-243, ABC-244, ABC-245 (front matter + CLOSED block) — b76b821e | qe-ABC-243 …2d790e40; qe-ABC-244 …4fe9bfe1 + secnfr-ABC-244 …9087cb39; qe-ABC-245 …b2ebc183; merges 3628fe99, 24b22339, 2cce84e0 | QE PASS ×3 (UAT waived, 0 production lines) | — | Done (pages now agree with the board); P-1 ticket and P-2 read proposed to the Orchestrator |
