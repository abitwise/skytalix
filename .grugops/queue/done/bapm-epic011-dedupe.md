---
subtask: bapm-epic011-dedupe
role: ba-pm
ref: .grugops/context/bapm-epic011-dedupe/
branch: new grugops/bapm-epic011-dedupe from main (worktree .claude/worktrees/bapm-epic011-dedupe)
width: records only (no vitest, no engine, no games). qe-ABC-223 holds the host STRICTLY ALONE. An Architect hop folds the owner's answers into ADR-0056 beside you (ADRs only).
---
# BA/PM: new epic for the 3 000 path; close-out plan for the open epics; dedupe all epics and tickets (records only)
## Owner word
.grugops/context/orch-2026-10-30a/notes/20261101T124000Z-orchestrator-decision-022fb66f.md (verbatim inside), and …74216a44 (goal 3 000; O1 chosen). ADR-0056 (PROPOSED → accepted in direction), ADR-0055 (ACCEPTED O1).
## Do
1. **Audit every epic and ticket** (EPIC-001…010, every plans/tickets page in Backlog/Ready/Blocked/Dropped and the board's Backlog/Ready): find work that duplicates or conflicts with ADR-0056's path or with each other (same technique cut twice; a Backlog ticket fenced by one epic and wanted by another; dropped tickets ADR-0056 wants re-tried — e.g. ABC-209 after ABC-238, ABC-207/210 forms). Produce a table: ticket/epic, overlaps with, verdict (keep where it is / move to the new epic / merge into X / supersede / drop), reason. No work is done twice.
2. **Close-out plan for the open epics** (owner: finish the others first): EPIC-006, EPIC-009, EPIC-010 (status backlog today). For each: what remains to Done, which remaining tickets are really 3 000-path work (move them to the new epic instead of blocking the close), and the exit reading each still owes. Keep milestone 1b (ABC-250…254, O1) wherever ADR-0055/0056 order says — say where and why.
3. **Create EPIC-011** (the 3 000 Elo classical path, ADR-0056): goal 3 000 read at 40/15 on Stockfish UCI_Elo (scale as ADR-0056 proposes; any part the owner has not confirmed stays marked), fast routine readings at shorter time controls down to 0.5 s/move (owner's word), milestones per ADR-0056 (2 200 … 3 000), phases, the tickets that move in (renumber nothing; re-home with dated lines), and new tickets as titles-only stubs where ADR-0056 names gaps with no ticket (cut full pages only for the first phase's items). Status: backlog, starts after the open epics close. Open owner calls listed: Q-3K-2 (SPRT in the per-change rule), Q-3K-3 (cores), Q-3K-4, Q-3K-6, Q-3K-7, Q-3K-8, Q-SP-3 (ABC-254).
## Fences
- plans/epics, plans/tickets only (plus your notes). No board, trace, ADRs, src/, tools/, data/, AGENTS.md. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `bapm-epic011-dedupe`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/. Hand the Orchestrator the board moves to make.

## Result

**2026-11-01, BA/PM. Done, records only. Branch `grugops/bapm-epic011-dedupe` (worktree `.claude/worktrees/bapm-epic011-dedupe`, from `main` `2e9a2457`). Records commit `04aa32d6`; notes commit `add68e39`. Nothing run, built or timed (`qe-ABC-223` holds the host). Not pushed, not merged. No board, trace, ADR, `src/`, `tools/`, `data/` or `AGENTS.md` edit.**

- **1. Dedupe audit** (`EPIC-011` § Dedupe audit: epics table, tickets table, conflicts C1–C11). Moved to `EPIC-011`, ids unchanged: `ABC-231`, `232`, `233`, `234`, `236`, `237`, `238` (P3 → P2, now first in Phase 1), `239`, `254`. Merged: `ABC-231`/`232` into E1 (and E4) at Phase 4; `EPIC-009`'s major validation into `EPIC-011`'s 40/15 readings. Superseded: `ABC-209` by `ABC-257`; `ABC-218` by the 40/15 readings. Stay dropped, re-tried only in another form: `ABC-210` (X1), `ABC-205` (E1 + E3), `ABC-207` (E5 by the tuner). Order conflicts: T1 → T2 adopted (C2); O1-a/O1-b with the Architect (C3); `ABC-254` after O1-b with `ADR-0055` D4's "first" kept as an exception (C11). Stale front matter folded to Done: `ABC-203`, `212`, `213`, `214`, `216`, `226`, `227`, `246`.
- **2. Close-out.** `EPIC-006`: nothing open; save/resume not earned, not built; close is a card move. `EPIC-009`: `ABC-223` then the milestone-2 grade; W1, the 40/15 strength reading and the major validation moved out. `EPIC-010`: `ABC-249`, `ABC-250` → `251` → `252` → `253`; close hop for M3/M4; **M2 stands on milestone 1's batch** (no production `src/` change since `51902be5`; 1b value-identical), saving a ≈ 23 h batch. Milestone 1b stays in `EPIC-010`, last.
- **3. `EPIC-011`** (backlog, XL, P2; after the open epics): goal 3 000, claim at 40/15 (confirmed); scale, claim rule, milestones 2 200…2 800 *[proposed]*; Phases 0–5 per `ADR-0056` D6. New full pages: `ABC-255` M0 SPRT lane (M, P1, 8/10), `ABC-256` B0 baseline (S, P2, 8/10), `ABC-257` T3 (S, P3, 8/10), `ABC-258` T4 8 MiB (S, P3, 8/10). Later phases are title stubs without ids. Owner calls: Q-3K-2, 3, 4, 6, 7, 8, Q-SP-3, and confirming the scale and claim rule.
- **Notes** (task `bapm-epic011-dedupe`, contextRoot = worktree; 3/3 read back): decision `…508818ae`, artifacts `…7ed16308`, owed `…447dd09b` (the board moves are listed there).

### Trace row (10 cells, header order)

| EPIC-011 / ABC-255..258 (cut); ABC-231..234, 236..239, 254 (re-homed) | owner 2026-11-01: 3 000 read at 40/15; fast readings to 0.5 s/move; new epic after EPIC-006/009/010; no work twice. EPIC-011 created on ADR-0056 D6 (M0 SPRT lane, B0 baseline, TT block T1–T4, pruning, ordering, taper + tuner, extensions/time/speed); dedupe audit C1–C11; close-out plans for EPIC-006/009/010 | EPIC-011, EPIC-010, EPIC-009, EPIC-006 | ADR-0056 (accepted in direction; owner fold in flight), ADR-0055 (ACCEPTED O1), ADR-0025 d4 amendment (accepted, not in force; ABC-257), ADR-0003 (amendment owed for ABC-254) | NFR-009 (ABC-257 growth ≤ 1 MiB; ABC-258 8 MiB, > 16 MiB on Q-3K-6); NFR-005 G6; NFR-008 ≤ 0.1 s lane (ABC-255); NFR-004 (W1, 40/15) | grugops/bapm-epic011-dedupe @ 04aa32d6: plans/epics/EPIC-011-… (new), EPIC-006/009/010 (dated), plans/tickets/ABC-255…258 (new), 9 re-homed, 4 dropped + 1 dated, 8 front matter folds (records only) | none run (records only) | n/a (records); engine tickets owe UAT signed by QE | — | EPIC-011 Backlog (starts after the open epics); ABC-255, 256, 257, 258 Backlog 8/10 |
