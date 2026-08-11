---
id: 20260811T201000Z-software-engineer-observation-b57c2e08
kind: observation
by: software-engineer
at: 2026-08-11T20:10:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - A2
  - A5
  - A6
  - A7
  - A9
  - A13
supersedes:
---

# Every close was RUN against a wrong build before it was believed — 11 mutants, 2 controls, 2 counterfactuals

> **Hand-authored**; an `observation` and not a `finding` — no verification stamp is issuable to me.
> The harness was **out of tree and outside the worktree entirely**: a copy of `src/` in the session
> scratchpad, run with `npx vitest run --root <scratchpad>`. It is **deleted**, and
> `git status --porcelain` was read after the delete — the worktree shows only the four intended
> `src/` files. This is stricter than the two previous hops, whose `probe/` sat at the worktree root
> where `npm test` and `biome check .` would have picked it up.

## Why I ran mutants at all, when BA/PM already had

**BA/PM measured its own re-implementation of the panel; I measured the tests I actually wrote.**
Those are different claims, and the gap between them is transcription. This ticket's record is that
its defects live in words — a clause that reads right and cannot fail — so "I wrote down the clause"
is not evidence that the clause kills. Both controls were in every run: the unmutated copy must be
green, or a zero means *nothing ran* rather than *nothing failed* (QE's `failed-attempt`, whose
harness scored 50/50 survivors; the bar it set is why the controls are here).

## Environment, re-verified rather than taken from the brief

Branch `grugops/ABC-016-status-panel`. At hop start `git rev-list --count HEAD..main` = **0**,
`main..HEAD` = 12, suite **708/708 on 24 files**. Node v24.12.0, vitest 3.2.7.

## The gates, run by me in this worktree

| gate | at hop start | at hop end |
|---|---|---|
| `npm run lint` | exit **0** | exit **0** |
| `npm run typecheck` | exit **0** | exit **0** |
| `npm run build` | exit **0** | exit **0** |
| `npm test` | **708/708**, 24 files | **711/711**, 24 files |
| skip count | **0** | **0** |

**708 → 711 is +2 snapshot tests (the two new `CASES` entries) and +1 `A13` test** (see the `claim`
note). The five criteria that gained assertions — `A2`, `A5`, `A6`, `A7`, `A9` — gained them inside
`it` blocks that already existed, so they add no test count.

`npm run lint` reports **2 infos, both pre-existing and both in `biome.json`** (a schema version
2.3.0 vs CLI 2.5.5, and the deprecated `recommended` field). **Verified pre-existing by stashing my
changes and re-running: the same 2 infos.** Not mine, not touched — flagged, not fixed.

## The kill table — every close, against the build it exists to catch

Each row: the mutant applied to an out-of-tree copy, the delivered tests run against it, the
criterion that failed. `m00` control green in every run.

| build | what it does | killed by | previously |
|---|---|---|---|
| `m06` | drops `CHECK` while thinking (378/400 diverge) | **`A7`** | survived every criterion |
| `m23` | idle thinking cell DROPPED — `D7`'s own target | **`A7`** | survived every criterion |
| `m46` | drops the side-to-move cell while thinking | **`A7`** | survived every criterion |
| `m21` | `KNIGHT = 4` (325/400 diverge) | **`A6`** | survived every criterion |
| `m19` | `BISHOP = 4` | **`A6`** | snapshots only |
| `m20` | `ROOK = 6` | **`A6`** | snapshots only |
| **`mCOMP`** | **`KNIGHT = 4, BISHOP = 2` — the compensating pair** | **`A6`** | **would survive the single joint FEN** |
| `m13` | hands `toSan` an empty legal list (218/400 diverge) | **`A5`** | survived every criterion |
| `m45` | drops `CHECK` when a draw is claimable | **`A2`** | survived every criterion |
| `m27` | infers the claimant from the position | **`A9`** | 0/400 divergences; unkillable before |
| `m49` | a second `isInCheck` from ply 2 on | **`A13`** | survived |
| `m50` | the 64-square scan twice from ply 2 on | **`A13`** | survived |

**`m06`, `m23` and `m46` each died at `A7` and at NOTHING ELSE** — no other acceptance criterion
fired. **`m27` died at `A9` alone and at no snapshot**, which is QE's point made mechanically: only
a status whose claimant disagrees with the board can separate reading from inferring.

## The two counterfactuals — proof that the CHANGE is what kills, not something incidental

Both run by restoring the **pre-hop** test file from `git show HEAD:` into the probe and re-applying
the same mutant. Control green in both.

- **`m23` against the pre-hop `A7`**: **0 acceptance criteria failed**, 12 snapshots failed
  (`Tests 12 failed | 15 passed`). That is QE's *"passed `A7` and every other criterion, dying only
  to 12 snapshots"* reproduced exactly. Against the new `A7` it dies at `A7`.
- **`m49` and `m50` against the pre-hop 0-and-1-ply fixtures**: **both green, 5/5**. Against the
  new ≥ 2-ply fixtures both die. **The stated depth is precisely what closes `G4`** — nothing else
  in the edit does it.

## The two new snapshots, checked against BA/PM's measured renders rather than accepted

`git diff` on the snapshot file is **12 insertions, 0 deletions** — the fifteen pre-existing
snapshots are **byte-identical**, which is the mechanical evidence that no panel behaviour moved.
The two written entries:

```
in check and fifty-move claimable        disambiguated last move
"Black to move  60...  CHECK             "Black to move  1...
material: +5                             last: Nexd4  material: +6
             Black may claim: fifty-move rule"            "
```

Row lengths `[27, 12, 45]` and `[19, 25, 11]` — **identical to BA/PM's measured figures**, and
`last: Nexd4  material: +6` is its measured string. A written snapshot is not a verified one, so
these were read and compared rather than trusted because vitest wrote them without complaint.

## `main` ADVANCED under me mid-hop, and the Orchestrator needs it

**`git rev-list --count HEAD..main` was `0` at hop start and is `1` now.** The commit is `d838bd6`
(`docs(board): grug move ABC-027 to review…`). Read via `git log`/`git diff` against `main` —
**`main` was never checked out.**

`git diff --name-only HEAD...main -- src/ plans/tickets/ABC-016-status-panel.md` is **empty**: it
touches no file under `src/` and not this ticket, so **every measurement above still describes
merged `src/` and the amended criteria**. **The branch needs a rebase before merge** — the same note
QE and the `a13` hop each had to leave, and it is the Orchestrator's, not mine.
