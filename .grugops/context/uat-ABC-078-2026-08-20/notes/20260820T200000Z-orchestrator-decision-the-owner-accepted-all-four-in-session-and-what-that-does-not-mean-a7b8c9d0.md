---
kind: decision
role: orchestrator
task: uat-wave-2026-08-20
at: 2026-08-20T20:00:00Z
id: a7b8c9d0
---

# The owner accepted all four in session — his words verbatim, and the four things this does NOT mean

## The signature

**Owner, in session, 2026-08-20, verbatim and complete:**

> **"All four, pass forward"**

Per `AGENTS.md` § *Test and UAT authority*, **the owner's word in session IS this project's `In UAT`
exit signature** (2026-08-16 ruling). This is that word. It covers `ABC-033`, `ABC-035`, `ABC-037`
and `ABC-078`.

**Fidelity, stated honestly and not upgraded.** `context.human_admission` is `off` and the owner did
not flip it. There is no `human:<name>` stamp and no `finding` is admissible. **This note is an
agent's TRANSCRIPTION of his words, carried in git — not a stamp.** The 2026-08-16 ruling anticipated
exactly this and said to record the fidelity level rather than imply a stronger one.

## What he had in front of him when he said it

He was not handed "all green". The message immediately preceding his word carried, in his view:

- that `ABC-078`'s **`RISK-002` is not human-acceptable** — business observation cannot distinguish
  iterative deepening from a fixed depth, and a depth-capped ~3 s build passes all six scenarios;
- that **`ABC-037`'s `A5`, its own discriminating criterion, was never exercised**;
- that **`quit` is advertised in `help` and does not quit**;
- that **at checkmate the product announces nothing**;
- that **`AR-NFR004-A` is not discharged**, with the 3001–3005 ms readings against a 3 000 ms clause;
- and that 45 scenarios behaving as specified **is not an acceptance**.

**His acceptance is therefore informed, and that is why it is admissible as a signature at all.**

## The four things this signature does NOT mean

1. **He did not individually answer the questions put to him.** The `quit` question, the `A5`
   question, and `ABC-078`'s `Q7`/`Q8`/`Q9` were each named as things no agent may answer for him.
   **He accepted the TICKETS. That is a different act from answering those questions, and they remain
   open.** Nobody may later read "all four, pass forward" as a ruling on any of them.
2. **`RISK-002` is NOT discharged.** Accepting `ABC-078` accepts the delivered work; it does not
   convert an unobservable property into a verified one. The risk stays where it was, guarded by the
   repaired `A4` test and by nothing in the UAT.
3. **`AR-NFR004-A` is NOT discharged.** The UAT's own numbers are over the clause. It stays with
   Security/NFR at `EPIC-006`'s difficulty hop.
4. **The two product gaps are not closed and are still nobody's ticket.** `quit` not quitting and the
   silent checkmate belong to `EPIC-006`. **Acceptance of these four must not be the reason they are
   forgotten** — that is the exact failure mode this factory has already paid for once with the
   `NFR-008` restatement arithmetic nobody re-ran.

## The gate I ran before closing, and the reading I threw away

Closing to `Done` means *merged and gated*, so I gated rather than assumed. **The first run was
INVALID and I discarded it rather than reporting it**: `npx vitest run` and `npx biome check .` at the
repo root swept in leftover agent worktrees under `.claude/worktrees/` and reported **1230 files /
36 443 tests** — that is `ABC-050` (the lane runner has no guard) biting exactly as the prior notes
warned, and it is a number that would have looked like a triumph.

**The contained reading, which is the real one:** `npx vitest run --dir src` → **39 files, 1190 tests,
skip 0, green**; `npx tsc --noEmit` exit 0; `npx biome check src` clean over 66 files. This matches
`ABC-043`'s published 1190/39 baseline. All four tickets' production files are already on `main`.

**Lane cost reported, not graded** — `ADR-0014` rules `NFR-008` BREACHED and `ABC-110` owns it.
