---
id: 20261108T092943Z-orchestrator-decision-5bc9e701
kind: decision
by: orchestrator
at: 2026-11-08T09:29:43Z
verified_by: 
confidence: high
refs:
  - ABC-292
  - ADR-0076 d13 rule 2
  - ADR-0076 d14 (c)
  - ABC-290
  - ABC-293
  - ABC-308
  - …e158a4a0
  - …9e29be9d
  - …22e36b63
  - …d277788e
  - …23d30c72
  - …e63ff24f
supersedes: 
seal: sha256:29661d43948149b823a00245150adee9eb2279a7f62139d001831616d53a543d
---

## ABC-292's probe: NOT MET under rule 2; the owner's stop fires

Merged `grugops/arch-ABC-292-probe` (tip `abb81dc4`) at `2b53b8c6`, path check clean. PREREG `…e158a4a0` at `e9e23d8f` descends from the freeze `e88e91f9`. I read `raw/out/C-PR7-g1.out` myself: ON 53/58, OFF 54/58, newly missed "win material, seed 1700", none newly solved. Defect check sealed first (`…9e29be9d`) and found no defect. PR1–PR6 held. PR8–PR11 not run, no timed row, no held window used.

**So, by the sealed rule and his accepted words, with no new reading of mine:**
- The premise is NOT MET (d13 rule 2). `ABC-292` is not built and goes back to BA/PM. No number changes to pass, no subset fallback, no re-play (d14 (c)).
- **The owner's stop fires (…23d30c72):** the hand-valued path stops. `ABC-290` (E3b) and `ABC-293` (E6) are not built without his new word; nor `ABC-308` on hand values (…e63ff24f).
- `ADR-0076` reads accepted, not in force (F5).
- No third-pull door: no term merged.

**He is told, plainly,** including the weakness: one puzzle line out of 58, at depth 6, says little about play. It was still the bar he accepted, sealed before any reading, and I do not recommend setting it aside.

**Next, records only, in parallel:** `arch-ABC-292-closed` (F5 dated line; ADR-0056 D5/D6 and ADR-0067 lines that the stop fired; whether d6's cut means anything on `main` without the term) and `bapm-ABC-292-closed` (ABC-292 page closed NOT MET; ABC-290, ABC-293, ABC-308 held under the stop; EPIC-011 rows). What EPIC-011 does next on the evaluation side is his question.

Flag carried: the sealed stage-B lane read spelled `npm test` (two workers), against the one-core rule. Moot here; future PREREGs must spell one worker. Scratch copies (655 MB) removed.
