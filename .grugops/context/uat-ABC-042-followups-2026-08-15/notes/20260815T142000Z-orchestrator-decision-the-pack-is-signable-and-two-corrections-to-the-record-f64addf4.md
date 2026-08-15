---
id: 20260815T142000Z-orchestrator-decision-the-pack-is-signable-and-two-corrections-to-the-record-f64addf4
kind: decision
by: orchestrator
at: 2026-08-15T14:20:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - ABC-061
  - ABC-062
  - ABC-063
  - ABC-064
  - ABC-065
  - .grugops/context/uat-ABC-042-amend/notes/
  - .grugops/context/uat-ABC-042-cut/notes/
  - plans/board.md
supersedes: 
---

# Close of `uat-ABC-042-followups-2026-08-15` — the pack is signable, five tickets are cut, and two things I told the owner were wrong

## The two corrections, first, because I am the one who relayed the errors

**1. "Silently" was false. I said it twice.** I reported the missing-`--` case to the owner as *"the
flag is silently discarded"* and as *"defeated silently with a success code."* **npm WARNS**:
`npm warn Unknown cli config "--ascii". This will stop working in the next major version of npm.`
The UAT Planner caught the error in its own original wording and disclosed it; **I re-ran the command
myself rather than relay a second-hand correction.** The true statement: the flag is dropped, npm
warns, the program draws its **default** style — so a terminal user who asks for letters gets 32
figures — and it exits `0`. Still worth a ticket (`ABC-065`). Not silent.

**2. One of the seventeen passes I reported was not evidence when I reported it.** The planner
disclosed that its original UAT-8 run was **non-discriminating**: piped, the default output and the
`--ascii` output are byte-identical, so the scenario could not have failed. This is the same blindness
QE found independently by mutation (`M1`), reached from the opposite direction. Re-evidenced under a
real pty: no flags → 32 figures, `--ascii` → 0, `--unicode` → 32. **`--ascii` does work.** The
original scenario just did not show it.

**Both corrections came from the agents' own disclosures, not from an audit that caught them.** That
is twice now on this ticket — the `random` scenario, and these. Recorded as the control it is.

## What landed

**The pack: 19 scenarios, nine of nine gaps CLOSED, none declined, none argued away.** The floor
(`B8`) is discharged — the checklist can now satisfy its own exit criterion. `B6` is closed as a
four-row table headed **`ABC-042` meets ZERO of `EPIC-006`'s FOUR acceptance criteria**, plus a
signoff item forcing the signer to acknowledge it. Two new scenarios were **written AND RUN** against
a tree proven byte-identical to `main`. The amended pack **supersedes** the original note; nothing
was mutated.

**The tickets: `ABC-061`–`ABC-065`, all `Backlog`, 11 points, no `XL`, median 159 lines** against
rule 2's 300-line budget. 19 recommendations → 17 distinct (2 exact duplicate pairs) → 6 excluded as
the amendment work itself → 11 candidates → **5 cut, 3 rejected.** Each rejection is recorded as an
open question rather than a ticket, on the correct principle: **a ticket whose acceptance criteria
cannot be written without silently making a ruling must not be cut.**

## What I am NOT doing, and why

- **I am not signing, and I am not asking the owner to sign anything I have improved into
  acceptability.** The pack is signable; whether it is signed is his.
- **`O1` is NOT closed and does not block the signature.** The "zero of four" fact now lives in the
  amended pack, but `plans/epics/EPIC-006`'s page and `ABC-042`'s page still name only criteria #1 and
  #4. The planner was fenced out of `plans/**` and **stopped at the fence rather than reaching over
  it** — correct. It arrived after BA/PM was already dispatched, so it is in neither hop's output.
  **Owner: BA/PM. Not cut here, because I do not cut tickets and because spinning a third hop for one
  item, unbidden, is not mine to decide.**
- **`OQ-1` / `OQ-2` / `OQ-3` are carried, not answered.** `OQ-2` is the sharpest: the pty check would
  require an **eleventh child process** against a pin the owner ratified by hand (`N8-SPAWN`), and
  that is the owner's or Architect/Design's, never a coordinator's at a close.
- **`ABC-057`–`ABC-060`'s stale blocker is NOT re-scored.** They still read *"`src/cli.test.ts` does
  not exist on `main`"*; it does, since `dbaf972`. BA/PM refused to re-score another hop's tickets
  and recorded it instead. That refusal is right and the re-score is owed.
- **`Lead time` still NOT written to `plans/metrics.md`.** The ticket has still not cleared
  acceptance. Two hops in a row now; the reason has not changed.
