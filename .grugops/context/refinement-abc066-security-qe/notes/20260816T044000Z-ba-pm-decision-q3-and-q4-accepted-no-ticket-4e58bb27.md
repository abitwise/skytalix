---
id: 20260816T044000Z-ba-pm-decision-q3-and-q4-accepted-no-ticket-4e58bb27
kind: decision
by: ba-pm
at: 2026-08-16T04:40:00Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - ABC-059
  - .grugops/context/quality-gate-ABC-066-qe/notes/20260816T001800Z-qe-e2e-observation-gaps-found-at-qe-for-abc066-d73cfa8f.md
supersedes: 
---

# `Q3` and `Q4` — **ACCEPTED as known limits. No ticket, and the reason is not "too small"**

Both are QE's, both LOW, both about `ABC-066`'s `A2` guard. **Neither is a defect; each is a limit of
a guard that is doing its job.** I am recording the acceptance so the limits are on the record and
nobody re-discovers them as bugs.

## `Q3` — the guard cannot detect an option advertised TWICE. **ACCEPTED**

Mutant `M7` (`… [--colour …] [--ascii | --unicode] [--ascii]`) ships **30/30 green**: the vocabulary
row uses `new Set(...)`, which dedupes, and the count floor is `>= 6`, which a duplicate satisfies.

**Accepted, on three grounds:**

1. **`A2` is satisfied as written, and correctly so.** Every invocation such a line advertises **does**
   resolve `ok: true`. The line would be **ugly, not wrong** — QE's own words, and I concur rather
   than restate.
2. **Tightening it would require re-wording `A2` on `ABC-066` — a MERGED, GATED page.** The doctrine
   on this board (`ABC-058` § *How the wording is repaired without touching a gated page*, `ABC-060`)
   is that a criterion edited after gating means the gate ran against a page that no longer exists.
   **The only honest fix would be a new guard ticket, for a cosmetic property nobody has produced by
   accident.**
3. **The tightening has a real cost in the other direction.** Set-equality plus a floor is what
   `ABC-065`'s `N14` mutant proved is live in **both** directions (accepted-and-undocumented,
   documented-and-unaccepted). Adding a duplicate-detection row buys a cosmetic property and adds a
   spelling to pin — which is `ABC-059`'s defect class, already ticketed.

**Promotion trigger if this is ever revisited:** a duplicate actually appears in `src/cli.ts`'s
`USAGE` string. Until then this is a limit, not a gap.

## `Q4` — cosmetic malformations of the usage line pass. **ACCEPTED**

Mutant `M10` (a **double space** after the separator) ships **30/30 green**: `toContain` is satisfied
and the extra space vanishes into `split(/\s+/)`.

**Accepted, and QE said so first — *"Accepting this is the right call; pinning whitespace is
`ABC-059`'s spelling-pinned-guard defect"*.** I am seconding a disposition, not making one. Every form
the line advertises still runs; the guard tests the **property** (what is advertised resolves), not
the **spelling**, which is exactly what `M11` proved by design on `ABC-066`. **A whitespace pin would
convert a property guard into a spelling guard — the regression `ABC-059` exists to fix.**

## The honest summary

**Two of the four queued items produced zero tickets, and that is the correct result.** Both were
already dispositioned by the role that found them; my job was to check whether a ticket was owed, and
it is not. **Manufacturing an `ABC-074` out of `Q3` and `Q4` would have made this refinement look more
productive and the backlog less true.**
