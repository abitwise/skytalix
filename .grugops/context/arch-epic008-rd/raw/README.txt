arch-epic008-rd raw: records-only analysis of qe-epic008-close raw/r1, raw/r2 and qe-epic008-q4c raw/d.
Run: python3 -I scripts/parse.py <context-root> <data.json>; then python3 -I scripts/anN.py <data.json> > anN.txt (N = 1..4).
an1: scores by opening half and colour, pentanomial errors, opening-paired R2-R1, result types and lengths.
an2: Stockfish-judged errors, lost-game turning phase, eval bias, depth by phase (R and D).
an3: host speed: per-move nps of skytalix and of Stockfish (moves >= 400 ms), by reading and quarter.
an4: unseen errors from level positions.
No engine was run; data.json is not kept (derived, rebuilt from the raw files).
