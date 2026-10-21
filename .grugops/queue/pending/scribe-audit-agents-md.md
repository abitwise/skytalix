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
