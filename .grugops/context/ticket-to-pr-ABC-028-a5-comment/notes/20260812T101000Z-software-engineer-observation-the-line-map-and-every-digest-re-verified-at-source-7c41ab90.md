---
id: 20260812T101000Z-software-engineer-observation-the-line-map-and-every-digest-re-verified-at-source-7c41ab90
kind: observation
by: software-engineer
at: 2026-08-12T10:10:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A2
  - ABC-028-A5
  - ABC-029
  - RISK-ABC017-01
  - src/history-pane.nfr.test.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# The line map held; the digest did not. Every number I inherited was checked at source first

> **Hand-authored, and disclosed rather than hidden.** `scripts/context-io.ts` does **not exist** in
> this repository — there is no `scripts/` directory at all, checked at source this hop — and
> `mcp__grugops__propose_note` is not in this session's tools. `context.human_admission` is `off` and
> **no `§14-gate` verdict record exists under this task**, so **nothing on this hop is a `finding`.**
> `confidence: high` refers to the measurements, every one of which was RUN. There is no derived
> `index.md` / `index.jsonl` — the tool that renders them does not exist and none was hand-faked.
> `scripts/claim.js` does not exist either; the Workflow 17 claim was made by hand with `mkdir`.

**Machine, once, for every figure across this hop's notes:** Apple M3 (`Mac15,13`), 8 cores,
macOS 26.5.2, node `v24.12.0`, vitest `3.2.7`, biome `2.5.5`. `UNKNOWN - verify` on any other.

## The brief told me to distrust its own numbers. It was right to

```
what                                     inherited            measured here        same?
comment block bounds                     :103-120             :103-120             YES
AT_* fixtures begin                      :121                 :121                 YES
src/history-pane.nfr.test.ts md5         796918f3…            d51b02be…            NO
src/history-pane.ts md5                  c4653c4c…            c4653c4c…            YES
src/history-pane.test.ts md5             110ebc0b…            9533f050…            NO
full suite                               752/752, 26 files    752/752, 26 files    YES
skip                                     0                    0                    YES
lint / typecheck                         0 / 0                0 / 0 (2 infos)      YES
```

**Both moved digests are `ABC-029`'s containment build `f31e2e7`**, which landed after the `A5` test
half's hop measured them. `src/history-pane.test.ts` also carries `A5`'s own `+125` lines, which are
in this worktree's base — `A5_SHAPES` and its `it.each` are present at `:1026`/`:1062` and the file
passes **26/26 standalone**, confirmed rather than taken from the brief.

**The line map is the one thing that did NOT move, and it is the fence.** `ABC-029` edited this file
twice now (`b7e1226`, then `f31e2e7`) in a region ~200 lines below the comment, and both times the
block bounds and the fixture start survived byte-for-byte. That is the ticket's own ruling holding up
in practice: *"the line map is the fence; the digest was decoration."* A whole-file md5 has now gone
stale **three** times on this file without a single byte of the guarded region changing.

## What I did not touch, checked rather than asserted

`ABC-029`'s two structural guards live at `:299`+ and `:381`+ in this file and **a QE hop is gating
them concurrently in `../cli-chess-abc028-qe`.** My diff is two hunks, both inside `:106-123`. The
guards, the eight `A11` assertions and the `AT_*` fixtures are **byte-identical** — verified by
`git diff` showing zero changed lines outside the comment and zero matches for `productionModulesIn`,
`LICENSED_DRIVERS`, `FRAME_PRODUCERS` or `spawnSync` in the diff. **No other worktree was entered.**
