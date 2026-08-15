---
id: 20260816T011900Z-security-nfr-decision-the-security-nfr-verdict-pass-with-risks-df50a2c7
kind: decision
by: security-nfr
at: 2026-08-16T01:19:00Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - ABC-041
  - ABC-042
  - ABC-056
  - ABC-062
  - ABC-065
  - src/cli.ts
  - src/cli.test.ts
supersedes: 
---

# `ABC-066` — the Security/NFR verdict: **PASS-WITH-FIXES** (`PASS_WITH_RISKS`). **0 HIGH. Nothing here blocks the merge**

The one-page answer. Every figure behind it is in this task's two `observation` notes and the
`ABC-041`-clauses `decision` note; nothing measured there is restated here.

**`security.block_on` is `high`. There is no HIGH finding. This gate does not block `ABC-066`.**

## The result

| | |
|---|---|
| **Result** | **`PASS_WITH_RISKS`** — reported to the Orchestrator as **PASS-WITH-FIXES** |
| **Blocking findings** | **0** |
| **Findings attributable to this change** | **0 of any severity** — see below |
| **Findings about the surrounding record** | **4** — 0 HIGH, 1 MEDIUM, 3 LOW, every one owned |
| **ASVS L1** | **7 of 70 requirements apply. 7 PASS, 0 FAIL, 0 unbacked ticks.** 63 N/A with reasons |
| **`ABC-041` clauses** | (a) no · **(b) FIRES — the ticket says it does not** · (c) no · (d) no |
| **`N8-LANE`** | **MET.** Re-run independently; direct instrument **0.31 ms** = 0.0005× the 650 ms bar. **Row does not move** |
| **`NFR-002`** | **NOT TRIGGERED** — confirmed with an armed probe, not accepted |
| **`NFR-008`** | **HOLDS** — median wall 2.4 s (≤ 3 s), CPU 10.7–11.1 s (≤ 13 s) |
| **Mandatory gates** | lint **0**, typecheck **0**, unit **857/857 on 30**, build **0**, skip **0** — all re-run by me |

## Nothing in the delivered change is a security or NFR defect. Measured, not concluded

The production change is **one string literal and a six-line doc comment**. Its capability surface is
**byte-identical** before and after — same 5 relative imports, **0** Node builtins, the same 5
`process.` names in the same 10 places, **0** `spawn`/`exec`/`fetch`/`eval`/`new Function`, **0**
exports. `printableOf` is untouched, `src/cli-options.ts` is **0** lines changed, `spawned` is **10**,
and **8 of 8** injection attempts against the refusal message failed. **I attacked this change and it
held.**

## Findings — every one with severity, residual risk and a named owner

**None of these is a defect in the delivered code. Three are documents and one is a comment.**
Numbered `S1`–`S4` to stay clear of the Orchestrator's `G1`–`G3`, the engineer's `G4`–`G7` and QE's
`Q1`–`Q6`, which are referenced and not restated. **None was repaired here** — `src/` is read-only to
this hop by instruction, and every one of these is another role's pen.

### `S1` — `ABC-066` § Security misreads `ABC-041` clause (b): it states a DELTA test where the clause states a STATE test. **MEDIUM.** Owner: **BA/PM**

Clause (b)'s verb is *"Fires if any non-`.test.ts` file under `src/` … **reads** `process.`"* —
present tense, whole-tree, with a `grep -r` instrument. `ABC-066` answers *"no **new** `process.`
read"*. Measured: **7 production files read `process.`, `src/cli.ts` among them** — so **(b) fires**.
`ABC-042`'s own page applied the state reading to the same limb on the same module and called it
*"triggered, and NOT waived"*; the two pages now disagree.

- **Why MEDIUM and not LOW:** the failure mode is a future ticket concluding the security gate does
  not apply to it. That is the one mistake this threshold exists to prevent.
- **Why MEDIUM and not HIGH:** the clause's own fail-safe — *"whichever way a reading is disputed, it
  fires and the gate resolves it"* — is carried on `ABC-066`'s page too, and **it worked**: the gate
  fired, I am it, and (b) is cleared on the merits. No control was actually bypassed.
- **Residual risk:** a later BA/PM copies the clause-(b) paragraph **without** its closing sentence
  and cuts a ticket that argues the gate away. **Bounded by** the closing sentence surviving in both
  places today, and by the Orchestrator routing the gate regardless of the page.
- **Fix (not mine to make):** one sentence on `ABC-066` § Security — *(b) fires; the capability is
  `ABC-042`'s, unchanged by this diff* — and, separately, a decision on whether `ABC-041`'s clause
  (b) is **meant** to be a state test that now fires permanently, or a delta test that should be
  re-worded to say so. **I am not re-wording a merged ticket's clause; that is the stop condition and
  I stopped at it.**

### `S2` — clause (b)'s parenthetical INSTRUMENT covers one of its three limbs, and its stated prediction did not come true. **LOW.** Owner: **BA/PM** / **Architect/Design**

The body has three limbs (builtin import, `process.` read, dangerous call); the parenthetical is
`grep -rlE 'from "node:' src/ | grep -v '.test.ts'` — the **first limb only**. It also predicts
*"`ABC-042` is the hop that ends it"*; **`ABC-042` did not**, because it added `process.` reads and
no `node:` import. **The `node:` grep is still EMPTY today across all 20 production files**, so a hop
running only the printed command gets "clean" while the clause's sentence says it fires.

- **Residual risk:** a hop measures the instrument instead of the body and under-reports capability.
  **Bounded by** the body being three plain greps, all of which I ran and published here.
- **Owner:** BA/PM holds the ticket pen; Architect/Design owns the threshold's shape if it is to be
  re-cut rather than re-worded.

### `S3` — `printableOf` dropping `\n` is what keeps a refusal message unforgeable, and nothing says so. **LOW.** Owner: **whoever next edits `printableOf` or the refusal write site** (Orchestrator to schedule)

`printableOf`'s docblock explains that it drops C0 and `U+007F` and deliberately keeps code points
above `U+007F`. It does **not** say that dropping `0x0A`/`0x0D` is the control that stops a user
manufacturing extra stderr lines.

- **The delivered build is IMMUNE and I proved it**, including on a deliberately regressed build:
  because `USAGE` is written **last** in the one template, an injected newline inserts a line
  **before** the usage line and never after it, so **`usageLineOf` returns the real line even under
  the regression** and the guard cannot be turned green on forged text. **The hypothesis I went
  looking for is FALSE and I am reporting the negative result.**
- **Residual risk:** in a hypothetical future build that preserved `\n`, a human — not the guard —
  would see two lines beginning `usage:`, the first attacker-controlled. **Severity is LOW and the
  real-world impact is near zero**: this is a local single-user CLI with no privilege boundary, so
  the "attacker" forges a message to himself at his own shell. **Not inflated beyond that.**
- **Fix:** one comment sentence, in a later hop. **No production change is warranted now** and I am
  not recommending one.

### `S4` — the subtask's own `workflow:` reference does not resolve on this install. **LOW.** Owner: **Orchestrator**

`.grugops/queue/pending/security-nfr-ABC-066.md` front matter names
`agent-factory/workflows/07-security-nfr-review.md`. The kit ships **`07-backlog-refinement.md`**;
there is **no** `07-security-nfr-review.md`. I ran the per-ticket check off
`agent-factory/roles/security-nfr.md`, using `15-security-audit.md`'s ASVS filter rule and severity
map — `15` explicitly distinguishes the deep audit from *"the lightweight per-ticket Security/NFR
check that already runs in the `In Security/NFR` column"*, so the two are correctly separated.

- **Residual risk:** a later hop follows the reference, lands on backlog refinement, and runs the
  wrong protocol. **Bounded by** this note. **Recorded rather than silently substituted.**

## The two MEDIUM QE gaps — the ruling the subtask asked for

**Neither `Q1` nor `Q2` is a security or NFR concern in my reading. Both are test-efficacy concerns.**
Neither touches production behaviour, neither consumes a budget, neither creates or widens exposure.
**They are correctly MEDIUM and correctly not mine to fix.** Two things worth adding:

1. **Their apparent severity ordering is inverted, and `Q2` is the dangerous one.** `Q1`
   (`usageLineOf` is positional) fails **loudly** — a false RED naming the line it read, diagnosable
   in seconds, and it **cannot** go green by looking at the wrong line. `Q2` (`advertisedTextOf`
   returns a wrong substring when the separator is absent) fails **silently** — I reproduced it:
   `"- Dev / run: \`npm run chess\` <!-- x -->"` → `"m run chess\` <!-- x -->"`, no throw. **A guard
   that omits the `includes(SEPARATOR_FORM)` precondition goes vacuously green on exactly the defect
   `ABC-065` exists to catch.** Of the six QE gaps this is the one to hand to `ABC-065` in writing,
   which is also QE's own recommendation and I am seconding it, not restating it.
2. **A correction to `Q2`'s text, so nobody hunts a bug that is not there.** `Q2` describes the code
   as `slice(usageLine.indexOf(SEPARATOR_FORM) + 17)`. **The source reads
   `+ SEPARATOR_FORM.length`** (`src/cli.test.ts:192`) — QE substituted the numeric value, which is
   indeed 17. **There is no magic number and none needs fixing.** `Q2`'s *behavioural* claim is
   exactly right and I reproduced it: `-1 + 17 = 16`, a silent slice from a meaningless offset.

**`Q3`, `Q4`, `Q6` are LOW and I concur with QE's disposition on each.** `Q5` (no `§14-gate` stamp is
emittable on this install) constrains this note too: **it is a `decision`, it carries no verdict
stamp, and it is a Security/NFR result — not a human acceptance signature.**

## What I did NOT do, stated so it is not read as done

- **No production change. `src/` is pristine** — `git status --porcelain -- src/` **empty**,
  `git diff HEAD -- src/` **0 lines**. My one regressed build was a copy **outside the repository**,
  run and deleted; it never entered a worktree.
- **No merge, no push, no deploy.** This repository has no remote; the merge key is the
  Orchestrator's on the owner's standing grant, and it is not mine.
- **`plans/board.md`, `plans/traceability.md` and `plans/nfr-catalog.md` not written** — the first
  two are the Orchestrator's on this task by instruction, and **a gate does not move `N8-LANE`**,
  which the catalog row states in its own words. **The `In Security/NFR` → `Ready for UAT` move that
  `agent-factory/roles/security-nfr.md` normally gives this role, and the trace row for `ab0864e`
  plus this result, are OWED AND UNWRITTEN** — named here so they are not silently lost, the same way
  the engineer and QE named theirs. **No NFR catalog row is needed for this ticket** — `N8-LANE` is
  inherited by name and `MET`, `NFR-002` untriggered, `NFR-008` unmoved — so I am proposing none.
- **`AGENTS.md` not opened for write** — `ABC-065`'s half is live and unmerged on another branch.
- **`ABC-041`'s and `ABC-042`'s pages not edited.** `S1` and `S2` are routed recommendations. **No
  merged criterion was re-worded, and no merged `ABC-042` row has to move** — re-measured at **0**
  deleted content lines in `src/cli.test.ts`, so that stop condition never fired.
- **No severity softened to let a merge through.** The only severity I moved I moved **up the
  transparency ladder, not down**: `V15.1.1`'s L1-default `high` is explicitly overridden to `LOW`
  **with its reason and its named owner written out**, per the role's hard limits — and it is a
  pre-existing, owned, ticketed risk that this change does not touch.

## Recommendation to the Orchestrator

**Move `ABC-066` on from `In Security/NFR` to `Ready for UAT`.** The change is one string literal
whose capability surface is byte-identical, it survived eight injection attempts and a bar-3 re-run
on the route it has just started advertising, and its lane cost is **0.31 ms**.

**Three things to route, none of them blocking:**

1. **`S1` to BA/PM** — one sentence on `ABC-066` § Security, and a decision on whether `ABC-041`
   clause (b) is meant to be the state test it is written as. **This is the item I would not let
   drop**, because it is the one that could cost a future ticket its gate.
2. **`Q2` to `ABC-065`'s guard hop in writing**, with the two preconditions QE spelled out. Seconded
   on my own reproduction, and it is the highest-value carry-forward of the eleven gaps now on this
   ticket's record.
3. **`S4` to yourself** — the subtask template's `workflow:` field points at a file the kit does not
   ship.
