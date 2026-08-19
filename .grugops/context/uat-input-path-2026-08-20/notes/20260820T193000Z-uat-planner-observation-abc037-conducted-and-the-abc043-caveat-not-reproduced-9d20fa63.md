---
id: 20260820T193000Z-uat-planner-observation-abc037-conducted-and-the-abc043-caveat-not-reproduced-9d20fa63
kind: observation
by: uat-planner
at: 2026-08-20T19:30:00Z
verified_by: 
confidence: high
refs:
  - ABC-037
  - plans/tickets/ABC-037-the-real-prompt-input-seam.md
  - src/line-input.ts
  - src/cli.ts
  - ABC-043
supersedes: 
---

# `ABC-037` conducted — eight scenarios, plus the `ABC-043` environmental check

**This is a conducted result, not an acceptance.** See the sibling `decision` note.

**8 scenarios run, 8 pass, 0 fail. 2 acceptance criteria NOT EXERCISED**, one of them the
ticket's own discriminating criterion — read that section before reading this as clean.

## 37-1 / 37-8 — lines are taken one at a time, in order, and the game keeps state

Eight half-moves through the production prompt, including a check:
```
$ printf 'e4\nBc4\nQh5\nQxf7\nQxf7\nQf7\n' | node src/cli.ts
...
Black to move  4...  CHECK
last: Qxf7+  material: -2
   1. e4      Nc6
   2. Bc4     Ne5
   3. Qh5     Nxc4
   4. Qxf7+
...
White to move  5.
   4. Qxf7+   Kxf7
```
exit `0`, 11 boards, 7 prompts. Each line was consumed by exactly one turn, in the order typed;
the two trailing lines (`Qxf7`, `Qf7`) became `no-such-move` once the queen had been taken, and
the board did not move for either. **PASS.**

## 37-2 — ending the session at the prompt

```
$ node src/cli.ts < /dev/null
...
> input ended
```
exit `0`, one board, 0.09 s. **PASS.**

## 37-3 / 37-4 — ending the session mid-line

```
$ printf 'e4' | node src/cli.ts        # no trailing newline
```
**One** board, `input ended`, exit `0` — the half-typed `e4` was **discarded, not guessed**. A
product that played it would be moving a piece the player never committed to.

```
$ printf 'help\ne' | node src/cli.ts
```
Two boards: the completed `help` was honoured (`commands: help board / quit claim`), the trailing
fragment `e` was discarded, `input ended`, exit `0`. **PASS both — `A3` at the product surface.**

## 37-5 / 37-6 — the length boundary, which is exact and which explains itself

```
len=1023  ->  unreadable
len=1024  ->  unreadable
len=1025  ->  line too long / max 1024 chars
```
All three exit `0`, board unchanged, session continues. The refusal **states its own limit** and
the limit it states is the limit it enforces. A 10,000-character paste produced the same refusal
and 986 bytes of output — the product does not echo what it refuses. **PASS.**

## 37-7 — surrounding whitespace

`   e4   ` was accepted and played as `e4`. **PASS.**

## What the prompt writes, checked as bytes rather than as an impression

Across every piped run — `s035-cmds` (2934 bytes), `s033-ambig2` (4034), `s033-mixed` (3547) —
**zero ESC (`\033`) bytes were written to stdout**, and the prompt string `> ` appears exactly
once per prompt cycle. The reader emits no cursor control of its own. **Consistent with `A6`,
observed on a pipe.**

## The `ABC-043` live-stdin caveat — checked, NOT reproduced here, and NOT re-cut

`ABC-043`'s QE recorded an open defect: on a **live** stdin the human's first move is silently
eaten (2 boards for 1, three prompts). I checked whether it changes any scenario in this pack.

I re-ran 33-1 through a pseudo-terminal rather than a pipe:
```
$ { printf 'e4\n'; sleep 5; } | script -q /dev/null node src/cli.ts
White to move  1.
Black to move  1...
last: e4  material: 0
White to move  2.
last: Nc6  material: 0
> ^Dinput ended
```
**3 boards, the move was played, exit `0` — the defect did not reproduce in this harness.**

**Two honest limits on that, and neither is a re-cut of `ABC-043`.**
1. A `script`-allocated pty fed from a pipe is not a human at a keyboard. **It is possible the
   defect needs real interactive timing that my harness does not produce.** I am reporting a
   non-reproduction in one environment, not a refutation of QE's finding.
2. **Every other result in this pack was measured on a pipe.** If the defect does bite a human at
   a keyboard, then a person hand-executing this pack should expect their **first** typed line of
   each session to behave differently from my transcript. That is an environmental caveat on MY
   results and it belongs to `ABC-043`, not to `ABC-033`, `ABC-035` or `ABC-037`.

## NOT EXERCISED — named, not assumed

- **`A5` — a bug below the prompt must NOT be swallowed. This is the ticket's own stated
  discriminating criterion** ("a build that wraps the resolver call in a try/catch returning
  `rejected` passes every other criterion on this page and fails this one"), and **it is not
  reachable from the prompt at all**: it needs a deliberately throwing resolver injected into the
  seam, which would mean changing the product, which this hop is fenced from doing. The
  top-level contract it feeds (`internal error: a bug ended this session…`, exit `70`) is
  therefore **unobserved** here. I read the code path and it matches the ruling; **reading is not
  running, and I am recording it as not exercised rather than as a pass.** This is the single
  largest gap in this pack and the owner should be told so before he signs.
- **`A7` — no work per keystroke.** A call-count property behind the prompt; not observable from
  the outside. `NFR-003`'s wall-clock reading is `plans/nfr-catalog.md`'s.
- **`A1`'s "runs to a terminal result".** Eight plies ran through the seam (37-8) — well past the
  four the criterion names — but **no game in this pack reached checkmate, stalemate or a draw**:
  the engine defended the scholar's-mate attempt, and forcing a terminal result against a live
  opponent is not achievable in a bounded script. The **at-least-four-plies** half passed; the
  **terminal-result** half is **not exercised**.
- **`A2`'s "a third line is still buffered"** and **`A8` (diff shape)** are instrument-level and
  QE's, not business scenarios.
