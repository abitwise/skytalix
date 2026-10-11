---
id: ABC-056
title: `AR-1`'s accepted-risk override has drifted — its stated reason covers `brace-expansion` only, and two of today's three advisories are `nanoid` and `postcss`
status: backlog
column: Backlog
size: XS
priority: P2
epic: —
feature: —
---

# ABC-056 — the override still holds; the sentence it is written on no longer covers the set

> **Cut 2026-08-13 by BA/PM** (task `gate-abc041-2026-08-13`, subtask `refinement-ABC-041-a4`,
> Workflow 07), out of Security/NFR's `ABC-041` review, which **referenced `AR-1` rather than
> re-raising it** and recorded the drift honestly instead of inheriting it silently.
> **Owner: Release Manager** — unchanged from `AR-1` itself.

## Problem

*User*: the Release Manager, and whoever next reads `AR-1` to decide whether a `high` advisory is
already disposed of.

*Pain*: **`AR-1`'s override reason is specific to one package, and the covered set has moved.**

`AR-1` was written **2026-07-29** over **5 high**, all `brace-expansion` (GHSA-mh99-v99m-4gvg), with
a reason that is specific by design: *"the vulnerable code path requires attacker-controlled glob
patterns, which do not exist here."*

Measured at the `ABC-041` security review, **2026-08-13**:

```
npm audit             3 vulnerabilities — 1 moderate, 2 high
  brace-expansion  high      DoS via unbounded expansion / unbounded intermediate arrays
  nanoid           high      custom generators can loop indefinitely when size is zero (GHSA-2v37-7h3g-55p8)
  postcss          moderate  attacker-controlled sourceMappingURL reads arbitrary .map files (GHSA-fxqj-rqcc-2cmp)
npm audit --omit=dev  found 0 vulnerabilities     (audit metadata: prod 1 — the root package — dev 180)
```

**`nanoid` and `postcss` are new entries that `AR-1`'s stated reason does not cover.** Neither has
anything to do with glob patterns.

*Value*: **the override's structural premise still holds and was re-verified on 2026-08-13** —
`npm audit --omit=dev` is **0**, the package has **zero runtime dependencies**, is `"private": true`,
declares no `bin`, emits nothing from `build` (it is `tsc --noEmit`), and `AGENTS.md` § Deployment
posture records that nothing is deployed anywhere. None of the three packages can reach a runtime
artifact because **there is no runtime artifact**. So this ticket is **not** "a high vulnerability is
unhandled" — it is "the written reason no longer matches what it is covering", which is the failure
mode where an accepted risk quietly becomes an unexamined one.

## Scope

- **Re-state `AR-1`'s override on the reason that is actually load-bearing** — zero runtime
  dependencies, private, no `bin`, emits nothing, deploys nowhere — so it covers a *set that changes*
  rather than one CVE that happened to be first.
- **Record today's set with dates and identifiers**, so the next drift is visible by comparison
  rather than by memory.
- **State the re-check trigger.** `AR-1` has none today, which is why the drift went four advisories
  before anyone compared. `ABC-042` is a candidate — it is the ticket that ends the
  zero-production-Node-builtin invariant — but the honest trigger is probably *the first hop that
  touches `package.json`*, and choosing it is the Release Manager's.
- **Decide the `@vitest/coverage-v8` upgrade separately or not at all.** `AR-1` already priced
  `npm audit fix --force` as a **breaking** upgrade to `@vitest/coverage-v8@4.1.10` and said it
  warrants a ticket rather than a drive-by. This ticket does **not** perform it.

## Out of scope

- **Running `npm audit fix --force`, or any dependency upgrade.** `AGENTS.md` § Safety rules: do not
  change dependencies without reason. Deciding to upgrade is in scope; upgrading is not.
- **Re-severity-rating the three advisories.** The override is contextual and its context is
  unchanged.
- **Attaching any of this to `ABC-041`.** `package.json` and `package-lock.json` are **byte-untouched**
  by that diff, which adds exactly **zero** supply-chain surface. Security/NFR was explicit about not
  attaching it and this ticket keeps that separation.
- **Any change under `src/`.**

## Acceptance (Given/When/Then)

- **`A1` (the reason covers the set).** **Given** the re-stated `AR-1`, **when** each of the three
  current advisories is checked against it, **then** the reason applies to **all three** without a
  per-package argument. *(Today it applies to one of three.)*
- **`A2` (the set is dated and enumerated).** The record names, for each advisory: package, severity,
  advisory id, and the date `npm audit` was run. **Given** a later reader, **then** they can diff
  today's `npm audit` against the record and see drift without re-deriving history.
- **`A3` (the structural premise is re-verified, not assumed).** **Then** the record carries the four
  checks that make the override sound, each with its command and its output: `npm audit --omit=dev`
  → **0**; `jq 'has("dependencies")' package.json` → **false**; `"private": true`; `build` emits
  nothing. *(All four were true on 2026-08-13 — re-run them, do not copy them.)*
- **`A4` (a re-check trigger exists and is falsifiable).** The record names a condition under which
  `AR-1` must be re-read, stated so that a reader can tell whether it has fired. *("Periodically" is
  not a trigger.)*
- **`A5` (no dependency changed).** `git diff --numstat package.json package-lock.json` is **empty**,
  and `git diff --numstat -- src/` is **empty**.

## Dependencies

- **None.** `AR-1` lives in
  `.grugops/context/architecture-audit-2026-07-29/notes/20260729T145735Z-security-nfr-observation-abedec95.md`
  and the measurement is in `.grugops/context/security-nfr-ABC-041/notes/`. Both are readable today.
- **`ABC-041` neither blocks it nor is blocked by it.**

## Security / NFR triggers

- **`N8-LANE` not triggered** — **0 new test files**, **0 files under `src/`**.
- **`NFR-002` not triggered.**
- **Security: THE SUBJECT of the ticket, and the four clauses still apply to the ticket's own diff**
  (`ABC-041`'s repaired threshold): **(a)** fires on a `dependencies` key or **any** touch of
  `package.json` / `package-lock.json` — **and `A5` forbids exactly that**, so if this ticket ever
  fires (a) it has left its own scope; **(b)**, **(c)** and **(d)** are quiet because nothing under
  `src/` is touched. **On a disputed reading it fires and the gate resolves it.**

## Test notes

1. **Re-run the four structural checks; do not copy the 2026-08-13 numbers.** The whole defect being
   repaired is a record that was copied forward instead of compared.
2. **`npm audit` output is not stable over time** — that is the point. Record the date beside it.
3. **This is a documentation change with a safety consequence**, so `A5` is the criterion that keeps
   it one: an empty diff on both manifests is what separates "re-stated the risk" from "changed the
   dependencies".

## Lane cost — how many test FILES this ticket implies

**Zero, and zero files under `src/`.**

## Size and priority rationale

**Size `XS` (1).** One record re-written, four commands re-run, one trigger chosen. The only judgement
is the trigger, and it belongs to the owner.

**Priority `P2`.** The risk is genuinely low in context and was re-verified 15 days after `AR-1` was
written. It is not `P3` because two `high` advisories currently sit under a reason that does not
mention them, and the cost of that being noticed by the wrong person at the wrong time is a stalled
release conversation. **Promote to `P1` the moment this project acquires a runtime dependency, a
`bin`, or anything to deploy** — each of those removes one leg of the override's premise.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-13**. **Result: 9 of 10 — NOT MET.** ⚠️×1.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** `AR-1` covers 1 of 3 advisories by its stated reason; `nanoid` and `postcss` are not glob-pattern issues |
| 2 | scope and out-of-scope clear | **✅** re-state, enumerate, choose a trigger; four fences, first of which forbids the upgrade itself |
| 3 | INVEST-shaped | **✅** independent, tiny, testable by comparing a reason against a set |
| 4 | acceptance testable and measurable | **✅** five criteria; `A3` names four commands with their required outputs, `A5` requires two empty diffs |
| 5 | dependencies known | **✅** none; both source notes cited by path |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` 0 files; the four security clauses, with (a) deliberately set against this ticket's own `A5` |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P2`, with the promotion trigger named |
| 10 | no major unresolved blocker | **⚠️ NOT MET** — the re-check trigger (`A4`) is a **Release Manager** decision, and the `@vitest/coverage-v8` breaking-upgrade question is theirs too. BA/PM cannot score this Ready on someone else's behalf |

## Page note — `RISK-ABC143-01` rides on the coverage-v8 question

**2026-10-11, BA/PM** (task `wave-2026-09-25`, subtask `bapm-fold-qe143-2026-10-11`). Nothing above changed.
DoR stays 9/10, and item 10 is still the Release Manager's.
- `@vitest/coverage-v8` 3.2.7's installed manifest declares the peer `vitest: 3.2.7` (read at the hop). So
  **a yes to the coverage-v8 4.x upgrade is in practice a vitest 4.x bump.** The 4.x peer is
  `UNKNOWN - verify`.
- On 4.x, `tools/grugops/result-file-reporter.js` silently drops unhandled errors (`QE-143-c`, read, not
  run). **The upgrade ticket, if one is cut, carries `RISK-ABC143-01`.** That rule is stated once, on
  `ABC-143`'s page § Follow-ups. In short: depend on `ABC-149`, re-run its six plant rows at head, and
  take or decline QE's 4.x route.
- This ticket still performs no upgrade (`A5`).
