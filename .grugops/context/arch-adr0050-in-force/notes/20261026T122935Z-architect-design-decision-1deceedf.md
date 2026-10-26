---
id: 20261026T122935Z-architect-design-decision-1deceedf
kind: decision
by: architect-design
at: 2026-10-26T12:29:35Z
verified_by: 
confidence: high: records only; main state checked read-only at b5c67ab7 (git diff, git grep, merge-base)
refs:
  - ADR-0050
  - ADR-0026
  - ABC-208
  - EPIC-008
  - orch-2026-10-26q/20261026T122626Z-orchestrator-decision-836cb92d
  - qe-ABC-208/20261026T122350Z-qe-e2e-decision-0477ac64
  - memory-bank/50-decisions/ADR-0050-null-move-pruning-arrives-at-null-window-nodes-with-r-3-behind-a-test-only-off-door-pair-guarded-below-three-non-pawn-pieces.md
  - memory-bank/30-architecture.md
  - grugops/arch-adr0050-in-force@40b92bef
  - b5c67ab7
supersedes: 
seal: sha256:91cd7f5c7bc6d1feac58f775813c76c9239e7fd9844fba10602f2f46702bb1aa
---

# ADR-0050 in force on main from merge b5c67ab7 (ABC-208, QE PASS); 30-architecture apply.ts / zobrist.ts rows dated

On Orchestrator orch-2026-10-26q/…836cb92d and QE qe-ABC-208/…0477ac64 (PASS at 3a87f9d7).

1. **ADR-0050 § Status:** a dated 2026-10-26 line, placed above the ACCEPTED block, says it is in force on main from merge b5c67ab7. Checked read-only first: `git diff 3a87f9d7 b5c67ab7 -- src` is empty (0 lines); at b5c67ab7 the null move is present in src/search.ts, src/engine.ts, src/apply.ts (makeNullMove / unmakeNullMove) and src/zobrist.ts (zobristKeyAfterNullMove); grugops/ABC-208 2e9eb9a7 is an ancestor of b5c67ab7; main's src equals b5c67ab7's. The ACCEPTED block's "until then" sentence and its S1 NOT MET fallback are discharged; no "not in force" line is owed. No other line in ADR-0050 changed.
2. **30-architecture:** two rows the merge made stale get a dated italic correction in their own cell, nothing else changed. apply.ts: it also holds makeNullMove / unmakeNullMove and is still the only module that writes a Position (checked: no non-test module outside apply.ts and fen.ts assigns a Position field at b5c67ab7). zobrist.ts: zobristKeyAfterNullMove added; the type-only import from apply.ts now names NullUndo too; depth stays UNKNOWN - verify. The full re-pass of the page stays an EPIC-008 close item.
3. **ADR-0026: nothing stale, unchanged.** Decision 9's dated "accepted, not in force on main" line (118 cp) still holds at b5c67ab7: the two ABC-121 d5 drift rows in src/search.pvs-lmr.test.ts still assert ≤ 75 cp (QE carries this as backlog). Decision 10 names null move as the next heuristic under the door pattern; ADR-0050 follows it, so that line is fulfilled, not stale.
4. Checks: reference-check printed "No findings." (exit 0) on both touched files. `git diff --stat main...HEAD -- src tools package.json` is empty. Class scan over added lines: 0 hits. No npm, vitest, build or timing.
