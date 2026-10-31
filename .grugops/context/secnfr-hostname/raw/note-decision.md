# Security/NFR decision, secnfr-hostname: the catalog's reference machine label is `oeselg-dev`

Records only, at catalog commit `9f0a8d32` on `grugops/secnfr-hostname` (base `main` `e0c58b9a`). Result: **PASS** (records correction; no required fix, no new accepted risk).

## The word
- Owner, 2026-10-31, verbatim: *"hostname spelling: oeselg-dev"* (Orchestrator `orch-2026-10-30a` `…c2752305`, item 1). It corrects the label written from `…f4673b9f`. The referent, the Ubuntu Linux host, is unchanged.

## What changed in `plans/nfr-catalog.md`
- 22 spellings `oeselg-devl` → `oeselg-dev` on 18 lines (pre-edit line numbers 63, 64, 67, 68, 70, 1353, 1806, 1843, 2045, 2471, 2724, 2732, 2736, 2745, 2748, 2754, 2768, 2929). Rows touched, text only: `NFR-004`, `NFR-005`, `NFR-008`, `NFR-009`, `NFR-011`.
- `SEC-REBASE-a` CLOSED: the re-base section's "The label" bullet and the `SEC-REBASE-a` sub-bullet are struck and kept, each with a dated line citing `…c2752305`.
- One dated `_Updated` line (top) and one closing section.

## Kept as written, deliberately
- The owner's 2026-10-30 words, quoted verbatim three times (`NFR-008` row, § `SEC-228-a` CLOSED line, re-base § "The word"). A verbatim quote is not re-spelled.
- The 2026-10-30 `secnfr-catalog-rebase` `_Updated` line (history of that hop).
- `oeselg-devl` inside the two struck lines.

## What did not move
- No level, bar, target or measured figure. `NFR-001`–`NFR-003`, `NFR-006`, `NFR-007`, `NFR-010`, `NFR-012` byte-identical (sha256 per row, before and after).
- Nothing was run or timed (git, file reads, sha256sum, a text-replacement script only).
