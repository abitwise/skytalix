---
subtask: bapm-amend-ABC-168
role: ba-pm
ticket: plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md
ref: .grugops/context/bapm-amend-ABC-168/
width: 3 (beside qe-ABC-187 and qe-ABC-172)
---

# BA/PM: amend ABC-168's page per the Architect's D8 ruling (option (a))

The Architect ruled option (a) (`.grugops/context/arch-ABC-168-D8/notes/`: `…5a20f1f5` readings, `…ce80739a` ruling, `…618fccad` exact page text) and added `ADR-0044` § Addendum 2026-10-21 (`816b9082`): `dist/` may hold the files tsc emits for type-only imports (`turn-loop.js`, `history.js`, `frame.js`, `render.js`); `A7` and M9 read what `dist/uci.js` loads; D8 gains `"include": []`.

## Do
- Amend the ABC-168 page exactly as `…618fccad` gives: Scope 2, `A7` bullet 2, `A7`'s away-from-clone bullet, Out of scope, Test note 4. Date the amendment and cite the ruling.
- **Do NOT edit `EPIC-007` M9.** M9 is owner-accepted; the Orchestrator is asking the owner to confirm its rewording. On the page, note that `A7`'s new wording depends on that confirmation, and that the fallback if he declines is option (b) (another ADR amendment).
- Re-score DoR (the Architect expects 10/10). Move the card from Blocked to Ready if 10/10; size S and P1 unchanged.

## Fences
- Records only: the ABC-168 page, `plans/board.md` (the ABC-168 card, header counts, one `_Updated:` line prepended above the first existing one; re-read the board right before editing), notes. No `EPIC-007`, ADR, `src/`, `AGENTS.md` or `plans/traceability.md` edits. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-amend-ABC-168`). **Pass the main checkout as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/bapm-amend-ABC-168.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**:
  `| ABC-168 (BA/PM) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

## Result (ba-pm, 2026-10-21T14:03:28Z): **ABC-168 amended on ruling (a). DoR 10 of 10. Blocked → Ready. Size S and P1 unchanged. `EPIC-007` M9 waits on the owner.**

Records only, uncommitted on `main` (`main` was at `9035e9be` when this hop started and finished). Notes are in
`.grugops/context/bapm-amend-ABC-168/notes/`. They were sealed with `context-io.js` `admitAndAppend` (grugops 2.1.0 plugin
cache), with the context root passed explicitly as the main checkout's `.grugops/context`. Both read back through
`readContext`:
- `20261021T140243Z-ba-pm-decision-60a66fbb`: the amendment, the DoR re-score and the column move.
- `20261021T140243Z-ba-pm-observation-7667bcc5`: the owner owes the M9 confirmation, plus the fallback (b) and the files touched.

**Files touched:**
- `plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md`: frontmatter `blocked`/`Blocked` →
  `ready`/`Ready`; the dated amendment blockquote; the five edits; a Dependencies line; the DoR re-score.
- `plans/board.md`: one `_Updated:` line prepended above the first existing one (the board was re-read right before the
  edit, at `9035e9be`); the card moved from Blocked to Ready, with a dated note appended; the header Ready 0/8 → 1/8.
  Blocked now has no card.

Not touched: `EPIC-007` (M9), `ADR-0044`, `src/`, `AGENTS.md`, `plans/traceability.md`.

### The five edits (each worded as `…618fccad` gives)
1. **Scope 2:** "`tsconfig.build.json` as D8 specifies, with `\"include\": []` (`ADR-0044` § Addendum 2026-10-21)".
2. **`A7` bullet 2:** "`dist/` holds no `*.test.js`, `cli.js` or `line-input.js`; `turn-loop.js`, `history.js`,
   `frame.js` and `render.js` may be present as type-only emits and are not loaded; `grep -l 'import(' dist/*.js`
   prints nothing".
3. **`A7`'s away-from-clone bullet:** the dialogue now runs after `rm -f <scratch>/d/turn-loop.js <scratch>/d/history.js
   <scratch>/d/frame.js <scratch>/d/render.js`. The expected output is unchanged: one book warning, a legal `bestmove`, exit 0.
4. **Out of scope:** "including moving `EngineSeam` out of `src/turn-loop.ts`; and any prune of `dist/`".
5. **Test note 4:** QE's fresh-clone `A7` includes the `rm -f` run and the `import(` grep. A missing static import fails
   with `ERR_MODULE_NOT_FOUND`, and `…5a20f1f5` has the negative control.

These are unchanged: Scope 6 and its four pin edits, `A11`, `A12` (its file list already names `tsconfig.build.json`),
size `S` and `P1`.

### DoR: 10 of 10 (re-scored at `9035e9be`)
Items 2, 4, 5, 7 and 10 were re-read.
- **2** is sharper: `"include": []` is named, and moving `EngineSeam` and pruning `dist/` are fenced off.
- **4** holds: `A7` is still a binary reading of exit codes and empty output.
- **5** adds the owner's M9 confirmation.
- **7** counts five notes.
- **10** holds: D8 is ruled, and the open M9 confirmation gates QE and UAT reading `A7`, not the build (`…ce80739a` item 6).

The page says how `A7` depends on M9: it is not read as M9's proof until the owner confirms. The fallback if he declines is
option (b), with another `ADR-0044` amendment and a re-cut of this page.

### For the owner (the Orchestrator asks)
Confirm `EPIC-007` M9's rewording from "`dist/` holds no … `turn-loop.js`" to "`dist/uci.js` loads no `turn-loop.js`,
as `A7` measures". When he confirms, BA/PM (or whoever the Orchestrator routes) edits M9's text. **If he declines,** (b)
needs another `ADR-0044` amendment, because it edits `turn-loop.ts`, which is on D2's no-edit list. Even then,
`history.js` is still emitted (`…ce80739a` item 3).

### Next
The Orchestrator may re-pull `ABC-168` (`Ready` → `In Development`). The SE resumes from the WIP patch on
`grugops/ABC-168` @ `2f02d158`, which already has `"include": []`. M9's confirmation is needed before `qe-ABC-168` reads `A7`.

### Trace row for the Orchestrator to append (10 cells, header order)

| ABC-168 (BA/PM) | amended page on ruling (a): Scope 2 adds "include": [], A7 bullet 2 allows type-only emits not loaded + import( grep, away-from-clone run after rm -f of the four, Out of scope (EngineSeam move, dist/ prune), Test note 4; M9 not edited, owner confirms rewording (fallback (b)) | EPIC-007 | — | ADR-0044 D8 § Addendum 2026-10-21 (816b9082); notes …5a20f1f5, …ce80739a, …618fccad, …60a66fbb, …7667bcc5 | main @ 9035e9be (uncommitted, records only)<br>plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md, plans/board.md | — (records only; no gates run) | — | — | Blocked → Ready (S, P1, DoR 10/10; owner owes M9 confirmation before QE/UAT reads A7) |
