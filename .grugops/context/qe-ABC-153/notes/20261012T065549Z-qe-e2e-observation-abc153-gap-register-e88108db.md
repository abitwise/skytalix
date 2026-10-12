---
id: 20261012T065549Z-qe-e2e-observation-abc153-gap-register-e88108db
kind: observation
by: qe-e2e
at: 2026-10-12T06:55:49Z
verified_by:
confidence: high
refs:
  - ABC-153
  - ABC-145
  - QE-153-a
  - QE-153-b
  - QE-153-c
  - AR-145-CLI-WIRING
  - 20261012T065549Z-qe-e2e-observation-abc153-plants-3d6ce640
supersedes:
---

# QE `ABC-153`: gap register (none blocking)

Hand-authored and unsealed. None of these is a criterion of `ABC-153`; every criterion is MET.

| id | severity | owner | gap |
|---|---|---|---|
| `QE-153-a` | LOW | BA/PM (decide whether to cut; SE if cut) | **A check that compares only a prefix of the hash (`Q-PREFIX`, first 8 hex chars) passes the head test, 19/19** (and the base). A one-byte source change moves the whole digest, so the test never offers an expected value that shares a prefix with the actual one. Killing it is one more refusal inside the same `it`: an `expected` that equals the fixture's own hash except its LAST hex char must refuse. Not asked by `ABC-153`. Same promotion trigger as `ABC-145`/`ABC-153` (an edit to `compile.ts`'s check). |
| `QE-153-b` | INFO | — | **A case-insensitive compare (`Q-CASE`) passes.** Equivalent on every reachable input: the digest is lowercase hex and the five pins are lowercase. No action. |
| `QE-153-c` | INFO | — | **The restore after the LAST file (`e.tsv`) is observed by nothing.** Restores of `a`..`d` are observed by the next iteration (`T-NORESTORE` red on `b.tsv`), so a failed restore fails loud and never masks a later file. Nothing reads the directory after the loop, so the unobserved final restore is harmless. |
| `AR-145-CLI-WIRING` | accepted residual (unchanged) | — | Out of scope by the ticket. QE did not re-run `M07`; the head test changes nothing outside the `A1/A2` `it`, so the residual stands as BA/PM recorded it. |
