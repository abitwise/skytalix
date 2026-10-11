---
id: 20261011T164723Z-qe-e2e-observation-abc151-merge-recheck-new-wave-tip-843d8b1b
kind: observation
by: qe-e2e
at: 2026-10-11T16:47:23Z
verified_by:
confidence: high
refs:
  - ABC-151
  - ABC-152
  - ADR-0042
  - QE-151-a
  - QE-151-c
  - sha d1dc6f63 (QE record commit on the branch)
  - sha 868f28b9 (wave tip at QE's close)
  - 20261011T164107Z-qe-e2e-observation-abc151-gap-register-5ee777b8
  - 20261011T164107Z-qe-e2e-decision-abc151-verdict-333ce1b6
supersedes:
---

# QE `ABC-151`: the wave tip moved during the hop. Re-checked: the merge now hits one append-only traceability conflict, and no code moved. Plus a note on `QE-151-a`'s carrier

This note is hand-authored and unsealed. It adds to `…5ee777b8` and `…333ce1b6`, and changes neither verdict nor
severity.

## The merge, against the new tip `868f28b9`

- **Six commits landed between `aa932974` and `868f28b9`**, all for the `ABC-152` design (`ADR-0042`, PROPOSED).
  Outside `.grugops/context/` they touch only the queue files, `ADR-0042`, `plans/board.md`, one header line in
  `plans/nfr-catalog.md` ("NO TABLE ROW TOUCHED"), and one trace row.
  - **No `src/`, `vitest.config.ts`, `package.json` or `tools/` file moved.** So the code of a merge is
    byte-for-byte the code QE tested on the `aa932974` merge (56 / 1740, gates 0, `effectiveWorkers` 2), and
    `NFR-008`'s row is still unchanged.
- **`git merge-tree --write-tree 868f28b9 d1dc6f63`** (tree objects only, no commit) finds **one conflict, in
  `plans/traceability.md`**. It is append against append: the `ABC-152 (design)` row against the
  `ABC-151 (build)` and `ABC-151 (QE)` rows. A union resolves it, the same as `QE-151-c`'s other cases. This
  replaces the "clean against the wave" line for whichever tip the Orchestrator merges onto.

## `QE-151-a`'s proposed carrier

`…5ee777b8` proposed `ABC-152` as the carrier, because it re-reads the env variable names on vitest 4.1.
`ADR-0042` (PROPOSED) now sends the 4.1 bump to the owner, and builds no runner-off lever. So `ABC-152` may not
touch the pin soon.
- **The proposal stands only if the owner picks a 4.1 route.**
- **Otherwise it is a small follow-up** (the pin's env parse only, a test file only), and BA/PM cuts it.
- The severity stays LOW. The owner stays BA/PM.
