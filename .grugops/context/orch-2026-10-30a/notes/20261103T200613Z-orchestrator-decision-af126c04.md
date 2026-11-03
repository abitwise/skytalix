---
id: 20261103T200613Z-orchestrator-decision-af126c04
kind: decision
by: orchestrator
at: 2026-11-03T20:06:13Z
verified_by: 
confidence: high
refs:
  - ADR-0067
  - ADR-0056
  - ADR-0024
  - ABC-274
  - ABC-239
  - ABC-270
  - Q-3K-7
  - Q-3K-9
  - B-T8
  - SEC-HP-2
supersedes: 
seal: sha256:85825669987d5a4f0219b41340cb596ddbaefa35f69ac13e3807a7222add3f13
---

Owner answers 2026-11-03 (verbatim): "1. yes ; 2. yes ; 3. no ; 4. no ; 5. ok yes ; 6. yes ; 7. yes; 8. yes".
Mapping (the eight items as asked):
1. ADR-0067 ACCEPTED -> ABC-274 merge released (QE PASS_WITH_GAPS already signs UAT).
2. Q-3K-7 (a) YES: tuner may train on the public-domain (CC0) Lichess database export, alongside own self-play.
3. Q-3K-7 (b) NO: no Stockfish-labelled positions as training targets.
4. Q-3K-7 (c) NO: no training on our games vs Stockfish (those stay the outside measuring stick).
5. B-T8 APPROVED: the 200+200-game outside pair vs Stockfish (~5 h, over the 1 h ask line) before ABC-239 merges.
6. Q-3K-9 YES: ADR-0024 d4 opened for design of Q1 (SEE pruning of losing captures); design only, build on its own evidence.
7. SEC-HP-2 YES: one-line forward redaction of .grugops/context/se-ABC-262/raw/gates/summary.txt line 5; no history rewrite.
8. ABC-270 design (E3a king safety by phase) may start now, ahead of ABC-239's build.
Orchestrator plan: merge ABC-274 (path check + post-merge tests); dispatch Architect fold (ADR-0067/0056/0024 + SEC-HP-2 redaction), ABC-270 design, Q1 design; then ABC-239 build (SE), B-T8 (QE, ALONE) once its candidate exists.
