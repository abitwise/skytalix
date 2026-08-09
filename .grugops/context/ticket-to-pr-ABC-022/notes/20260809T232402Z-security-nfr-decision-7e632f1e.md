---
id: 20260809T232402Z-security-nfr-decision-7e632f1e
kind: decision
by: security-nfr
at: 2026-08-09T23:24:02Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - ABC-010
  - ABC-023
  - ADR-0005
  - NFR-001
  - NFR-003
  - NFR-005
  - EPIC-003
  - EPIC-006
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# Security/NFR gate: **PASS_WITH_RISKS**. `ABC-022` moves `In Security/NFR` -> `Ready for UAT`

`In Security/NFR` **1/2 -> 0/2**, `Ready for UAT` **0/4 -> 1/4**. No limit approached, no override
taken, no written reason owed. Ticket frontmatter moved with the column. All 12 numbered column
headings re-verified against their live row counts (**0 mismatches**). The `In Security/NFR` exit is
the one board move this role owns; **nobody was enqueued** — the Orchestrator owns
decompose->enqueue. **NOTHING MERGED, NOTHING DEPLOYED** — a human holds both, and the owner's
standing merge authority is not deploy authority.

Gated against `security.asvs_level` **L1** and `security.block_on` **high**. `compliance_regime` is
**`[]`**, so **no Compliance Officer hand-off is owed** — recorded rather than silently omitted
(Section 13).

**UAT IS NOT RULED ON HERE.** The `UAT` cell in `plans/traceability.md` was deliberately left
untouched. Prior Security/NFR gates on this board wrote a UAT deferral into that cell; this
subtask's boundary reserves the UAT ruling and the merge for the Orchestrator, and a gate that fills
in another role's verdict — even a verdict everyone expects — is the same shape this board keeps
paying for. **Named rather than silently omitted.**

## Why PASS_WITH_RISKS and not BLOCKED

**No required fix is outstanding and no high-severity item exists.** `block_on` is `high`; nothing
reaches it.

The one place the verdict turned on a judgement is **V15.1.1 / V15.2.1**, and it is stated as one
rather than buried. An ASVS **L1** fail defaults to **high** by this role's own severity rule, and a
high blocks. There is no documentation defining risk-based remediation time frames for third-party
components (V15.1.1) and therefore no basis for asserting the application contains only components
inside them (V15.2.1). `ABC-009`'s gate carried a **high -> low** override; the hard limit says an
override needs a **stated reason and a named owner**, and inheriting one is not the same as taking
one, so the evidence was **re-measured here**:

- runtime `dependencies` is **`{}`**;
- `package.json` and `package-lock.json` are **byte-identical to `main` on this branch**
  (`git diff --stat main --` is empty);
- the five devDependencies (`@biomejs/biome`, `@types/node`, `@vitest/coverage-v8`, `typescript`,
  `vitest`) are build and test tooling that ship in nothing;
- there is no `bin`, no `main`, no `exports`, and no published artifact; `ADR-0007` records that this
  project deploys nowhere.

**The requirement's risk — a vulnerable third-party component reaching a running system — has no
delivery path today.** Override to **low**, reason stated, **owner Architect/Design at `EPIC-006`**,
because packaging is what creates the delivery path and with it the obligation. **`ABC-022` did not
cause this and does not worsen it: it changes no dependency.** V13.4.1 is deferred on the same
ground and is **not relaxed**.

Everything else that could have blocked was measured and did not: `NFR-001` is met on every clause,
`NFR-005` is structurally excluded and confirmed two ways, the security classification holds against
L1, and the one availability-shaped question the change raises (a board read indexed off `epSquare`)
reads **zero throws over 514 states** and **halves** the emitting surface.

## Three rulings this gate makes

**1. The ticket's security classification is CORRECT and is not inflated.** It was tested against
ASVS L1 rather than repeated: every sink class grepped across all thirteen non-test files, and the
call graph closed — `addPawnMoves` module-private, `generateMoves`' only non-test caller
`src/legal.ts:46`, `parseFen`'s only non-test callers `src/history.ts` (zero non-test importers) and
`src/perft-bench.ts` (hardcoded FENs), no `bin`, no `main`, no runtime dependency. **Reliability, not
security.** And **V2.2.1 passes *because of* this change** — the module now enforces the
preconditions its own comment states.

**2. The `ABC-010` boundary gap is a risk to ACCEPT, at LOW, and its owner is `ABC-010`.** The brief
asked whether it is a risk to accept and who owns it. It is, and the low severity is measured rather
than assumed: `parseFen` performs no `epSquare`/board consistency check (`src/fen.ts` 170-176, read
at the source), but no product path produces a FEN at all today, `ABC-010` sits in `Backlog` at `P1`
neither deferred nor descoped, and **`ABC-022` makes the consequence of the gap strictly smaller** —
4 emitting states over the `epSquare` domain become 2, and the corrupting ones are the two that go.
Two things travel with the acceptance and are recorded as their own risks: **`ABC-010` as written
does not close half (a)'s trigger** (the ticket's `## Dependencies` already flags it), and
**`ABC-022`'s guards must not be deleted when `ABC-010` lands** — the same reciprocal that
`ABC-011`'s guard (a) needed, for the same reason.

**3. `ADR-0005` 133-138 gets an OWNER here, because an unowned accepted risk is a risk nobody
fixes.** It has been carried through three hops as "unowned, no trigger attached". This gate does not
amend the ADR — amending an `accepted` ADR is an Architect ruling on this board's own precedent, and
it is not a Security/NFR call — but it does what its own hard limit requires of an accepted risk:
**owner Architect/Design, trigger `ABC-022` merged**, at which point both of that section's witnesses
are false on `main` rather than merely on a branch.

## Thirteen accepted risks, none high, none unowned

| # | risk | severity | owner |
| --- | --- | --- | --- |
| 1 | `ABC-010` unbuilt, so the semantically invalid FEN is still ACCEPTED at the boundary | low | **`ABC-010`** |
| 2 | The reciprocal: `ABC-022`'s guards must NOT be deleted when `ABC-010` lands, and `ABC-010` as written does not close half (a) | low | **BA/PM** at `ABC-010`'s refinement |
| 3 | The escalation trigger is unspent — re-checked clause by clause at the source and **NOT FIRED** (`ABC-010` in `Backlog`, neither deferred nor descoped; `EPIC-003` accepts no outside position) | low | **Orchestrator** at merge/close; **BA/PM** at `EPIC-003` decomposition |
| 4 | `A5`'s enemy-occupant axis is still a sample of two piece types — QE's, not re-derived here | low | **`ABC-023`** / BA/PM |
| 5 | `src/moves.castling.test.ts` 7-10 / 98-99 present-tense sites — `ABC-009`'s, not re-measured here | low | **`ABC-023`** / BA/PM |
| 6 | `ADR-0005` 133-138 carries the falsified premise — **owner named here for the first time** | low | **Architect/Design**, trigger: `ABC-022` merged |
| 7 | `ABC-023`'s `A4` hash pin is stale (`src/moves.ts` is `6335b452…`) — deferred by design | low | **BA/PM** at `ABC-023`'s promotion hop |
| 8 | Test-integrity checker exits **2** — an ERROR, not a pass; no registry file created | low | **human / Orchestrator** |
| 9 | `NFR-001` per-cell and per-run figures are noise and must never be quoted — this gate's null control deviates **23.1x** the signal | low | **Security/NFR** (standing) |
| 10 | **Candidate ELEVENTH instrument-limit correction for `plans/nfr-catalog.md`, NAMED AND ROUTED not applied** — the twin's aggregate readings span **3.91% peak-to-peak** on identical code against the ~±1% aggregate floor the catalog records; four rounds, one machine | low | **Security/NFR** at the next `NFR-001` gate; **Architect/Design** as the catalog's owner |
| 11 | `NFR-003`'s second component is downstream of the changed function and the ticket's trigger block does not name it — harmless given the measured per-call bound | low | **BA/PM** |
| 12 | All throughput figures are one machine — `UNKNOWN - verify` elsewhere | low | **Security/NFR** (standing) |
| 13 | E2E and the auto-UAT oracle slot are `UNKNOWN - verify`; bytes that are not valid piece codes remain beyond every in-repo instrument | low | **human / `EPIC-006`**; **QE / BA-PM** |

## What this gate did NOT touch

**`src/` — nothing.** `src/moves.ts` is still md5 `6335b452fc21ffe2d0f902ecab930840`, so the board's
standing record holds for a **fifth** gate: no gate has ever repaired the module to make its own
verdict green. **`## Acceptance` was not edited** — section md5 `7123d5c641045a44c6f63c2c20dab415`
before and after. **`plans/nfr-catalog.md` was not edited and no target moved.** `ABC-023`,
`ABC-009`, `ABC-010`, `ABC-011`, `ADR-0005` and `memory-bank/` are untouched.

## What this gate does NOT certify

That the criteria set or the falsified-comment set is complete — those are QE's and BA/PM's, and both
recorded honestly that their counts have always been floors. `A1`-`A9` and `A11` were **not**
re-derived here; `A10` is the criterion this gate owns and it is met on every clause. And the
`epSquare` sweep widens the covered domain along **one** axis; it says nothing about other board
populations, other move types, or other ep bases.
