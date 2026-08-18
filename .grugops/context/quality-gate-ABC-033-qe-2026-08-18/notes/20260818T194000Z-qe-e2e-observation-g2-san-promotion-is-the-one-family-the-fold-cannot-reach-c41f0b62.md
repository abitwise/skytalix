---
id: 20260818T194000Z-qe-e2e-observation-g2-san-promotion-is-the-one-family-the-fold-cannot-reach-c41f0b62
kind: observation
by: qe-e2e
at: 2026-08-18T19:40:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - ABC-032
  - EPIC-003
  - src/move-input.ts
  - src/san.ts
supersedes:
---

# `G2` — the `e8=q` limit is real, wider than reported, and it IS a defect: a caps-lock player hits `E8=Q`

The brief asked me to decide whether the engineer's self-reported `e8=q` limit is *a defect or a
correct fence*. **It is a defect** — narrow, low-frequency, but real, and the engineer's own framing
understated it by half.

## What was reported, and what is actually true

The engineer reported one string: lowercase `e8=q` is not reached by any variant, *"the coordinate
form `e7e8q` covers the case"*, and no criterion names the SAN spelling.

**The engineer missed the other direction.** Measured against the delivered module at `64b596c`,
position `5k2/4P3/8/8/8/8/8/4K3 w - - 0 1` (round-trips):

| line | outcome |
|---|---|
| `e8=Q` | **move** |
| `E8=Q` | **rejected** `["unreadable"]` ← the caps-lock player |
| `e8=q` | **rejected** `["unreadable"]` ← the one that was reported |
| `E8=q` | **rejected** `["unreadable"]` |
| `e7e8q` / `E7E8Q` / `E7E8q` / `e7E8Q` / `e7e8Q` | move |
| `e7-e8q` / `E7-E8Q` | move |

**`E8=Q` is the damning one.** `A1`'s entire point is that the player who types `E2E4` is understood.
Every other family tolerates caps lock — I verified `E4`, `E2E4`, `E2-E4`, `NF3`, `nf3`, `O-0`,
`o-0`, `0-0-0` all return `move`. **SAN promotion is the single family where it does not.** A player
with caps lock on plays their whole game, reaches a promotion, types `E8=Q`, and is refused with
`unreadable` — a string that is *the exact uppercasing of a spelling the module accepts*.

## The structural cause, stated precisely — and why the engineer's justification is half right

`CASE_VARIANTS` (`src/move-input.ts:100-104`) is three whole-line transforms:

```
line.toLowerCase()
line.slice(0,1).toUpperCase() + line.slice(1).toLowerCase()
line.toUpperCase()
```

**All three encode one assumption: the only case-significant character in SAN is at index 0.** That
is true for every piece-move SAN — which is exactly why `NF3` works, via variant 2 → `Nf3`. It is
**false for promotion SAN**, where the case-significant character (`Q`/`R`/`B`/`N`) is at the END.
No whole-line transform can produce `e8=Q` (lowercase prefix, uppercase tail) from `E8=Q` or `e8=q`.

The engineer's stated reason — *"uppercasing the promotion letter alone would require this module to
know that `=` introduces one, which is exactly the token knowledge the fences forbid"* — is
**correct about a targeted fix and does not license the gap**. The fence forbids this module knowing
what `=` means; it does not make the resulting hole invisible or acceptable, and it does not excuse
reporting only half of it. A fourth whole-line variant (lowercase all, uppercase the final
character) would close both `e8=q` and `E8=Q` **without any token knowledge** — it is still a blind
string transform handed back to the same two readers, exactly like the other three. Whether that is
the right fix is `ABC-032`'s / the grammar owner's call, not mine; my point is only that the fence
as argued does **not** prove the gap is unfixable here.

## Would a player actually hit it? Yes

- Caps lock is the single most common accidental terminal input state, and this project's own `A1`
  treats `E2E4` as a first-class case worth a criterion.
- Promotion is not rare — it is the endgame of a large fraction of games.
- The failure is **silent about the workaround**: the rejection code is `unreadable`, and `ABC-034`
  (which owns wording) has no way to know that `e7e8q` would have worked. The player is told their
  input is unreadable, not that a different spelling of the same move is accepted.

## Severity and disposition

**MEDIUM.** No `ABC-033` acceptance criterion names the SAN promotion spelling, so this does **not**
fail the ticket. It contradicts `EPIC-003`'s scope line *"case-insensitive input"* and sits awkwardly
against `A1`'s spirit. The coordinate workaround is genuine and undiscoverable.

Recommend a **new ticket**, owner = the grammar (`ABC-032`) or a follow-up on this module, sized
`XS`. Not a blocker for `ABC-033`'s merge. What should NOT happen is this being closed as "correct
fence, working as designed" on the strength of the engineer's note — the note only ever considered
`e8=q`, and `E8=Q` is the case that makes it a defect.
