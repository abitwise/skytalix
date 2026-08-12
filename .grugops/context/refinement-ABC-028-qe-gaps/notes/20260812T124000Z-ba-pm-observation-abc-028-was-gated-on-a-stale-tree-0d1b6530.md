---
id: 20260812T124000Z-ba-pm-observation-abc-028-was-gated-on-a-stale-tree-0d1b6530
kind: observation
by: ba-pm
at: 2026-08-12T12:40:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-029
  - src/history-pane.ts
  - src/history-pane.nfr.test.ts
  - src/history-pane.test.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# `ABC-028` was gated on a tree two commits behind this branch's tip — found by checking a fence instead of quoting it

> **Hand-authored.** `scripts/context-io.ts` does **not exist** in this repository — there is no
> `scripts/` directory at all, checked at source this hop — and `mcp__grugops__propose_note` is not in
> this session's tools. `context.human_admission` is `off` and **no `§14-gate` verdict record exists
> under this task**, so **nothing on this hop is a `finding`.** `confidence: high` refers to the
> measurements, every one of which was RUN. `scripts/claim.js` does not exist either: the Workflow 17
> step 2 claim was made by hand. There is no derived `index.md` / `index.jsonl` — the tool that renders
> them does not exist and none was hand-faked.

**Machine, once, for every figure on this hop:** Apple M3 (`Mac15,13`), 8 cores, macOS 26.5.2, node
`v24.12.0`, vitest `3.2.7`. `UNKNOWN - verify` on any other.

## The measurement

I started by verifying the brief's own fence — *"`src/history-pane.ts` md5 `54fd4346…` unchanged"* —
rather than quoting it forward. It does not hold.

```
file                          this branch tip    QE + ticket + brief record   same?
src/history-pane.ts           c4653c4c…          54fd4346…                    NO
src/history-pane.nfr.test.ts  796918f3…          65f4f29a…                    NO
src/history-pane.test.ts      110ebc0b…          110ebc0b…                    yes
```

Cross-checked with `md5`, `md5sum` and `openssl md5`; and by `git show <commit>:<path> | md5 -q` at
every commit that touched either file.

## Where the two stale digests come from — one commit, and it is licensed

**`b7e1226` — `ABC-029`'s build hop — landed AFTER `ABC-028`'s build (`8de988d`) and BEFORE
`ABC-028`'s QE gate (`fff4b92`).**

```
09d4515  pane 54fd4346…   nfr db77e971…    ABC-017
05217b7  pane 54fd4346…   nfr e27a8387…    ABC-028 build (1/2)
8de988d  pane 54fd4346…   nfr 65f4f29a…    ABC-028 build (2/2)  <- QE's tree
b7e1226  pane c4653c4c…   nfr 796918f3…    ABC-029 build        <- +1/-1 pane, +146/-43 nfr
fff4b92  pane c4653c4c…   nfr 796918f3…    ABC-028 QE gate
e902748  pane c4653c4c…   nfr 796918f3…    this branch's base
```

**The pane change is one line: a comment at `:30`.** It is exactly what `ABC-028`'s own `## Out of
scope` assigns to `ABC-029` (*"`src/history-pane.ts:30`'s unqualified comment … is `ABC-029`'s"*).
**`ABC-028` itself changed zero bytes of the pane** — `54fd4346…` at `09d4515`, at `05217b7` and at
`8de988d` — which is what the fence was actually for, and it HOLDS.

## Which reading of QE's hop this supports, and the one I cannot exclude

QE's harnesses (`make-mutants.mjs`, `make-a2.mjs`, `make-cachelast.mjs`, `make-more.mjs`) **hard-throw**
on an md5 mismatch, and QE reported them running and producing verdicts. That is consistent with **QE
having measured a tree at `ABC-028`'s own build commit — two commits behind this branch's tip.**

**The second reading, recorded rather than suppressed:** QE ran on this tip and transcribed the digests
from the ticket. The harnesses' own `throw` makes that hard to sustain, but **I cannot enter QE's
worktree to settle it and I did not try** — `UNKNOWN - verify`. Either way the recorded fact is the
same: **the record does not say which tree each figure belongs to, and two of its three digests are not
this branch's.**

## What I did about it — and the reason no conclusion moved

**I re-ran every consequential cell on THIS tip** rather than carrying QE's numbers. They all reproduce
(sibling notes). **The reason the finding survives the tree change is narrow and worth stating: the
three things `G1` depends on — the comment block at `:103-120`, the module-scope fixtures at `:121`, and
both `A11` `toSan` count assertions — are byte-identical across `b7e1226`.** `ABC-029` repaired the two
structural guards ~120 lines below and left the trap region alone. **That was luck, not design.**

## The generalisable defect

**A whole-file md5 is the wrong fence for a file two tickets edit in disjoint regions.** It goes stale
on a change that does not touch what it guards, then gets quoted forward as if it did. It fired for the
wrong reason here and it produced a self-contradictory `## Out of scope` (sibling `decision` note, the
seventh gap). **Pin the region, not the file. The line map is the fence; the digest was decoration.**

Written into the ticket as `## Test notes` 11.
