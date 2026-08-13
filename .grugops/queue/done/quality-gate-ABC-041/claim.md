---
task: quality-gate-ABC-041
by: qe-e2e
at: 2026-08-13T21:35:35Z
done_at: 2026-08-13T21:50:08Z
branch: grugops/quality-gate-ABC-041
worktree: ../cli-chess-qe041
base: grugops/ticket-to-pr-ABC-041 @ ac17fe2
result: BLOCKED_NEEDS_FIX
outcome: |
  BLOCKED_NEEDS_FIX — and NOT on a gate step. All four `mandatory_gates` are green at QE's own hand
  (lint 0 / 51 files / 2 pre-existing infos, typecheck 0, build 0, `npm test` 824/824 on 29 files,
  test-integrity `No findings.` exit 0, skips 0), and the Orchestrator's baseline reproduced digit
  for digit: three files under `src/`, the five named modules byte-identical, `main` re-measured at
  816/816 on 28 by checking main's `src/` out and back.

  THE BLOCK IS `A4`, THE CRITERION THE ENGINEER REWROTE. The premise is real and was independently
  re-confirmed (`frame.ts:194-208` pads every panel row to the widest panel; the board is 18 columns
  against the history pane's 21). The SUBSTITUTE is not sound on its stated reasoning:

  - "Strictly stronger" is backwards. `A4` as written rejects EVERY build on this tree, so nothing
    can be stronger than it, and the build it kills that the substitute admits is the delivered one.
  - The line the Engineer's note NAMES as the repair is CIRCULAR. `width` is read off `frame[0]`,
    which IS a board row. Mutant `X2` (the seam appends blanks to every board row, digit-free) passes
    that assertion 8/8 with the adjacent whole-frame equality removed. The "plus" the note treats as
    incidental is doing all the work.
  - `A4`'s STATED PURPOSE IS FALSE. Mutant `X3b` — a real second board implementation, byte-identical,
    in its own module — ships **824/824 green and `tsc` exit 0** with `renderBoard` never called. No
    byte-equality can forbid a second implementation, because duplication starts byte-identical.

  THIRTEEN MUTANTS on an md5-pinned tree, each applied, run, reverted and the md5 re-verified. NINE
  killed, FOUR survived. The Engineer's five were rebuilt, not read, and all five reproduce. Gap 1
  from the entry review is closed MECHANICALLY — verified, not accepted: `A9` reds on all three
  `LICENSED_DRIVERS` mutants, including the entry review's predicted one-keystroke wrong move.

  SURVIVORS BEYOND `A4`: the seam may discard `messages` (824/824 green, `npm run lint` exit 0 —
  `quality.lint.strict` is false and the one warning is autofix-FIXABLE) and may discard `thinking`
  (824/824 green); `A3`'s "no row-count literal" is a no-digit grep evaded by a string length; `A6`'s
  `process.` check is evaded by `globalThis["process"]`; and BOTH are evaded outright by moving the
  text one module away — the criteria say "over the diff", the instruments read one FILE. `A7`'s
  probe measures LOAD-time closure while `NFR-002`'s premise is the PER-FRAME path: a lazy
  `import("./history.ts")` inside the returned closure is green everywhere. `A8` counts import
  statements, not consumers, and `import { type X } from "./render.ts"` satisfies it with zero use.

  FOUR KILLING ROWS added to the EXISTING `src/render-seam.test.ts` — no new file, the lane allotment
  of 1 was already spent — closing `X3b`, `X2`, `X11`, `X12`. Suite 824 -> 828, all gates re-run
  green. `src/render-seam.ts` is UNTOUCHED by this gate: the production module is correct as
  delivered; what is wrong is the account of why it is held. Nine gaps homed to Software Engineer (2),
  BA/PM (4), Architect/Design (2) and QE (1, done here).

  Recorded as `claim` / `decision` / `observation` / `artifact-ref` under
  `.grugops/context/quality-gate-ABC-041/notes/`. NO `finding` and NO `§14-gate#<id>` stamp — none is
  admissible on this install and none was invented. Nothing merged, nothing deployed, no commit on
  `main` or on the ticket branch.

  NOTE FOR THE ORCHESTRATOR: `main` moved to `8e7d500` after this branch's base, so
  `.grugops/queue/pending/quality-gate-ABC-041.md` does not exist on `grugops/quality-gate-ABC-041`
  and the pending -> done move could not be made from here without inventing the file. The claim
  directory is the ownership record; the transition is yours on merge.
---
