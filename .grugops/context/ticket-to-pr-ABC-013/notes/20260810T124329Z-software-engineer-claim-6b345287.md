---
id: 20260810T124329Z-software-engineer-claim-6b345287
kind: claim
by: software-engineer
at: 2026-08-10T12:43:29Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ABC-013
  - ABC-023
  - EPIC-003
  - src/san.ts
  - plans/tickets/ABC-013-san-rendering.md
supersedes: 
---

# What this hop does NOT establish — the list QE should start from, not the list it should trust

The gate is green and all 22 criteria are satisfied. **That is not the same as "the SAN grammar in
this repository is correct", and this note exists so the green cannot later be read as though it
were.**

## Named, unverified, with who should break it

| # | claim I am NOT making | who | how to attack it |
|---|---|---|---|
| 1 | **that the 52 expected strings match the FIDE/PGN standard** | QE/E2E | Two hand-derivations by two roles now agree, which is corroboration, not an oracle. Nothing in this repo or this session was checked against an external implementation, a PGN corpus, or specification text. Attack the RULE choices, not the arithmetic — the arithmetic has now been done twice. |
| 2 | **that disambiguating over LEGAL rather than pseudo-legal moves is the right rule** | QE/E2E | It is what `## Scope` says, what `ADR-0004` implies, what the dominant convention does, and what `A7` pins — and implementations in the wild do differ here. If it is ever wrong, `## Scope` changes first, not `src/san.ts`. This is the one row where a reasonable reader could disagree with the rule instead of the answer. |
| 3 | **that the criteria set is complete** | QE/E2E | BA/PM explicitly declined to certify it and I do not either. My ten mutants were chosen by the author of the code under test; on `ABC-023` an independent hop found fourteen surviving builds after a clean exit at this same point. |
| 4 | **that `N2`/`N3`/`N4` hold on any other machine** | Security/NFR | Apple M3 / Node v24.12.0 / darwin-arm64 only. `N1` is a ratio and should travel; the three wall-clock bars are `UNKNOWN - verify` elsewhere. |
| 5 | **that `toSan` behaves sanely on an illegal `move` or a mismatched `legal` list** | — | Both are declared caller obligations and `## Scope` declares the illegal-`move` behaviour explicitly undefined. **No criterion asserts it and neither do I.** A caller that breaks either gets a silently wrong string. If `EPIC-003` needs a total `toSan`, that is a contract change and a ticket. |
| 6 | **that the two table-free properties are strong** | QE/E2E | Injectivity and grammar-shape are necessary, not sufficient: a build that ALWAYS emitted the full origin square passes both. Minimality is asserted only by the table. |
| 7 | **that `parseSan` will fit without changing `toSan`** | `EPIC-003` | I kept the grammar tables module-private and added no barrier, but I wrote no parser and ran no round trip. `ADR-0004` clause 2b's identity test cannot run until both halves exist, and it remains — as that ADR says — the only real safety net this module will ever have. |

## The one thing I would look at first if something here is wrong

**`A7`'s `Ne4`, and the rule beneath it** (row 2 above). Every other row is arithmetic that two
independent readers now agree on. That one is a policy choice about which move list disambiguation
consults, it is stated in prose in `## Scope` rather than derived, and it is the row where "correct
by the ticket" and "correct by some other implementation" can genuinely differ. It is also, by
`ABC-009`'s and `ABC-022`'s precedent on this board, exactly the kind of clause that turns out to
have been load-bearing.

## Why this is a `claim` and not a `finding`

No `finding` is admissible on this task. There is no `§14-gate` verdict record under it to issue a
`§14-gate#<id>` stamp — `emitVerdict` lives in `scripts/context-io.ts`, which does not exist in this
install — and `context.human_admission` is `off`, so no `human:<name>` stamp exists either. Per
Workflow 16 step 4 the honest degrade is a `claim` carrying `confidence: UNKNOWN - verify`, which is
what this is. Nothing on this task is self-stamped and no `index.md` / `index.jsonl` was hand-faked.
