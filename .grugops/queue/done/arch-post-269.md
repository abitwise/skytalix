---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T12:26:38Z
subtask: arch-post-269
role: architect-design
ref: .grugops/context/arch-post-269/
branch: grugops/arch-post-269 — worktree .claude/worktrees/arch-post-269 (from main 54dee3f2+)
width: records only; no engine runs.
---
# After ABC-269's merge
ABC-269 merged to local main 54dee3f2 on QE PASS_WITH_GAPS (…eff2fe64; gaps …9ba289c2 in .grugops/context/qe-ABC-269); post-merge npm test 2 566/2 566.
1. ADR-0064: in-force line (IN FORCE 2026-11-03, merge 54dee3f2), with QE's readings (G2 1.0373×, B8 57.0/100 +49 ± 60 Elo, S′ 7/10, Levels 57/57).
2. QE-269-f (LOW): G2 margin 0.0127 ≈ one session spread — write the guidance into ADR-0067's F8 / A5 line for ABC-274's G2 PREREG (e.g. pre-state the session spread; don't change the 1.0500 bar). QE-269-g (INFO): fix the PREREG wording "odd rounds reversed" vs g2b.ts r % 2 for future reads.
3. S′ pool: ADR-0056's S′ rule (pool counts merged builds only; E1810; symmetric step rule; ≥ 30 games outside 60–85 % to move). Add ABC-269's 7/10 and state the pool and whether any step fires.
4. ABC-273 (R1) control ruling: whether R1–R3 survive as defined, and the exact command (rating tool needs CUTECHESS_CLI and STOCKFISH set — QE-269-j), and its host time (owner asks for > 1 h runs: say if R1 needs asking).
Fences: memory-bank/50-decisions + your records. No src. No push, force, amend, rebase, merge into main.
Publish: sealed notes (task arch-post-269, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit (Result text included); ## Result; brief + claim to done/.

## Result
*Architect/Design, 2026-11-03T12:40:54Z. Records only, on `grugops/arch-post-269` from `main` `128e3c6c`. Nothing run, built or timed (one note seal under the host lock). Not pushed, not merged.*

- **`ADR-0064`: IN FORCE on `main` since 2026-11-03**, at merge `54dee3f2`. It has a new top status block in the `ADR-0061` pattern, and the old block is kept. It records QE's readings: `G2` 1.0373 × (1.0186 / 1.0560, controls 1.0200 / 0.9974); B5 1 flip / 2 986, 17 cp; B7 depth 9 / 10; B8 C2′ 57.0 / 100 (+49.0 ± 59.5, the interval crosses 0), S′ 7/3/0 at E 1 810, Levels 57 / 57. Also: four decision-log rows, and a dated `QE-269-g` wording line under the F3 block.
- **`ADR-0067`, `QE-269-f` / `-g`:** a dated line in decision 8 gives what A5's PREREG states before `ABC-274` is timed:
  - the bar 1.0500, two sessions and the statistic, unchanged;
  - the arms;
  - the void band;
  - **the session spread, stated ahead as a report** (reference 0.037; "within one session spread" is a label and grades nothing);
  - rounds 2, 4 and 6 counted from 1 reverse.
  F8's row gets a pointer, and the log gets a row.
- **S′ pool (`ADR-0056` status fold):** E 1 810 = `qe-ABC-269` 7/3/0 (merged `54dee3f2`) = **7.0 / 10 = 70.0 %**. Below 30 games, so **no step**. At 30 games: the next 20 pooled ≥ 19.0 steps up; ≤ 10.5 goes to the owner as the downward question.
- **R1–R3 ruling (`ADR-0056` D6 dated line, plus a D5 pointer):**
  - **They survive** as G2's readings on C4's 100 ms control: 200 games, both sides at `st=0.1`, band-rule E, with the probe first above E 2 600.
  - **Today's `r` cannot run it:** `--budget-ms 100` throws, and Stockfish's `st=0.5` is fixed in code. So a `tools/`-only change comes first (S, BA/PM cuts it).
  - After that change, the command is `CUTECHESS_CLI=<cutechess-cli 1.5.1 pin> STOCKFISH=<Stockfish 19 pin> node tools/rating/rating.ts r <main-sha> <out> --elo 1810 --budget-ms 100 --rounds 100 --concurrency 1`.
  - **About 0.4–0.9 h (estimate), so not asked of the owner.** It is asked only if QE's PREREG estimate is over 1 h, or if the band rule steps E.
- **Notes** (sealed via `admitAndAppend`; contextRoot = this worktree's `.grugops/context`; 4 of 4 read back): `20261103T123540Z-architect-design-decision-3f30baf8`, `20261103T123540Z-architect-design-observation-ee31f3ee`, `20261103T123540Z-architect-design-decision-8136b589`, `20261103T123958Z-architect-design-observation-1fa63931`. The fourth was re-kinded from artifact-ref, which the writer refused for lacking gate provenance. Trace row appended.
- **Commits:** records `f554dba4`. This Result and the move to done/ are in the closing commit.
- **Owed:**
  - **BA/PM:**
    - `ABC-273`: DoR 10 ✅, the command, and its dependency on the new tools ticket;
    - the new `tools/` ticket;
    - `EPIC-011`: the S′ pool row, R1–R3 / G2 ruled, E1 done;
    - `ABC-274` A5: cite `ADR-0067` d8's new line.
  - **Orchestrator:**
    - place the tools ticket and R1 before the next strength merge;
    - the `QE-269-j` runbook / brief-template line;
    - A5's PREREG sealed by QE before any timing.
  - **Owner, pending (none added):** `ADR-0067` acceptance, Q-3K-6, Q-3K-7 (a) / (b) / (c), Q-3K-8, Q-3K-9, B-T8.
