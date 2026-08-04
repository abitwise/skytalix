---
id: 20260804T143000Z-software-engineer-observation-a3758376
kind: observation
by: software-engineer
at: 2026-08-04T14:30:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-012
  - ABC-012
  - tools/grugops/test-skip-integrity.js
  - .grugops/test-skips.md
  - coverage/
  - grugops/ticket-to-pr-ABC-012
  - 20260804T141500Z-software-engineer-artifact-ref-f11fbe2a
  - 20260724T115441Z-qe-e2e-observation-6479ea40
supersedes: 
---

# Three things about the gate run itself, recorded because none of them should be silent

## 1. The commits

| Commit | What |
|---|---|
| `47cad31` | `feat(history)` — `src/history.ts` + `src/history.test.ts`, the whole production change |
| `b33f6bb` | `docs(board)` — board, ticket, trace, `memory-bank/30-architecture.md`, the four context notes, the queue record |

`b33f6bb` was **amended once**, for the reason in §2. Both commits are local: this repository has
no git remote, so nothing was pushed and no PR exists.

## 2. `npx vitest run --coverage` DELETED 22 tracked files, and it was caught before it left the branch

**What happened.** `coverage/` is **tracked in git** in this repository (22 files, present at
`3a44b3f`) and is **not** in `.gitignore`. Vitest's coverage provider cleans its output directory,
so running the coverage check for `src/history.ts` wiped every one of those tracked files. A
subsequent `git add -A` staged 22 deletions and they went into the first version of the docs commit.

**What was done about it.** The deletions were spotted in `git status` immediately after the commit,
`coverage/` was restored from `3a44b3f`, `git diff 3a44b3f -- coverage` was confirmed **empty**, and
the commit was **amended**. The final commit touches exactly ten files and none of them is under
`coverage/`; the tree is byte-identical to `3a44b3f` there.

**Stated plainly rather than quietly fixed**, for two reasons. First, it is an out-of-scope change
this role made by accident, and an amended commit hides that from the log — so it is written here
instead. Second, it will happen to the next role that runs coverage, which is a normal thing for QE
and Security/NFR to do.

**Flagged, NOT fixed (`AGENTS.md` rules 9 and 12):** a generated coverage report being tracked in
git, with no `.gitignore` entry, is a repository hygiene decision for a human — not an engineer's
unrequested cleanup on a ticket about game history. Whoever picks it up should note that the
committed report is already stale: it covers eight modules and `tools/grugops/`, and predates both
`src/history.ts` and the current `src/legal.ts`.

## 3. The test-integrity checker EXISTS here and returns exit 2 — recorded as an error, never as a pass

`AGENTS.md`'s skip-count slot is what the board has always quoted, and it returns **0**. But
Workflow 05 step 3 also specifies `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md
--skip-count <N>`, and **that checker is present in this install** (unlike `scripts/claim.js` and
`scripts/context-io.ts`, which are not). Run as specified:

```
$ node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
Error: cannot read the registry file: .grugops/test-skips.md
exit=2
```

**Exit 2 is "the checker could not run", which Workflow 05 says is an error distinct from a clean
fail and must never be read as a pass.** It is recorded here as exactly that.

Three things keep it from being a gate failure, and they are stated so nobody reads more or less
into it than is there:

- **Exit 2 is not exit 1.** The human-only short-circuit to `BLOCKED_NEEDS_FIX` fires on exit `1`
  (an unjustified, expired or malformed skip). This is a missing registry file.
- **There is nothing for the registry to justify.** The suite's skipped-test count is **0**,
  measured with the `AGENTS.md` command. `.grugops/test-skips.md` has been absent since at least
  2026-07-24, when QE recorded the same conclusion for the same reason
  (`quality-gate-EPIC-001`, note `20260724T115441Z-qe-e2e-observation-6479ea40`: *"absent, and none
  needed — vitest skip count is 0"*).
- **The registry is human-owned and this role may not create it.** Workflow 05 is explicit that an
  agent may not self-author a justification to clear its own gate. No file was created.

Worth naming for whoever owns the gate next: **no board entry or trace row in this project has ever
mentioned this checker**, only the raw skip count. That is a standing gap in how the gate is
reported here, not something this ticket introduced.
