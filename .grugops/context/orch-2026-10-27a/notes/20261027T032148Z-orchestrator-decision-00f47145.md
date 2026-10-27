---
id: 20261027T032148Z-orchestrator-decision-00f47145
kind: decision
by: orchestrator
at: 2026-10-27T03:21:48Z
verified_by: 
confidence: high
refs:
  - ABC-209
  - ADR-0025
  - EPIC-008
  - qe-ABC-209/…e32e0ee4
  - qe-ABC-209/…0932c037
  - orch-2026-10-26u/…388d6d51
  - orch-2026-10-26a/…5c59d85e
supersedes: 
seal: sha256:796830e91fb477f754dc6894a71ff818124d7becb73c3cbbe227bb6bab450151
---

# qe-ABC-209 FAIL on A6 (S1 NOT MET): not merged; S1 call to BA/PM, ADR-0025 not-in-force line to the Architect

- **Accepted qe-ABC-209 FAIL (…e32e0ee4, failed-attempt …0932c037) at b5f46e86.** This was ABC-209's single reading, and it is final under …4c3f7639.
  - A1–A5 and A7 are MET. The pre-check was 8/8 equal; G6 and G2 are MET.
  - **D:** d1 NEUTRAL −0.9 ± 25.3, then the one extension d2 NEUTRAL +18.3 ± 26.3. Pooled over 800 games: **NEUTRAL +8.69 ± 18.25**. S1 is NOT MET.
  - The grade does not change on the load-free or by-power cuts. D did exercise the change: about 98 % of the candidate's searches kept the table.
  - This matches the forecast given to the owner before his yes (…388d6d51).
- **Not merged.** grugops/ABC-209 @ bb6cf451 and grugops/qe-ABC-209 @ 694aa3af are kept, not deleted. Main src is unchanged, so no revert is owed. QE records reach main by path only (leak scan: 0).
- **Board:** ABC-209 moves In Review → Backlog, blocked on `bapm-s1-ABC-209`. In Review is 0/3.
- **Routed (records only, width 2/3):**
  - `bapm-s1-ABC-209` (BA/PM). The S1 call. The delivery default is **close unmerged**, as with ABC-207 (…5c59d85e): a re-tune needs a second reading, which goes beyond …4c3f7639. BA/PM may write it as an owner question if a variant is predicted to reach GAIN. Also on the page: the QE-209-c line (A6 says "one process across games"; the harness runs one per game). Plus the EPIC-008 lines, and whether ABC-210 is pullable.
  - `arch-adr0025-not-in-force` (Architect). A dated line on the ADR-0025 D4 amendment: "accepted, not in force on main", as was done for ADR-0026 d9.
- **QE-209-a MEDIUM / QE-209-b LOW:** test gaps on unmerged code. They are not owed unless the ticket is re-opened.
- **QE-209-f, INFO, host:** on battery the host fell to 16 % during d1 and the start of d2, before AC returned. A host that sleeps would have made D UNRESOLVED.
  - Protocol detail (mine): before an ALONE run, I tell the owner to keep the machine plugged in or above ~30 %. Battery is still allowed.
