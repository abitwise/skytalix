---
id: 20260812T131800Z-architect-design-decision-the-ruling-containment-and-ratification-d5e60b34
kind: decision
by: architect-design
at: 2026-08-12T13:18:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-026
  - ADR-0002
  - ADR-0004
  - ADR-0008
  - ADR-0009
  - ADR-0010
  - ADR-0011
  - NFR-002
  - NFR-008
  - EPIC-006
  - src/history-pane.nfr.test.ts
supersedes:
---

# The ruling: the count is corrected, the containment is ADOPTED and routes to the Engineer, clause 1 is deferred with a trigger, and NO human ratification is owed

> **Hand-authored**; `scripts/context-io.ts` does not exist here. `kind: decision` needs no stamp; the
> measurements it rests on are in the three sibling `observation` notes and **none is recorded as a
> `finding`** — no §14 gate ran at this hop and `human_admission` is **`off`**.

## 1. The count — CORRECTED in `ADR-0011`, which stays `accepted`

**`ADR-0011` said *"LOST — exactly one"*. The true count is TWELVE**, across three modules
(`gameend.ts`, `perft.ts`, `zobrist.ts`) and four forms (bare import, re-export, dynamic, query).

**What the old sentence counted: the fifteen builds in its own kill-ledger table — the builds that hop
had run.** Of those fifteen, exactly one moves delivered-RED → ruled-green. True of the table, false
of the ruling's reach, and the section presented it as the second.

**The cause was one word, and it was mine: *"non-static"*.** Two of the four lost forms — the bare
import and the re-export — are **static ESM syntax**. *"Non-static"* reads as *"dynamic only"*, which
is one form. **The word described the class the delivered regex happened to match, not the class it
named**, and that circularity is how twelve was recorded as one. Written into the ADR, because the
way the count went wrong is more useful than the number.

**The ruling itself is unchanged and is not reopened.** All twelve are off the frame path; clause 2's
narrowing is forced by measurement (`closure(frame.ts) = 1` — a frame is composed by injection);
restoring the delivered root set re-reds `ABC-019`. **The arithmetic was wrong; the structure was
not.**

## 2. The containment — **ADOPTED**, and it is a code change

**Ruled: widen the regex to the two textual forms it misses.** Re-measured independently at this hop
(28 instrument runs on two trees + a full-suite run), not accepted on the pricing:

- **BASE green/green on BOTH trees, 8/8** — no false positive; **full suite 750/750 on 26 files**,
  unchanged count, duration inside noise.
- **Recovers 6 of 12, including `WLAUNDER`** — regex **RED** on both trees.
- **Every criterion verdict preserved**: `A5.1`/`A5.2` green, `A5.3` (`WSTALELICENCE`) RED, `A5.4`
  (`WPERFT-STATIC`, `WOFFFRAME-STAT`) RED, `A5.5` untouched, and **`A3`'s required-green `WPERFT-DYN`
  stays green on both trees**.
- **Type-blind on BOTH keywords** — `export type { … } from` stays green. A naive widening drops that
  guard and reds a correct build.

**The `ADR-0011` principle does not answer this, and here is why they are different questions.**
*"No exclusions, no filenames, one expression"* is a rule about **which files are SCANNED** — clause
1's set. The widening changes **which import FORMS count as a runtime importer** inside each scanned
file, which is `D27`'s definition. The widened form adds no filename, removes no file, and stays one
expression; it moves the regex from **1 of `D27`'s 5 forms to 3 of 5**, strictly closer to what clause
3 already asserts in words. **Using clause 1's principle to refuse it would be answering a question
nobody asked.**

**It stops at three forms, and that is a ruling: `A3` forbids the fourth.** A pattern reaching the
dynamic literal `import("./history.ts")` turns **`WPERFT-DYN` RED**, and `A3` requires it to pass.
**6 of 12 is the maximum a textual guard may recover without breaking an accepted criterion** — not a
compromise. *(The record's reason — *"unreachable by any pattern"* — is corrected: a pattern reaches
the literal spelling; what it cannot reach is a computed specifier, so such a rule buys false
confidence.)*

**ROUTES BACK TO THE ENGINEER.** `src/history-pane.nfr.test.ts`, **two sites, one file, zero
production lines**: the executable expression, and the probe's docblock, which lists the misses as a
completed set and never mentions re-export — **that silence is what made `WLAUNDER` invisible.**

## 3. Clause 3's bound, as I now state it

> **The licence declaration is unverifiable in the OVER-LISTING direction for any entry whose file
> does not exist, and the number of such entries is UNBOUNDED and SILENT — while over-listing an entry
> whose file DOES exist is caught immediately.**

Six entries with five fictional are green on both trees; `["turn-loop.ts", "zobrist.ts"]` is **RED**.
So the guard is tight exactly where it can be — **a licence cannot be quietly widened to admit an
existing module** — and blind only to names that name nothing. That is a better-shaped bound than
*"a deleted licence is vacuous"*, which is a special case of it.

**And the half no note had stated: clause 3 asserted MORE THAN ITS INSTRUMENT DETECTS.** *"Runtime
importer"* is `D27`'s five-form phrase; the expression implemented one. Harmless while the probe
covered five forms over 14 modules; **load-bearing the moment clause 2 made the regex the sole holder
over three of them.** **That is the real defect, and the twelve is its measurement rather than its
cause.**

**Owner: Architect/Design. Trigger: the first licence entry added after `turn-loop.ts`. `EPIC-006` is
the WRONG expiry** — clause 2's declaration dies there, the licence does not.

## 4. Clause 1 — the clause is right, the instrument is wrong, the fix is DEFERRED with a trigger

**The wording does not move to match the code.** *"Under `src/`"* is what `ADR-0002` clause 4's
whole-tree invariant needs; narrowing it to *"directly in"* would write the hole into the ADR.

**The gap has two independent causes, not the one the record names** — a non-recursive enumeration
**and** a depth-fixed specifier (`"../history.ts"` matches neither expression). Measured: `WSUBDIR` is
green under **recursive + widened** too, so recursion alone fixes nothing. **The fix is two changes,
not one flag.**

**Deferred**: latent, pre-existing, `src/` flat for `.ts`, probe backstops it on the frame path, and
there is no file for the fix to catch without adding a production module no ticket asked for.
**Owner: Architect/Design. Trigger: the first `.ts` under a subdirectory of `src/` — checked AT
`EPIC-006`, not deferred to it.**

## 5. RATIFICATION — **not owed, and none manufactured**

**Re-asked at this hop rather than inherited from `ADR-0011`'s Status, because the obvious challenge
is that accepting a residual is a level.** It is not, and the reason is countable:

- **No target, bar, level or `UNKNOWN - verify` marker moves.** `NFR-002`'s bars, `ADR-0008`'s ratified
  clauses and `NFR-008`'s lane budget are untouched; `plans/nfr-catalog.md` was **not opened**.
- **Every claim is gate-adjudicable and was run** — 28 instrument runs on two trees plus a full-suite
  run, each either failing on a named constructed build or not.
- **The residual left (the two dynamic forms) was ALREADY ruled** in `ADR-0011`'s own `A3`
  (`WPERFT-DYN` not a breach) and scored through `ABC-029`'s DoR. **No new risk is accepted.** The one
  genuinely new risk — `WLAUNDER` — is **closed** by this amendment, not accepted.
- **Every correction moves the record toward a stricter guard and a LARGER admitted loss.** A
  correction that increases an admitted loss and increases a guard's reach asks a human to value
  nothing.

**So this sits on the `ADR-0009`/`ADR-0010` line, exactly where `ADR-0011` put itself.** `ADR-0008`
needed **Olger Oeselg** because it fixed a budget *level*; **`ADR-0004`'s by-delegation ratification is
NOT relied on and NOT extended.** **The thing that WOULD need an owner — moving a bar, setting a
level, or relaxing `NFR-002` — is not in this ruling, and I would have stopped rather than take it.**

## 6. What this leaves the other roles

- **Engineer** — the containment. Two sites, one file, zero production lines. Build red-first against
  `WLAUNDER` on both trees.
- **BA/PM** — **three criterion rows are now owed and NONE is written here.** (i) the regex is RED on a
  bare import and on a re-export by an unlicensed module (`WLAUNDER` is the named build); (ii) it stays
  green on `export type { … } from` and on `WPERFT-DYN`, so the widening cannot creep into the dynamic
  forms `A3` protects; (iii) QE's drafted **`A5.6`** — the equal-cardinality/different-members row that
  a one-token `toEqual` → `toHaveLength` survives. **Naming and wording are BA/PM's**; I did not write
  `A5.6` and did not touch `ABC-029`'s ticket page.
- **Security/NFR** — `NFR-002`'s `MET`/`MISS` is still theirs; `ABC-026` still owns the lane total. **I
  claim no `N8-LANE` verdict.**
- **Orchestrator** — the board move in the `artifact-ref` note, and one record disagreement flagged
  there.
