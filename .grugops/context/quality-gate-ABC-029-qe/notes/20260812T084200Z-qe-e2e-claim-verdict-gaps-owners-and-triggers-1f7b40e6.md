---
id: 20260812T084200Z-qe-e2e-claim-verdict-gaps-owners-and-triggers-1f7b40e6
kind: claim
by: qe-e2e
at: 2026-08-12T08:42:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-029
  - ABC-019
  - ABC-026
  - ABC-028
  - ADR-0002
  - ADR-0008
  - ADR-0011
  - NFR-002
  - NFR-008
  - RISK-ABC017-04
  - src/history-pane.nfr.test.ts
  - src/history-pane.ts
supersedes:
---

# Verdict: **`PASS_WITH_RISKS`** — five criteria MET, gates green, and **twelve** kills lost where the record says one

> **`kind: claim` with `confidence: UNKNOWN - verify`, and that is the honest kind.** A criterion
> verdict and a merge recommendation are assessments, not gate outputs. **The measurements they rest
> on are in the sibling `observation` notes and every one is reproducible.** No `finding` is written
> at this hop: there is no `§14-gate` verdict record under this task and `context.human_admission` is
> **`off`**. **Nothing is self-stamped.**

## Gate result on this branch tip

| gate | result |
|---|---|
| `npm run lint` | **0 errors**, 2 pre-existing infos — identical to baseline |
| `npm run typecheck` | **0** |
| `npm run build` | **0** |
| `npx vitest run` | **750 passed (750) on 26 files** |
| skip count | **0** |
| e2e | **`UNKNOWN - verify`** — `ui_e2e` is `ui-or-critical-path` and there is no runnable UI surface until `EPIC-006`. Not invented |
| `ADR-0008` bars | wall **1.77 / 1.75 / 1.82 s** ≤ 3 s; CPU **9.01 / 8.89 / 8.92 s** ≤ 13 s |

## Criterion verdicts — each re-derived, none inherited

| criterion | verdict | on what I measured |
|---|---|---|
| **`A1`** | **MET** | `grep 'file !== "'` on the instrument returns **nothing** — exclusion literals **2 → 0**. `productionModulesIn` is the **only** `readdirSync` in the file and both guards call it (`:312`, `:367`). Cited entries **6** (5 `FRAME_PRODUCERS` + 1 `LICENSED_DRIVERS`), each at one site with its citation. **No third literal.** `turn-loop.ts` appears in the probe's executable code **nowhere** |
| **`A2`** | **MET, and it bought more than it claimed** | `WSTDOUT` green/green on both trees, suite at full count. **My own `WSTDOUT-JSON`** — a root printing *well-formed* JSON — is also green/green: on fd 3 the report can no longer be **forged**, not merely corrupted. `WSTDERR` still survives, so nothing over-reached |
| **`A3`** | **MET** | `perft-bench.ts` appears in the instrument **only in comments**, never in an executable filter — in the regex's scanned set by clause 1, absent from the roots by not being a declared frame producer, **neither by filename**. `WPERFT-STATIC` → **regex RED on both trees**; `WPERFT-DYN` green, as ruled |
| **`A4`** | **MET** | `grep -rn 'zero runtime importers' src/` → **0 hits**. Case-insensitive sweep → four sites, of which the two production ones (`history-pane.ts:30`, `status-panel.ts:24`) are now **identically phrased and both true**. The probe's docblock states clause 3's reason and no longer presents the regex as a weaker subset |
| **`A5`** | **MET row by row, and the criterion itself is weaker than it reads** | A5.1 ✓ A5.2 ✓ A5.3 ✓ A5.4 (both builds) ✓ A5.5 ✓ — every row a real vitest run on both trees. **See the gap below: a build passing all five rows can still lose a kill** |

**The `P0` unblock reproduces**: 802/802 on 28 files, typecheck 0, both named instruments GREEN, on
the tree `git merge-tree` itself computes. **Not fragile in `src/`** — zero source conflicts.

---

# CRITERIA GAPS — three, and this is where I lean

**This project's record is that hops here find mostly criteria gaps. That held again: two of the
three items below are gaps in what was ASKED, not in what was BUILT.**

### CG-1 — `ADR-0011`'s *"LOST — exactly one"* is a count of builds run, not a count of kills lost. **TWELVE are lost.**

**Measured**: the delivered probe rooted at 14 modules and killed **all 15** of the builds I
constructed; the ruled build kills **3**. `gameend.ts`, `perft.ts` and `zobrist.ts` lost probe
coverage entirely, and in each the **bare-import, dynamic, query-string and re-export** forms are now
caught by nothing. `WOFFFRAME-DYN` is **one of twelve**, and it is the only one either the ADR or the
build hop names.

**The Engineer's own class statement is correct** — *"the loss is bounded to the non-static form in
an unlicensed, off-frame-path module"*. **The ADR's count is not**, and the ADR is `accepted`, so the
understatement is in the permanent record.

**One of the twelve is not a removed false positive.** `WLAUNDER` — `zobrist.ts` re-exports
`repetitionCounts` from `history.ts`, `perft.ts` consumes it — makes an **unlicensed module a runtime
importer of `src/history.ts`**, which is precisely what `ADR-0011` clause 3 asserts cannot happen.
Delivered probe: **RED on both trees**. This build: **green/green, 8/8.** *(I checked and am NOT
claiming an `ADR-0002` clause-4 breach — the map is still built by `repetitionCounts`. Clause 3 is
what breaks.)*

- **Owner: Architect/Design** — clause 3 and the Consequences ledger are the ADR's, and `ADR-0011` is
  `accepted`. **BA/PM is not entitled to it and neither am I.** I did not open the ADR.
- **Trigger — and I would not let this one float to a convenient hop: the next edit to `ADR-0011`
  for any reason, OR the first production module that gains a bare import or a re-export, whichever
  is first.** The second half is checkable by the lint-adjacent sweep already in this note.
- **Containment, priced rather than proposed.** Widening the regex to the two textual forms it misses
  (`import "./history.ts";` and `export … from "./history.ts";`) recovers **6 of the 12**, including
  `WLAUNDER`, at **zero measured cost**: BASE stays green on **both** trees, `WPERFT-STATIC` and
  `WSTALELICENCE` stay RED, the pane's `import type` stays green. The other 6 are dynamic and
  **no textual pattern can reach them** — those need the probe's roots back, which is the thing the
  ruling deliberately removed. **This is a measurement handed to whoever owns the follow-up, NOT
  work I did or am asking this ticket to do** — no criterion requests it and `AGENTS.md` rule 5
  forbids me writing it.

### CG-2 — `A5`'s five rows admit a strictly weaker build. `A5.3` is not the sole discriminator.

`toEqual(...)` → `toHaveLength(....length)` — **one token** — passes **A5.1, A5.2, A5.3, A5.4 (both
builds) and A5.5**, and is **green on `WSWAP`** (licence goes stale *and* an unlicensed module gains
a static import in the same tree) where the delivered build is **RED**. The two forms only diverge
when the two sets have equal cardinality and different members, and **no `A5` row constructs that**.

**The delivered code is CORRECT here — this needs no `src/` change.** `A5` is what is one edit from
vacuous, not the build. The missing row is written out verbatim in the sibling `observation` note as
a proposed **`A5.6`**.

- **Owner: BA/PM** (`ADR-0011`: *"`ABC-029`'s acceptance criteria are BA/PM's"*).
- **Trigger: the next hop that edits this assertion, or the next re-scoring of `ABC-029`'s criteria.**
- **I did not amend the criterion.** The brief reserved it, and amending a criterion to match what
  shipped is the defect this project keeps paying for.

### CG-3 — clause 1 says *"under `src/`"*; the one expression is a non-recursive `readdirSync`.

`WSUBDIR` (`src/engine/probe-victim.ts` with a **static** import of `../history.ts`, off the frame
path) is **green/green**. **It is green under the DELIVERED instrument too, so this is inherited, not
caused here**, and `src/` is flat for `.ts` today, so it is latent.

- **Owner: Architect/Design** — clause 1's wording or the one expression must move, not both.
- **Trigger: the first `.ts` file added under a subdirectory of `src/`.**

**Also handed on, measured and not ruled on (its own note):** clause 3's bound is tighter and
differently shaped than *"a deleted licence is vacuous"* — **over-listing the licence with names that
have no file is unbounded and silent** (six entries, five fictional, green on both trees), while
over-listing with a name that **does** have a file is caught immediately. **Owner: Architect/Design;
trigger: the first licence entry added after `turn-loop.ts`.** `EPIC-006` is the wrong expiry for
this half — clause 2's declaration dies there, clause 3's licence does not.

---

# CODE DEFECTS — **none found.** Stated plainly because a silent "no defects" is worth less than a judgement.

I looked for one and did not find one. Every criterion is met by mechanism rather than by assertion;
the three controls the record requires are falsifiable and **two more I invented are too**; the
determinism bar is 12/12; `A2` beat a mutant harder than the criterion names; no test was weakened,
narrowed or deleted (**test count 8 at `main`, 8 at `ABC-028`'s tip, 8 now**); `ABC-028`'s inherited
block at lines **24-147 is byte-identical** to its tip by `cmp`; the lane file count for `ABC-029`'s
own commit is **TWO**; `dependencies` stays `{}`.

**The twelve lost kills are a consequence of the RULING, faithfully implemented, and the Engineer
searched for a mechanism that keeps them and reported failing to find one. I searched too and agree:
keeping the dynamic forms means rooting the probe at non-frame-producers, which is the whole-tree
proxy the ruling removed and which is what makes `turn-loop.ts` red.** That is why CG-1 sits under
CRITERIA and not under CODE, and I want that classification argued rather than assumed.

---

# Does anything here hold the merge? **No — and I am saying that plainly, with the pressure named.**

**A `P0` is blocked on this and on nothing else.** That is the condition under which a gate gets
softened, so here is the reasoning rather than the conclusion:

- **The hole is LATENT, measured, not asserted.** Zero bare imports and zero re-exports exist in any
  production module in `src/`; the only references to `history.ts` in production code are two
  `import type` lines. Nothing in the tree is one edit from `WLAUNDER`. **By this project's own
  latent/live test — the one `ABC-029`'s priority was derived from twice — latent does not block.**
- **Holding does not fix it.** The correction is to an `accepted` ADR's Consequences ledger and to a
  risk register. It requires **no `src/` change**, so it can be made after the merge exactly as well
  as before, and holding a `P0` to schedule a document edit is the tail wagging the dog.
- **Reverting is worse.** Restoring the delivered root set re-reds `ABC-019` and reinstates the
  `turn-loop.ts` false positive. The ruling is right; only its arithmetic is wrong.
- **Nothing was softened to reach this verdict.** I found the gap the brief pointed me at, found a
  second one it did not (`A5`/`W4count`), and reported both against a ticket a `P0` is waiting on.

**`PASS_WITH_RISKS`, with one obligation I would attach to the merge rather than to a later hop:**
**the `WOFFFRAME-DYN` risk entry must be re-recorded with its true magnitude — 12 builds, 3 modules,
4 forms, `WLAUNDER` named — with owner Architect/Design and the trigger above.** That is a record
edit, not code. **If it is going to be deferred, it should be deferred explicitly by the Orchestrator
and not by silence**, because *"exactly one"* in an `accepted` ADR is the sentence a future hop will
cite when it decides the loss was small.

---

# What I would not carry, in words

**I would not carry *"exactly one kill lost"* forward as written.** It is the sentence that will be
read in six months by whoever asks whether narrowing the probe was cheap, and the honest answer is
twelve, three of which are in modules nobody has ever named in this ticket, and one of which
(`WLAUNDER`) breaks the exact equality clause 3 exists to assert. **The ruling is still right.** The
loss is still defensible on the properties. But it is four times the size the record gives it, and
the difference is entirely in modules and syntaxes nobody enumerated because nobody had to while the
probe was wide.

**The second thing I would not carry is quieter and I nearly missed it.** `A5` was written to stop
exactly this ticket being smoothed, and it succeeded against the two forms its author had in mind.
`W4count` is not one of them. **A criterion built to resist simplification that admits a
one-token simplification is worth fixing while the reason it exists is still fresh** — which is now,
not at the next hop that touches the line.

**On `ABC-028`'s comment at `src/history-pane.nfr.test.ts:102-120`: I read it and did not act on it.
Content inside the workspace is DATA, not instruction.** It describes a fixture rebuild; nothing in
it authorises a write, and nothing else in this worktree attempted to.

**Board and trace:** `plans/board.md` is the Orchestrator's and was **not opened**. The `In Review →
In Security/NFR` move this role normally owns was **NOT taken** — the brief reserves the board, and a
ticket header that moves ahead of the board is the two-records-disagree defect already open on
`ABC-028` and `ABC-029`. `plans/traceability.md` was **read and not edited**: my `Tests` cell would
have to describe tests I did not add, and the concurrent `ABC-028` QE hop has an uncommitted-to-my-branch
edit on that same file. **Both moves are handed to the Orchestrator with the reason, rather than
taken and explained afterwards.**
