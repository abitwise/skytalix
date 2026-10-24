---
id: 20261024T153859Z-architect-design-decision-1e9e06f0
kind: decision
by: architect-design
at: 2026-10-24T15:38:59Z
verified_by: 
confidence: high: a records-only transcription of the owner's word; every edited sentence read at main 2a1a7c93
refs:
  - ADR-0049
  - ADR-0007
  - ADR-0018
  - ADR-0044
  - ADR-0048
  - ABC-214
  - SEC-PUB-1
  - README
  - owner-word-2026-10-24/20261024T153400Z-orchestrator-decision-619938c5
  - arch-public-posture-adr/20261024T103602Z-architect-design-decision-9e0aa7c8
  - memory-bank/50-decisions/ADR-0049-the-source-is-public-on-github-and-the-engine-still-deploys-nowhere-and-publishes-no-package.md
  - memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md
  - memory-bank/50-decisions/ADR-0018-distribution-channel-git-clone-npm-run-chess.md
  - memory-bank/50-decisions/ADR-0044-the-engine-speaks-uci-through-a-second-entry-point-over-the-unchanged-core.md
  - memory-bank/70-runbook.md
  - memory-bank/30-architecture.md
  - grugops/arch-accept-adr0049
  - bd1d22dc
  - 2a1a7c93
supersedes: 
seal: sha256:3cfbf37d8fb7155d03179689be44a4f91c4dbbd0c9fdb2bcf7aed404e8cab38d
---

# ADR-0049 ACCEPTED (owner word …619938c5 item 1) and its 14 Architect/Design § Records rows applied; records only, src/tools/package.json diff empty

Branch `grugops/arch-accept-adr0049`, cut from `main` `2a1a7c93`. Commit `bd1d22dc`. Six files under `memory-bank/`, all dated additions. Nothing else moves.

## ADR-0049
- **§ Status PROPOSED → ACCEPTED** on the owner's verbatim *"accept ADR-0049"*. The PROPOSED block stays below as history ("Previously").
- Status records the re-read at `2a1a7c93` (one remote; `"private": true`, `"license": "Apache-2.0"`, the same `bin`, no `main`/`exports`/`files`/`prepare`; `.github/` = `copilot-instructions.md` only; `plans/releases/` = `.gitkeep` only; no tracked YAML or deploy file; config values unchanged).
- Decision 5's window is closed: `ABC-214` (`59f50717`) is inside the owner-pushed `main` `3497aad2` (owner word item 2).
- The owner reports GitHub checked (item 3); he gave no per-item values, so § Consequences' owner-side items are not restated.
- § Records gains one "Applied 2026-10-24" line naming the applied and the not-applied rows.

## Rows applied (14), each tagged "2026-10-24 (`ADR-0049` row N)"
- `ADR-0007`: row 2 (dated line under Fact A: the `D3` leg no longer holds; Fact A holds through `D1`, `D4`, `"private": true`); row 4 (dated line under § Pointers 2026-10-11: the qualifier is dropped, exit 2 is a real `UNKNOWN - verify`); row 3 (§ Note 2026-10-24: `D3` fired, clause 1 holds, ADR-0049 is the `D5` superseding record) plus a matching § Status pointer, as the 2026-10-23 note had.
- `ADR-0018`: row 7 (§ Status line: Decision 3's third trigger fired, ADR-0049 is the superseding record, the channel is unchanged); row 8 (dated line under the Alternatives table); rows 9 and 10 (§ Note 2026-10-24: `D3` fired; `npx` from the git URL is attemptable and not offered, ADR-0049 decision 3).
- `ADR-0044`: row 12 (D8 last bullet), row 15 (the AGPL "Source" link withdrawal stands; Apache-2.0 has no network-source clause, `UNKNOWN - verify`), row 18 (§ Consequences distribution pointer).
- `70-runbook.md`: row 31 (§ Deploy 2026-08-06 bullet), row 32 (after the 2026-09-19 bracket), row 30 (§ Roll back: public source cannot be recalled; making the host repo private is the owner's step; a package's procedure stays owed at `EPIC-006`).
- `30-architecture.md`: row 33 ("Nowhere to push" bullet).

## Not done here (by design)
- Rows 20–24 are BA/PM's; rows 28, 29, 35 are the Scribe's; row 34 is Security/NFR's.
- No falsifier row and no dated history was edited. `00-index.md` lists no per-ADR status (stale since ADR-0017), so it is not touched. No board edit; the trace row goes in the brief's Result.

## Check
- `git diff --stat 2a1a7c93..HEAD -- src tools package.json` prints nothing.
- A class pattern scan over the added lines (IPv4, personal paths, host/realm/cluster/namespace/domain patterns) found 0 hits. `FORBIDDEN` (the reference-check rule) appears 0 times in the six files; the checker was not run, to keep the host quiet for the alone timing run.
