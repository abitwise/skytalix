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

## Result

**2026-11-01, Architect/Design. Done, records and reading only.** Branch `grugops/arch-algo-analysis` (worktree `.claude/worktrees/arch-algo-analysis`, from `main` `bae25131`). ADRs + notes commit `1406a1ba`. Nothing run, built, benchmarked or played (`qe-ABC-223` holds the host); the only process run was the seal script. Not pushed, not merged. Only `memory-bank/50-decisions/`, own context and this brief edited.

- **ADR-0055 → ACCEPTED (O1)** by a dated status line (owner 2026-11-01, `…74216a44`): O2/O3 not pursued now; prototype not run; O1-d waits the `ADR-0003` amendment (owner yes pending); O1-e not now; the original PROPOSED status kept.
- **ADR-0056 PROPOSED** (`memory-bank/50-decisions/ADR-0056-the-path-toward-3000-elo-stays-classical-and-measured-an-sprt-lane-first-then-tt-pruning-ordering-and-a-tuned-tapered-evaluation-interleaved-with-o1.md`). Decides nothing the owner owns.
- **Inventory (cited file:line in the ADR):** fail-soft negamax, ID, PVS, 1-ply flat LMR, R = 3 null move, killers + MVV-LVA + hash move, 4 MiB TT cleared every move / always-replace / **exact-depth cutoffs only**, quiescence with evasions and quiet queen promotions. Missing: aspiration, history, SEE, futility/RFP/LMP/razoring, extensions, time management beyond a share. Eval: material, one untapered rule-derived PST per piece, doubled/isolated/passed-by-rank, pawn-shelter king safety, capped mobility; nothing tapered or tuned.
- **Ticket map:** `ABC-231`…`ABC-239` all stand, none started (DoR 8–9/10). `ABC-205` (G6 cost), `207` (LOSS), `209` (NEUTRAL, read under exact-depth cutoffs), `210` (NEUTRAL, horizon form) dropped; `208` GAIN; `215` NEUTRAL.
- **Top gaps by Elo per cost (estimates):** reverse futility, log-table LMR, move-count pruning, TT ≥-depth cutoffs (`ABC-238`); then full taper + tuning (`ABC-231/232` ⊂ E1, `ABC-239`); then history (`ABC-233`), TT replacement/retention/size, SEE pruning, aspiration (`ABC-236`).
- **3 000 without a NN:** classical engines reach it (Stockfish 11 HCE ≈ 3 430 CCRL 40/15); for single-threaded TS it is beyond the best precedent found (tomitankChess 4.0, pure JS, 2 820 CCRL 40/15). Central landing estimate ≈ 2 550–2 800 on R's scale; 3 000 is a stretch needing all gaps, a tuned eval, an SPRT instrument and likely speed beyond O1. Low confidence.
- **Measurement:** today ≈ 2 074 on R's scale; the 8× odds is nominal (limited Stockfish is depth-pinned). Proposed: Stockfish 19 `UCI_Elo` at a fixed skytalix time, equal `st` at high E, E stepped by `ABC-204`'s band rule, milestones 2 200…3 000, plus a new SPRT lane per change.
- **Order:** Phase 0 O1-a → O1-b/c ∥ SPRT lane ∥ owner calls; 1 TT; 2 pruning; 3 ordering + aspiration; 4 eval (taper → tuner → terms); 5 extensions, time use, O1-d on his yes.
- **Owner's calls:** Q-3K-1 scale + time; Q-3K-2 per-change rule (SPRT); Q-3K-3 width; Q-3K-4 `G6` "≥ base"; Q-3K-5 scope (new epic / fenced re-tries); Q-3K-6 `NFR-009` > 16 MiB; Q-3K-7 tuning data; Q-3K-8 bitboards (later).
- **For the Orchestrator:** take Q-3K-1…8 to the owner with ADR-0056; the sibling `bapm-goal3000-o1-cut` should place O1-b before any ticket editing `orderMoves`/`negamax`/`evaluate`.
- **Notes** (task `arch-algo-analysis`, contextRoot = worktree; 3/3 sealed, read back): decision `20261101T115549Z-architect-design-decision-ec2f1739`, observation `…observation-b66cbff7` (inventory, records, web facts), observation `…observation-d12c6cfe` (artifacts).

### Trace row (10 cells, header order)

| arch-algo-analysis (records) | owner 2026-11-01: option 1; analyse algorithms; check old tickets; 3 000 without NN?; goal 3 000 | EPIC-010 (ABC-231…239 mapped; new epic is the owner's, Q-3K-5) | ADR-0055 ACCEPTED (O1) dated line; ADR-0056 PROPOSED (gaps D2, feasibility D3, measurement D5, order D6, Q-3K-1..8) | NFR-005 (G6 "≥ base" question), NFR-009 (> 16 MiB question); no level moved | grugops/arch-algo-analysis @ 1406a1ba: memory-bank/50-decisions/ADR-0055-…, ADR-0056-… (records only) | none run (records, code and web reading) | n/a | — | owner's call pending; no board move |
