---
subtask: bapm-ABC-222-epic009-m1
role: ba-pm
ticket: ABC-222, EPIC-009
ref: .grugops/context/bapm-ABC-222-epic009-m1/
branch: new grugops/bapm-ABC-222-epic009-m1 from main ae7211c3
width: records only (an SE runs beside you)
---
# BA/PM: ABC-222 read PASS (merged ae7211c3) — close it; grade EPIC-009 milestone 1
Read qe-ABC-222 notes (`…cc542c76` verdict, `…00cc4db1` reading, `…4daf292f` findings), EPIC-009 (M1–M4, milestones), ABC-220 (Done),
ABC-221, ABC-223.
- Close ABC-222 (Done; QE verdict signs UAT; QE-222-a build-tip note; QE-222-f resolves the PGN-precision question).
- Grade EPIC-009 milestone 1 (simple-tournament) against M1–M4 from ABC-220 + ABC-222 readings; record RISK-EPIC009-02/03 not
  exercised (QE-222-d/e). Milestone 2 (ABC-221, ABC-223) state and pull order.
- Note for Security/NFR (no catalog edit here): AR-NFR004-A at 22 s through the real pipe max +2 ms (QE-222-b).
- While there (LOW, records): QE-225w1-b — restate ABC-225/EPIC-010's 400-game pair estimate (18.5 h projected at width 1, was 22–24 h).
Fences: records only (tickets, epics, notes). No src/, tools/, data/, ADRs, catalog. Never push, force, amend, rebase, merge into main. No board edits. Never bare npx/npm exec. No host paths. Wait on jobs via output file or `kill -0 <pid>`, never `while pgrep -f`. Seal with context-io admitAndAppend (host is shared with an SE, which is fine for records).
Publish: notes (task `bapm-ABC-222-epic009-m1`), commit, `## Result` + trace row here, brief + claim to done/.
