---
id: 20260812T020000Z-orchestrator-decision-c73e5a81
kind: decision
by: orchestrator
at: 2026-08-12T02:00:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-027
  - ADR-0010
  - NFR-002
supersedes:
---

# The first FAIL in this project's history — accepted, and `A1` must be repaired before the fix can be built

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Nothing here is a `finding`.**
> Written BEFORE the subtask that references it.

## Verified, not accepted

| claim | how I checked it | result |
|---|---|---|
| a real terminal was used | `which screen` | **GNU screen 5.0.2 is genuinely installed** — it did not fabricate one |
| `xenl` is real | `infocmp` on xterm / screen / vt100 / xterm-256color | **all four declare `xenl`**, and `el=\E[K` |
| `A1` forbids the fix | read `A1` in the ticket | **confirmed** — it pins `H−1`, `H+1`, `(H−1)×3`; the safe shape needs `H`, `H+2`, `H×3` |
| gate wrote no code | `git log --name-only` | notes, queue and one traceability row only |

## Why I accept the FAIL

Twenty-plus gates in this project's recorded history have returned PASS or PASS_WITH_RISKS. **This is
the first FAIL, and it is right.**

It is not a judgment call dressed as a measurement. The gate **isolated the primitive with two
controls at a 10-column window**: ten characters survive; nine plus `\x1b[K` survive; **ten plus
`\x1b[K` lose the last cell.** Then end-to-end at a window exactly `W`=18: merged keeps all nine
board rows, **delivered loses the last cell of all nine — the entire h-file plus its label.** Clean
at 19 and at 80. The trigger is exactly `C == W`, which is a *bound*, not a worry.

**QE's VT/xterm reading is what a real emulator implements, and the suite's screen model is
measurably wrong at the margin.** That inverts the earlier disposition: this is not a risk to accept,
it is **a regression this ticket introduces**, with the merged baseline clean beside it on the same
instrument in the same session.

The gate also **confirmed the ticket's own value on that emulator** — the narrowing residue that
survives under merged is gone under delivered. So the ticket is right and its emission is wrong by
three characters.

## The routing decision that actually matters this hop

**`A1` currently pins the UNSAFE emission byte for byte.** It requires `\x1b[K` = `H − 1`, `\x1b` =
`H + 1`, delta `(H − 1) × 3`. The fix moves the erase to column 0, giving `H`, `H + 2`, `H × 3`.

**So the Engineer cannot build the required fix without going red on `A1`.** BA/PM must re-derive
`A1`'s numbers **from `H`** first — and *never by relaxing them*, because QE measured `A1` as where
**9 of 14 mutants die**. A loosened `A1` would trade a three-character defect for the loss of the
suite's main killer.

**That ordering is forced, and it is why this is a BA/PM hop before an Engineer hop rather than one
combined hop.** I am stating it as forced rather than preferred because I have twice this round
called a preference a forced edge and been corrected; this one is a build-time contradiction, not a
convenience.

## The shape of the fix, for the record

```
delivered : CURSOR_HOME + rows.join(EL + "\n")      + ED   <- EL fires AT the margin
required  : CURSOR_HOME + EL + rows.join("\n" + EL) + ED   <- EL fires at COLUMN 0
```

**Safe by construction**: at column 0 the margin state cannot exist. Cost `+69` = `H × 3`, three
characters more than now. Measured clean on the same emulator at `C == W` and at 80.

## Backward, and this is the fourth time

`In Security/NFR` → `In Development`. Security/NFR 2/2 → **1/2**, In Development 1/3 → **2/3**.
Same shape as `ABC-016`'s `D19b` and `ABC-019`'s `A9b`. **`Blocked` was deliberately not used** — the
gate is right that nothing waits on a *decision*; the work is known.

## What this vindicates, and what it does not

QE asked that the margin question ride as a **follow-up rather than a hold**, and I overrode that:
the ticket went **into** the gate rather than past it. That call was right — but the credit belongs
to the gate that measured it, not to the routing. **QE's own `claim` note predicted every testable
consequence correctly, including the 9-row figure and the identity of the rows.** It was right and
marked itself `UNKNOWN - verify` because it could not measure; the gate could, and did.

The general lesson I am recording: **an `UNKNOWN - verify` on a load-bearing surface is not a small
risk to carry forward — it is an unmeasured one, and the difference only shows when someone
measures.**

## The other results, which are all green

`NFR-002` **MET** on the gate's own instruments — +66 chars costs **+0.13/+0.15 µs, 0.0009% of 16 ms**,
~2,500x headroom with `assembleFrame` — **and its merged cell reproduces `ABC-018`'s gate figures for
the same quantity**, which is a check on the instrument, not just the result. `NFR-007` MET.
`N8-LANE` **MET at 0 ms** with an identity null control at −0.41%. Catalog **byte-identical to `main`**
and no row seeded, because the decision does not need one. Security half **triggered, run and clean**:
180 adversarial cases, 0 unaccounted escapes, 0 C0 survivors, row count constant.

Four accepted risks, each with a named owner and trigger.
