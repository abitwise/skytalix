---
id: 20261101T125800Z-orchestrator-decision-2896c6eb
kind: decision
by: orchestrator
at: 2026-11-01T12:58:00Z
verified_by: 
confidence: high
refs:
  - memory-bank/50-decisions/ADR-0056
  - plans/epics/EPIC-011
  - plans/tickets/ABC-255
supersedes: 
seal: sha256:dac1b694b3c64bb0f6a5f11a68220188dfd0fb9f2939a15ef7999405b5236ae0
---

# Owner word 2026-11-01: no SPRT; 100 games per change, 400 games per epic, at 100 ms

Owner, verbatim: "I see the problem, we have a minimum of 19h feedback loop for elo +10 zone. We need to skip even testing it due to time constraints. This just takes too much time. I understand logically this makes sense if we want to detect if the change produced +10 elo rating gain or not. But keep in mind the effort is not worth it and error rate is still high enough that detection might be untrue. We can just run 100 games that's it and 400 games after each epic is done on 100ms. This squeezes the algorithm to be better with less cpu resources. IBM Deep Blue had 11.38 GFLOPS, AMD Ryzen AI 9 HX 370 1 Single Core at 5.1 GHz is 100 GFLOPS so we have good amount of computing power even with 1 core."

Orchestrator reading (supersedes the SPRT proposals in …aab3b5f4 and ADR-0056 C2; ABC-255 "SPRT lane" is re-scoped or dropped by BA/PM):
1. **Per change (strength-changing tickets): 100 games at 100 ms per move**, one game at a time. Reading: new build vs its base, self-play, both colours per opening (Orchestrator's reading of "100 games"; owner may correct). Resolves only large effects (~±70 Elo at 95 %); it guards against clear regressions, it does not prove small gains — accepted by the owner ("the effort is not worth it").
2. **Per epic: 400 games at 100 ms** when the epic is done (the milestone-style interleaved pair, base vs head each against Stockfish, as the milestone-1 batch but at 100 ms; Stockfish's move time set from qe-tc-depth-probe so its pick depth holds).
3. These two runs are owner-set, so they need no further "> 1 h" ask (400 games at 100 ms is estimated ~1.3–2 h). Any other run over 1 h is still asked.
4. Value-identical (speed) tickets keep their nps reading, no games.
5. The 40/15 claim reading (ADR-0056 C1) is unchanged by this word; it is spent only when readings say ≥ 3 000, and asked first.
Records owed: Architect folds ADR-0056 C2/C3 after qe-tc-depth-probe reports; BA/PM folds EPIC-010/011 merge rule and ABC-255.
