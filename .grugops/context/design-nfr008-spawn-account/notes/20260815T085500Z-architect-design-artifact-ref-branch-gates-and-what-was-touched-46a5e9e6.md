---
id: 20260815T085500Z-architect-design-artifact-ref-branch-gates-and-what-was-touched-46a5e9e6
kind: artifact-ref
by: architect-design
at: 2026-08-15T08:55:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - N8-SPAWN
  - NFR-008
  - plans/nfr-catalog.md
  - grugops/design-nfr008-spawn-account
supersedes: 
---

# Branch, gates, and exactly what this hop touched

## Branch

`grugops/design-nfr008-spawn-account`, based on `grugops/abc042-merge-key` @ **`039766f`** (the tip;
the subtask's `base:` sha `6f05887` is one commit behind its own prose — see my observation note
§ 6). **NOT merged. NOT deployed. NOT pushed** (this repo has no remote).

## Files written — four paths, and nothing else

```
plans/nfr-catalog.md                                        +103 / -0   (git diff --numstat)
.grugops/context/design-nfr008-spawn-account/notes/*.md     4 new notes (this one included)
.grugops/queue/claimed/design-nfr008-spawn-account/claim.md new
.grugops/queue/{pending -> claimed -> done}/design-nfr008-spawn-account.md   renamed
```

**`git status --short -- src/` is EMPTY. Zero bytes of production or test code moved.**

**`plans/nfr-catalog.md` is a PURE ADDITION — 103 insertions, 0 deletions.** Two insertions:
one bullet inside the `N8-LANE` blockquote (the NET-of-spawn clause, placed beside the floor clause
because a role applying the bar reads the blockquote and nothing else), and the dated `N8-SPAWN`
section at the end of the `NFR-008` row.

## Byte-identity, asserted rather than claimed

| what | before | after |
|---|---|---|
| all eight rows `NFR-001`–`NFR-008` hashed together | `sha256 63f66795…ca31` | **`63f66795…ca31`** |
| each row hashed individually (8 hashes) | — | **all 8 unchanged** |
| table lines / rows | 46 / 8 | **46 / 8** |
| `N8-LANE` bar sentence | `c4921d7b…` | **`c4921d7b…`** |
| `N8-LANE` instrument clause | `0fc124af…` | **`0fc124af…`** |
| `N8-LANE` statistic clause | `81ec87e3…` | **`81ec87e3…`** |
| `N8-LANE` null-control clause | `508ca124…` | **`508ca124…`** |
| `N8-LANE` floor clause | `b2e64f08…` | **`b2e64f08…`** |
| `N8-LANE` scope / machine clauses | `736885d0…` | **`736885d0…`** |
| `N8-LANE` owner / checker paragraph | `d908251e…` | **`d908251e…`** |

The eight-row hash is the same value the `ABC-026` and `ABC-029` hops recorded, so the rows are
unchanged since 2026-08-12 and this hop did not break that chain.

## Gates, run on this branch tip after the write

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | **exit 0** — 54 files, 2 infos, no fixes applied |
| typecheck | `npm run typecheck` | **exit 0** |
| build | `npm run build` | **exit 0** (`tsc --noEmit`; honest naming per `AGENTS.md`) |
| unit | `npm test` | **exit 0 — 856/856 passed, 30 files** |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`, exit 0** |

Machine: **Darwin 25.5.0 arm64, Node v24.12.0, vitest 3.2.7**. `UNKNOWN - verify` elsewhere.

**856/856 on 30 files is the same reading the integration hop recorded on this base**, which is
expected: this hop changed one markdown file and the queue.

**No `kind: finding` and no stamp is claimed.** None is emittable on this install (`AGENTS.md`); these
are gate results recorded by the role that ran them, not a verdict.

## Queue

Claimed by hand (bare `mkdir`, exit 0, claim WON) and transitioned `pending → claimed → done` in this
tree per Workflow 17. **The same path is tracked on `main`; if the Orchestrator transitions it there
too, integrating this branch surfaces a rename conflict on the queue substrate only.** Flagged in
`claim.md` rather than avoided.

## Not touched, deliberately

`plans/tickets/ABC-042-…md` (closed), `plans/board.md`, `plans/traceability.md`,
`memory-bank/50-decisions/ADR-0008-default-test-lane-budget.md` (owner-ratified; the account is
writable without it), `.grugops/factory.config.json`, `src/`, `package.json`.
