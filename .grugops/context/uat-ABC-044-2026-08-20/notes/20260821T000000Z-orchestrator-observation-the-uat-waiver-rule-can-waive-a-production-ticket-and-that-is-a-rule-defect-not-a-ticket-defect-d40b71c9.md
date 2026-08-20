---
id: 20260821T000000Z-orchestrator-observation-the-uat-waiver-rule-can-waive-a-production-ticket-and-that-is-a-rule-defect-not-a-ticket-defect-d40b71c9
kind: observation
by: orchestrator
role: orchestrator
task: uat-ABC-044-2026-08-20
at: 2026-08-21T00:00:00Z
verified_by:
confidence: high
refs:
  - ABC-044
  - AGENTS.md#test-and-uat-authority
supersedes:
---

# The zero-production-lines UAT waiver can waive a ticket that ships production code. Measured, and it is the RULE that is wrong, not this ticket

## What the rule says, and the exact word that breaks

`AGENTS.md` § `Test and UAT authority`, the 2026-08-17 standing directive:

> `git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'` must come back **empty**.

**`<delivered>~1 <delivered>` is a SINGLE-COMMIT instrument.** It silently assumes a ticket is one
commit. `ABC-044` was four — delivery, QE, the returned repair, UAT — which is the normal shape of a
ticket that gets reviewed rather than waved through.

## The measurement, on this branch, three ways

| instrument | result | consequence |
|---|---|---|
| `10811cf~1 10811cf` (**the tip when UAT began**) | **EMPTY** | **WAIVES to `Done`. No UAT. No human.** |
| `db38961~1 db38961` (the delivery commit) | `src/cli.ts`, `src/result-screen.ts` | waiver denied, correctly |
| `30482cd HEAD` (the whole branch) | `src/cli.ts`, `src/result-screen.ts` | waiver denied, correctly |

**The rule as literally written, pointed at the tip, would have sent 172 lines of new production code
to `Done` with no UAT conducted and no owner's word.** It is not a stretched reading — it is the
published command with the tip substituted for `<delivered>`, and "the delivered commit" is exactly
what a reviewer would call the branch tip they are looking at.

## Why this is escalated and NOT fixed here

**It is the owner's standing directive.** He set it 2026-08-17, it is one of three explicit kit
overrides, and it is his and revocable. **An agent quietly rewriting the instrument of a rule that
governs when humans get consulted is precisely the move nobody should make** — the failure mode it
guards against is the one it would be committing. So it is written down, not patched.

**No ticket was harmed.** The UAT Planner measured the waiver at the *delivery* commit, denied it,
conducted the UAT, and refused to sign. I independently re-measured all three forms above. `ABC-044`
is in `In UAT` awaiting the owner's word, which is the correct state.

## The candidate repair, for the owner to accept or reject — not adopted

Anchor the instrument to the **merge base**, not to `~1`:

```sh
git diff --name-only $(git merge-base main HEAD) HEAD | grep -v '\.test\.ts$' | grep '^src/'
```

This is invariant to how many commits a ticket takes and cannot be gamed by a trailing test-only
commit. On this branch it returns the two production files — the right answer.

**`ABC-113` is the live test of whether this matters.** It is cut as a genuinely zero-production-line
ticket and is a waiver candidate. Under `~1` its verdict depends on which commit someone points at;
under the merge base it is stable. **The next waived ticket is where an unfixed rule costs something.**

## Honest limits of this note

`kind: observation`, not `finding` — this install has **no `scripts/context-io.ts` and no
`§14-gate#<id>` issuer**, so no stamp is claimed and none is forged. The three `git diff` results
above are reproducible from this repository at these commit ids; the *conclusion* that the rule
should change is a judgement and is the owner's to make, not mine.
