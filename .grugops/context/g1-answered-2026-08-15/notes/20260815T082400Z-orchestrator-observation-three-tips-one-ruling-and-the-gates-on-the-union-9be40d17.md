---
id: 20260815T082400Z-orchestrator-observation-three-tips-one-ruling-and-the-gates-on-the-union-9be40d17
kind: observation
by: orchestrator
at: 2026-08-15T08:24:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - G1
  - plans/traceability.md
  - grugops/abc042-merge-key
supersedes: 
---

# Orchestrator Observation — three unmerged tips, one ruling that lived on a single branch, and the gates on their union

## What was unmerged, measured not assumed

`main` @ `65cda2e` carried `ABC-042`'s board rows, ticket page and follow-ups but **none of its
code**: `src/cli.ts`, `src/cli-options.ts` and `src/cli.test.ts` did not exist on `main`. Three
branch tips carried the work, and no one of them contained the others:

| tip | commit | contains the integrated build |
|-----|--------|-------------------------------|
| `grugops/security-nfr-ABC-042-recheck2` | `3d7ac32` | yes |
| `grugops/agents-md-ABC-042-dev-run` | `a7c94be` | yes |
| `grugops/security-nfr-ABC-042-gate` | `841cd22` | **no** — it forked at `8b07d9f` |

The first two share `d011df4` (the QE re-gate). The third is the original Security/NFR gate hop.

## The finding that mattered — `G1`'s own ruling existed on one branch and nowhere else

**The six notes under `.grugops/context/security-nfr-ABC-042-gate/notes/` — including
`…-security-nfr-decision-g1-ruling-and-owner-escalation-8833f3be.md`, the ruling this entire hold
rests on — were present on `grugops/security-nfr-ABC-042-gate` ONLY.** Checked path by path with
`git cat-file -e` against `main` and against `grugops/security-nfr-ABC-042-recheck2`: absent from
both. Its queue record `.grugops/queue/done/security-nfr-ABC-042-gate.md` **was** on `main`, so the
gap was invisible from the queue — the substrate said the subtask was done while its output was
reachable from one unmerged branch.

**Merging the two obvious tips and dropping the third would have merged `ABC-042` and deleted the
written reason it was ever held.** That is why the third was merged rather than pruned.

## Two conflicts, both the same one row, resolved cell-wise

Both conflicts were on `plans/traceability.md`, both on the `ABC-042` row (10 columns: `Ticket`,
`Title`, `Epic`, `Feature`, `NFRs`, `Code (PR/files)`, `Tests`, `UAT`, `Release`, `Status`). **The
row was taken apart by cell and put back at 10 cells both times** — asserted after each write, not by
eye. The previous hop predicted this conflict and recorded that both edits were wanted; that held.

**First conflict** (`recheck2`) — the two sides had edited different cells:

- cell 4 `NFRs` ← the Security/NFR side. `main`'s copy of this cell was **known stale and flagged as
  such in its own status cell** (*"it says three bars and there are FOUR"*), by the Orchestrator,
  deliberately not silently rewritten. The Security side is the repair.
- cells 5, 6, 9 `Code` / `Tests` / `Status` ← the `main` side. **Every sentence of the Security
  side's version of these three cells was verified to be a substring of the `main` side's version**
  (containment check, 24 sentence-chunks, 0 missing) before the Security side was let go. Nothing was
  dropped; the shorter text was strictly older.

**Second conflict** (`security-nfr-ABC-042-gate`) — different in kind, and **not resolved by
choosing**: both sides of cell 4 were **Security/NFR's own hand**, written at two hops on branches
that never saw each other. The gate write carries measurement detail the later re-check condensed
away (gross figure, machine, the per-child breakdown, the rebuilt deferred-import variant at 1.52×,
this ticket's draw on `NFR-008`'s 13 s total); the re-check carries the merging-tree verdict and the
`G1` escalation clause. **Containment ran in both directions and failed both ways** — seven chunks of
one absent from the other, twelve the reverse.

**Both texts are carried in the cell, marked, with the reconciliation routed to the cell's owner at
the re-grade hop.** Picking the later text would have been the Orchestrator deciding, at a merge,
which of Security/NFR's two accounts of its own measurement survives — the same act the previous hop
refused when it declined to accept `G1` on the owner's behalf. The cell is verbose until Security/NFR
rewrites it, which it will do in the next hop anyway.

## Gates on the union tree — `grugops/abc042-merge-key` @ `6f05887`

Run after both resolutions, on the tree that will merge, not inherited from the branches:

| gate | command | result |
|------|---------|--------|
| lint | `npm run lint` | **exit 0** — 54 files, 2 infos, no fixes applied |
| typecheck | `npm run typecheck` | **exit 0** |
| build | `npm run build` | **exit 0** (`tsc --noEmit`; honest naming per `AGENTS.md`) |
| unit | `npm test` | **exit 0 — 856/856 passed, 30 files** |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.` exit 0** |

Machine: **Apple M3, Darwin 25.5.0 arm64, Node v24.12.0, vitest 3.2.7**. `UNKNOWN - verify`
elsewhere. **856/856 on 30 files matches what QE and Security/NFR each reported against `d011df4`**,
so the union of the three tips is not a different tree from the one that was gated.

**No `kind: finding` and no stamp is claimed.** None is emittable on this install (`AGENTS.md`), and
these are gate results recorded by the role that ran them, not a verdict.

## Flagged, not repaired — a dating drift

`plans/board.md`'s current header, the four follow-up rows (`ABC-057`–`ABC-060`, `since: 2026-08-16`)
and the last board commit are dated **2026-08-16**. The commit clock for that same work reads
**2026-08-15T10:12:16+03:00**, and this hop's clock reads **2026-08-15T08:17Z**. **The board is dated
one day ahead of the repository it describes.** Flagged under coding rule 12 and **not** repaired:
the header is the board's and the `since:` dates are BA/PM's. This hop dates its own task folder
`g1-answered-2026-08-15` from the real clock rather than joining the drift.
