---
id: 20260814T172802Z-architect-design-observation-measured-builds-25e62963
kind: observation
by: architect-design
at: 2026-08-14T17:28:02Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - A3
  - A10
  - ADR-0011
  - R2
  - R3
  - src/history-pane.nfr.test.ts
supersedes: 
---

# The three builds behind rulings 2 and 3, run rather than reasoned — and the perverse incentive they expose

> **Neutral `observation`: the evidence, so the two `decision` notes carry numbers rather than
> argument.** No `finding` kind is admissible here.

## Protocol

`src/` was copied to a scratchpad directory outside the repository. The instrument was transcribed
**verbatim** from `src/history-pane.nfr.test.ts:163-164` (`productionModulesIn`), `:213`
(`LICENSED_DRIVERS`) and `:316-329` (the equality), and run under `node`. **No file in any repository
worktree was written, and nothing under `src/` was opened for writing.** Baseline reproduces the
merged green, which is what makes the other two rows worth reading.

## The builds

| build | shape | `production` | `runtimeImporters` | licence guard |
|---|---|---|---|---|
| **BASE** | HEAD, `eefc217` | **18** | `["turn-loop.ts"]` | **green** — reproduces merged |
| **`W042`** | `ABC-042` delivered shape: entry point flat in `src/`, zero exports, `import { newGame } from "./history.ts";` + exported pure resolver | **20** | `["cli.ts","turn-loop.ts"]` | **RED** — `expected [ 'turn-loop.ts' ] to deeply equal [ 'cli.ts', 'turn-loop.ts' ]` |
| **`WSUBDIR-042`** | the build `A3` forbids: entry point at `src/cli/main.ts`, `import { newGame } from "../history.ts";`, licence UNCHANGED | **19** | `["turn-loop.ts"]` | **green** |

Two controls, both run:

- **The licence's over-listing bound reproduces exactly as `R2` measured it.** `["turn-loop.ts",
  "cli.ts"]` on **BASE**, where no `cli.ts` exists, is **green** — a dead entry is silent and
  unbounded. On `W042` the same licence is **green** and correct. So the licence is tight in the
  direction that matters (a name whose file exists cannot be quietly added or omitted) and blind only
  to names that name nothing.
- **The depth-fixed specifier, isolated from the enumeration.** The widened expression against
  `import { newGame } from "./history.ts";` → **true**; against `"../history.ts"` → **false**.
  Confirms the ADR's *"two changes, not one flag"*: making `readdirSync` recursive would surface
  `main.ts` into `production` and the pattern would still not match it.

## The perverse incentive, stated plainly because it is the risk that actually ships

**On this tree the build `A3` REQUIRES goes RED, and the build `A3` FORBIDS goes GREEN.**

An engineer who lands the entry point flat (correct) watches `src/history-pane.nfr.test.ts` fail and
has no row on the page telling them why — the ticket never mentions clause 3, the licence, or that
file. The nearest thing to guidance is `A10`'s *"`src/` otherwise byte-identical"*, which tells them
**not** to fix it. Moving the file to `src/cli/main.ts` makes the red disappear and passes ten of the
eleven criteria.

**`A3` is the only thing standing between that engineer and the wrong placement**, and `A3` is one
sentence with a parenthetical, on a ticket sized `M`. That is a thin guard for a failure mode the
suite actively rewards. Two cheap mitigations, both BA/PM's: say the licence edit is expected (so the
red is anticipated rather than diagnosed under pressure), and keep `A3`'s warning where it is.

## What did NOT go wrong, checked so it is not re-derived

- **`R1` (clause 2's declared frame path fails open) did NOT fail open at `ABC-041`.**
  `FRAME_PRODUCERS` (`src/history-pane.nfr.test.ts:187-194`) contains **six** entries and
  `render-seam.ts` is among them; `src/render-seam.ts`'s own header states it is declared there. The
  trigger fired and was honoured.
- **`ABC-042` does not fire `R1` either**, and **does not discharge its `EPIC-006` expiry.** The
  expiry's premise — *"the composition becomes an import and the frame path becomes a real closure"*
  — is refuted by clause 4 on this shape: the entry point exports nothing, so it can never be a probe
  root and `closure(<assembly module>)` cannot be rooted at it. The importable assembly module is
  `render-seam.ts`, already declared. **Nobody deletes clause 2's declaration on this hop thinking
  `EPIC-006` arrived.** Owner unchanged: Architect/Design.
