---
id: 20260811T015000Z-ba-pm-artifact-ref-7e0e5b0d
kind: artifact-ref
by: ba-pm
at: 2026-08-11T01:50:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-021
  - ADR-0009
  - NFR-002
  - plans/tickets/ABC-019-turn-loop-skeleton.md
  - plans/traceability.md
supersedes:
---

# What this hop wrote, and the four items it flagged for other roles

## Written

| Artifact | What changed |
|---|---|
| `plans/tickets/ABC-019-turn-loop-skeleton.md` | An `AMENDED 2026-08-11 (second hop)` header block listing **five** changes, checkably. `## Scope`: one bullet added (`[D27]` — the seam returns rows, the loop writes them, `H` = `firstFrame.length`, `beginFrameSession` once, no declared count, no panel import, no `frameHeight`). `## Out of scope`: the *"Frame content and writing"* line disambiguated (`[D26]`). `## Acceptance`: **`A18` and `A19` added** (`[C9-1]`, `[C9-2]`), each carrying its wrong-build matrix; the section's numbering note updated. `## Dependencies`: no import edge either way, and clause 9f's real-panel re-gate (`[C9-3]`, `[C9-4]`). `## Security / NFR triggers`: a `CORRECTION` block under `[D19]` refuting this role's own *"at or over its own bar"* sentence, plus **no bar moves** on the `NFR-002` bullet and the `N8-LANE` no-new-FILE statement (`[C9-5]`). `## Test notes`: the two stub shapes and the test-file stub precedent. `## Size and priority rationale`: `L` (5) re-derived and costed in three directions. `## Definition of Ready`: a scoped re-check of items 2, 4, 6, 7 and the `Ready` → `Ready for Dev` statement. Three new flags appended to the owed-items list. **No `A1`–`A17` criterion edited; front matter untouched (`status: ready`, `column: Ready`) — the column move is the Orchestrator's.** |
| `plans/traceability.md` | **the `ABC-019` row only**, four cells appended to (`NFRs`, `Code (PR/files)`, `Tests`, `Status`), plus the `_Updated:` header line the file's convention requires. Written by a script that asserted, before and after: 35 table lines unchanged, **all 34 other table lines byte-identical by md5**, the edited row at exactly **12** pipe-separated fields, and every appended string pipe-free and newline-free. `git diff --numstat`: **3 insertions, 1 deletion** (the row, plus the header and its blank line). `UAT` and `Release` left deliberately empty — nothing is built and nothing is released. |
| `.grugops/context/refinement-ABC-019-clause9/notes/` | this note plus one `observation` (the seven wrong builds and the geometry) and one `decision` (the two criteria, the three rulings, size/priority, and the DoR verdict). **No `finding`** — no `§14-gate` stamp and no `human:<name>` grant exists at this hop, and nothing is self-stamped. |
| `.grugops/queue/claimed/refinement-ABC-019-clause9/` → `done/` | the claim by atomic `mkdir`, `claim.md` inside it, and the subtask file moved in — then the whole directory transitioned to `done/`, the shape the other 66 entries use. |

**Not written, deliberately:** `plans/board.md` (Orchestrator's), `plans/nfr-catalog.md`
(Architect/Design's, and already re-scoped by them), `memory-bank/50-decisions/ADR-0009-*.md`
(Architect/Design's), `plans/tickets/ABC-016-*.md`, `ABC-017-*.md`, `ABC-018-*.md`, `ABC-021-*.md`,
and **anything under `src/`**.

**`src/` byte-identity:** 36-file aggregate md5 `59d99f2861a7e5b593473c15049746ce` before and after;
five throwaway harnesses created **outside the repository** (session scratchpad) and never copied in;
`git status --short -- src/` empty; zero untracked files under the repo except the queue's transient
`claimed/` directory. **Default lane 676/676 on 22 files, skip count 0.**

## Flagged, not taken

1. **`ADR-0009` clause 9e's wording, for Architect/Design.** The clause reads *"every frame's `length`
   equals the session height"*. **Built and run: a loop that derives its height and then pads or
   truncates every frame to it satisfies those words while truncating a 20-row frame to 19** — it eats
   the reserved prompt row `src/frame.ts:48` exists for. `A19`'s clause (c) (*frames written
   unmodified*) closes it on the ticket, which is what the ticket owes; **the ADR text is not edited,
   because `memory-bank/50-decisions/` is outside this hop's lane.** The ruling is unaffected and
   clause 9e's own falsifiability claim was **re-measured and holds** (2/5 → 19, 2/6 → 20; a
   variable-height stub returns `[19, 20]` and fails the invariant). Also worth that role's attention:
   9d's *"two shapes"* buys more than the append branch — **no literal can satisfy two shapes at
   different heights**, which is the property that actually forces the derived form.

2. **`plans/board.md`'s `ABC-019` row, for the Orchestrator.** The clause-9 gap that held this ticket
   in `Ready` is **closed**, and this ticket's DoR side of `Ready` → `Ready for Dev` is clear. The
   row's stale `blocked-until: ABC-012, ABC-014, ABC-018` and `merge-order: after ABC-020` were
   already flagged at `refinement-ABC-019` and are still stale; the binding merge order is
   `ABC-016` → `ABC-017` → `ABC-019`. **No board edit was made here.**

3. **The rebase re-gate, for the Orchestrator and QE — `ADR-0009` clause 9f, and it is now measured
   rather than argued.** Under clause 9 this loop's own code is **swap-invariant**: the identical loop
   passed `A18`/`A19` unchanged at stub 2/5, stub 4/9, real 3/8, real 4/8 and real 3/10. **So what a
   re-gate is actually testing is the seam WIRING, and only a real-panel run tests it** — rebasing and
   re-running against the stubs proves nothing new. Recorded on the ticket's `## Dependencies` as well.

4. **`plans/tickets/ABC-021-draw-claim-interaction.md` — still owed, unchanged from the previous hop
   and re-flagged so it is not lost between two hops of the same task.** Its `## Scope` and
   `## Size and priority rationale` both claim the fifth prompt outcome's transition that `ABC-019`
   also claimed; `ABC-019`'s side is unambiguous and `ABC-021`'s text should say so from its side. One
   paragraph, no re-scoping, no size change. `ABC-021` also cites `src/gameend.test.ts:27-58` for the
   knight cycle; the function is at lines 26-50.

**Discharged, and recorded so nobody chases it:** the previous hop's flag on `plans/nfr-catalog.md`'s
`NFR-002` row was **taken by Architect/Design** at `design-stub-seam-and-nfr002` — verified by reading
the row here, not from their note. Its premise was refuted in the process, and the correction lands on
**this** ticket, under `[D19]`.

**Pre-existing and NOT edited (coding rule 12):** `## Test notes` carries the *"Do not test the real
engine's timing here"* bullet **twice**, as its fourth-from-last and last bullets, differing only in
that one names `A15`'s macrotask boundary. It predates this hop, harms nothing, and deleting it is an
unrelated edit this hop has no mandate for. Flagged on the ticket too.
