---
id: 20261021T092243Z-agents-md-scribe-decision-42f5eecb
kind: decision
by: agents-md-scribe
at: 2026-10-21T09:22:43Z
verified_by: 
confidence: high
refs:
  - QE-159-f
  - AGENTS.md
  - 20261021T085000Z-orchestrator-decision-d9aa42b9
  - 20261021T082841Z-ba-pm-decision-99559726
  - 20261017T131149Z-orchestrator-decision-owner-word-abc146-worst-and-snap-waiver-be910aa8
  - 8187ee19
supersedes: 
seal: sha256:906baabe91236f3864cee3f2c5ba98b67d7c61f838e2b40192712018708a9b33
---

# AGENTS.md: owner's snapshot-only waiver exception added to kit override 3

Authority: owner grant `…d9aa42b9` (2026-10-21) to amend the third kit-override paragraph; owner's original
word `…be910aa8` (2026-10-17); BA/PM ruling `…99559726` (QE-159-f). Override count stays THREE.

**Change (`## Test and UAT authority`, the 2026-08-17 zero-production-lines paragraph only):**
1. The existing measurement (`git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'`) is now
   stated as the unfiltered reference measurement; no brief may add a `__snapshots__` filter. The command itself is unchanged.
2. Snapshot-only exception (owner, 2026-10-17): if the command lists only `src/__snapshots__/*.snap`, the waiver holds only
   if the Orchestrator reads every changed `.snap` and records that in the Done note; any change the criteria do not explain
   voids it and UAT goes to the owner. (Wording follows `…be910aa8`: read every changed snapshot body, confirm each change is
   one the ticket's criteria call for, record the reading in the Done note; otherwise no waiver, UAT to the owner.)
3. The Authority line now points at `…be910aa8` (`wave-2026-09-25`) and the grant `…d9aa42b9` (`qe-redact-SEC-177-1`).

**Bytes:** 24,554 -> 24,560 (budget 24,576; 16 B headroom). Grew by ~670 B before trimming.

**Trimmed to fit (stale prose, nothing of authority removed):**
- Test/UAT paragraph: the "Close-out: ABC-063 ... ABC-064 ..." sentence (history, ~90 B).
- Test/UAT: "(ABC-065, ABC-066 accepted this way)" (~40 B).
- Test/UAT "Two misreadings": the parenthetical "(human_admission is still off, no human:<name> stamp exists)" (already stated two paragraphs above).
- Test/UAT Authority line: three quoted section titles replaced by "the 'Standing directive' §§ of 2026-08-15, -16 and -17" (still searchable by date in memory-bank/60-progress.md).
- QE section "Forward-only": reworded shorter, same facts (ABC-068, ABC-061-064, +435/-11 lines).
- QE section: "completely unamended" -> dropped, now false-sounding beside the exception (waiver "waives UAT only").
- Kit vs state: the line "Clear voice — this is a resolution and safety rule, not a joke."

**Not touched:** the 12 coding rules; the merge-authority text (Branching model, Kit override 1 and 2, Safety rules); the Dev / run slot.
Commit 8187ee19 on grugops/scribe-snapshot-rule. Nothing pushed or merged.
