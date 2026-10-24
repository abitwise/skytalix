---
id: 20261024T155800Z-security-nfr-decision-3f3817a9
kind: decision
by: security-nfr
at: 2026-10-24T15:58:00Z
verified_by: 
confidence: high: two dated lines placed and read back; rows hashed; records only, nothing run
refs:
  - ADR-0049
  - ADR-0049 row 34
  - plans/nfr-catalog.md
  - memory-bank/50-decisions/ADR-0049-the-source-is-public-on-github-and-the-engine-still-deploys-nowhere-and-publishes-no-package.md
  - owner-word-2026-10-24/20261024T153400Z-orchestrator-decision-619938c5
  - arch-accept-adr0049/20261024T153859Z-architect-design-decision-1e9e06f0
  - grugops/security-nfr-adr0049-row34
  - 67658cb8
  - 20c32c93
  - SEC-212-b
  - NFR-004
  - AR-NFR004-A
  - security-nfr-ABC-212/20261024T124433Z-security-nfr-decision-e2c5d6b9
  - security-nfr-ABC-212/20261024T130500Z-orchestrator-decision-ad1d2563
  - qe-ABC-212/20261024T122847Z-qe-e2e-observation-f9560997
supersedes: 
seal: sha256:8c065ee798993ab89f124849d2ecec57e4af2cf26a5d7c932697a0028faf860d
---

# ADR-0049 row 34 and SEC-212-b: two dated lines in plans/nfr-catalog.md; no bound moved; records only

Security/NFR, task security-nfr-adr0049-row34. Branch grugops/security-nfr-adr0049-row34 from main 20c32c93; code commit 67658cb8. Not pushed, not merged. One file, 3 lines added and 2 removed (two edited lines plus one _Updated line). Nothing run: no npm, vitest, build or timing.

## Row 34 (ADR-0049 § Records), applied as its disposition says
- **Where:** plans/nfr-catalog.md, § Availability, the SLO table, row "An observer that could find it unreachable". A dated bracket sits in the "What is actually here" cell, directly after the statement.
- **What it says:** "No git remote" is false since 2026-10-23. The repository has one remote, and its source is public (ADR-0049 decision 1). The conclusion holds: a git host stores source and observes no running service, and nothing here runs between uses.
- **Re-read at main 20c32c93** (git and file reads only): git remote -v prints 2 lines (1 remote); 0 tracked files under .github/workflows/; plans/releases/ holds .gitkeep only; nfr.availability reads "not-applicable-local-only (...)".
- The quoted words and the 2026-08-06 "git remote -v → empty" check stay as history.
- **No bound moves.** No availability row is created; ADR-0049 § Consequences "No NFR moves" holds.

## SEC-212-b (INFO, from security-nfr-ABC-212/…e2c5d6b9), applied as a dated line
- **Where:** the NFR-004 table row, Verified by cell.
- **Struck and kept:** "UNKNOWN - verify — not built yet; verify by wall-clock over a fixed position suite." "Depends on NFR-005" stays live.
- **Placed (each part read from rulings already in the file, none new):**
  - clause A (≤ 3 s at level 5) is NOT MET and is accepted as AR-NFR004-A, max +5 ms (2026-10-24 section);
  - the ceiling is MET at levels 5, 6 and 7 on the real clock, per QE qe-ABC-212 A4: max 3 005, 5 005 and 30 004 ms against 5 000, 7 000 and 32 000;
  - levels 1–4 are held by their budgets (100–1 000 ms, src/levels.ts LEVELS, read only) under the 5 s ceiling, pinned by A5 in src/levels.test.ts. No real-clock reading at today's table is on record for them (qe-ABC-174 read them on the virtual clock), so that part stays UNKNOWN - verify.
- **Why it is in scope:** this row's 2026-08-18 fence says the cell moves "at the next Security/NFR hop that rules NFR-004", and the Orchestrator routed SEC-212-b to this hop (…ad1d2563). The QE readings were taken on the declared stack (Node v26.11.1, catalog line 2360).
- **No bound moved:** NFR-004's ID, Category, Target and Applies to cells hash identical before and after.

## Check
- Rows NFR-001 to NFR-012 were hashed before and after (scratch: <scratchpad>/sec0049/rows-before.txt, rows-after.txt). Only NFR-004 changed, and only in its Verified by cell.
- Class scan of the added lines (IPv4, personal paths, host/realm/namespace/cluster patterns, URLs, the bin name, the machine model, the reference-check word): 0 hits. Infrastructure is named by class and count only (ADR-0049 decision 4). The new lines say "the real clock" and do not name the machine model.
- No test cites this file's lines (they are records). No reference checker was run, to keep the host quiet for the QE reading.

## Owed
- plans/traceability.md was not touched (sibling hops edit plans/); the 10-cell trace row is in the brief's Result for the Orchestrator to place.
- No board move: this hop gates no ticket.
