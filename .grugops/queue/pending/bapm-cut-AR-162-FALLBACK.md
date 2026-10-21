---
subtask: bapm-cut-AR-162-FALLBACK
role: ba-pm
ticket: ABC-162 (Done, merged f459353e)
ref: .grugops/context/security-nfr-ABC-162/
width: 1
---

# BA/PM: cut the XS P3 test-only ticket for ABC-162's G-1 and G-2 (AR-162-FALLBACK)

Security/NFR ruled `…06c147db`: AR-095-CWD is closed, and AR-162-FALLBACK is opened (LOW, Orchestrator-owned). The recommendation is one XS, P3, test-only ticket covering G-1 and G-2. QE's measurements are in `…567002e7` (plants and decoy probe) and `…68554c31` (verdict).

## Read first
- The ABC-162 page, including its QE section.
- The ABC-095 page's 2026-10-21 Security/NFR addendum.
- Notes `…06c147db`, `…3ea2c883`, `…567002e7` and `…68554c31`.

## Cut
- **G-1 (the shape Security/NFR named).** In A7's `beforeAll`, write **non-book** bytes to `<neutral>/data/opening-book/book.json`.
  - A1's wording changes from "holds no `data/`" to "holds a decoy book file that is not the delivered book".
  - A2 adds P6f: green at base, red at head, read by QE with the plant.
  - No new spawn and no new test. The file goes with the directory, removed by its exact path.
  - The decoy must NOT be a valid book. State why on the page.
- **G-2.** Add an assertion label and a one-line comment on `expect(booked.stderr).toBe("")`, naming it as the detector for both risks.
- **Close condition.** AR-162-FALLBACK closes when the ticket's P6f row is read red at head by QE.
- **Promotion trigger.** Any ticket that edits `src/book-file.ts`, or EPIC-006 being cut or pulled. Either makes this ticket due before that ticket merges. State it on the page.
- **Housekeeping.** Use the next free id (ABC-180; verify it against `plans/tickets/`). Score DoR, and place the ticket in Ready or Backlog per the DoR.

## Fences
- Records only: the new ticket page, `plans/board.md` (one row, the header count, one `_Updated:` line), notes.
- No `src/` or `AGENTS.md` edits. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`; task `bapm-cut-AR-162-FALLBACK`).
- Write `.grugops/queue/done/bapm-cut-AR-162-FALLBACK.md` (brief + `## Result` + trace row) and `.claim.md`, uncommitted on main.
