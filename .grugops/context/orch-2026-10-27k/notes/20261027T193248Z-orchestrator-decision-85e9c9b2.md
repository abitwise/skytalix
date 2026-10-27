---
id: 20261027T193248Z-orchestrator-decision-85e9c9b2
kind: decision
by: orchestrator
at: 2026-10-27T19:32:48Z
verified_by: 
confidence: high
refs:
  - ABC-210
  - ADR-0051
  - ADR-0050
  - EPIC-008
  - qe-ABC-210/…b953e670
  - qe-ABC-210/…86b45c13
  - qe-ABC-210/…e7597a78
  - orch-2026-10-27j/…334b383d
supersedes: 
seal: sha256:b6bfef68e8bf2bd3afc5f6f989f05b7b83fe6fa894e063ad14796b34d3fb13f9
---

# qe-ABC-210 FAIL on A5: S1 NOT MET. ABC-210 not merged; close routed

**QE verdict (…b953e670):** gate, G2, G6 (≥ base, both boards), G5/G7/G8/G11 all MET; A1 6 156/6 156; moved rows exactly the ruled set. **D under S1: NOT MET** — d1 NEUTRAL −1.7 ± 22.8, extension d2 NEUTRAL −7.8 ± 23.0, pooled 800 games NEUTRAL −4.78 ± 16.21 (failed-attempt …86b45c13). One run, final (…4c3f7639). UAT not signed. `grugops/ABC-210` is NOT merged; kept unmerged with `grugops/qe-ABC-210` (records brought by path only).

**Delivery calls (…5aaf7cec):**
1. **Close unmerged under S1 is the default**; a re-tune would need a second real-clock reading, which is the owner's. BA/PM writes the close (or, only if it judges a re-tune genuinely promising, an owner question — not a decision).
2. **ADR-0051: accepted, not in force on main**, the ADR-0025 D4 / ADR-0026 d9 precedent. The ADR-0050 d9 P2 line: did not land; `zugzwang.005` stays at depth 12 on main. Architect records both.
3. AGENTS.md check-extension lane line does not land.
4. QE-210-a/c INFO, QE-210-b LOW closed as blind spot. QE-210-d (host: foreign vitest overlapped 144 d1 games; battery 100 → 40 % in d2) does not change the grade — every split NEUTRAL. QE-207-g recurred (claim ~12.7 h vs 30 min TTL), carried.

**EPIC-008:** ABC-210 was the last engine change. With it closed, only ABC-208 shipped. The epic close follows: the closing M1 R reading (200 games vs Stockfish 19 at E 1 910, ALONE) and the 30-architecture re-pass. BA/PM states the close path in its Result; I route it after.

**Routed (width 2/3, records only):** `bapm-s1-ABC-210`, `arch-adr0051-not-in-force`. Board: ABC-210 In Review → Backlog, blocked on `bapm-s1-ABC-210`.
