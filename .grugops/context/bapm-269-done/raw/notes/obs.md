# bapm-269-done ledger: the brief's four items were applied to 8 pages in `a2520724` (+153 / −35). One board defect was found and left for the Orchestrator, since the board is outside this task's fence: the `ABC-269` Done card and the `ABC-274` card sit outside their column sections, and `## In Development (WIP 1/3)` lists no card

| brief item | page | before (`128e3c6c`) | after (`a2520724`) |
|---|---|---|---|
| `ABC-269` → Done, Result, gaps f…k with owners | `ABC-269` | `status: backlog`, no result | `status: done` + `closed:`; CLOSED block (F3 → C1, QE table, gaps with owners) |
| `EPIC-011`: E1 Done; reading row; Phase 4 next; `QE-269-k` | `EPIC-011` | E1 "DoR 10/10"; row 21 Backlog | top block; E1 DONE, next `ABC-274`; G3 tally 2 / 2; row 21 Done; S′ pool row points to `ADR-0056` |
| `ABC-274` DoR row 10 → ✅, 10/10, Ready | `ABC-274` | 9/10, Backlog | 10/10, `status: ready`; row 10 ✅ with the head `54dee3f2` / `4d6b117b` |
| `ABC-270`–`273` "waits `ABC-269` merged" → met | 4 pages + `ABC-239` | ❌ "`ABC-269` not merged" | struck and dated as met; DoR 9/10 unchanged |

- **Checked:** `54dee3f2` is a merge whose second parent `b1af2174` has `be87a2f1` as an ancestor. `git rev-parse` reads `src/` `4d6b117b` at `54dee3f2`, `be87a2f1`, `561fc028` and `HEAD`. So `main`'s `src/` is the tree QE graded.
- **Checked:** every figure on the pages is quoted from QE's sealed notes (`…eff2fe64`, `…2c51ee30`, `…48b34063`, `…3fb121de`, `…9ba289c2`), or from the Orchestrator's board line for the post-merge 2 566.
- **Board defect (the Orchestrator's; not edited):** in `plans/board.md` at `128e3c6c`, three things are out of place:
  - the `[ABC-269] DONE` card sits among the dated `_Updated:` lines (around line 379), not under `## Done`;
  - the `[ABC-274]` card sits inside the HTML conventions comment, between "HEADING FORMAT" lines (around line 1262), not under a column;
  - `## In Development (WIP 1/3)` lists no card.
- **Not done:** the S′ pool arithmetic (`arch-post-269` item 3, as the brief says) and the `ADR-0064` in-force line (the Architect's).
- **DoR:** `ABC-274` 10/10; `ABC-270`–`273` 9/10, unchanged; `ABC-269` 10/10, closed.
