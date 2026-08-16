---
id: 20260816T092000Z-uat-planner-observation-six-mutants-run-by-the-uat-hand-in-an-isolated-worktree-e60a1b93
kind: observation
by: uat-planner
at: 2026-08-16T09:20:00Z
verified_by: 
confidence: high
refs:
  - ABC-065
  - AGENTS.md
  - src/cli.test.ts
  - src/cli-options.ts
  - ABC-067
supersedes: 
---

# `S7`/`S8` conducted — six mutants by a fourth hand, in an isolated worktree

**Why I re-falsified something QE already falsified with eighteen mutants.** UAT's question is not
QE's. QE asks *is the guard live*; UAT asks *will the reader's page still be true in six months*, and
that is answered only by breaking the page the way a **real editor** would break it and watching
something object. Six mutants, chosen for that: four are edits a Scribe could plausibly make, one is
the drift `EPIC-006` will cause from the code side, and one is the known weakness I wanted to confirm
with my own hands rather than cite.

**Isolation, because two hops share this tree.** Every mutation was applied in a **linked git
worktree** (`git worktree add --detach … HEAD`) with `node_modules` symlinked from the shared tree —
never in the repository the concurrent `ABC-066` UAT is reading. `git status --porcelain` in the
worktree after each revert: **empty**; the worktree was removed at the end; the shared tree's
`git status --porcelain` is unchanged from the state I found it in. **`G5` did not bite.**

Baseline in that worktree before any mutation: `src/cli.test.ts` **32 passed / 32**.

| # | mutant — the honest editing mistake it models | result | what the failure SAID |
|---|---|---|---|
| `U1` | **A documented option that does not exist.** Add `` `--difficulty` `` to the slot's option list. | **RED** — 1 failed / 31 passed | `expected [ '--ascii', '--colour', …(2) ] to deeply equal [ '--ascii', '--colour', '--unicode' ]` |
| `U2` | **An option dropped from the page.** Delete `` `--unicode` `` from the slot. | **RED** — 1 failed / 31 passed | `documented options ["--colour","--ascii"]: expected 2 to be greater than or equal to 3` |
| `U3` | **The separator example tidied away** — the exact thing the slot's comment begs a later hop not to do. Rewrite `` `npm run chess -- --colour black` `` back to `` `npm run chess` ``. | **RED** — 1 failed / 31 passed | ``the separator form in the `Dev / run` slot: expected '- Dev / run: `npm run chess` <!-- ver…' to contain 'npm run chess -- '`` |
| `U4` | **The drift that will actually happen.** Add `"--depth"` to `ACCEPTED_ARGUMENTS` in `src/cli-options.ts` and document it nowhere. | **RED — 3 failed / 29 passed**, on three independent rows | set equality **both ways** plus `documented options [...]: expected 3 to be greater than or equal to 4` |
| `U5` | **A documented invocation that does not run.** Change the example to `npm run chess -- --colour purple`. | **RED** — 1 failed / 31 passed | `documented token purple: expected [ '--ascii', '--unicode', …(4) ] to include 'purple'` |
| `U6` | **The slot's HTML comment left unterminated** (QE `Q8`, ticketed `ABC-067`). Delete the trailing `-->`. | **GREEN — 32 passed / 32** | *nothing* |

Every mutant was reverted with `git checkout --` and the worktree confirmed clean before the next.

## What this buys the person signing

**Five of the six are red, and each failure message names the offending token.** That is the property
UAT cares about: the Future Editor who breaks this page is told *what* he broke, in one line, without
having to understand the guard. `U3` is the one I most wanted red — the slot's comment asks a later hop
not to tidy the example away, and now **the suite enforces the request instead of pleading for it**.

**`U5` is worth its own sentence.** A documented option that is spelled right but whose *value* is not
real is caught too — the guard does not just compare flag names, it checks the value words in the
example against what the resolver accepts. The page cannot advertise a command that would be refused.

**`U4` is the one that matters over time.** The page-side mistakes (`U1`–`U3`, `U5`) need someone to
edit `AGENTS.md`, and people are careful there. The code-side drift needs nobody to touch `AGENTS.md`
at all: add an option, ship it, and the page is silently wrong. **That is the failure `EPIC-006` will
produce, and it reds on three separate rows.**

## `U6` — the known limitation, confirmed rather than cited

**I reproduced `Q8` with my own hands and it ships green.** An unterminated comment in the slot leaves
the suite at 32/32. The block's own comment claims *"a guard must never pass by being unable to look …
or one whose comment never closes"* — the never-closes half is not protected: the search for `-->`
finds the next one anywhere later in the file, so the scored region silently **grows** instead of
coming back empty, and it stays green only because none of the swallowed text happens to contain a
`--`-prefixed token.

**I did not repair it.** It is `ABC-067`, already cut, `XS`/`P2`, and that ticket's own board row says
it must be built **after this UAT** — which is now conducted. **This is a limitation of the guard, not
a defect in what the reader meets:** for `U6` to hurt anyone, the page would have to be malformed *and*
the option list wrong at the same time, and the malformed page is itself visible to a human reading it.
It belongs on the signature's known-limitations list (`C6`), not in front of it.
