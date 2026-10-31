---
subtask: bapm-ABC-221-fold
role: ba-pm
ticket: ABC-221, ABC-223, EPIC-009
ref: .grugops/context/bapm-ABC-221-fold/
branch: new grugops/bapm-ABC-221-fold from main (worktree .claude/worktrees/bapm-ABC-221-fold)
width: records only; no vitest, no timing, no long-running scripts. Leave no process running.
---
# BA/PM (records): close ABC-221; owed folds; ABC-223 re-score
## Read
qe-ABC-221, se-ABC-221 and secnfr-ABC-221's notes and done/ briefs on main; the ABC-221 page (Test note 4); ABC-223's page; EPIC-009.
## Do
1. **ABC-221** page: mark it Done (merged af32f82c + 9395d8dc). QE PASS_WITH_GAPS signs UAT; Security/NFR PASS.
   - Fix A6's "(≥ 117 s)" to 17 205 ms, or state the +900 000 shape (SE-221-a, confirmed by QE).
   - Dispositions: QE-221-a (LOW: cut an XS test ticket with QE's two rows, or record why not), QE-221-b (INFO: the stale levels.ts comment; it can join that ticket or ABC-245's successor), SE-221-b..g, SEC-221-a/b.
2. **Test note 4 folds:** ADR-0045 § AMENDMENT A3's dated line (HARD_CEILING_MS 60 000), and ADR-0044's uci-clock-mode halves (D3's third value, D4.5's clock-mode line with D4.4's clamp at 60 000, D5's ≤ 60 s). These are the ADR folds the page assigns to BA/PM. Do not edit ADR-0052; it is the Architect's.
3. **ABC-223:** its wait (ABC-221 merged) is met. Re-score its DoR. The board move is the Orchestrator's.
4. **EPIC-009:** milestone 2 status line (ABC-221 Done; ABC-223 next).
5. G8: the Orchestrator ruled ABC-221's 9.84 s inadmissible (contended host; base also read +0.41 s). Record it as such, not as a trigger.
## Fences
Records only: plans/tickets/, plans/epics/, and the ADR-0045/ADR-0044 fold lines. No board, src/, tools/ or data/ edits. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `bapm-ABC-221-fold`, contextRoot = worktree), commit, `## Result` + trace row(s) here, brief + claim to done/.

## Result

**2026-10-31, BA/PM. Done. Records only.** Branch `grugops/bapm-ABC-221-fold`, from `main` `9c008db4`. Records commit `4a87316d`; this Result and the brief/claim move are in the next commit. Not merged, nothing pushed. Nothing run, built or timed; no process left running. `src/`, `data/`, `tools/`, the board, the trace files and `ADR-0052` untouched.

Notes (task `bapm-ABC-221-fold`, sealed with context-io `admitAndAppend`, context root = the worktree's `.grugops/context`, `at` 2026-10-31T06:19:28Z; `readContext` read back 2 of 2; index rendered):
- decision `…b64a6549`: the close, A6, every disposition, `G8`, `ABC-223`, `EPIC-009`, the ADR folds;
- observation `…04bbe823`: the git and grep re-reads at `9c008db4`.

| item | ruling |
|---|---|
| ABC-221 | **Done.** Front-matter `done`/`Done` + `closed:`; CLOSED block (QE PASS_WITH_GAPS `…861e737d` signs UAT; Security/NFR PASS `…ef060512`, its QE conditions met). Merged `af32f82c` (code `c48a6f83`) + `9395d8dc`; `git diff c48a6f83 9c008db4 -- src data tools` empty |
| A6 | "(≥ 117 s by arithmetic)" struck; **17 205 ms** after move 80 as worded; 117 735 ms named as the +900 000-after-move-40 shape; bound ≥ 1 000 ms unchanged (SE-221-a, QE-confirmed). `ADR-0052` D4's sentence is the Architect's |
| A9 / `G8` | A9 MET (9.84 s ≤ 10 s). **9.84 s recorded as inadmissible as `ABC-244`'s tranche-2 trigger, by the Orchestrator's ruling** (`9c008db4`; contended host, base +0.41 s). Not a trigger; re-read at `ABC-245`'s QE |
| QE-221-a (LOW) | **Cut `ABC-246`**: XS, P3, EPIC-009, test-only, UAT waived, **DoR 10/10** (front-matter Ready; the board move is yours). Rows: `go wtime 3000 btime 3000 winc 500 binc 500 movestogo 1` → 1 900; `go wtime 900000 btime 900000 movestogo 40 movetime 5000` → 5 000; HSCM / CLOCKWINSCM red. Plus SE-221-g's comment in `src/engine.test.ts` |
| QE-221-b (INFO) | Not in `ABC-246` (a production line would void its waiver). Carried in `ADR-0045` A3's fold line for the next ticket that edits `src/levels.ts` production lines. The Architect may also name one (`arch-ABC-221-records` item 4) |
| SE-221-b..g, SEC-221-a/b | b + `SEC-221-b`: Architect's (D8). c: sound, named in the ADR-0045 A3 line. d, e: no action. f: superseded by `G8`. g: joins `ABC-246`. `SEC-221-a`: Security/NFR's at any budget > 59 500; no ticket. QE-221-c: yours (reap) |
| ADR folds | `ADR-0045`: FOLDED § Status block; A3 clamp bullet (60 000, largest ceiling in force; clause B re-pin; QE-221-b) and clause-B bullet (60 s). `ADR-0044`: § Status line (pointer fully folded); D3 `uci` row (three-value line) and `setoption` row (tuple, refusal text); D4.4 (60 000); D4.5 (32 000 bullet marked; new `uci-clock-mode` bullet); D5 (≤ 60 s, read exactly). D11 needs none |
| ABC-223 | **DoR 9/10 → 10/10, Ready** (row 10 ✅). Build `af32f82c`; a later sha counts only if `git diff af32f82c <sha> -- src data` lists only `*.test.ts`. A6's budget derived by D4 (no engine line names it; read from code). Not beside a `G8`; ALONE excludes a foreign 100 % core |
| EPIC-009 | MILESTONE 2, HALF DONE block (`ABC-221` Done; `ABC-223` next); table rows 3–4 updated, `ABC-246` row added; `RISK-EPIC009-07` closed (NFR-009 MET at 59.5 s) |

Owed elsewhere (not this hop): the `AGENTS.md` `TimeMode` line for `uci-clock-mode` (the Scribe, per Security/NFR's § Next); `ADR-0052` D4/D8 (`arch-ABC-221-records`).

### Board card lines (for the Orchestrator)
- **ABC-223, Backlog → Ready:** `DoR 10/10 2026-10-31 (bapm-ABC-221-fold, …b64a6549): ABC-221 merged af32f82c; build af32f82c (later sha only if src/data diff is *.test.ts only); A6 budget derived by D4; ALONE, ≤ ~5 h, not beside a G8.`
- **ABC-246, new → Ready:** `[ABC-246] In uci-clock-mode, rows pin the hard stop (winc near the clock edge → 1 900) and movetime over a clock (→ 5 000); + SE-221-g comment (QE-221-a; size: XS, priority: P3, test-only, UAT waived; DoR 10/10; cut by bapm-ABC-221-fold)`.

### Trace rows (10 cells, header order)

| ABC-221 (bapm-ABC-221-fold) | Closed Done: merged af32f82c (code c48a6f83) + 9395d8dc; A6 corrected to 17 205 ms (SE-221-a); G8 9.84 s recorded inadmissible as tranche-2 trigger (Orchestrator); QE-221-a → ABC-246; QE-221-b carried in ADR-0045 A3 | EPIC-009 | ADR-0045 § AMENDMENT A3 folded (HARD_CEILING_MS 60 000); ADR-0044 D3/D4.4/D4.5/D5 uci-clock-mode halves folded; ADR-0052 (Architect's) | NFR-004 60 s (A10 max 59 500.8 ms); NFR-009 MET at 59.5 s; AR-UCI-BUSY ≤ 60 s exact; NFR-008 A9 MET 9.84 s (inadmissible as trigger); notes …b64a6549, …04bbe823 | grugops/bapm-ABC-221-fold @ 4a87316d (records only) | — (records only; QE readings cited) | UAT signed by QE PASS_WITH_GAPS (qe-ABC-221 …861e737d) | Orchestrator: board, trace; Scribe: AGENTS.md TimeMode line | Done (merged 2026-10-31, not pushed) |
| ABC-246 | In uci-clock-mode, rows pin the hard stop and movetime over a clock (QE-221-a); SE-221-g comment | EPIC-009 | ADR-0052 D2/D4 (read, unchanged) | NFR-008 ≤ 10 s (0 real-engine rows) | — (cut; src/uci-session.test.ts, src/engine.test.ts comment) | — | waived (test-only) | — | Ready (cut 2026-10-31, DoR 10/10) |
| ABC-223 | Smoke reading uci-clock-mode, 5 games at 40/15 — re-scored | EPIC-009 | ADR-0052 D1/D4 | NFR-004 60 s (A5) | — | — | — | — | Ready (DoR 10/10, 2026-10-31) |
