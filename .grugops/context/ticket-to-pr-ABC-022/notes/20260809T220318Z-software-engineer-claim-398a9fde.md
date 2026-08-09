---
id: 20260809T220318Z-software-engineer-claim-398a9fde
kind: claim
by: software-engineer
at: 2026-08-09T22:03:18Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ABC-022
  - ABC-023
  - ADR-0005
  - src/moves.enpassant.test.ts
  - src/moves.castling.test.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# The soft edges of this hop — everything here is `UNKNOWN - verify` and none of it is load-bearing

Recorded so review does not mistake a soft edge for a measurement.

1. **Comment text is a judgement, and this hop is nothing but comment text.** That the corrected
   header now says the right thing is a reading. What is measured is narrower: the facts it asserts
   (the before/after ep counts, the per-pair corruption, the two mutant counts) and the facts it no
   longer asserts. Whether the prose lands is BA/PM's and QE's to judge.

2. **The two extra sites are the one judgement call in this hop, and it could be overruled.** I fixed
   `82-83` and `95-97` under `A11`'s binding clause rather than its citation table. A reviewer who
   reads the table as exhaustive disagrees with that judgement; the remedy is reverting two
   sentences. **Flagged as the place this hop is most likely to be wrong in a way anyone cares
   about** — and deliberately the cheap direction to be wrong in, since the alternative was shipping
   *"Today every row offers the capture"* in a file whose header I had just made honest.

3. **`A11` is discharged against its criterion as I can measure it, not certified complete.** I read
   every comment line in `src/moves.enpassant.test.ts` and swept every comment line under `src/` on
   the premise's vocabulary. A sweep is not a proof, and a statement phrased in words I did not
   search for would have been missed. Every count on this ticket has been a floor: 2, 7, 8, 11, and
   now 13 with the two sites above and the flagged castling pair.

4. **`src/moves.castling.test.ts`'s attribution to `ABC-009` is an inference.** What is measured is
   that both sentences are false on the delivered tree. That `ABC-009`'s fix is what falsified them
   follows from the file's own header naming that ticket; I did not verify it against a commit.

5. **The "retro item, not a ticket" call on the present-tense-header pattern is mine and is a
   judgement.** Three instances is a pattern to me; someone else may reasonably want a ticket. I
   enqueued nobody either way.

6. **The `A9` reading is still a reading.** I hold, with BA/PM and the hop above, that a comment-only
   edit modifies no test and satisfies `A9` at line level. The mechanical facts under it (37 changed
   lines, 0 non-comment, comment-stripped content `cmp`-identical at 138 lines, all token counts
   unchanged, 58/58 both sides, suite still 439) are not readings. For **this** file the question is
   softer than it was for `src/legal.test.ts`, because the file is still an ADDITION relative to
   `main` and so modifies no existing test on either reading.

7. **No `NFR-001`, `NFR-005` or perft figure from this hop exists.** None was measured. The
   structural arguments are arguments — if a reviewer wants numbers they must be re-measured, not
   quoted from an earlier hop as though this hop had taken them.

8. **The 447-of-100,801 exhaustion is still BA/PM's.** Not re-run here, and nothing I wrote into a
   comment states a count from it.

9. **`ADR-0005` 133-138 is still unowned.** Both witnesses measured false on the delivered tree at an
   earlier hop, the ADR is `accepted`, amending it is an Architect ruling, no trigger is attached.
   Nothing here discharged that; it is loose on purpose.

10. **`ABC-023`'s hash invalidation is still open.** `src/moves.ts` is
    `6335b452fc21ffe2d0f902ecab930840`; its `A4` pin is stale against this branch and will be stale
    against `main` at merge. Deferred by design to `ABC-023`'s promotion hop; this hop did not touch
    it.

11. **One sentence in the file may read oddly to a future reader and was deliberately left alone.**
    Lines 23-26 say a white-only half-(b) fix *"passes every criterion this ticket carried before
    2026-08-09 and the whole suite"*. "The whole suite" meant the 381-test suite as it then stood;
    today's 439 includes these very tables, which catch that mutant. The next clause tells the reader
    exactly that, so it is self-clarifying rather than false — but it is the kind of sentence that
    goes stale, and I did not rewrite it because no criterion asked me to and it is not a claim about
    the generator's current behaviour.

12. **Queue and note plumbing deviate from the workflows as written, and the deviation is recorded
    rather than presented as compliance.** `scripts/claim.js` and `scripts/context-io.ts` do not
    exist in this install — **re-checked at the source rather than trusted from the brief or from the
    two prior claim records: `ls scripts` in the repository exits "No such file or directory", the
    same for `/Users/olgeroeselg/.grugops/agent-factory/scripts`, and a `find` for `claim.js` and
    `context-io.*` across both returns nothing.** `mcp__grugops__propose_note` is not in this
    session's tool set. The claim was a plain atomic `mkdir` (exit 0, so first writer) and these
    notes are hand-written in the exact shape of `agent-factory/contracts/context-note.md`. **No
    `finding` is written** — none is admissible: no §14 gate exists here to issue a `§14-gate#<id>`
    stamp and `context.human_admission` is `off`, so no `human:<name>` stamp exists either.
    **Nothing is self-stamped and no `index.md` / `index.jsonl` was hand-faked.** `at` was taken from
    `date -u`; this machine is **UTC+3** and the local clock had already rolled to 2026-08-10 while
    UTC was still 2026-08-09, so every timestamp and date in this hop is the UTC one.
