---
id: 20261104T205921Z-orchestrator-decision-5ec6c124
kind: decision
by: orchestrator
at: 2026-11-04T20:59:21Z
verified_by: 
confidence: high
refs:
  - ABC-289
  - ABC-282
  - ABC-301
  - NFR-008
  - ADR-0074
supersedes: 
seal: sha256:2354aa710330352482d94d41448b3665a8e18c813d2056b5ad501a70a1228126
---

bapm-lines-1104 merged 55e1bede (ABC-289 DoR 10/10, Ready). Rulings:
1. The row census gates the second of ABC-282 / ABC-301 to merge, per …f30bd604 item 3. …085f647c item 5's looser wording is superseded on this point. The census is also sized for whichever of bundle 1 and ABC-289 proceed.
2. DP5 names G2's byte identity (ADR-0074 d12 (d)), at the next BA/PM hop.
3. ABC-289's build is held until the owner answers OQ-0074-1 and the bundle 1 question, although reading (b) would allow it now. It would edit engine.ts doors beside se-ABC-282, and the bundle answer sets the order. The third WIP slot stays free for that reason.
4. BA/PM J1–J7 accepted, with no change. The bapm slip (a stray cat, one own PID sent SIGTERM) is LOW.
5. Owed at the next BA/PM hop: the per-change rule pointer reading ACCEPTED, arch-bundle-1's owed lines, and the two new owner questions in EPIC-011. Owed at the next Architect records hop: ADR-0056 row Q2, ADR-0066 d5's line, and the QE-302 LOW carry.
