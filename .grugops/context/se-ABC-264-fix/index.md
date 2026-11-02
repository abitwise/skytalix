<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: se-ABC-264-fix

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-02T01:57:50Z | decision | software-engineer | high: as committed in bcc82866 |  | # se-ABC-264-fix decision: close QE-264-a with one behavioural row in src/engine.test.ts (ABC-230 A3/A4 block), not a literal-map row |
| 2026-11-02T01:57:50Z | observation | software-engineer | high: every gate run as stated under the lock; raw in raw/gates |  | # se-ABC-264-fix gates: lint 0, typecheck 0, npm test 2 404/2 404 (64 files), skip-integrity 0 (skip count 0), lane inventory 0 (64/64) |
| 2026-11-02T01:57:50Z | observation | software-engineer | high: plant and head runs under the lock, raw in raw/plant; sha256 equal before/after |  | # se-ABC-264-fix plant proof: the new row is red under QP6 and green at head; engine.ts restored byte-exact |
| 2026-11-02T01:57:50Z | observation | software-engineer | high: pointer note (filed as observation; artifact-ref needs gate_run) |  | # se-ABC-264-fix artifacts: branch grugops/ABC-264-fix (from grugops/qe-ABC-264 1dede4f2), test commit bcc82866, one file src/engine.test.ts (+18 lines) |
