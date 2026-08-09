---
id: 20260809T101516Z-orchestrator-decision-42e28329
kind: decision
by: orchestrator
at: 2026-08-09T10:15:16Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-018
  - ABC-018
  - ABC-016
  - ABC-017
  - ABC-019
  - EPIC-002
  - EPIC-003
  - EPIC-006
  - NFR-002
  - src/frame.ts
  - plans/board.md
supersedes: 
---

# `ABC-018` MERGED to `main` and CLOSED — `Ready for UAT → Done`

## The merge

Fast-forward `7e0923c` → `364928b`, **5 commits, no merge commit.** Both preconditions were verified
**before** the merge rather than assumed: `git rev-list --count grugops/ticket-to-pr-ABC-018..main`
was **0** (nothing had diverged) and `git log --merges main..branch` was **empty**.
`git branch --no-merged main` is now empty — all eleven branches are contained in `main`.

Covered by the owner's standing directive of 2026-08-06, read at its authority
(`memory-bank/60-progress.md` § *Standing directive — the branching model, and who turns the merge
key*) rather than from `AGENTS.md`'s pointer to it. The directive's three limits were honored:
deploy is not included and was not attempted, the gate still binds and was run, and the authority
remains the owner's — this role exercised a delegated keystroke, not a right of its own.

**Unlike the previous two merges on this board, the host permission classifier did not deny this
one.** `ABC-014` and `ABC-015` were each blocked on the first attempt and each was returned to the
owner rather than worked around. Recorded because two data points had started to look like a rule,
and this is the counter-example: the block is environmental and intermittent, not a standing bar.

## Gates — run by this role on BOTH sides, neither inherited

Four agents worked this ticket and each reported its own gate run. **None of those figures is the
basis for this merge.** The `mandatory_gates` were re-run here on the branch tip before the merge and
again on `main` after it, which is the only check that catches a merge breaking something no branch
broke on its own.

| Gate | Branch tip `364928b` | `main` after `364928b` |
|---|---|---|
| `npm run lint` | exit **0** | exit **0** |
| `npm run typecheck` | exit **0** | exit **0** |
| `npm test` | exit **0** — **304/304 on 14 files** | exit **0** — **304/304 on 14 files** |
| `npm run build` | exit **0** | exit **0** |
| skip count (the `AGENTS.md` command) | **0** | **0** |

**`src/frame.ts` md5 `bb827f52fe537817e40020a29dfa0e6d` is IDENTICAL to the Engineer's first commit
`d88a1f0`** — checked on `main`, not taken from QE's or the gate's word. QE changed
`src/frame.test.ts` only (+148/−0) and Security/NFR changed no source at all. **Neither gate repaired
the module to make its own verdict come out green**, which is the specific failure this board checks
for on every merge.

## What merged

Two new files, no existing `src/` file touched: `src/frame.ts` (222 lines, 94 code — `assembleFrame`,
`beginFrameSession`, `frameHeight`) and `src/frame.test.ts`. Test count 277 → 304.

**`RISK-005`'s build obligation is discharged and was checked mechanically, not asserted:** the glyph
mode is a required parameter with no default, `frame.ts`'s only import is an erased
`import type { GlyphMode }`, and the only ambient-looking reads are of the **injected sink**. The
merge-order half of that constraint was already satisfied before this ticket started.

**`NFR-002`'s write half — the row the catalog carried as `UNKNOWN - verify` — is now measured.**
Re-derived independently at the gate: compute + write **0.0087–0.0088 ms against a 16 ms bar**, flat
across 40/120/300 plies, on Apple M3 / Node v24.12.0 / Darwin arm64. The gate's regular-file cell
reads ~11% higher than the Engineer's and **that discrepancy was stated rather than smoothed**.

## UAT — DEFERRED to `EPIC-006`, explicitly NOT passed

Same disposition as every ticket this project has shipped, and for the same verified reason: **zero
runtime importers and no CLI entry point**, so there is nothing a human can exercise. A UAT pass here
would be a fabrication. This is a deferral on the record, not a silent skip.

## Five accepted risks travel with this merge, each with a named owner

No required fix and no high-severity item — `security.block_on` is `high` and the two MEDIUMs do not
reach it. Two are worth naming here because they are product-shaped rather than code-shaped:

- **The message region cannot display the epic's own example rejection** (MEDIUM, owner **BA/PM** at
  `ABC-016`/`ABC-017`/`EPIC-003`). At the current `W = 18`, `"no piece on that square"` renders as
  `["", "(+1 more)"]` — the player is told something was withheld and never what. `W` is derived from
  the panels, and today's panels are fixed-height **stubs**, so the number will change when
  `ABC-016`/`ABC-017` land real content. That is the reason it is an accepted risk rather than a
  defect in this ticket, and also the reason it must not be forgotten when those tickets are built.
- **No bound on a supplied item's length** (MEDIUM, owner **BA/PM** at `EPIC-003`) — 400,000 chars
  consumes the entire 16 ms budget.

The other three (sanitizer placement, the unchecked `mode` union failing open, forced `--unicode` on
a non-UTF-8 terminal) are LOW and owned by `ABC-019` and `EPIC-006`.

## Open items this close-out records rather than discharges

1. **The prompt-row contract still has one side written down.** `ABC-018` reserves the frame's last
   row; `EPIC-003` types into it and `ABC-019` loops around it, and **neither has been amended**.
   Carried into them when `ABC-019` is refined and `EPIC-003` decomposed. Routed to BA/PM.
2. **Six mutants passed all twelve acceptance criteria** at QE — every one a gap in the *criteria*,
   not a defect in the code, and all six pinned by characterization tests. Two are worth BA/PM's
   attention: a TTY exactly **one** row short still redrawing in place (the criteria's only "too
   short" case is 13 rows short), and a region that goes **silently blank** when not one item fits.
3. **No criterion constructs an absent `isTTY`/`rows` sink** — Node's real pipe shape — for the third
   consecutive ticket. Routed to BA/PM.
4. **`W` is recomputed per frame** while `## Scope` calls it a session constant. Cannot fire today
   (zero importers, fixed-height stubs); the fix is an API change whose shape depends on unbuilt
   `ABC-016`/`ABC-017`. Pinned by a characterization test.
5. **`tools/grugops/test-skip-integrity.js` exited 2 — "cannot read the registry file" — on all three
   agent runs.** `quality.test_integrity` is `warn`, so it does not block, and **every role recorded
   it as an error rather than rounding it to a pass**. The checker has never run successfully in this
   project. Worth one ticket.
6. **`ABC-009` and `ABC-022` have now been displaced twice** by consecutive owner pull-order calls.
   Neither is cancelled or de-prioritised; both keep `P1` in `Ready`.

## Deploy

**Not attempted and not contemplated.** It is not in the standing grant,
`production_requires_human_confirmation` is `true`, and `ADR-0007` records there is nowhere to deploy.

## Next action

`EPIC-002`'s remaining work is `ABC-013` (`Ready`), `ABC-016`, `ABC-017`, `ABC-019` and `ABC-021`
(`Backlog`). The owner's legality-first directive puts `ABC-009` and `ABC-022` first absent another
pull-order call.
