---
id: 20261021T125254Z-agents-md-scribe-observation-ffbb746f
kind: observation
by: agents-md-scribe
at: 2026-10-21T12:52:54Z
verified_by: 
confidence: high on bytes (awk, main 3d36999b) and on what reads the file (grep of src, tools, plugin install, ticket pages); the after-sizes are sums of the planned kept parts, UNKNOWN - verify by the build hop
refs:
  - AGENTS.md
  - ABC-164
  - ABC-109
  - ABC-173
  - ABC-065
  - ABC-067
  - ABC-071
  - ABC-059
  - ABC-042
  - 20261021T130000Z-orchestrator-decision-c6bf41be
  - 20261021T124905Z-ba-pm-observation-c8a818d5
  - 20261021T124920Z-ba-pm-decision-45c39699
  - 3d36999b
  - memory-bank/90-agents-md-command-log.md
supersedes: 
seal: sha256:843695c47898ac9501b4b5866df4a314fdae3a806bfab9d3f92dcbe445bd0826
---

# AGENTS.md at `main` `3d36999b`: block-by-block table (24,575 B, 373 lines; bytes = chars + 1 per line, `awk`; 92 blank lines are inside the ranges)

Yardstick (cited): the AGENTS.md Scribe role (`agent-factory/roles/agents-md-scribe.md`): "Remove what a linter or CI already enforces; this file loads into every agent's context, so each kept line that earns nothing is a tax paid on every run"; Output: "the generic, project-agnostic substrate per §17.1"; Hard limits: "Keep `AGENTS.md` minimal". Spec §17.1 (`docs/initial/agent_factory_builder_spec_v2.md:1450` in the plugin cache): "Minimal and high-signal — push detail into the files it points to." Its sample has Mission, How to work here, Role/workflow pointers, Commands (Install, Development, Test, Lint, Typecheck, Build, E2E), Delivery, Safety rules, DoR/DoD, Memory bank & plans, When uncertain. It has no lane catalogue, no governance history, no process rules. Test used: does a role that starts a session with no ticket in hand need this line? A block is "on demand" when only one role or one ticket trigger needs it.

Classes: E = every session. O = on demand (named role/trigger). S = split (part E, part O). Action: KEEP, SPLIT, MOVE.

| # | lines | block | bytes | class | action | kept after (B) | target of the moved part |
|---|---|---|---|---|---|---|---|
| B01 | 1-5 | Title, Mission | 409 | E | KEEP | 409 | |
| B02 | 7-9 | Byte-budget paragraph | 283 | S | SPLIT | ~150 | the 32,768 provenance sentence to the command log header |
| B03 | 11-19 | How to work here | 575 | E | KEEP | 575 | |
| B04 | 21-27 | Roles / workflows / checklists pointers | 411 | E | KEEP | 411 | |
| B05 | 29-37 | "No finding" + sealing-writer blockquote | 817 | E (every role seals notes) | KEEP | 817 (+~110 for owed O1) | |
| B06 | 39-44 | Kit vs state | 574 | E | KEEP | 574 | |
| B07 | 46-48 | Commands intro | 211 | E | KEEP | 211 | |
| B08 | 50-52 | Install | 50 | E | KEEP | 50 | |
| B09 | 54-60, 65 | Development header, `Dev / run` slot (separator, option list), receipts pointer | 640 | E (test-pinned) | KEEP | 640 (+~120 short writing-rule note) | |
| B10 | 61-64 | Slot WRITING RULES (ABC-065/067/071/069) | 374 | O: Scribe, when editing the slot | MOVE | ~120 | `memory-bank/90-agents-md-command-log.md` § "Dev / run" (already holds the same rules) |
| B11 | 66-68 | `npm run perft`, `PERFT_DEEP`, `spike:perft` | 274 | O: SE on move-gen / throwaway spike | MOVE | 0 | log, new § "On-demand commands" at its top (perft rows exist in the log only as prose) |
| B12 | 69-72 | Opening-book regeneration (command + RUN comment) | 451 | O: SE/Scribe when `data/opening-book/` changes | MOVE | 0 | log § "Regenerate the opening book" (exists) + command line into § "On-demand commands" |
| B13 | 74-77 | `### Test` header + receipts pointer | 132 | E | KEEP | 132 | |
| B14 | 78-80 | `pgrep` wait trap | 285 | E (every role that waits on a lane) | KEEP | 285 | |
| B15 | 82-84 | `npm test` + comment (124 at 60 s, no SIGKILL, `*_DEEP` not via npm test) | 300 | E (the gate) | KEEP | 300 | |
| B16 | 85-86 | Heap-flag rule (400 one file / 128 suite) | 187 | E (the guard refuses a wrong flag) | KEEP | 187 | |
| B17 | 87-92 | Worker cap + `RISK-ABC152-NEGWORKERS` | 555 | S: the cap is E; the pin values, 4.x env note and the risk are O (SE editing `vitest.config.ts`) | SPLIT | ~220 | log § "ABC-152 pass" / new § in "On-demand commands" |
| B18 | 93-131 | 11 opt-in deep-lane bullets (13 commands) with their HTML comments | 3,695 | S: command lines E-for-QE only but test-pinned; comments O | SPLIT (A) / MOVE (B) | 1,632 bare lines + ~150 trigger line (A); 0 (B) | comments to the log's per-lane §§ (Search, Engine, Levels, Input-seam, Transposition, Zobrist, Quiescence, PVS/LMR, Puzzle, Real-engine CLI, Ladder). Option B: lane commands too |
| B19 | 132 | `Test (single file)` | 84 | E | KEEP | 84 | |
| B20 | 133-136 | Coverage x2 + comments | 498 | O: anyone measuring coverage; not a gate | SPLIT (A) / MOVE (B) | 243 bare (A); 0 (B) | log § "Coverage" (exists) |
| B21 | 138-140 | Acceptance (`UNKNOWN - verify`) | 65 | E | KEEP | 65 | |
| B22 | 142-146 | Skip-count capture, test-integrity check (+ HUMAN-OWNED `test-skips.md` rule inside the comment) | 569 | E (gate; rule is safety) | KEEP | 569 | |
| B23 | 148-149 | QE-hop check + comment | 214 | S: Orchestrator at every `Done`, QE | SPLIT | ~130 | comment to `memory-bank/40-contributing.md` § Conventions (already holds the convention) |
| B24 | 151-155 | Lint | 184 | E | KEEP | 184 | |
| B25 | 157-160 | Typecheck | 177 | E | KEEP | 177 | |
| B26 | 162-166 | Build, docs build, clean | 206 | E | KEEP | 206 | |
| B27 | 168-170 | E2E | 100 | E | KEEP | 100 | |
| B28 | 172-175 | Stack | 220 | E | KEEP | 220 | |
| B29 | 177-181 | Delivery (board, cadence, traceability + `(10 cells/row)`) | 142 | E | KEEP | 142 | |
| B30 | 183-201 | Process rules (owner 2026-08-13: criteria review at `Ready for Dev` exit; ticket-prose budget) | 1,223 | O: Orchestrator at that exit; BA/PM and ticket authors | MOVE | ~220 (two operative lines inside the new summary) | NEW `memory-bank/45-standing-rulings.md` § "Process rules (this project)" |
| B31 | 203-224 | Branching model + kit override 1 + config trap | 1,380 | S: operative rule E (who may merge), authority text O | SPLIT | ~330 | 45-standing-rulings § "Branching model" |
| B32 | 226-259 | Test and UAT authority (3 dated rulings, waiver measurement, snapshot exception, owner-word ids) | 2,379 | S: Orchestrator at `Ready for UAT`; operative lines E | SPLIT | ~560 | 45-standing-rulings § "Test and UAT authority" |
| B33 | 261-282 | QE validation authority + "remain THREE" | 1,312 | S | SPLIT | ~170 (must keep `remain THREE`) | 45-standing-rulings § "QE validation authority" |
| B34 | 284-310 | Deployment posture + kit override 2 | 1,975 | S: one fact is E (nothing deploys; `production_requires_human_confirmation` true) | SPLIT | ~150 | 45-standing-rulings § "Deployment posture" |
| B35 | 312-323 | Safety rules (two bullets restate B31/B34; vitest-bump `RISK-ABC143-01`) | 939 | S: secrets, destructive, deps, no fake results are E; the restated merge/deploy bullets duplicate B31/B34; the vitest-bump risk is O | SPLIT | ~450 | restated bullets fold into the summary; `RISK-ABC143-01` to the log (already holds it, 2 hits) |
| B36 | 325-358 | The 12 coding rules | 1,803 | E (single canonical copy per the role file; "AGENTS.md rule N" cited from 5 src files) | KEEP | 1,803 | |
| B37 | 360-364 | DoR / DoD links | 301 | E | KEEP | 301 | |
| B38 | 366-369 | Memory bank & plans | 462 | E | KEEP | 462 (+~120 for two new pointers) | |
| B39 | 371-373 | When uncertain | 91 | E | KEEP | 91 | |

Counts. 39 blocks. Option A (all 17 vitest commands stay): 25 KEEP, 10 SPLIT (B02, B17, B18, B20, B23, B31-B35), 4 MOVE (B10, B11, B12, B30). Option B (lane and coverage commands leave): 25 KEEP, 8 SPLIT, 6 MOVE.

Sizes after, from the "kept after" column plus ~29 B of blank-line gaps between ranges: Option A about 14,400 B (about 14.1 KB; measured as a sum, not built; range +-600). Option B about 12,450 B.
- Headroom against 24,576 at `ABC-109`'s 1,159 B/edit: A 10,180 B = 8.8 edits; B 12,130 B = 10.5 edits.
- Against ABC-164's A1 ceiling 18,432: A 4,030 B = 3.5 edits.
- If the budget were 16,384: A 1,980 B = 1.7 edits; B 3,930 B = 3.4 edits.
- Base: 1 B = 0.0 edits.
