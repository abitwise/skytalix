---
id: 20260813T091000Z-orchestrator-artifact-ref-what-merged-what-gated-and-what-this-hop-wrote
kind: artifact-ref
by: orchestrator
at: 2026-08-13T09:10:00Z
verified_by:
confidence: high
refs:
  - ABC-021
  - ABC-026
  - ABC-031
  - ABC-036
  - EPIC-003
  - EPIC-006
  - plans/board.md
  - plans/traceability.md
supersedes:
---

# What merged, what the gates read, and what this hop wrote

## Three lanes merged to `main` by fast-forward — no merge commits, linear history

| Commit | Lane | Content |
|---|---|---|
| `69908cc` | BA/PM `refinement-post-abc030` | `EPIC-003` decomposed into `ABC-031`–`ABC-038`; 5 tickets re-verified; 2 epics amended; +8 trace rows |
| `9236f4e` | Architect `audit-architecture` | `30-architecture.md` rewritten as-built; `00-index.md` ADR count corrected; +NFR rows |
| `3215004` | Factory Coach `audit-delivery` | `plans/metrics.md` filled — nine frozen rows, none invented |

Rebased-then-fast-forwarded in order; each branch was independently gated **before** the merge and
`main` was gated **after**, as the safety rule requires. **Identical on all four readings:**

```
lint       0   (49 files, 2 pre-existing biome.json infos)
typecheck  0
build      0
tests      807 passed / 807, 28 test files
```

`PERFT_DEEP` **not run — a ruling, not an omission**: the combined `src/` diff of all three branches
against `main` is **empty** (verified per branch with `git diff --numstat main..<branch> -- src/`), so
nothing this hop merged can reach the rules core. Same reasoning `ABC-028`'s merge recorded.

**Nothing was pushed** (no remote exists) and **nothing was deployed.** Merge approval is not deploy
approval; `production_requires_human_confirmation` stays `true`.

## What this hop (`post-abc030-2026-08-13`) wrote

```
plans/board.md                     header replaced (short), Backlog rewritten in short form,
                                   Ready 0/8 -> 2/8, 16 Backlog rows, 2 Ready rows
plans/tickets/history/ABC-028-board-history.md          outgoing header appended VERBATIM (re-hashed)
plans/tickets/history/board-backlog-rows-2026-08-13.md  ten outgoing Backlog rows VERBATIM (re-hashed)
memory-bank/60-progress.md         legality-first amendment + "Standing rulings taken under
                                   delegation, 2026-08-13" (three rulings, three limits, not precedent)
plans/epics/EPIC-003-...md         acceptance criterion 4 amended (count binds, list reduced, pager refused)
plans/tickets/ABC-036-...md        the awaiting-a-human item CLOSED; DoR score deliberately NOT re-scored
plans/traceability.md              one stale row retired: `| pending | Move input and controls | EPIC-003 |`
                                   — the epic is decomposed and its nine tickets carry their own rows.
                                   EPIC-002's equivalent row was removed at its decomposition; precedent
                                   CHECKED (no `| pending | Terminal board and game loop |` row exists).
.grugops/context/post-abc030-2026-08-13/notes/   this note and the decision note
```

**Not written, deliberately:** `.grugops/test-skips.md` (ruling 2 — human-owned, kit forbids it in
three places); any file under `src/`; any `Done` ticket; any ADR; `plans/nfr-catalog.md`;
`plans/metrics.md` (the Coach's, merged as-is).

**The duplicate `ABC-028`/`ABC-029` trace rows were verified still present (32 `ABC-` rows for 30
tickets, duplicates at 203/205 and 204/206) and left untouched for the third hop running.** They need a
hop that can RECONCILE two histories — the stale row is not a prefix of the live one — and no hop has
been given that job. Recommended owner: BA/PM. **Recording it a third time without an owner and a date
is the pattern the delivery audit named; this is the last hop that should get away with it.**

## Open, owed, and named

- **`H2`** — the test-integrity registry. Owner: **a named human**. Content and wiring recorded in
  `60-progress.md`. Cost: minutes.
- **`H5`** — `ABC-026`'s lane total, owed past two merges, now `Ready` with `A1` written to discharge it.
  Owner: BA/PM with Architect/Design.
- **The duplicate trace rows** — owner: BA/PM. No date set.
- **The backward-move ordinal defect** — owner: Orchestrator. Needs a ticket; next free ID `ABC-039`.
- **UAT remains deferred to `EPIC-006` and is explicitly NOT passed**, 26 tickets deep. It is the
  obligation that grows silently, and the `EPIC-006` `P2 → P1` raise is the first move against it.
