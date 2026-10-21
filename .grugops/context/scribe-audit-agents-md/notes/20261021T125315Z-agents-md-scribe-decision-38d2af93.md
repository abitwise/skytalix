---
id: 20261021T125315Z-agents-md-scribe-decision-38d2af93
kind: decision
by: agents-md-scribe
at: 2026-10-21T12:53:15Z
verified_by: 
confidence: high on the split and its pointers; medium on after-sizes (sums of planned parts, not a build)
refs:
  - AGENTS.md
  - ABC-164
  - ABC-109
  - ABC-173
  - 20261021T130000Z-orchestrator-decision-c6bf41be
  - 20261021T124920Z-ba-pm-decision-45c39699
  - 20261021T125254Z-agents-md-scribe-observation-ffbb746f
  - memory-bank/45-standing-rulings.md
  - memory-bank/90-agents-md-command-log.md
  - memory-bank/40-contributing.md
  - memory-bank/00-index.md
supersedes: 
seal: sha256:8e2aea7f97d75976fde0fcf3a608589451ea4528384b6c915cc2c63bbf2d072f
---

# Proposed split of AGENTS.md: keep what every session needs; move the rest behind named pointers. Audit only; no AGENTS.md edit made.

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
