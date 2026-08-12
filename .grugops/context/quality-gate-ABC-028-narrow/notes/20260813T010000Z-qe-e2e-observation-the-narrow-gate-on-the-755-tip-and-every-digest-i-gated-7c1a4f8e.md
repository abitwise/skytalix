---
id: 20260813T010000Z-qe-e2e-observation-the-narrow-gate-on-the-755-tip-and-every-digest-i-gated-7c1a4f8e
kind: observation
by: qe-e2e
at: 2026-08-13T01:00:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A2
  - ABC-028-A3
  - ABC-028-A4
  - ABC-028-A5
  - ABC-029
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# The narrow gate on the `755` tip: every command re-run, every digest recorded, and the list of what I deliberately did NOT re-run

> **Hand-authored, no stamp.** `scripts/context-io.ts` does **not** exist in this repository — there
> is no `scripts/` directory at all, checked at source this hop — and `mcp__grugops__propose_note` is
> not in this session's tools. `context.human_admission` is `off` and **no `§14-gate` verdict record
> exists under this task**, so **nothing on this hop is a `finding`** and no stamp was invented.
> `confidence: high` refers to the measurements, every one of which was RUN. There is no derived
> `index.md` / `index.jsonl`: the tool that renders them does not exist and none was hand-faked.
> **`scripts/claim.js` does not exist either**, so the Workflow 17 step 2 claim was made **by hand** —
> `mkdir -p .grugops/queue/claimed` for the missing parent (NOT the racing act), then a bare `mkdir`
> (no `-p`) of `.grugops/queue/claimed/quality-gate-ABC-028-narrow/`, which **is** the atomic act.
> `pending → claimed` and `claimed → done` are plain `mv`; the queue files are untracked, so `git mv`
> refuses.

**Worktree `../cli-chess-abc028-qe3`, branch `grugops/quality-gate-ABC-028-narrow`, HEAD `6cd2507`.**
`git merge-base HEAD main` is `95086ae`; this branch is **45 commits ahead of `main`**. **No other
worktree was entered** — a Security/NFR gate is live on `ABC-019`. Machine: Apple M3, 8 cores, node
`v24.12.0`, vitest `3.2.7`. `UNKNOWN - verify` on anything else about it.

## The gate, re-run rather than inherited

```
install      (node_modules symlinked from the parent worktree; no second npm install)
lint         npm run lint        exit 0    46 files, 2 infos — both PRE-EXISTING biome.json
typecheck    npm run typecheck   exit 0
unit         npm test            755 passed (755) on 26 files, Duration 1.47 s
build        npm run build       exit 0    (tsc --noEmit — a typecheck wearing the build slot's name)
e2e          UNKNOWN - verify    quality.ui_e2e is `ui-or-critical-path` and THIS PROJECT HAS NO UI
                                 SURFACE. I did not invent one.
skip         0                   npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'
owned lane   src/history-pane.test.ts alone       26 passed (26)
nfr lane     src/history-pane.nfr.test.ts alone   11 passed (11)
```

**This reproduces the briefed baseline cell for cell** — lint 0, typecheck 0, 755/755 on 26 files,
skip 0 — **so any red on this hop would have been mine. None was.**

**Two gate steps could not run, and neither is a pass:**

- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` exits **`2`** —
  *"cannot read the registry file"*. Workflow 05 distinguishes `2` (the checker could not run) from
  `1` (a real integrity failure, human-only), and this is `2`. **`.grugops/test-skips.md` has never
  existed on this branch. Pre-existing, not this ticket's, and the quantity it guards is genuinely
  `0`** — measured above, not assumed.
- `scripts/check-uat-oracles.js` does not exist here, so Workflow 05's Tier-1 oracle step records
  **`UNKNOWN - verify`** and is non-blocking, exactly as that step provides for a host repo without
  it.

## Every digest I gated

```
src/history-pane.ts                c4653c4c263c4c417ea34969164ccd86   <- the ticket's fence
src/history-pane.test.ts           9533f05038780def980bf5a86707cdbd
src/history-pane.nfr.test.ts       16bf2f50c93e2e896b5406cbfa772b8b
src/zobrist.nfr.test.ts            aa1e3a4221c5ae1a375f6511344208e8
src/status-panel.nfr.test.ts       2045bc444c5ea87534e2ca3efe5737e7
src/gameend.nfr.test.ts            d3796e590cabcea149a6797be9847e18
plans/tickets/ABC-028-…md          a85892056706b50c81fe3f1e99605b24
plans/traceability.md              5f17e42a82868faba5d1e4c2ee3e8a00
plans/board.md                     ba6c1ec531d787c87b28f8d1bbf59a9c
whole src/ tree (42 files, md5 of the sorted per-file md5s)
                                   65c7fc0c080e8f5be3a1d2e7af3a95c4
```

**All three `ABC-028` digests are identical at the start and the end of this hop.** `git diff -- src/`
is EMPTY. The last four files are the ones I READ and gated text against; none was written.

## THE ONE THING THE PIN DOES NOT SAY, and I checked it rather than repeating it

`src/history-pane.ts` at `main` is **`54fd4346dcc1a0060c4e66ae0149265d`**; on this branch it is
**`c4653c4c…`**. **The branch DOES change that production file — by exactly one line — and the
commit is `ABC-029`'s `b7e1226`, not `ABC-028`'s.** It rewrites one line of the module's doc comment
(*"so `src/history.ts` keeps its zero runtime importers"* → *"so IT ADDS NO RUNTIME IMPORTER OF
`src/history.ts`"*); zero executable lines.

**This does not weaken `ABC-028`'s zero-production-diff claim — it is what makes it checkable.** I
measured `ABC-028`'s own three `src/`-touching commits separately rather than taking a range, because
a range spans the neighbour:

```
8de988d   src/history-pane.nfr.test.ts  +15 / -7      src/history-pane.test.ts  +365 / -0
26e452f                                               src/history-pane.test.ts  +131 / -0
593ba70   src/history-pane.nfr.test.ts  +17 / -14
          -> files touched under src/: TWO, both *.test.ts.  Production files: ZERO.
```

**A `git diff 8de988d^..593ba70 -- src/` reads `1 1` on `src/history-pane.ts` and that is
`ABC-029`'s line, not this ticket's.** I ran exactly that wrong measurement first and corrected it at
source. Recorded because the next hop will reach for the range too, and because `## Out of scope`
already replaced a fixed md5 with a diff for this precise reason — this is the third demonstration
that it was right to.

## What I deliberately did NOT re-run, and why

- **The eight-subset-key enumeration.** The Orchestrator's instruction is explicit: it was conclusive
  and it is not being asked for twice. **I did not re-run it, and nothing on this hop depends on
  re-running it.** Its conclusion — no key of reach ≤ 3 survives except `WCACHE-LAST3`, so the
  ledger's boundary is drawn in the right place — is carried forward unchanged from
  `quality-gate-ABC-028-final` and is NOT re-asserted here.
- **The fifteen-cell kill matrix.** Only the cells whose *criterion text* moved were re-run (`A4`'s
  shape clause, `A5`'s domain). The rest are unchanged text on a tree whose `ABC-028` digests have
  not moved.
- **`RISK-ABC028-01a`'s `WBOARDBLIND` witness.** Its standing obligation fires on a change to `A4`'s
  *instrument*; `A4`'s instrument did not change, only the sentence describing its lane. Not re-run,
  and its status is carried as OPEN from the previous gate, not re-measured.
- **`N8-LANE`'s TOTAL.** `ABC-026` owns it, it is under dispute, and the *"whichever of `ABC-028` /
  `ABC-029` lands second re-measures the TOTAL"* rule is untouched and **still owed at the merge**.
