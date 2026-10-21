---
subtask: bapm-cut-ABC-168-followups
role: ba-pm
ticket: ABC-168 (Ready for UAT; merge held on AR-163-DELONLY)
ref: .grugops/context/security-nfr-ABC-168/
width: 1
---

# BA/PM: cut the three ABC-168 follow-ups (Security/NFR `…75a45be0`; owner record `…e37f4a1a`)

## Cut (next free id ABC-188; verify in `plans/tickets/`)
1. **`AR-163-DELONLY` fix — P2, due before ABC-168 merges (its trigger (iv) fired).** In `.grugops/context/design-F-072-1/probe/clause-b.mjs`: limb 1 fires on `+` and `−` lines; drop the `!lines.size` skip (Security/NFR `…3e4b4a08` § 2 for ABC-163; the `ADR-0036` § S1 text). Builder: Architect/Design (owns the instrument; ABC-163's precedent used the SE). Acceptance: the ABC-182 harness `r2-mutants.sh` with its `G1-IMP`/`G1-GRD` rows flipped to FIRES (that ticket edits the expected verdicts) and limbs 2/3 still identical to `341da4c1`; Security/NFR's deletion plants D1 (drop `uci.ts`'s exit-70 line) and D2 (drop the EPIPE handler) fire limb 1; QE-182-a (a partly applied two-edit plant passes under its label) folds in here since this ticket edits `r2-mutants.sh`. Closes `AR-163-DELONLY` on QE's read. Say whether `AR-163-UNCOMMENT` rides along or stays separate.
2. **`AR-168-BINPIN` pin — XS, P3.** One value pin for `package.json` `bin` (`{ "skytalix": "dist/uci.js" }`) in `src/cli.test.ts`'s `ABC-042` A10 row (the SE knows the shape); red on QE's plant (`bin` → `src/uci.ts`). Owed before merge of any ticket that packages `dist/`, makes a backend depend on `skytalix`, or edits `bin`. Sequence it after ABC-168 merges (it pins ABC-168's key).
3. **Lock-regeneration chore — XS, P3, after ABC-168 merges.** Regenerate `package-lock.json` with `npm install --package-lock-only`; the expected diff is the root `license: "UNLICENSED"` (QE-172-a) and the 3-line `bin` block (Security/NFR `…216ceb43`), no resolved version or integrity moved; `npm ci` rc 0. Clause (a) short hop.
- Score DoR for each; place each in Ready (or Backlog with its wait named).

## Fences
- Records only: new ticket pages, `plans/board.md` (cards, header counts, one `_Updated:` line prepended above the first existing one), notes. No `src/`, `clause-b.mjs`, `package*.json`, `AGENTS.md` or `plans/traceability.md` edits. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-cut-ABC-168-followups`). **Pass the main checkout as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/bapm-cut-ABC-168-followups.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace rows: exactly 10 cells each, in header order**, one per ticket cut:
  `| {ticket} (BA/PM) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
