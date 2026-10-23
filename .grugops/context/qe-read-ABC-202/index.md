<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-read-ABC-202

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-23T13:53:24Z | decision | qe-e2e | high on this host (one reading per measure; M1 games 1-4 on a non-quiet host, immaterial to a pass) |  | # ABC-202 QE verdict: EPIC-007 M1 MET and M8(a) MET at S `e5c5c2a5`. RISK-EPIC007-01 did not show up. No failure route is owed |
| 2026-10-23T13:53:24Z | observation | qe-e2e | high (every figure from raw m1.out / m1.pgn; one run, one host) |  | # EPIC-007 M1 read by cutechess-cli at S `e5c5c2a5`: 6/6 games end on pass texts. 0 illegal moves, 0 forfeits, 0 disconnects, 0 stalls |
| 2026-10-23T13:53:24Z | observation | qe-e2e | high (every figure from raw m8a.out / m8a.pgn; one run, one host) |  | # EPIC-007 M8(a) read by cutechess-cli at S `e5c5c2a5`: both games end on pass texts. Every `go` is exactly `go depth 4`, and every searched move's final depth is 4 (131/131) |
| 2026-10-23T13:53:24Z | observation | qe-e2e | high (direct reads: --version, sha256, build, source at 5e84232b; host log raw) |  | # ABC-202 setup: the tool and the artifact as pinned, A1 MET, and one A2 spelling correction (`-debug` → `-debug all`) |
