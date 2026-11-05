---
id: 20261105T074310Z-orchestrator-decision-b836b85c
kind: decision
by: orchestrator
at: 2026-11-05T07:43:10Z
verified_by: 
confidence: high
refs:
  - ABC-282
  - ABC-303
  - ABC-301
  - ADR-0056
  - ADR-0067
  - e5a5ac0c
  - 681c6363
supersedes: 
seal: sha256:78107f391d223d6527a92ae99694fec54501aee13e64eaa33b6a8b4a4ed3947c
---

Owner's answers, 2026-11-05, verbatim: "1. yes; 2. yes; 3. wait".
1. W1's A4: approved, about 3.5 h in one lock hold, 5 games at tc=40/900, not shortened. A pass with no other blocking gap signs UAT; a miss is F5, to Architect/Design. A6 is not re-played.
2. New C2' after a candidate fault: yes, as put to him. One new read on the fixed tree, only if the fault could have decided the verdict; a fault that could not have changed it leaves NOT MET final; a second candidate fault is NOT MET; nothing tuned between reads; a clean low score stays final. A clean C2' stands after a value-identical fix, with only the faulted S' replayed, and the answer reaches any read not yet sealed: both were stated to him before he answered and he did not object.
3. Tuning: wait, as in …e5a5ac0c. No third fit now and no date. Next evaluation terms go on their own reads with hand values. A third pull may be asked for only after a term named before this miss has merged on its own read; at most one more attempt; a third miss on this row closes tuning. Tools land via a tools-only ticket from b297ab89, never either tip, after an N8-LANE read.
Attribution of e1e5 is not run; the owner did not object.
A4 holds the lock alone: no test, build or engine run by anyone until it ends, so the hops running beside it are records only.
