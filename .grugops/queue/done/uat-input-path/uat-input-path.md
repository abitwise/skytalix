---
task: uat-input-path-2026-08-20
subtask: uat-input-path
role: uat-planner
workflow: agent-factory/workflows/06-uat-pack.md
tickets:
  - plans/tickets/ABC-033-one-prompt-both-formats-and-the-ambiguity-outcome.md
  - plans/tickets/ABC-035-in-game-commands.md
  - plans/tickets/ABC-037-the-real-prompt-input-seam.md
ref: .grugops/context/uat-input-path-2026-08-20/
enqueued_by: orchestrator
enqueued_at: 2026-08-20T18:00:00Z
branch: grugops/uat-input-path
base: main @ HEAD
---

# Subtask: conduct UAT on the three input-path tickets — `ABC-033`, `ABC-035`, `ABC-037`

**The waiver was tested and does NOT apply to any of these three.** I measured it from git rather
than asserting it, per `AGENTS.md` § *Test and UAT authority*: each delivered production lines —
`ABC-033` → `src/move-input.ts` + `src/coordinate-move.ts`; `ABC-035` → `src/command-input.ts`;
`ABC-037` → `src/line-input.ts` (introduced at `69bb1e3`, amended at `09fb8a6` — **neither commit
message names the ticket**, so a message grep says "no production lines" and is WRONG here).
So all three need a UAT conducted.

## Read first
- `AGENTS.md` § **Test and UAT authority** — read it in full before you write a single scenario.
- The three ticket pages and their acceptance criteria.
- `agent-factory/workflows/06-uat-pack.md`, `agent-factory/roles/uat-planner.md`.

## What you may do, and the one thing you may NOT
**Conducting the UAT is yours** — granted standing by the owner (2026-08-15). Run the business
scenarios **against a real build**: `npm run chess` is wired and live (`node src/cli.ts`).

**YOU MAY NOT SIGN.** The owner's word in session IS this project's `In UAT` exit signature
(2026-08-16), and he was told explicitly that a green agent report would NOT be treated as his
acceptance. **Write your result so that "UAT passed" can NEVER later be read as a human having
accepted the work.** No `finding` is admissible on this install and `context.human_admission` is
`off`, so your result is a `decision` / `observation` note carrying **no stamp**. Say that plainly
in the note itself.

## What to produce
- A **UAT pack** per ticket: business-language scenarios, test data, and pass/fail criteria a
  non-engineer can execute — not a restatement of the acceptance criteria in engineer language.
- The **conducted result** per scenario: what you typed, what the product did, pass or fail.
  Transcripts, not adjectives.
- A **signoff checklist** the owner can answer with his word.
- Anything you could not exercise, named as not exercised rather than assumed passing.

## Known live defect — do NOT rediscover it, and DO check whether it bites here
`ABC-043`'s QE found that on a **live stdin** (a human at a keyboard, not `/dev/null` and not a
pipe), **the human's first move is silently eaten** — 2 boards rendered vs 1, with three prompts.
That is an open, recorded defect against `ABC-043`, not against these three. **If it changes what a
scenario here does, report it as an environmental caveat on YOUR result and attribute it to
`ABC-043`.** Do not re-cut it, do not fix it.

## Fences
- **Do not touch `plans/board.md`.** Column moves are mine, and two other branches are in flight in
  that file. Say which column you believe each ticket should land in; I move it.
- **Do not touch `src/`, `AGENTS.md`, `plans/nfr-catalog.md`, `package.json` or `vitest.config.ts`.**
  A UAT that changes the product is not a UAT.
- **Do not fix any defect you find.** Report it. A failing UAT is a legitimate result and is more
  valuable than a green one you had to edit the product to get.
- Do not merge, do not deploy, do not self-sign.
- Report your lane cost; **do not grade it** — `ADR-0014` rules `NFR-008` BREACHED and `ABC-110` is
  live on it.

## Publish
Typed notes per Workflow 16 into `ref:`, hand-authored per `agent-factory/contracts/context-note.md`.
Claim by hand: `mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/uat-input-path`. **Work in your own `git worktree`, not the repository tree**
— another agent is running in this wave. Commit on `grugops/uat-input-path`, never on `main`.
