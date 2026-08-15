---
id: 20260815T105700Z-orchestrator-observation-this-notes-timestamp-is-earlier-than-the-hop-it-follows-29f98777
kind: observation
by: orchestrator
at: 2026-08-15T10:57:00Z
verified_by: 
confidence: high
refs:
  - .grugops/context/g1-answered-2026-08-15/notes/
  - .grugops/queue/claimed/agents-md-owner-grants/claim.md
  - agent-factory/contracts/context-note.md
supersedes: 
---

# The clock: this hop's notes are stamped EARLIER than the hop they follow, and the stamps are the honest ones

`date -u` on this machine returned **`2026-08-15T10:53:48Z`** at the start of this hop. The notes
this hop follows carry later stamps — `g1-answered-2026-08-15` up to `12:40:00Z`, and the open queue
claim `agents-md-owner-grants/claim.md` reads `13:13:00Z`. **Those are in the future relative to the
system clock, by roughly two hours** — the offset between UTC and this machine's local zone.

**The most likely explanation, recorded as a reading and not as a proven cause:** earlier hops wrote
**local** wall-clock time and labelled it `Z`. Nothing verifies this; the only measured fact is the
`date -u` reading above and the stamps on disk.

**This hop writes the true `date -u` value.** SCTX-04 replay sorts by `at`, so these notes will sort
**before** the merge decision that authorized them, which reads wrong and is explained here rather
than corrected by writing a false stamp to make the ordering look right. **The permanent fix is not
this hop's** — it would touch append-only notes belonging to other tasks. Recorded so the next reader
finds the reason instead of re-deriving it, or worse, "fixing" the order.

**One consequence to the coordinator's own duty:** Workflow 17 step 6's stale-claim sweep is a
**wall-clock** TTL (`queue.stale_ttl_minutes` = 30). The open claim's `at` is *ahead* of now, so it
cannot be older than the TTL and the sweep is a correct **no-op** on it. That claim is left untouched
— not adjudicated, not released.
