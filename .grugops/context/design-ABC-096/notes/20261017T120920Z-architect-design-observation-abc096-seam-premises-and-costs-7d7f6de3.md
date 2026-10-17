---
id: 20261017T120920Z-architect-design-observation-abc096-seam-premises-and-costs-7d7f6de3
kind: observation
by: architect-design
task: design-ABC-096
at: 2026-10-17T12:09:20Z
verified_by:
confidence: high
refs:
  - ABC-096
  - ABC-095
  - ABC-094
  - ABC-043
  - ADR-0009
  - ADR-0029
  - ADR-0037
  - NFR-002
  - NFR-007
supersedes:
---

# ABC-096: what the seam question rests on, read at `31e8d38e`

These readings come from a scratch script outside the repository. It imports the worktree's `src/` read-only.
The machine is Node v26.11.1, darwin-arm64, at a load average of about 4. The numbers are `UNKNOWN - verify` on any other machine.
Nothing was added to the suite.

## Read at source

- **`RenderSeam`** is `(history, status, thinking, messages) => readonly string[]` (`src/turn-loop.ts:97`). `makeRenderSeam(mode, orientation)`
  binds its values once, when the seam is built (`src/render-seam.ts:51`).
- **The wiring line in `src/cli.ts` is pinned** by `src/cli.test.ts` `ABC-043` `A1`, which matches `render:\s*makeRenderSeam(mode,\s*orientation)`.
  - The same test fails on any `=>` inside the `runTurnLoop(` call.
  - So a wrapper around the seam at the composition root fails that test. This is `S-WRAP-CLI` (`secnfr-ABC-053`).
- **The executable text of `src/render-seam.ts` may contain no digit** (`src/render-seam.test.ts:268`).
- **`parseBook` keeps only `m`**, and it drops every entry whose `m` is empty (`src/book.ts:100`).
- **`book.ts`'s imports** are `legal`, `moves` (type), `position` and `zobrist`. None of them imports `history.ts`.
- **The probe's per-frame child builds its seam as `makeRenderSeam("ascii", "white-bottom")`** (`src/history-pane.nfr.test.ts:741`).
  - The child runs with its frames' message region empty.
  - It can read `src/` only.
- **`makeRenderSeam` call sites in tests:**

  | file | call sites | lines |
  |---|---|---|
  | `src/cli.test.ts` | 3 | 196, 2727, 2911 |
  | `src/render-seam.test.ts` | 2 | 90, 170 |
  | `src/history-pane.nfr.test.ts` | 1 | 741 |
  | `src/book-engine.test.ts` | 1 | 115 |

- **`src/__snapshots__/`** holds only `render.test.ts.snap` and `status-panel.test.ts.snap`. There is no frame snapshot.

## Measured on `data/opening-book/book.json`

- **Entries:** 5,390. Of these, 2,853 carry a name.
  - **1,764 named entries have an empty `m`.** Today's parse discards their names.
  - Every entry with an empty `m` is named.
- **Families:** 149.
  - 31 are longer than 21 characters.
  - 5 contain a code point above `U+007F`.
  - No name contains an astral code point.
  - No name matches `/book/i`, so `ABC-095`'s "no line names the book" assertion is safe.
- **Key `75a8cd2e62c99edd`** is `Ruy Lopez`. The start position has no name.
- **500 weighted walks along book lines**, each stopping at the last position with moves:
  - 2,969 of 4,740 in-book positions are named (62.6 %);
  - the name appeared or disappeared from one ply to the next 1,578 times.

## Costs

- **The frame:** 23 rows, with `W` = 21.
- **A warm frame:** 8.25 µs with no message items, 8.11 µs with one short item.
- **The lookup:** `zobristKey`, then hex, then `Map.get`, costs 0.33 µs per call warm.
- **The probe's first call in a fresh process** covers the read, the decode, `JSON.parse` and validation:
  - 24.36, 6.63, 6.37, 6.86, 6.39 and 6.86 ms;
  - the first run was disk-cache cold.
  - `JSON.parse` alone takes about 1.7 ms warm.
- **A cold first frame without the probe:** 0.29–0.31 ms.
- **Today the parse runs when the engine first asks for a move.** Under a lookup on the frame path, it runs before frame 0.

## Derived, not run

- **The absent-book warning on an in-place TTY:** if it is written just before frame 0, frame 0 erases it.
  - Frame 0 is cursor-home followed by a per-row erase (`src/frame.ts:233-241`).
  - This was not observed on a real terminal (`UNKNOWN - verify`).
