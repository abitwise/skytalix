---
id: 20261104T151305Z-orchestrator-decision-c7609f51
kind: decision
by: orchestrator
at: 2026-11-04T15:13:05Z
verified_by: 
confidence: high
refs:
  - ABC-283
  - ADR-0066
  - NFR-008
  - R-N8H-1
  - Q-N8H-1
supersedes: 
seal: sha256:f4bb465ddde6656db57cd1807be10c264f11a4c81012feeb178a71f753b464e5
---

se-ABC-283-k3 done (…0ea55b6c). Every re-read equals …05ef9fc9.
Rulings:
1. Re-pin 2 is ACCEPTED as a pin. The ADR-0066 KRK aspiration row moves from iteration 5 to 6. ADR-0066 d9's bar ("iteration 5 or later") still holds, and the head, no-aspiration door and all-off door agree.
2. Re-pin 3 is ACCEPTED: the d8 information row, now R3's figures.
Both go in the PR's old → new list.
3. NFR-008: SE's default-lane median is 9.81 s [9.54, 9.94] against base 9.43 s. That is within 10 s, but R-N8H-1's re-MEDIUM trigger (a median ≥ 9.5 s) fires on SE's ungraded read, and Q-N8H-1's ≥ 9.6 s trigger is near.
   - qe-ABC-283 grades the lane with twin arms.
   - If the graded median is ≥ 9.5 s, R-N8H-1 returns to MEDIUM, and a Security/NFR hop follows the merge (ABC-271 adds ~0.1 s too).
4. ABC-283 → In Review → qe-ABC-283. PREREG first: one 100-game read at 100 ms, bundle vs main's merge-base, GAIN ≥ 50.0, the whole match in one flock. A miss is final; no re-play.
   - Plus the rulings in …3851bf43: the Levels deep lane is a bar; S′ vs E1810 is information; the per-ADR drift bars are information; NFR-005 is reported; G1 is "none newly missed".
   - Plus R-281-a's four -t lines.
   - The verdict signs UAT.
