---
id: 20260819T163000Z-ba-pm-decision-the-dor-re-scored-mid-hop-when-main-moved-e91c7d02
kind: decision
by: ba-pm
at: 2026-08-19T16:30:00Z
verified_by:
confidence: high
refs:
  - ABC-109
  - ABC-037
  - AGENTS.md
supersedes:
---

# `main` moved under this hop: `AGENTS.md` is now 29,749 ON `main`, and `ABC-109`'s DoR is
RE-SCORED 9/10 ⚠️x1 → 10/10

**This changes a fact the page rests on, so it is recorded rather than quietly folded in.**

## What happened, measured after the fact

I branched from `main` @ `14c34bd`, where `AGENTS.md` was **27,690**. While I was cutting the
ticket, the Orchestrator merged both outstanding branches into `main`:

```
3032622  Merge branch 'grugops/abc037-repair'          - ABC-037 the real prompt
c5dc3d2  Merge branch 'grugops/agents-md-input-deep'   - the Scribe take back its file
```

**Re-measured on `main` after the merges: `git cat-file -s main:AGENTS.md` = 29,749.** So the
worst-case tree the ticket was written against is no longer a projection — **it is `main`.**
Headroom on `main` today: **3,019 bytes, 9.2%, 2.6 edits at the measured mean.**

**The irony is a load-bearing data point and the page carries it: `AGENTS.md` grew +2,059 bytes
during the single hop that cut a ticket about its size.** That is why `A1` now orders the base
**re-measured at pull time** instead of quoted from the page, and why test note 2 says so in its own
words.

## The re-score, and why it is a discharge and not a softening

`ABC-109` was scored **9/10 with a ⚠️ on item 5**: two unmerged branches carried +2,059 bytes of
this file and both touched `### Test`, so a restructure of that section risked a conflict in the
densest region of the file. **That fact is now false — both are merged and I re-measured the result
rather than inferring it — so the ⚠️ is DISCHARGED BY MEASUREMENT and the page reads 10/10, 0 ⚠️.**

**The first score and the reason it moved are both kept on the page**, in the ticket, on the board
row and in the trace row. A DoR that silently becomes 10/10 teaches the next reader nothing, and
this repo has a recorded habit of pages that were re-scored where the arithmetic was visible.

**Nothing else moved.** The problem, the owner, the fences, the guard ruling, the size and the
priority are unchanged — the ⚠️ was never about any of them.

## And one thing that did NOT get better with the merge

**The `plans/traceability.md` entry the Scribe's `8466bef` owes is STILL ABSENT on `main` after
`c5dc3d2`** — I checked the merged file rather than assuming the merge carried it. **The obligation
did not disappear when the branch landed; it just stopped being visible on a branch.** It is
recorded on the trace header I wrote at this hop, with both available shapes named (a legend entry,
per the 2026-08-17 precedent; or an append to `ABC-037`'s Status cell, since this amendment is
ticket-adjacent). **I did not fill it in** — it is the integrator's row and guessing at another
hop's trace is how a trail stops being evidence.
