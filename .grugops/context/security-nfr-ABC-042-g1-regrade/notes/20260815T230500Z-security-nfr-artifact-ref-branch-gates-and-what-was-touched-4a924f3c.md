---
id: 20260815T230500Z-security-nfr-artifact-ref-branch-gates-and-what-was-touched-4a924f3c
kind: artifact-ref
by: security-nfr
at: 2026-08-15T23:05:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - G1
  - N8-SPAWN
  - plans/traceability.md
  - grugops/security-nfr-ABC-042-g1-regrade
supersedes: 
---

# Branch, gates, and exactly what this hop touched

## Branch

`grugops/security-nfr-ABC-042-g1-regrade`, branched from **`grugops/abc042-merge-key` BY NAME** at its
tip **`b891880`** — the commit that adds this subtask file. **No `base:` sha was written into the
subtask and none was needed**: the previous hop recorded that a `base:` sha in a file cannot name the
commit that creates it, and branching by name is the fix. Verified after branching that `parent_ref:`
(`.grugops/context/g1-answered-2026-08-15/`) and `plans/nfr-catalog.md` § `N8-SPAWN` were both present
in the working tree, so both inputs were reachable rather than assumed.

**`main` was NOT merged in** — it is not an ancestor of this branch's `ABC-042` content.
**NOT merged. NOT deployed. NOT pushed** (this repo has no remote). **The board was NOT moved.**

## Files written — three paths, and nothing else

```
plans/traceability.md                                            +2 / -1   (git diff --numstat)
.grugops/context/security-nfr-ABC-042-g1-regrade/notes/*.md      5 new notes (this one included)
.grugops/queue/done/security-nfr-ABC-042-g1-regrade/claim.md     new
.grugops/queue/{pending -> claimed -> done}/security-nfr-ABC-042-g1-regrade.md   renamed
```

**`git status --short -- src/` is EMPTY. Zero bytes of production or test code moved.** The third
measurement condition — the file holding the ten children and nothing else — was built **out of tree**
under the session scratchpad and the repository was never written.

**`plans/nfr-catalog.md`, `memory-bank/50-decisions/ADR-0008-…md`, `plans/tickets/ABC-042-…md`,
`plans/board.md`, `.grugops/factory.config.json` and `package.json` were NOT opened.** The two stale
censuses Architect/Design flagged in the catalog and in `ADR-0008` (both say the budget has two
accounts; there are three) are **not repaired here either** — not mine, and I cite `N8-SPAWN` directly
as the subtask instructs.

## `plans/traceability.md` — one row, one cell, asserted not eyeballed

`+2 / −1`: one `_Updated:` header line, and the `ABC-042` row's `NFRs` cell rewritten from **two
parallel Security/NFR writes into ONE reconciled text**.

| assertion | result |
|---|---|
| row re-split **FROM DISK** after the write | **10 cells** (leading and trailing empties present) |
| raw `|` inside any cell of the row | **0** |
| the nine cells I did not write, sha256-compared before/after | **all 9 unchanged** |
| cell 5 `NFRs` | 6383 → **7508 chars**, rewritten |
| `Status` cell | **untouched** — and now stale; flagged, owner named, not repaired |

**Nothing either write measured was dropped.** The gate write's detail (1460 ms gross, the ±10 ms
instrument, the per-child breakdown, the ~810 ms conforming floor, the rebuilt 1.52x deferred-import
variant, this ticket's draw on the total, "FOUR bars not three", `AR-1` on the artifact) and the
re-check's (the merging tree, all four bars MET, zero high, four owned risks, `G1` not blocking on
`block_on: high`) both survive, and the re-grade is added.

## Gates, run on this branch tip after the write

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | **exit 0** — 54 files, 2 infos, no fixes applied |
| typecheck | `npm run typecheck` | **exit 0** |
| build | `npm run build` | **exit 0** (`tsc --noEmit`; honest naming per `AGENTS.md`) |
| unit | `npm test` | **exit 0 — 856/856 passed, 30 files, 2.33 s** |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`, exit 0** |

Machine: **Apple M3, 8 logical cores, Darwin 25.5.0 arm64, Node v24.12.0, npm 11.7.0, vitest 3.2.7.**
`UNKNOWN - verify` elsewhere.

**856/856 on 30 files is the same reading the integration and the Architect/Design hops recorded on
this base**, which is expected: this hop changed one markdown line, one table cell, five notes and the
queue. **Beyond the gate, the full suite was run green a further 17 times** as condition `A` of the two
measurement harnesses, each run asserting its own file and test count — so the merging tree's suite has
now been observed green 18 times at my own hand in this session.

**One corroboration the runner hands over for free:** `npm test` reports
`src/cli.test.ts (29 tests) 13ms` against a run-wide `collect 2.89s`. **The ten children are spawned at
module scope, so their cost lands in COLLECT and not in TESTS** — which is why this file's 29 tests
bill 13 ms. That is the same fact my third measurement condition establishes (`A − C` = 22 ms), read
off an instrument I did not build.

**No `kind: finding` and no stamp is claimed.** None is emittable on this install (`AGENTS.md`:
`scripts/context-io.ts`, `scripts/claim.js` and `mcp__grugops__propose_note` are absent and
`context.human_admission` is `off`). These are gate results and measurements recorded by the role that
ran them, not a stamped verdict.

## Queue

Claimed **by hand** per `AGENTS.md`: `mkdir -p` the parent, then a **bare** `mkdir` of
`.grugops/queue/claimed/security-nfr-ABC-042-g1-regrade` — **exit 0, claim WON, uncontended** — then
`claim.md` written inside it and the subtask file transitioned **`pending → claimed → done`** by
`git mv` per Workflow 17. `.grugops/queue/pending/` is now empty.

**The `done` transition was taken rather than left open, and the reason is a hazard, not tidiness:**
`queue.stale_ttl_minutes` is **30**, and a claim left sitting in `claimed/` past its TTL is reclaimed
to `pending/` by the coordinator's sweep. **A finished re-grade sitting in `claimed/` is a re-gradeable
re-grade** — the next sweep would hand `G1` to another agent, which is exactly the "measure it twice
and pick" outcome this whole ticket has spent two hops refusing.

**Flagged, not avoided:** the directory form used here (`done/<task>/` holding both `claim.md` and the
subtask file) matches `done/agents-md-ABC-042-dev-run/` and `done/refinement-ABC-042-followups/`, while
Workflow 17's literal text says `done/<task>.md` and `done/design-nfr008-spawn-account.md` is flat.
**Both shapes are already live in this queue.** I followed the directory form because it keeps the
ownership record with the work; if the Orchestrator normalises the queue, this is one of the paths.
