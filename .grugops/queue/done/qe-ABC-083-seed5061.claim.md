by: qe-e2e (claude-opus-5-5)
at: 2026-10-11T14:12:34Z
task: qe-ABC-083-seed5061

completed_at: 2026-10-11T14:52:46Z
result: Width 1, quiet window. Seed 5061 is class L (ADR-0034 d3): byte-identical per-row lines across 3+3 PUZZLE_DEEP=1 runs (load1 2.4-3.9, thermal 0), base 54/58 f5e6 d5, branch 53/58 g2e1 d5; missed at +25% and +50%, solved at d6 from +100%. Not load, not drift, not an evaluator regression: every full-width search on the branch d4-d6 plays f5e6 (55 cp ahead); the shipped LMR d5 iteration over-scores g2e1 by 60 cp (within ADR-0026 d9 drift), and base fixed-depth search() flips the same row. King safety alone reproduces it; 0.75x-1.5x weight all miss. A10 requires an Architect/Design-ruled re-find (ADR-0028 d2), own commit, no trigger-list file, no baseline change, no owner word; then QE delta re-read (54/58, weakened exit 1). QE pass: gates green (1739/1739, skip 0), deep lanes green (pvs-lmr cited at 79248602), A1-A4/A6/A8 MET on 19 QE mutants; gaps 2 LOW, 3 INFO. Verdict FAIL on A10 puzzle gate only. Notes …67b0c99a (readings), …b631991b (class/route), …6b2e2f3b (pass/gaps), …56016fe2 (verdict), …ae73a687 (artifacts). Branch grugops/ABC-083-king-safety-mobility. Not merged, not pushed, no board move.
commit: 1b5d5c42
