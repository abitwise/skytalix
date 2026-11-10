<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-312

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-10T10:51:04Z | observation | qe-e2e | high: every command run by QE in its own worktree on this host; shellcheck absent NOT RUN; macOS sh and Windows cmd UNKNOWN - verify |  | # qe-ABC-312 observation: commands run and what they printed |
| 2026-11-10T10:58:23Z | observation | qe-e2e | high: every command run by QE in its own worktree on this host after merging d9bf1197; G2 run in a bwrap overlay; shellcheck absent NOT RUN; macOS sh and Windows cmd UNKNOWN - verify |  | # qe-ABC-312-recheck observation: commands run and what they printed |
| 2026-11-10T10:58:30Z | decision | qe-e2e | high: PASS_WITH_GAPS; G1 blocking fixed (cmp exit 0); G2-G6 fixed; G7 and new G8 low, non-blocking; macOS sh and Windows cmd UNKNOWN - verify |  | # qe-ABC-312 verdict (re-check): PASS_WITH_GAPS |

## Superseded (history)

| at | kind | by | superseded-by | note |
| --- | --- | --- | --- | --- |
| 2026-11-10T10:51:10Z | decision | qe-e2e | 20261110T105830Z-qe-e2e-decision-ec4a005f | # qe-ABC-312 verdict: FAIL (BLOCKED_NEEDS_FIX), one blocking gap |
