---
id: 20260813T071500Z-software-engineer-observation-every-number-re-derived-on-this-tip-and-the-briefed-ones-held-c1f1221a
kind: observation
by: software-engineer
at: 2026-08-13T07:15:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-019
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - .grugops/factory.config.json
supersedes:
---

# Every number I rely on was re-derived on THIS tip — the briefed baseline held this time, and I am recording that it held rather than assuming it would

> **Hand-authored, no stamp.** Every command below was RUN this hop, in the worktree, and the exit
> codes are as reported. Nothing is transcribed from the brief or from an earlier hop's note.

**Worktree `../cli-chess-abc028-t493`, branch `grugops/ABC-028-t493`, HEAD `47fef3d`.**

## Why re-derive a baseline the brief already stated

**The brief itself told me it had been wrong before** — the Orchestrator's previous brief carried
`755 / 755` on 26 files and was stale by **52 tests**, because `ABC-019`'s turn loop was rebased into
the stack between hops. **A briefed number is a number somebody else measured on a tree that no
longer exists.** So the whole baseline was taken again here.

## The baseline, BEFORE any edit of mine

```
HEAD                             47fef3d   (BA/PM measured at ca6c424)
git diff --stat ca6c424..HEAD -- src/      EMPTY   — three commits since, none of them src/
git status --short                         only the untracked queue dir

lint       npm run lint        exit 0    49 files, 2 infos — both PRE-EXISTING biome.json
typecheck  npm run typecheck   exit 0
unit                                     total 807  passed 807  failed 0  pending 0  todo 0
                                         files 28   success true
skip       0                  npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'

src/history-pane.ts             c4653c4c263c4c417ea34969164ccd86
src/history-pane.test.ts        9533f05038780def980bf5a86707cdbd
src/history-pane.nfr.test.ts    16bf2f50c93e2e896b5406cbfa772b8b
```

**The briefed tip of `807 / 807` on 28 files is EXACT on this tree, and so are all three digests.**
That is worth recording precisely because the last brief was not: *"it held"* is a measurement too,
and a hop that only reports numbers when they move gives no evidence it re-measured the others.

**Three commits landed between BA/PM's tip and mine and none touched `src/`** — `git diff -- src/`
across that range is empty. That is the mechanism behind the totals holding, not luck, and it is the
thing that would have changed the answer had it been otherwise.

## The gates, AFTER the edit

```
lint       npm run lint        exit 0    49 files, 2 infos — both PRE-EXISTING biome.json
typecheck  npm run typecheck   exit 0
build      npm run build       exit 0    (tsc --noEmit — honest naming, per AGENTS.md)
unit                                     total 807  passed 807  failed 0  pending 0  todo 0
                                         files 28   success true
skip       0
single     npx vitest run src/history-pane.test.ts    26 passed (26), 1 file

src/history-pane.ts             c4653c4c263c4c417ea34969164ccd86   UNMOVED
src/history-pane.test.ts        1b23df27a9a67ef0ed359dd33456ee1b   moved, by design
src/history-pane.nfr.test.ts    16bf2f50c93e2e896b5406cbfa772b8b   UNMOVED
git diff --stat -- src/history-pane.ts                             EMPTY
git diff --stat                 src/history-pane.test.ts +8 -4     ONE file under src/
```

**All four mandatory gates from `.grugops/factory.config.json` (`lint`, `typecheck`, `unit`,
`build`) are green, and `test_integrity` reports skip `0`.** `quality.self_fix_attempts` was not
touched: nothing went red, so the budget was never entered.

**The owned-lane figure `26/26` for `src/history-pane.test.ts` alone is unchanged by this edit** —
which matters because `src/history-pane.nfr.test.ts:116` states it and that file is not mine to
touch. **The comment I did not edit stayed true because the edit was comment text.**

## The done-condition, line by line, as it was actually run

```
1  comment-only, one file           git diff --stat -> src/history-pane.test.ts only, +8/-4
                                    src/history-pane.ts diff EMPTY, md5 unmoved              PASS
2  /usr/bin/grep -nE 'anywhere in the project|[0-9]{3}/[0-9]{3}' src/history-pane.test.ts
                                    hits :87 and :307 ONLY, both far outside the A9 block;
                                    the same grep scoped to :486-504 exits 1 (no hit);
                                    /usr/bin/grep -rn 'anywhere in the project' src/ exits 1  PASS
3  the mutant still dies TWICE      2 failed / 807 on 28, A9 and A4, measured before AND
                                    after, against a 0 / 807 null control                     PASS
4  lint 0 · typecheck 0 · green · skip 0                                                      PASS
```

**Done-condition line 2's two surviving hits are reported rather than silently excluded**, because a
check that passes by narrowing its own scope is not a check: `:87` is *"the builder for 40/80/120/300"*
(fixture sizes) and `:307` is *"9998/9999 are the widest move numbers reachable by play"* (move
numbers). **Neither is a suite total, neither is in the `A9` block, and neither is mine to touch.**

## Two honest wrinkles, recorded rather than smoothed

1. **The dates disagree and I followed the queue.** The environment reports today as **2026-08-12**;
   the subtask record says `enqueued_at: 2026-08-13T06:00:00Z` and the task id is
   `abc028-t493-2026-08-13`. **I timestamped this hop `2026-08-13T07:xx:00Z`** so the trace stays
   monotonic against the record that scheduled it. Prior hops on this stack carry the same
   straddle — the `COLUMN INVARIANT` note dates a BA/PM re-measurement `2026-08-13` while its notes
   are stamped `2026-08-12`. **Flagged, not resolved: which clock is authoritative is
   `UNKNOWN - verify` and is not this ticket's to rule.**
2. **The 2 lint infos are `biome.json`'s, not this ticket's** — `$schema` `2.3.0` against a `2.5.5`
   CLI, and `linter.rules.recommended` deprecated. Exit code `0`. Pre-existing on both sides of my
   edit, and left alone under rule 12.

## Machine

8 cores, node `v24.12.0`, vitest `3.2.7`. **NO TIMING MEASUREMENT WAS TAKEN** — instructed, the
machine is not quiet, and a comment-only edit's `N8-LANE` delta is zero by construction. **This means
`ABC-026`'s lane-total re-measurement is neither performed nor discharged here**, and the
*"whichever of `ABC-028` / `ABC-029` lands second re-measures the TOTAL"* rule is **still owed at the
merge**.
