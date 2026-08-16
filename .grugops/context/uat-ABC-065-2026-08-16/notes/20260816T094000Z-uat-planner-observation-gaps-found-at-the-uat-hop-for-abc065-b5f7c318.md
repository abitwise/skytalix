---
id: 20260816T094000Z-uat-planner-observation-gaps-found-at-the-uat-hop-for-abc065-b5f7c318
kind: observation
by: uat-planner
at: 2026-08-16T09:40:00Z
verified_by: 
confidence: high
refs:
  - ABC-065
  - AGENTS.md
  - plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
  - ABC-067
  - ABC-069
  - ABC-070
  - ABC-071
supersedes: 
---

# Gaps found at the UAT hop for `ABC-065` — each with severity and owner

Numbered **`U1`–`U4`** in a namespace of my own, clear of the Orchestrator's `G1`–`G3`, the Scribe's
`G4`–`G7`, the guard hop's `G8`–`G12` and QE's `Q1`–`Q10`, which are **referenced and not restated**.

**Count for the `Ready for Dev` exit control (`AGENTS.md` § Process rules 1): 3 NEW gaps at UAT — 0
`HIGH`, 1 `MEDIUM`, 2 `LOW` — plus 1 pre-existing install-level condition recorded but NOT counted as
a new gap.** **None is an acceptance-criterion failure. No scenario failed. Nothing was repaired here**
— every one is another pen, or forbidden to this hop by a hard limit.

---

## `U1` — this project has NO mechanism by which a named human's UAT acceptance can be recorded. **MEDIUM.** Owner: **the project owner** (via the Orchestrator's escalation)

**This is the gap that actually holds `ABC-065`, and it is not a defect in `ABC-065`.**

`agent-factory/workflows/06-uat-pack.md` step 4 and `agent-factory/roles/uat-planner.md` both make the
`In UAT` → `Ready to Release` exit **a named human's signoff**, and both forbid an agent self-signing.
`AGENTS.md` § Test and UAT authority grants an agent the **conduct** of UAT and says, in its own words,
that the owner *"did not say an agent's report is the acceptance signature"*, leaving the signature
**genuinely open** and instructing that it not be resolved by inference.

Meanwhile the recording channel for a human-stamped result does not exist on this install:
`context.human_admission` is `off`, `scripts/context-io.ts`, `scripts/claim.js` and
`mcp__grugops__propose_note` are absent, so **no `human:<name>` stamp and no `finding` can be written
at all** (`AGENTS.md`'s own admissibility block). So the exit is unreachable by construction, not by
oversight: **there is no file this project could write today that would constitute a signature.**

**Severity `MEDIUM`, and deliberately not `HIGH`:** nothing in the product is wrong, nothing is
blocked from being *used*, and the condition is already escalated to the owner at install level by
`AGENTS.md` itself. It is `MEDIUM` rather than `LOW` because **it will now recur on every ticket** —
`ABC-042` and everything before it deferred UAT to `EPIC-006` because nothing was exercisable, and
`npm run chess` ended that reason. `ABC-065` and `ABC-066` are the first two tickets to arrive at a
door that has no handle, and every ticket after them arrives at the same door.

**Not repaired here, and the reason is a hard limit, not a shrug:** flipping `human_admission`,
restoring the sanctioned writer, or inventing a signature file are each either install-level work
(escalated, not ticketed, per `AGENTS.md`) or exactly the self-signing the role forbids. **What I did
instead is name it, and write the verdict note so that "UAT passed" cannot be read as an acceptance.**

## `U2` — the `Dev / run` slot attributes the PROGRAM's line count to the NPM command. **LOW.** Owner: **`AGENTS.md` Scribe** (accept, or one clause)

The slot reads *"`npm run chess` … prints the start position (**23 rows**) on stdout and exits 0"*.
Measured at this hop on `main` @ `722bd9d`:

| what you run | stdout lines |
|---|---|
| `node src/cli.ts` | **23** |
| `npm run chess` | **27** — npm's own 3-line banner plus a blank, then the 23 |

**Both halves of the page are true; the sentence joins them to the wrong subject.** A New Reader who
counts what the documented command actually printed gets 27 and cannot reconcile it with the page.

**Why `LOW` and why I am not recommending an edit.** The figure is `ABC-042`'s, merged and accepted,
and it is correct about the thing that matters (the board is 23 rows). The banner is the package
runner's, is obviously not board, and no reader has ever been misled by it in this repository's
record. **The cheapest honest repair is four words — "(23 board rows, below npm's banner)" — and it is
the Scribe's pen on a merged row, which is not this hop's to move.** If it is ever touched, fold it
into `ABC-070`, which already opens this page for a wording repair. **I explicitly do NOT recommend
cutting a ticket for it.**

## `U3` — the pack's own instrument nearly told a lie about `--ascii`, and only a second measurement caught it. **LOW.** Owner: **UAT Planner** (this role, as a standing practice note)

Fully recorded in this task's correction note and not restated: capturing stdout through a pipe makes
`selectGlyphMode` row 3 (`!isTTY → ascii`) fire, so **the default board comes out ascii and `--ascii`
looks like it does nothing.** Under a real pty the default is unicode figurines and the flag visibly
switches. My first `S3` verdict carried a caveat that was an artifact of my instrument.

**Recorded as a gap rather than swallowed as a self-correction** because it generalises: this project
has a documented rule that branches on `isTTY`, so **any future UAT that touches rendering must
allocate a pty or say out loud that it did not.** Nothing in the pack, the checklist or the workflow
says so today. The repair is one sentence in a future UAT pack, not code.

---

## Carried, re-confirmed unrepaired at the UAT hop — reported, not re-numbered, not re-counted

- **`Q8` / `ABC-067` — the guard's window has no upper bound.** `MEDIUM`, open. **Re-measured with my
  own hands this hop: the unterminated-comment mutant ships GREEN 32/32.** `ABC-067`'s board row says
  it must be built after this UAT — **that condition is now discharged.**
- **`Q7` / `ABC-071` — the guard has no start anchor; a second slot after the first is invisible.**
  `LOW`, open. Same six lines of `devRunSlot()` as `ABC-067`; both pages already say to build them in
  one hop or fold them. **Not re-measured here** — it is a guard-shape property with no user-visible
  surface, and QE's `N3a`/`N3b` pair settled it.
- **`Q9` / `ABC-069` — the guard requires two unwritten rendering conventions of `AGENTS.md`.** `LOW`,
  open. I second QE's recommendation **against** loosening it: both couplings fail loudly and name the
  token, and a UAT pack would rather have a diagnosable false red than a silent pass.
- **`G12` / `ABC-070` — `ABC-065` § Dependencies still says `AGENTS.md` "IS CLAIMED RIGHT NOW BY
  ANOTHER HOP"** and forbids pulling a ticket that merged, contradicting its own DoR row 10. `LOW`,
  open, **fifth confirmation**. It cost this hop nothing but it is the section a person scoring the
  pack would read first.
- **`Q5` — Workflow 05's green-verdict emission and Workflow 16's sanctioned writer are unperformable
  on this install.** Pre-existing, install-level, already escalated to the owner by `AGENTS.md`. **Not
  re-derived, not ticketed, and NOT counted as a new gap** — but it is the mechanism behind `U1`, and
  `U1` is counted because its *consequence for the board* is new.
- **`G5` — one working tree, two concurrent hops.** Did not bite: every mutation ran in a **linked git
  worktree** with `node_modules` symlinked, the shared tree was never mutated, and I wrote nothing
  outside `.grugops/context/uat-ABC-065-2026-08-16/` and `.grugops/queue/`. **The mitigation is now
  five hops old and still undocumented in the enqueue template.** Owner: **Orchestrator**.

## Not gaps — checked and closed so nobody re-opens them

- **The reader's path works end to end.** Ten scenarios, ten PASS. The documented invocation runs, all
  five option forms run and visibly act, the bare command is unchanged at 23 rows, and the page's
  warning about omitting `--` reproduces clause for clause.
- **The guard is genuinely falsifiable from the editor's side, not just the mutation-tester's.** Five
  of six plausible editing mistakes RED, each naming the offending token, including the "tidy the
  example away" edit the slot's comment can now stop asking for politely.
- **No accepted criterion was disturbed.** `ABC-042`'s `A1` block hashes `240d0c66b450` at `dbaf972`,
  `c5a5493`, `460b9f5` and `HEAD` — **byte-identical**, extracted by content, an independent
  confirmation of QE's result by a different fence and a different hash.
- **`A6`'s substance holds.** Two paths, `85 0` pure append, zero production lines, zero new files
  under `src/`, `CHILDREN` = 10 keys counted by hand.
- **Nothing was left mutated.** Six mutants, six reverts, worktree `git status --porcelain` empty at
  each step, worktree removed; the shared tree carries only what it carried on arrival.
- **`--ascii` is not a no-op** — see `U3` and the correction note. Do not re-open this on a piped
  capture.
