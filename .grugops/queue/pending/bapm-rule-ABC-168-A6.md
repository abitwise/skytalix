---
subtask: bapm-rule-ABC-168-A6
role: ba-pm
ticket: plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md
ref: .grugops/context/bapm-rule-ABC-168-A6/
width: 3 (beside scribe-ABC-168 and qe-ABC-187; disjoint files)
---

# BA/PM: rule ABC-168's `A6` — an in-lane per-reply latency needs an async child, which ABC-173's `C2` guard forbids

The SE built Scope 1–3 and 6 (`grugops/ABC-168` @ `2ed5469a`; notes `…c7c0a672`, A6 stop `…a4721906`, readings `…c6c1358b`) and stopped on `A6` only:
- `A6` (idle responsiveness, EPIC-007 M3, *proposed*): spawn → `uciok` ≤ 2 s; first `isready` → `readyok` ≤ 1,000 ms; idle `isready` → `readyok` ≤ 100 ms, "read once with host and load1… A miss is reported, not trimmed."
- **Blocker:** a per-reply latency needs an async child; ABC-173 `C2` (`ADR-0008` addendum 2026-10-19, owner-accepted) fails `npm test` on any async `child_process` form in `src/**/*.test.ts`; `A11` forbids editing `C2`. One hand reading of the withdrawn async version (Apple M3, load1 3.74): `uciok` 88 ms, first `readyok` 7 ms, idle `readyok` 0.1 ms.
- **Routes the SE lists:** (1) Architect amends `ADR-0008` for one serial async child + BA/PM widens `A11`/`A12`; (2) `A6` becomes a hand reading at QE/UAT; (3) `spawnSync` whole-child upper bounds (can bound 2 s and 1,000 ms, not the 100 ms idle reading: Node start-up is ~90 ms).

## Decide
- The Orchestrator's recommendation is **route (2)**: `A6` is already "read once… reported, not trimmed", a measurement rather than a pass/fail gate, so a QE hand reading (an async probe script **outside** `src/**/*.test.ts`, e.g. under `.grugops/context/qe-ABC-168/probe/`, recording host and load1) keeps `C2` and the owner-accepted `ADR-0008` addendum intact. Rule it, or rule otherwise with a reason.
- Say whether EPIC-007 M3's wording is affected (if it is, do not edit `EPIC-007`; name the change for the owner).
- Amend the page (date it, cite the SE's notes), re-score DoR. The card moves to In Review when the Scribe's Scope 5 lands; leave the column to the Orchestrator.

## Fences
- Records only: the ABC-168 page, notes. No `EPIC-007`, ADR, `src/`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md` edits. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-rule-ABC-168-A6`). **Pass the main checkout as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/bapm-rule-ABC-168-A6.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**:
  `| ABC-168 ({hop}) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
