---
id: 20261108T202759Z-orchestrator-decision-10a4d82c
kind: decision
by: orchestrator
at: 2026-11-08T20:27:59Z
verified_by: 
confidence: high
refs:
  - ABC-298
  - ADR-0077 d9
  - …56ac06ee
  - …d097e25f
supersedes: 
seal: sha256:9cb81fb732b361d9f5d02624249673d2356e33302a15de7163e1e6932eb93aa7
---

## Count probe GO; step 4 dispatched

Merged `grugops/arch-ABC-298-probe` (tip `9b0da5eb`) at `558a25e5`, path check clean. Plan `…56ac06ee` sealed before the run; identity held on all three boards. s = 0.0754 (kiwipete), 0.0579 (position-6), 0.0320 (start): one board under 0.048, STOP needs two, so **GO** by the sealed rule. Read: the bound caps start near 1.02, so SG3 needs kiwipete and position-6 at ≥ 1.03; their bounds are about 1.047 and 1.036, tight. No bar moves.

`main`'s `src/` tree is `bba42fb7`, unchanged since ADR-0077 was written. **Step 4:** `qe-ABC-298-freeze` on `main`'s tip under the lock, as d9 step 4 lists, untimed. Step 5's check is mine before any build dispatch.

Carried: ADR-0077 d8 calls ABC-299 the 400-game close read; ABC-299's page says R3, 200 games against Stockfish. To the Architect's next hop on this ticket.
