---
subtask: arch-build-ABC-188
role: architect-design
tickets: [ABC-188]
branch: grugops/ABC-188 (from main @ the main tip at your start); worktree ../wt-ABC-188
ref: .grugops/context/arch-build-ABC-188/
width: 1
---

# Architect (builder): ABC-188 — clause (b) limb 1 fires on `+` and `−` lines in a holder, and on a holder deleted or renamed away; the harness rows flip; QE-182-a folds in; `ADR-0036` § S1 gets a dated block. Closes `AR-163-DELONLY` on QE's read. ZERO `src/` lines

## Read first
- The ticket page `plans/tickets/ABC-188-a-deletion-only-edit-to-a-limb-1-holder-fires-nothing-on-clause-b-and-abc-168-adds-the-second-holder.md`: every criterion, § Scope (four files), § Out of scope, the builder note.
- BA/PM notes `…89ba3c6d` (scratch readings), `…77891d86` (the cut), `…cd2ce2c9`; Security/NFR `…75a45be0` (ABC-168) and `…3e4b4a08` (ABC-163); `ADR-0036` § S1; ABC-182's harness and its QE notes.
- `AGENTS.md`, and `memory-bank/45-standing-rulings.md` for the gate rules.

## Do
- Create the worktree `../wt-ABC-188` on `grugops/ABC-188` from the current `main`. A `node_modules` symlink is fine (the instrument needs `typescript`); remove it before you finish if it isn't ignored.
- **Red first:** run the harness against base's instrument; it must fail on exactly `G1-IMP`, `G1-GRD`, `G1B`, `UNC1` and `REN` (page). Then the skip-only copy, which must fail on exactly `REN` (`A3`).
- Implement exactly the page's Scope. Limbs 2 and 3 byte-identical to `341da4c1` on every plant; `(b1) capability` unchanged; the empty-holder case unchanged.
- Read D1 and D2 by hand at `b71f8902` (`grugops/ABC-168`), as the page says; they are not committed rows.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (counts equal base); skip-integrity `--skip-count 0`. Heap 128 multi-file (as `npm test` sets). No timing. UAT waiver in AGENTS.md's form (must print nothing).

## Fences
- Only the four files the page scopes. No `src/`, `biome.json`, `plans/` (except nothing), other worktrees. Commit on `grugops/ABC-188` only. Never push or merge.
- **Stop and report** if a criterion can't be met as written, or if you read Security/NFR's ruling more narrowly than the page (BA/PM flagged that this goes back to Security/NFR before the build).

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `arch-build-ABC-188`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`. Write notes inside your worktree; include a `kind: decision`.
- Write `.grugops/queue/done/arch-build-ABC-188.md` (brief + `## Result`: tip, per-criterion results, harness output, gates, waiver) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**; do NOT append it yourself:
  `| ABC-188 (Architect build) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
