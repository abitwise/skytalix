---
id: 20260815T210514Z-orchestrator-observation-the-three-things-the-owner-asked-about-measured-not-assumed-23d229a4
kind: observation
by: orchestrator
at: 2026-08-15T21:05:14Z
verified_by: 
confidence: high
refs:
  - biome.json
  - plans/board.md
  - .grugops/queue/pending/design-adr0007-deploy-authority.md
  - .grugops/queue/claimed/agents-md-owner-grants/
supersedes: 
---

# What the owner asked, and what the tree actually says

The owner's words: *"tests pass, typecheck is fine but linter has few errors. These need to be
fixed, also there are lots of branches, make sure the ones that need to be merged are merged and
the ones that are merged will be deleted."*

Every number below was RUN on this worktree at `c732fe2` before it was written down. The clock
reads `2026-08-15T21:05:14Z` from `date -u` on this machine, which is BEHIND the session date
(2026-08-16) and behind several `at` values already in this repository's shared context. The
measured value is recorded; no timestamp was moved forward to make replay order look tidy.

## 1. The linter is GREEN. It has zero errors — and it is not clean either.

| Command | Exit | Output |
| --- | --- | --- |
| `npm run lint` | **0** | `Checked 54 files in 89ms. No fixes applied. Found 2 infos.` |
| `npm run typecheck` | **0** | — |
| `npm test` | **0** | 30 files, 856/856 |

**The owner's report is half right and the half that is wrong matters.** `biome check .` found
**2 diagnostics, both `info`, both about `biome.json` ITSELF — not one about a line of source.**
Biome does not fail on `info`, so `quality.mandatory_gates`' `lint` step has been passing while
printing them. Nobody was lied to; the gate is doing exactly what it is configured to do, and a
human reading its output sees two red-looking blocks under a green exit code.

The two:

1. `biome.json:2:14` — `"$schema": "https://biomejs.dev/schemas/2.3.0/schema.json"` against an
   installed CLI of **2.5.5**. `devDependencies` pins `"@biomejs/biome": "^2.3.0"`, which
   ADMITS 2.5.5, so the drift arrived by an ordinary caret resolve — no one edited anything.
   Biome's own remedy is named in the output: `biome migrate`.
2. `biome.json:12:13` — `linter.rules.recommended` is **DEPRECATED** and "will be removed in the
   next major version of Biome". Use `preset` instead. This is a dated fuse, not a preference.

**The hazard to hold while fixing it: `recommended` → `preset` is a RULE-SET change, not a
rename.** If the migration alters which rules run, `npm run lint` can go from 2 infos to N real
findings across 54 files. That is a discovery, not a licence to mass-edit source — coding rules 9
and 10 bind.

## 2. Branches: 80 total, 78 already merged, 2 not.

`git branch --merged main` / `--no-merged main`, counted:

- **78** `grugops/*` branches are ancestors of `main` — safe to delete, nothing is lost.
- **2** are NOT merged, and both are docs/notes-only. Neither touches `src/`:
  - `grugops/design-adr0007-deploy-authority` (`eca0f10`) — the ADR-0007 amendment for the
    owner's 2026-08-15 deploy grant: 176 lines into
    `memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md`, 4 context notes, and it
    carries `.grugops/queue/pending/design-adr0007-deploy-authority.md` → `done/`.
  - `grugops/security-nfr-ABC-041` (`34af5e5`) — 5 Security/NFR notes from the ABC-041 L1 review.
    Notes only; `ABC-041` itself is long since Done and merged.
- `git merge-tree --write-tree` returns **0** for both against `main`: **both merge clean.** The
  rename conflict the ADR-0007 hop flagged in its own claim record did NOT materialise, because
  the Orchestrator never took the `pending → done` transition on `main`.

**10 of the 80 branches are checked out in `git worktree`s** (9 siblings of this repo plus one in
`/private/tmp/.../scratchpad/wt-sec2`). All ten report `git status --porcelain` **empty** — zero
uncommitted bytes anywhere. A branch checked out in a worktree cannot be deleted until the
worktree is removed, which is why the branch list never drained on its own.

## 3. The queue is NOT empty, and the board's last header is now stale.

- `.grugops/queue/claimed/agents-md-owner-grants/` — the claim the previous Orchestrator escalated
  rather than swept, then 6h54m past a 30-minute TTL. **Its work has since been merged:** `main`'s
  tip `c732fe2` IS `Merge branch 'grugops/agents-md-owner-grants'`. The claim is not stale work,
  it is a **finished** claim that was never moved to `done/`.
- `.grugops/queue/pending/design-adr0007-deploy-authority.md` — the one pending entry, and the
  task file for unmerged branch #1 above. Merging that branch drains it.
- The board header therefore states two things that are no longer true: that `AGENTS.md` "carries
  ZERO mentions of the owner's 2026-08-15 grants and still reads 'Never deploy'" (it now carries
  both, at `## Deployment posture` and `## Safety rules`), and that three gated commits sit
  unmerged on `grugops/agents-md-owner-grants` (they are in `main`).
