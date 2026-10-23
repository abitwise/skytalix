---
subtask: bapm-next-slice
role: ba-pm
ref: .grugops/context/bapm-next-slice/
inputs: plans/board.md; plans/epics/EPIC-003..007; plans/tickets/*; plans/traceability.md; owner delegation …5aaf7cec; owner "go forward with the project" 2026-10-22
width: 2 (beside ticket-to-pr-ABC-199)
---

# Find what is left of the product, and cut the next slice

The owner said "go forward with the project". EPIC-007 is nearly done: only ABC-178 is in review, and ABC-197 and ABC-199 are open. Choose the next deliverable product slice from the **existing** epics and requirements.

## Do
1. **Record drift.** About 40 ticket pages have a `status:` that disagrees with `plans/board.md`. Among them are ABC-094, ABC-096, ABC-101, ABC-085 and ABC-145, plus many older ones. EPIC-003 to 006 read `status: backlog`, yet tickets were cut from them.
   - List each mismatch: ticket, page status, board column, and the merge evidence.
   - Fix only the page front matter where the board and the merge record agree.
   - Put anything ambiguous in a list. Do not guess.
2. **What is left of each epic** (003–007): which acceptance or measure is met, and which is still open.
   - Cite the requirement or measure ids.
   - Note what depends on what (for example, EPIC-005's value needs EPIC-004).
3. **Pick the next slice.** Choose the highest-value open, user-visible work and cut it as Ready tickets: DoR 10/10, sized XS–M, no XL into dev, ids from ABC-200. Name the builder role.
   - Cut only inside existing epic scope.
   - A new requirement, a scope change, an NFR-bound change, or a new or reversed ADR is the owner's call. Do not cut those: list them as owner questions, with your recommendation.
4. Close EPIC-007 if every measure is met once ABC-178, ABC-197 and ABC-199 are settled. Otherwise say exactly what is still owed.

## Fences
- Records only (`plans/`, `memory-bank/` only where your role owns it). No `src/`, `tools/`, `package*.json` or `AGENTS.md` edits. **No test or timing runs.** The host is reserved for an ABC-178 timing hop. Read-only commands like `git log` and `grep` are fine.
- On `plans/board.md`: one `_Updated` line, plus new cards under Ready. Leave column headers alone.
- Work on `grugops/bapm-next-slice` (worktree `../wt-bapm-next-slice` from `main`). Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm-slice/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `bapm-next-slice`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a trace row into this brief, then move it to `done/`.

## Result (ba-pm, 2026-10-22T19:00Z): **drift reconciled on 45 pages, 1 page and 4 epics left ambiguous. Next slice cut: `ABC-200` (Ready, M, P2, `EPIC-006`, DoR 10/10). EPIC-003, EPIC-004 and EPIC-005 are recommended to close. EPIC-007 cannot close on its measures: M1, M2 and M8(a) are owner-accepted but not tool-read (one owner question). Next free id: ABC-201.**

Records only, on `grugops/bapm-next-slice` in `../wt-bapm-next-slice`, cut from `main` `08d42d01`. One commit; not merged, not pushed. No test, probe or timing ran. Scratch was used only in `…/scratchpad/bapm-slice/` (the joins, note bodies, the front-matter script and the seal script).

Notes in `.grugops/context/bapm-next-slice/notes/`, sealed with grugops 2.1.0 `context-io.js` `admitAndAppend` (context root: this worktree's `.grugops/context`; findings `[]` on all three), and read back through `readContext` (3 notes):
- `20261022T185853Z-ba-pm-observation-e19f9612`: the drift list, with merge evidence for each fix and the ambiguous list;
- `20261022T185854Z-ba-pm-decision-623c0fed`: what is left of each epic, AC by AC, and the close recommendations;
- `20261022T185856Z-ba-pm-decision-2fddb7fa`: the `ABC-200` cut, EPIC-007's close status, and the owner question.

| item | result |
|---|---|
| Drift | 189 pages joined to 189 cards. 46 disagreed. **Fixed 45**, only where the card and a merge on `main` agree: 35 → `done`/`Done`, `ABC-052` and `ABC-111` → `dropped`/`Done`, 8 column-only → `Done`. Every ticket diff is 1–2 front-matter lines. **Ambiguous, unchanged:** `ABC-150` (only its diagnosis merged; done or dropped is a ruling) and `EPIC-003`–`006` (page and card both say Backlog; closing an epic is a card move). The 4 `dropped` pages under `## Done` (038, 060, 074, 108) follow the board's convention and are not drift. Not mine: `NFR-006` and `NFR-003` catalog cells are stale (Security/NFR). |
| EPIC-003 | all four AC met (ABC-031–036). Recommend close. Pager dormant. |
| EPIC-004 | all five AC met (ABC-175 1v5 100/100; ABC-078; ABC-084/127/131; ABC-086). Recommend close. Depth-7 and Elo stay unverified by ruling. |
| EPIC-005 | all four AC met (ABC-094 `A3`/`A5`, ABC-095), opening name ABC-096. Recommend close. It needed EPIC-004, which is delivered. |
| EPIC-006 | AC2–4 met (ABC-102, ABC-044, ABC-101). Open: the startup prompt (G6, **cut as ABC-200**), and AC1 + `NFR-007` with no fresh-clone reading (recommended next cut, XS, after ABC-178's timing hop). Negotiable slice dormant. |
| EPIC-007 | M3–M7, M8(b), M9–M11 met. **Owed: M1, M8(a) (cutechess-cli) and M2 (En Croissant)**; accepted by the owner's word, not read; neither tool is on the host. ABC-178, ABC-197 and ABC-199 settle no M. **Not closed.** |
| ABC-200 | Startup questions on a TTY when a flag is absent; Enter keeps white and level 5; A1–A9. M, P2, DoR 10/10. Builder: Architect/Design ruling first (STOP to the owner on a new or changed ADR), then the Software Engineer; QE and Security/NFR follow. Merges after ABC-178's B7/B8 hop. |
| Owner question | Close EPIC-007 with M1, M2 and M8(a) accepted but unread? **Recommendation:** close M2 on his acceptance; keep M1 and M8(a) open until `cutechess-cli` is installed, then one XS agent-run QE reading. Or "close EPIC-007 as accepted", with the gap kept on record. |

Files:
- `plans/tickets/ABC-200-on-a-terminal-npm-run-chess-asks-for-colour-and-difficulty-when-the-flags-are-absent.md` (new);
- 45 `plans/tickets/ABC-*.md` pages, front matter only;
- `plans/board.md`: +2 lines, one `_Updated` line and the `ABC-200` card under Ready. The `## Ready (WIP 0/8)` header is left for the Orchestrator; it should read 1/8;
- `plans/epics/EPIC-006-game-session-and-packaging.md`: one dated block under the title (front matter unchanged);
- `plans/traceability.md`: two rows (below);
- `.grugops/context/bapm-next-slice/notes/`: 3 notes, new;
- this record, moved to `done/`, and `bapm-next-slice.claim.md`.

Not touched: `src/`, `tools/`, `package*.json`, `AGENTS.md`, `memory-bank/`, `plans/nfr-catalog.md`, the epic front matters, every other board card and header, other worktrees, main's checkout, git config.

No stop.

### Trace rows (10 cells, header order)

| ABC-200 (bapm-next-slice) | On a terminal, npm run chess asks for colour and difficulty before the first board when their flags are absent (EPIC-006 G6): TTY-only; Enter keeps white and level 5; wrong answer re-asks; EOF exits 0; pipe byte-identical; no line lost or stolen; 0 book reads before the first question | EPIC-006 | — | NFR-007 (< 2 s, read with both flags); NFR-008 (+1 file, ≤ 0.05 s est.); N8-LANE ≤ 650 ms CPU if owed; ASVS V5; ADR-0036 (b1) hop owed; notes …623c0fed, …2fddb7fa | grugops/bapm-next-slice (records only)<br>plans/tickets/ABC-200-on-a-terminal-npm-run-chess-asks-for-colour-and-difficulty-when-the-flags-are-absent.md | — (records only; no test, probe or timing ran) | QE verdict signs UAT (owner delegation …5aaf7cec); A8 QE pty hand reading | — | cut → Ready (M, P2, DoR 10/10); Architect/Design ruling first (STOP to owner on a new or changed ADR), then SE; merges after ABC-178's B7/B8 hop; next free ABC-201 |
| records drift (bapm-next-slice) | 45 ticket pages' status/column front matter reconciled to plans/board.md (35 → done/Done, ABC-052 and ABC-111 → dropped/Done, 8 column only); ABC-150 and EPIC-003..006 left ambiguous; EPIC-003/004/005 recommended to close, EPIC-006 and EPIC-007 stay open | EPIC-003..007 | — | — ; note …e19f9612 | grugops/bapm-next-slice (records only)<br>plans/tickets/ (45 front matters, 1–2 lines each) | — (records only) | — | — | reconciled; ambiguous list to the Orchestrator |
