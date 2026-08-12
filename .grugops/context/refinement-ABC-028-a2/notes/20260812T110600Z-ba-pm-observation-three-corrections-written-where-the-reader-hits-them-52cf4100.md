---
id: 20260812T110600Z-ba-pm-observation-three-corrections-written-where-the-reader-hits-them-52cf4100
kind: observation
by: ba-pm
at: 2026-08-12T11:06:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A4
  - RISK-ABC017-01
  - RISK-ABC028-01
  - ABC-017-A11
  - ABC-017-A14
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# The three corrections, written where the next reader hits them — NOT re-measured, and that is deliberate

> **Hand-authored, no stamp** — see the sibling `decision` note. Nothing here is a `finding`.
>
> **I did NOT re-measure any of these.** They were measured at `ticket-to-pr-ABC-028-dev` by a hop
> whose boundaries the Orchestrator verified, and re-deriving them would be a second hop spent
> reproducing a settled number. **My job here was placement and wording.** Where I state a figure
> below it is quoted from that hop, not from a run of mine.

## 1. `WCACHE-LEN` does NOT survive 744/744 — and the CALL COUNT is the valuable part

**Written to TWO sites**, because the header table is what a reader hits first and `A1` is where
they land when they want the mechanism:

- **the header risk table's `RISK-ABC017-01` row** — the first prose on the page;
- **`A1`'s own block**, as a full blockquote rather than a footnote.

**The false sentence was *"survives 744/744"*.** It fails **2 of 744**, both in
`src/history-pane.nfr.test.ts` `A11`: *"calls `toSan` exactly once per RENDERED ply"* (`toSan at 40:
expected 16 times, got 0 times`) and *"hands `toSan` no legal move list"*.

**The other half — *"its only catcher is the incidental fixture sharing"* — is TRUE**, and is now
proved **by construction**: rebuild those fixtures per test with `A1` absent and the build goes from
`2 failed` to `744 passed`.

**THE MECHANISM IS A `toSan` CALL COUNT, NOT A ROW COMPARISON.** `A11`'s tests re-render the
module-scope `AT_*` singletons, so by its fourth `it` the fixture `AT_40` has already been rendered
by three earlier tests in the same file. **A cache HIT calls `toSan` ZERO times**, and the count
assertion reads `0` where it expects `16`.

**THAT IS WHY `A14` NEVER CAUGHT THIS BUILD**, and it is the sharpest thing the build hop found.
`A14` compares **ROWS across an APPEND** — a length-keyed cache invalidates exactly on cue there, so
`A14` is **structurally incapable** of failing on it. The build was caught **in a different file, by
a different instrument, of a different kind, by accident.**

**Why this matters beyond this ticket, and why I gave it a paragraph rather than a clause:** a
reader auditing *"is the freshness guard safe if I rebuild these fixtures?"* naturally looks at the
freshness tests. **The guard was never a freshness test.** That is why six roles read the trap and
none of them could see what it was protecting. `A1` is the first freshness guard that actually
catches it, and it catches it by the honest instrument — a row comparison, in the file that owns the
property.

**The `FLAGGED, NOT EDITED` blockquote in `## Acceptance` is marked RESOLVED and kept verbatim**, so
the correction can be audited against what was predicted. The flag was right that both sentences
could not hold; **it was right about which way round only after somebody ran it** — which is
`## Test notes` 4 working as intended, not failing.

## 2. `RISK-ABC028-01` is too NARROW as worded — and the widening came from its own standing obligation

Written into the `### RISK-ABC028-01` subsection inside `A4`.

**The standing re-run obligation FIRED AND RAN.** The build hop changed the instrument (it samples on
**write** traps as well as reads and adds a `getOwnPropertyDescriptor` trap), so the obligation
applied. **Verdict re-measured and unchanged: `WBOARDBLIND` still survives — `clean` at all ten
lengths, `750 passed (750)`.** **This is the first time that obligation has been exercised**, and an
obligation that fires, runs and reports is worth more than one merely written down.

**The hole is broader than the wording named.** Stressing the instrument beyond the ticket's eight
arming slots reproduced the same silence with a **`DataView` over `board.buffer`**, mutated and
restored with no intervening graph access. Same class, different mechanism.

**The honest statement is *any buffer-level write reverted before the next sampling point*** — not
*"an `ArrayBuffer` alias"*. **The old wording named ONE WITNESS and read as if it named the CLASS.**

**This is the same defect shape `## Test notes` 1 names for `A9`**: a hole described per node instead
of over the class is a hole that gets re-found once per mechanism. Naming the class is what stops
`RISK-ABC028-03` from being a `DataView` ticket.

**What does NOT move:** still accepted, still not closable by a better proxy, the three rejected
closures stand (including the one that would have reported GREEN on a wrong build), and `A4`'s four
clauses, eight arming slots and positive control are unchanged. **This widens the description of a
known hole; it does not admit a new one.** The standing obligation is **extended** to re-run the
`DataView` witness too, because one witness of a class does not test the class.

## 3. The lane figures are stale — `748` / `1 failed, 747` → `750` / `1 failed, 749`

Corrected at **three sites**: `A4`'s *"Lane, and what RED means concretely"* paragraph,
`RISK-ABC028-01`'s own lane figure, and the DoR re-score table's item 4.

**Neither number was ever wrong for what it measured.** `748` was QE's **`A4`-ONLY** figure — `A4`
is four `it`s, so `744 + 4 = 748`. **This ticket lands `A1` and `A3` too — SIX `it`s — so
`744 + 6 = 750`.** The ticket carried the narrower figure after its own scope had grown, **which is
how a stale number goes false without anybody writing anything untrue.**

**The SHAPE the criterion asserts is unchanged and was re-run**: exactly one failure, it is this
criterion, zero pre-existing tests break — verified on all six `A4` builds.

**Recorded alongside it, because it would otherwise look like a violation of that shape:** two
builds do **not** produce exactly one failure — `WCACHE-LEN` reports `3 failed / 747` and naive
`WCACHE` `4 failed / 746`, because each also trips the two pre-existing `A11` count assertions.
**Neither is an `A4` build**; both are `A1`'s, and that is a property of the delivered tree rather
than of this criterion.

## What I did NOT touch, because it is not mine

**`N8-LANE`'s TOTAL.** The build hop measured ~850 ms net now and ~758 ms net **before** this
ticket, against the ~650 ms recorded, and published three readings without picking one — correctly.
**The Orchestrator routed that to `ABC-026`, which exists for exactly it.** I did not re-derive it,
moved no bar, and did not open `plans/nfr-catalog.md` or any ADR. `ADR-0008`'s ratified clauses
hold, so nothing binding is breached.
