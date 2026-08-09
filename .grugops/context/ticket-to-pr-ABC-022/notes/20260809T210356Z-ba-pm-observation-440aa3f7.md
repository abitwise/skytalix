---
id: 20260809T210356Z-ba-pm-observation-440aa3f7
kind: observation
by: ba-pm
at: 2026-08-09T21:03:56Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - ABC-011
  - ADR-0005
  - src/legal.ts
  - src/moves.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# The second question, settled by exhaustion: the reason did not PARTLY evaporate — it evaporated entirely, and the guards' justification INVERTS rather than weakens

The brief asked whether *"the stated reason that the oracle is SPECIFIED rather than derived may have
partly evaporated"*. It has not partly evaporated. **It is gone, over the guards' entire input
domain** — and the interesting part is what replaces it, which is not what either reading of the
question anticipated.

## The instrument, and why it is a proof rather than a sample

The en-passant branch's preconditions read exactly **two board bytes** — the ep **target**, and the
square one rank back on the mover's advance — plus the side to move. So
`256 x 256 x 2 = 131,072` states **exhaust their domain**. Base boards
`4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1` and `4k3/8/8/8/3pP3/8/8/4K3 b - e3 0 1`, each **printed and
re-parsed** before any verdict; one full tree copy per state, **one OS process per tree**;
`tsc --noEmit` **exit 0 on every tree before any result was believed**.

**Instrument limit, recorded rather than hidden:** `30,271` of the 131,072 states carry a byte that is
not a valid piece code and make the generator throw. The throw is captured as the observable so the
sweep stays exhaustive, and the count is **identical on every tree** — it is a limit of direct board
writes, not a verdict. **100,801 states scored.**

## The measurement

Oracle = `legalMoves(position).some(m => m.flags === FLAG_EN_PASSANT)`, the expression `ADR-0005`
clause 3 and `src/legal.ts` both name as the definition.

```
tree                              moves.ts md5   legal.ts md5   DISAGREEMENTS   legalMoves
                                                                  / 100,801       IMPURE
t-pristine  (main)                0e247853…      2a-unmodified      43,200        35,583
t-fix       (branch tip)          6335b452…      aa645c69…               0             0
t-fix       + guard (a) deleted   6335b452…      450cd8cd…             447             0
t-pristine  + guard (a) deleted   0e247853…      —                   8,031        35,583
t-fix       + guard (b) deleted   6335b452…      23fa516a…      impure on the FIRST state swept
```

**On the delivered tree the oracle disagrees with `hasLegalEnPassant` on ZERO of 100,801 states, and
`legalMoves` is pure on every one of them.** The two `true` answers left on `t-fix` are the two
genuinely in-domain states, and the oracle and the predicate return them together.

## The inversion — this is the answer to the question

Read the two guard-(a) rows against their own baselines:

- **Before the fix**, deleting guard (a) took disagreement **DOWN**, 43,200 → 8,031. Guard (a) was a
  **source** of disagreement: it made the predicate deviate from an oracle that was wrong.
- **After the fix**, deleting guard (a) takes disagreement **UP**, 0 → 447. Guard (a) is now the
  **reason the two agree**.

On the ticket's own four `## THE CORRECTION THIS TICKET CARRIES` rows the same inversion is visible
one row at a time: the two own-piece rows read `hasLEP=false / oracle=true` on `main` and
`hasLEP=false / oracle=false` on the tip; the two enemy rows read `false/false` on both. And on
`t-fix` with guard (a) deleted, all four read `hasLEP=true / oracle=false` — the mirror image of the
pre-fix picture. **The ticket's table is unchanged by the fix, exactly as it claims of itself.**

Guard (b) is untouched by any of this: it is about the predicate's **own synthesised probe** and has
nothing to do with `generateMoves`. Deleted, it makes `hasLegalEnPassant` impure on the first state
swept, before and after.

## What this means the comment must say — and the trap in saying it

The paragraph at `src/legal.ts:68-72` has three parts and they must be treated separately, the same
care `A11` already applied at 102-105:

1. **68 to "…reachable by play."** — TRUE, untouched.
2. **"Outside it the oracle is unsound — `generateMoves` offers …OWN piece"** — **FALSE**, both the
   conclusion and its mechanism. Must be **deleted, not softened**.
3. **"so the answer there is SPECIFIED rather than derived: `false` …"** through line 72 — **still
   TRUE**, and may stand. What it lost is its stated reason, not its content.

The replacement reason is not "the generator is wrong". It is that **`hasLegalEnPassant` never
consults the generator at all**: running it costs ~14x a bare key on the nodes that reach it
(`ADR-0005`), so the predicate synthesises its own probe and must establish its own preconditions, and
specifying rather than deriving is what keeps the hash **independent** of the generator.

**The trap, and it is the reason this needed measuring rather than reasoning:** the paragraph must NOT
be rewritten as *"the oracle is sound now, so we agree with it."* That reads as making the guards
optional, and the measurement says the opposite — **the agreement is bought by guard (a) (447 states),
not inherited from the fixed generator.** Swinging the paragraph from one over-strong claim to its
mirror image would be the same class of defect in the opposite direction.

`ADR-0005` is **not reopened** by any of this. Guard (a) is more load-bearing than its old
justification described, not less.
