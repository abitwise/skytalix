---
id: 20260809T213849Z-software-engineer-claim-63d39cd3
kind: claim
by: software-engineer
at: 2026-08-09T21:38:49Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ABC-022
  - ABC-023
  - ADR-0005
  - src/legal.ts
  - src/legal.test.ts
  - src/moves.enpassant.test.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# The soft edges of this hop — everything here is `UNKNOWN - verify` and none of it is load-bearing

Recorded so review does not mistake a soft edge for a measurement.

1. **Comment text is a judgement, and this hop is nothing but comment text.** That the four
   paragraphs now say the right thing is a reading, not a measurement. What is measured is narrower:
   the facts they assert (the oracle's before/after answers, the guard-(a) direction) and the facts
   they no longer assert. Whether the prose lands is BA/PM's and QE's to judge, and a reviewer who
   wants different words is disagreeing with a choice, not with a number.

2. **`A11` is partially discharged and I do not claim otherwise.** Four of five open sites are
   applied; site 7 is untouched and blocked by this subtask's own file boundary. **Nothing in this
   hop should be read as closing `A11`.**

3. **The 447-of-100,801 disagreement count is BA/PM's, not mine.** I re-derived the *direction* of
   the inversion on the named rows and reproduced their guard-(a) mutant byte-for-byte
   (`450cd8cd839a0d3514395512c743e05c`), but I did not re-run the 131,072-state exhaustion. The
   corrected `src/legal.ts` paragraph states the direction, which is what I measured; it states no
   count.

4. **"The oracle is now sound off-domain" is not established by anything here, and no comment I wrote
   claims it.** BA/PM swept the two guard-input bytes on two base boards; I scored twelve named
   positions. Neither is a claim about all boards, all ep-square values or all move types. The
   corrected text deliberately says the predicate does not depend on the generator rather than that
   the generator is now right.

5. **The fenced-TRUE re-measurements are at my scale, not BA/PM's.** *"Purity does NOT need it"* was
   confirmed on the rows I probed with guard (a) deleted, not over 100,801 states.

6. **The `A9` reading is still a reading.** I hold, with BA/PM, that a comment-only edit to
   `src/legal.test.ts` modifies no test and satisfies `A9` at line level. That is an interpretation
   of `A9`'s words; the mechanical facts under it (21 changed lines, 0 non-comment, executable
   content byte-identical to `main`, 31/31 both sides, suite still 439) are not. A reviewer who reads
   `A9` as file-level is disagreeing with the interpretation, and on that reading this hop breaches
   it — flagged as the one place this hop could be wrong in a way that matters.

7. **No `NFR-001`, `NFR-005` or perft figure from this hop exists.** None was measured. The
   structural arguments (zero executable lines, `src/moves.ts` byte-identical) are why, and they are
   arguments — if a reviewer wants numbers, they must be re-measured, not quoted from hop one as
   though this hop had taken them.

8. **The falsified set is still not certified complete.** Every count on this ticket has been a
   floor: pre-check 2, first BA/PM hop 7, engineer 8, second BA/PM hop 11. I swept nothing at this
   hop — I applied a list. A statement falsified by this fix that BA/PM's vocabulary search missed
   would still be there, and I would not have found it.

9. **`ADR-0005` 133-138 is still unowned.** Both of its witnesses are measured false on the delivered
   tree, the ADR is `accepted`, amending it is an Architect ruling, and no trigger is attached to it.
   Nothing here discharged that; it is loose on purpose.

10. **`ABC-023`'s hash invalidation is still open.** `src/moves.ts` is
    `6335b452fc21ffe2d0f902ecab930840`; its `A4` pin is stale against this branch and will be stale
    against `main` at merge. Deferred by design to `ABC-023`'s promotion hop, and this hop did not
    touch it.

11. **The line-citation drift map is mechanical but `A11`'s table is now stale against the tree.** I
    could not fix that — `## Acceptance` is BA/PM's — so a reader who trusts `A11`'s line numbers
    without the map will land a few lines off. Matching on the quoted sentences is safe; matching on
    the numbers is not.

12. **Queue and note plumbing deviate from the workflows as written, and the deviation is recorded
    rather than presented as compliance.** `scripts/claim.js` and `scripts/context-io.ts` do not
    exist in this install — **re-checked at the source rather than trusted from the brief: `ls
    scripts` in the repository exits "No such file or directory", the same for
    `/Users/olgeroeselg/.grugops/agent-factory/scripts`, and a `find` for `claim.js` and
    `context-io.*` across both returns nothing.** `mcp__grugops__propose_note` is not in this
    session's tool set. The claim was a plain atomic `mkdir` (exit 0, so first writer) and these
    notes are hand-written in the exact shape of `agent-factory/contracts/context-note.md`. **No
    `finding` is written** — none is admissible: no §14 gate exists here to issue a `§14-gate#<id>`
    stamp and `context.human_admission` is `off`, so no `human:<name>` stamp exists either. **Nothing
    is self-stamped and no `index.md` / `index.jsonl` was hand-faked.** `at` was taken from `date -u`;
    this machine is **UTC+3** and the local clock had already rolled to 2026-08-10 while UTC was
    still 2026-08-09, so every timestamp and date in this hop is the UTC one.
