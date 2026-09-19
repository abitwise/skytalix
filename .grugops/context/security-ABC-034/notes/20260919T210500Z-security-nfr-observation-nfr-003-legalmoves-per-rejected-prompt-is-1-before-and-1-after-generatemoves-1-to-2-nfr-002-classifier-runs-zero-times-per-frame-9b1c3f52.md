---
id: 20260919T210500Z-security-nfr-observation-nfr-003-legalmoves-per-rejected-prompt-is-1-before-and-1-after-generatemoves-1-to-2-nfr-002-classifier-runs-zero-times-per-frame-9b1c3f52
kind: observation
by: security-nfr
at: 2026-09-19T21:05:00Z
verified_by:
confidence: high
refs:
  - ABC-034
  - ABC-033
  - ABC-033/A5
  - NFR-002
  - NFR-003
  - NFR-001
  - ADR-0004
  - src/rejection.ts
  - src/move-input.ts
  - src/command-input.ts
  - src/legal.ts
  - src/moves.ts
  - src/render-seam.ts
  - src/history-pane.ts
  - plans/nfr-catalog.md
supersedes:
---

# `NFR-003` (QE G3), measured not inherited: **`legalMoves` per rejected prompt = 1 before the build and 1 after**, `generateMoves` 1 → 2, `isInCheck` +1 on the two king classes only. `NFR-002`: **`classifyRejection` runs 0 times in 1,600 rendered frames**; the render path's own derives are byte-for-byte the same before and after

**This is not a stamp.** Hand-authored `observation`. Scripts and raw output beside this note
(`instrument.mjs.txt`, `probe-nfr003.mjs.txt`, `probe-nfr002.mjs.txt`, `raw-nfr003-before.txt`,
`raw-nfr003-after.txt`, `raw-nfr002.txt`, `raw-nfr002-before.txt`). Counts are integers and
machine-independent; the machine was Apple M3 / Node v24.12.0 for the record.

## Method — two out-of-tree copies, wrapper counters, positive control first

- **AFTER** = `src/` at the wave branch tip (`1b431dc`, carrying the build `6ee7cde`), test files
  excluded. **BEFORE** = the same copy with `src/move-input.ts` replaced by `4f0ef01`'s blob
  (`git hash-object` = `49c6a642…` = `git rev-parse 4f0ef01:src/move-input.ts`, asserted) and
  `src/rejection.ts` deleted — i.e. the pre-build tree, since those are the only two production
  files in `git diff 4f0ef01 6ee7cde -- src/`.
- In each copy `legalMoves`, `isInCheck` (`src/legal.ts`), `generateMoves` (`src/moves.ts`) and
  `classifyRejection` (`src/rejection.ts`, AFTER only) were renamed to `__impl` and re-exported
  under a counting wrapper; **each replacement asserted to apply exactly once**. The worktree was
  never written.
- The counted call is the **production** one: `resolvePromptLine(history, line)` with no `deps`
  — exactly what `createLineInputSeam` calls per typed line (`src/line-input.ts:243`) — so the
  classifier's own `legalMoves` import, which `ABC-033 A5`'s spy cannot see, IS seen here. A
  positive control (one rejected prompt) registered non-zero before any zero was believed.

## `NFR-003` — per prompt, production path

| prompt (position) | kind | `legalMoves` before → after | `generateMoves` before → after | `isInCheck` before → after |
|---|---|---|---|---|
| `hello`, `\x1b[2J`, `  qh5  ` (start) — `unreadable` | rejected | **1 → 1** | 1 → 2 | 0 → 0 |
| `a3a4` — `empty-square`; `e7e5` — `not-your-piece`; `e2e5` — `piece-cannot-reach` (start) | rejected | **1 → 1** | 1 → 2 | 0 → 0 |
| `Qh5` (start), `e8=K` (promo), `Nxg7` (kiwipete) — `no-legal-move-named` | rejected | **1 → 1** | 1 → 2 | 0 → 0 (`Nxg7`: 6 → 6, pre-existing `parseSan` castle-path `toSan`, identical both trees) |
| `Nc3` (pin) — `own-king-exposed` | rejected | **1 → 1** | 1 → 2 | 0 → 1 |
| `Nh3`, `h2h3` (check) — `must-address-check` | rejected | **1 → 1** | 1 → 2 | 0 → 1 |
| `O-O` (no castle) — `unreadable` | rejected | **1 → 1** | 1 → 2 | 0 → 0 |
| `Nf3`, `e2e4`, `nf3` (start) | move | 1 → 1 | 1 → 1 | 0 → 0 |
| `e7e8` (promo) | ambiguous | 3 → 3 | 3 → 3 | 4 → 4 |
| `help` | command | 0 → 0 | 0 → 0 | 0 → 0 |

**Worst rejected prompt after the build: `legalMoves` = 1, `generateMoves` = 2.** The
`generateMoves` inside `legalMoves` (`src/legal.ts:46`) is the "1 before"; the classifier's own
`generateMoves(position)` for the set difference (`src/rejection.ts:128`) is the "+1"; the
`legal` list is handed through (`src/move-input.ts:190`) so **no second `legalMoves` is
derived** — the ticket's cost claim ("one `generateMoves` and one `legalMoves`") is exactly what
was measured, and G3's worry (Me2, dropping `legal`, is green in the suite) is a **test gap on a
true claim**, not a charge. `NFR-001`'s row has `generateMoves` at single-digit µs, so the +1 is
~0.01% of `NFR-003`'s 50 ms; the ambiguity path (3 derives, `ABC-033`'s) is untouched; the command
table short-circuits before any derive. `toFen` byte-identical on every prompt.

## `NFR-002` — per frame, the CLI's own render seam

`makeRenderSeam(mode, orientation)` (`src/render-seam.ts:51`) rendered **200 frames** per cell
with a real rejection sentence in the message region, at 0 / 40 / 120 / 272 realised plies of a
deterministic LCG game, unicode/white and ascii/black:

| plies | frames | `classifyRejection` | `legalMoves` during render | `generateMoves` | `isInCheck` |
|---|---|---|---|---|---|
| 0 | 400 | **0** | 0 | 0 | 400 (status panel, 1/frame) |
| 40 | 400 | **0** | 5,600 (14/frame) | 5,600 | 7,200 |
| 120 | 400 | **0** | 6,800 (17/frame) | 6,800 | 7,200 |
| 272 | 400 | **0** | 7,600 (19/frame) | 7,600 | 7,200 |

**`classifyRejection` = 0 in all 1,600 frames; positive control 1.** No classifier work runs on the
per-frame path — the sentence is a string by the time the loop hands it to `render`. **The
`legalMoves` / `generateMoves` counts during render are IDENTICAL on the BEFORE tree** (same
table, `raw-nfr002-before.txt`), so they are pre-existing: the history pane's `toSan` per rendered
ply (`src/history-pane.ts:63`, `ADR-0004` derive-per-frame) and the status panel's `isInCheck`
(`src/status-panel.ts:43`). Not this ticket's, not charged here; **handed to Architect/Design as
data only**: 14–19 `legalMoves` per frame at 4.3 µs each (the `NFR-002` row's own unsupplied-list
figure) is ~60–80 µs of the 16 ms budget — under the bar, but it is the largest per-frame derive in
the tree and the `NFR-002` row does not yet carry it as a measured item.
