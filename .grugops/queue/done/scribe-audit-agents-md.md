---
subtask: scribe-audit-agents-md
role: agents-md-scribe
ref: .grugops/context/scribe-audit-agents-md/
width: 3 (beside bapm-rule-QE-165 and bapm-rescope-ABC-164; records only)
---

# Scribe audit: what in `AGENTS.md` does every role session need? (owner direction, 2026-10-21)

**Owner direction** (verbatim, Orchestrator note `…c6bf41be`): "AGENTS.md needs to be re-checked, what is not necessary for every role session should be moved out into separate markdown document that is reached from AGENTS.md or other index document."

This hop is an **audit only**. It produces the evidence BA/PM needs to cut the restructure. Do not edit `AGENTS.md`.

## Do
1. **Classify every section and line block** of `AGENTS.md` at `main` (24,575 of 24,576 B):
   - **Every session:** what any role must have on start (e.g. the kit-vs-state rule, the 12 coding rules, the gate commands every hop runs, hard limits). Use the kit's own definition of AGENTS.md's purpose (your role file and the kit's AGENTS.md template/checklists) as the yardstick and cite it.
   - **On demand:** what only some roles or some tickets need (e.g. per-lane receipts, ticket-specific traps, history, long rationales, rare lanes). Name which role/trigger needs it.
   - Give bytes per block.
2. **Target documents.** Propose where each on-demand block goes: an existing file (`memory-bank/90-agents-md-command-log.md`, `memory-bank/00-index.md`, ADRs, `plans/nfr-catalog.md`) or a new one (name it). Say how it is reached: a one-line pointer in `AGENTS.md`, or an index entry. No content may become unreachable.
3. **What reads `AGENTS.md`.** Find every test, tool, hook or script that reads `AGENTS.md` text or line numbers (e.g. the `ABC-109` byte budget and `ABC-065` `Dev / run` slot rows in `src/cli.test.ts`, the installer's generated banner, any `grep` in `tools/`, ticket pages and notes that cite `AGENTS.md:NNN`). For each, say what a move would break and what must move with it.
4. **Lines owed** that wait for headroom today (the note writer's `contextRoot` pointer; QE-184-c's `--reporter=verbose` child-count rule; anything else you find in notes).
5. **Result estimate:** `AGENTS.md` bytes after; headroom in edits at `ABC-109`'s 1,159 B/edit; whether the budget should stay at 24,576 or drop.
6. **Risks**: the role sessions that would now need a second read, and how to keep that cheap.

## Fences
- Records only: notes and the done record. No `AGENTS.md`, `src/`, `plans/`, `memory-bank/` edits. Never push or merge. Run no tests unless needed to show what reads `AGENTS.md`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `scribe-audit-agents-md`). **Pass the main checkout as the context root explicitly.** Take every `at` from `date -u`. Include a `kind: decision` with the proposed split, and an `observation` with the block-by-block table.
- Write `.grugops/queue/done/scribe-audit-agents-md.md` (brief + `## Result`: the split table, target docs, breakage list, owed lines, byte estimate) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order** (rule `…d2b9bf09`):
  `| Scribe (AGENTS.md audit) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

## Result

- Hop: audit only. `AGENTS.md` not edited (24,575 B at `main` `0bb078d7`; content equal to `3d36999b`). Nothing run except `wc`, `awk`, `grep`, and a node one-liner that applies ABC-173's own parser to the file (17 commands, as BA/PM read). No branch, no commit, no tests.
- Notes (sealed with `admitAndAppend`, main checkout as context root): `.grugops/context/scribe-audit-agents-md/notes/20261021T125254Z-agents-md-scribe-observation-ffbb746f.md` (block table) and `…20261021T125315Z-agents-md-scribe-decision-38d2af93.md` (proposed split).
- Headline: 39 blocks. Option A (17 vitest commands stay as bare lines, BA/PM's fixed keep): 25 kept whole, 10 split, 4 moved whole; AGENTS.md about 14,400 B (headroom 8.8 edits at 1,159 B). Option B (lane and coverage commands also leave): 25 / 8 / 6; about 12,450 B (10.5 edits); needs an Engineer edit of ABC-173 A3 and two messages.
- Owner must decide: (1) the new byte budget (recommend 18,432 under A, 16,384 under B; `src/cli.test.ts:2484`, an Engineer change) and (2) whether the 15 lane and coverage command lines may leave AGENTS.md (B; recommend A first).

### Split table (from the observation note)

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

### Proposed split, pointers, breakage, owed lines, budget, risks (from the decision note)

Readings: the observation sealed beside this note (block table). Authority: owner direction in `…c6bf41be`. This note is input to BA/PM's re-cut of ABC-164 (`…45c39699`), which already fixes the 17 vitest commands in place; the audit agrees and prices the alternative.

## 1. The split

**Stays in AGENTS.md (25 blocks whole, 10 in part):** Mission, How to work here, role/workflow pointers, the note-sealing blockquote (plus owed O1), Kit vs state (heading kept: 17 installed role adapters cite "AGENTS.md § Kit vs state"), Commands for install, `Dev / run` slot, `npm test`, heap flag, single-file test, pgrep trap, skip-count, test-integrity, QE-hop command, lint, typecheck, build, E2E, Stack, Delivery, Safety, the 12 rules (numbering untouched; 5 src files cite "rule N"), DoR/DoD, Memory bank and plans, When uncertain; the 13 deep-lane commands and 2 coverage commands as bare lines (Option A); a new ~1.9 KB section "Standing rulings" that replaces Process rules, Branching, Test and UAT, QE, Deployment with their operative lines and the words `remain THREE`.

**Moves out (about 10 KB net):**
1. NEW `memory-bank/45-standing-rulings.md`: the five governance sections verbatim, same `##` headings ("Process rules (this project)", "Branching model", "Test and UAT authority", "QE validation authority", "Deployment posture"), so every old `§` citation resolves by name. They cannot be left to `60-progress.md`: the owner-word ids `…be910aa8` and `…d9aa42b9`, the snapshot-only exception and the Process rules occur only in AGENTS.md (grep: 0 hits in `60-progress.md`). About 8.3 KB moves; about 1.9 KB summary stays.
2. EXISTING `memory-bank/90-agents-md-command-log.md`: every command's HTML-comment receipt and trap (lane triggers, `PUZZLE_DEEP` TRIGGER, `RISK-ABC152-NEGWORKERS`, `RISK-ABC143-01`, slot writing rules, worker-cap detail). It has a section for each lane, so the move is a diff, not a rewrite. Conservation gaps to fill (strings in AGENTS.md, 0 hits in the log): `VITEST_MAX_THREADS` is read by nothing on 4.x; `ENDGAMES 204 + perft/puzzles 242`; coverage "v8 coverage does not cross a process boundary"; `spike:perft`; `viteModuleRunner`; the perft command lines. Add a top section "On-demand commands" (perft harness, perft deep, spike, book regen, lane trigger table: who runs each lane and after which change), and update the log's Reader paragraph to name QE and SE.
3. EXISTING `memory-bank/40-contributing.md` § Conventions: the QE-hop check comment (the convention is already written there).
4. `memory-bank/00-index.md`: two table rows (45, and a changed description for 90). The index has no `AGENTS.md` mention today, so AGENTS.md carries the pointers; the index rows are the second route.

**Pointers in AGENTS.md (about 450 B total):** one "Standing rulings" heading with `memory-bank/45-standing-rulings.md` and its five headings; one "On demand" line naming the log § "On-demand commands" and the QE trigger table; one line in Memory bank & plans naming 45 and 90.

## 2. Option A or B (owner's call; recommend A first)
- A (BA/PM's fixed keep): all 17 vitest commands stay as bare lines (the HTML comments go). `vitestCommandsIn(AGENTS.md)` still returns 17; no `src/` edit; Scribe-only. AGENTS.md about 14,400 B.
- B: the 13 lane and 2 coverage commands also leave (to the log's new section). AGENTS.md about 12,450 B. Needs an Engineer edit: ABC-173 A3 (`src/cli.test.ts:3969`) must read the log's new section as well as AGENTS.md, and the ≥17 floor must hold on the union; and the "as AGENTS.md spells it" messages (`tools/grugops/heap-guard.js:59`, `src/cli.real-engine.test.ts:127`) and comments (`vitest.config.ts:109`, `heap-guard.js:9,26`) re-point. The new section must keep HTML comments off any backticked `npx vitest` span (the parser strips comments, so a command in a comment is invisible) and must not use prose backticks around a second vitest command.
- Recommend A now. B later only if the owner wants the last 1.9 KB.

## 3. What a move breaks (must move with it)
- `src/cli.test.ts` reads AGENTS.md at `:1138`, `:2251`, `:2342`, `:2372`, `:2435`, `:3978`, `:2490`: ABC-042 A1 (the `- Dev / run: \`npm run chess\`` string); ABC-065 A1/A3 (separator in the slot; documented options equal the accepted set both ways; `--colour white|black|random`, `--difficulty 1|2|3|4|5` each exactly once); ABC-071 (exactly one `- Dev / run:` label); ABC-067 (slot comment closes before the next `\n- `); ABC-059 (every "Dev / run" span, up to the next `[.!?]` plus space, has no `UNKNOWN - verify` and names no `npm run` other than `npm run chess`); ABC-109 A5 (`≤ 24_576` B); ABC-173 A3 (exactly 17 vitest commands outside comments, heap flag per shape, eight `*_DEEP` prefixes (PERFT, SEARCH, ENGINE, INPUT, ZOBRIST, PUZZLE, CLI, LADDER), INPUT carries `--expose-gc`, ≥ 3 suite-shaped). The slot (B09) and 17 commands therefore do not move under A. New prose must not say "Dev / run" followed by another `npm run X`, and must not name an option in the slot.
- Nothing reads line numbers. Citations `AGENTS.md:NNN` in tickets and notes (ABC-164 `:82-132`, ABC-162 `:123-126`, ABC-174 `:59`, the ABC-165 note `:181`) go stale; BA/PM already ruled them historical.
- Citations by heading: `§ QE validation authority` (5), `§ Role / workflow files` (about 4), `## Test and UAT authority` (2), `§ Commands`, and in-file cross-references ("Kit override 1 of 3 (count: `## QE validation authority`)", "see `## Branching model`"). The new file keeps the headings; the summary must re-write the in-file ones.
- Installer and hosts: `install.js` only creates AGENTS.md; no tool reads it afterwards; `.grugops/install.json` has no AGENTS.md hash; `uninstall.js` leaves an edited AGENTS.md. `CLAUDE.md`, `.github/copilot-instructions.md`, `.pi/prompts/grugops.md` point at "AGENTS.md" generally; `.gemini/settings.json` lists the file name. The 17 `.claude/agents/grugops-*.md` adapters cite "AGENTS.md § Kit vs state." Do not rename that heading.
- `tools/grugops/*.js`: none read AGENTS.md text.

## 4. Owed lines (all in ABC-164 O1-O3; audit found no others)
- O1 `contextRoot` pointer: stays in AGENTS.md (B05), about 110 B. Every role seals notes, so it is every-session.
- O2 QE-184-c (`--reporter=verbose`, `[CLI_DEEP]` count ≥ 1, 6 today): QE-only; goes to the log § "Real-engine CLI lane".
- O3 ladder lane (verdict ran inside vitest, route V; `LADDER_DEEP=verdict … --reporter=verbose`, ADR-0038 addendum 2, run 2's reading `…4c1d8e27`; drop "not run here" and "plain node"): on demand; goes to the log's ladder section. Do NOT spell that command in backticks inside AGENTS.md: it would be an 18th parsed command.
- Moot: ABC-146's `node` route (route V chosen); QE-159-f (landed `8187ee19`); the writer-absent staleness noted in `qe-ABC-159` (already fixed, `59ce86b9`).

## 5. Budget
Recommend lowering the constant: A at about 14.4 KB under a 24,576 B ceiling leaves 8.8 edits of room and invites regrowth (ABC-109 measured +1,159 B per edit); 18,432 B (BA/PM's A1) leaves 3.5 edits; 16,384 B suits B (3.4 edits). The constant is `src/cli.test.ts:2484` (Engineer change, owner decision). The Mission sentence (B02) names the number and moves with it.

## 6. Risks and cost control
- QE (lane triggers, QE-hop, PUZZLE_DEEP trigger) and the Orchestrator (waiver measurement, snapshot exception, Process rule 1) need a second read. Keep it to one named section: the summary names the file and section for each, and carries the waiver measurement command and the snapshot sentence inline. A role that never certifies a ticket (SE, Architect) never needs the second read.
- Silent loss: conservation check by QE (A4 in the ABC-164 page) must also cover the 45 file; the three owner-word ids are the canary strings.
- The summary is new text. It states the rulings; it must not change their meaning. Scribe drafts, QE diffs removed lines against the union of targets.

### Trace row (10 cells; for the Orchestrator to append, `plans/` is fenced from me)

`| Scribe (AGENTS.md audit) | Audited AGENTS.md block by block (39 blocks): about 10 KB is on demand; proposed split, targets, readers and owed lines recorded | — | — | ABC-109, ABC-164, ABC-173 | records only: 2 notes in .grugops/context/scribe-audit-agents-md, no branch<br>files touched: none in the repository tree | wc/awk/grep only; no test run | — | — | audit done; feeds BA/PM re-cut of ABC-164 |`
