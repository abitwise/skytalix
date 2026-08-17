---
id: 20260817T210000Z-orchestrator-observation-no-qe-verdict-exists-for-abc067-or-abc071-so-no-backward-move-is-justified-7d2e1b04
kind: observation
by: orchestrator
at: 2026-08-17T21:00:00Z
verified_by:
confidence: high
refs:
  - ABC-067
  - ABC-071
  - ABC-105
  - plans/board.md
  - plans/tickets/ABC-067-dev-run-slot-guard-window-has-no-upper-bound.md
  - plans/tickets/ABC-071-dev-run-slot-guard-has-no-start-anchor.md
  - .grugops/context/slot-guard-anchor-2026-08-16/notes/
  - .grugops/context/cut-qe-detector-2026-08-17/notes/20260817T200330Z-ba-pm-observation-a-history-sweep-does-not-flag-five-it-flags-nine-to-twenty-a1c47e02.md
supersedes:
---

# The request assumed a QE verdict. There is none — QE never ran on either ticket.

The request was: analyse `ABC-067`/`ABC-071`, and **if QE found things that need fixing**, move them
back. **The conditional is not satisfied, and the reason is not that QE passed them.**

## State, measured

Both sit in `## Done` on `plans/board.md`, `status: done` / `column: Done` in front matter, delivered
in **one commit**, `82133dd` (2026-08-16). `git diff --name-only 82133dd~1 82133dd` returns exactly
**`src/cli.test.ts`** — one path, zero production lines. Gates were green on the branch tip and
re-run on `main`. The owner waived UAT for these two by name (`"merge them without UAT, no
user-facing change"`), a ruling recorded as scope-not-rigour and deliberately **not** filed as
standing.

## The gap

`grep -rl "qe-e2e" .grugops/context/` returns **no note naming `ABC-067` or `ABC-071`**. This
matches BA/PM's independent sweep at the `ABC-105` cut, which parsed all 1288 notes (223 `by:
qe-e2e`) against the 38 `Done` rows and flagged **9**, not five — the five the owner declined to
re-QE, **plus `ABC-067`, `ABC-071`, `ABC-008`, `ABC-001`**.

**All eleven criteria (`ABC-067` `A1`–`A6`, `ABC-071` `A1`–`A5`) are verdicted `MET` by the
software-engineer's own `claim` note, with measurements attached and mutants `M1`–`M5` named.** That
is a self-assessment. **No independent role reviewed it.** The exposure is stated plainly rather
than glossed: a test-only diff of five mutants and a rewritten locator went to `Done` on the pen
that wrote it.

## Why no ticket moves on this record

A backward move (`Done` → `In Review`) must cite a defect. **There is no defect to cite** — there is
an **absent verdict**, which is a different thing and must not be written up as the first. Moving
either ticket now would put a manufactured QE outcome into git, which is the exact cry-wolf failure
`ABC-105` was cut to avoid.

## The one open decision, and it is the owner's

The 2026-08-17 QE directive is **forward-only** by his word, and his decline of a retro pass named
**five** tickets. `ABC-067` and `ABC-071` were **never put to him** — they closed the day before the
directive and fall in an unruled gap: same observable state as the five, no ruling covering them.
Whether to run a retroactive `qe-e2e` hop over these two is therefore his call, not an inference
from either existing ruling. **Not decided here.**
