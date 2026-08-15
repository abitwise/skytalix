---
id: 20260816T001800Z-qe-e2e-observation-gaps-found-at-qe-for-abc066-d73cfa8f
kind: observation
by: qe-e2e
at: 2026-08-16T00:18:00Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - ABC-065
  - ABC-062
  - src/cli.test.ts
  - plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md
supersedes: 
---

# `ABC-066` — gaps found at QE, each with severity and owner

Numbered `Q1`–`Q6` to stay clear of the Orchestrator's `G1`–`G3` and the engineer's `G4`–`G7`, which
are referenced and not restated. **None blocks the gate; the gate is GREEN.** **None was repaired
here** — every one is either another role's pen or a new hop, and `## Hard limits` forbids fixing a
production defect in this hop.

**Count for the `Ready for Dev` exit control (`AGENTS.md` § Process rules 1): 6 gaps at QE, of which
0 are `HIGH`, 2 `MEDIUM`, 4 `LOW`. None is an acceptance-criterion failure — all six criteria are
`MET`.**

---

## `Q1` — `usageLineOf` is POSITIONAL, so any future line appended to a refusal FALSE-REDS this guard. **MEDIUM.** Owner: **Orchestrator** (schedule a hop) / whoever next edits the refusal write site

**Proven, mutant M12:** appending one hint line after `USAGE` in `src/cli.ts` reds `A1` with
`expected 'see the README for more.' to contain 'npm run chess -- '`, although the usage line was
still correct and still carried the separator. `usageLineOf` returns the **last non-empty stderr
line** and never checks that the line is a usage line.

**It fails in the SAFE direction** — a wrong line will not contain the separator, so it cannot go
green by mistake — and it names the line it read, so the diagnosis is immediate. **That is why this
is `MEDIUM` and not `HIGH`, and why I am NOT recommending a fix now:** hardening it to *"the last
line containing the separator"* would make the helper unable to detect a **missing** usage line,
which is the failure `A1` exists to catch. The positional rule is a defensible choice; **it is the
undocumented coupling that is the gap.** The helper's own doc comment says "the LAST non-empty
line" but nothing at the `src/cli.ts` write site says a line may not be appended after `USAGE`.
**Recommendation: a comment at the write site, in a later hop. Not a production change now.**

## `Q2` — `advertisedTextOf` returns a SILENTLY WRONG substring when the separator is absent. **MEDIUM.** Owner: **`ABC-065`'s guard hop**, then **BA/PM** for the page

`advertisedTextOf` computes `usageLine.slice(usageLine.indexOf(SEPARATOR_FORM) + 17)`. When the
separator is **absent**, `indexOf` returns **`-1`**, so the expression becomes **`slice(16)`** — a
silent slice from a meaningless offset instead of a throw. Measured on the exact strings `ABC-065`
will hand it:

| input | returns |
|---|---|
| `- Dev / run: \`npm run chess\` <!-- ... -->` — **`AGENTS.md` TODAY** | **`"m run chess\` <!-- ... -->"`** |
| `- Dev / run: \`npm run chess --colour white\`` | **`"m run chess --colour white\`"`** |
| `npm run chess` | `""` |
| `- Dev / run: \`npm run chess -- [--colour white\|black\|random] [--ascii \| --unicode]\`` — **repaired** | ``"[--colour white|black|random] [--ascii | --unicode]`"`` — **note the TRAILING BACKTICK** |

**This is the sibling asymmetry worth naming: `usageLineOf` THROWS on bad input; `advertisedTextOf`
returns garbage quietly.** Two of the four shared helpers have opposite contracts and neither says
so. On their first day as shared infrastructure that is exactly the kind of thing that bites the
second caller.

**Two concrete consequences for `ABC-065`, both actionable:**

1. **It must assert `line.includes(SEPARATOR_FORM)` BEFORE calling `advertisedTextOf`** — which is
   what `ABC-066`'s block does, and the only reason `ABC-066` is safe. Without that assertion, the
   un-separated `AGENTS.md` line yields `[[]]` from the expander, and `resolveOptions([])` is
   **`ok: true`** — so a guard asserting only *"everything advertised resolves"* is **VACUOUSLY
   GREEN on today's broken `AGENTS.md`**. This is the vacuity trap, in its real shape, aimed at the
   real next hop.
2. **It must strip the markdown code fence before the outside-group assertion.** The repaired
   `AGENTS.md` line ends in a backtick, which is text outside every bracketed group, so copying
   `ABC-066`'s `expect(advertised.replace(/\[[^\]]*\]/g, "").trim()).toBe("")` row verbatim gives a
   **false RED** on a correct line. `ABC-066`'s stderr line has no fence; `ABC-065`'s will.

**Not fixed here:** `src/cli.test.ts` is `ABC-065`'s next, and hardening a helper under it while it
is unmerged is the `G4`-class hazard this session already paid for twice.

## `Q3` — the guard cannot detect an option advertised TWICE. **LOW.** Owner: **BA/PM** (accept or re-word `A2`)

**Mutant M7 GREEN:** `usage: npm run chess -- [--colour …] [--ascii | --unicode] [--ascii]` passes
30/30. The vocabulary row uses `new Set(...)`, which dedupes, and the count floor is `>= 6`, which a
duplicate satisfies. So a usage line that redundantly advertises an option ships green.

**Low, and arguably not a defect at all:** every invocation such a line advertises **does** resolve,
so `A2` is satisfied *as written*. The line would be ugly, not wrong. **Recorded so the limit is on
the record rather than discovered later.** Tightening it would need `A2` re-worded, which is BA/PM's
pen and not mine — **stop condition respected, not re-worded here.**

## `Q4` — cosmetic malformations of the usage line pass. **LOW.** Owner: **BA/PM** (accept)

**Mutant M10 GREEN:** a **double space** after the separator (`npm run chess --  [--colour …]`)
passes 30/30 — `toContain` is satisfied and the extra space vanishes into `split(/\s+/)`. The
printed line would be slightly malformed but every form it advertises still runs. **Accepting this
is the right call**; pinning whitespace is `ABC-059`'s spelling-pinned-guard defect. Recorded, not
raised.

## `Q5` — Workflow 05's green-verdict emission is UNPERFORMABLE on this install, and the gate result is therefore unstamped. **LOW** (pre-existing, install-level). Owner: **the project owner**, already escalated

Workflow 05 step 5 requires that a `READY_FOR_HUMAN_REVIEW` result call `emitVerdict` in
`scripts/context-io.ts` to mint a `§14-gate#<id>`. **That file does not exist in this repository or
in the kit, and `context.human_admission` is `off`.** My green result is therefore recorded as an
`observation` with no stamp, exactly as `AGENTS.md` § Role / workflow files instructs. **Not
re-derived and not ticketed** — `AGENTS.md` already records that restoring the sanctioned writer is
an install-level fix (`node install/install.js --check`) escalated to the owner. **Noted only
because a gate that cannot stamp its own green is a fact a later reader of this trace needs.**

Same class, smaller: **`scripts/check-uat-oracles.js` is absent**, so Workflow 05's Tier-1 oracle
step recorded `UNKNOWN - verify` and was treated as non-blocking, which is what that step's own
words prescribe for a host that does not ship it.

## `Q6` — a stale comment: the block says "THESE TWO HELPERS" and there are FOUR. **LOW.** Owner: **`ABC-065`'s guard hop** (fix in passing)

`src/cli.test.ts:163` reads *"THESE TWO HELPERS ARE THE SHARED ONES"* immediately above
`SEPARATOR_FORM`, `usageLineOf`, `advertisedTextOf` and `invocationsAdvertisedBy` — **four names**,
and the artifact-ref note correctly lists four. A comment that miscounts the shared surface on the
day it becomes shared will mislead the very hop it was written for. **Trivial, and deliberately not
fixed here:** `## Hard limits` and the `G4` lesson both say do not edit a file another hop is about
to write. **The next hop in that file should correct it while it is there.**

---

## Not gaps — checked and closed so nobody re-opens them

- **`A2` is not vacuously true.** The expander can never return zero invocations (it seeds `[[]]`),
  and the degenerate `[[]]` is caught by **three** independent rows. Checked by name, as instructed.
- **`A5`'s two accepted-argument mentions are in doc comments**, participate in no assertion, and
  are cleared by mutant M11 staying green on a fully rewritten sentence. Ruled `MET`.
- **`A6`'s "2 paths" against a 7-path branch diff** — `ABC-060`'s ruling, already settled by the
  engineer. I re-ran the delivered-commit diff and it reads 2. Working as designed.
- **The guard proves what the line advertises RESOLVES, not that `npm` forwards it.** The ticket's
  own stated limit. I re-ran all six forms through `npm` end to end as evidence (6/6 exit `0`), and
  that is evidence, not a guard — same reading the engineer recorded.
- **`spawned` is 10 and this hop added no child.** 10 → 10.
- **`G5` did not recur.** This subtask's `base:` (`grugops/ticket-to-pr-ABC-066 @ 8fb6ff1`) was
  accurate on arrival — the third writing of the field is correct.
