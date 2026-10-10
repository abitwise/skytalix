---
id: 20261010T140110Z-agents-md-scribe-decision-agents-md-headroom-proposal-a023cfcd
kind: decision
by: agents-md-scribe
at: 2026-10-10T14:01:11Z
verified_by:
confidence: medium
refs:
  - ABC-109
  - ABC-087
  - AGENTS.md
  - memory-bank/90-agents-md-command-log.md
supersedes:
---

# `AGENTS.md` headroom: where the next ~1 KB comes from (PROPOSAL; apply only after `ABC-087` merges)

Hand-authored. A proposal: **no `AGENTS.md` edit was made.** Per the brief the baseline for the arithmetic is the
`ABC-087` branch's `AGENTS.md` (`git show grugops/ABC-087-difficulty-levels:AGENTS.md`, **24,162 B**; the wave
is 24,433 B; cap 24,576 B, `ABC-109`). After `ABC-087` merges the headroom is 414 B, and the next lane line
(`ABC-119`'s was 385 B) would use all but ~30 B of it.

## Method

Per-section and per-comment byte counts on the `ABC-087` text, then each candidate cut APPLIED to a scratch copy
(not the repo) and measured with `wc -c`. Test guards that read `AGENTS.md` (`src/cli.test.ts`: `Dev / run` slot
`ABC-065`/`067`/`071`, runnability `ABC-059`, byte cap `ABC-109` `A5`) were run against all five cuts together on a
detached throwaway checkout of the `ABC-087` branch with the edited file: **66 passed**, 22,769 B. The throwaway
checkout is removed. None of the five cuts is in or near the `Dev / run` slot.

## Ranked proposal (savings are measured on the `ABC-087` text, cumulative at the right)

| rank | cut | saves | cumulative | why it is safe | risk |
|---|---|---|---|---|---|
| 1 | Delete the "Drafted by BA/PM at `home-the-gaps-2026-08-13`…" paragraph under § Role / workflow files (the story of who drafted the no-`finding` blockquote and why; the blockquote above it carries the rule) | 350 B | 350 | Provenance, not behaviour: the instruction ("do not re-derive this") is in the blockquote. The history lives in the `home-the-gaps-2026-08-13` notes | Nil. The one load-bearing sentence ("restoring the sanctioned writer is an install-level fix, escalated to the owner") is worth keeping if the Orchestrator wants it: fold it into the blockquote as one clause (~110 B) and the saving is ~240 B |
| 2 | Delete the "> **Kit vs state invariant:**" blockquote at the end of § Kit vs state (it restates the four bullets directly above it, near-verbatim) | 309 B | 659 | A duplicate within one section; every adapter file already carries the same invariant banner | Low. The rule stays in the bullets, which are the clear-voice copy |
| 3 | Safety-rules "Deploy is allowed, and there is nothing to deploy" bullet (622 B) -> one-line pointer to § Deployment posture, keeping `production_requires_human_confirmation` stays `true` | 460 B | 1,119 | § Deployment posture ("Who holds the deploy key changed…", "Nothing here relaxes anything") already carries every clause, in the owner's words | MEDIUM: it is the owner's 2026-08-15 sentence, and Safety rules is the section a hurried agent reads. Keep the two-clause headline ("allowed, and nothing to deploy") and the `true` flag in the bullet so the misreadings stay refused. If the Orchestrator would rather not touch owner-worded text, drop this row: ranks 1, 2, 4, 5 total **933 B** |
| 4 | Skip-count capture comment: drop the jest / pytest / go example commands (kept: vitest, the "never a silent 0" rule) | 177 B | 1,296 | The three examples are for runners this repo does not use; the command log § Skip-count capture holds them verbatim | Nil. Note the `Dev / run` runnability guard reads spans from "Dev / run" only; this comment is far from it |
| 5 | Coverage comment: drop the TRAP prose (`src/cli.ts` is spawned, v8 does not cross a process boundary), keep the verdict and a pointer: "TRAP and figures: command log § Coverage" | 97 B | 1,393 | The log § Coverage holds the trap in full | Low: a trap is the kind of fact worth keeping inline; the pointer names it ("TRAP") so a reader knows to look |

**Recommendation: apply ranks 1-3 (1,119 B -> 23,043 B, 1,533 B headroom) as ONE Scribe edit after `ABC-087`
merges; hold ranks 4-5 (177 B + 97 B) in reserve for the next lane line.** If rank 3 is declined, ranks 1, 2, 4, 5
give 933 B (23,229 B, 1,347 B headroom), still above the ~1 KB asked.

Also in that same edit, at 0 B: correct the two stale receipts (see the sibling observation): `Test (all)` -> 51
files / 1584 tests, and `ENGINE_DEEP` -> 46 passed (33 default) — re-measure at the post-merge tip first, since
`ABC-087` itself adds a test file and its own branch already says 52 / 1603. And its `Levels deep lane` line (202 s,
28 passed) needs its entry in the log.

## Considered and NOT proposed

- **§ Deployment posture, § Test and UAT authority, § QE validation authority, § Branching model** (~7.0 KB
  together): owner rulings with their dates and the "kit override" count. They are pointers to `memory-bank/60-progress.md`
  already; shortening them is a rewrite of the owner's words, which is not a Scribe call. Largest honest source if the
  cap ever needs another KB: ask the owner.
- **§ Coding rules (the 12)** (1,804 B): the canonical verbatim copy; cutting it is drift. **§ Mission** (385 B):
  `§17.1` shape.
- **The `PUZZLE_DEEP` comment** (914 B) and the `Dev / run` comment (947 B): the trigger list and the baseline rule are
  the owner's, and the `Dev / run` WRITING RULES are what `ABC-069` exists to keep visible. A small saving (~90 B for
  the "`PUZZLE_DEEP=weakened` exits 1 by design" sentence) is available but the sentence prevents a wrong "it failed" read.
- **Raising the cap**: `ABC-109` set 24,576 B as three quarters of the inherited 32,768 B; the owner owns it, and
  trimming is cheaper than moving a number a guard enforces.

## Order of operations

1. `ABC-087` merges (it carries its own 24,433 -> 24,162 B trim).
2. Scribe, one commit, `AGENTS.md` + the log: ranks 1-3 and the two count corrections; re-run `npm test` (the
   `ABC-109` `A5` byte row and the `Dev / run` guards are in it) and `wc -c AGENTS.md`.
3. If a later lane line lands first, re-measure before cutting: the byte figures above are against the `ABC-087` text.
