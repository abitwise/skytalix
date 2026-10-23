---
subtask: bapm-close-EPIC-007-M2
role: ba-pm
ticket: plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md
ref: .grugops/context/bapm-close-EPIC-007-M2/
width: 2 (records only; disjoint files from arch-adr0007-bin-note)
---

# Close EPIC-007's M2 on the owner's acceptance (records only)

## Do
- The owner closed M2 (one En Croissant game) on his existing acceptance of ABC-168 A8–A10 (`…d3681daa`, citing `…0b63d92f` and your `…2fddb7fa` recommendation).
- Add one dated insertion to the EPIC-007 page: M2 closed by acceptance, not read (no agent observed a game; say so plainly). M1 and M8(a) stay open until `cutechess-cli` is on the host; then one XS agent-run QE reading ticket, as your `…2fddb7fa` describes. EPIC-007 stays open (status/column unchanged). Update `RISK-EPIC007-02` wording only if it names M2 as open.
- Do not cut the M1/M8(a) ticket now unless you judge a Backlog page with an install trigger is the cleaner record; if so, say why.

## Fences
- Work on `grugops/bapm-close-EPIC-007-M2` (worktree `../wt-bapm-close-EPIC-007-M2` from `main`). Only the EPIC-007 page and your notes. No `src/`, `memory-bank/50-decisions/`, `plans/board.md`, `plans/traceability.md`, `.grugops/factory.config.json`. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm007/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `bapm-close-EPIC-007-M2`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result (ba-pm, 2026-10-23T10:52Z): **EPIC-007 M2 closed by acceptance, not read. M1 and M8(a) stay open on `cutechess-cli`. `RISK-EPIC007-02` reworded. No ticket cut. EPIC-007 stays open (status/column unchanged). No owner question.**

These are records only, on `grugops/bapm-close-EPIC-007-M2` in `../wt-bapm-close-EPIC-007-M2`, cut from `main` `2d962400`. There is one commit, **`16f84895`**; it is not merged and not pushed.

Notes are in `.grugops/context/bapm-close-EPIC-007-M2/notes/`. They were sealed with grugops 2.1.0 `context-io.js` `admitAndAppend` (context root: the worktree's `.grugops/context`) and read back 2/2 by `readContext`:
- `20261023T105223Z-ba-pm-observation-c9347adf`: the host re-check (`which cutechess-cli` empty; no En Croissant in `/Applications` or `~/Applications`; no result lines, `-pgnout`, PGN, `-debug` log or screenshot under any ABC-168 context);
- `20261023T105223Z-ba-pm-decision-b5f65536`: the rulings.

| item | ruling |
|---|---|
| EPIC-007 page | **One dated box** under the 2026-10-18 acceptance box: M2 closed on the owner's acceptance of ABC-168 A8–A10 (`…0b63d92f`, recommended in `…2fddb7fa`), owner word `…d3681daa` quoted verbatim. It says plainly that no agent observed a game, that M2's GUI-options sentence and its `-debug` fallback were not read, and that M2 rests on the owner's word alone. |
| M1, M8(a) | **Open, owed, unread.** The only check of `RISK-EPIC007-01`. Trigger: `which cutechess-cli` prints a path on the owner's Mac. Then BA/PM cuts one XS QE reading ticket (agent-run, raw files kept, flag spellings pinned, no human gate). |
| M1/M8(a) ticket | **Not cut.** No step can start before an undated install, so a Backlog page would be an idle card. A cut owes a board card and a trace row, and both files are fenced here, so a cut now would be a half-record. The box and the M1/M8(a) rows already hold the targets and the trigger. |
| `RISK-EPIC007-02` | **Reworded** (it named M2 and ABC-168's UAT as waiting): now M1 and M8(a) wait on `cutechess-cli`, and EPIC-007 stays open. The superseded text is kept inline, dated. `RISK-EPIC007-01` is unedited ("an M2 error" stays true as a description). |
| EPIC-007 | **Stays open.** Front matter `status: accepted`, `column: Backlog` unchanged. |

Files on the branch:
- `plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md` (+30/−2): the dated box, the RISK-EPIC007-02 reword;
- 2 notes.

Not touched: `src/`, `memory-bank/50-decisions/`, `plans/board.md`, `plans/traceability.md`, `.grugops/factory.config.json`, every other page, the Architect's worktree, git config. In main's checkout, only this queue record and its claim moved, uncommitted, for the Orchestrator.

**For the Orchestrator:** append the trace row below to `plans/traceability.md` at merge (fenced at this hop). The board's `orch-2026-10-23n` line already reads "EPIC-007 stays open (M1, M8(a))"; no column move.

### Trace row (10 cells, header order)

| EPIC-007 M2 (bapm-close-EPIC-007-M2) | M2 (one En Croissant game) closed by the owner's acceptance of ABC-168 A8–A10, not read: no agent observed a game; M1 and M8(a) stay open until cutechess-cli is on the host, then one XS agent-run QE reading ticket (not cut now: idle until install; board/trace fenced); RISK-EPIC007-02 reworded (M2 dropped) | EPIC-007 | — | RISK-EPIC007-01 (checked only by M1/M8(a)); RISK-EPIC007-02; no NFR bound moved; notes …d3681daa, …0b63d92f, …2fddb7fa, …c9347adf, …b5f65536 | grugops/bapm-close-EPIC-007-M2 @ 16f84895 (records only)<br>plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md (one dated box + RISK-02 reword) | — (records only; host re-check: which cutechess-cli empty, no En Croissant, no game files) | M2 accepted by owner word (…0b63d92f, …d3681daa), not read | — | EPIC-007 open (status/column unchanged); M1, M8(a) owed on cutechess-cli install |
