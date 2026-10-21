---
id: 20261021T132050Z-agents-md-scribe-observation-41a428be
kind: observation
by: agents-md-scribe
at: 2026-10-21T13:20:50Z
verified_by: 
confidence: high: counts and strings measured by script and npm test on the branch tip; sizes are wc -c
refs:
  - ABC-164
  - ABC-173
  - ABC-109
  - AGENTS.md
  - 20261021T125254Z-agents-md-scribe-observation-ffbb746f
  - 20261021T125315Z-agents-md-scribe-decision-38d2af93
  - 20261021T131002Z-ba-pm-decision-a7cd9ce2
  - 20261021T131002Z-ba-pm-observation-d197dcbd
  - 20261021T130200Z-orchestrator-decision-18e4ada0
  - grugops/ABC-164
  - e82a3798
  - memory-bank/45-standing-rulings.md
  - memory-bank/90-agents-md-command-log.md
supersedes: 
seal: sha256:84bc82ee1976e2ca9c6324a8067ed1cc5116e8aca115fb1696ff73defe5913ad
---

# ABC-164 build readings at e82a3798 (branch grugops/ABC-164 from 49dc490c)

All measured in worktree ../wt-ABC-164 with scripts on joined text (newlines to spaces, spaces collapsed). No timing taken.

- **A1.** wc -c AGENTS.md: 24,575 -> **15,606** (373 -> 216 lines). Ceiling 18,432: met. Headroom against the unchanged 24,576 B budget constant: 8,970 B = 7.74 edits at 1,159 B/edit (page asks >= 5.3). Against 18,432: 2,826 B = 2.44 edits.
- **A2.** (a) 0 of the five governance heading lines (base 1 each). (b) 0 backticked self-references (base 1, 2, 1, 2). (c) 1 "<!--" between ### Test and ### Acceptance (base 10). (d) all 20 canaries read 0 in AGENTS.md. (e) one "## Standing rulings" line; all 11 listed strings present in it and in 45; every other non-pointer sentence of the section is found verbatim in 45.
- **A3.** 45 exists; its five headings match 1 each. 90: "On-demand commands", "Vitest worker cap and module runner", "Self-play ladder lane" each 1 (base 0); "Dev / run", "Coverage — `npx vitest run --coverage`", "Regenerate the opening book", "Real-engine CLI lane" each still 1; 40-contributing "Conventions" 1. Pointers in AGENTS.md: 45 (Standing rulings), 90 "On-demand commands" (Test), 90 "Vitest worker cap and module runner", 90 "Dev / run", 40-contributing "Conventions" (beside the QE-hop command), 90 preamble (beside the budget sentence); Memory bank & plans names 45 and 90; 00-index.md has the 45 row. Lane table: 15 rows; each heading it names matches exactly 1 line in 90; column 2 strings are verbatim substrings of 90.
- **A4.** Removed runs of git diff -U0 49dc490c -- AGENTS.md: 19. Whole-run match in the union of 45, 90 and 40 fails for runs that are a command line plus its comment (the command line stays in AGENTS.md by design) and for runs spanning two targets. Token-aligned check of what the added lines do not carry: every moved comment, command line and governance section found word for word. Misses, three kinds: the O3 rewording (old sentence quoted in the 90 entry); the three re-pointed "## X" references in Safety rules; lines replaced by pointers (the Dev / run receipts lead, the worker-cap "1..2" before its pointer, the QE-hop comment's replacement, the budget sentence pointer). The 90 entry names them.
- **A5.** In AGENTS.md: "exits 124", "never SIGKILL", "pgrep", RISK-ABC143-01, "remain THREE" present. In 90: "NOT DEFINED, not skipped", "Run at QE", RISK-ABC152-NEGWORKERS present. In 45: be910aa8, d9aa42b9, "src/__snapshots__/*.snap" present.
- **A6.** O1: contextRoot in AGENTS.md (base 0). O2: 90 § Real-engine CLI lane carries --reporter=verbose and [CLI_DEEP]. O3: 90 § Self-play ladder lane carries LADDER_DEEP=verdict, ADR-0038, addendum 2, 4c1d8e27; neither it nor AGENTS.md has "plain node" or "not run here"; AGENTS.md has LADDER_DEEP=verdict 0 times.
- **A7.** vitestCommandsIn(AGENTS.md) (the parser copied from src/cli.test.ts:3733) returns 17, one of them the PERFT_DEEP=1 line. git diff --name-only 49dc490c lists exactly the five files. 0 src/ lines; AGENTS_MD_BUDGET_BYTES untouched at 24_576. Waiver form (git diff --name-only e82a3798~1 e82a3798 | grep -v '\.test\.ts$' | grep '^src/') prints nothing.
- **Gates.** lint exit 0 (116 files); typecheck exit 0; build exit 0; npm test exit 0, 59 files, 1987 tests (equal to base), .test-results/last-run.json success true, 0 failed, 0 pending; the ABC-042 (31 rows), ABC-059, ABC-065 (4), ABC-067, ABC-071, ABC-109, ABC-173 (9) rows all passed; test-skip-integrity.js --skip-count 0: "No findings."
