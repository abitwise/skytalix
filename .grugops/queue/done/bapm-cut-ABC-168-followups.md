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

## Result

**DONE.** Records only, uncommitted on `main` (base `96dc3fa3`). Notes are in `.grugops/context/bapm-cut-ABC-168-followups/notes/`. They were sealed with `admitAndAppend`, with the context root passed explicitly as the main checkout's `.grugops/context`, and read back with `readContext` (3 notes):
- `20261021T145301Z-ba-pm-observation-89ba3c6d`: readings (instrument prototype and plants, the pin red/green, the lock numstat, the UNCOMMENT trigger check).
- `20261021T145301Z-ba-pm-decision-77891d86`: the cut.
- `20261021T145301Z-ba-pm-observation-cd2ce2c9`: owner and Orchestrator items.

**Files touched:**
- the three new ticket pages under `plans/tickets/` (`ABC-188-…`, `ABC-189-…`, `ABC-190-…`);
- `plans/board.md`:
  - one `_Updated:` line prepended above the first;
  - the ABC-188 card in Ready, with the header Ready 0/8 → 1/8;
  - the ABC-189 and ABC-190 cards in Backlog.

Not touched: `src/`, `clause-b.mjs`, `package*.json`, `AGENTS.md`, `plans/traceability.md`. Every measurement ran in scratch, outside the repository.

### The cut

| Ticket | What | Column | Size | Priority | DoR |
|---|---|---|---|---|---|
| ABC-188 | AR-163-DELONLY fix (clause (b) limb 1 on `+`/`−` lines; harness; ADR-0036 block) | Ready | S | P2 (due before ABC-168 merges) | 10/10 |
| ABC-189 | AR-168-BINPIN: one `bin` value assertion in ABC-042 A10 | Backlog (waits: ABC-168 merged) | XS | P3 (→ P2 at its trigger) | 10/10 |
| ABC-190 | Lock regeneration (QE-172-a + ABC-168's `bin`) | Backlog (waits: ABC-168 merged) | XS | P3 | 10/10 |

**ABC-188, read this first.** The fix the term names ("drop the `!lines.size` skip") is not enough. Measured on a scratch prototype:
- **What the skip-drop alone fixes.** It flips G1-IMP, G1-GRD, G-1b, the limb-1 uncomment plant, and Security/NFR's D1 and D2 to FIRES. Limbs 2 and 3 stay identical.
- **What it leaves silent:**
  - QE's rename-and-drop plant (REN);
  - a plain deletion of a holder file.
- **Why.** `addedLines` (`:207`) drops `+++ /dev/null` files.
- **Why the ticket covers it.** Security/NFR's worded ruling covers those files, and the by-hand check that this fix retires lists them. So ABC-188 scopes that case in, and its A3 is a skip-only copy that must go red on exactly REN.
- **Size.** Sized S, not XS, for that reason and for its four files, one of them an ADR.

**Other points on ABC-188:**
- **Builder.** Architect/Design. Following ABC-163's precedent, the SE is the Orchestrator's option.
- **QE-182-a is folded in.** Each plant now asserts its own changed-file list and exits 2 naming the plant (A7).
- **D1 and D2.** QE reads them by hand at `b71f8902` (A6). They are not committed rows, because `src/uci.ts` is not on `main` yet.

**AR-163-UNCOMMENT stays separate:**
- Its limb-1 case is covered by ABC-188's UNC1 row (measured).
- Closing limbs 2 and 3 needs that risk's own fix. That fix would change limbs 2 and 3, which ABC-188's A4 holds byte-identical.
- Its trigger has not fired: 0 non-JSDoc block openers at `96dc3fa3` and `b71f8902`. Whether a JSDoc block holds compilable limb code is UNKNOWN - verify.
- Security/NFR ruled no cut.
- The Orchestrator records limb 1 as covered when ABC-188 merges.

**Measured at cut:**
- **ABC-189's pin.** On a `6d27dc9e` export, `(iv-b)` goes 1 passed → 1 failed and `(iv-a)` goes red. The real file passes.
- **ABC-190's regeneration.** On `6d27dc9e`'s manifest and lock with npm 11.20.0, numstat is `4 0`, and the 4 lines are exactly the root `license` and `bin`.

**Not cut:**
- QE-168-c's optional UCI_DEEP rows (not owed);
- QE-182-b and QE-182-c (INFO).

### Owner and Orchestrator
- **Owner:** ABC-168's merge stays held on ABC-188, unless you accept AR-163-DELONLY at MEDIUM by name. BA/PM recommends building ABC-188 now. It has no file overlap with ABC-168, so it can land while UAT A8–A10 is pending.
- **Orchestrator:**
  - pull ABC-188 next;
  - optionally route a Security/NFR records read of ABC-188's A8 ADR text (case (ii) follows Security/NFR's words, not its plants);
  - move ABC-189 and ABC-190 Backlog → Ready when ABC-168 merges (the DoR stands);
  - route ABC-190's clause (a) hop.

Next free id after this hop: **ABC-191**.

### Trace rows for the Orchestrator to append (10 cells each, header order)

| ABC-188 (BA/PM) | Cut the AR-163-DELONLY fix: clause (b) limb 1 fires on any `+`/`−` line in a holder at `<base>` or `<head>`, incl. a holder deleted at `<head>`; `r2-mutants.sh` G1 rows flip, G1B/UNC1/REN added (10 rows), QE-182-a folded; ADR-0036 § S1 dated block | — | — | AR-163-DELONLY (closes on QE read); AR-163-UNCOMMENT (limb 1 covered, stays open); QE-182-a; ADR-0036 § S1; NFR-008 0/0/0; Security/NFR `…75a45be0` § 2 | `main` @ `96dc3fa3` (uncommitted, records only)<br>`plans/tickets/ABC-188-…-second-holder.md`, `plans/board.md` | — (records only; scratch prototype: skip-drop flips G1-IMP/G1-GRD/G1B/UNC1/D1/D2, REN stays silent) | — | — | → Ready (S, P2, DoR 10/10; due before ABC-168 merges) |
| ABC-189 (BA/PM) | Cut the AR-168-BINPIN pin: one `toEqual` on `bin` = `{ skytalix: "dist/uci.js" }` in ABC-042 A10, `src/cli.test.ts`; test-only | EPIC-007 | — | AR-168-BINPIN (closes on QE red read of (iv-b)); QE-168-b; ADR-0044 D8; NFR-008 not triggered | `main` @ `96dc3fa3` (uncommitted, records only)<br>`plans/tickets/ABC-189-…-passes-every-test.md`, `plans/board.md` | — (records only; scratch `6d27dc9e`: (iv-b) and (iv-a) red with the pin, real file green, base (iv-b) green) | — | — | → Backlog (XS, P3, DoR 10/10; waits ABC-168 merged) |
| ABC-190 (BA/PM) | Cut the lock-regeneration chore: `npm install --package-lock-only --ignore-scripts` after ABC-168, numstat `4 0` (root `license` + `bin`), no version/resolved/integrity moved, `npm ci` rc 0 | EPIC-007 | — | QE-172-a (closes at merge); Security/NFR `…216ceb43` Ruling 2; clause (a) hop owed; NFR-008 not triggered | `main` @ `96dc3fa3` (uncommitted, records only)<br>`plans/tickets/ABC-190-…-package-json-carries.md`, `plans/board.md` | — (records only; scratch `6d27dc9e`, npm 11.20.0: numstat 4 0, exactly the 4 lines) | — | — | → Backlog (XS, P3, DoR 10/10; waits ABC-168 merged) |
