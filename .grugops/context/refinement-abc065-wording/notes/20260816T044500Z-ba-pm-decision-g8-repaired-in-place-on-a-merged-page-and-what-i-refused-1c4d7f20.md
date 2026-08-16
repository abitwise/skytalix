---
id: 20260816T044500Z-ba-pm-decision-g8-repaired-in-place-on-a-merged-page-and-what-i-refused-1c4d7f20
kind: decision
by: ba-pm
at: 2026-08-16T04:45:00Z
verified_by: 
confidence: high
refs:
  - ABC-065
  - ABC-066
  - ABC-042
  - plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
  - .grugops/context/pull-abc065-066-2026-08-16/notes/20260816T021500Z-orchestrator-decision-rulings-on-g8-through-g12-and-the-helper-doc-debt-6a7e0d31.md
  - .grugops/context/quality-gate-ABC-065-qe/notes/20260816T031700Z-qe-e2e-decision-the-bare-separator-ruling-reviewed-and-g8s-moved-fence-c0d5e6b4.md
supersedes: 
---

# `Q10`/`G8` — I re-worded `A2` **in place on a merged ticket**, and here is the whole reason, including what I would not touch

**No `kind: finding` on this install** (`AGENTS.md` § Role / workflow files): no `§14-gate#<id>` stamp
is emittable, so this is a `decision`. **No git command was run at this hop** — two sibling BA/PM hops
share this working tree and one index. Every hash below is **attributed to the hop that measured it**
and is not re-published as mine.

## The choice the subtask left me

*"Whether that is a re-word of `A2` in place on a merged ticket, or a new ticket, is yours to decide
and record."* **I chose in place.** Four reasons, in the order they weighed:

1. **`ABC-065` is in `Ready for UAT` right now.** The next hop to open the page scores it. A criterion
   whose fence points at the wrong block misleads the scorer **this session**; a `Backlog` ticket for
   it would not be pulled before UAT. **The defect is live in the exact window in which a ticket
   cannot reach it.**
2. **The substance was already verified — twice, independently.** The guard hop verified both regions
   by hash; QE extracted the range at **four commits** and got `6effd96e…` every time (`dbaf972`,
   `717e51d`, `main`, branch tip `901c670`). **So the re-worded criterion is one the build hop
   demonstrably met.** This is the load-bearing point: I moved the fence's ADDRESS, not its subject
   and not its bar. Had the substance been unverified, a re-word would have been retrofitting an
   obligation and I would have cut a ticket instead.
3. **Nothing was erased.** The original wording sits verbatim inside the annotation, with the date,
   the author, the ruling it acts on, and the reason. A reader who suspects a retrofit can compare the
   two sentences without leaving the page or opening git.
4. **The ruling already exists and is unanimous** — Orchestrator (*"a line-range fence is scored by
   CONTENT, not by position"*), QE (*"fence by content or by hash, never by line range"*), guard hop
   (same). **My pen executes it; it does not re-open it.**

## What the re-word says, and the one design choice inside it

The fence now names **the block by its own assertions** — the `it("A1 — AGENTS.md's \`Dev / run\` line
is the command that was run", …)` block and its three `expect` calls. **I deliberately did NOT use the
hash `6effd96e…` as the fence**, although QE offered exactly that sentence.

**Reason: a hash fence is unreadable and it is not verifiable without git.** A scorer must be able to
check a criterion by opening the file. The hash also decays in a different way — any legitimate future
edit to that block (a comment, a formatting pass) invalidates it and produces a red that means
nothing. **Content is the durable fence; the hash is the evidence, and evidence belongs in notes.**
The hashes stay published where the two hops that measured them put them. *(I verified the block's
identity by reading `src/cli.test.ts` with `grep`/`sed`: the assertions I quoted are at `:257`–`:259`
inside the `it` opened at `:249`. That is a read, not a git measurement.)*

## Second site repaired, and it is the same defect

`## Out of scope`'s first bullet carried the identical stale `:193-204` pointer. **Repaired with the
same annotation, because repairing the criterion and leaving the same wrong address three sections
above it is half a repair that reads as an oversight.** Same subject, same authority, same date.

## Three things I found on that page and did NOT touch — each with the reason

1. **`## Problem`'s *"`src/cli.test.ts:193` pins the command line's text"*.** **Left, deliberately.**
   The Problem section is a **dated snapshot measured at the cut** (it says so: *"measured at the
   cut"*), and its job is to record what was true then. Repairing a historical measurement into the
   present rewrites the record instead of the fence.
2. **DoR row 2, which quotes the old fence (*"`:193-204` byte-identical…"*).** **Left, deliberately.**
   It is a **dated assessment record**, scored 2026-08-15 against the page as it then read. Editing a
   scored DoR row after the fact is exactly the class of thing this hop is being careful about, and
   `ABC-070` carries the same fence for the next hop.
3. **§ Dependencies' stale live-claim sentence (`G12`).** **Forbidden to me by my own subtask's hard
   limit**, which granted the merged-page pen for `Q10`/`G8` **only**. I obeyed it rather than
   widening my authority because I was already in the file — **that is precisely when a limit is worth
   having.** It gets `ABC-070` instead. **The collision is named, not silently resolved:** if the
   Orchestrator grants the same narrow authority for that one sentence, `ABC-070` should be closed
   unstarted, and the ticket says so on its own page.

## What this costs, stated plainly so it can be argued with

**A merged, gated, QE-passed criterion now reads differently than it did when the gate ran.** That is
a real cost and no annotation removes it entirely. I judged it smaller than the cost of a UAT hop
scoring `A2` against `ABC-066`'s helpers — but **the paragraph above is the one to argue with**, and
the original words are on the page for whoever argues.
