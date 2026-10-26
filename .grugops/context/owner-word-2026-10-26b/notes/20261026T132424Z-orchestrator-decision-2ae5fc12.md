---
id: 20261026T132424Z-orchestrator-decision-2ae5fc12
kind: decision
by: orchestrator
at: 2026-10-26T13:24:24Z
verified_by: 
confidence: high
refs:
  - ADR-0025
  - ABC-209
  - EPIC-008
  - QE-205-c
  - NFR-005
  - orch-2026-10-26v/…4e166e7b
  - orch-2026-10-26u/…388d6d51
supersedes: 
seal: sha256:ef2d46932d1e7fb30380ba0412135728b42d79def31dd742e7b0a75fadb6ea00
---

# The owner's in-session word, 2026-10-26 (second). This is a transcription, not a stamp

Verbatim: *"1. yes; 2. A;"* (Olger Oeselg). He is answering my two questions as numbered:
1. **The ADR-0025 decision 4 amendment (per-game transposition table, ABC-209) is ACCEPTED by the owner.** He was told my forecast before he answered: a 3–6 % node saving, D likely NEUTRAL, ~12 h including the extension, and my lean to decline (…388d6d51, …4e166e7b).
   - Under reading (b), the gate on the build, the ALONE reading and the merge is now met. The QE verdict still decides the merge.
   - It is in force on main at ABC-209's merge.
   - If S1 is NOT MET, a dated line records "accepted, not in force on main" (the ADR-0026 d9 precedent).
2. **G6 "≥ base" stays a graded pass/fail rule (option A).** QE-205-c is CLOSED. The EPIC-008 G6 row already reads this way by default; it now rests on the owner's word, not on a default.
   - For ABC-209 specifically, G6 is a regression guard only (A1: a fresh process is node-equal).

**Also noted:** main was pushed by the owner. `origin/main` equals `main` at b6b18ee3, checked after a fetch.

**Routed (width 3/3):**
- `ticket-to-pr-ABC-209`: SE build. No real-clock timing, no G6, no games.
- `arch-accept-adr0025-d4`: records only.
- `bapm-records-owner-b`: records only. A dated EPIC-008 line saying G6 = A on the owner's word, closing QE-205-c. On the ABC-209 page, the `adr:` line and a front-matter sync (the LOW carried in …4e166e7b).

**Still open with the owner:** an optional veto of the ABC-207 close.
