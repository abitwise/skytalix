---
id: 20260812T052000Z-architect-design-observation-2c8b5e44
kind: observation
by: architect-design
at: 2026-08-12T05:20:00Z
verified_by:
confidence: high
refs:
  - ADR-0010
  - ABC-027
supersedes:
---

# I repeated the count-only `A1` prescription one hop after it was recorded as a failed attempt. Corrected here, and in the ADR.

> **Hand-authored**; `scripts/context-io.ts` absent, `mcp__grugops__propose_note` unavailable. **No
> `finding`.** This note **corrects one paragraph of my own `artifact-ref`
> `20260812T051000Z-architect-design-artifact-ref-9f47c2ba`** and the routing sentence of the
> `ADR-0010` correction block committed at `51c8f8b`. It does **not** supersede either — the rest of
> both stands.

## What happened, mechanically

`main` moved **while I was working.** My branch was cut from `9c3326a`; the Orchestrator committed
`505216c` to `main` mid-hop, carrying `abc027-rf1-2026-08-12`'s **`failed-attempt`** note. I read the
diff against `main` only at the end, as a boundary check, and found it there. Had I not run that
check I would have shipped the paragraph below uncorrected.

## What I got wrong

My `artifact-ref` note wrote that `ABC-027`'s `A1` *"must be re-derived from `H` … `\x1b[K` = `H`
(23), `\x1b` = `2 + H` = 25, delta `H × 3` = 69."* **Those three numbers are the exact prescription
the Orchestrator had just recorded as a failed attempt**, because they do not do the job:

| writer | `\x1b[K` | `\x1b` | delta |
|---|---|---|---|
| **RF-1** — safe, erase at **column 0** | 23 | 25 | 69 |
| **`M2`** — unsafe, erase at the **margin** (`rows.map(r => r + EL).join("\n")`) | **23** | **25** | **69** |

**Identical in all three.** Re-measured by me at this hop, independently of the note that reports it.
Under `A1`'s OLD `H − 1` counts the count alone killed `M2`; under the substituted counts it does not.
**So the substitution would have left `A1` weaker against precisely the failure mode the repair
exists to prevent, while reading as a faithful repair.**

What separates the two forms is a **shape** clause, also measured here: the text must begin
`\x1b[H\x1b[K` (**true** for RF-1, **false** for `M2`) and **no `\x1b[K` may be immediately followed
by a newline** (**false** for RF-1, **true** for `M2`). That clause is BA/PM's and is already
written; **I did not author it and this ADR does not prescribe it.**

## Why I am recording it rather than quietly fixing the sentence

It is the same pattern the `failed-attempt` note names: *a repair arrives with the authority of
having just fixed something and gets read as a solution rather than as a new claim.* **I was one hop
downstream of that note and reproduced its content as though it were the specification** — while
writing a correction whose entire subject is unverified numbers copied between documents. The
`ADR-0010` block now carries the trap explicitly, so the arithmetic in it cannot be lifted as a
criterion.

## What is NOT affected

The measured content of the `ADR-0010` correction is unchanged and still holds: **`:376` becomes
`2 + H` = 25**, clause 1's `+66` is the right-margin figure and the delivered cost is **+69**,
`NFR-002` does not move, and the set of broken assertion sites is identical under both emission
forms. **No clause of either ADR is edited or re-opened by this correction either.**

## Consequence for routing

**My branch is now behind `main` by one commit (`505216c`) and owes a rebase.** I did not rebase it:
this is a doc-only branch with no live agent on it, but the rebase is the Orchestrator's call and
`main` is not mine to check out. `ABC-027`'s `A1` **on `main`** is still the unsafe form — BA/PM's
repair has not merged — so anyone reading `A1` from `main` is reading the pre-repair text.
