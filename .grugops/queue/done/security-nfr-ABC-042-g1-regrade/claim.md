---
task: security-nfr-ABC-042-g1-regrade
by: security-nfr
at: 2026-08-15T22:40:00Z
---

# Queue claim — `security-nfr-ABC-042-g1-regrade`

**Claimed BY HAND per `AGENTS.md`.** `scripts/claim.js` is absent from this repository and from the
kit, so `claimTask()` cannot be called. The protocol was executed literally instead:

```
mkdir -p .grugops/queue/claimed                              # parent, idempotent
mkdir    .grugops/queue/claimed/security-nfr-ABC-042-g1-regrade   # BARE — the atomic act
                                                             # exit 0  ->  CLAIM WON
```

A bare `mkdir` on an existing directory exits non-zero (`EEXIST`), which is the unambiguous
"claim lost" signal Workflow 17 names. It exited 0, so this claim is uncontended and single-writer.

`claim.md` is the now-running registry record and is **NOT a `kind: claim` note** — Workflow 17's
critical distinction, restated here only because this claim was hand-rolled.

## Branch

`grugops/security-nfr-ABC-042-g1-regrade`, branched from **`grugops/abc042-merge-key` BY NAME** at
its tip **`b891880`** — the commit that adds this subtask file. The subtask deliberately wrote no
`base:` sha for the reason it names: a sha in a file cannot name the commit that creates it. Verified
after branching that `.grugops/queue/pending/security-nfr-ABC-042-g1-regrade.md`,
`.grugops/context/g1-answered-2026-08-15/` and `plans/nfr-catalog.md` § `N8-SPAWN` are all present in
the working tree, so `parent_ref:` and the account under re-grade are both reachable.

**`main` was NOT merged in.** It is not an ancestor of this branch's `ABC-042` content.

## Scope taken

Re-grade `G1` (`ABC-042` vs `N8-LANE` as amended by `N8-SPAWN`) on the tree that merges; rule whether
the ASVS L1 `PASS_WITH_RISKS` still stands over the delta since `d011df4`; reconcile the two parallel
Security/NFR writes in `plans/traceability.md`'s `ABC-042` `NFRs` cell into one text at 10 cells.

**Not taken:** no bar moved, no byte under `src/`, no edit to `plans/tickets/ABC-042-…md` (closed),
no edit to `plans/nfr-catalog.md` or `ADR-0008` (read-only to this hop), no board move, no merge, no
deploy.
