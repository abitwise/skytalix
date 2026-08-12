---
id: 20260812T210500Z-qe-e2e-observation-the-gate-on-the-tip-and-every-digest-i-gated-4b91c07e
kind: observation
by: qe-e2e
at: 2026-08-12T21:05:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - ADR-0008
  - agent-factory/workflows/05-pr-quality-gate.md
supersedes: 20260812T120000Z-qe-e2e-observation-baseline-and-gates-re-verified-2f0ad39b
---

# The gate on the TIP — every mandatory check re-run by me, and the md5 of every file I gated

> **Hand-authored, and disclosed rather than hidden.** `scripts/context-io.ts` does **not exist** in
> this repository — there is no `scripts/` directory at all, re-checked at source this hop — and
> `mcp__grugops__propose_note` is not in this session's tools. `context.human_admission` is `off` and
> **no `§14-gate` verdict record exists under this task**, so **nothing on this hop is a `finding`**
> and no stamp was invented. `confidence: high` refers to the measurements, every one of which was
> RUN. There is no derived `index.md` / `index.jsonl`: the tool that renders them does not exist and
> none was hand-faked. `scripts/claim.js` does not exist either, so the Workflow 17 step 2 claim was
> made **by hand** — `mkdir -p .grugops/queue/claimed` for the parent, then a bare `mkdir` (no `-p`)
> of `.grugops/queue/claimed/quality-gate-ABC-028-final/`, which is the atomic act and the one that
> would have raced.

**This note supersedes my own earlier gate's baseline note**, which ran on `6b513bb`. That tree has
since moved twice. **A superseded verdict is not evidence, and I re-ran everything rather than
carrying anything forward.**

**Machine, once, for every figure on this hop:** Apple M3 (`Mac15,13`), 8 cores, macOS 26.5.2, node
`v24.12.0`, vitest `3.2.7`, typescript `5.9.3`, biome `2.5.5`. `UNKNOWN - verify` on any other.

## The tree I gated, pinned before anything was measured

Branch `grugops/quality-gate-ABC-028-final`, worktree `../cli-chess-abc028-qe2`, **HEAD
`41d204c0348c9bc4df43d618766c0c953b9ffb7e`** — *"docs(board): grug move ABC-028 to In Review, ledger
now forbid SENTENCE not evidence"*.

```
file                          md5 AT THE START AND AT THE END OF THIS HOP
src/history-pane.ts           c4653c4c263c4c417ea34969164ccd86    <- the ticket's fence, UNMOVED
src/history-pane.test.ts      9533f05038780def980bf5a86707cdbd
src/history-pane.nfr.test.ts  1d33bea667cc792e1fa1fd4030caa718
plans/tickets/ABC-028-…md     2098944df89890894d9b117975bed6f9
```

All 42 `src/*.ts` digests were taken at the start of the hop and the three above re-taken at the end.
**Every mutant generator on this hop pins those three by md5 and THROWS rather than measuring the
wrong tree** — the failure mode the inherited `make-cachelast.mjs` demonstrated when it hard-threw on
this tip.

**The line map, read at source rather than inherited:** `src/history-pane.nfr.test.ts` line **102 is
blank**, the comment block is **`:103-123`**, and `const AT_0` — the first module-scope fixture — is
on line **124**. The ticket's six corrected anchors are correct on this tip.

## The gate, in Workflow 05's order

```
install         n/a — node_modules is a symlink to the main repo's, present on arrival
lint            npm run lint        exit 0    (2 infos, both PRE-EXISTING biome.json, 46 files)
typecheck       npm run typecheck   exit 0
unit            npm test            752 passed (752) on 26 files
build           npm run build       exit 0    (tsc --noEmit — a typecheck wearing the build slot's
                                               name, per AGENTS.md's own honest label)
e2e             NOT RUN — stated, not invented (below)
test-integrity  exit 2 — "could not run", NOT a pass and NOT exit 1 (below)
auto-UAT oracles  scripts/check-uat-oracles.js DOES NOT EXIST here — UNKNOWN - verify,
                  non-blocking per Workflow 05 step 3
skip            0   (npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests')
lanes           src/history-pane.test.ts alone  26/26
                src/history-pane.nfr.test.ts alone  8/8
```

**Every `mandatory_gate` (`lint`, `typecheck`, `unit`, `build`) PASSES on the branch tip**, and the
briefed baseline reproduces cell for cell — so any red on this hop would have been mine. **None was.**

**The 2 lint infos are `biome.json`'s and are not this ticket's:** the config `$schema` says `2.3.0`
while the CLI is `2.5.5`, and `linter.rules.recommended` is deprecated in favour of `preset`. Exit
code is 0. `AGENTS.md` rule 12 — flagged, not fixed.

## `e2e` — stated rather than invented

`quality.ui_e2e` is `ui-or-critical-path` and **this project has no runnable UI surface**: no CLI
entry point until `EPIC-006`, `AGENTS.md` records `E2E` and `Dev / run` as `UNKNOWN - verify` for that
reason, and `renderHistory` returns rows as a value and writes nothing. **I did not invent an E2E
lane.** The critical path this ticket guards is the pane's consumer contract, which the unit suite
exercises and which this hop attacked directly with fourteen builds.

## `test-integrity` — exit `2`, and it is NOT read as a pass

```
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
  -> "Error: cannot read the registry file: .grugops/test-skips.md"
  -> exit code 2
```

Per Workflow 05 step 3, exit `2` is *"the checker could not run"* — **an error distinct from a clean
fail, recorded as such, never read as a pass.** It is **not** exit `1`, so it is not the human-only
short-circuit that forces `BLOCKED_NEEDS_FIX`. `.grugops/test-skips.md` has never existed on this
branch; the quantity it guards is genuinely **0**; `quality.test_integrity` is `warn`. Pre-existing,
not this ticket's, recorded rather than zeroed.

## The zero-production-diff fence, TESTED rather than assumed — and it holds on its repaired wording

`## Out of scope` was repaired from a fixed md5 to *"`ABC-028`'s own net diff on `src/history-pane.ts`
must be EMPTY"*. **That is now checkable, and I checked it commit by commit:**

```
commit     src/history-pane.ts md5              whose commit
09d4515    54fd4346dcc1a0060c4e66ae0149265d     before ABC-028
05217b7    54fd4346dcc1a0060c4e66ae0149265d     ABC-028 build 1
8de988d    54fd4346dcc1a0060c4e66ae0149265d     ABC-028 build 2
b7e1226    c4653c4c263c4c417ea34969164ccd86     ABC-029  <- THE ONLY MOVE, one comment line at :30
26e452f    c4653c4c263c4c417ea34969164ccd86     ABC-028 A5 test half
f31e2e7    c4653c4c263c4c417ea34969164ccd86     ABC-029
593ba70    c4653c4c263c4c417ea34969164ccd86     ABC-028 A5 comment half
41d204c    c4653c4c263c4c417ea34969164ccd86     the tip
```

**`ABC-028`'s own net diff on the pane is EMPTY across all four of its commits.** The single changed
line in the whole span is `ABC-029`'s licensed `:30` comment edit, exactly as the ticket records. The
repaired fence is the right instrument and it PASSES; the old fixed-md5 fence would still be reading
VIOLATED on a ticket that changed zero bytes.

**The four `src/` commits `ABC-028` owns, by `git show --numstat`:**

```
05217b7  +87/-0   src/history-pane.nfr.test.ts   +137/-5  src/history-pane.test.ts
8de988d  +15/-7   src/history-pane.nfr.test.ts   +365/-0  src/history-pane.test.ts
26e452f                                          +131/-0  src/history-pane.test.ts
593ba70  +17/-14  src/history-pane.nfr.test.ts
```

**Two files, both `.test.ts`. Zero production files. Zero production lines.**

## No existing test was weakened, narrowed or deleted — measured, not asserted

The only `-5` on an existing test file is `05217b7`, and I read every removed line:

- four are doc-comment lines from the file header rewrite;
- **one is the left half of a RENAME that WIDENED a title** — `it("A9 — neither render touches the
  caller's position or its move count"` became `it("A9 — neither render touches the caller's
  position, its move count or its ANCHOR"`.

**Zero `expect(` were removed by any of the four commits.** `src/history-pane.test.ts`'s `it(` count
went **13 → 25**. Nothing was narrowed to make anything pass.

## Method, and the one contamination hazard I found and worked around

Every mutant was built in an **out-of-tree replica** extracted from the object database
(`git archive HEAD src package.json tsconfig.json biome.json`), with this worktree's `node_modules`
symlinked and **`/usr/bin/diff -r` verified silent** against this worktree's `src/` before use. The
replica's own baseline is **752/752 on 26 files** — null control 1, and it is this tree. **I wrote
nothing under `src/` at any point**; `git diff -- src/` is EMPTY at the end.

**REPORTED BECAUSE IT NEARLY BIT ME: this session's scratchpad is SHARED ACROSS EVERY HOP ON THIS
TICKET, not per-hop.** It already contained the `a5`, `a5-comment` and `anchors` hops' harnesses and
trees (`mk.mjs`, `rep/`, `lanes/`, `n8-*`), some under names a new hop would naturally reuse. My first
`git archive` into a directory called `base/` extracted four paths and the directory came back with a
**fifth file (`redo.ts`) that no command of mine put there** — an earlier hop's leftover. I deleted it
and rebuilt under a fresh, uniquely-named root. **A hop that reused a path here would silently measure
another hop's tree**, which is the same defect class as gating a stale digest, one layer down. Worth
a factory-level note; it is not `ABC-028`'s.
