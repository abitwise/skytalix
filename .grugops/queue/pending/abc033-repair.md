---
task: repair-ABC-033-2026-08-18
subtask: abc033-repair
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-033-one-prompt-both-formats-and-the-ambiguity-outcome.md
ref: .grugops/context/repair-ABC-033-2026-08-18/
parent_ref: .grugops/context/quality-gate-ABC-033-qe-2026-08-18/
enqueued_by: orchestrator
enqueued_at: 2026-08-18T14:30:00Z
branch: grugops/abc033-repair
base: grugops/quality-gate-ABC-033-qe-2026-08-18 @ 8c84265
---

# Subtask: `ABC-033` repair round 1 of `quality.self_fix_attempts` = 2 — four QE gaps, `G1` is NOT yours

**Branch off `grugops/quality-gate-ABC-033-qe-2026-08-18` @ `8c84265`** — it carries your delivery
AND QE's six notes. Read `parent_ref:` and the one note in `ref:` first; the second is my own
first-hand reproduction of `G1`.

**You wrote this module. QE broke four things in it. Three of the four are guards that do not bite
— which is the more useful kind of defect, and QE found them by mutating, not by reading.**

## `G1` IS NOT YOURS. Do not repair it

QE falsified `A4`: **seven knights attacking `d4` overflow the message region** (`(+2 more)`), eight
give `(+3 more)`. I reproduced both first-hand — see the note in `ref:`. Your module produced the
full list and handed it over **intact**; it did not truncate and did not widen the frame, which is
the correct side of `A4`'s own line. **The frame overflow is `EPIC-002`'s and BA/PM is cutting the
ticket in parallel with this hop.** Do not touch `src/frame.ts`. Do not truncate. Do not widen.

One thing that IS yours: `src/move-input.test.ts` carries the comment *"exactly six squares attack
any given square by knight move."* **That is false** — `d4` has eight knight-attackers; it is true
only of edge-ish squares like `d2`, which is what every fixture used. **Correct the comment** and
say what it is actually true of. A wrong reason in a passing test is how the next bound goes wrong.

## `G2` — MEDIUM, and wider than you reported. This one IS a behaviour fix

You reported `e8=q` unreachable. QE found **`E8=Q` — the caps-lock form — is also rejected**
(`unreadable`), while `e8=Q` resolves. It verified `E4`, `E2E4`, `E2-E4`, `NF3`, `nf3`, `O-0`,
`E7E8Q` all work: **SAN promotion is the only family case-folding cannot reach**, because all three
of your variants assume the case-significant character is at index 0 — true for piece-move SAN,
false for promotion SAN.

Your reasoning (a targeted fix needs token knowledge, which the fences forbid) is **right about a
targeted fix and does not prove the gap unfixable**. QE names a fourth **blind whole-line** variant:
lowercase all, uppercase the **last** character. It knows nothing about `=` or about promotion.

**Add it, or explain in a note why it is wrong.** I am not ordering the specific variant — I am
ordering that a caps-lock player typing `E8=Q` stops being told `unreadable`. If your fix needs
grammar knowledge to work, stop and say so; the fence wins over the criterion.

## `G3` — MEDIUM, test-side. `A5`'s guard is structurally blind

QE mutant M11 dropped the shared `legal` from `toSan(position, move, legal)` and **0 tests red**,
while the real `legalMoves` call count went 1 → 3 (two knights) and 6 → 12 (six queens). `toSan` is
imported directly from `./legal.ts`, outside `MoveInputDeps`, so **your spy cannot see it**.

The baseline cost (`1 + O(candidates)` from `toSan`'s check/mate suffix on the *after* position) is
defensible and I am not asking you to change it. **I am asking that `A5`'s guard bite.** Also: the
comment at `src/move-input.test.ts:307` claiming *"no resolver derives its own either"* is **false
as written** — fix the words, not just the guard.

## `G4` — MEDIUM. A reason code that no input can produce

QE mutant M6 made the reason **always** `no-such-move` and **all 40 tests passed**, including for
`""`, `"hello"`, `"Qz9"`. `A6`'s loop uses `stringMatching(/^(unreadable|no-such-move)$/)`, so
**`unreadable` is pinned to no input anywhere.** Either find the input that produces it and assert
it exactly, or — if no input can — say so plainly, because then the code is dead and that is a
finding about the design, not a test gap.

## `G5` — LOW. The attempt order is not asserted, and the page says it is

The ticket says the order is *"fixed and **asserted**"*. QE mutant M12 swapped it: **0 red**. The
test at `:211` cannot distinguish, because `attemptsOn` calls **both resolvers eagerly** on every
text — there is no order of attempt, only a preference between two already-computed results.

**Decide honestly which is true and make the page and the code agree.** If eager-both is the right
shape, then the page's "order of attempt" prose is what is wrong and you say so. Do not manufacture
a laziness the design does not need just to satisfy a sentence.

## Fences

- **`A7` still binds**: nothing under `src/` but `src/move-input.ts` and `src/move-input.test.ts`.
- **Do not weaken any guard to make it pass.**
- **Do not touch `src/frame.ts`, `src/san.ts`, `src/coordinate-move.ts`** — merged, and `G2` must be
  solved inside your own module or not at all.
- Do not merge, do not deploy, do not move a board column.

## Gate

Full blocking gate on your branch tip, in a **contained lane** — the repo root is contaminated by
sibling worktrees (`ABC-050`). Report the lane. Baseline to beat: 1039 tests / 36 files, skip 0.
**Re-run QE's three surviving mutants (M6, M11, M12) and show they now red.** Record the mutant
**diffs**, not descriptions — QE flagged that as a process gap when its counts diverged from yours.

## Publish

Typed notes per Workflow 16 into `ref:`. **No `finding` is admissible on this install.** Claim by
hand: `mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/abc033-repair`.

Commit on `grugops/abc033-repair`, never on `main`.
