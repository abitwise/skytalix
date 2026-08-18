---
id: 20260818T130000Z-architect-design-artifact-ref-what-this-hop-wrote-and-what-it-refused-b5e1f74c
kind: artifact-ref
by: architect-design
at: 2026-08-18T13:00:00Z
verified_by:
confidence: high
refs:
  - ADR-0012
  - ADR-0013
  - ADR-0009
  - ABC-078
  - ABC-095
  - ABC-043
supersedes:
---

# The exhaustive list of what this hop wrote, and what it refused to write

## Scope

Task `design-p0-chain-rulings-2026-08-18`, branch `grugops/design-p0-chain-rulings` off `main`
`3054ee0`. **Not merged.**

## Written

- **`memory-bank/50-decisions/ADR-0012-book-engine-composition-point.md`** — `proposed` → **`accepted`**.
  Only the `## Status` section changed: signature, the reason ratification was this role's, a
  falsifier table, clause 9's **discharge** (`ABC-103` merged; `productionModules()` computes at
  `src/cli.test.ts:51`), and re-measurements at `3054ee0` (23 production modules; `EngineSeam` at
  `src/turn-loop.ts:138`). **Clauses 1–9, Context, Alternatives, Consequences, Rollback are
  byte-unchanged.**
- **`memory-bank/50-decisions/ADR-0013-no-placeholder-opponent-ships-in-src.md`** — NEW, **`accepted`**,
  211 lines, ADR-template sections, seven clauses.
- **`memory-bank/50-decisions/ADR-0009-frame-row-constant-ownership.md`** — **one pointer block** under
  clause 9c, marked as re-opening no clause. **9c's own words are byte-unchanged.**
- **`memory-bank/00-index.md`** — the ADR census, which the brief made this hop's job: eleven → **thirteen**,
  `ADR-0001`–`ADR-0013`, next free id **`ADR-0014`**, measured by listing `50-decisions/`. The
  "whoever writes `ADR-0012`" sentence now names `ADR-0014`.
- **Three ticket `## Dependencies` sections** — `ABC-078`, `ABC-095`, `ABC-043` — each gaining a RULED
  block that points at the ADR. **Nothing else on any page.**
- The five notes in this folder, and the queue claim.

## Refused, each with its reason

- **`src/` — 0 files.** Instructed, and correct anyway: both rulings add zero production lines.
- **`plans/board.md` — not edited.** Column moves are the Orchestrator's, by instruction.
- **`plans/nfr-catalog.md` — not edited.** No target, bar, level or instrument moves. A row for a
  decision that measures nothing is the gold-plating that catalog refuses.
- **`plans/traceability.md` — not edited.** No ticket changed column and no code or test row moved.
- **DoR scores and `⚠️` cells on the three ticket pages — not touched.** BA/PM's pen; the stale
  `ABC-078` prose is flagged in the RULED bullet, not rewritten.
- **`src/turn-loop.ts:45-47`'s comment — not edited.** Accurate as written; `ADR-0013` adds nothing it
  must say, and it is production anyway.
- **`.grugops/test-skips.md`** — human-owned; read, never written.
- **No `kind: finding`, no `§14-gate#<id>` stamp, no `human:<name>` stamp** anywhere.
  `context.human_admission` is `off`.
- **No merge.**

## Risks

- **A workspace hazard the next hop should know about, reported and not fixed.** The repository's
  primary checkout `/Users/olgeroeselg/…/cli-chess-example` was on branch **`main`** with another
  agent's in-flight, untracked `src/engine.ts`, `src/move-input.ts`, `src/move-input.test.ts` present
  and the `ABC-078` queue claim staged in it. A `git checkout -b` in that directory switches HEAD for
  **every** agent working there. This hop did that once, **restored `main` immediately**, and moved to
  a dedicated `git worktree` — the pattern the repo's other `worktree-agent-*` checkouts already use.
  **Nothing of another agent's work was committed, reverted or staged by this hop.** The engineers
  building in the primary checkout are one `git commit` away from committing on `main`, which the
  branch guard forbids; that is the Orchestrator's to look at, not mine to fix.
- **Both ADRs are `accepted` by an agent, under the owner's 2026-08-03 delegation.** That is a
  hand-authored status line in git, not a stamp, and the owner may revoke it. Each ADR records what
  would falsify it so revocation has something to bite on.
