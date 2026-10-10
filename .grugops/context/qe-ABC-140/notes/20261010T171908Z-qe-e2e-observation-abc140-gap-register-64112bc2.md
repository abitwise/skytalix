---
id: 20261010T171908Z-qe-e2e-observation-abc140-gap-register-64112bc2
kind: observation
by: qe-e2e
at: 2026-10-10T17:19:08Z
verified_by:
confidence: high
refs:
  - ABC-140
  - ADR-0011
  - ADR-0029
  - R5d
  - QE-136-a
  - QE-136-c
  - QE-137-b
  - QE-140-a
  - QE-140-b
  - QE-140-c
  - AR-053-COMPOSER
  - src/history-pane.nfr.test.ts
supersedes:
---

# `ABC-140` QE gap register: one LOW gap in an accepted class whose trigger does not reach this guard, plus two INFO items

This note is hand-authored and unsealed. Readings are in `…5400cc2b` and `../probe/`. None of these blocks `A1`–`A6`.

## `QE-140-a` — LOW — routed to Architect/Design (owner of the `R5` series)

**What survives.** A statement inserted **between** the composer tripwire's two pinned statements. That is the blank
line at `:613`, between the scan (`:610–612`) and the comparator (`:614–617`). It keeps every pinned byte:

```ts
    );
    composers.splice(0, composers.length, ...composers.filter((file) => file !== "perft-bench.ts"));

    expect(
```

An early `if (composers.includes("perft-bench.ts")) return;` in the same place survives too. With a second composer
planted (`Q-WSC`), each one is gate-clean (biome 0, tsc 0) and the whole lane is green (52 / 1608). The kill is
dropped, because `Q-WSC` alone reds.

**Why it is not FAIL.** No criterion covers it. The ticket prescribes two separate statement literals, which the
Engineer delivered exactly. It is the composer tripwire's twin of `QE-136-a` (`XSPLICE`). `ADR-0011` P6 accepts that
spelling under "a weakening that keeps the pinned text … just has to show in the diff".

**Why it is still a gap.**
- **The trigger does not reach this guard.** `QE-136-a`'s trigger names the licence guard's lines only: "an
  executable line between the guard's importer statement and its `toEqual` line". Nothing names `:613`.
- **The "over-pin" reason for no pin does not carry over.** `QE-136-a`'s "no pin now" rests on two reasons. The
  first is that it would leave same-class survivors open. That still holds here (`QE-140-b`). The second is that a
  contiguous pin "would also over-pin the comparator's comment block". That one does not hold: only a blank line
  separates these two statements. One contiguous literal (scan + `\n` + comparator) would close both spellings and
  pin no comment.

**Options (the Architect's).**
1. Extend `QE-136-a`'s trigger to the composer tripwire's `:610–617`.
2. Or rule that `R5d`'s two literals become one contiguous literal. Cost ≈ 0, with no new `biome-ignore`, because the
   merged literal keeps the one already there.

QE did not add the pin. The two-literal shape is the ticket's spec, and the class ruling is the Architect's.

## `QE-140-b` — INFO — `QE-136-c` class, recorded

`Q-LOCAL-SHADOW` declares a local `const productionModulesIn` inside the composer tripwire's `it`, above the scan.
The local version adds a filename filter. The pinned call text is unchanged, but the name now resolves to the
narrowed local. It is gate-clean and the whole lane stays green with `Q-WSC`. It is `XSHADOW-HELPER`'s twin, which
`QE-136-c` records as accepted. `QE-137-b`'s trigger names a module-scope `readdirSync`, not an `it`-scope helper
shadow, so this spelling has no trigger of its own. It reads as tampering, not tidying: a second definition of
clause 1's helper. No action.

## `QE-140-c` — INFO — docblock wording against `ADR-0029` decision 2

The docblock's new text says:
- the tripwire "is what makes that one root fail closed (`ADR-0029` decision 2)";
- "Three instruments … derive their scanned set from this function".

Checked against the file and the ADR:
- **Fail closed.** The sentence matches decision 2's own line ("`R1`'s fail-open becomes fail-closed with one
  tripwire"). Decision 2's 2026-10-10 pointer bounds it. A re-export hop, a dynamic `import("./frame.ts")` and four
  static spellings fail OPEN (`AR-053-COMPOSER`). The tripwire's own comment (`:589–600`) carries that bound, so the
  site is not misleading. Only the docblock sentence is unqualified.
- **Scanned set.** The probe calls the helper only for "the declared composition root exists" (`:672`, `:680`). The
  probe's measured set is the root's load closure. This imprecision predates the ticket: the old "Both guards"
  sentence included the probe as well. `A4` required naming all three.

Neither is wrong enough to red a criterion. Fold-in: the next hop that edits this docblock adds "for the spellings
the tripwire reads". No ticket.

## Fenced out, recorded only
`Q-PREDICATE` narrows `bindsAssembleFrame` and stays green. That is out of scope by the ticket and `ADR-0011` P7: the
predicate's reach is `AR-053-COMPOSER`, and pinning it would freeze option 1.
