---
subtask: bapm-cut-AR-191
role: ba-pm
tickets: []
branch: main (records only; commit nothing — the Orchestrator commits)
ref: .grugops/context/bapm-cut-AR-191/
width: 1
---

# BA/PM (records only): cut the AR-191-GITENV fix, with AR-191-QUOTEPATH folded in, as one XS/P3 ticket (builder Architect/Design; gates no merge)

## Read first
- Security/NFR result `.grugops/context/security-nfr-QE-191-a/notes/20261021T165304Z-security-nfr-decision-7c1f3590.md` and readings `…62620bb0`; its `probe/` (`RUN.txt`, `standin.sh`, plant scripts).
- Orchestrator record `…eb401873` (both ARs, the stand-in, the dispute-line rule).
- QE `qe-ABC-191` gap register `…9bc0b262`; `ADR-0036` § S1 (all dated blocks); ABC-191's page as the shape to follow; `.grugops/context/design-F-072-1/probe/clause-b.mjs`, `r2-mutants.sh`.

## Do
- Cut one ticket (next free id ABC-193) holding exactly what `…7c1f3590` says the fix must hold: (a) the one diff call gains `--no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/`; every instrument git call runs with `-c core.quotePath=false`; (b) harness rows with addition plants for `color.diff=always`, `diff.external`, `GIT_EXTERNAL_DIFF`, `diff.<drv>.command` + attribute, `diff.srcPrefix`/`dstPrefix`, plus QU and QE2 — each FIRES at head and is silent on the `837e8b22` instrument; (c) a dated `ADR-0036` § S1 block retiring the GITENV stand-in. Close conditions for both ARs as Security ruled.
- Measure base red on a scratch prototype outside the repository with a private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR` where you can (as `bapm-cut-AR-188-BINARY` did). Never set git config or attributes in this repository or any worktree.
- **Out of scope:** the `AGENTS.md` UAT waiver form (`git -c core.quotePath=false diff --name-only …`) — that is the owner's text and his open call; name it on the page as owed outside the fence.
- Size, priority (XS/P3 per Security), DoR score; column Ready if 10/10. One `_Updated:` line at the top of `plans/board.md` and the card.

## Fences
- Only `plans/` (board, the new ticket page) and your notes. No `src/`, instrument, harness, ADR, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config. Commit nothing.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-cut-AR-191`). **Pass this repository root's `.grugops/context` as the context root explicitly.** Take every `at` from `date -u` (UTC). Include a `kind: decision`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line. Put it in your done record (`.grugops/queue/done/bapm-cut-AR-191.md` + `.claim.md`, main's tree, uncommitted).

## Result

**`ABC-193` cut: Ready, XS, P3, DoR 10/10, builder Architect/Design. It gates no merge and changes 0 `src/` lines.** Records only, uncommitted on `main` `05f764cb`. HEAD did not move during the hop.

**Title:** Git config or environment can blind clause (b)'s one diff call, and a production file whose name git quotes goes unseen (the `AR-191-GITENV` and `AR-191-QUOTEPATH` fix).

### What the ticket holds (Security/NFR `…7c1f3590` § 2–3)
- **Scope 1, `clause-b.mjs`:**
  - (a) the one diff call gains `--no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/`;
  - (b) every instrument git call runs with `-c core.quotePath=false`;
  - (c) a path the diff still prints C-quoted FIRES (disputed) and is not dropped. § 3 of the ruling lists this as part of the fix.
- **Scope 2, `r2-mutants.sh`:** eight rows after `BIN-ATTR`, for 20 rows in all:
  - `ADD` (control, no route);
  - `G-COLOR`, `G-EXT`, `G-ENV`, `G-DRV` and `G-PFX`, each on ADD's widening plant;
  - `QU` and `QE2`.

  Routes are set clone-locally (or in `G-ENV`'s run environment) around the head runs only. `mk` reads names unquoted. Limbs 2/3 compare with `341da4c1` on the same plant with the route off; `QU` and `QE2` compare with `341da4c1` run with `core.quotePath=false`.
- **Scope 3, `r2-mutants.out.txt`:** regenerated.
- **Scope 4, `ADR-0036` § S1:** one dated block. It states (i) the flags and quotePath, (ii) quoted paths are disputes, (iii) the GITENV stand-in retires at merge, (iv) the GITENV close, (v) QUOTEPATH's instrument-half close, plus a rollback.
- **Outside the fence:** the `AGENTS.md` UAT waiver form (`git -c core.quotePath=false diff --name-only …`). It is named on the page as the owner's text and his open call.

### Base red, measured on a scratch prototype at `05f764cb`
Private HOME/TMPDIR/GIT_CONFIG_GLOBAL and `GIT_CONFIG_NOSYSTEM=1`; clones made with `--shared`. No git config was set in the repository or in any worktree.

| instrument run with head's prototype harness | rc | limb 1 MISMATCH | limbs 2/3 DIFFER |
|---|---|---|---|
| base (`d3abb847…`, = `837e8b22`) | 1 | `G-COLOR G-EXT G-ENV G-DRV G-PFX QU QE2` | those 7 × 2 = 14 |
| prototype (2 lines) and (c) prototype (+3 lines) | 0 | none, 20/20 | none; the 12 existing rows are byte-identical to base |
| no quotePath / no flags | 1 / 1 | `QU QE2` / the five route rows | 4 / 10 |
| without `--no-color` / `--no-ext-diff` / both prefixes | 1 | `G-COLOR` / `G-EXT G-ENV G-DRV` / `G-PFX` | 2 / 6 / 2 |
| without `--dst-prefix` only / `--src-prefix` only | 1 / 0 | none / none | `G-PFX` limbs 2/3 / none (read by hand: `PFX-X1` counts 1/0 vs 1/3) |

- **By hand:**
  - `PFX-X1`: head FIRES `1 + / 3 -`, and base does not fire.
  - Git shim: 87 calls on base and on head; all 87 on head carry `-c`; one diff call with the full argv.
- **Finding against the ruling's text.** § 3's "any path still C-quoted … FIRES (disputed)" does not follow from `core.quotePath=false`.
  - `CQ1` (an unreached `src/q"t.ts` with `node:fs`), `CQT` (the same with a tab in the name) and `CQ2` (a reached `src/q"t.ts` gains `node:fs` plus `fetch`) are silent on limbs 1 and 3, on base and on the flag prototype.
  - A 3-line dispute rule makes all three FIRE (disputed). `CQS` (the quoted file untouched by the pair) stays silent.
  - It is criterion `A6` and Scope 1 (c).
- **The stand-in** printed nothing in main's checkout at 17:08Z.

### Close conditions
- **`AR-191-GITENV`:** closes on QE's read of the five route rows firing at head and silent on base's instrument (`A2`, `A4`; `A3` gives each flag's share), as Security ruled. The stand-in then retires, and the Orchestrator records the close.
- **`AR-191-QUOTEPATH`:** Security states no separate close term. The page reads it as the same term on its rows: the instrument half closes on QE's read of `QU`, `QE2` and `A6`'s C-quoted plants (fire at head, silent on base). Closing it whole, or carrying the waiver half and the dispute-line rule until the owner's `AGENTS.md` text lands, is the Orchestrator's record (`UNKNOWN - verify`).

### Files edited (uncommitted, main's tree)
- `plans/tickets/ABC-193-git-config-or-environment-can-blind-clause-bs-one-diff-call-and-a-non-ascii-production-file-goes-unseen.md` (new);
- `plans/board.md`: one `_Updated:` line at the top; the ABC-193 card under Ready; Ready WIP 1/8 → 2/8;
- `.grugops/context/bapm-cut-AR-191/notes/` (2 sealed notes);
- this done record and its `.claim.md`.

Not touched: `src/`, the instrument, the harness, `ADR-0036`, `AGENTS.md`, `memory-bank/`, `plans/traceability.md` (the trace row is below, for the Orchestrator), git config, branches and worktrees. The pending file and the claimed dir were not touched either.

### Notes
Sealed with grugops 2.1.0 `context-io.js` `admitAndAppend`, context root passed explicitly as this checkout's `.grugops/context`, `at` from `date -u`. Both read back through `readContext`.
- `20261021T171208Z-ba-pm-observation-a7367f5d`: the readings.
- `20261021T171218Z-ba-pm-decision-7db22c5f`: the cut (`kind: decision`).

Next free id: **ABC-194**. Stops: none.

### Trace row (10 cells, header order)

| ABC-193 (BA/PM cut) | cut the AR-191-GITENV fix with AR-191-QUOTEPATH folded in: clause (b)'s one diff call gains --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/, every instrument git call reads -c core.quotePath=false, a C-quoted path FIRES (disputed); r2-mutants.sh gains ADD, G-COLOR, G-EXT, G-ENV, G-DRV, G-PFX, QU, QE2 (20 rows); ADR-0036 § S1 block retires the GITENV stand-in; AGENTS.md waiver form owed outside the fence | — | — | AR-191-GITENV, AR-191-QUOTEPATH, QE-191-a, QE-191-b, ADR-0036 S1, F-095-1, V1.2.5, V5.2.1, V5.3.2; notes …7c1f3590, …62620bb0, …eb401873, …a7367f5d, …7db22c5f | main @ 05f764cb (uncommitted, records only)<br>plans/tickets/ABC-193-git-config-or-environment-can-blind-clause-bs-one-diff-call-and-a-non-ascii-production-file-goes-unseen.md, plans/board.md | — (records only; prototype at 05f764cb on scratch: base rc 1, 7 rows + 14 limbs red; head rc 0, 20/20; each flag's red set measured; 87 git calls, 1 diff) | — (ABC-193 expects the waiver: 0 production lines) | — | ABC-193 cut → Ready (XS, P3, DoR 10/10; Ready 1/8 → 2/8) |
