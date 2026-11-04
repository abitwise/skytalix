---
id: 20261104T203850Z-orchestrator-decision-f30bd604
kind: decision
by: orchestrator
at: 2026-11-04T20:38:50Z
verified_by: 
confidence: high
refs:
  - R-N8H-1
  - Q-N8H-1
  - ABC-282
  - ABC-301
  - ABC-286
  - ABC-288
  - ADR-0071
supersedes: 
seal: sha256:678fb893e3fb9a5103ed076804bf10fb8faed32ea6ec312b54ca78b32ac06ad1
---

secnfr-ABC-302-a9 merged 4792ce78 (decision …0089724b). R-N8H-1 stays MEDIUM; not re-read to fish for 9.49 s. Q-N8H-1 recorded (a).
Rulings on its advice:
1. Budgets. ABC-282 and ABC-301 hold ≤ +0.10 s each. Added aim, not a gate: rows a ticket adds or changes sum to ≤ 90 ms in-thread, none added to src/cli.test.ts. Bundle 1 (ABC-286 + ABC-288) holds ≤ +0.10 s as a whole, same terms.
2. Q-N8H-1 gap (the lane returning to ≥ 9.6 s later): a row move first; the owner only if the next graded read is still ≥ 9.6 s. This is an Orchestrator reading inside his answer (a); it moves no limit. Disclosed to him, and he may overrule it.
3. Row supply: a census of main is owed before the second of ABC-282 / ABC-301 merges, asking for about −0.15 s (−0.28 s if bundle 1 also lands). Dispatched after W1's build, because it is a timing hop on the lock.
4. Heads-up to the owner: after these budgets and known leads the lane sits around 9.5–9.6 s with few rows left, so the 10 s limit will become a real constraint on later tickets.
5. Next: se-ABC-282 (W1). D12 items 1–4 and 6 are the SE's: b re-read by P1's method and frozen before A1 (c); A0's counts re-read on the new base. D12 item 5 (ADR-0066 d5's dated line) goes to the next Architect records hop. Budget lines on the four pages go to the next BA/PM hop; the brief carries them meanwhile.
