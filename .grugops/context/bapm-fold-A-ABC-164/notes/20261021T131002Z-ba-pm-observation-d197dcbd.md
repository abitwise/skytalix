---
id: 20261021T131002Z-ba-pm-observation-d197dcbd
kind: observation
by: ba-pm
at: 2026-10-21T13:10:02Z
verified_by: 
confidence: high: counts measured by grep/node at main 60d72e66; the after-size is an estimate, UNKNOWN - verify by the build hop
refs:
  - ABC-164
  - ABC-173
  - ABC-109
  - AGENTS.md
  - 20261021T125254Z-agents-md-scribe-observation-ffbb746f
  - 20261021T125315Z-agents-md-scribe-decision-38d2af93
  - 60d72e66
supersedes: 
seal: sha256:296d654e1bf74e42846116d0860f8c448b60a1f9e51c8189a2cbf489730e8912
---

# ABC-164 fold readings at `main` `60d72e66` (AGENTS.md 24,575 B, unchanged since `3d36999b`)

1. **ABC-173's own parser** (`vitestCommandsIn`, `src/cli.test.ts:3733`), applied by node one-liner: **17** spans. #1 is `PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/perft.test.ts` (AGENTS.md:67, 127 B, audit block B11). #2-#13 are the 12 lane commands of B18 (11 bullets; Transposition carries 2). #14 single-file, #15-#16 coverage, #17 skip-count. The A3 test requires a line starting `PERFT_DEEP=1 ` (`:3987-4001`). So the audit's B11 MOVE would make 16 and red `npm test`; its "13 deep-lane commands" in B18 are 12.
2. **`## Safety rules`** (B35, 938 B) is a fixed keep on the ABC-164 page. Its merge/deploy bullets carry words found nowhere else ("run the gates on the branch tip before and on `main` after, and record both"), so folding them into a summary would make A4 miss.
3. **`90-agents-md-command-log.md` headings:** no ladder-lane section and no perft section exist ("Ladder" 1x, in a history heading). Existing per-lane headings carry backticked `npx vitest` spans, so quoting one in AGENTS.md would add a parsed command.
4. **Heading match** (`## X`, `## X —` or `## X (`), at base: "Dev / run" 1, "Coverage — `npx vitest run --coverage`" 1, "Regenerate the opening book" 1, "Real-engine CLI lane" 1, `40-contributing.md` "Conventions" 1. The three new headings match 0.
5. **Base canary counts on joined AGENTS.md:** `32,768` 1, `WRITING RULES` 1, `npm run perft` 1, `spike:perft` 1, `compile.ts` 1, `VITEST_MAX_THREADS` 1, `viteModuleRunner` 1, `RISK-ABC152-NEGWORKERS` 1, `NOT DEFINED, not skipped` 3, `Run at QE` 2, `ENDGAMES 204` 1, `heapUsed` 1, `TRIGGER (owner` 1, `QE-085-e` 1, `not run here` 1, `plain node` 1, `process boundary` 1, `at every move to` 1, `be910aa8` 1, `d9aa42b9` 1. `<!--` between `### Test` and `### Acceptance`: 10 (20 in the file). Backticked `## Branching model` 1, `## Test and UAT authority` 2, `## Deployment posture` 1, `## QE validation authority` 2.
6. **All 11 rule-S sentences occur verbatim** in AGENTS.md at base (joined, `**` removed). Examples: the `remain THREE` sentence, the waiver measurement command, `src/__snapshots__/*.snap`.
7. **Other readers:** `src/cli.test.ts:2242` is a comment saying "AGENTS.md carries 13 further closers after this slot's own". It is no assertion. After the split about 8 closers remain, so the comment goes stale. It is `src/`, so it is out of this ticket; flagged, not cut.
