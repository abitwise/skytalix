---
id: 20260811T084500Z-orchestrator-decision-4c1a9f02
kind: decision
by: orchestrator
at: 2026-08-11T08:45:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-019
  - ADR-0009
supersedes:
---

# Merge of `grugops/frame-merge-order-2026-08-11`, and `ABC-016` + `ABC-019` pulled into development concurrently

> **Hand-authored.** `scripts/context-io.ts` — the sanctioned writer named by Workflow 16 — does not
> exist in this repo or in the kit (it lives in a different project), and `mcp__grugops__propose_note`
> is not among this session's tools. The recorded precedent in this repo for the same gap is
> `.grugops/queue/done/refinement-ABC-019/claim.md`, which says so plainly rather than pretending.
> **Nothing here is a `finding`** — no verification stamp is issuable to me, so no note in this hop
> claims one.

## 1. The merge

`grugops/frame-merge-order-2026-08-11` → `main`, **fast-forward `54bff28` → `5c0f8f2`, 12 commits, no
merge commit**. Checked BEFORE the merge, not after: `git rev-list --count HEAD..main` = 0,
`git log --merges main..HEAD` empty, working tree clean. Re-verified after: `git log --merges` over
the merged range = 0. Branch deleted.

Authority is the owner's **standing** directive (`memory-bank/60-progress.md` § "Standing directive —
the branching model, and who turns the merge key", 2026-08-06), not a fresh instruction. Its three
limits were read and none was stretched: deploy is not included, the gate still binds, the authority
remains the owner's. **The host classifier did NOT deny the keystroke this time** — the five prior
denials in this project were each returned to the owner; this one did not arise.

Gates run on the branch tip **and again on `main`**, per the standing practice, both recorded:

| gate | branch tip | on `main` |
|---|---|---|
| lint | 0 | 0 |
| typecheck | 0 | 0 |
| build | 0 | 0 |
| unit | 676/676, 22 files | 676/676, 22 files |
| skip count | 0 | 0 |

The round's diff was **docs/state only** — `git diff main..HEAD -- src/` **empty**, `src/` 36-file
aggregate md5 `df71fb29…`, which independently matches the figure `ABC-019`'s own amendment block
records for the same tree. 43 files, +4987/−201, all under `.grugops/`, `plans/`, `memory-bank/`.

## 2. The pull — and why concurrency here is not a shortcut

`ABC-016` and `ABC-019`: `Ready for Dev` → `In Development`. WIP after the move: **In Development
2/3**, Ready for Dev 1/6 (`ABC-017` remains). Scheduling **width 2** against `queue.wip_limit` 3.
No limit is exceeded, so no written over-WIP reason is owed.

**Definition of Ready was re-run against `agent-factory/checklists/definition-of-ready.md` at the
pull, not inherited from the board row.** Both tickets: front matter agrees with column, all ten
items ✅, sizes `M` (3) and `L` (5) — **neither `XL`, no `SPLIT_REQUIRED`** — priorities `P1` and `P0`,
every hard dependency merged.

The owner directed the concurrency, but I did not rest it on that alone. It is legitimate on the
tickets' own text: **`ABC-019`'s DoR item 10 states the `ABC-016` → `ABC-017` → `ABC-019` constraint
is a MERGE order, not a start blocker.** Had the ticket said otherwise, the directive would have met
a stop condition and gone back to the owner.

**Merge order is unchanged and build order is not merge order.** `ABC-019` merges last and must be
**rebased onto both merged panels and re-gated before it merges** (`ADR-0009` cl. 9f). That is a
later hop, owned here, not delegated to the engineer building today.

## 3. The file boundary — the scheduling decision I actually own

Two engineers in one tree reproduce commit `2cd84cd` by construction: `git commit` takes the INDEX,
not the paths just `git add`-ed, and that swept ~640 lines of another role's in-flight work into one
commit. **Each engineer therefore gets its own `git worktree` and its own branch.** That is a control
on a recorded defect, not a preference.

The disjointness was **measured, not assumed**:

- `ABC-016` → `src/status-panel.*` (the ticket names `src/status-panel.nfr.test.ts` explicitly).
- `ABC-019` → `src/turn-loop.*`, **stubs inside its own test file**, because `ADR-0009` option **G**
  (a shared `src/panel-stubs.ts`) is **rejected** — so there is no third declaration site to collide on.
- **Neither may touch `src/frame.test.ts`**: `ADR-0009` cl. 5 assigns the composition fit-check to
  `ABC-017`, the ticket that merges second.

**The `src/turn-loop.*` names are mine, not the Architect's, and I am flagging that rather than
burying it.** `ABC-019` names no module file anywhere in its text. I pinned the name for collision
avoidance under concurrency — a scheduling concern — and told the engineer it may flag a substantive
objection instead of silently renaming. A rename later is cheap; a collision today is not.

## 4. One Orchestrator error this hop, caught by my own verify step

My first board edit used an unanchored `str.replace('## In Development (WIP 0/3)', …)`. The **first**
occurrence of that substring in `plans/board.md` is the **indented example inside the file's own
FORMAT comment block** (line 40), not the live column (line 116) — so the edit rewrote documentation
and left the live column untouched. Caught by re-reading the file rather than trusting the write,
reverted with `git checkout --`, and redone with exact line-equality anchoring plus assertions that
the anchor is unique.

**It is the same class as `2cd84cd`: a write whose target was assumed rather than pinned.** Recording
it because this project's record is that the Orchestrator's errors are worth more written down than
the successes — three were on the board last round.

## 5. What I did not do

- Did not deploy, and did not read merge approval as deploy approval. A human holds deploy.
- Did not touch `src/` — this hop's diff is docs/state only.
- Did not amend either ticket's acceptance criteria; engineers flag, BA/PM amends.
- Did not re-open `ADR-0009`.
