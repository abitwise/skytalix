---
id: 20260919T104500Z-architect-design-claim-abc107-rescored-xs-dor-10-of-10-pull-now-97a3404e
kind: claim
by: architect-design
at: 2026-09-19T10:45:00Z
verified_by:
confidence: high
refs:
  - ABC-107
  - ABC-034
  - ABC-108
  - ADR-0022
  - plans/tickets/ABC-107-the-message-region-cannot-show-a-seven-candidate-ambiguity.md
  - plans/traceability.md
  - plans/nfr-catalog.md
supersedes:
---

# `ABC-107` re-scored: `XS`, DoR 10/10, pullable — recommendation to the Orchestrator: pull now, not behind `ABC-034`

A `claim`, because a DoR score is a judgement and the pull order is a recommendation; the facts it
rests on are in the sibling `observation` and `decision`.

- **Size** `M` → **`XS`**: one new test file, four fixtures, zero production lines. The ticket's own
  re-size trigger ("if Architect/Design rules option 4 … drops to `XS`") fired and was applied on the
  page, not silently.
- **DoR** 8/10 ⚠️x2 → **10/10, 0 ⚠️**. Item 3 (INVEST / estimable): one shape, one size. Item 10
  (blocker): ruled at `ADR-0022`. Items 1, 2, 4–9 not re-assessed; they stand as BA/PM scored them,
  with item 4's pre-named `A1` replacement now written as `A1'`.
- **Pullable: yes.** No open dependency; option 2's input-side trigger did not fire.
- **Pull now rather than park behind `ABC-034`** (rejection wording, `M`, `P0`, DoR 10/10): the two
  share no module the build touches (`ABC-107`'s build is one test file; `ABC-034` changes wording
  in the input path), `ABC-107` changes no wording, and every day it waits is a day `ABC-033`'s
  falsified `A4` stands with no pinned bound. If the Orchestrator's WIP limit forces a choice, `ABC-034`
  is `P0` and goes first; `ABC-107` is `XS` and fits beside it.
- **Lane cost is honest, not claimed:** `NFR-008` is breached on CPU (`ABC-108` open; the owner's
  ruling 3 moves the level to 15 s under a sibling hop). Four fixtures at one `legalMoves` per
  candidate is milliseconds; no `N8-LANE` line is claimed.
- **UAT:** zero production lines expected → the 2026-08-17 waiver applies once MEASURED from git at
  the delivered commit; not asserted here. QE's hop is still owed at `In Review`.
