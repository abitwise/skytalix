---
id: 20260815T192300Z-qe-e2e-decision-the-terminal-result-and-what-it-does-not-authorise-5378bf34
kind: decision
by: qe-e2e
at: 2026-08-15T19:23:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - Q1
  - Q2
  - G1
  - N8-LANE
  - grugops/abc042-integrated
  - agent-factory/workflows/05-pr-quality-gate.md
supersedes: 
---

# The terminal result — and the three things it explicitly does NOT do

> ## `READY_FOR_HUMAN_REVIEW`
>
> **The block I raised at the last gate is DISCHARGED, by me, on mutants I rebuilt myself.** Every
> mandatory gate is green at my own hand on the integrated tree, the skip count is a measured **0**, the
> test-integrity checker exits **0**, and the two instruments I blocked on now fire on every spelling I
> can construct — twenty-one of them, eleven of which are not in any prior census.

## Why this result and not the other one

Workflow 05 step 5: *"All checks pass → `READY_FOR_HUMAN_REVIEW`."* No check failed. There is no
visual baseline, test-integrity exits `0` and not `1`, and neither human-only short-circuit applies.

**Last gate I took the harder reading and blocked on green checks**, because two instruments did not
hold the criteria they were named against and I could demonstrate it in one command. That reasoning
required a demonstrable hole. **I no longer have one.** `Q1`'s two survivors and `E1`'s two are dead,
seven more of the same class are dead, `Q2`'s ten spellings are dead, `Q4`'s hang is a 1.27 s red, and
`Q6`'s pin is tamper-evident. Blocking now would mean blocking on residuals that are LOW, owned, and —
in `B5`'s case — priced and declined by BA/PM one hop ago on reasoning I checked and agree with.

**The false-RED direction carried equal weight and I ran it first.** Nine legal changes to a correct
build: eight green, and the one red belongs to a row that predates `B1`. Twenty-five consecutive runs
of the file: zero flakes. The draw budget: 800 corpus builds, worst case 250 of 500. **`B1` closes a gap
without forbidding a correct build, and that is the harder half of the test.**

## Not `SPLIT_REQUIRED`

Size is unchanged. `B1` added **zero** test rows (29 before, 29 after), **zero** production bytes and
**zero** spawns. Nothing about the delivered shape argues for splitting.

## THREE THINGS THIS RESULT DOES NOT DO — said plainly, because a green gate is easy to over-read

### 1. It does not lift the merge hold, and it is not a recommendation to merge

**`G1` — `N8-LANE` breached at 2.00× — is escalated to the PROJECT OWNER and the ticket is HELD at the
merge on it.** That hold is not mine, it is not affected by my result, and nothing here lifts it. I
measured the lane again this hop as evidence and **ruled nothing**: the reading of the bar is
Security/NFR's and the decision is the owner's. `READY_FOR_HUMAN_REVIEW` means *the gate is green and a
human should now look*; it has never meant *merge this*. Workflow 05 step 6 and `AGENTS.md` § Safety
rules both keep merge and deploy in human hands, and the owner's standing merge authority is *approval
to merge work that PASSED, never to skip or soften a gate*.

### 2. It emits NO `§14-gate` verdict, and none was invented

Workflow 05 step 5 says a green result emits a verdict through `emitVerdict` in `scripts/context-io.ts`.
**That script does not exist in this repository** — I checked; there is no `scripts/` directory at all —
and `AGENTS.md` § Role / workflow files records that `context-io.ts`, `scripts/claim.js` and
`mcp__grugops__propose_note` are all absent and `context.human_admission` is `off`, so **no
`§14-gate#<id>` verdict is emittable here.**

Consequences, stated so the absence is not read as an omission:

- **No `kind: finding` note exists in this task folder and none can.** Everything I recorded is
  `observation` / `decision` / `artifact-ref`, hand-authored per `agent-factory/contracts/context-note.md`.
- **I did not hand-write a verdict note, invent an id, or stamp anything.** A verdict is the root of the
  verification chain; forging one to make a green result look complete is the precise failure the
  no-faked-pass floor exists to prevent.
- **This is an install-level gap, escalated to the owner already** (`node install/install.js --check`),
  not project work and not a defect of this ticket. `AGENTS.md` says so and says not to re-derive it.

### 3. It does not speak for Security/NFR, Architect/Design, the board, or the trace

I ruled on the gate. **`G1`/`N8-LANE`'s formal reading is Security/NFR's. `Q3`/`R5` — the licence
comparator — is Architect/Design's and is explicitly not fixable under `A12`. `Q5`, `Q8` and the
criterion wording are BA/PM's.** I wrote **no** row in `plans/board.md`, `plans/traceability.md`,
`plans/nfr-catalog.md`, `ADR-0008`, `.grugops/test-skips.md` or the ticket page, and I did not open any
of them for writing.

## Stop conditions honoured, one by one

- **`self_fix_attempts` (2) NOT consumed** — nothing failed a gate step, so there was nothing to
  self-fix. The arming and probing I did is measurement, not repair of a red.
- **No human-only failure occurred** — no visual baseline exists, and test-integrity exited `0`.
- **No production behaviour changed.** `src/cli.ts`, `src/cli-options.ts`, `src/cli.test.ts`,
  `src/history-pane.nfr.test.ts` and `src/history.ts` are md5-identical to their pre-work capture after
  32 mutant runs; all 18 merged production modules are blob-SHA identical to `main`.
- **`main` was never checked out.** I worked in a git worktree at
  `/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-qe042b` off `grugops/abc042-integrated`,
  leaving the main checkout on `main` and untouched. **Not merged, not pushed, not deployed.**
