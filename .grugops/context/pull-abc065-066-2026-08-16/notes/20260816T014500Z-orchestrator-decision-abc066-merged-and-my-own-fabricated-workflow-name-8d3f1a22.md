---
id: 20260816T014500Z-orchestrator-decision-abc066-merged-and-my-own-fabricated-workflow-name-8d3f1a22
kind: decision
by: orchestrator
at: 2026-08-16T01:45:00Z
verified_by: 
confidence: high
refs:
  - plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md
  - src/cli.ts
  - .grugops/context/security-nfr-ABC-066/notes/
  - .grugops/queue/pending/security-nfr-ABC-066.md
supersedes: 
---

# `ABC-066` merged, and `S4` is a fabrication of mine

## `S4` first, because it is my error and it is the worst kind

Security/NFR's `S4` says the subtask file I wrote carries
`workflow: agent-factory/workflows/07-security-nfr-review.md` and **that file does not exist**.
**Checked, confirmed: it does not.** `ls` on the kit's `workflows/` shows `07-backlog-refinement.md`;
there are 19 workflows and none is named `07-security-nfr-review.md`. **I invented a plausible
filename and shipped it in a work order.**

This is exactly the failure `AGENTS.md` § Commands forbids in its own domain — *"If a command is
unknown, ship `UNKNOWN - verify` — never fabricate"* — committed by the role that enforces it. I did
not read the kit's workflow list before writing the field; the name sounded right, so I wrote it.

**The right file is `agent-factory/workflows/15-security-audit.md`.** The agent recovered by working
from its role file plus `15`'s filter and severity map, and said so rather than pretending the
reference resolved. **That recovery is the only reason this cost nothing.** Correction: I check
filenames against the kit before writing them into a subtask, and any workflow field I cannot verify
gets `UNKNOWN - verify` rather than a guess.

Three of my own defects are now on this hop's record: a stale `base:` (twice), a schedule that was
right about files and wrong about the git index, and a fabricated workflow filename.

## The verdict and the merge

Security/NFR returned **`PASS_WITH_RISKS`, 0 HIGH**, so `security.block_on: high` does not block.
**It overturned the ticket's own clause-(b) analysis** — the ticket answers a *delta* ("no NEW
`process.` read") where the clause states a *state* predicate; **7 production files read `process.`,
`src/cli.ts` among them, so (b) FIRES.** It then cleared (b) on the merits: `src/cli.ts`'s capability
surface is byte-identical either side. **What saved the ticket was its fail-safe sentence, not its
reasoning** — and `S1` (MEDIUM, BA/PM) is precisely the risk that a later hop copies the paragraph
*without* that sentence.

It also declined to quote its own `N8-LANE` re-run: its null control showed systematic drift
(sign 0/8), which its own admission rule forbids, **so it reported the engineer's sound figure and
named its own as inadmissible.** A role refusing to quote its own measurement because the measurement
failed its own quality bar is the behaviour this factory exists to produce. The decisive instrument
was new: the added test costs **0.31 ms — 0.0005× the 650 ms bar**, which is *why* both paired runs
read as indistinguishable from zero.

## Merge, gated both ends, as the grant requires

The owner's standing grant is permission to merge work that PASSED — never to skip or soften a gate.

- **Gate on the branch tip `8fb6ff1` BEFORE:** lint 0 · typecheck 0 · **857/857 on 30 files** ·
  build 0 · skip 0 · `No findings.` (the tip had no `node_modules`; I symlinked the shared tree's
  rather than reinstalling, same `package-lock`, and say so instead of quietly making it work.)
- **Merged `--no-ff` at `aec9911`.**
- **Gate on `main` AFTER:** lint 0 · typecheck 0 · **857/857 on 30 files** · build 0 · skip 0 ·
  `No findings.`

**The rename/rename conflict landed exactly where I predicted it.** The branch carried
`claimed/ticket-to-pr-ABC-066/` while `main` had drained the same file to `done/`. Resolved as my
earlier note said it would be: **the drained state wins**, the reintroduced `claimed/` entry deleted.
Flagging it before it happened is why it took one command instead of an investigation.

## The check no gate performs — the owner's own transcript, replayed on `main`

```
$ npm run chess --colour black
unrecognised argument: black
usage: npm run chess -- [--colour white|black|random] [--ascii | --unicode]   # exit 1

$ npm run chess -- --colour black
exit 0, 27 stdout lines, 0 bytes on stderr
```

**The line now prints a command that works, and the user who does what it says gets a board.** The
first defect UAT ever caught in this repository is repaired end to end, not merely guarded.

## Security notes carried to `main`

The five `security-nfr-ABC-066` notes lived only on that branch. Restored by `git show` and each one
**`cmp`-verified byte-identical** to the branch copy, so the context is on `main` without merging a
branch whose only other content is a queue record. Same treatment QE's five got, same verification.
