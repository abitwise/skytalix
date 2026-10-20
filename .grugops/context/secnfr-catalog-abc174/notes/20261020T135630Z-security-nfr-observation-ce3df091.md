---
id: 20261020T135630Z-security-nfr-observation-ce3df091
kind: observation
by: security-nfr
at: 2026-10-20T13:56:30Z
verified_by: 
confidence: high
refs:
  - ABC-174
  - NFR-008
  - R-174-1
  - R-173-1
  - SEC-174-1
  - plans/nfr-catalog.md
  - .grugops/queue/pending/secnfr-catalog-abc174.md
  - NFR-001
  - NFR-002
  - NFR-003
  - NFR-004
  - NFR-005
  - NFR-006
  - NFR-007
  - NFR-009
  - NFR-010
  - b6f2a48a
supersedes: 
seal: sha256:bc7b99cff272116659b4bb2c49c26bdcad6acf27c20ce6ec35fc71ac0cc93952
---

# `plans/nfr-catalog.md` after `ABC-174` merged (`8522609d`): three insertions and one new section. Every other row is byte-identical

Recorded as an `observation`. The writer refused it as an `artifact-ref`, because that kind needs `sha`, `gate_run` and `content_hash`, and this records-only edit has no gate run and no commit. None was invented.

Uncommitted on `main`'s working tree. The base is `HEAD` `b6f2a48a` (blob `8c5e7fff`, `ffa1f4ce`'s). After the edit
the blob is `459612a3`, and the file's sha256 is `c586a2f1…aa56c`. Nothing was run or timed.

**What changed** (line-level `difflib` against the saved before-copy: 2 inserted blocks, 2 replaced lines, 0 deletions):
1. **`_Updated:` line** inserted at line 2.
2. **`NFR-008` row** (line 56): pure insertion of 677 chars. Removing the inserted span gives back the old line exactly.
3. **`THE LEVEL LAYER` bullet** (line 1406, was `:1405`): pure insertion of 704 chars, same check.
4. **New closing section** "`ABC-174` MERGED (`8522609d`) …", lines 2288–2384 (97 lines appended).

**Row hashes** (sha256 of each `| NFR-0…` table line, no trailing newline), before → after:
- `NFR-001` `27050903…3fd4`, `NFR-002` `b7ccca57…8ab5`, `NFR-003` `f04aafdd…a65b`, `NFR-004` `d8cc1bf9…faca`,
  `NFR-005` `f2816941…f38a`, `NFR-006` `594c59db…7afd`, `NFR-007` `20022010…63ae`, `NFR-009` `70b3a777…9bd6`,
  `NFR-010` `58d6555b…1fb7`: **identical**.
- `NFR-008` `12775bbd…ec39` → `c4606b41…64d1`: changed by the insertion above only.
- There are 10 rows before and 10 after, and every row has 5 cells (escaped pipes ignored).
- Every line of the file outside lines 2, 56, 1406 and 2288–2384 is byte-identical to `HEAD`.

**Not touched:** `src/`, `tools/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`, ADRs, ticket pages, and
`.grugops/context/arch-lane-under-10s/`. Nothing was pushed or merged.
