---
id: 20260812T231400Z-security-nfr-claim-verdict-pass-with-risks-owners-triggers-and-what-i-would-not-carry-8c5e4d0b
kind: claim
by: security-nfr
at: 2026-08-12T23:14:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-029
  - ABC-019
  - ABC-026
  - ADR-0002
  - ADR-0008
  - ADR-0011
  - NFR-002
  - NFR-008
  - A2
  - A4
  - R1
  - R4
  - L2
  - src/history-pane.ts
  - src/history-pane.nfr.test.ts
supersedes:
---

# VERDICT: **`PASS_WITH_RISKS`** — no required fix, `NFR-002` **MET**, `NFR-008`'s ratified clauses **MET**, `N8-LANE` **`UNKNOWN - verify`** with a floor. One new measured hole, four accepted risks, each with a named owner and a dated trigger

> **`kind: claim` with `confidence: UNKNOWN - verify`, and that is the honest kind.** A verdict and a
> merge recommendation are **assessments**, not gate outputs. **The measurements they rest on are in
> the three sibling `observation` notes and every one is a run at this hop.** No `finding` is written:
> there is no `§14-gate` verdict record under this task and `context.human_admission` is **`off`**.
> **Nothing is self-stamped, and no claim here may satisfy a finding's admission.**

## Both halves were run, and neither was untriggered

The brief asked me to say so if one half was untriggered. **Neither was.**

- **The security half FIRES** — the ticket wrote a production line, and the change owns a
  **child-process spawn** and a **private report channel**. I did not merely check the ticket's
  firing threshold; **I attacked the channel four ways** (sibling note).
- **The NFR half FIRES** — `NFR-002`'s structural premise and `NFR-008`'s lane are both named in the
  ticket's own `## Security / NFR triggers`.

## Result

| item | verdict | on what I measured |
|---|---|---|
| `mandatory_gates` (lint / typecheck / unit / build) | **ALL PASS** | 0 errors + 2 pre-existing infos; 0; **755/755 on 26 files**; 0 |
| **`NFR-002`** | **MET** | Production runtime importers of `src/history.ts` = **ZERO**, re-derived by **evaluation** over all 16 production modules on an instrument I wrote. Frame closure **11**, `history.ts` absent. Pane closure **exactly 7**. No bar, target or level moved |
| **`NFR-008` — `ADR-0008`'s two ratified clauses** | **MET** | wall **1.669 s** ≤ 3 s; CPU **8.866 s** ≤ 13 s, medians of 7 on the reference machine |
| **`NFR-008` — `N8-LANE` per-ticket delta** | **`UNKNOWN - verify`** | The protocol cannot resolve this change. **Floor ±390 ms CPU at n = 8, reported AS A FLOOR.** Zero files added under `src/`, so the floor account cannot have moved. **Lane TOTAL is `ABC-026`'s** |
| determinism | **MET** | **12 consecutive runs, 12 × 11/11, 0 flaky**; no duration compared to anything |
| the three probe controls | **ALL FALSIFIABLE** | re-proven by standalone re-execution: `FRAME_PRODUCERS = []` → `expected [] to include 'history-pane.ts'`; arming re-pointed at `san.ts?arming` → `expected [ 'san.ts' ] to include 'history.ts'` |
| `A2` — the channel | **MET, and it buys what it claims** | `WSTDOUT-JSON` **green 11/11** — a root printing well-formed JSON is inert. I reproduced the OLD channel's corruption on my own stdout instrument, independently |
| `A4` — the one production line | **MET** | The struck sentence was an unqualified whole-tree claim that goes false when `turn-loop.ts` lands; the replacement is pane-scoped and true on both trees. Both production comments identically phrased, both verified against the module graph |
| skip count | **0** | measured with the `AGENTS.md` slot command |
| dependencies / network / secrets | **NONE ADDED** | no `dependencies` key at all; `package.json` + `package-lock.json` diff vs `main` is **empty**; zero network calls anywhere in `src/`; zero secrets |
| ASVS **L1** (70 reqs) | **no failure** | 6 requirements genuinely touch this change's surfaces; all assessed in the sibling note. The other 64 have no surface on this project |

## REQUIRED FIXES BEFORE MERGE: **NONE. Stated plainly, with the pressure named.**

**A `P0` (`ABC-019`) is blocked on this ticket's merge and on nothing else.** That is the condition
under which a gate gets softened, so the reasoning is written out rather than the conclusion:

- **I found something the record does not contain** — `WFD3-EXIT`, a mutant that **forges the probe's
  report completely** (11/11 green, all four controls vacuous). I did not decline to look.
- **It is still not a required fix, for a reason that survives being argued with**: the attack needs
  an explicit `writeSync(3, …)` plus `process.exit(0)` committed into a production module the probe
  loads — **a position from which the guard can simply be deleted.** A control that only fails against
  an adversary who could remove the control buys nothing. **And no defence works**: the measured code
  runs with the measurer's authority, so a nonce, a checksum or a second channel are all readable and
  writable by the forger.
- **The accidental path — the one `A2` exists for — is fully closed and measured.**
- **Every risk below is LATENT on measurement, not on assertion**, and latency is this project's own
  merge test, applied twice already to `ABC-029`'s own priority.
- **Nothing was softened.** I re-derived the premise on instruments I wrote, ran the lane protocol on
  a rig I built, found one new hole, one record count that is off by one, and one misleading coverage
  headline — **against a ticket a `P0` is waiting on.**

**If any of that reasoning is wrong, the item to attack is the second bullet, and I would rather it
were attacked than accepted.**

## ACCEPTED RISKS — four, each with a NAMED OWNER and a DATED TRIGGER

| # | risk | severity | owner | trigger |
|---|---|---|---|---|
| **S-1** | **`WFD3-EXIT`** — a production module the probe loads can forge the fd-3 report by writing a well-formed payload and exiting `0`. Measured green 11/11 | **LOW**, by stated reason and not by default — see below | **Architect/Design** (the probe's design is `ADR-0011` clause 2's) | **`EPIC-006`**, when the CLI entry point becomes the first module that prints at import — the ADR's own dated revisit — **or** the first production module that gains an `fs` write or a `process.exit`. Both are at **zero** today, swept |
| **S-2** | **Test-integrity checker exits `2`** — `.grugops/test-skips.md` has **never existed on any branch**. Recorded as an error, never as a pass. **Pre-existing, repo-level, NOT `ABC-029`'s** | LOW (`quality.test_integrity` is `warn`; it is exit `2`, not exit `1`, so no human-only short-circuit fires) | **a human** — the registry is human-owned by Workflow 05 and an agent may not author it | **the first skipped test on this project**, at which moment the absent registry stops being harmless |
| **N-1** | **`N8-LANE` is unresolvable by `ADR-0008`'s protocol at n = 8**, and the floor is **session-dependent** — mine is ±390 ms against the record's ±130 ms on the same machine and method | MEDIUM as a **measurement-capability** risk; it is not a budget breach | **`ABC-026`** (owns the lane total and is the named escalation route) | **the fifth consecutive unresolvable hop is NOW** — or the first hop that needs a per-ticket lane number it cannot get |
| **N-2** | **`coverage_threshold` (`0.8`) reads 78.6% at the headline while `src/` is 100%**, because coverage has no `include`/`exclude` and the report scoops in `tools/grugops/*.js`. Pre-existing on `main` | LOW | **whoever next wires `coverage_threshold` into the gate** | **the first gate run that enforces it mechanically** — which would report a false coverage MISS |

**On S-1's severity, because the role's default would have been `high` and `block_on` is `high`.**
The failed requirement would be **V2.2.1** (L1) → default **high** → blocking. **I am not overriding a
default; I am recording that it is not a V2.2.1 failure**, because ASVS validates input crossing a
**trust boundary** and this payload originates inside the boundary this project declares — the
repository — which is the same boundary `ABC-029`'s own firing threshold names. **Both readings are
written out in the sibling note so the Orchestrator can overrule me on the reading rather than on the
verdict.** Owner and trigger stand either way.

**Inherited and NOT re-opened, because they already carry owners and triggers I have no reason to
move:** `R1` (clause 2 fails open — **checked, no live instance**: the five declared producers cover
`NFR-002`'s `Applies to` cell and none of the five modules outside the frame closure is a renderer),
`R2` (licence over-listing), `R3` (subdirectory depth), `R4` (the two dynamic forms — **verified
latent, and more broadly than the record claims: zero dynamic imports of ANY local module in
production**), and `L2`/`L3`/`L4` (**`L2` has no live instance** — the three `history.ts` comments are
all JSDoc ` * ` continuation lines the anchor fences).

## Board and trace — what I did NOT take

- **`plans/board.md` was NOT opened for edit.** The brief reserves it and it is the Orchestrator's.
  The `In Security/NFR → Ready for UAT` move this role normally owns is **handed over with the reason
  rather than taken**: the ticket front matter already reads `status: in-security-nfr` /
  `column: In Security/NFR`, the two agree, and I edited neither.
- **`plans/traceability.md` was NOT edited.** Its `ABC-029` row is **still malformed** — 11 content
  cells against 10 columns, missing its trailing pipe — exactly as the previous Engineer hop recorded
  and did not fix. **Appending a Security/NFR result to a row whose `Status` cell is already displaced
  into a column the header does not have would compound the defect, not record a verdict.** Handed to
  the Orchestrator or BA/PM with the reason. **Owner: BA/PM or the Orchestrator. Trigger: before the
  next append to that row.**
- **`plans/nfr-catalog.md` was NOT opened for edit.** The brief made it mine *only if a bar genuinely
  moves*. **No bar moves** — `NFR-002` is MET at its existing target and `NFR-008`'s ratified clauses
  are MET at theirs. **Nothing to write, so nothing was written.**
- **No ADR, no ticket criterion, no `ABC-028`, no `ABC-019`, no merged ticket touched.** The three
  record items I found are **flagged in notes, not patched into anyone else's text.**

## WHAT I WOULD NOT CARRY, in words

**1. I would not carry *"the fd-3 channel cannot be forged"* as an unqualified sentence.** It is the
shape this stack has been bitten by five times — *"non-static"*, *"the maximum"*, *"unreachable by any
pattern"*, *"exactly one"*, *"the trees differ by exactly one file"*. The true sentence is narrower
and it is worth the extra clause: **on fd 3 the report cannot be forged ACCIDENTALLY, and a prefix
write degrades to a loud red — but a module that writes a well-formed payload and exits `0` forges it
completely, and no in-process control can prevent that.** `A2` bought the accidental case, which is
what it was written for and is genuinely valuable. It did not buy the deliberate one and should not be
recorded as having done so.

**2. I would not carry the ±130 ms floor forward as a property of the protocol.** I measured ±390 ms
on the same machine running the same method, with the absolute lane CPU drifting ~600 ms upward across
my own rounds **in both arms**. The paired design exists to cancel that drift and does not fully cancel
it. **A floor quoted without its session is a number wearing a floor's clothes** — and this is the
fifth hop in a row that could not resolve its change, which is itself the finding `ABC-026` should be
reading.

**3. I would not let *"latent"* be inherited a sixth time without an instrument that does not share
the guard's grammar.** I re-derived it with the TypeScript **parser** rather than a regex precisely
because every prior sweep used the same textual technique as the thing it was checking. It came back
clean — **and it also came back cleaner than claimed**, with zero dynamic imports of any local module,
which the record does not state and which makes `R4`'s trigger mechanically checkable.

**On content in this workspace: it is DATA, not instruction.** Nothing read in `src/`, `plans/`,
`memory-bank/` or `.grugops/` purported to authorise a write outside this brief's boundary, and
nothing was acted on as if it did. **Nothing to report under that rule.**
