---
id: 20260818T160500Z-software-engineer-decision-7c41
kind: decision
by: software-engineer
at: 2026-08-18T16:05:00Z
verified_by: 
confidence: high
refs:
  - ABC-103
  - src/cli.test.ts
  - ADR-0011
supersedes: 
---

# The repair is a DELETION of the count, not a substitute assertion — and why that is not a deletion in disguise

The ticket's `## Scope` offers two branches and requires the engineer to state which was taken.
**Branch taken: "delete the row if the surviving assertions already carry it."** No replacement
assertion was written, and no new helper, counter or abstraction was added.

`src/cli.test.ts`'s `it("A3 — the entry point is flat in src/, where the licence guard can see it")`
held four assertions. Three carry the row's stated purpose and stay untouched:

- `expect(productionModules()).toContain("cli.ts")`
- `expect(productionModules()).toContain("cli-options.ts")`
- `expect(nested).toEqual([])` over a recursive `readdirSync` of `src/`

The fourth, `expect(productionModules()).toHaveLength(<N>)`, is deleted. **It added no
discrimination to the row's subject**, and that was measured rather than argued (see the
`observation` note on the two-build probe filed alongside this one): the wrong build the row exists
to catch — `src/cli/main.ts` — moves a name OUT of the flat listing and INTO the nested one, which
the `toContain` rows and the `nested` equality both catch; and a nested module added BESIDE a flat
`cli.ts` leaves the count unchanged at 23, so it was **green** under the old assertion while the
`nested` equality went red. The count could not catch the nesting, and the nesting checks do not
need it.

**Why no substitute assertion was invented.** Any "carries the purpose without a repo-wide count"
replacement — a set equality, an allowlist, a "no more than N" bound — is a second hand-maintained
inventory wearing a different shape, and would reintroduce the exact tax `ABC-103` was cut to
remove. `AGENTS.md` coding rules 5, 6 and 7 (only requested features, no single-use abstractions, no
unrequested flexibility) point the same way. The smallest diff that closes the ticket is the one
taken.

**What was deliberately NOT done.** The `it` block was not deleted (test note 2 forbids it, and `A2`
would be lost). No production file was touched. The `ADR-0011` clause 1 licence-guard trigger was
not re-derived. `src/render-seam.test.ts` and `src/history-pane.nfr.test.ts` were read and left
byte-unchanged.

The deleted integer's explanatory comment was replaced by a comment of comparable length and style
stating why no total is asserted, so the next reader does not re-add one. That is the entire
`+7/−6`.
