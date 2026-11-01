---
id: 20261101T131000Z-orchestrator-decision-f7a50e95
kind: decision
by: orchestrator
at: 2026-11-01T13:10:00Z
verified_by: 
confidence: high
refs:
  - memory-bank/50-decisions/ADR-0003
  - plans/tickets/ABC-254
  - memory-bank/50-decisions/ADR-0056
supersedes: 
seal: sha256:002d63b34a8b5431022f6dfb9435de80239ede7177e37538039362cfd30a6067
---

# Owner word 2026-11-01: ABC-254 yes; one core; SPRT asked to explain; 100 ms question

Owner, verbatim: "ABC-254: yes ; SPRT - not sure, explain the benefits; Keep game on one core ; One thing I wanted to discuss, would it make sense to lower the time per moves even more for quick feedback loop? Let's say 100ms per move for Skytalix and appropriate settings for Stockfish. Would 100ms be enough to validate algorithmic improvements?"

Orchestrator reading:
1. **Q-SP-3 = yes:** ADR-0003 is amended for O1-d (lazy legality). → `arch-adr0003-amend` (records). ABC-254 → Ready once the amendment is merged; pulled in milestone 1b order.
2. **Q-3K-3 = one core:** tests stay one game at a time (width 1). No parallel games.
3. **Q-3K-2 still open:** the owner asked for the benefits; explained in chat; his answer pending.
4. **100 ms per move:** a question, answered in chat with a proposal: a short host-alone QE probe after qe-ABC-223 that reads the depth skytalix reaches and its time overshoot at 100 ms / 250 ms / 500 ms / 4 s, so the routine control is set on readings. Queued as `qe-tc-depth-probe` (ALONE, ~30–45 min).
