---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-11T10:23:46Z
sealed: false
refs: [ADR-0040, ADR-0038, ABC-144, ABC-085, ABC-146]
---

# Owner word, 2026-10-11: ADR-0040 ACCEPTED (k = 3) and the ADR-0038 addendum ACCEPTED

Verbatim: "accepr ADR-0040 and ADR-0038"

1. **ADR-0040: ACCEPTED as it stood when asked, with its Window A addendum** (k = 3).
   - The default lane runs `maxWorkers: 3`.
   - The pin checks the value: `toBe(3)`, and the env may lower the cap, never raise it.
   - `isolate` stays on.
   - The question put to the owner was "accept ADR-0040 at 3 workers".
2. **ADR-0038: the 2026-10-11 addendum is ACCEPTED.** ADR-0038 itself was already accepted on 2026-10-10, so the only thing owed was the
   addendum. The Orchestrator reads "ADR-0038" as that addendum.
   - The verdict mode runs the same harness under plain node: about 10 h, against about 44 h in vitest.
   - The digest-equality check against vitest `LADDER_DEEP=1` must pass before any verdict is quoted.
   - The owner may correct this reading.
3. **Not answered:** what "choking" means (CPU, lag or heat). It does not block ABC-144; ADR-0040's rule already picked k = 3.
   Window B logs the thermal pressure level, which gives the first heat evidence.
4. This is the Orchestrator's transcription of the owner's word in session, not a stamp.
