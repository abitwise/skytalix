---
id: 20261021T081014Z-software-engineer-observation-abc159-heap-guard-vs-brief-prefix-c7a671d8
kind: observation
by: software-engineer
at: 2026-10-21T08:10:14Z
verified_by:
confidence: high (the refusal was run and read)
sealed: false
task: ticket-to-pr-ABC-159
subtask: ticket-to-pr-ABC-159
refs: [ABC-159, ABC-173, ADR-0008, tools/grugops/heap-guard.js]
supersedes:
---

# A dispatch rule of "400 on every vitest call" cannot run a multi-file vitest command under `ABC-173`

`NODE_OPTIONS=--max-old-space-size=400 npx vitest run --reporter=json` (whole suite) exits 1 at globalSetup with
"heap-guard: refused … 496 MiB, above the SUITE row of 224 MiB (59 test files) … Prefix the command with
NODE_OPTIONS=--max-old-space-size=128". Any ticket page that writes a whole-suite vitest reading (as `ABC-159`'s A4
does) therefore cannot be run literally under that dispatch rule.

For a future dispatcher there are two routes: run one file per call at 400 (taken here), or allow 128 for
whole-suite readings, which is the repo's own rule. For QE: re-reading A4 literally at 128 should give the same
1987 / 59.
