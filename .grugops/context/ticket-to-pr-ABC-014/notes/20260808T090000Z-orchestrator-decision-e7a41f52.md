---
id: 20260808T090000Z-orchestrator-decision-e7a41f52
kind: decision
by: orchestrator
at: 2026-08-08T09:00:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-014
  - ABC-014
  - ABC-015
  - ABC-018
  - EPIC-002
  - EPIC-006
  - AGENTS.md
  - memory-bank/60-progress.md
  - plans/board.md
  - plans/traceability.md
supersedes: 
---

# `ABC-014` MERGED to `main` and CLOSED — `Ready for UAT` → `Done`

## The merge

Fast-forward **`ed42d26` → `c1d694f`**, 6 commits, **no merge commit** — verified, not assumed:
`git log --merges` returns empty and the branch was linear with nothing diverged.
`git branch --no-merged main` is empty. Nothing was pushed (this repo has no remote and never had
one) and the branch was not deleted — that call has always been the owner's.

## Gates, run by this role on both sides

Not inherited from any of the three agents that worked this ticket. The standing directive requires
the tip before and `main` after, both recorded:

| | tip `3dcf32d` | `main` `c1d694f` |
|---|---|---|
| `npm test` | **253/253, 11 files** | **253/253, 11 files** |
| skip count (`AGENTS.md` command) | **0** | **0** |
| `npm run lint` | exit 0 | exit 0 |
| `npm run typecheck` | exit 0 | exit 0 |
| `npm run build` | exit 0 | exit 0 |

Identical figures on both sides are the expected result of a fast-forward, not a suspicious one.

## The authorization, recorded honestly because the sequence matters

The owner's standing directive of 2026-08-06 already covered this merge
(`memory-bank/60-progress.md` § "Standing directive — the branching model, and who turns the merge
key"), and under it no per-merge instruction was owed.

**The first attempt was nevertheless DENIED — by the host's permission classifier, not by any rule
in this project.** Nothing ran; `main` stayed at `ed42d26` and the tree stayed clean.

**The denial was not worked around.** Several other commands would have accomplished the same
thing and none was tried. A merge is a governance surface: when the tooling withholds the
capability, the honest move is to hand the decision to the human, not to find a different route to
the same effect. The ticket was left in `Ready for UAT` with the situation written down rather than
parked as "done".

Project owner **Olger Oeselg** then said, in session on 2026-08-08: **"merge it"**. That is a real
in-session instruction and it is what this merge was performed under, on top of the standing grant.

**The three limits on the standing grant are unchanged and all were honored.** Deploy is not
included — none was attempted or contemplated, `production_requires_human_confirmation` stays `true`,
and `ADR-0007` records there is nowhere to deploy. The gate binds — run green on both sides, never
skipped, never self-certified. The authority remains the owner's and revocable.

## UAT is DEFERRED, explicitly not passed

Security/NFR's ruling is carried through this move verbatim rather than quietly rounded up. `ABC-014`
has **zero importers and there is no CLI entry point**; nothing a human can exercise exists, so a
UAT pass would be a fabrication. Deferred to `EPIC-006`, as every ticket in this project has been.

`60-progress.md` already records the consequence the owner should see, and closing this ticket is
the second time it applies: with the merge checkpoint delegated, **there is no human checkpoint
between an agent's work and `main`** until `EPIC-006` produces something a human can actually drive.
That remains the owner's trade to make, and this note does not re-open it — it only notes that the
count of tickets shipped under it is now two.

## What `ABC-014` unblocks, stated so the next pull does not re-derive it

`src/render.ts` now declares `GlyphMode` and the orientation type on `main`. **`ABC-015` was blocked
on exactly that and its `blocked-until: ABC-014` is now discharged** — the build dependency is gone,
which is what kept it in `Backlog` under this board's "no unbuilt dependency" test. **Promoting it is
BA/PM's call, not this role's**, and it is named here rather than taken.

The `ABC-014 → ABC-015 → ABC-018` chain is unchanged and still acyclic. `RISK-005`'s sequencing
constraint binds at `ABC-018`, not here — merging this ticket did not put a hardcoded glyph mode in
front of any player, exactly as BA/PM's 2026-08-04 untying predicted.

## Two items open, owned, and NOT closed by this merge

1. **The self-healing snapshot net.** `npm test` is `vitest run` with no `--ci`, no `vitest.config.*`
   exists, and this project has no CI — so a missing snapshot cannot fail the gate. The 24 snapshots
   `ABC-014` hands to `ABC-016`/`017`/`018` are a net with a hole. **Routed to the AGENTS.md Scribe**
   (note `20260807T113000Z-orchestrator-decision-8f5a2b60`); the remedy is deliberately not
   pre-decided here. **This does not retro-weaken `ABC-014`** — its correctness evidence is 34
   mutate-and-restore cycles and an independent FEN-text oracle, none of which rests on snapshots.
2. **`ABC-012`'s ticket frontmatter is a column behind the board** (note
   `20260806T090500Z-orchestrator-observation-6d02ae91`). Still open, still the board sweep's.

Four accepted risks from the Security/NFR gate travel with their named owners (`ABC-018`,
`ABC-015`/`EPIC-006`, `EPIC-004`) and are not re-listed here — they are in that role's notes.

## Next action

**BA/PM decides whether `ABC-015` is promoted `Backlog` → `Ready` now that its build dependency is
discharged.** Ahead of it on the standing pull order sit `ABC-009` (S, P1) and `ABC-022` (S, P1),
the two rules-core defects, which the owner's legality-first directive ranks above renderer work
inside one priority. `Ready` is 3/8 and `In Development` is 0/3 — the board is open.
