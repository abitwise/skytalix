<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-ABC-239-rulings

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-03T22:25:30Z | decision | architect-design | high (rules fixed before any run) |  | # arch-ABC-239-rulings PREREG: three small reads before the rulings (b), (c) and the B1 (d) relation. Sealed before any measured run |
| 2026-11-03T22:36:37Z | decision | architect-design | high on (c) (Stockfish 19 d26, the ADR-0050 d9 instrument, rule 2 by a wide margin) and (d) (decision 9's text); high on (b)'s math (convex loss, linear model, rounding bound); medium on B1 (e)'s retirement (an Architect reading, flagged) |  | # arch-ABC-239-rulings: the rulings that unblock ABC-239. (b) F3's bound form; (c) zugzwang.001's e1e5 is a safety failure, so the row stays; (d) the 58 probe games enter; two E1 rows retire. No bar moves |
| 2026-11-03T22:36:37Z | observation | architect-design | high (each figure read from the run outputs in raw/) |  | # arch-ABC-239-rulings results: R1–R3 as pre-registered (`…90b469ca`). A2 (b) reads +8 on four parameters; B1 (d) is green; zugzwang.001's e1e5 loses (Stockfish 19 d26 −633, e1f1 mate in 10) |
| 2026-11-03T22:36:37Z | observation | architect-design | high |  | # arch-ABC-239-rulings owed lines: BA/PM, QE, the Orchestrator and the ABC-270 build. Owner questions: none (one flag) |
