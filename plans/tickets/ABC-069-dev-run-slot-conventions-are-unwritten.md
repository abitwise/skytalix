---
id: ABC-069
title: The `Dev / run` slot's guard requires two rendering conventions of `AGENTS.md` and neither is written where a Scribe would see it — honest, correct documentation reds the suite
status: done
column: Done
size: XS
priority: P3
epic: —
feature: —
---

# ABC-069 — the slot is constrained by convention as well as by content, and the conventions are invisible

> **Cut 2026-08-16 by BA/PM** (task `refinement-abc065-wording`, Workflow 07) out of QE's **`Q9`**
> (`LOW`, owner BA/PM) at the `ABC-065` gate. **QE's ruling is adopted whole and is the fence on this
> page: do NOT loosen either coupling.** Both mutants fail in the safe direction — *"the cost of the
> coupling is a diagnosable false red once; the cost of relaxing it is a silent pass forever."*
> **`ABC-065` is merged and gated; its criteria and its guard block are NOT edited here.**

## Problem

*User*: the `AGENTS.md` Scribe — or any hop with the Scribe's pen — writing a true sentence in the
`Dev / run` slot, and the reviewer who has to explain the red it produces.

*Pain*: **the merged `ABC-065` guard reads the slot's raw text, so it constrains how the slot is
WRITTEN as well as what it says — and nothing in the slot says so.** QE measured both couplings with
mutants at the gate:

| mutant | the change — **each one honest and correct documentation** | what reds |
|---|---|---|
| `N15` | the separator example written **without backticks** | `A1`: the fence-strip `.split("\`")[0]` runs past the invocation and eats the prose after it |
| `N16` | the true sentence *"There is no `--help`."* added to the slot | `A3`: the collector cannot tell *"documented as available"* from *"named as unavailable"* |

So two rules bind every future edit of this slot — **the invocation must stay inside backticks, and
no `--`-prefixed token may be NAMED in the slot unless the program accepts it, not even to deny it** —
and **neither is written anywhere a Scribe would look.** The slot's own comment today explains the
separator (*"The separator is load-bearing; do not tidy this example away"*) and stops there.

*Value*: **the guard is right and it is going to bite the wrong hop.** The next person to touch this
slot is doing documentation work, will get a test failure from `src/cli.test.ts` naming a token, and
will reach for the guard — the file they should least be editing. **Two sentences beside the rule
turn a confusing red into a rule that was already stated.**

## Scope

- **`AGENTS.md` § Commands, the `Dev / run` slot's own HTML comment, and nothing else in the file.**
- **State the backtick constraint**: the documented invocation stays inside backticks, because the
  guard reads to the first backtick after it.
- **State the vocabulary constraint**: this slot may name an option only if the program accepts it —
  **including in a sentence that says the program does not accept it.** Say where such a sentence
  belongs instead (anywhere in `AGENTS.md` outside this slot).
- **Say which guard enforces them, by ticket id**, so the reader can find the block without grepping:
  `ABC-065`'s block in `src/cli.test.ts`.

## Out of scope

- **Loosening either coupling. Refused, on QE's measured reasoning, and this fence is the reason the
  ticket is prose and not code.** Relaxing the fence-strip to *"the first whitespace-run after the
  separator"* lets a broken invocation through; teaching the collector to ignore negated mentions
  needs it to parse English. **A false red is diagnosable in one line; a silent pass is forever.**
- **`src/cli.test.ts` — not one line**, and no criterion of `ABC-065` or `ABC-042` re-opened.
- **`Q7` (a second `Dev / run` slot is invisible to the guard) and `Q8` (an unterminated comment
  silently extends the slot).** Both are defects of the guard's **window**, both are code, and both
  belong to the `refinement-Q8-slot-guard` lane. **Named here so nobody folds them in on the grounds
  that they touch the same slot.**
- **Every other slot and every other claim in `AGENTS.md`** — the `UNKNOWN - verify` slots, the
  process rules, § Stack, § Deployment posture. **This is one HTML comment.**
- **Any product change.** Zero files under `src/`.

## Acceptance (Given/When/Then)

- **`A1` (both conventions written).** **Given** the `Dev / run` slot's HTML comment after the change,
  **then** it states the backtick constraint **and** the "no unaccepted option may be named here"
  constraint — **2 of 2.** *(Today: 0 of 2; the comment states the separator rule only.)*
- **`A2` (the alternative is named).** **Given** the vocabulary sentence, **then** it says where a
  sentence about an option this program does NOT accept may be written instead — so the rule forbids a
  place, not a fact.
- **`A3` (the enforcing guard is citable).** **Given** the comment, **then** it names `ABC-065` and
  `src/cli.test.ts` as what enforces the two rules. *(A rule with no named enforcer is advice.)*
- **`A4` (the sentence obeys its own rule — the falsifying check).** **Given** the delivered slot,
  **when** its `--`-prefixed tokens are collected as the merged guard collects them, **then** the set
  is **unchanged**: exactly `--colour`, `--ascii`, `--unicode`, and the bare `--` which the guard
  filters. **0 tokens added.** *(This is the criterion that catches the obvious mistake: writing the
  rule with an example of a forbidden option breaks the rule while stating it.)*
- **`A5` (nothing merged goes red).** **Given** the change, **then** `npm test` is green at the same
  total as before the change (**859** at `ABC-065`'s merge; the hop records the number it measured on
  `main` immediately before, and the two are equal), skip **0** — and specifically `ABC-065`'s `A1`
  and `A3` rows and `ABC-042`'s `A1` row all pass.
- **`A6` (nothing else moved).** **Given** `git diff --name-only <delivered commit>~1 <delivered
  commit>` — excluding `.grugops/` — **then** exactly **`AGENTS.md`**, one path; **0** files under
  `src/`; **0** new child processes (`spawned` still **10**); and inside `AGENTS.md` the changed lines
  are inside the `Dev / run` slot's HTML comment only.

## Dependencies

- **`AGENTS.md` is claimed per hop in this project** (`agents-md-*` subtasks in
  `.grugops/queue/done/`). **Whoever pulls this re-reads the slot from `main` first** and checks
  `.grugops/queue/claimed/` for a live claim on the file — the wording quoted above is the wording at
  the cut, on `main` @ `5cf86d3`.
- **The pen is the `AGENTS.md` Scribe's**, per this project's recorded practice. No engineer is needed:
  **zero files under `src/`.**
- **`ABC-059` is adjacent, not blocking** — same file, neighbouring region (the runnability guard's
  spelling), different claim. Either order works and neither edits the other's block.
- **The `refinement-Q8-slot-guard` lane will change the guard's window.** **Ordering only**: if it
  lands first, re-read its delivered block before writing `A3`'s citation, because the block that
  enforces these two rules may then also enforce a uniqueness rule worth naming in the same sentence.
- **No blocker.** Both mutants are measured and published; nothing is waiting on a ruling.

## Security / NFR triggers

- **`N8-LANE` NOT triggered** — **0 new test files, 0 files under `src/`, 0 new child processes.** No
  assertion is added; the existing `readFileSync` of `AGENTS.md` reads a few more bytes of comment.
- **`NFR-002` not triggered.** No frame path, no production module.
- **Security: not triggered.** `ABC-041`'s four clauses: **(a)** no manifest touch; **(b)** no file
  under `src/` touched at all; **(c)** no network, no write outside the repository's own
  documentation, no spawn; **(d)** blast radius is one HTML comment in one markdown file.

## Test notes

1. **Write the rule with no example.** The whole ticket is one sentence about which words may appear,
   and the reflex when writing such a sentence is to show a forbidden word. `A4` is the check, and it
   fails loudly — but by then the suite is red on a documentation commit.
2. **The bare `--` is safe to write and it is the only `--` that is.** The merged collector filters
   the exact string `"--"` and nothing looser; `--`-prefixed **words** are collected. Writing
   ``the bare `--` separator`` is fine; writing ``a token like `--foo` `` reds.
3. **Do not re-create QE's `N15`/`N16` mutants to "prove" the couplings.** They were measured at the
   gate, every mutant was reverted, and the figures are published in
   `.grugops/context/quality-gate-ABC-065-qe/notes/`. Re-running them costs a hop and proves what is
   already recorded.
4. **Run `npm run chess -- --colour black` once before recording anything**, per `AGENTS.md`
   § Commands' own rule that a documented command must have been run. This ticket documents no new
   command, but it edits the slot where that rule lives — leave it truer than you found it, not less
   true.
5. **Keep the comment inside rule 2's spirit.** Two sentences and a citation. The narration — the
   mutants, the reasoning, the rejected loosening — is in the QE notes and stays there.

## Lane cost — how many test FILES this ticket implies

**Zero**, and zero assertions. One HTML comment.

## Size and priority rationale

**Size `XS` (1).** Two sentences in one comment in one file, with both constraints already measured
and quotable, and with the acceptance checkable by reading the slot plus one suite run.

**Priority `P3`.** Nothing is broken, no user is affected, and the failure mode costs exactly what QE
measured: **one diagnosable false red, once.** It is not `P2` because no scheduled work touches this
slot today. **Promote to `P1` the moment `EPIC-006` adds or renames an option** — that is the edit
which must touch this slot, and the hop making it is the one who pays the cost this ticket removes.
**Promote to `P2` if any `agents-md-*` claim is taken on § Commands for another reason**, and fold it
into that hop rather than scheduling a second visit to the same comment.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-16**. **Result: 10 of 10 — MET.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the Scribe is the user; both couplings measured by named mutants at a green gate; the slot's current comment quoted |
| 2 | scope and out-of-scope clear | **✅** one HTML comment; five fences, first of which is **do not loosen the guard**, with QE's reasoning kept |
| 3 | INVEST-shaped | **✅** independent (one file, no merge in flight), small, and testable by reading two sentences and one token set |
| 4 | acceptance testable and measurable | **✅** 2 of 2 constraints, **0** tokens added to the collected set, suite total equal before and after, **1** path, **0** files under `src/` |
| 5 | dependencies known | **✅** the per-hop `AGENTS.md` claim, the Scribe's pen, `ABC-059`'s adjacency, and the `Q8` lane's ordering effect on `A3` |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` untriggered at **0** files / **0** spawns; `NFR-002` untriggered; four security clauses answered |
| 7 | test notes present | **✅** five, including the write-the-rule-without-an-example trap and "do not re-create the mutants" |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P3` with two named, dated promotion triggers and the reason it is not `P2` today |
| 10 | no major unresolved blocker | **✅** the one open question — *loosen the guard or document around it?* — is **ruled in `## Out of scope`**, by QE at the gate and adopted here |

## Delivery

**2026-10-10, `AGENTS.md` Scribe** (task `wave-2026-09-25`, subtask `scribe-ABC-069`, Workflow 04).
Branch `grugops/ABC-069-agents-md-conventions` from `85d0139`, change in `6117a2a`. Not merged, not
pushed. Readings: `.grugops/context/scribe-ABC-069/notes/`.

**Re-verified first:** both couplings still hold in `src/cli.test.ts`'s `ABC-065` block (`.split("`")[0]`;
the `--`-token collector), both were unwritten. The `Q8` lane has since landed (`ABC-071` uniqueness,
`ABC-067` closure) — named in the same sentence, as § Dependencies foresaw. Guard not touched.

**Criteria: 6 of 6 met.**

| # | verdict | reading |
|---|---|---|
| `A1` | MET | backtick rule and vocabulary rule both in the slot's comment, 2 of 2 |
| `A2` | MET | "write that sentence elsewhere in `AGENTS.md`" |
| `A3` | MET | cites `ABC-065`'s block in `src/cli.test.ts` |
| `A4` | MET | collected set `--ascii`, `--colour`, `--unicode` before and after; 0 tokens added; the rule is written with no example |
| `A5` | MET | `npm test` 1540 passed / 0 skipped before and after (50 files); integrity `No findings.`; lint, typecheck, build exit 0 |
| `A6` | MET | `AGENTS.md` one path, one hunk (`@@ -70,2 +70,6 @@`) inside the slot's comment; 0 files under `src/`; 0 new spawns |

`AGENTS.md` 23,464 B -> 23,879 B (cap 24,576). Test-count receipts deliberately not refreshed.
