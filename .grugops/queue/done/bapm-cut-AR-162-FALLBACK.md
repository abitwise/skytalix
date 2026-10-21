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

## Result

**DONE.** Records only, uncommitted on `main` (base `e68962d6`). Note: `.grugops/context/bapm-cut-AR-162-FALLBACK/notes/20261021T083538Z-ba-pm-decision-facf462c.md` (`kind: decision`, sealed via `admitAndAppend`, `validate` → `[]`).
- **Base readings.** `src/cli.real-engine.test.ts` and `src/book-file.ts` at `e68962d6` are byte-identical to `ABC-162`'s tip `3d05e230`, so QE's plant matrix (`…567002e7`) applies unchanged. It was cited, not re-taken.
- **Id check.** `ABC-180` is free: no `plans/tickets/ABC-180-*`. The highest id was `ABC-179`.

- **Ticket:** `plans/tickets/ABC-180-a-decoy-book-in-a7s-neutral-cwd-reds-a-cwd-first-read-with-a-module-fallback.md`. XS, P3, EPIC-005, DoR 10/10, **Ready**. Ready is now 4/8.
  - **G-1.** A decoy of non-UTF-8-JSON bytes goes at `<neutral>/data/opening-book/book.json` in `A7`'s existing `beforeAll`. It is removed with its directory by the existing exact-path `removeCopy(neutral)`. 0 new spawns, tests or removal calls.
  - **Why it is not a book.** A valid book reads silently, so P6f would pass again. The non-JSON form reds every cwd form through the probe's one fixed warning. This is on the page, and plant PD guards it.
  - **G-2.** `expect(booked.stderr, …)` gets a message, and a `//` line above it. Both name the `AR-095-CWD` / `AR-162-FALLBACK` detector.
  - **Also reworded:** three comments that call `neutral` empty or `data/`-less (`:47-50`, `:443`, `:476-477`).
  - **Criteria:** `A1` decoy present, not the book, not JSON; 11/11; PD reds. `A2` P6f green at base, red at head; P6b/c/e stay red; the label is in the failure output. `A3` 0 leftovers. `A4` label grep ≥ 2. `A5` stale-comment grep exits 1. `A6` fences and equal counts.
  - **Close condition.** QE reads `A2`'s P6f row red at head with the plant.
  - **Promotion trigger.** As Security/NFR ruled, it is stated on the page. It makes `ABC-180` due before the triggering ticket merges.
- **For the Orchestrator** (owner of `AR-162-FALLBACK`; this does not change the ruling):
  - **(a)** BA/PM reads "`EPIC-006` cut or pulled" as a packaging/`bin` ticket. So `ABC-161`, the epic's one open ticket, does not fire it. `UNKNOWN - verify` with Security/NFR.
  - **(b)** `ABC-168` adds a `bin` and a new importer of `book-file.ts`, but fires neither clause as written. BA/PM recommends treating its pull as firing the trigger.
  - **(c)** `ABC-168` and `ABC-172` cite `src/cli.real-engine.test.ts:84`. That line is already off; the pointers are prose only.
- **Board:** one `_Updated:` line, the `ABC-180` Ready row, and the Ready header 3/8 → 4/8. Next free id: **ABC-181**.
- **Fences:**
  - No `src/`, `AGENTS.md`, `plans/traceability.md` or `ABC-162` page edit.
  - Nothing committed, pushed or merged.
  - The claim record was written by this hop. The brief moved pending → claimed → done by `claim.js` `transition`, and the claim directory was removed.

### Trace row (for the Orchestrator to append to `plans/traceability.md`)
| ABC-180 | A decoy book in A7's neutral cwd reds P6f; A7's stderr assertion names itself the detector (AR-162-FALLBACK: G-1, G-2) | EPIC-005 | — | NFR-008 (0/0/0); closes AR-162-FALLBACK | — (not started; src/cli.real-engine.test.ts A7 block + header) | A1–A6 on page; QE hop owed (P6f, P6b, P6c, P6e, PD plants) | waiver expected (0 production lines; AGENTS.md form) | — | Ready (DoR 10/10; cut in bapm-cut-AR-162-FALLBACK, …decision-facf462c) |
