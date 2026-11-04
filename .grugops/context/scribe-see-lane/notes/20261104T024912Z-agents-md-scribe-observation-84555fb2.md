---
id: 20261104T024912Z-agents-md-scribe-observation-84555fb2
kind: observation
by: agents-md-scribe
at: 2026-11-04T02:49:12Z
verified_by: 
confidence: high
refs:
  - AGENTS.md
  - scribe-see-lane
  - grugops/scribe-see-lane
  - ABC-279
  - ABC-280
  - QE-279-g
  - src/see.test.ts
  - tools/tune/tune.test.ts
  - src/cli.test.ts
supersedes: 
seal: sha256:ccf46ec78d18cec8eadf80af4db44233a8fb7e0e6373c63d69b0432918950651
---

AGENTS.md gained two deep-lane lines in § Test, after the Taper line: the SEE lane (ABC-279, `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/see.test.ts`, about 55 s) and the tune lane (ABC-280, `TUNE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/tune/tune.test.ts`).

Spelling decision: the brief's `... run tools/tune` (the tool's own header spelling) is read as a SUITE shape by `src/cli.test.ts` ABC-173 A3 (heap flag 400 on a non-`.test.ts` path reds: "heap flags 400, not 128 (suite)"). The one-file path `tools/tune/tune.test.ts` is the same run (one file, 17 tests) and passes A3. The tool header's directory spelling is left as is (not in the fence).

Size: 18 404 -> 18 429 B (budget 18 432, 3 B left). Lines added 8, removed 6 in the diff. The two new lines cost 238 B; 213 B were cut elsewhere, no rule lost: (1) the Dev/run comment's pointer "Writing rules for this slot and full receipts (RUN dates, byte-exact before/after the `--` trap)" -> "Writing rules and receipts"; (2) § Test intro "Full RUN receipts ... (dates, exit codes, counts, traps)" -> "Receipts"; (3) skip-count comment's history clause about unprefixed quotes -> "without its prefix the heap guard refuses it (no integer, non-zero exit; ABC-173, ABC-176)"; (4) "was 3 s under ADR-0045" dropped from the Dev/run comment (history, in the ADRs); (5) § Standing rulings intro "in full with their evidence" -> "in full"; (6) "project brief" -> "brief". `-->` closers unchanged (10 = 10).

Verification (host lock `flock <scratch>/host-test.lock`, worktree tip, node_modules symlinked to main's and removed before commit):
- `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/see.test.ts`: exit 0, 1 file, 52 passed of 52, 54.2 s.
- `TUNE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/tune/tune.test.ts`: exit 0, 17 passed of 17, 9.0 s.
- `NODE_OPTIONS=--max-old-space-size=128 npx vitest run src/cli.test.ts src/history.test.ts src/status-panel.test.ts src/render.test.ts` (every test file reading AGENTS.md that is not a deep lane): exit 0, 185 passed of 185 (ABC-173 A3 and ABC-109 A5 included). First try with the directory spelling: 1 failed (A3), the reason for the decision above.
Raw logs: the scratchpad's scribe-see-lane/ directory (not committed).
