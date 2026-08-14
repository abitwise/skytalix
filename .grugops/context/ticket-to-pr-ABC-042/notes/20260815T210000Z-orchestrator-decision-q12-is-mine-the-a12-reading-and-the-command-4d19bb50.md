---
id: 20260815T210000Z-orchestrator-decision-q12-is-mine-the-a12-reading-and-the-command-4d19bb50
kind: decision
by: orchestrator
at: 2026-08-15T21:00:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - Q12
  - A12
  - Q13
supersedes: 
---

# `Q12` is mine, and QE is right: the human turning the key runs the branch diff

## What QE found
`A12` says *"Given the delivered diff, then `git diff --name-only` shows exactly: the entry point, the
resolver, their test file(s), `package.json`, `AGENTS.md` and `src/history-pane.nfr.test.ts` — and
nothing else."*

**Measured on the current line:** the branch diff against `main` shows **eight** paths — those six,
**plus `memory-bank/50-decisions/ADR-0011…` and `plans/tickets/ABC-042…`.**

**Those two extra paths are there because I put them there.** I created
`grugops/abc042-integrated` and merged Architect/Design's ADR amendment and BA/PM's ticket repair
into the ticket line. Neither hop did anything wrong; the line's shape is my scheduling decision.

## The ruling
**`A12` is MET, on the reading the build hop established and I verified twice: "the delivered diff"
is the delivered change**, isolated in commit `e140355`, whose file list is **exactly the six**.
The ADR amendment and the ticket-page repair are **process artifacts of this ticket's refinement**,
not part of what it delivers. So is every note under `.grugops/`.

**This is the same reading `A9` already required and Security/NFR already ruled** — *"the delivered
diff" means production modules* — applied to the file-list clause instead of the module clause. It is
not a new reading invented to make this pass.

## The command, written down so nobody has to reconstruct it
A human checking `A12` should run **this**, not a branch diff:

```
git diff --name-only e140355~1 e140355
```

Expected, exactly and in any order: `src/cli.ts`, `src/cli-options.ts`, `src/cli.test.ts`,
`package.json`, `AGENTS.md`, `src/history-pane.nfr.test.ts`.

**The instrument-repair commits are a separate, honest question** and should be reviewed as such:
`git diff --name-only e140355 <tip> -- src/` shows `src/cli.test.ts` alone across the `q1q2fix` and
`b1` hops, with all production blob SHAs unmoved — which every hop measured independently.

## What I am NOT doing
- **Not rewriting `A12`.** Criteria are BA/PM's, and this ticket has twice refused to let a
  non-owner re-word one. **The wording genuinely would be better if it said WHICH diff** — that is a
  BA/PM item, queued with `Q5`/`Q8`/`Q11`, not taken here.
- **Not restructuring the branches to hide it.** Rebasing the ADR and ticket page out of the ticket
  line to make a diff look clean would be cosmetics, and the artifacts belong to this work.
- **Not grading it away.** QE called it LOW and owned by me; both are right.

## `Q13`, confirmed and worse than LOW in my reading
`AGENTS.md` now contradicts **itself**: § Commands line 62 says `Dev / run: npm run chess`
(`A1` required exactly that, and it was run); § Deployment posture line 184 still says *"There is also
no CLI entry point yet, which is why `Dev / run` above is `UNKNOWN - verify` and stays that way."*

**Both cannot be true, and `A1`'s row is structurally blind to it** — it asserts the command line, not
the prose two sections down. **This is the substrate every agent on this project reads first**, and a
self-contradicting `AGENTS.md` is the kind of defect that gets absorbed as background noise and then
cited by a future hop as licence. QE graded it LOW; I am routing it as **the thing to fix before this
ticket merges**, not because the severity is wrong but because the cost is minutes and the decay is
permanent.

**Owner: AGENTS.md Scribe** (`AGENTS.md -> AGENTS.md Scribe` in the routing matrix), not the engineer
and not BA/PM. The nuance it must not flatten: **the CLI entry point now exists; PACKAGING AND
DISTRIBUTION remain undecided and reserved to `EPIC-006` by `ADR-0007`.** Only the first of those
changed.
