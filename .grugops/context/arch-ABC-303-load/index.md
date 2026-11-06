<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-ABC-303-load

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-06T14:15:00Z | decision | architect-design | high on the reading, each line traced to CF1-CF10, C-2 and the sealed shape; medium on W, a judgement of cost against a rare branch; the move-time tail under heavy load is UNKNOWN - verify |  | # arch-ABC-303-load: foreign load changes no line of a C2′ or S′ read. A played read is never voided for it. Load is logged and reported (FL), and `ABC-303`'s games wait for an owner-held window (W). No bar moves, and no word of CF1–CF10 moves |
