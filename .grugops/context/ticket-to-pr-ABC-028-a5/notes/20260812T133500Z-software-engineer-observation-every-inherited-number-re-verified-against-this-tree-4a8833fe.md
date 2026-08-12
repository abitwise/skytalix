---
id: 20260812T133500Z-software-engineer-observation-every-inherited-number-re-verified-against-this-tree-4a8833fe
kind: observation
by: software-engineer
at: 2026-08-12T13:35:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A5
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# Every number I inherited, checked against THIS tree before anything was built on it — all of them hold

> **Hand-authored, and this is disclosed rather than hidden.** `scripts/context-io.ts` does **not
> exist** in this repository — there is no `scripts/` directory at all, checked at source this hop —
> and `mcp__grugops__propose_note` is not in this session's tools. `context.human_admission` is `off`
> and **no `§14-gate` verdict record exists under this task**, so **nothing on this hop is a
> `finding`.** `confidence: high` refers to the measurements, every one of which was RUN. There is no
> derived `index.md` / `index.jsonl` — the tool that renders them does not exist and none was
> hand-faked. `scripts/claim.js` does not exist either; the Workflow 17 claim was made by hand.

**Machine, once, for every figure across this hop's notes:** Apple M3 (`Mac15,13`), 8 cores,
macOS 26.5.2, node `v24.12.0`, vitest `3.2.7`, biome `2.5.5`. `UNKNOWN - verify` on any other.

## Why I checked rather than quoted

The Orchestrator's brief stated plainly that this ticket's QE gate ran on a tree that is no longer the
tip, that the pre-rebase digests were quoted onward, and that BA/PM's re-measurement moved nothing
**only by a byte-identity it called luck rather than design**. A fence that holds by luck is not a
fence. So the first thing this hop did was re-derive the inputs.

## The digests — all three confirmed on the branch tip `f14f3a6`

```
file                          measured here     brief / BA/PM said   same?
src/history-pane.ts           c4653c4c…         c4653c4c…            yes
src/history-pane.nfr.test.ts  796918f3…         796918f3…            yes
src/history-pane.test.ts      110ebc0b…         110ebc0b…            yes
```

Cross-checked with `md5 -q` and `openssl md5`. The corrected values BA/PM published are this tip's;
the `54fd4346…` / `65f4f29a…` pair on the ticket page is not, exactly as recorded.

## The baseline and the consequential cells — every one re-run, none carried

```
cell                                                   measured here     inherited     same?
baseline, full suite                                   750 / 750, 26 files   750 / 750     yes
skip count                                             0                 0             yes
WCACHE-LEN,   full suite                               3 failed / 750    3 / 750       yes
WCACHE-LEN,   config (a) history-pane.test.ts alone    1 failed / 24     (A1 kills)    yes
WCACHE-LAST,  full suite                               2 failed / 750    2 failed/750  yes
WCACHE-LAST,  config (a)                               24 passed         24 passed     yes
```

`WCACHE-LEN`'s two nfr kills and `WCACHE-LAST`'s two are the same two `A11` `toSan` call-count
assertions the ticket names. **Nothing moved.** The conclusions I built on are the tip's conclusions,
not QE's tree's, and that is now measured rather than assumed for a second time.

## One inherited artefact that does NOT run on this tree, reported rather than worked around

`.grugops/context/quality-gate-ABC-028-qe/artifacts/make-cachelast.mjs` line 17 hard-throws unless the
pane is `54fd4346…`. **On this tip it throws.** That is the harness behaving correctly, and it is
independent corroboration of BA/PM's reading that QE measured a tree at `ABC-028`'s own build commit.
It also pins `node_modules` inside another live worktree (`../cli-chess-abc028-qe`), which this hop
must not enter. **I did not repair, run or re-point it.** I built my own mutants from the ticket's
definitions instead — which the brief required for a different reason, and which this makes necessary
as well.
