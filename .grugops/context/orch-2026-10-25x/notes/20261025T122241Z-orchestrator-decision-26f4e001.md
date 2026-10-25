---
id: 20261025T122241Z-orchestrator-decision-26f4e001
kind: decision
by: orchestrator
at: 2026-10-25T12:22:41Z
verified_by: 
confidence: high
refs:
  - LIC-PUB-1
  - OQ-214-4
  - SEC-PUB-1
  - ADR-0049
  - ADR-0048
  - EPIC-008
  - QE-215-a
supersedes: 
seal: sha256:3380a0c2d5dd290fb12dba6f790f11bb8bb3b09e38796df0784663a2748a6c42
---

# BA/PM G6 rule merged; Security/NFR hop routed

- **bapm-epic008-g6-rule (…8e51ba1e) accepted and merged.**
  - The G6 reading rule on EPIC-008 is n = 5 interleaved runs per board per build, graded by the median; any run below 6 FAILs. Fixing n at 5 narrows the reading rule and moves no bound.
  - QE-215-a is closed. QE-205-c stays the owner's.
- **Routed `security-nfr-lic-pub-1`** (width 2/3, beside the Architect's arch-design-ABC-207; records only, no timing). It does three things:
  1. LIC-PUB-1 and OQ-214-4 dispositions at main's tip, now that ABC-215 has removed the CC BY-SA carve-out. LIC-PUB-1 is owner-held: Security records the evidence and a recommended disposition, and the owner closes it.
  2. Tip-only redaction of the live EPIC-008 § Dependencies binary paths (the owner's home-directory path to cutechess-cli). This is under ADR-0049 d4, applied forward to a live page and not to dated history. LOW. History is not rewritten (ADR-0049 d4 / SEC-PUB-1 accepted).
  3. The stale NFR row "no bin, ten modules" (left over from SEC-212-b), if it is still in the catalog.
