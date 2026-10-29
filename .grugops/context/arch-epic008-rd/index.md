<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-epic008-rd

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-29T19:52:00Z | decision | architect-design | medium: ranking from records only; the next step is a proposal for the owner |  | # Architect decision, arch-epic008-rd: the R/D split is most likely real non-transfer of the shipped changes from self-play to Stockfish, with R's size probably inflated by chance; host, build and openings are ruled out. Next step proposed to the owner: a three-sha R gauntlet that splits ABC-215 from ABC-208 (about 13.5 h at width 2) |
| 2026-10-29T19:52:00Z | observation | architect-design | high on the counts read from the raw files; medium on the mechanism (records cannot split ABC-215 from ABC-208, or opponent from time) |  | # R/D disagreement on main vs 3497aad2: seven candidate explanations, each checked against the raw files |
