---
subtask: bapm-cut-AR-183-CWDARG
role: ba-pm
ticket: ABC-183 (Done, merged 7a609285)
ref: .grugops/context/security-nfr-ABC-183/
width: 2 (beside ticket-to-pr-ABC-161; disjoint files)
---

# BA/PM: cut ABC-184, the XS P3 test-only fix for AR-183-CWDARG (QE-183-a)

Security/NFR ruled `…41f70925`: AR-180-VALIDATED is closed, and AR-183-CWDARG is opened (LOW, Orchestrator-owned; owner record `…bc2b06ce`). Dropping `booked`'s `neutral` cwd argument leaves the `CLI_DEEP` lane 11/11 under P6f, because A7 asserts the variable, not the child's working directory. QE's plant evidence is in the `qe-ABC-183` notes (verdict `…be7c2c82`); Security/NFR's scratch FIX measurement is in `…d5fd47e1`.

## Read first
- The ABC-183 page, including its QE section.
- The ABC-095 page's latest Security/NFR addendum (AR-183-CWDARG).
- Notes `…41f70925`, `…d5fd47e1`, `…be7c2c82`, `…bc2b06ce`.
- `src/cli.real-engine.test.ts` at `main` (A7, `spawnReal`, `spawnNode`, `RealChild`).

## Cut
- **Fix shape (Security/NFR's).** `RealChild` records the `cwd` it spawned with; A7 asserts `booked.cwd` equals `neutral`, with a message naming `AR-183-CWDARG`. 0 new spawns, 0 new tests, 0 production lines. Fence it to `src/cli.real-engine.test.ts`.
- **Acceptance.** A plant table read by QE, base test vs head test: none (green/green), P6f (red/red), **TCWD + P6f (green on base, red on head at the new assertion)**, TCWD alone (state the expected row). Plus the fence counts in ABC-183 `A5`'s style (file list, waiver form, `npm test` and `CLI_DEEP` counts equal, children 6).
- **Close condition.** AR-183-CWDARG closes when QE reads TCWD + P6f red at head.
- **Promotion trigger.** Same as AR-180-VALIDATED's: an edit to `src/book-file.ts`, or a packaging/bin/launch-path ticket (ABC-168 fires it; ABC-161 does not). On fire → P2, owed before that ticket merges. Any earlier ticket editing A7, `spawnReal`, `spawnNode` or `RealChild` carries the fix instead.
- **Housekeeping.** Id ABC-184 (verify it is free in `plans/tickets/`). Score DoR; place it in Ready if 10/10. Note on ABC-168's page or card that ABC-184 is owed before its merge, if that is where such owed items are recorded.

## Fences
- Records only: the new ticket page, `plans/board.md` (one row, header counts, one `_Updated:` line prepended above the first existing one), notes, and at most a one-line owed-item note on ABC-168's page.
- No `src/` or `AGENTS.md` edits. Never push or merge. Do not touch `../wt-ABC-161` or `src/cli.test.ts`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`; task `bapm-cut-AR-183-CWDARG`). Take every `at` from `date -u`; never copy another note's stamp.
- Write `.grugops/queue/done/bapm-cut-AR-183-CWDARG.md` (brief + `## Result` + trace row as one `| ABC-184 | … |` line) and `.claim.md`, uncommitted on main.

## Result

**DONE.** Records only, uncommitted on `main` (base `69610c5b`). Note: `.grugops/context/bapm-cut-AR-183-CWDARG/notes/20261021T102658Z-ba-pm-decision-f5fcdaf5.md` (`kind: decision`, sealed with `admitAndAppend`; `validate` → `[]`).
- **Base readings.** `src/cli.real-engine.test.ts` and `src/book-file.ts` at `69610c5b` are byte-identical to `3ab055f4`. So QE's TCWD cell (`…cbd50a13`) and Security/NFR's FIX cells (`…d5fd47e1`) apply unchanged. They are cited, not re-taken. This hop ran no plant and no test.
- **Id check.** `ABC-184` is free: there is no `plans/tickets/ABC-184-*` and no branch. The highest id was `ABC-183`.

- **Ticket:** `plans/tickets/ABC-184-a7-asserts-the-booked-child-spawned-from-neutral.md`. XS, P3, EPIC-005, DoR 10/10, **Ready**. Ready is now 2/8.
  - **Fix (Security/NFR's shape).** `RealChild` gains `readonly cwd: string`. `spawnNode` returns the exact `cwd` argument it gave `spawnSync`, not a realpath. A7's `it` gains one `expect(booked.cwd, <msg naming AR-183-CWDARG>).toBe(neutral)`, placed above the stderr detector. Counts: 0 spawns, 0 tests, 0 `mkdtemp`, 0 production lines, one file.
  - **Criteria:**
    - `A1`: the field grep goes 0 → 1, and `spawnNode` returns the same `cwd` it spawns with.
    - `A2`: one labelled `booked.cwd` `expect` in A7, ahead of the detector. The label and `booked.cwd` greps go 0 → ≥ 1.
    - `A3`: the plant table, base vs head. Plants are P6f (from `…567002e7`), TCWD (drop `booked`'s `neutral` argument) and TMO (as in ABC-183 A4).

      | plant | base test | head test |
      |---|---|---|
      | none | 11/11 green | 11/11 green |
      | P6f | red at the stderr detector | red at the stderr detector |
      | **TCWD + P6f** | **11/11 green** | **red at the new assertion**, with `AR-183-CWDARG` in the output |
      | TCWD alone | 11/11 green (expected) | red at the new assertion |
      | TMO + P6f | red at ABC-183's `AR-162-FALLBACK` assertion | red at ABC-183's `AR-162-FALLBACK` assertion |

    - `A4`: ABC-183 A1's `grep -B1` is re-read. This is QE-183-b's standing read.
    - `A5`: the fences, in ABC-183 A5's style:
      - the file list is exactly the test file;
      - the waiver form is empty and unfiltered, with no `.snap`;
      - `npm test` file and test counts equal base, with 0 skips;
      - `CLI_DEEP` is 11 tests and 6 children;
      - `spawnReal(` 5, `spawnNode(` 2, `mkdtempSync(` 2, `removeCopy(` 3, `rmSync(` 1, `writeFileSync(` 1 and `existsSync(` 6 are unchanged;
      - `it(` stays at 11, and `expect(` goes 75 → 76;
      - no line moves above `:223`.
  - **Close condition.** QE reads TCWD + P6f red at head with the plant. The Orchestrator records the close.
  - **Promotion trigger.** As the owner recorded it (`…bc2b06ce`). ABC-168 fires it; ABC-161 does not. On fire it becomes P2, owed before that ticket merges. It is superseded if an earlier ticket edits A7, `spawnReal`, `spawnNode` or `RealChild`.
- **For the Orchestrator** (owner of `AR-183-CWDARG`; this does not change the ruling):
  - **(a) No owed-item note on ABC-168.** The owed items for ABC-180 and ABC-183 were never recorded on ABC-168's page or card. They lived on the owed ticket's page and in board `_Updated:` lines, so this cut does the same. Decide whether ABC-168 should carry its owed list.
  - **(b) ABC-168 may carry the fix.** ABC-168 Scope 3 leaves the file for its real-child lane to the Engineer. If that lane lands in `src/cli.real-engine.test.ts` and reuses `spawnNode`/`RealChild`, it carries this fix.
  - **(c) Two readings are expected, not measured** (`UNKNOWN - verify`): the base column of TCWD alone, and typecheck of the shape. The SE's gates and QE read them.
- **Board:** one `_Updated:` line, the `ABC-184` Ready row, and the Ready header 1/8 → 2/8. Next free id: **ABC-185**.
- **Fences:**
  - No `src/`, `AGENTS.md`, `plans/traceability.md`, ABC-168 or ABC-183 page edit.
  - `../wt-ABC-161` and `src/cli.test.ts` were not touched.
  - Nothing was committed, pushed or merged.
  - This hop wrote the claim record. The brief moved pending → claimed → done by `claim.js` `transition`, and the claim directory was removed.

### Trace row (for the Orchestrator to append to `plans/traceability.md`)
| ABC-184 | RealChild records the cwd it spawned with; A7 asserts booked.cwd is neutral, labelled AR-183-CWDARG, so TCWD no longer disarms the AR-095-CWD / AR-162-FALLBACK detector under P6f | EPIC-005 | — | NFR-008 (0/0/0); closes AR-183-CWDARG (QE-183-a) | — (not started; src/cli.real-engine.test.ts: RealChild, spawnNode return, A7 it) | A1–A5 on page; QE hop owed (TCWD, P6f, TMO plants; TCWD + P6f base green / head red is the close row) | waiver expected (0 production lines; AGENTS.md form) | — | Ready (DoR 10/10; cut in bapm-cut-AR-183-CWDARG, …decision-f5fcdaf5) |
