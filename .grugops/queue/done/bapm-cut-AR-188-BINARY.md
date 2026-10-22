---
subtask: bapm-cut-AR-188-BINARY
role: ba-pm
ticket: (new) AR-188-BINARY fix
ref: .grugops/context/security-nfr-ABC-188/
width: 1
---

# BA/PM: cut the XS/P3 fix for `AR-188-BINARY` (Security/NFR `…f5843a71`; owner record `…9f5ca4b4`)

A NUL byte in a limb-1 holder, or a checked-out `.gitattributes` `src/** -diff` line, makes git treat the file as binary; the clause (b) instrument then sees no changed line on any limb (QE-188-a; Security/NFR measured the `-diff` case; a textconv driver does not blind limb 1). The Orchestrator runs a `--numstat` stand-in at every routing until the fix lands.

## Cut (next free id ABC-191; verify in `plans/tickets/`)
- Scope: `.grugops/context/design-F-072-1/probe/clause-b.mjs`'s one diff call reads `--text --no-textconv`; `r2-mutants.sh` gains a NUL plant and a `-diff` plant (FIRES on limb 1); `r2-mutants.out.txt` regenerated; limbs 2/3 identical to `341da4c1`; a dated line in `ADR-0036` § S1 retiring the `--numstat` stand-in when it lands.
- Acceptance red on today's instrument (`main` after ABC-188's merge), green at head; QE reads. Closes `AR-188-BINARY` on QE's read.
- Builder Architect/Design. Size XS, P3. Score DoR; place it in Ready at 10/10.

## Fences
- Records only: the new page, `plans/board.md` (one card, header counts, one `_Updated:` line prepended above the first existing one), notes. No instrument, ADR, `src/` or `plans/traceability.md` edits. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-cut-AR-188-BINARY`). **Pass the main checkout as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/bapm-cut-AR-188-BINARY.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**:
  `| ABC-191 (BA/PM) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

## Result

**DONE.** Records only, uncommitted on `main` (base `1ee70c63`). Notes are in `.grugops/context/bapm-cut-AR-188-BINARY/notes/`. They were sealed with `admitAndAppend`, with the context root passed explicitly as the main checkout's `.grugops/context`, and read back with `readContext` (2 notes):
- `20261021T154351Z-ba-pm-observation-d4004b45`: the readings (prototype, harness runs, partial copies, textconv, `.git/info/attributes`).
- `20261021T154400Z-ba-pm-decision-2edce8cb`: the cut.

**Files touched:**
- `plans/tickets/ABC-191-a-production-file-git-treats-as-binary-hides-every-changed-line-from-clause-b.md` (new);
- `plans/board.md`: one `_Updated:` line prepended above the first, the ABC-191 card in Ready, header Ready 0/8 → 1/8.

Not touched: the instrument, the harness, `ADR-0036`, `src/`, `plans/traceability.md`. Every measurement ran in scratch, outside the repository.

### The cut

| Ticket | What | Column | Size | Priority | DoR |
|---|---|---|---|---|---|
| ABC-191 | AR-188-BINARY fix: the one diff call reads `--text --no-textconv`; `BIN-NUL` and `BIN-ATTR` rows; `out.txt` regenerated; dated `ADR-0036` § S1 block retiring the `--numstat` stand-in | Ready | XS | P3 (gates no merge) | 10/10 |

**How the new rows read against `341da4c1`** (Security/NFR left this wording to BA/PM). `341da4c1` is blind to both plants, so a same-plant comparison would hold the fixed instrument to blindness. Measured: the prototype differs from it only on `production files changed: 0` → `1`. So on `BIN-NUL` and `BIN-ATTR`, limbs 2/3 are compared with `341da4c1`'s output on **X1** (the same edit without the marker), plant ids masked, with the reference taken **with X1 checked out**. A checked-out `-diff` line blinds the reference too (measured). The 10 existing rows keep the same-plant byte comparison.

**Measured at cut (scratch prototype, not a design):**
- **Base** (today's instrument): harness rc 1, `limb 1 MISMATCH: BIN-NUL BIN-ATTR`, the 10 existing rows `ok`. Limbs 2/3 DIFFER from the X1 reference on both rows.
- **Prototype:** 12 of 12 `ok`; limbs 2/3 match the X1 reference. Counts: `BIN-NUL` 2/4, `BIN-ATTR` 1/3.
- **Each flag alone falls short:**
  - `--no-textconv` only reads as base;
  - `--text` only passes the harness, but on a textconv plant (`TXC`: X1's edit plus `src/** diff=bin` and `hexdump -v -C`) it reads 6/12 instead of X1's 1/3. That is `A6`, read by hand.
- **A third blinding route:** `.git/info/attributes` `src/** -diff`, with no file committed. Base does not fire; the prototype fires. The same flag covers it, so it gets no row.

**Acceptance A1–A9** are on the page. QE's read of `A2`–`A7` closes `AR-188-BINARY` (`…f5843a71` § 3); no Security/NFR gate is required.

### Owner and Orchestrator
- **Owner:** nothing to decide. P3, gates no merge.
- **Orchestrator:**
  - keep the `--numstat` stand-in at every routing and merge until ABC-191 merges, in the same checkout as the instrument. It also sees the `.git/info/attributes` route there;
  - pull ABC-191 when convenient. It has no file overlap with ABC-168, ABC-189 or ABC-190;
  - append the trace row below.

Next free id after this hop: **ABC-192**.

### Trace row for the Orchestrator to append (10 cells, header order)

| ABC-191 (BA/PM) | Cut the AR-188-BINARY fix: clause (b)'s one diff call reads `--text --no-textconv`; `r2-mutants.sh` gains BIN-NUL and BIN-ATTR (FIRE on limb 1; limbs 2/3 vs `341da4c1` on X1, plant ids masked); `out.txt` regenerated; dated ADR-0036 § S1 block retires the `--numstat` stand-in | — | — | AR-188-BINARY (closes on QE read of A2–A7); QE-188-a; ADR-0036 § S1; V1.2.5; NFR-008 0/0/0; Security/NFR `…f5843a71` § 3; owner `…9f5ca4b4` | `main` @ `1ee70c63` (uncommitted, records only)<br>`plans/tickets/ABC-191-…-from-clause-b.md`, `plans/board.md` | — (records only; scratch prototype: base red on exactly BIN-NUL BIN-ATTR, prototype 12/12, each flag alone short, TXC 1/3 vs 6/12) | — | — | → Ready (XS, P3, DoR 10/10; gates no merge) |
