<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-ABC-307

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-05T12:58:15Z | decision | architect-design | medium: forms and placement rest on source and on kill sets recorded on an older tree; no remnant has been built or run, so DoR row 10 stays open; kept ms and parity UNKNOWN - verify |  | # arch-ABC-307 decision: form S for all nine rows by source; DoR row 10 stays open because nothing was measured. Three calls for the Orchestrator, none for the owner |
| 2026-11-05T12:58:15Z | observation | architect-design | high for what source, git and the recorded kill sets show; every kill, kept ms and count at the tip is a prediction, UNKNOWN - verify; nothing was run |  | # arch-ABC-307 readings: every recorded mutant keeps a holder with the nine rows gone, three guards do not, and the note count is growing about three times faster than the trigger assumed |
