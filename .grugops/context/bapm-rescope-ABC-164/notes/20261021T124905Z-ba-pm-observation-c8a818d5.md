---
id: 20261021T124905Z-ba-pm-observation-c8a818d5
kind: observation
by: ba-pm
at: 2026-10-21T12:49:05Z
verified_by: 
confidence: medium
refs:
  - ABC-164
  - ABC-109
  - ABC-173
  - ABC-146
  - ABC-166
  - QE-184-c
  - AGENTS.md
  - src/cli.test.ts
  - main@3d36999b
supersedes: 
seal: sha256:7e7e3bc9f45ed7a38878ac2c351d941a80715243a9bab01baa585aeada623073
---

# ABC-164 re-scope: base readings at `main` `3d36999b` (AGENTS.md byte-equal to `89fd4e83`)

- `wc -c AGENTS.md` = 24,575 of 24,576 (ABC-109 A5, `src/cli.test.ts:2482-2494`). Headroom 1 B = 0.0 edits at 1,159 B/edit.
- The old criteria hold at base, unchanged: `Test (all)` has no count (`affee860`), and the `CLI_DEEP` comment reads "(count: the test file)" (`59ce86b9`). On joined text: `exits 124` 1, `never SIGKILL` 1, `NOT DEFINED, not skipped` 3, `Run at QE` 2.
- Bytes per section (chars + 1 per line; approximate): Test 5,738; Test and UAT authority 2,380; Deployment posture 1,976; Development 1,740; Branching model 1,381; QE validation authority 1,313; Role/workflow files 1,230; Process rules 1,224; Safety 939; Test integrity 785; Mission 681; coding rules about 2,100 across five headings. 20 HTML comments = 4,526 B.
- What reads `AGENTS.md` text, in `src/cli.test.ts`:
  - `:1135` ABC-042 A1: contains "- Dev / run: `npm run chess`".
  - `:2207-2380` ABC-065/067/071: one Dev/run slot, whose comment closes inside it.
  - `:2406` ABC-059: Dev/run spans agree with package.json.
  - `:2482` ABC-109 A5: bytes ≤ 24,576.
  - `:3969` ABC-173 A3: ≥ 17 vitest commands outside comments, each carrying its shape's heap flag; lanes PERFT/SEARCH/ENGINE/INPUT/ZOBRIST/PUZZLE/CLI/LADDER `_DEEP=1`; ≥ 3 suite-shaped; INPUT_DEEP carries `--expose-gc`.
  - At base the parser counts **exactly 17**, so no vitest command can leave `AGENTS.md` or move into a comment.
- Other readers: `tools/grugops/heap-guard.js` and `src/cli.real-engine.test.ts:127` mention AGENTS.md in messages and comments only. Five test/source files cite "AGENTS.md rule N" in comments, so the 12-rule numbering must stay. Two ticket pages cite `AGENTS.md:NNN`.
- Base counts for the owed lines, on joined text: `contextRoot` 0, `reporter=verbose` 0, `plain node` 1, `not run here` 1, `LADDER_DEEP=verdict` 0. Present: `remain THREE` 1, `RISK-ABC152-NEGWORKERS` 1, `RISK-ABC143-01` 1, `pgrep` 2. `00-index` 0 (AGENTS.md does not name `memory-bank/00-index.md`).
- Owed-line sources:
  - O1: `bapm-rework-ABC-161` done record (stray notes in the plugin cache; "AGENTS.md's writer pointer does not say to pass contextRoot").
  - O2: QE-184-c (`qe-ABC-184` `…7b9ef6a7`), adopted in briefs (`…9fd3189b`).
  - O3: Orchestrator `…6a2f9d03` (ladder comment wrong twice; net ≤ 0 B or ride with ABC-164); heap flag 400 per Architect `…7c31d5e8`.
  - ABC-146's `node` line is moot: route V (ADR-0038 addendum 2).
  - QE-159-f landed at `8187ee19`.
- Estimate (BA/PM, UNKNOWN - verify by `scribe-audit-agents-md`):
  - On demand: about 11.9 KB (the governance sections about 8.0 KB, the lane comments other than Dev/run about 3.3 KB, the worker-cap paragraph about 0.6 KB).
  - Pointers, the kit-override line and O1 add back about 1.3 KB.
  - AGENTS.md after: about 14 KB.
