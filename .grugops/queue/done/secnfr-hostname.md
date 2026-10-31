---
subtask: secnfr-hostname
role: security-nfr
ticket: catalog reference machine (owner word …c2752305)
ref: .grugops/context/secnfr-hostname/
branch: new grugops/secnfr-hostname from main (worktree .claude/worktrees/secnfr-hostname)
width: records only; no vitest, no timing, no engine runs. A 400-game batch will hold the host ALONE. Leave no process running.
---
# Security/NFR (records): reference machine hostname is `oeselg-dev`
## Read
The owner note .grugops/context/orch-2026-10-30a/notes/20261031T073000Z-orchestrator-decision-c2752305.md (verbatim: "hostname spelling: oeselg-dev"); the earlier note …f4673b9f; plans/nfr-catalog.md.
## Do
- Correct every `oeselg-devl` in plans/nfr-catalog.md to `oeselg-dev`, with a dated line citing …c2752305. The referent (the Ubuntu Linux host) is unchanged.
- List any other live record (memory-bank/, AGENTS.md, tickets or epics) that carries the old spelling, for the owning role. Do not edit those. Leave historical board `_Updated` lines and sealed notes as they are.
## Fences
Records only: plans/nfr-catalog.md and your notes. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `secnfr-hostname`, contextRoot = worktree), commit, `## Result` here, brief + claim to done/.

## Result
**PASS (records).** No required fix, no new accepted risk. Catalog commit `9f0a8d32`.
- **`plans/nfr-catalog.md`:** 22 spellings `oeselg-devl` → `oeselg-dev` on 18 lines (rows `NFR-004`, -005, -008, -009, -011, text only; § `ABC-074` scope, per-set `F` list, § `ADR-0035` item 3, § `NFR-008` stack, `AR-UCI-BUSY`, the re-base section, `ABC-221`'s scope line). One dated `_Updated` line citing `…c2752305`, and a closing section.
- **`SEC-REBASE-a` CLOSED:** its two lines are struck and kept, each with a dated line.
- **Kept as written, deliberately:** the owner's 2026-10-30 words, quoted verbatim 3 times (a quote is not re-spelled); the 2026-10-30 `secnfr-catalog-rebase` `_Updated` line (history); the old spelling inside the two strikes.
- **Checks:** 12 NFR rows hashed before and after; only -004, -005, -008, -009, -011 changed. Host-path scan: 0 hits.
- **Other live records with the old spelling (not edited), for Architect/Design:** `ADR-0035` (3: lines 104, 754, 779, all `arch-g8-headroom` 2026-10-30) and `ADR-0046` (1: line 220). `AGENTS.md`, tickets and epics: none. History left as is: board `_Updated` lines 1, 23, 26; done briefs `arch-g8-headroom`, `secnfr-ABC-244`, `secnfr-catalog-rebase`; 12 files under `.grugops/context/`.
- **Notes sealed** (context-io `admitAndAppend`, read back 2): decision `20261031T061916Z-security-nfr-decision-5ce20209`, observation `20261031T061916Z-security-nfr-observation-8b4e0311`.
- **Ran:** git, file reads, `sha256sum`, a text-replacement script and the seal script. No vitest, timing, engine or build. No process left running. Nothing pushed or merged.
