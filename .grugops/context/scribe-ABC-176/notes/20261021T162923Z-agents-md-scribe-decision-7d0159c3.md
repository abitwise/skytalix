---
id: 20261021T162923Z-agents-md-scribe-decision-7d0159c3
kind: decision
by: agents-md-scribe
at: 2026-10-21T16:29:23Z
verified_by: 
confidence: high
refs:
  - ABC-176
  - grugops/ABC-176
  - 522bffd1
  - ffd53f41
  - AGENTS.md
  - QE-173-f
  - ABC-173
  - ABC-187
  - A5
  - memory-bank/90-agents-md-command-log.md
supersedes: 
seal: sha256:9b4ab764f986ca6fcf2993f32f148da271e0c606fd7ed157acaa7ab991d1b485
---

# ABC-176 A5: the two `AGENTS.md` comment edits, applied as the SE proposed, on `grugops/ABC-176` (`522bffd1`)

Applied byte-exact from the SE's decision note `…af9fc531`; each BEFORE string was found once. I kept the SE's text unchanged: it already
carries every fact, and a tighter wording would save a few bytes against 2,635 B of headroom while moving a sentence the SE measured.

1. `Test (all)` comment (`QE-173-f`, +38 B). The quoted wrapper gains its prefix:
   - BEFORE: ``- Test (all): \`npm test\` <!-- \`node tools/grugops/run-bounded.js 60000 vitest run\` (ABC-122).``
   - AFTER:  ``- Test (all): \`npm test\` <!-- \`NODE_OPTIONS=--max-old-space-size=128 node tools/grugops/run-bounded.js 60000 vitest run\` (ABC-122).``
2. Skip-count comment (the history pointer, option b, +153 B). The command itself is unchanged; the comment's tail changes:
   - BEFORE: `Undeterminable → \`UNKNOWN - verify\`, never a silent 0. -->`
   - AFTER:  `Undeterminable → \`UNKNOWN - verify\`, never a silent 0. Run it as spelled: quotes without its prefix (before ABC-173) are history; refused by the heap guard, they print no integer and exit non-zero (ABC-176). -->`

`AGENTS.md`: 15,606 B -> 15,797 B (+191 B), against `AGENTS_MD_BUDGET_BYTES` 18,432 (`ABC-187`), 2,635 B of headroom. `wc -c` read on the branch after the edit.

Also logged, because the log's Reader paragraph and its per-change ledger ask for it: one section `scribe-ABC-176 pass, 2026-10-21` at the end of
`memory-bank/90-agents-md-command-log.md` (+9 lines, two table rows). No other file changed. Fences held: no `src/`, `tools/`, `plans/`; nothing pushed.
