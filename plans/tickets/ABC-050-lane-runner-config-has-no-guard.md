---
id: ABC-050
title: The lane runner config has no guard — no static tool reads `vitest.config.ts`, and no assertion watches the containment it buys
status: backlog
column: Backlog
size: S
priority: P2
epic: —
feature: —
---

# ABC-050 — the one file that governs how all 816 tests execute is guarded by nothing, statically or dynamically

> **Cut 2026-08-13 by BA/PM** (task `home-the-gaps-2026-08-13`, subtask `refinement-home-the-gaps`,
> Workflow 07) from two gate hops: `quality-gate-ABC-026` gaps **1**, **2** and **3**.
>
> **Three gaps, ONE subject, ONE hop.** They are not three tickets because they are three faces of
> one sentence: *the mechanism all 816 tests rely on is asserted by nothing.* `vitest.config.ts` is
> read by no static tool (so a mistake in it is invisible), one of its own sentences describes a
> failure mode that cannot occur (so a reader is pointed at the wrong lever), and the containment it
> buys is watched by no assertion (so a real regression would be SILENT and green).

## Problem

*User*: every role that reads a green suite and concludes something from it.

*Pain*: three measured facts, all verified at source at this hop.

1. **No static tool reads `vitest.config.ts`.** `biome.json` `files.includes` is
   `["src/**/*.ts", "spike/**/*.ts", "*.json"]` and `tsconfig.json` `include` is
   `["src/**/*.ts", "spike/**/*.ts"]` — a root-level `.ts` file matches **neither**. Measured by the
   gate hop: `npx biome check vitest.config.ts` → *"These paths were provided but ignored"*, exit 0;
   `npm run lint` reports the same 49 files with the new config present. **Three of the four
   `mandatory_gates` cannot see it.** Only `npm test` running catches a mistake — and only a mistake
   that stops the suite. **A mistake that leaves the suite green is caught by nothing at all**, which
   is precisely the class this file exists to prevent (`isolate: false`, a mistyped option key).
2. **`vitest.config.ts:52` describes a failure mode that cannot occur.** It reads *"the identical
   assertion goes RED when the mutation and the read **share a worker**"*. Under `isolate: true` two
   test **files** never share a worker — each file gets a fresh worker thread, measured by the gate
   hop as a fresh `threadId` per file. The hop that wrote it recorded *"the SAME module"*, which is
   the true statement. As written it points a future engineer at a lever that does not exist.
3. **A real `process.env` / `isTTY` leak would be SILENT.** `src/glyph-mode.nfr.test.ts:96` calls the
   real ambient path — `beginGlyphModeSession({ ascii: false, unicode: false })()`, which reads
   `process.stdout.isTTY` and `process.env` at `src/glyph-mode.ts:117-118` — and **never asserts its
   return value.** Every other glyph-mode test injects its environment on purpose. **No assertion in
   816 tests is pointed at this hazard**, so the 24 green runs that screened the adoption and the 100
   the gate added are **not evidence about it**. The gate hop said so itself and banked neither.

*Value*: the lane config stops being a file that only fails loudly, and the containment stops being a
claim in a comment. **After this ticket, breaking the mechanism turns something red.**

## Scope

| site | what is missing | verified at source 2026-08-13 |
|---|---|---|
| `biome.json` `files.includes` | `vitest.config.ts` | matches none of the three globs |
| `tsconfig.json` `include` | `vitest.config.ts` | matches neither glob |
| `vitest.config.ts:52` | *"share a worker"* | true statement is *"the same module"* |
| `src/glyph-mode.nfr.test.ts:96` | an assertion on the value the ambient path returns | the call's return value is discarded |

## Out of scope

- **Any change to `pool`, `isolate`, `maxThreads` or any other runner option.** This ticket brings
  the file under tooling and corrects one sentence in it. **The delivered configuration does not
  move**; `ADR-0008`'s ratified 3 s wall / 13 s CPU level is untouched and unread by this ticket.
- **`ADR-0008` and `plans/nfr-catalog.md`.** Owner-ratified. Nothing here amends either.
- **The other six `*.nfr.test.ts` files.** Only `glyph-mode.nfr.test.ts` is opened.
  `src/turn-loop.nfr.test.ts` is **`ABC-051`'s**; `zobrist`, `status-panel`, `gameend` and `san` are
  **`ABC-030`'s**. No file is shared with either ticket.
- **Any production line under `src/`.** Zero. `src/glyph-mode.ts` is read, never written.
- **A CI job, a pre-commit hook, or any control over config drift beyond the two tool scopes.**
  Named and refused: `ABC-028`'s `F4` measured what a text-level control over a repository is worth.
- **`.grugops/test-skips.md`.** A named human's (`H2`), and unrelated.

## Acceptance (Given/When/Then)

**A1 — both static tools read the file, measured as a DELTA and not against a constant. Given** the
repository tip before the change, **when** the file count reported by `npm run lint` is recorded, and
the change lands, **then** the count is **exactly one higher**, and

```
npx biome check vitest.config.ts     -> exit 0, and NO line containing "provided but ignored"
```

*(A delta, not a literal `50`. `ABC-024`'s `A4` carried `625` inside a criterion and went false when
the lane grew around it; `ABC-040`'s `A1` is written the same way for the same reason.)*

**A2 — the guard CATCHES, proved by a wrong build rather than by a green run. Given** the repaired
scopes, **when** a deliberate defect is introduced into `vitest.config.ts` — one that leaves the
suite GREEN, e.g. an option value of the wrong type on an existing key — **then at least one of**
`npm run lint` / `npm run typecheck` exits **non-zero** and names `vitest.config.ts`; **and when**
the defect is reverted, **both** exit **0**. **Report which tool caught it.** *(If neither catches a
green-suite defect, the widening is cosmetic and this criterion is the one that says so.)*

**A3 — the four mandatory gates survive the widening, measured on both sides. Given** the tip before
and the tip after, **then** `npm run lint`, `npm run typecheck`, `npm run build` and `npm test` each
exit **0** on both, the test-file count and the test total are **identical** on both, and the skip
count is **0** on both. **Measure the tip; do not paste a number from this page.** *(Widening a lint
scope can surface real findings. If it does, fixing them is in scope for this ticket and each fix is
reported; suppressing a rule to keep the gate green is NOT — stop and report instead.)*

**A4 — the sentence at `:52` no longer names a lever that does not exist. Given** the repaired file,
**then**

```
/usr/bin/grep -n 'share a worker' vitest.config.ts     -> exit 1, ZERO hits
```

**and** the replacement states the mechanism that was actually measured: the armed probe went red
when the mutation and the read were in the **same module**, and `isolate: true` gives every test
**file** its own fresh worker thread.

**A5 — a leak would go RED, proved with an ARMED control. Given** an out-of-tree probe file that
mutates `process.env` (and/or `process.stdout.isTTY`) to a value that changes the selected glyph mode
**and does NOT restore it**, ordered to run **before** `src/glyph-mode.nfr.test.ts` in the **same**
worker:

```
npx vitest run --no-isolate --poolOptions.threads.maxThreads=1 --poolOptions.threads.minThreads=1
```

**then** `src/glyph-mode.nfr.test.ts` reports **≥ 1 failure**; **and** under the delivered
configuration the full suite is **green**. **The armed control lives outside the repository, is
demonstrated in the report, and is NOT committed.**

> **READ THIS BEFORE WRITING THE ASSERTION.** A green probe that cannot fail proves nothing — that is
> this criterion's whole subject, and writing an assertion that stays green in the armed run would
> reproduce the exact defect the ticket exists to close. The assertion must be **absolute**, not
> measured against a baseline captured at module load: a file polluted **before** it loaded records
> the pollution as pristine and sees no deviation. The gate hop hit this and named it.

## Dependencies

- **None blocking.** No ticket owns any of the four sites. `ABC-026` is `Done` and merged; this is
  post-merge debt it disclosed in its own gate, not a re-open of it.
- **Merged and read, not written:** `src/glyph-mode.ts:117-118` (the ambient read),
  `src/frame.ts`, `vitest.config.ts` as delivered.
- **Ordering against `ABC-051`: none.** Disjoint file sets, verified above.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU** (5% of `NFR-008`'s 13 s clause), CPU
  instrument, median of paired per-round deltas, n ≥ 7 interleaved, identity null control ≤ 1.5%.
  **Net of 160 ms per test FILE added, and this ticket adds ZERO test files** — `A5`'s assertion
  lands in the existing `src/glyph-mode.nfr.test.ts`, so that term is **+0** by construction.
- **`NFR-008` (3 s wall / 13 s CPU, `ADR-0008`, owner-ratified)** — unchanged and not re-measured by
  this ticket. **Firing threshold:** any edit to a runner option in `vitest.config.ts`. If the hop
  finds it must change one to satisfy `A1`–`A3`, **that is a stop-and-report, not a scope decision.**
- **Security: no trigger, not pre-waived.** Config scope and one test assertion; nothing is
  evaluated, spawned or interpolated, no runtime dependency is added, no stream is written.

## Test notes

1. **`A2` is the criterion that decides whether this ticket was worth doing.** A widening that
   catches nothing is a widening that changes nothing.
2. **Do not make `A3` true by narrowing a lint rule.** If the widened scope surfaces findings, fix
   them or report them. A suppression to hold a gate green is the defect wearing a config key.
3. **`A5`'s armed control must be demonstrated to fail before its green is quoted** — the gate hop's
   own discipline (`QE_ARM=1`, 2 of 2 files red on demand), and the reason its negative was worth
   anything.
4. **`vitest.config.ts` is not under `src/`,** so `ABC-030`'s *"any new file under `src/`"* clause
   does not fire on it, and this ticket does not touch that clause.

## Size and priority rationale

**Size `S` (2).** Two config globs, one comment sentence, one assertion, and one out-of-tree armed
control. It is not `XS`: widening a lint and a typecheck scope onto a file that has never been
checked has a real chance of surfacing findings (`A3` provides for it), and `A5` requires an
instrument to be built and demonstrated. Calibrated against `ABC-030` (four comment sites, no
instrument, `XS`) and `ABC-026` (one config file plus a measurement campaign, `S`).

**Priority `P2`, with a written promotion trigger.** Nothing is broken today: the suite is green, the
containment holds three-deep by mechanism, and the gate hop could not force a red across ~44 M
sampled observations. So this is a **control gap, not a defect**, and `P1` would be crying wolf.
**Promote to `P1` the moment anyone opens `vitest.config.ts` for an option change** — that is the
edit this ticket exists to make visible, and it is the only trigger that matters. It is not `P3`
because `EPIC-003` and `EPIC-006` will both add test files against a lane whose config no tool reads.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-13**. **Result: 10 of 10 — MET.** Recorded honestly: it is `10/10` because every input
existed at source and was verified at source; **`10/10` is not a reason to promote it to `Ready`**
(`ABC-030`'s standing argument, adopted unchanged — stocking a thin `Ready` column with control debt
makes it look full).

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** three measured facts, each with the file and line, each re-verified at this hop rather than relayed |
| 2 | scope and out-of-scope clear | **✅** four sites named; six fences, including the one that matters — no runner option moves |
| 3 | INVEST-shaped | **✅** independent (no ticket owns any site; file sets disjoint from `ABC-030` and `ABC-051`), negotiable, valuable, estimable, small, testable |
| 4 | acceptance testable and measurable | **✅** five criteria: a **delta** file count with no constant in it, a named wrong build that must be caught, both-sides gate equality, a `grep` that must exit 1, and an armed control that must go **red** |
| 5 | dependencies known | **✅** none blocking; the merged reads named; ordering against `ABC-051` stated and nil |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ **650 ms CPU** with the per-file term shown to be **+0**; `NFR-008` unchanged with a falsifiable firing threshold; security trigger assessed and not fired |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `S` (2), calibrated against two named tickets |
| 9 | priority assigned | **✅** `P2` with a dated promotion trigger and both the not-`P1` and not-`P3` arguments |
| 10 | no major unresolved blocker | **✅** none |

### Requested board placement 2026-08-13 by BA/PM at `refinement-home-the-gaps`: `Backlog`

**Requested, not taken** — `plans/board.md` is the Orchestrator's. Placement is `Backlog`, **not
`Ready`**, on `ABC-030`'s reasoning above.
