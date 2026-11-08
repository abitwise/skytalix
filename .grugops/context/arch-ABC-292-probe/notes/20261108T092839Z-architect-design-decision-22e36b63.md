---
id: 20261108T092839Z-architect-design-decision-22e36b63
kind: decision
by: architect-design
at: 2026-11-08T09:28:39Z
verified_by: 
confidence: high that the probe ran as sealed and the miss is real by its rule; low on what one puzzle row says about play
refs:
  - arch-ABC-292-probe
  - ABC-292
  - ADR-0076
  - ADR-0076 d13
  - ADR-0076 d14 (c)
  - ADR-0076 F5
  - ADR-0056
  - ABC-290
  - ABC-293
  - ABC-308
  - EPIC-011
  - E5
  - G1
  - orch-2026-10-30a/…23d30c72
  - orch-2026-10-30a/…e63ff24f
  - arch-ABC-292-probe/20261108T092441Z-architect-design-decision-e158a4a0
  - arch-ABC-292-probe/20261108T092710Z-architect-design-decision-9e29be9d
supersedes: 
seal: sha256:d6ec9f75851ea75641b4f8cf5b08bafc2f3a4be016735f03702b1419feb2c84f
---

# arch-ABC-292-probe decision: **the premise is NOT MET, by rule 2.** PR7 has one NEWLY-MISSED line, and the defect check found no defect. `ABC-292` is not built and goes back to BA/PM. The probe has ended: nothing timed ran, and stage B is not asked for

Architect/Design, task `arch-ABC-292-probe`. Readings: `raw/notes/note-readings.md`, sealed beside this note. PREREG `…e158a4a0` (commit `e9e23d8f`, a descendant of `e88e91f9`). Addendum 1 `…9e29be9d` (commit `7f109cd2`). Tree: `main` `3cbf5374`, `src/` tree `bba42fb7`.

## The decision, by the sealed rule
- **Rule 1 does not fire.** PR1 is exact, and PR2, PR3 and PR4 read 0 mismatches. The prototype is d2 to d5 as written, and QE's frozen rows and d2's words agree with it.
- **Rule 2 fires.** PR7's bar is "no NEWLY-MISSED line". ON misses "win material, seed 1700", which OFF and the baseline solve. The defect check, its form sealed before it ran, found no defect: the instrument is the suite's, the miss reproduces in a fresh process, the source is d5's, and the seam is exact on 19 145 positions of the puzzle's tree. **The miss is real, so the premise is NOT MET.** PR5 and PR6 held, and that does not change it.
- **Rule 2's words, applied:** "`ABC-292` is not built, and it goes back to BA/PM. No number is changed to pass. There is no subset fallback: dropping a term after a safety read is choosing with the row in hand."
- **Rules 3, 4, 5 and 6 are not reached.** By the PREREG, a real rule 2 miss ends the probe at once. PR9, PR10 and PR11 did not run, and stage B (PR8, PR10's timed parts, the lane read) is not asked for. The stage B scripts stay sealed and unused.

## What follows, by records already in force. These lines only name them; carrying them is the Orchestrator's
- **`ADR-0076` F5:** the probe's rule 2 is in F5's list. "`ABC-292` is not built. This ADR reads 'accepted, not in force'." Its dated line is owed by Architect/Design. The brief fences this hop to stage A, and the Orchestrator rules first, so it is not written here.
- **d14 (c):** "A miss is … the probe's rule 2". So no second set of values for `BISHOP_PAIR`, `ROOK_OPEN_FILE` or `ROOK_SEMI_OPEN_FILE`. A new form needs a new definition, a reason drawn from no missed read, its own ADR and his acceptance.
- **The owner's ruling (`…23d30c72`, in d14 (c)'s dated line and `ADR-0056` D6):** "any miss in that list is the stop for the hand-valued path, and E3b (`ABC-290`) and E6 (`ABC-293`) are not built after it without a new word from him." The Orchestrator's `…e63ff24f` reads it as covering outposts (`ABC-308`) on hand values too. **The owner is told** (rule 2 and d13 route the ticket to BA/PM, and the ruling makes the next step his).
- **Not changed:** d2's definitions, d3's rule and values, d4, d5, d6's ratio, d8's intent, any bar, the term order and QE's freeze. No value was moved to pass, no row was re-played, no budget, step or depth was moved, and no single term was read on a safety row.
- **Still true, and unread:** d6's cut is "worth having whatever happens to the term … If the term is refused or misses, it needs only d4's file word". PR4 (d) shows `cut` `Object.is`-equal to `cand` on every corpus. Whether it is worth a ticket of its own is the Orchestrator's; its cost is `UNKNOWN - verify`.
- **Branch:** `grugops/arch-ABC-292-probe` carries records only (this task's notes, `raw/`, `ADR-0024`'s dated pointer). No `src/`, ticket, EPIC or board line was changed.

## Confidence
High that the probe ran as sealed and that the miss is real by its rule: the run is deterministic and reproduced, and the prototype is exact on every arithmetic row. **Low on what it says about play.** One puzzle row out of 58 decides this premise, as K3 and d13 wrote it before any reading. That is the bar as accepted, and it is not re-weighed here.
