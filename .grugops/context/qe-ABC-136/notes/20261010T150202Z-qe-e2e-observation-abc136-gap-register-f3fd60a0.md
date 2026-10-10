---
id: 20261010T150202Z-qe-e2e-observation-abc136-gap-register-f3fd60a0
kind: observation
by: qe-e2e
at: 2026-10-10T15:02:02Z
verified_by:
confidence: high
refs:
  - ABC-136
  - ABC-134
  - ADR-0011
  - ADR-0035
  - R5b
  - QE-136-a
  - QE-136-b
  - QE-136-c
  - QE-136-d
  - QE-136-e
  - src/history-pane.nfr.test.ts
  - 20261010T134751Z-architect-design-decision-six-owed-rulings-pointers-r5b-ticket-delta-95c73721
  - 20261010T150202Z-qe-e2e-decision-abc136-verdict-pass-with-gaps-b5b3f575
supersedes:
---

# `ABC-136` QE gap register: two LOW gaps routed to Architect/Design, three INFO items

This note is hand-authored and unsealed. Readings are in `…2f217343`. None of these gaps blocks `A1`–`A5`.

## `QE-136-a` — LOW — routed to Architect/Design (owner of `R5b`)

**What survives.** `XSPLICE` adds one statement after the pinned `runtimeImporters` statement:

```ts
runtimeImporters.splice(0, runtimeImporters.length, ...runtimeImporters.filter((file) => LICENSED_DRIVERS.includes(file)));
```

- It is gate-clean: Biome formats it, lint is clean and `tsc` exits 0.
- With `WPERFT-STATIC` planted, the whole suite stays green.

**Why it matters.** The Architect's ruled property (`…95c73721` § 3) says *any* gate-clean edit between `productionModulesIn(directory)` and the comparator that changes the importer set reds the tripwire. This edit sits there, and it does not.

**Why it is not FAIL.**
- The ticket's criteria name the two pins and the ledger, and both are met.
- The ticket fences out "a weakening that keeps the pinned text", and so does the new comment.

**How it could be closed.** One contiguous framed pin, from the scan line to the `toEqual` line. That pin would cover `:369-373`'s comment block, so:
- it over-pins that comment;
- it would need sequencing after `ABC-134`, if `ABC-134` edits that comment.

This is the Architect's call: accept the residual under "has to show in the diff", or widen the pin.

**How plausible it is.** Low. An in-place `splice` reads as tampering, not tidying, unlike the ticket's `.filter` narrowing.

## `QE-136-b` — LOW — routed to Architect/Design

**What survives.** `XHELPER-NARROW` adds `&& file !== "perft-bench.ts"` to clause 1's helper (`:163-164`).
- It is gate-clean and green across the full suite with `WPERFT-STATIC`.
- No test pins the helper's text. `src/cli.test.ts` and `src/render-seam.test.ts` carry their own copies of the expression.

**Why the Architect has to rule it.** The Architect drew the line at the call site: `QSCAN-NARROW` "does not edit clause 1's expression". So this is outside `R5b`. But the new comment says the scanned set (`productionModulesIn`) is pinned, and the message says "scans EVERY production module". Both read wider than the call-site pin. The helper also feeds the frame-path probe guard (`:573`).

**Mitigation in place.** The helper's docblock, two lines above, says "No exclusions, no exceptions, no filenames". A narrowing would contradict it in the diff.

**Options.** Pin the helper's body by a framed literal (a new `R5c`?), or reword the reach to "the call".

## `QE-136-c` — INFO — the accepted residual class, recorded

These keep the pinned text and weaken around it. Each is gate-clean and green across the full suite with `WPERFT-STATIC`, and each is green at base too. This is the class the ticket fences out and the new comment states.

- `XSHADOW-HELPER`: a local `productionModulesIn`, declared before the scan pair.
- `XSHADOW-READ`: a local `readFileSync`, declared before the scan pair.
- `XDEAD-COPY2`: the pinned pair kept verbatim in an uncalled `_pinnedGuardCopy`. This is the live-code twin of `QMOVE-COMMENTED-M15`.
- `XLICENCE-PUSH`: the licence widened in place. This is the RHS, not an operand.

## `QE-136-d` — INFO — `+FMT` masks the importer pin

Under `QLHS-INTERSECT+FMT`, the scan pin fires first. Pin isolation shows that the importer pin alone also kills it. Each pin carries its own kill. No action is needed.

## `QE-136-e` — INFO — probe hygiene

The header comment in `ticket-to-pr-ABC-136/probe/timing.sh` says `npx vitest run src/cli.test.ts`, but the body runs `src/history-pane.nfr.test.ts` and asserts 12. The comment is stale; the readings are unaffected.

## Cost — UNKNOWN - verify

Both `ADR-0035` sets were inadmissible under parallel load (load1 median 14.50 and 13.26). Together with the Software Engineer's two sets, that is four inadmissible sets.

**Owed.** One admissible narrow-set reading on `520fa185` vs `c715b3c2`, when load1 is low. It is not a merge blocker for an `XS` test-only change: the micro-timing is 0.37 µs and `N8-LANE` is 650 ms.
