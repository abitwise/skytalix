---
id: 20260811T205222Z-ba-pm-observation-4c1d90ab
kind: observation
by: ba-pm
at: 2026-08-11T20:52:22Z
confidence: high
refs:
  - ABC-019
  - ABC-017
  - ABC-028
  - ABC-029
  - NFR-002
  - ADR-0002
  - src/turn-loop.ts
  - src/history-pane.nfr.test.ts
  - plans/nfr-catalog.md
supersedes:
---

# What I measured on the rebased tip, before ruling anything

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repository and
> `mcp__grugops__propose_note` is unavailable, so the note kind, id and front matter were written by
> hand.
>
> **`kind: observation`, NOT `finding`, and that is deliberate.** Workflow 16 admits a `finding` only
> with a real `§14-gate#<id>` stamp cross-checked against a live GREEN gate verdict, or `human:<name>`
> under a named human's session grant. **The gate on this tip is RED** (2 failed) so no green verdict
> exists to stamp against, and `context.human_admission` is **`off`** in `.grugops/factory.config.json`.
> **There is therefore no admissible `finding` at this hop and I wrote none.** Every figure below is a
> command I ran in `../cli-chess-ABC-019` this hop; none is inherited from another role's report.

## 1. The parent hop's figures REPRODUCE — I re-ran them rather than citing them

| figure | `parent_ref` recorded | I measured |
|---|---|---|
| `npm run lint` / `typecheck` / `build` | 0 / 0 / 0 | **0 / 0 / 0** |
| `npm test` | 2 failed / 789 passed (791), 1 file failed / 27 passed (28), skip 0 | **identical** |
| `src/turn-loop.ts` md5 | `bd793612476c9d0eac28b75e1e3297cc` | **identical** |
| the two red assertions | `:228`, `:275` | **identical, same messages** |

`:228` → `expected [ 'turn-loop.ts' ] to deeply equal []`.
`:275` → `history.ts was evaluated in a production closure`.

## 2. The importer count, re-derived with `A11`'s OWN regex rather than by grep

Over the **17** non-test `.ts` files in `src/`, applying
`/^import\s+(?!type\b)[^;]*from\s+"\.\/history\.ts";/m`:

**Exactly ONE match — `src/turn-loop.ts`** (`:52`,
`import { type GameHistory, gameStatusOf, playMove, takeBack } from "./history.ts";`).

`src/history-pane.ts:61` and `src/status-panel.ts:42` are `import type` and are correctly not matched.
So **production runtime importers of `src/history.ts` = 1**, where every prior derivation on this
board measured **0**. Each of those was correct on the tree it ran against.

## 3. THE MEASUREMENT THE RULING RESTS ON — the render closure, probed not argued

`NFR-002`'s catalog row scopes its own void-condition to **a renderer** and **a frame**:
*"If a renderer ever pulls the repetition derive into a frame, the frame is O(plies) again and this
row's O(window) statement is void"*, and *"The quantity belongs to the LOOP (`ABC-019`), not to a
frame"*. So I probed **that** set, with the same `module.registerHooks` technique the merged `RF-1`
probe uses, rooted at the five renderer modules:

```
roots: frame.ts, render.ts, history-pane.ts, status-panel.ts, glyph-mode.ts
closure (11): apply.ts, fen.ts, frame.ts, glyph-mode.ts, history-pane.ts, legal.ts,
              moves.ts, position.ts, render.ts, san.ts, status-panel.ts
```

**`history.ts` is NOT in it.** Neither is `gameend.ts`, `zobrist.ts` or `turn-loop.ts`.

**The zero is ARMED and I checked that rather than assuming it** — QE's own recorded lesson on this
board is that a zero meaning *"nothing ran"* is indistinguishable from *"nothing happened"*. The same
probe rooted at `turn-loop.ts` reports:

```
apply.ts, fen.ts, frame.ts, gameend.ts, history.ts, legal.ts, moves.ts,
position.ts, turn-loop.ts, zobrist.ts
```

— `history.ts` **is** reported when it is genuinely in a closure. The instrument is not blind.

**And the loop cannot be reached from a frame by any path:** `grep -n 'turn-loop' src/*.ts` excluding
`turn-loop.*` returns **0**. Nothing in `src/` imports it.

Node **v24.12.0**; `UNKNOWN - verify` on any other runtime.

## 4. `A11` is NOT wholly red — six of its eight tests PASS

`npx vitest run src/history-pane.nfr.test.ts` → **2 failed / 6 passed (8)**. The six that pass are the
entire spied-call-count table — `gameStatusOf` / `repetitionCounts` / `keyHistory` / `gameStatus` at 0,
`takeBack` / `playMove` at 0, `parseFen` ≤ 1, `toSan` once per rendered ply — which is the half
`ABC-017`'s own text calls *"the clause that binds"*. **Only the two whole-tree structural instruments
are red.** This distinction is load-bearing for the ruling and is the reason it is cheap.

## 5. The gates AFTER my edits — unchanged, because I wrote no `src/` byte

`lint` 0 · `typecheck` 0 · `build` 0 · `npm test` **2 failed / 789 passed on 28 files**, skip 0 —
identical to before my edits. `src/turn-loop.ts` and `src/history-pane.nfr.test.ts` md5s asserted
unchanged (`bd793612…`, `e27a8387…`), and `git diff --stat -- src/` is **empty**.

## 6. A record defect, carried forward and NOT smoothed

This machine's clock reads **2026-08-11T20:52Z** (local 23:52) while the board, the traceability
headers and `ABC-017`'s merge record are dated **2026-08-12**. I used the true clock in every file I
wrote and edited nothing into agreement. **Two roles have now recorded this independently.**
