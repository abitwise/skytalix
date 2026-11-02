<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-ABC-266-repropose

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-02T17:30:19Z | decision | architect-design | high: pre-registration, sealed before any corpus run |  | # arch-ABC-266-repropose PRE-REGISTRATION (sealed before any corpus result is read): the candidates, the quality proxy, the selection rule, the load voids, the instrument |
| 2026-11-02T17:42:41Z | decision | architect-design | high: outcome by the sealed rule, no hand grade; the recommendation is the Architect's judgement |  | # Verdict: NO winning form. No candidate is a WIN under the sealed rule. ADR-0062 is not amended with a new form. Recommendation: park ABC-266, so Threads stays at 1, and keep ADR-0062 PROPOSED as the design of record |
| 2026-11-02T17:42:41Z | observation | architect-design | high for depths, Q, nodes and load as measured (scratch prototype, 20 positions); the (c)-artifact reading and Q's ceiling are judgement |  | # arch-ABC-266-repropose probe, measured. At 100 ms no candidate passes the sealed rule cleanly: plain pools stay in lockstep at T1's depth. Skip + deeper + perturbation adds one ply of median played depth (T4SDP, T12SDP), but each read loses 1.7–2 positions of 20 on the quality proxy. With the deeper-entry rule, nominal depth rises even at Threads 1 |
| 2026-11-02T17:42:41Z | observation | architect-design | high (artifact list) |  | # Artifacts of arch-ABC-266-repropose: probe scripts, scratch edit, raw runs, grader output |
