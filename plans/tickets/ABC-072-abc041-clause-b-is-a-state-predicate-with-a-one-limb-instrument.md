---
id: ABC-072
title: '`ABC-041` clause (b) is written as a STATE predicate, its instrument covers one of its three limbs, and its stated prediction is falsified — decide which test binds, then write an instrument that can see it'
status: backlog
column: Backlog
size: S
priority: P1
epic: —
feature: —
---

# ABC-072 — the security trigger nobody reads the way it is written

> **Cut 2026-08-16 by BA/PM** (task `refinement-abc066-security-qe`, Workflow 07) out of
> Security/NFR's `S1` (MEDIUM) and `S2` (LOW) from `security-nfr-ABC-066`. **`ABC-041`'s page is NOT
> edited by this ticket** — it is merged, gated and `Done`; see § Where the corrected wording lands.
> **`ABC-066`'s page is not edited either**, for the same reason, so `S1`'s "one sentence on
> `ABC-066` § Security" is discharged HERE instead — stated so it is not read as dropped.

## Problem

*User*: the Orchestrator deciding whether to route a ticket through `In Security/NFR`, and the BA/PM
who copies the four-clause paragraph onto the next ticket page.

*Pain*: **`ABC-041`'s clause (b) is a present-tense STATE predicate over the whole tree, its printed
instrument tests ONE of its three limbs, and the prediction printed beside that instrument has been
false since 2026-08-15. A hop that runs the printed command gets "clean" while the clause's own
sentence says it fires.**

The clause, verbatim (`plans/tickets/ABC-041-render-seam-closure.md:220-224`):

> **(b) Production capability.** Fires if **any non-`.test.ts` file under `src/`** — this module or
> any module in its runtime closure — imports a Node builtin, **reads `process.`**, or calls
> `spawn` / `exec` / `fetch` / `eval` / `new Function`. *(`grep -rlE 'from "node:' src/ | grep -v
> '\.test\.ts'` empty. It is empty today across 47 files — a real invariant with a real baseline of
> zero, and **`ABC-042` is the hop that ends it**, deliberately rather than by surprise.)*

**Three defects in one paragraph, each measured on `main` @ `5cf86d3` (20 production files, 50 `.ts`
total):**

| # | defect | measurement |
|---|---|---|
| **1** | the body is a **state** test — *"Fires if any … file … reads `process.`"*, present tense, no delta language anywhere | **7 production files read `process.`**: `cli.ts`, `frame.ts`, `glyph-mode.ts`, `perft-bench.ts`, `render.ts`, `status-panel.ts`, `turn-loop.ts`. Under the words as written, **(b) fires on every ticket, forever** |
| **2** | the parenthetical **instrument** tests the FIRST limb only (`from "node:`) of a three-limb body | `grep -rlE 'from "node:' src/ \| grep -v '\.test\.ts'` → **0 files**, still, today. Limb 2 → **7**. Limb 3 (`spawn`/`exec`/`fetch`/`eval`/`new Function` call sites) → **0** |
| **3** | the parenthetical **predicts** *"`ABC-042` is the hop that ends it"* | **`ABC-042` merged 2026-08-15 @ `dbaf972` and did NOT end it** — it added `process.` reads, not a `node:` import. The instrument's baseline of zero is intact and the body fires anyway |

*Value*: **this has already cost a routing decision, and the next one is queued.**

- `ABC-066` answered a **delta** (*"no **new** `process.` read"*) against a state clause. Security/NFR
  overturned that reading at the gate; the ticket was saved by its fail-safe sentence, **not by its
  reasoning** (`S1`, MEDIUM).
- The Orchestrator then used `S1`'s state reading to justify **skipping** `In Security/NFR` on
  `ABC-065`, on the ground that clause (b)'s *"subject is non-`.test.ts` files under `src/`, and this
  ticket touches none"* (`.grugops/context/pull-abc065-066-2026-08-16/notes/` @ `2026-08-16T03:00Z`).
  **"Touches none" is a file-touched test — the very reading `S1` overturned.** Under the state
  reading the clause fires on `ABC-065` too, because the tree still holds those 7 files. **Whether
  that skip was consistent with the reading it cited is an open question and it belongs to the
  Orchestrator; this ticket records it rather than answering it** (see `A5`).
- **`ABC-061` is `P1`, `DoR 10/10` and next in line, and its clause-(b) paragraph is the
  file-touched form with NO fail-safe sentence.** The propagation is `ABC-073`.

**What is NOT wrong here:** no control was bypassed and no merged verdict moves. `ABC-066`'s (b)
fired and was **cleared on the merits** (capability surface of `src/cli.ts` byte-identical either
side); `ABC-065` merged with **zero** production files touched. **This is a threshold that cannot be
read consistently, not a defect that shipped.**

## Scope

**Zero files under `src/`. Zero tests. One decision and one canonical paragraph.**

- **The ruling: is clause (b) meant to be the STATE test it is written as, or a DELTA test?**
  Architect/Design's, not BA/PM's and not this ticket's author's — see § Dependencies. **The evidence
  points both ways and is written out below rather than resolved by inference.**
- **The canonical clause text**, in one place a later ticket can copy from by name, carrying whichever
  reading is ruled.
- **An instrument that covers the body it is printed under** — three commands, one per limb.
- **Retiring the falsified prediction** (`"ABC-042 is the hop that ends it"`).

## The evidence points both ways — read this before ruling

**For STATE (the words):** the verb is *"Fires if any … file … **reads**"*, present tense; the subject
is *"any non-`.test.ts` file under `src/` — this module **or any module in its runtime closure**"*,
which is a property of the tree, not of a diff; the instrument is a whole-tree `grep -r`, not a
`git diff`. `ABC-042`'s own page applied exactly this reading to this limb on this module —
*"triggered, and NOT waived"* — and that page was gated and accepted.

**For DELTA (the stated intent):** the same paragraph's own history line says the four-subject form
was *"repaired 2026-08-13; the one-subject form it replaces **fired on a property the tree had
already abandoned two tickets earlier, so it measured the repo rather than the change**"*. **Measuring
the repo rather than the change is precisely what the state reading does** — so clause (b) as written
reproduces the failure the repair existed to remove.

**The cost of each, stated:** the state reading makes (b) fire on every ticket forever, which turns a
trigger into a constant and moves the real filtering into "fires, then cleared on the merits" — honest
but noisy. The delta reading is quiet and cheap, and it is what four of the last five ticket pages
already assumed **without saying so**. **Either is defensible. Being unable to tell which one binds is
not.**

## Where the corrected wording lands — read this before objecting

`ABC-041` is **merged, gated and `Done`**; `ABC-066` is merged; `ABC-065` is merged. **None of the
three is edited by this ticket or by the hop that builds it.** A criterion edited after gating means
the gate ran against a page that no longer exists — the doctrine `ABC-058` § *How the wording is
repaired without touching a gated page* and `ABC-060` both already hold on this board, and this
ticket does not re-argue it.

So the ruling and the canonical paragraph land in a **decision artifact** — an ADR under
`memory-bank/50-decisions/`, or a `decision` note under this ticket's `.grugops/context/` task — and
future ticket pages cite it by name instead of copying a paragraph nobody can trace. `ABC-041` keeps
its un-clarified wording permanently, and the record of why is this section.

## Out of scope

- **Any production or test file.** `src/` is untouched: 0 paths, 0 new spawns, 0 new test files.
- **Re-opening `ABC-066`'s or `ABC-065`'s merge, gate or verdict.** Both merged green. Security/NFR's
  `PASS_WITH_RISKS` on `ABC-066` stands and is not re-run here.
- **Clauses (a), (c) and (d).** All three were measured correct by Security/NFR against `ABC-066` and
  no defect was found in any of them. **Only (b) is in scope.**
- **Repairing the copies on other ticket pages** — that is `ABC-073`, deliberately split so the
  ruling is not held hostage to seven page edits.
- **Building a guard that reads ticket pages.** Rejected at the cut; the reason is in this task's
  notes.

## Acceptance (Given/When/Then)

- **`A1` (the shape is ruled, by the role that owns it).** **Given** the two readings above,
  **when** Architect/Design records a decision artifact, **then** it states **STATE** or **DELTA** in
  those words, gives its reason, and names the consequence it accepts (permanent firing, or a
  narrower trigger). **The artifact exists on disk and is authored by Architect/Design — BA/PM's word
  does not satisfy this row.**
- **`A2` (one canonical paragraph, citable by name).** **Given** the ruling, **then** the artifact
  carries clause (b)'s corrected text **once**, and names itself as the place future ticket pages
  cite. **Observable:** a later ticket's Security paragraph can reference it with a path and an id
  instead of a copied sentence.
- **`A3` (the instrument covers the body).** **Given** the corrected text, **then** its instrument is
  **three** commands, one per limb, and each is RUN and its output recorded at the hop. **On `main`
  today the three return: `node:` imports → 0 files; `process.` readers → 7 files, named; dangerous
  call sites (`spawn`/`exec`/`fetch`/`eval`/`new Function`) → 0.** A hop that reports a limb without
  running its command fails this row.
- **`A4` (the falsified prediction is retired).** **Given** the corrected text, **then** it does NOT
  carry *"`ABC-042` is the hop that ends it"*, and it states the measured fact instead: `ABC-042`
  merged @ `dbaf972` and the `node:` grep is **still 0 across all 20 production files**.
- **`A5` (the live consequence is answered, not buried).** **Given** the ruling in `A1`, **then** the
  artifact answers, in one sentence, **whether clause (b) fired on `ABC-065`** under that reading —
  and states either way that **`ABC-065`'s merge is not re-opened** (it touched 0 production files;
  its capability delta is nil). **The Orchestrator's skip paragraph is cited by path.** *(This is a
  record, not a re-run: re-deciding a Security/NFR verdict is out of scope for every role but
  Security/NFR.)*
- **`A6` (nothing else changed).** **Given** the delivered commit, **then** `git diff --name-only
  <commit>~1 <commit>` shows **only** this ticket's page and the decision artifact — **0 paths under
  `src/`**, and `plans/tickets/ABC-041-*.md`, `ABC-042-*.md`, `ABC-065-*.md`, `ABC-066-*.md`
  **byte-identical by blob SHA**. Suite green, skip **0**.

## Dependencies

- **The ruling in `A1` is Architect/Design's, and it is not made yet — this is the ⚠️.** Precedent on
  this board: `ABC-053` and `ABC-054` are both held the same way, on rulings the ADR's own words give
  to Architect/Design. **BA/PM cannot rule on the shape of a security threshold; that is the whole
  reason clause (b) says the implementer is "structurally the wrong decider".**
- **`ABC-073` depends on THIS ticket** — the copies cannot be repaired to one wording until the
  wording is decided. Not the other way round.
- **No dependency on `ABC-042`'s merge.** It merged 2026-08-15 @ `dbaf972`, measured.

## Security / NFR triggers

- **Clause (b) is the SUBJECT of this ticket, and it is answered here in the form the ticket asks
  for.** `ABC-041`'s four clauses against this ticket's own diff: **(a)** no manifest touch — neither
  `package.json` nor `package-lock.json` is opened; **(b)** — **under the STATE reading it FIRES**
  (7 production files read `process.` today, listed above, unchanged by this ticket); **under the
  DELTA reading it does not** (0 files under `src/` touched, capability delta nil). **Both answers are
  stated because that is the defect.** **(c)** no test file touched, no network, no write, no spawn;
  **(d)** blast radius is two markdown paths, none under `src/`. **Whichever way the reading is
  disputed, it fires and the gate resolves it.**
- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**. **0 new test files, 0 new files under `src/`,
  0 new child processes, 0 assertions added.** The lane cost of this ticket is **zero** and that is
  checkable from `A6`'s path list.
- **`NFR-002` not triggered.** No frame path, no production module opened, no probe root moved.

## Test notes

1. **Run all three limb commands on `main` before writing anything** and paste the output into the
   artifact. The whole defect is a printed instrument nobody re-ran; do not repeat it.
2. **The `process.` limb has a known false-positive class**: `grep -rl 'process\.'` matches prose in
   doc comments. Security/NFR hit exactly that on limb 3 — `src/cli-options.ts:7-8` contains the
   *words* "spawning"/"spawn" and **0 call sites**. Report call sites, not word hits, and say which
   you counted.
3. **Do not "fix" the clause by making the instrument match the body without ruling `A1` first.** A
   three-limb instrument under a state body means every ticket fires; that is a scheduling
   consequence, not a wording tidy-up, and it is the Orchestrator's to absorb knowingly.
4. **`ABC-042`'s page is the counter-precedent and must be cited, not overturned**: it applied the
   state reading to this limb on this module and was gated on it. If the ruling is DELTA, the artifact
   says explicitly that `ABC-042`'s paragraph was right under the old text and is not re-opened.
5. **Label collision, stated so nobody hunts the wrong finding**: `ABC-058` carries a different `S1`
   — Security/NFR's `ABC-042` re-check, about bar 1b having no in-suite row. **Same label, different
   author, different subject.** The `S1` in this ticket is `security-nfr-ABC-066`'s.

## Size and priority rationale

**Size `S` (2).** The typing is one paragraph; the `S` is the ruling, the three commands run and
recorded, and the two-reading argument that has to survive a reviewer who prefers the other one.
**Not `XS`**: it needs another role's decision. **Not `M`**: nothing is designed, no code moves, and
both readings are already written out here.

**Priority `P1`.** No live defect and nothing is broken today — but the threshold decides **whether
the security gate runs at all**, it has already produced two contradictory routing answers in two
days, and `ABC-061` (`P1`, `DoR 10/10`) will inherit the paragraph with no fail-safe. **Not `P0`:
nothing is unmergeable and no user is harmed.**

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-16**. **Result: 9 of 10 — NOT MET.** ⚠️×1, and the ⚠️ is a required ruling by another role.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** three defects in one paragraph, each measured on `main` @ `5cf86d3`; two routing decisions already taken on contradictory readings, both cited by path |
| 2 | scope and out-of-scope clear | **✅** one decision, one paragraph, 0 files under `src/`; five fences including the three merged pages and `ABC-073` |
| 3 | INVEST-shaped | **✅** independent of every other ticket; the propagation repair is split out so this one delivers alone |
| 4 | acceptance testable and measurable | **✅** an artifact that exists and names STATE or DELTA; three commands returning **0 / 7 / 0** today; a blob-SHA fence over four merged pages; **0** paths under `src/` |
| 5 | dependencies known | **✅** Architect/Design's ruling (open); `ABC-073` depends on this; `ABC-042`'s merge measured and NOT a dependency |
| 6 | security/NFR triggers with a measurable target | **✅** the subject — all four clauses answered, (b) answered **twice, once per reading**, with the fail-safe sentence carried; `N8-LANE` ≤ 650 ms with a measured lane cost of zero |
| 7 | test notes present | **✅** five, including the word-hit-vs-call-site trap and the `S1` label collision with `ABC-058` |
| 8 | size assigned | **✅** `S` (2), with the reason it is neither `XS` nor `M` |
| 9 | priority assigned | **✅** `P1`, with the reason it is not `P0` |
| 10 | no major unresolved blocker | **⚠️** the STATE-vs-DELTA ruling is Architect/Design's and is not made. Real, external, named — **and deliberately NOT resolved by inference at the cut**, which is this task's stop condition |
