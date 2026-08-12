---
id: 20260812T181500Z-architect-design-claim-architecture-file-false-sentences-b3d8f0a1
kind: claim
by: architect-design
at: 2026-08-12T18:15:00Z
verified_by:
confidence: high
refs:
  - arch-audit-2026-08-12
  - memory-bank/30-architecture.md
  - memory-bank/00-index.md
  - EPIC-002
supersedes:
---

# Which sentences of `30-architecture.md` were false — named individually, and the file is rewritten

> **Hand-authored, not a `finding`.** See the graph note for why no stamp exists.

The old file described the tree **after `EPIC-001`** and was never updated when the whole `EPIC-002`
render/loop stack landed. **Six of its statements were false, four were stale-but-true, and the rest
held.** Named one by one so nobody has to re-derive which:

## FALSE — corrected in the rewrite

| # | the sentence | measured |
|---|---|---|
| 1 | *"Only the **rules core** is built (EPIC-001, merged) … Renderer (EPIC-002) … do not exist yet"* | **`EPIC-002` is built and merged.** `render`, `frame`, `glyph-mode`, `history-pane`, `status-panel`, `turn-loop`, `san` and `history` all exist. **This is the single most misleading sentence in the bank** — it is in the file every role reads on start |
| 2 | *"Eleven production modules, flat in `src/`"* | **17** |
| 3 | *"zero cycles, depth 7"* … *"depth still 7"* | cycles still zero; **depth 8** |
| 4 | *"`position.ts` … 8 of the 9 other modules import it"* / *"9 of the other 10 (all but `perft-bench.ts`)"* | **11 of the other 16.** The five non-importers are `frame`, `glyph-mode`, `history-pane`, `perft-bench`, `turn-loop` — **not** "all but `perft-bench`" |
| 5 | *"`render.ts` joins `history.ts` and `perft-bench.ts` as a module with **zero importers** — `ABC-018` will be its first"* | **`ABC-018` duly became its first.** `frame.ts` and `glyph-mode.ts` now import `render.ts`; `history.ts` has three importers. **The zero-importer set is now `turn-loop`, `status-panel`, `history-pane`, `glyph-mode`, `perft-bench`** |
| 6 | *"One `*.test.ts` beside each module"* | **28 test files for 17 modules.** `moves` has 5, `san` 4; seven modules carry a `*.nfr.test.ts` sibling; `position.ts` and `perft-bench.ts` have none |

## STALE BUT NOT FALSE — kept, with the missing half added

- The layering chain `position ← {fen, moves} ← apply ← legal ← {zobrist, perft} ← {gameend, perft-bench} ← history`
  is **still a correct sub-path**; it simply stops six modules short. Replaced with the measured
  8-level listing rather than extended by hand.
- *"Transient mutation behind pure-looking queries"* listed `legalMoves`, `gameStatus`, `perft`,
  `zobristKey` — **`toSan` also make/unmakes** (`san.ts:102-106`) and was missing.
- *"`history.ts` … Nothing in the core imports it"* is **true as written** (no *core* module imports
  it) but reads as "nothing imports it", which is no longer so.
- *"`perft-bench.ts` … the only module that prints, and it runs on import"* — **verified still
  true**, and it is now also `ADR-0011` clause 4's only *entry point*.

## STILL TRUE — re-verified rather than assumed

Zero runtime dependencies (`package.json` has **no `dependencies` key at all**); `private`, no
`main`/`exports`/`bin`; no barrel and no entry module; mutable `Position` with caller-owned
`UndoRecord` and **no clone function anywhere**; the core owns a position, not a game; Node ≥ 22 ESM
with type-stripping and no bundler. **All five deployment-posture bullets re-verified**: no YAML file
anywhere in the repo, `.github/` holds one file and no `workflows/`, no git remote,
`plans/releases/` holds only `.gitkeep`, `tsc --noEmit` emits nothing.

## `00-index.md` was stale by four and has now gone stale twice

It said *"**seven** ratified ADRs, `ADR-0001`–`ADR-0007`"*; there are **eleven**. It was three behind
on 2026-08-06 and four behind today. **Corrected to eleven, and a line was added putting the
maintenance burden on whoever writes `ADR-0012`** — the defect is that a hand-maintained census of a
directory has no instrument, which is the same shape as the `ADR-0008` screen drift recorded
separately.
