---
subtask: arch-adr0050-in-force
role: architect-design
ref: .grugops/context/arch-adr0050-in-force/
branch: new records branch grugops/arch-adr0050-in-force from main, worktree ../wt-arch-adr0050-in-force
width: 1 of 2 — records only (no npm, vitest, build or timing)
---

# ADR-0050 is in force on main (ABC-208 merged)

## Do
- Read Orchestrator `orch-2026-10-26q/…836cb92d` and QE `qe-ABC-208/…0477ac64`.
- **ADR-0050 § Status:** add one dated line saying it is in force on main from merge `b5c67ab7` (ABC-208, QE PASS). Check this read-only first: `git diff 3a87f9d7 b5c67ab7 -- src` is empty, and the null move is present in `src/` at `b5c67ab7`.
- If the 30-architecture page or ADR-0026 (the door pair) carries a line that the merge now makes stale, add a dated correction there. Change nothing else; the full re-pass stays an EPIC-008 close item.
- Run `node tools/grugops/reference-check.js` on every file you touch.
- Records only: `git diff --stat main...HEAD -- src tools package.json` must print nothing. Paste it.

## Fences
- Work only in your worktree. Don't touch the board or ticket pages.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `arch-adr0050-in-force`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Done, records only.** Branch `grugops/arch-adr0050-in-force` (worktree `../wt-arch-adr0050-in-force`), cut from `main` `3357c882`. Commits `40b92bef` (records) and `94eb882e` (note); tip `94eb882e`. Not pushed and not merged.

- **Read-only check first:** `git diff 3a87f9d7 b5c67ab7 -- src` printed 0 lines. At `b5c67ab7` the null move is present in `src/search.ts`, `src/engine.ts`, `src/apply.ts` (`makeNullMove` / `unmakeNullMove`) and `src/zobrist.ts` (`zobristKeyAfterNullMove`). `grugops/ABC-208` `2e9eb9a7` is an ancestor of `b5c67ab7`, and `main`'s `src` equals `b5c67ab7`'s.
- **ADR-0050 § Status:** one dated 2026-10-26 line, above the ACCEPTED block, says it is in force on `main` from merge `b5c67ab7` (`ABC-208`, QE PASS `…0477ac64` at `3a87f9d7`, Orchestrator `…836cb92d`). It also says the ACCEPTED block's "until then" sentence and its S1 NOT MET fallback are discharged. No other line changed (+8 lines).
- **30-architecture: two stale rows dated, nothing else changed** (+2/−2 lines). Each row gets a dated italic correction in its own cell:
  - `apply.ts`: it also holds `makeNullMove` / `unmakeNullMove`, and it is still the only module that writes a `Position`. Checked: at `b5c67ab7`, no non-test module other than `apply.ts` and `fen.ts` assigns a `Position` field.
  - `zobrist.ts`: `zobristKeyAfterNullMove` is added, and the type-only import now names `NullUndo` as well. Its depth stays `UNKNOWN - verify`.
  - The full re-pass of the page stays an EPIC-008 close item.
- **ADR-0026: nothing stale, unchanged.**
  - Decision 9's dated "accepted, not in force on `main`" line (118 cp) still holds at `b5c67ab7`: the `ABC-121` d5 drift rows still assert ≤ 75 cp (QE's carried backlog item).
  - Decision 10 names null move as the next heuristic under the door pattern. ADR-0050 follows it, so the line is fulfilled, not stale.
- **reference-check:** `node tools/grugops/reference-check.js` printed `No findings.` (exit 0) on both touched files.
- **Empty diff:** `git diff --stat main...HEAD -- src tools package.json` printed nothing (exit 0).
- **Class scan:** 0 hits over the added lines.
- **Note:** `.grugops/context/arch-adr0050-in-force/notes/20261026T122935Z-architect-design-decision-1deceedf.md` (decision). It was sealed by grugops 2.1.0 `admitAndAppend` with `at` from `date -u`, read back with `readContext` (1 note), and its index was rendered.
- **Not done:** no board or ticket edits, no npm, vitest, build or timing, no push.
- **For the Orchestrator:** merge `grugops/arch-adr0050-in-force` when ready.

### Trace row (10 cells, header order)

| ABC-208 (arch-adr0050-in-force) | ADR-0050 dated in force on main from merge b5c67ab7 (QE PASS …0477ac64 at 3a87f9d7; src diff 3a87f9d7..b5c67ab7 empty, null move present at b5c67ab7); 30-architecture apply.ts / zobrist.ts rows dated for the null-move additions; ADR-0026 nothing stale | EPIC-008 | — | none moves (ADR-0050 bars as written; ADR-0026 d9/d10 unchanged) | `grugops/arch-adr0050-in-force` @ `94eb882e` (on 3357c882)<br>ADR-0050, 30-architecture + note …1deceedf | records only: `git diff --stat main...HEAD -- src tools package.json` empty; reference-check No findings ×2; class scan 0 | — | — | ADR-0050 in force on main (b5c67ab7); architecture full re-pass stays an EPIC-008 close item |
