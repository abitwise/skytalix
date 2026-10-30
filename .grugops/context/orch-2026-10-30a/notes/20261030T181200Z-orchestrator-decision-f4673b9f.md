---
id: 20261030T181200Z-orchestrator-decision-f4673b9f
kind: decision
by: orchestrator
at: 2026-10-30T18:12:00Z
verified_by: 
confidence: high
refs:
  - SEC-228-a
  - plans/nfr-catalog.md
  - ABC-220
  - ADR-0052
  - AR-UCI-BUSY
  - AR-NFR004-A
  - ABC-222
supersedes: 
seal: sha256:2dc2b6ebac423d6d7618f9ddb04a03ecba2942f71a80c9d41d5dfe00a7b17463
---

OWNER WORDS, verbatim, 2026-10-30: "Catalog reference machine - Ubuntu linux machine - oeselg-devl ; Whole-second reading of "≤ 22 s" - confirm".

1. SEC-228-a: the NFR catalog's reference machine is re-based to the Ubuntu Linux host named oeselg-devl (the host every reading since 2026-10-28 ran on; AMD Ryzen AI 9 HX 370, Linux 7.0.0-42, Node v26.12.1 per qe-ABC-220). The M3 reference and Node v26.11.x lines become history. Routed to Security/NFR (catalog owner).

2. The whole-second reading is CONFIRMED: "≤ 22 s" in simple-tournament (NFR-004, ADR-0052 D3/D5, A11, AR-UCI-BUSY) reads to the whole second, i.e. < 22 500 ms. The open owner confirmation in ABC-220's FOLDED note and AR-UCI-BUSY closes; ABC-222's PREREG reads A5 against < 22 500 ms. Routed to BA/PM (tickets) and Security/NFR (catalog).
