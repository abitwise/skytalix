main copy (unpatched): tests 2395, passed 2394, failed 1, failed suites 8
lane copy (H on by default): tests 2395, passed 2371, failed 24, failed suites 21

Failed assertions in the lane copy (file | test):
- src/cli.real-engine.test.ts | ABC-119 — the real-engine lane's child is the delivered composition (default lane; spawns nothing) the deep child runs the delivered entry point with no --import, loader or hook, and an empty environment
- src/engine.test.ts | ABC-249 — a pre-root repetition met four plies deep scores 0 (QE-248-c) Qe5+ at ply 4 stood twice before the root: Ke1 at 441 with the keys, Kg1 at 520 without
- src/evaluate.pawns.test.ts | ABC-083 A8 — the isolation check reads BOTH adjacent files d4 with its only neighbour on the LEFT (c3) scores higher than d4 with a3, both isolated
- src/evaluate.pawns.test.ts | ABC-083 A8 — the isolation check reads BOTH adjacent files d4 with its only neighbour on the RIGHT (e3) scores higher than d4 with b4, both isolated
- src/evaluate.pawns.test.ts | ABC-235 cut 5 — the pawn memo returns what a fresh pawnStructure returns is a fixed 448 KiB: 2^14 slots of two 8-byte masks and three 4-byte parts
- src/evaluate.queen-on.test.ts | ABC-270 K1 (b) — value identity: evaluate is Object.is the pre-ticket evaluate on the frozen corpora G3's 184 in buildCorpus order
- src/evaluate.queen-on.test.ts | ABC-270 K1 (b) — value identity: evaluate is Object.is the pre-ticket evaluate on the frozen corpora QE's ABC-269 door corpus (176; every taper-corpus position, the KP rows among them, and its mirror)
- src/evaluate.queen-on.test.ts | ABC-270 K1 (b) — value identity: evaluate is Object.is the pre-ticket evaluate on the frozen corpora QE's ABC-270 queen pairs and their mirrors
- src/evaluate.taper.test.ts | ABC-269 B1 (a) — a position and its colour mirror score exactly equal, Object.is, at every phase the frozen rows span phases 0 to 24, and the -0 traps are real (mg exactly 0 on the door)
- src/evaluate.taper.test.ts | ABC-269 B1 (e) — the passers: >= 1.5 x at phase <= 6, exact at 24, <= 1.25 x at >= 18 'E-w2-p18': 'white' passer on 'd2', own rank 2, phase 18
- src/evaluate.taper.test.ts | ABC-269 B1 (e) — the passers: >= 1.5 x at phase <= 6, exact at 24, <= 1.25 x at >= 18 'E-w3-p18': 'white' passer on 'd3', own rank 3, phase 18
- src/evaluate.taper.test.ts | ABC-269 B1 (e) — the passers: >= 1.5 x at phase <= 6, exact at 24, <= 1.25 x at >= 18 'E-w4-p18': 'white' passer on 'd4', own rank 4, phase 18
- src/evaluate.taper.test.ts | ABC-269 B1 (e) — the passers: >= 1.5 x at phase <= 6, exact at 24, <= 1.25 x at >= 18 'E-w5-p18': 'white' passer on 'd5', own rank 5, phase 18
- src/evaluate.taper.test.ts | ABC-269 B1 (e) — the passers: >= 1.5 x at phase <= 6, exact at 24, <= 1.25 x at >= 18 'E-w6-p18': 'white' passer on 'd6', own rank 6, phase 18
- src/evaluate.taper.test.ts | ABC-269 B1 (e) — the passers: >= 1.5 x at phase <= 6, exact at 24, <= 1.25 x at >= 18 'E-w7-p18': 'white' passer on 'd7', own rank 7, phase 18
- src/evaluate.taper.test.ts | ABC-269 B1 (e) — the passers: >= 1.5 x at phase <= 6, exact at 24, <= 1.25 x at >= 18 'E-b2-p18': 'black' passer on 'e7', own rank 2, phase 18
- src/evaluate.taper.test.ts | ABC-269 B1 (e) — the passers: >= 1.5 x at phase <= 6, exact at 24, <= 1.25 x at >= 18 'E-b5-p18': 'black' passer on 'e4', own rank 5, phase 18
- src/evaluate.taper.test.ts | ABC-269 B1 (e) — the passers: >= 1.5 x at phase <= 6, exact at 24, <= 1.25 x at >= 18 'E-b7-p18': 'black' passer on 'e2', own rank 7, phase 18
- src/evaluate.taper.test.ts | ABC-274 A3 — the blend is live for every term family (ADR-0067 decision 8, scope 1) MATERIAL: the score is mg + trunc((Δ + offset) × (D − w) / D), exactly, on ≥ 3 positions at phases 1–23
- src/evaluate.taper.test.ts | ABC-274 A3 — the blend is live for every term family (ADR-0067 decision 8, scope 1) PST.knight: the score is mg + trunc((Δ + offset) × (D − w) / D), exactly, on ≥ 3 positions at phases 1–23
- src/evaluate.taper.test.ts | ABC-274 A3 — the blend is live for every term family (ADR-0067 decision 8, scope 1) PST.bishop: the score is mg + trunc((Δ + offset) × (D − w) / D), exactly, on ≥ 3 positions at phases 1–23
- src/evaluate.taper.test.ts | ABC-274 A3 — the blend is live for every term family (ADR-0067 decision 8, scope 1) PST.queen: the score is mg + trunc((Δ + offset) × (D − w) / D), exactly, on ≥ 3 positions at phases 1–23
- src/evaluate.taper.test.ts | ABC-274 A3 — the blend is live for every term family (ADR-0067 decision 8, scope 1) MOBILITY_CAP: the score is mg + trunc((Δ + offset) × (D − w) / D), exactly, on ≥ 3 positions at phases 1–23
- src/transposition.test.ts | A7 — the table holds a fixed 4 MiB, whatever the search stays inside NFR-009's 16 MiB with the key array, the pawn memo and the ordering scratch

Failed assertions in the main copy:
- src/cli.real-engine.test.ts | ABC-119 — the real-engine lane's child is the delivered composition (default lane; spawns nothing) the deep child runs the delivered entry point with no --import, loader or hook, and an empty environment

Suites failed to load in both copies (environment: repository data outside src/ not archived): book-engine, book, cli, pgn, render-seam, tools/grugops/qe-hop-integrity.
