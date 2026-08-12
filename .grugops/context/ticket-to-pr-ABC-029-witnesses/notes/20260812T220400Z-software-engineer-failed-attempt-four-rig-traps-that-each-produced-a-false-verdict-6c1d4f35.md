---
id: 20260812T220400Z-software-engineer-failed-attempt-four-rig-traps-that-each-produced-a-false-verdict-6c1d4f35
kind: failed-attempt
by: software-engineer
at: 2026-08-12T22:04:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - A6.3
  - A6.4
  - NFR-008
  - ADR-0008
supersedes:
---

# Four measurement rigs on this hop produced a WRONG answer before they produced a right one — recorded so the next hop does not re-run them as evidence

> **`kind: failed-attempt`** — approaches that did not work, written down so nobody retries one. Soft
> kind, no stamp required, none claimed. **Not one of these reached a note or the ticket as a
> verdict**; each was caught by a control, and that is the only reason.

**The pattern in all four is the same and it is this ticket's own recurring lesson: every one failed
SILENTLY in the direction of a stronger claim.** BA/PM's `organizeImports` artefact is the fifth
instance of it on this stack; these are the sixth through ninth.

## 1. `biome` run from outside the rig — "the constructs are all rejected"

`biome check <abs-path-to-rig-file>` invoked from the scratchpad reported **every** build as failing,
including the unmutated control. `biome` resolves `biome.json` from the **working directory**, and
`files.includes` is `src/**/*.ts` relative to it, so it **processed zero files and exited 1**:
`× No files were processed in the specified paths.`

**Read as a verdict this says "none of the witness lines is a build this repo can hold" — the exact
opposite of the truth.** Caught by the unmutated control, which must pass. Fix: `cd` into the rig and
pass a relative path. **Re-run: all six type-only witnesses and all three re-export witnesses PASS.**

## 2. The mutation rig's search literal was double-escaped — "nothing kills the witnesses"

The kill rig swaps the landed expression for a wrong build by string replacement. Its search literal
was written in a shell single-quoted string as `\\s` / `\\b` / `\\.`, which is **two** characters
where the source has one, so **no occurrence was ever found**.

**Had the rig failed quietly it would have run seven unmutated trees and printed "nothing red" for
every wrong build — a perfect, entirely false, "the witnesses have no discriminating power" (or, read
the other way, "the guard survives everything").** It printed `LITERAL NOT FOUND — mutation aborted`
and exited instead, because the replacement step asserts the literal is present before writing.
**Keep that assertion in any future mutation rig on this file.**

## 3. `vitest` run from the wrong working directory — the lane measurement that never finished

The first `N8-LANE` rig invoked `./node_modules/.bin/vitest` **without `cd`-ing into the rig**, so
vitest took the scratchpad as its root and began discovering the test files of **every rig in it**
(four trees × 26 files, through symlinked `node_modules`). It produced **no output in 600 s** and was
killed.

**The failure mode worth recording is not the hang; it is that a rig which had completed would have
reported a lane delta computed over four unrelated trees.** Fix: `cd` into the rig for every timed
run. The corrected rig runs one tree, one fresh process per run.

## 4. The median helper counted a leading blank as a sample — halved every figure

`echo " 8980" | tr ' ' '\n' | sort -n` yields an empty first line that `sort -n` orders as `0`, so a
one-sample median came out as **4490** — exactly half. On the paired deltas the same bug would have
pulled every median toward zero, i.e. **toward "this change costs nothing"**.

Caught by running the rig at `n = 1` first, where the halving is obvious against the raw value. Fix:
`grep -v '^$'` before `sort -n`. **The `n = 1` dry run is cheap and it is the only reason the bug was
visible.**

## Not attempted, and why — recorded so it is not read as an omission

- **Making a witness that mutates a real `src/` file and re-runs the suite in-process.** It would
  witness the whole guard rather than the expression, but it writes a repository worktree from a test
  and is the opposite of what `ABC-029` permits. **Not built.**
- **Extracting the guard's regex into a shared constant.** Rejected on the ticket's own constraint —
  see the sibling `decision`. **Not built.**
- **Widening the lookahead to kill `Wtypespace` (`L3`).** Its only separating build is rejected by
  `biome check`, re-measured at this hop. **Not attempted; the limit is the ticket's.**
