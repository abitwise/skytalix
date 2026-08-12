---
id: 20260812T232000Z-ba-pm-observation-the-tip-i-ruled-on-and-every-number-i-re-ran-022bb684
kind: observation
by: ba-pm
at: 2026-08-12T23:20:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A4
  - ABC-028-A5
  - ABC-029
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# The tip I ruled on, every number I re-ran, and the three that had already gone stale since the gate

> **Hand-authored, no stamp.** `scripts/context-io.ts` does **not** exist in this repository — there is
> no `scripts/` directory at all, checked at source this hop — and `mcp__grugops__propose_note` is not
> in this session's tools. `context.human_admission` is `off` and **no `§14-gate` verdict record exists
> under this task**, so **nothing on this hop is a `finding`** and no stamp was invented.
> `confidence: high` refers to the measurements, every one of which was RUN. There is no derived
> `index.md` / `index.jsonl`: the tool that renders them does not exist and none was hand-faked.
> **`scripts/claim.js` does not exist either**, so the Workflow 17 step 2 claim was made **by hand** —
> `mkdir -p .grugops/queue/claimed` for the missing parent, then a bare `mkdir` (no `-p`) of
> `.grugops/queue/claimed/refinement-ABC-028-f4/`, which is the atomic act and the one that would have
> raced. The `pending → claimed` and `claimed → done` moves are plain `mv`; the queue files are
> untracked, so `git mv` refuses.

**Worktree `../cli-chess-abc028-f4`, branch `grugops/refinement-ABC-028-f4`, HEAD
`1e70dc2`.** `git merge-base HEAD main` is `95086ae`; this branch is **42 commits ahead of `main`**.
**No other worktree was entered** — a Security/NFR gate is live on `ABC-029`. Machine: `UNKNOWN -
verify` beyond what the tooling reported (node `v24.12.0`).

## The gate figures, re-run rather than inherited

```
lint            npm run lint        exit 0   (2 infos, both PRE-EXISTING biome.json, 46 files)
typecheck       npm run typecheck   exit 0
unit            npm test            755 passed (755) on 26 files, Duration 1.43 s
skip            0                   npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'
owned lane      src/history-pane.test.ts alone       26 passed (26)
nfr lane        src/history-pane.nfr.test.ts alone   11 passed (11)
```

**This reproduces the briefed baseline cell for cell**, so any red on this hop would have been mine.
None was.

## The three digests, and the one that moved AFTER the gate

```
file                          this tip     QE gated      same?
src/history-pane.ts           c4653c4c…    c4653c4c…     yes   <- the ticket's fence, UNMOVED
src/history-pane.test.ts      9533f050…    9533f050…     yes
src/history-pane.nfr.test.ts  16bf2f50…    1d33bea6…     NO    <- ABC-029's 7084c5e, +153/−0
```

**The comment block and the fixture line survived that change byte-for-byte** — `:103`, `:123`, `:124`
re-found by `grep` at this hop — **so the line map holds and only the whole-file digest moved. That is
the THIRD demonstration of `## Test notes` 11's *pin the region, not the file*, and the first one that
happened after a gate rather than before it.**

## What had gone stale between QE's gate and this hop, in one table

| what | QE's tip (`41d204c`) | this tip (`1e70dc2`) | whose commit |
|---|---|---|---|
| full suite | `752` | **`755`** | `ABC-029`'s `7084c5e` (+3 `it`) |
| nfr lane | `8` | **`11`** | same |
| owned lane | `26` | `26` | — |
| `src/history-pane.nfr.test.ts` md5 | `1d33bea6…` | **`16bf2f50…`** | same |

**Three of the four moved in one commit, and not one of them is `ABC-028`'s.** That is `F2`'s whole
case, measured rather than argued: **an absolute suite total is not a property of any `ABC-028`
criterion.**

## `F3` — the published line count, four instruments, all run here

```
git show --numstat 26e452f -- src/         131  0  src/history-pane.test.ts
git show --stat    26e452f -- src/         131 insertions(+)
raw '+' lines (minus the +++ header)       131
wc -l  26e452f^ -> 26e452f                 972 -> 1103
```

**`+131 / −0`, not the published `+125`.** All four agree; the `S` re-derivation on the ticket page
repeated `+125` and is corrected. **`S` does not turn on six lines — the reason this is worth a
correction is that this page's standing rule is that an inherited number is an asserted number.**

## What I did NOT measure, said plainly

- **I built no mutant.** Every claim about `WCACHE-*` behaviour on this hop is QE's measurement, cited
  as QE's. In particular *"a last-three-identity cache fails exactly 2"* was **not** re-run at this tip
  and is `UNKNOWN - verify` here; what I measured is that the **denominator** in that sentence (`752`)
  no longer matches the suite (`755`).
- **I ran no `ADR-0008` protocol.** This hop adds no test, no file and no line to the repository, so
  its own `N8-LANE` delta is **zero**. `A5`'s landed delta stays `UNKNOWN - verify`, and QE's reading
  of it as a **floor rather than a number** stands untouched.
- **I did not re-derive the lane TOTAL.** It is `ABC-026`'s and is under dispute. The *"whichever of
  `ABC-028` / `ABC-029` lands second re-measures the TOTAL"* rule is unchanged and **still owed at the
  merge**.
