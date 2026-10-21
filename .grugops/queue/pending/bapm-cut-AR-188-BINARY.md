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
