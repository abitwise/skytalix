---
id: 20260817T144200Z-ba-pm-artifact-ref-what-this-hop-produced-and-what-it-deliberately-did-not-9e3a41b6
kind: artifact-ref
by: ba-pm
at: 2026-08-17T14:42:00Z
verified_by:
confidence: high
refs:
  - 20260817T143212Z-ba-pm-decision-the-three-counting-rules-i-adopted-before-counting-anything-4a1c9e70
  - 20260817T143430Z-ba-pm-observation-rule-1s-control-computed-the-three-series-and-the-arm-that-has-no-observations-8c2d6f14
  - 20260817T143700Z-ba-pm-decision-no-ticket-is-cut-the-candidate-fix-priced-and-declined-with-its-warrant-conditions-6b3f0a91
  - 20260817T144000Z-ba-pm-observation-the-clock-warning-is-right-about-the-notes-and-overstated-about-the-queue-file-2f5b71c8
supersedes:
---

# What this hop produced, and every file it deliberately did not touch

## Branch

`grugops/rule1-control-measurement`, branched from `main` @ `1bd903e`.

**Base deviation, flagged rather than absorbed:** the brief names `base: main @ 9d5ad66`. `main` had
already moved to `1bd903e` — the brief's own enqueue commit — before this hop began.
`git diff --name-only 9d5ad66 1bd903e` touches only `.grugops/queue/pending/rule1-control-measurement.md`,
so no evidence this hop read differs between the two bases. Branched from `1bd903e` and recording
the resolution rather than silently picking, per this project's `ABC-061` precedent.

## Produced — four notes, in this directory, and nothing else

| note | what it carries |
|---|---|
| `…-decision-the-three-counting-rules…` | Definitions **E**, **Q**, **B**, fixed before counting; the 5:1 unit instability in the record; what I refused to define ("consecutive") |
| `…-observation-rule-1s-control-computed…` | The **three series**, the **INDETERMINATE** verdict, and the disjoint-populations finding |
| `…-decision-no-ticket-is-cut…` | **Step 2: nothing cut.** Coverage 2-of-4, the measured price, the four warrant conditions, what to measure next |
| `…-observation-the-clock-warning…` | `date -u` discipline; the warning confirmed on the notes and **corrected** on the queue file |

**No ticket page was created.** `plans/tickets/` is untouched.

## NOT touched — checked, not asserted

`git status --short` on this branch shows **only** the four notes above and the claim directory.

- **`AGENTS.md`** — the Scribe's pen. Rule 1's control is mis-specified on this hop's evidence and
  **the wording was still not edited.**
- **`plans/board.md`**, **`plans/traceability.md`** — the Orchestrator's, fenced by the brief.
- **`plans/metrics.md`** — **NOT edited, and this is the one I want on the record.** Its
  `Rework rate` row carries the pre-rule-1 baseline this hop's series 3 is measured against, and it
  has a live post-rule-1 figure available (`0 moves / 9 tickets`). Writing it is the Factory Coach's
  or the sweep's, at a Workflow 11 trigger, and this is neither. **The number is in the observation
  note; whoever owns that row can take it from there.**
- **`src/`**, **`.grugops/factory.config.json`** — fenced by the brief; zero bytes changed.
- **`agent-factory/…`** — read-only KIT. Read `contracts/context-note.md` and
  `workflows/16-context-read-write.md`; wrote nothing.

## Method artifacts, none of them committed

The candidate fix was priced by running it, not by estimating it. A throwaway worktree was created
at `/tmp/rule1-price` (detached at `1bd903e`, `node_modules` symlinked), used for one timed
single-file run, then **removed**; `git worktree list` and `git status --short` were both re-read
afterwards to confirm the repository was clean. Nothing from it is in this branch.

Numbers, each measured at my own hand this hop and quoted in the decision note:
`git worktree add --detach` **0.24 s**; `npx vitest run src/cli.test.ts` **1.53 s** real / 2.46 s CPU,
42/42; `npm test` **2.43 s** real / **10.69 s** CPU, **869/869 on 30 files**.

## Claim

Taken by hand as the brief and `AGENTS.md` § "Role / workflow files" both require:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/rule1-control-measurement` — the bare `mkdir` is the atomic act and it
succeeded. **No `finding` is emitted**; `context.human_admission` is `off`, no `§14-gate#<id>` stamp
exists on this install, and none was invented. Everything here is `claim` / `observation` /
`decision` / `artifact-ref`, hand-authored.

## Not merged

`main` is untouched. **The Orchestrator holds the merge**, and it holds it on a hop whose conclusion
contradicts the hop's own dispatcher — which is the reason it should not be self-merged.
