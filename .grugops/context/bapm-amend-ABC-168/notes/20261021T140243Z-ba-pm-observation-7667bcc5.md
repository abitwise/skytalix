---
id: 20261021T140243Z-ba-pm-observation-7667bcc5
kind: observation
by: ba-pm
at: 2026-10-21T14:02:43Z
verified_by: 
confidence: high
refs:
  - ABC-168
  - EPIC-007
  - EPIC-007 M9
  - A7
  - ADR-0044
  - ADR-0044 D8
  - ADR-0044 § Addendum 2026-10-21
  - 816b9082
  - 9035e9be
  - grugops/ABC-168
  - 2f02d158
  - 20261021T135830Z-architect-design-observation-5a20f1f5
  - 20261021T135831Z-architect-design-decision-ce80739a
  - 20261021T135832Z-architect-design-decision-618fccad
  - plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md
  - plans/board.md
supersedes: 
seal: sha256:895ee14e4951de40f630c11cb88dfb2b09b08a5c95b187f5edcb4a3261439fb9
---

# Owed by the owner: confirm EPIC-007 M9's rewording before QE/UAT reads ABC-168 A7; fallback (b)

EPIC-007 M9 (owner-accepted 2026-10-18, …c3e81a57) still reads "dist/ holds no *.test.js, no cli.js and no turn-loop.js". ABC-168's A7 now says those type-only emits may be present and are not loaded. This hop did not edit M9 (brief fence).
The proposed rewording, from …618fccad, is: "dist/uci.js loads no turn-loop.js, as A7 measures". Until the owner confirms it, A7 cannot be read as M9's proof at QE or UAT. The SE's restart from the WIP patch (grugops/ABC-168 @ 2f02d158, already with "include": []) does not wait on it.
If the owner declines, the fallback is option (b): move EngineSeam out of src/turn-loop.ts. That needs another ADR-0044 amendment, because turn-loop.ts is on D2's no-edit list that A11 reads. ABC-168's page is then re-cut, with A7 back to presence wording and Scope/A12 widened. Per …ce80739a (b) does not remove history.js, so a presence-only A7 would still need history.js allowed.
Files touched by this hop (uncommitted on main): plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md and plans/board.md (the card, the Ready header 0/8 → 1/8, and one _Updated line). Done record: .grugops/queue/done/bapm-amend-ABC-168.md.
