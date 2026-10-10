---
id: 20261010T091503Z-software-engineer-observation-abc051-qe051a-fix-forward-48e3d851
kind: observation
by: software-engineer
at: 2026-10-10T09:15:03Z
verified_by:
confidence: high
refs:
  - ABC-051
  - QE-051-a
  - NFR-002
  - src/turn-loop.nfr.test.ts
  - .grugops/context/qe-ABC-051/notes/20261010T091104Z-qe-e2e-observation-abc051-gap-register-e9262a1c.md
supersedes:
---

# `ABC-051` fix-forward for `QE-051-a`: the nfr header claims only what its spies observe

Hand-authored, no seal. Orchestrator fix-forward on `grugops/ABC-051-r2` from QE's tip `6a1c6cd`.
**Comment lines only, `src/turn-loop.nfr.test.ts` only** (+9/−5). The non-comment pipeline over the
diff is empty. No spy, assertion or `it` was added.

- **Header, before:** "…and `repetitionCounts` and `keyHistory` at 0 prove the loop adds no replay
  of its own to a PLY." **After:** "`repetitionCounts` and `keyHistory` at 0 show only that the loop
  calls neither export directly — they observe those two exports and nothing else. A replay by any
  other route (`takeBack`, which rebuilds the position from `initialFen`, called on every ply) leaves
  all three counts green here: a module-boundary spy on these exports cannot see it."
- **Same overreach, same file, also narrowed:** I wrote this one at `5451323`, and QE did not name it.
  - The header's last clause went from "green on the one cost `NFR-002` forbids" to "green on a
    second key-list replay per ply". `M8` shows that a replay is not the only such cost.
  - The `it`-body comment at `:131` went from "No replay of the loop's own on an advancing ply" to
    "Neither export is called by the loop directly on an advancing run".
- **Measured after the edit:**
  - lint, typecheck and build exit 0. `npm test` exit 0, 50 files / 1,540 tests. Skip 0, and
    skip-integrity printed `No findings.`
  - `A3` grep: exit 1.
  - `M2`: tip `turn-loop.ts` pinned at md5 `f01ba3ab…`, mutant `14bbca7b…` (the same insertion; the md5
    differs only because the tip file carries the +6 comment lines). It was **red 4/4**, every failure
    `expected "keyHistory" to be called +0 times` (40/120/300/40). It was restored to `f01ba3ab…`.
  - `M8` (QE's probe): **green 4/4** in this file. That is what the new sentence now says, so the
    sentence is true.
- **Not done, by fence:** `QE-051-b` (`keyHistory` on the take-back edge, in `turn-loop.test.ts`) and
  `QE-051-c` (stale line cites in other files) are outside this file. `QE-051-d` (whether the UAT
  waiver applies) is the Orchestrator's or the owner's call. The cost of `M8` is still not measured:
  `UNKNOWN - verify`.
