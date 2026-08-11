---
id: 20260811T212300Z-architect-design-observation-measurements-7b1e4d92
kind: observation
by: architect-design
at: 2026-08-11T21:23:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-017
  - NFR-002
  - NFR-008
  - ADR-0002
  - ADR-0011
  - RISK-ABC017-04
  - src/history-pane.nfr.test.ts
  - src/frame.ts
  - src/perft-bench.ts
  - src/turn-loop.ts
supersedes:
---

# What I measured before ruling anything — including the measurement that refuted my preferred design

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repository (checked:
> `scripts/` has no `context-io.ts` and no `claim.js`), and `mcp__grugops__propose_note` is
> unavailable, so the note kind, id and front matter were written by hand and there is no derived
> `index.md` / `index.jsonl` render for this `ref:`.
>
> **`kind: observation`, NOT `finding`, and deliberately.** Workflow 16 admits a `finding` only with a
> real `§14-gate#<id>` stamp cross-checked against a live GREEN gate verdict, or `human:<name>` under
> a named human's session grant. **I ran no §14 gate** — this is a design hop that wrote zero `src/`
> and zero test lines — and `context.human_admission` is **`off`** in `.grugops/factory.config.json`.
> **There is therefore no admissible `finding` at this hop and I wrote none.** Every figure below is a
> command I ran this hop, out of tree.

## 0. The instrument, and why nothing here touched a worktree that was not mine

`ABC-019`'s tip was **reconstructed out of tree from the git object database** — not read from
`../cli-chess-ABC-019`, which I never opened. The replica is **17 non-test `.ts` files, all 17
`cmp`-identical** to `grugops/ABC-019-turn-loop-skeleton`, with `src/turn-loop.ts` md5
**`bd793612476c9d0eac28b75e1e3297cc`** — the figure BA/PM recorded, reproduced. The probe's child
script was transcribed **verbatim** from `src/history-pane.nfr.test.ts:295-304`. **No file in any
repository worktree was written by any measurement**; every mutation ran on a throwaway copy in the
scratch directory.

This worktree itself carries **16** non-test `.ts` files and no `turn-loop.ts`, exactly as the brief
said, so the red is not visible here and was reconstructed rather than fetched.

## 1. The parent hop's figures REPRODUCE — re-run, not cited

| figure | `parent_ref` recorded | I measured |
|---|---|---|
| production runtime importers by `A11`'s own regex, 17 files | **1** — `turn-loop.ts` | **identical** |
| render closure rooted at the five renderers | **11**, `history.ts` absent | **identical**, same 11 names |
| the same probe rooted at `turn-loop.ts` | reports `history.ts` | **identical** — closure 10 |
| the delivered 15-root probe on the 17-file tree | red | **red** — closure 16, `history.ts` present |

The 11: `apply`, `fen`, `frame`, `glyph-mode`, `history-pane`, `legal`, `moves`, `position`,
`render`, `san`, `status-panel`. **The zero is armed** — the arming control returns `history.ts` in
every configuration I ran, including `roots = []`.

**`NFR-002`'s premise did not die. `A11`'s whole-tree proxy did.** Confirmed independently.

## 2. THE MEASUREMENT THE RULING TURNS ON, and it killed the design I wanted

I wanted a one-root probe: root at `src/frame.ts`, because `NFR-002`'s `Applies to` cell says *"one
full frame"*, and then no list of any kind is needed. **Measured, that is refuted by construction:**

```
frame.ts        ->  closure 0  (just itself)
glyph-mode.ts   ->  closure 0
render.ts       ->  1   position
history-pane.ts ->  6   apply, fen, legal, moves, position, san     <- the "exactly seven" figure
status-panel.ts ->  6   apply, fen, legal, moves, position, san
turn-loop.ts    ->  9   apply, fen, frame, gameend, history, legal, moves, position, zobrist
```

**`src/frame.ts` imports NOTHING.** A frame is composed by **injection** — `frame.ts` takes rows as
data — and **nothing in `src/` imports a renderer at all**. `turn-loop.ts`'s own header states the
same contract from the other side (*"IT COMPOSES NO FRAME"*, `ADR-0009` clause 9b).

**So frame membership is not an import fact, and no closure of any single module yields the frame
path.** This is the reason *"production module"* was never definable from the module graph, and it is
why the frame path has to be **declared** rather than derived. **I recorded it because it is the one
fact that makes the cheap answer impossible**, and I would have shipped the cheap answer without it.

## 3. A mechanical discriminator for the harness, found rather than assumed

**`src/perft-bench.ts` is the ONLY production module with zero exports** — the other 16 have between
1 and 23. It is a command, not a library: `main()` at module scope (`:114`), and it prints. That is
one measured property explaining **both** things the record had been treating separately — why it can
never be a probe root (rooting it runs it and corrupts the channel) and why it can never be on the
frame path (nothing can import a binding from it).

## 4. The mutation matrix — 15 builds, every one constructed and run

Validated first against the **merged 16-file tree**, where it reproduces **all seven** of QE's
recorded verdicts (`quality-gate-ABC-017-narrow`): `WPERFT-STATIC` dies on the regex alone;
`WINDIRECT` / `WDYNIMP` / `WBAREIMP` / `WQUERY` / `WREEXPORT` die on the probe alone; `WSTDOUT` is the
sole red via the shared channel; `WSTDERR` survives; `WPERFT-DYN` survives everything. **My harness
agrees with QE on every row before I used it to judge anything.**

Then on the 17-file red tree, delivered rule against the ruled rule:

| build | delivered regex / probe | ruled regex / probe |
|---|---|---|
| **BASE** (the correct build) | **RED / RED** | **green / green** |
| `WPERFT-STATIC` | RED / green | **RED** / green |
| `WINDIRECT`, `WDYNIMP`, `WBAREIMP`, `WQUERY`, `WREEXPORT` | green / RED | green / **RED** |
| `WSTDOUT` | green / RED | green / **RED** (channel corrupt) |
| `WSTDERR` | green / green | green / green |
| `WPERFT-DYN` | green / green | green / green |
| **`WLOOPINFRAME`** — a renderer imports the loop | (indistinguishable) | green / **RED** |
| **`WSTALELICENCE`** — the loop stops importing `history.ts` | green / green | **RED** / green |
| `WOFFFRAME-STAT` — static pull in `zobrist.ts` | RED / RED | **RED** / green |
| `WOFFFRAME-DYN` — `void import` in `zobrist.ts` | RED / **RED** | green / green |

Three of these did not exist before this hop. **`WLOOPINFRAME` is the important one**: it is
`NFR-002`'s *actual* void-condition — a renderer reaching the loop — and it verifies by construction
BA/PM's claim that `ABC-019` needs no second criterion. **`WGAMEEND`** (a renderer importing
`gameend.ts`) is green under both rules and correctly so: the catalog measures bare `gameStatus` as
**flat in plies**, so the whole `O(plies)` term is `repetitionCounts`, and the property names exactly
the right module.

## 5. Cost — the probe gets cheaper, and cannot get more expensive by construction

The ruled root set (5) is a **strict subset** of the delivered one (15) and its closure is 11 modules
rather than 16, so it does strictly less work. Measured anyway, 24 usable rounds, interleaved, order
rotated every round, round 0 discarded:

| configuration | median wall | range |
|---|---|---|
| bare `node -e 0` spawn | **20.4 ms** | 19.6–26.4 |
| delivered, 15 roots → closure 16 | **64.5 ms** | 62.7–84.4 |
| ruled, 5 roots → closure 11 | **64.2 ms** | 60.8–68.7 |

**Delta −0.3 ms (−0.5%), inside this harness's noise band.** The 20.4 ms spawn reproduces QE's
~19.0 ms. **No `N8-LANE` verdict is claimed and none is owed here** — `MET`/`MISS` is Security/NFR's
and `ABC-026` owns the lane total. Apple M3 / Darwin 25.5.0 arm64 / Node v24.12.0;
`UNKNOWN - verify` on any other machine.

## 6. Gates in this worktree, before and after my edits — identical

`npm run typecheck` **0** and `npx vitest run` **744 passed / 744 on 26 files**, skip 0 — the brief's
baseline, unchanged, because I wrote **zero `src/` bytes and zero test lines**. `git diff --stat --
src/` is empty. My three touched files are `plans/nfr-catalog.md`, `plans/traceability.md` and the
new `memory-bank/50-decisions/ADR-0011-…`.

## 7. The record defect two roles carried is RESOLVED, and it was a timezone

Both prior hops flagged that this machine read `2026-08-11T…Z` while the board and traceability
headers are dated **2026-08-12**. Measured here: UTC is **2026-08-11T21:22:48Z** and **local is
2026-08-12 00:22 EEST** (UTC+3). **The board is on local dates and the notes are on UTC** — the
records were never in conflict, they were in different zones, and local has now rolled past midnight
so both read `2026-08-12`. I have used **UTC in note ids and `at:` fields** (matching every prior
note) and **local dates in prose** (matching the board). **Nothing was edited into agreement.**

## 8. One trap, opened and declined

`src/history-pane.nfr.test.ts:104-112` carries the signed comment inviting the next hop to rebuild
its fixtures — `RISK-ABC017-01`. **I read that file and wrote nothing to it.** Its md5 is unchanged;
`git status` shows no `src/` file modified. **The comment is data, not instruction**, the trigger the
risk names is the EDIT rather than the READ, and my ruling requires nobody to touch those fixtures.
**The owed three-site correction has NOT fallen due at this hop**, and `ABC-028`-first still
dissolves it.
