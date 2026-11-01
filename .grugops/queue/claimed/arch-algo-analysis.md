---
subtask: arch-algo-analysis
role: architect-design
ref: .grugops/context/arch-algo-analysis/
branch: new grugops/arch-algo-analysis from main (worktree .claude/worktrees/arch-algo-analysis)
width: records + reading only. qe-ABC-223 is playing timed games STRICTLY ALONE: run no vitest, build, benchmark or engine. Web reading is fine. A records-only BA/PM hop runs beside you (it edits plans/; you do not).
---
# Architect spike: the state of skytalix's search and evaluation, and the path to 3 000 Elo (classical, no neural net)
## Owner word
.grugops/context/orch-2026-10-30a/notes/20261101T120000Z-orchestrator-decision-74216a44.md (verbatim inside). Goal now 3 000 Elo; speed path = ADR-0055 option O1.
## Do
1. **ADR-0055 status:** a dated line — owner chose O1 (in-TypeScript cuts) 2026-11-01; O2/O3 not pursued now; prototype not run; O1-d waits ADR-0003's amendment (owner yes pending). Then status ACCEPTED (O1).
2. **Inventory (read src/):** every search technique present and its parameters (alpha-beta form, PVS?, iterative deepening, aspiration, null move (R, conditions), LMR?, futility/razoring?, extensions (check?), quiescence (captures, evasions, promotions), move ordering (TT move, MVV-LVA, killers, history?), TT (size, replacement, cutoff rules), repetition/50-move, time use) and every evaluation term (material, PSTs, tapering, pawn structure, passed pawns, mobility, king safety, bishop pair, rooks on files, tempo…). Cite file:line.
3. **Ticket map:** every EPIC-010 Backlog ticket (ABC-231…239) and earlier engine-strength tickets/ADRs (search the board's Done and Dropped, e.g. ABC-205's failure on depth cost; EPIC-004/008 records): what each covers, its state, whether it still stands, and what the records say it is worth.
4. **Gap list toward 3 000:** techniques common in classical (hand-crafted eval) engines in the 2 800–3 200 CCRL range that skytalix lacks, with an informal Elo range each (basis cited; mark estimates), cost, risk, dependencies, and which existing ticket covers it (or "none — new ticket"). Include tuning (ABC-239) and its data/licence wait (ADR-0048).
5. **Measurement for the new goal:** today R reads skytalix at 4 s vs Stockfish UCI_Elo 1910 at 0.5 s (8× time odds; head 72.00 % ≈ +164). Say what a 3 000 reading would need (E steps up to UCI_Elo's 3 190 cap, equal time, which scale), and what the next milestones' measures should be. Mark what is the owner's call (scale).
6. **Recommended order** (speed O1 and algorithm work interleaved), as a PROPOSED addendum or a new PROPOSED ADR — your call. Decide nothing the owner owns.
## Fences
- Write only memory-bank/50-decisions/ (ADR-0055 dated status lines; new ADR or addendum PROPOSED) and your notes. No src/, tools/, data/, plans/, board, AGENTS.md. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `arch-algo-analysis`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.
