---
subtask: bapm-amend-epic009
role: ba-pm
ref: .grugops/context/bapm-amend-epic009/
branch: new grugops/bapm-amend-epic009 from main, worktree ../wt-bapm-amend-epic009
ids: ABC-223, ABC-224 free if a new ticket is needed (EPIC-010 holds ABC-225..239)
---

# Amend EPIC-009 and ABC-218..222 to the owner's answers (records only)

## Read
- The owner's words, verbatim plus the Orchestrator's reading: `orch-2026-10-29g/…a67f71ac`. They govern.
- Your own EPIC-009 notes (`bapm-epic009-tournament/…371570e0`, `…4d365276`, `…77ab69c0`) and the SA time note
  `sa-ideas-verify/…1ccf0010`.
- Architect `arch-epic009-settings` runs in parallel and rules the input form and the ADR text. Don't pre-empt it:
  write "form per the Architect's ruling" where needed. If its note has landed when you need it, cite it.

## Do
- **ABC-218:** a dated close line: closed by the owner, not run (non-deterministic, not usable for the tournament).
- **The epic:** status, options (owner picked (a) first, then (b) later), Q1–Q8 answered with dates, the measures.
  Smoke readings are 5–10 cutechess games; major validation (≥ 100 games) and any strength reading are later and out
  of this MVP. Levels 1–7 unchanged.
- **Re-cut the tickets to two settings, `simple-tournament` and `uci-clock-mode`:**
  - simple-tournament: fixed T under a 22.5 s hard ceiling. UCI is required (cutechess). Say whether CLI parity is
    worth keeping, and keep it only if cheap and clean; otherwise put it out of scope, with the reason.
  - uci-clock-mode (later milestone): real clock, margin, hard stop, 60 s per-move ceiling.
  - An acceptance smoke reading for each (5–10 games at 40/15, 0 losses on time, closest call ≥ 500 ms, ≥ 75 % clock
    use, where that measure applies).
  - Re-use ABC-219..222 where they fit. Re-scope, merge or retire them with dated lines, and don't renumber.
- **The Q4/Q8 tension:** a 22.5 s ceiling plus ≥ 500 ms at move 40 means T < 22.5 s. Give the arithmetic and propose T.
  The owner is told the number. Don't change the ceiling.
- Re-score the DoR. Tickets that wait only on the Architect's ruling stay Backlog, with that named. List the board lines
  you want in your decision note.

## Fences
- Records only: `plans/epics/EPIC-009-…`, `plans/tickets/ABC-218..224`, your context. No `src/` or `tools/` edits.
  No board edits. No ADR edits (Architect). Never push, force, amend or rebase. Never merge into main.

## Publish
- Seal notes (task `bapm-amend-epic009`) with `at` from `date -u`: the amendment decision and the ticket list. Commit
  on your branch. Write `## Result` plus a 10-cell trace row into this brief, then move it and its claim.md to done/.

## Result

**Done 2026-10-29 by BA/PM.** Branch `grugops/bapm-amend-epic009` @ `cae71d3f`, one commit on `main` `a5d70e35`,
records only. 7 files plus the context: `plans/epics/EPIC-009-…md`, `plans/tickets/ABC-218..ABC-223`, and
`.grugops/context/bapm-amend-epic009/`. The notes were sealed via the sanctioned writer (`context-io` `admitAndAppend`)
because the `propose_note` tool was absent in this session.

- `20261029T202438Z-ba-pm-decision-cf275d0c`: the amendment, T's arithmetic, the CLI-parity call, and the board lines.
- `20261029T202438Z-ba-pm-decision-0db19860`: the ticket list.

**The epic.**
- Accepted (Q8). `proposed` → `backlog`.
- Two settings: `simple-tournament` (milestone 1; fixed T; 22.5 s hard ceiling) and `uci-clock-mode` (milestone 2,
  later; real clock, margin, hard stop, 60 s ceiling for the mode only).
- Levels 1–7 are unchanged. Q1–Q8 are recorded with dates. A smoke reading is 5 games at 40/15. Major validation and
  strength are out of the MVP.

**T = 22 000 ms (proposed; the ceiling of 22 500 does not move).**
- The clock left after move 40 is `900 000 − 40(T + o)`. At `o` = 31 ms that is 18 760 ms. Q8 holds while `o` ≤ 487 ms.
- 22 500 gives about 50 ms, which misses Q8. The headroom under the ceiling is 500 ms. M2 is 97.8 % (83.1 % with 6 book
  moves).
- The owner is told the number. The Architect may refine it.

**CLI parity: out.** It has no user (Q1, Q7) and no clock to honour. It would cost `ABC-219`'s whole M, and it is not
clean under a separate-input form.

**Tickets.**
- `ABC-218` closed by the owner, not run (Done, dropped).
- `ABC-219` retired, closed unbuilt (Done, dropped).
- `ABC-220`: `simple-tournament`, M, P2, 9/10, Backlog. It waits only on the Architect's ruling.
- `ABC-222`: its smoke reading, S, P2, 9/10, Backlog, after `ABC-220`.
- `ABC-221`: `uci-clock-mode`, M, P3, 9/10, Backlog. It waits on the Architect's ruling.
- `ABC-223` (new): its smoke reading, S, P3, 9/10, Backlog, after `ABC-221`.
- `ABC-224` is unused.

**Not touched:** `src/`, `data/`, `tools/`, the ADRs, `plans/board.md`, `plans/traceability.md`, and `EPIC-010`'s
files. No test, game or probe ran. The Architect's note had not landed, so the pages read "form per the Architect's
ruling".

**For the Orchestrator:**
- Merge `cae71d3f`.
- Place the board lines from `…cf275d0c`. No card leaves Backlog, and Ready is unchanged.
- Append the trace row below.
- Tell the owner T = 22.0 s.
- When `arch-epic009-settings` lands and the owner accepts its ADR, route a BA/PM hop to fill in the form and move
  `ABC-220` to Ready.

### Trace row (10 cells, header order)

| EPIC-009 amend (bapm-amend-epic009) | EPIC-009 accepted (Q8) and amended to the owner's Q1–Q8 (…a67f71ac): two settings, simple-tournament (fixed T = 22.0 s proposed under the owner's 22.5 s hard ceiling; owner told) then uci-clock-mode (60 s ceiling, mode only, later); levels 1–7 unchanged; CLI parity out; 5-game 40/15 smoke readings; ABC-218 closed by owner (not run), ABC-219 retired, ABC-220/221/222 re-scoped, ABC-223 new | EPIC-009 | — | NFR-004 (22.5 s / 60 s, owner's word; text Architect + Security/NFR), NFR-009 (re-read at 60 s), NFR-008, ADR-0044 D4/D5, ADR-0045, AR-NFR004-A; RISK-EPIC009-01..07; notes …cf275d0c, …0db19860 | grugops/bapm-amend-epic009 @ cae71d3f (records only)<br>plans/epics/EPIC-009-…md; plans/tickets/ABC-218..ABC-223 | — (records only) | n/a (records) | not released | EPIC-009: Backlog (accepted); ABC-218, ABC-219 Done (dropped); ABC-220..223 Backlog (220/221 on arch-epic009-settings); card moves the Orchestrator's |
