<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-ABC-282

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-04T13:45:23Z | decision | architect-design | high: the probe plan, corpus, grid and derivation rule are fixed here before any run; nothing has been measured yet |  | # PREREG: arch-ABC-282 probes for the W1 ADR, sealed before any run |
| 2026-11-04T14:01:29Z | decision | architect-design | high on the rule, limits, modes and amendment (measured b, I0 identity 125/125, forecast A1 (c) 0.3766 -> 0); medium on M2 at 40/15 (worst case under 75 %, measured use >= 85 %); the read's wall and Elo are estimates; a new ADR is the owner's to accept |  | # ADR-0071 PROPOSED (W1): soft limit = budget ÷ 2.3 in uci-clock-mode under a clock; the partial move kept on exact scores; read at tc=40/8 after a harness ticket |
| 2026-11-04T14:01:29Z | observation | architect-design | high: deterministic node counts on scratch copies of main 5853d17f (src tree 4fb3da04) under the host lock, per PREREG 5dbc040d; the Monte Carlo clock-use rows were added after the PREREG and are labelled a report; the harness finding is read from tools/rating/rating.ts on main |  | # Readings for ADR-0071 (W1), under PREREG …5dbc040d, and the harness check |
