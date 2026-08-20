---
id: 20260820T222500Z-architect-design-decision-the-exit-code-stays-zero-and-the-contract-stays-at-three-codes-9f2ac310
kind: decision
by: architect-design
at: 2026-08-20T22:25:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - ADR-0016
  - AGENTS.md
  - src/cli.ts
  - ABC-109
supersedes:
---

# RULED: `0` STANDS. BA/PM is CONFIRMED, not overruled — and the honest part is that the code half needed no design hop

## The ruling

**Exit `0`, stderr silent, contract stays at exactly three codes (`0` / `1` / `70`).** `ABC-115`
`A2`(i)'s literal is unchanged, `A2`(ii) is unaffected, the ticket is **not re-cut** and **not
re-scored** (`S`/`P1` is BA/PM's pen and I did not touch it). `ABC-115`'s DoR item 10 ⚠️ is
**closed**: the reversible ruling has been reviewed by the role it was reserved for, and it holds.

**The brief invited me to say plainly if `0` was right and this needed no design hop. Half of that is
true and I am saying it: on the EXIT CODE alone, BA/PM's reasoning is sound as written and my hop
adds confirmation, not correction.** The half that did need the hop is the **seam** and the
**permitted shape of the arm** — see the sibling `decision` note and `ADR-0016` — and one measured
result there (a bare swallow satisfies `A1`+`A2` and still leaves the product wrong) would otherwise
have been discovered by an engineer mid-fix, which is exactly what `In Design` exists to prevent.

## Why `141` is rejected on more than authority

BA/PM rejected `141` because adding a fourth code was not BA/PM's to do. **It IS mine, and I still
reject it** — three of the four reasons are new at this hop:

1. **It is a fourth code**, against the contract written in `AGENTS.md` `## Development` and in
   `src/cli.ts:109-115`, and against coding rule 5 (only requested features).
2. **Node ignores `SIGPIPE` for stdout** — which is precisely why an `EPIPE` error object exists to
   crash on. A *truthful* `141` means restoring the default disposition and re-raising the signal, so
   the child dies **by signal** — and `ABC-115` `A2` requires `signal === null`. The ruling and the
   criterion cannot both hold.
3. **The remaining route is `process.exitCode = 141` by hand — a status that claims a signal death
   that did not happen.** That is the `ABC-114` species of defect (a true-sounding statement that is
   not true), which is the same reason BA/PM gave for rejecting `70`. Taking `141` to avoid a false
   sentence about a bug, by writing a false sentence about a signal, is not a trade.
4. **It changes the observable result of every `set -o pipefail; … | head` on this project**, for a
   distinction **no consumer has been measured wanting**. If one is ever measured, that is
   `ADR-0016`'s first falsification trigger and `ABC-115`'s pre-registered `P0` trigger.

`70` and `1` are rejected on BA/PM's grounds, both of which I re-measured (the `--nonsense` /
piped-session collision at exit `1` reproduced at this hop).

## THE EDIT OWED TO `AGENTS.md`: NONE. Named explicitly, because the brief asked who owns it

Under this ruling the product keeps three codes and *"0 when the session ran, 1 for a refused command
line, 70 for an internal error"* stays **true verbatim** after the fix. So:

- **`AGENTS.md` needs no edit, and I made none** (the fence, and `ABC-109` is live against that file
  under a byte cap). `ABC-115` `A8` is satisfied by its **first branch** — *"still describe the
  delivered behaviour verbatim"* — and the delivery note says so.
- **`src/cli.ts`'s exit-code docblock needs no amendment** either, for the same reason. What the
  engineer SHOULD add is a short comment beside the new arm pointing at `ADR-0016` — that is
  explanation, not a contract change, and it fits inside `A6`'s ≤ 15-line fence alongside the ≤ 5
  code lines.
- **Had I taken `141`, both documents would have needed amending in the same commit**, `AGENTS.md`
  under `ABC-109`'s cap, plus any assertion pinning the code set — and that would have been a second
  ticket, not `ABC-115`'s size. **That cost is part of why the answer is `0`, and it is recorded so
  the reasoning is not mistaken for timidity.**

## What I did not do

Not re-scored (`S`/`P1` stands). Not moved past `Ready for Dev`. No `src/` file touched. No merge, no
deploy. `ABC-043`, `ABC-042`, `ABC-044`, `ABC-113`, `ABC-114` untouched; `ABC-050`'s `exclude`
residual and `G-06` are still open and still not mine.
