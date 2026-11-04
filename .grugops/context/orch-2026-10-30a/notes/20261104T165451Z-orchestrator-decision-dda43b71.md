---
id: 20261104T165451Z-orchestrator-decision-dda43b71
kind: decision
by: orchestrator
at: 2026-11-04T16:54:51Z
verified_by: 
confidence: high
refs:
  - ADR-0067
  - B-T8
  - ADR-0056
  - ABC-283
  - QE-271-f
  - QE-271-g
  - QE-271-h
  - QE-271-i
supersedes: 
seal: sha256:78be50229e6641f6cc571520ea502009218634a1ed051b7457965815d74af03c
---

Owner answers 2026-11-04: "1. yes; 2. yes; super news about ABC-233, 234 and 236 together having very nice impact. This could be approach for future as well, compounds the evidence better."
1. ADR-0067 d6 amendment: YES. The second pull uses the margin-aware form, with every relation bounded at once from the first fit and no refit step.
2. B-T8 re-confirmed for the second pull: the 200 + 200 outside pair against Stockfish, about 5 h. The owner's approval covers this run over 1 h.
3. Owner direction, the bundling approach: related changes may be built together and judged by one read. The Architect drafts it as a dated rule in ADR-0056's per-change rule (EPIC-011 § The per-change rule), with guards drawn from ABC-283:
   - each part keeps its own door, and the all-off door is node-identical to main;
   - every safety row (mate floor, zugzwang, G1) is read with all parts on, and per part when one goes red;
   - the pre-registered single read is never re-played;
   - a part that only re-opens a not-met premise needs the owner's word, or the rule's own trigger;
   - credit is to the bundle, not per part.
   The rule's acceptance is the owner's: it changes the per-change rule. Reading (b): it may be used while PROPOSED for bundles the owner names.
Routing: arch-second-pull-1104 writes the ADR-0067 d6 amendment, the B-T8 carry and the bundling rule draft. Then BA/PM cuts the second-pull ticket, whose preconditions are QE-271-h's hot-path row, QE-271-g's guard, QE-271-i (the emitter's four new exports) and QE-271-f's endgame cost row.
