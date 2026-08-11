---
id: 20260811T130500Z-software-engineer-observation-97ec25ee
kind: observation
by: software-engineer
at: 2026-08-11T13:05:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - A2
  - D19b
  - src/status-panel.test.ts
  - src/status-panel.ts
supersedes:
---

# The replay-reading build was CONSTRUCTED and run; the new case is the only thing on the ticket that fails it

> **Hand-authored**; an `observation` and not a `finding` — no verification stamp is issuable to me.
> Every number below was RUN in this worktree. The harness was out of tree and is deleted.

## Why I re-measured instead of inheriting

BA/PM's `D19b` note and the Orchestrator's routing note both assert that a build reading the check
indicator or the material balance from item 4's **replay** position passes every criterion as they
stood. I was about to spend twelve lines on that premise, so I checked it. This board's recorded
failure mode is believing an instrument without checking the instrument.

## What I re-checked at source, before writing a line

| claim | how I checked it | result |
|---|---|---|
| gates green on the rebased branch | re-ran all four myself | lint / typecheck / build exit **0**; **707/707**, 24 files, skip **0** |
| 0 behind `main` | `git rev-list --count HEAD..main` | **0** behind, 7 ahead |
| no delivered case contains a capture | capture-grep `x[a-h][1-8]` over `src/status-panel.test.ts` | **0 matches** |
| the suite's only `last:` expectation is `Nf3` | grep `last:` over `src/*.test.ts` | `:204` `"last: Nf3"` and `:209` the empty-history negative — nothing else |
| `A13`'s two halves are already asserted | READ `src/status-panel.nfr.test.ts` | direct half at **`:130-132`**, difference half at **`:140-149`** — as ruled |

## The mutant, built rather than reasoned about

I copied delivered `src/status-panel.ts` into a `probe/` directory at the **worktree root — never
under `src/`** and applied the one change the defect names: `lastMoveSan` hands back the replay
`Position` it is already holding, and the panel reads `isInCheck` and `materialBalance` off **that**
instead of off `history.position`. Roughly six lines. It is the natural shortcut, not a contrived
mutant: the replay is right there in scope.

Then I ran the **whole** amended acceptance file against it.

```
× A2 — states CHECK on a plain check, on a mate, on a check reached by play, and never on a quiet board
  → expected 'Black to move  3...\nlast: Qxe5+  mat…' to contain 'CHECK'
  Tests  1 failed | 26 passed (27)
```

**`A1` and `A3`–`A12` all PASS against the mutant. All fifteen snapshots PASS against it. The only
failure anywhere is the new case.** That is BA/PM's claim, reproduced independently, and it is the
strongest statement available that the twelve lines earn their place.

## Both halves of the case discriminate, not just the check indicator

Rendered side by side at the same history, same status:

```
CORRECT:                          MUTANT:
Black to move  3...  CHECK        Black to move  3...
last: Qxe5+  material: +1         last: Qxe5+  material: 0
```

- **item 2** — `CHECK` present against absent.
- **item 5** — `material: +1` against `material: 0`.

The assertion order means the test reports the `CHECK` failure first; the balance half was confirmed
separately by printing both renders. Either one alone would kill this mutant, which is worth knowing
because a future edit that drops one of the five assertions still leaves the case doing its job — but
only against **this** mutant. A build wrong on the balance alone is caught by the `material: +1`
clause and by nothing else on the ticket.

## The two positions, measured here rather than transcribed

| | FEN | to move | `isInCheck` | legal replies |
|---|---|---|---|---|
| live | `rnbqkbnr/pppp1p1p/6p1/4Q3/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 0 3` | Black | **true** | **3** |
| replay (ply *n*−1) | `rnbqkbnr/pppp1p1p/6p1/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR w KQkq - 0 3` | **White** | **false** | — |

Byte-identical to the two FENs BA/PM recorded. The replay still has the black pawn on e5, which is
why its balance is 0 and the live board's is +1.

## What the SNAPSHOTS do and do not do here — stated because it is easy to over-credit them

The mutant passed **all fifteen** snapshot tests. That is not a defect in the snapshots; it is what
snapshots are. Run against a fresh file they have no committed baseline, so they record whatever the
build emits and agree with it. **The snapshot in this commit is a regression record for a change to
the delivered panel, and is worth nothing as a mutant net.** The five explicit `toContain`
assertions are the whole of the discriminating power. Recorded so that QE, which is next on this
branch, does not count the fifteenth snapshot as fifteenth coverage.

## Not done

- Nothing merged, nothing deployed, nothing pushed, no `git checkout main`.
- **`probe/` deleted before anything was staged**; `git status` read after the delete and is clean of
  it, with `git status --porcelain -- src/` showing only the two intended modified files.
- No wall-clock assertion was written and none entered the suite (`src/zobrist.nfr.test.ts:112`'s
  standing rule). `A14` was not re-measured at this hop — nothing this hop touched can move it, since
  it adds no production line and the new case is 5 plies.
