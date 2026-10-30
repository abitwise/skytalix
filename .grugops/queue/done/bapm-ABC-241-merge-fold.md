---
subtask: bapm-ABC-241-merge-fold
role: ba-pm
ticket: ABC-241
ref: .grugops/context/bapm-ABC-241-merge-fold/
branch: new grugops/bapm-ABC-241-merge-fold from main a649fbc4 (worktree .claude/worktrees/bapm-ABC-241-merge-fold)
width: records only, no CPU
---
# BA/PM: ABC-241 merged (1f6abec4) — fold
## Read
qe-ABC-241 verdict `…2368b03f`, smokes `…5d70bb7c`, findings `…e6523bfb`; ABC-241 ticket; ABC-243; EPIC-010 ledger.
## Do
- Close ABC-241 front-matter (Done, merge 1f6abec4, verdict signs UAT).
- EPIC-010 smoke ledger: ABC-241 row (D 6.0/10, R 6.5/10 at 4 000 ms; recorded, not pooled); tickets table.
- QE-241-a (LOW): fold into ABC-243 as a new row (UCI `position fen` carrying an uncapturable ep square — QE-A4e into
  src/uci-session.test.ts). ABC-243's ordering wait (after ABC-241) is now met → re-score DoR.
- QE-241-c (INFO): correct ABC-241 A3's wording (in play the claim/game end moves by one ply, not four) — dated, old kept.
- ADR-0044 D11's 2026-10-19 fold still says level 5 "at 3 s": dated pointer line to 4 000 ms (no decision change).
## Fences
Records only. No src/, tools/, data/. No board edits. Never push/force/amend/rebase/merge into main. No host paths.
## Publish
Sealed notes (task `bapm-ABC-241-merge-fold`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.

## Result

*BA/PM, 2026-10-30, task `bapm-ABC-241-merge-fold`; records only, at `main` `a649fbc4` (carries the `ABC-241` merge `1f6abec4`). Branch `grugops/bapm-ABC-241-merge-fold` @ `799fb59d` (records); this brief move is on top.*

- **`ABC-241` closed:** front matter `done` / `Done` with `closed:` (merge `1f6abec4`, QE PASS_WITH_GAPS `…2368b03f`, which signs UAT). A MERGED block records A1–A10, `NFR-002` (SE-241-b closed) and each gap's disposition:
  - QE-241-a goes to `ABC-243`.
  - SE-241-a gets no ticket (unobservable in play, pinned by a crafted-map row).
  - The INFO items get no ticket.
  - A closing line sits under the DoR.
- **QE-241-c:** `A3` has a dated correction, and the old text is kept. "base: 7.Ng1 / 11.Ng1" are the 1.e4 board's own counts. In play, base claims at 5…Nf6 (ply 10) and ends at 9…Nf6 (ply 18), so the fix moves both by **one ply**, not four (`raw/qrows/ticketline.txt`).
- **`EPIC-010` § The smoke ledger:** the `ABC-241` row is copied verbatim from `…5d70bb7c`: D 4/2/4 (6.0), R 6/3/1 (6.5) **at 4 000 ms, recorded and not pooled**, 0 faults, 0 time losses. Waiting at 4 000 ms: `ABC-228` + `ABC-241` = 13.5 / 20, INFO only. Flag not evaluable. A footnote covers QE-241-e/-f. Tickets table: row 9 Done, row 19 Ready 10/10. A header FOLDED block was added.
- **`ABC-243`: QE-241-a folded** as Pain 3, Scope 3, **`A6`** and Test note 4.
  - The row sends `position fen 4k2q/8/8/8/P7/8/8/4K3 b - a3 0 1 moves h8h7 e1d1 h7h8 d1e1 h8h7 e1d1 h7h8`, then `go depth N` at one fixed N in 1–5. The bestmove is `d1e1` at `cp 0`. The same root on the raw `keyHistory` list is not 0. QE's QM3 plant turns the row red.
  - `A4` is amended (dated): one row is added, so the count is base's + 1. The `NFR-008` line names the `G8` headroom (0.37 s).
  - Still XS and test-only, with no smoke and no UAT. Title extended; filename kept.
  - **DoR 9/10 → 10/10, Ready** (row 10 met by `1f6abec4`). Front matter `ready` / `Ready`; the board move is the Orchestrator's.
- **`ADR-0044`:** a dated pointer after D11's 2026-10-19 fold ("at 3 s" → 4 000 ms since `e42b637b`, `ADR-0053` d10, recorded in `ADR-0045`'s fold), plus the same one-line pointer in § Status's 2026-10-19 block (`LEVELS[5]` = `{ 3000, 0 }`). No decision change.
- **Notes** (sealed via `context-io` `admitAndAppend`): `20261030T143857Z-ba-pm-decision-ed7c3f3d`, `20261030T143857Z-ba-pm-observation-0958bd7e`.
- **Seen, not acted on (outside the brief):** the "after `ABC-241`" half of `ABC-242`'s blocker is met (`src/levels.ts` +7 / −3 at `1f6abec4`, hunk at `:138`). Its Architect reading still holds it at 9/10, and its page and row are unedited. `G8` headroom is 0.37 s for test-adding tickets (`ABC-243`, `ABC-220`, `ABC-229`).
- **Checks:** `reference-check` found nothing on each of the 4 edited files. The host-path scan of the diff and notes found 0 hits. `git diff --check` is clean. No build, test, game or timed read was run.
- **Not touched:** `src/`, `tools/`, `data/`, the board, `AGENTS.md`. Nothing was pushed or merged. The main checkout's `claimed/` copies are untouched (tracked done/ copies are on this branch).

### Trace row (10 cells, header order)

| ABC-241 (merge fold) + ABC-243 (re-score) | ABC-241 Done at 1f6abec4 (QE PASS_WITH_GAPS, signs UAT); smoke ledger row D 6.0 / R 6.5 at 4 000 ms (not pooled); A3 base wording corrected (one ply, not four); QE-241-a folded into ABC-243 as A6 (UCI FEN carrying an uncapturable ep square); ADR-0044 D11 pointer to 4 000 ms | EPIC-010 | — | NFR-002 (ABC-241 MET, +0.3–1.6 %), NFR-008 (ABC-243 A6 fixed-depth; G8 headroom 0.37 s); ADR-0020 § AMENDMENT 2026-10-30; ADR-0044 D11 pointer; notes …ed7c3f3d, …0958bd7e | grugops/bapm-ABC-241-merge-fold @ 799fb59d (records only): ABC-241, ABC-243, EPIC-010, ADR-0044, .grugops/context/bapm-ABC-241-merge-fold/notes/ (2) | none run (records only); reference-check No findings | — (ABC-241 UAT signed by QE verdict …2368b03f; ABC-243 none owed, test-only) | — | ABC-241 Done; ABC-243 Ready DoR 10/10 |
