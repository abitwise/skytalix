---
id: ABC-062
title: Two command lines reach the refusal path untested, and one of them crashes there instead of refusing
status: done
column: Done
size: XS
priority: P1
epic: —
feature: —
---

# ABC-062 — the refusal path: two argvs reach it untested, and one crashes instead

> **Cut 2026-08-15 by BA/PM** (task `uat-ABC-042-followups-2026-08-15`, subtask `uat-ABC-042-cut`,
> Workflow 03) out of QE/E2E's `R3` + `R4` (`.grugops/context/uat-ABC-042-qe/notes/`). **`ABC-042` is
> merged, `Done`, and both gates passed against it: its page is NOT edited and no criterion of its is
> re-opened.** The delivered refusal path is correct on every point examined; what is missing is the
> assertion.
>
> **RE-CUT 2026-08-17 by BA/PM** (task `recut-ABC-062-criteria`) at the `Ready for Dev` exit under
> project process rule 1. **Three of the original six criteria were struck as already delivered** —
> see `## Struck criteria`, which is the permanent record of why this page shrank. Prose, line
> references and size were corrected in the same pass. **What remains is `A1`, `A2` and `A6`, plus one
new criterion `A7` this hop added** — the two refusal messages must differ from each other, which
nothing on the page required and no test asserts.
>
> Most measurements below are the Orchestrator's first-hand mutant runs in
> `.grugops/context/ticket-to-pr-ABC-062-2026-08-17/notes/`. **One is this hop's own and it changed
> the outcome:** `A3` was to be *narrowed* to a stdout residue, and that residue measured **vacuous**
> — so `A3` is struck rather than narrowed. The run is in
> `.grugops/context/recut-ABC-062-criteria/notes/`.
>
> **The filename still says `refusal-usage-line`, and the usage line is no longer this ticket's
> subject.** It is kept because `ABC-062` is the stable key and three merged notes cite the path;
> renaming it would break them to fix a cosmetic. Read the `title` field, not the filename.
> **`plans/board.md:119` and `plans/traceability.md:406` still carry the pre-re-cut title, size `S`
> and the struck criteria** — this hop's fence was this page only, and bringing those two rows into
> line is the Orchestrator's to route.

## Problem

*User*: the person who types a command line wrong — which, on a command with a closed six-word
vocabulary, is everyone at least once. The only thing they are given is the refusal message.

*Pain*: **two command lines reach the refusal path that no test resolves, and one of them crashes
there instead of refusing.**

- **`["--colour"]` — the command line that simply stops — is resolved by no test.** The near-miss
  family at `src/cli.test.ts:410` always supplies a second token, `A6(ii)`'s sweep always supplies a
  word, and every spawned refusal child carries one. QE mutated the `?? token` fallback at
  `src/cli-options.ts:130` (`next ?? token` → `next as string`) and the suite stayed green; **that
  mutant still ships 863/863 green on `main` at `48a00cf`**, while `node src/cli.ts --colour` throws
  an uncaught `TypeError: text is not iterable` out of `printableOf` (`src/cli.ts:69`) — a Node stack
  trace where the usage sentence belongs. **The exit code is `1` either way**, so even an exit-code
  assertion passes. **The defect is live today.**
- **`["white"]` — a value word with no `--colour` in front of it — has no deterministic coverage at
  any level** (UAT-10 row d). A `grep` for a bare `["white"]` argv across `src/*.test.ts` returns
  zero hits, and the random corpus in the `:545` region reaches it only by accident.

*Value*: the refusal is a product surface, not an error path — for a program that prints one frame
and exits, it is half of everything a user can see. **After this ticket both untested argvs are named
at the resolver, and the crashing one can no longer regress unseen.**

## Scope

- **A new `it` block naming the two uncovered argvs** — `["--colour"]` and `["white"]` — asserting
  `ok`, the `problem` text and the `offending` tokens for each, **and that the two `problem` values
  are not the same message**.
- **A comment naming the mutant** (`next as string`) and the UAT scenario rows behind these argvs, so
  a later "tidy" does not delete the reason.

## Out of scope

- **Every merged row.** `:315`, `:325`, `:410`, `:545` and `:750` stay **byte-identical**, and so does
  **`ABC-066`'s block at `:949-984`** — including `usageLineOf` at `:190` and the vocabulary
  assertion at `:982`. The new assertions live in their own named block. `ABC-042`'s `A5`/`A6` and
  `ABC-066`'s criteria are neither widened nor re-interpreted.
- **Anything already delivered.** By `ABC-066`: the usage line's presence on the six refusal children
  and the equality of its advertised tokens with `ACCEPTED_ARGUMENTS`. By `ABC-042`: that a refusal
  writes zero frame rows to stdout — asserted on **all six** refusal children **by name**, at `:403`
  (`conflict`), `:418` (the hand-listed four) and `:925` (`escape`). See `## Struck criteria`.
- **Exporting `USAGE` from `src/cli.ts`.** That module **exports nothing** by `ABC-042`'s `A2` and
  `ADR-0011` clause 4, and a test that forced an export would break a criterion to check a string.
- **Any new child process.** The refusal children exist; the spawn count is pinned at **10**
  (`src/cli.test.ts:933`) and an eleventh is a defect.
- **The five refusal command lines that are never spawned** (`--help`, `--COLOUR white`,
  `--colour WHITE`, and the two above) as **end-to-end** cases. They share one early-return path;
  this ticket pins them at the resolver, which is where the mutant lived.
- **Zero production lines.** `src/cli.ts` and `src/cli-options.ts` are read, never edited.

## Acceptance (Given/When/Then)

- **`A1` (the crashing branch is named).** **Given** `resolveOptions(["--colour"])`, **then** `.ok`
  is `false`, `.problem` contains `white|black|random` (the missing-value message), and `.offending`
  deep-equals `["--colour"]`. **And given** `next as string` substituted at `src/cli-options.ts:130`,
  **then** the suite is **RED**. *(Today: **863/863 green** with that mutant, measured first-hand
  2026-08-17 — this mutant is the ticket's central witness.)*
- **`A2` (the bare value word is named).** **Given** `resolveOptions(["white"])`, **then** `.ok` is
  `false`, `.problem` contains `unrecognised`, and `.offending` deep-equals `["white"]`.
- **`A7` (the two refusals are DISTINGUISHABLE).** **Given** both resolutions above, **then** their
  `.problem` values are **not equal** — a build answering both command lines with one message passes
  `A1` and `A2` separately and still tells one of the two users the wrong thing. *(`A7`, not `A3`:
  `A3`–`A5` are retired ids and this is the next free one.)*
- **`A6` (nothing else moved).** `git diff --name-only <the delivered commit>~1 <the delivered
  commit>` shows **exactly** `src/cli.test.ts` — **one path**, **zero production lines**,
  **`spawned` still `10`**. Suite green, skip **0**.

**Criterion ids `A3`, `A4` and `A5` are retired, not reused.** They are kept vacant so a reader of the
history, the QE notes or `plans/traceability.md` cannot mistake a renumbered criterion for a struck
one. `A6` keeps its id for the same reason, and the new criterion took `A7` rather than the free `A3`
— **the gap between `A2` and `A6` is the record, not a typo.**

## Struck criteria

Struck **2026-08-17** at the `Ready for Dev` exit, because work that merged **after this page was
cut** — or, for `A3`, work that was already on `main` when it was cut — already delivers them.
**They were cut for being done, not for being hard**: none was descoped, deferred or judged not worth
doing, and each could be reported MET today with an empty diff.

| id | what it asked | who delivered it | where |
|---|---|---|---|
| `A3` | the six refusal children write **zero frame rows to stdout** | **`ABC-042`** (merged) | asserted on **all six by name**: `:403` (`conflict`), `:418` (the hand-listed four), `:925` (`escape`). Those six ARE the six that `:954` derives — of the ten children, `npmRun`, `white`, `black` and `random` exit `0` |
| `A4` | the usage line's tokens equal `ACCEPTED_ARGUMENTS` element for element, both ways, read at run time and never transcribed | **`ABC-066`** (merged) | `src/cli.test.ts:982` — that assertion **verbatim** |
| `A5` | deleting `${USAGE}` from the rejection write in `src/cli.ts` reds the suite | **`ABC-066`** (merged) | the `usageLineOf` extraction at `src/cli.test.ts:190`, consumed at `:954`. The mutant applied to `src/cli.ts:82` measures **RED today** (`1 failed \| 35 passed`); the original page's "(Today: green.)" was true at the cut and is stale |

**`A3` was meant to be narrowed, not struck, and the measurement overruled that.** The narrowed
residue would have read "the six children **derived** from the capture write zero frame rows to
stdout", on the reading that `:418` covers only a hand-listed **four**. That reading is right about
`:418` and wrong about the tree: `:403` and `:925` cover the other two, so the property already holds
for every member of the derived set. It was tested rather than argued — a build that refuses **and**
prints a board was run on 2026-08-17 and ships **RED** (`5 failed | 31 passed`), failing at `:403`,
`:418` and `:925` among others. A derived-set restatement would add a guard against an **eleventh**
refusal child, which this page's own `## Out of scope` calls a defect and `A6` pins at `10`. Run and
evidence: `.grugops/context/recut-ABC-062-criteria/notes/`.

## Dependencies

- **None open.** `ABC-042` is merged at `dbaf972` and `ABC-066` is merged; **between them they are
  what shrank this page** — `ABC-066` took `A4` and `A5`, `ABC-042` had `A3` all along. Both modules
  exist on `main`.
- **Same-file neighbours, not blockers:** `ABC-058`, `ABC-059`, `ABC-061`, `ABC-063`, `ABC-064`. No
  shared assertion, every one of them states "no merged row edited", any order works.
- **`ABC-063` overlaps in subject and not in code** — it names six argvs at the same refusal path.
  Either can merge first; if both land, the two case lists must stay separately named so a reader can
  tell UAT-16's six from this ticket's two.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**. **0 new test files, 0 new files under `src/`,
  0 new child processes** — QE costed this at zero when it still reused the refusal children, and
  since the re-cut it does not touch them either. Added work: two pure resolver calls and seven
  assertions over their return values, in process. **No child is spawned and none is read.**
  **`N8-LANE` is `MET` at 0.23× (152.5 ms of 650 ms) and this ticket must not move it.**
- **`NFR-002` not triggered.** A refusal writes no frame row, by `ABC-042`'s `A5`/`A6` — already
  asserted over all six refusal children, which is why `A3` was struck.
- **Security: not triggered, but adjacent and worth one line.** The usage text is **this module's own
  prose** — `ABC-042`'s bar 3 governs the **echoed token**, which this ticket does not touch.
  `ABC-041`'s four clauses: no manifest touch, no non-test file under `src/`, no network/write/new
  spawn, blast radius one path.

## Test notes

1. **Write `A1`'s mutant first and watch it RED.** It is now this ticket's only mutation witness —
   the second one went with `A5` — so a guard that passes without it has been argued, not tested.
2. **Do not fold the two argvs into the near-miss family at `:410`.** That family is *complete over
   position* and derived from the table; adding hand-picked members changes what a merged criterion
   means.
3. **This ticket touches no child process and no captured output.** All three criteria read nothing
   but the two `resolveOptions` return values. If you find yourself reading a `CHILDREN` entry, you have drifted into
   `ABC-042`'s or `ABC-066`'s delivered ground — see `## Struck criteria`.
4. **`.problem` must be asserted WITHOUT transcribing the message, and without exporting it.**
   `MISSING_VALUE` and `UNRECOGNISED` are module-private in `src/cli-options.ts` (`:92-93`) and
   exporting them is a production line this ticket does not have. The delivered practice is `:388`:
   `toContain` on the distinguishing substring. So assert that `A1`'s `.problem` contains
   `white|black|random` and `A2`'s contains `unrecognised`, **then assert the two values differ
   (`A7`)** — which is the real risk the loose matching leaves open: one refusal message for both
   argvs satisfies two `toContain`s and tells one of the two users the wrong thing.

## Lane cost — how many test FILES this ticket implies

**Zero.** One new block in an existing file; no child process.

## Size and priority rationale

**Size `XS` (1)** — down from `S` (2) at the re-cut. What is left is one block: two pure resolver
calls, three assertions each, one inequality between them, and one mutant already written down. No
child process, no captured output, no helper. The `S` estimate was carried by `A4`'s set comparison
and `A5`'s second mutation, both of which `ABC-066` delivered; striking `A3` removed the last reason
to touch the capture at all. **`XS` is now the honest size and the ticket is at its floor: any
further cut leaves nothing, because `A1` and `A2` are the ticket.**

**Priority `P1` — unchanged, and for a reason that survives the cut.** The whole of `A1` is still
live: the `next as string` mutant ships **863/863 green on `main` today**, and the user-visible
failure it hides is a seven-line Node stack trace standing where the one sentence telling them what
to type belongs. That is the worst failure shape in this follow-up set and it is proven, not
suspected. **Not `P0`: the delivered build is correct — the crash needs the mutant to appear.**

## Definition of Ready

Re-assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM on the shortened page,
**2026-08-17**. **Result: 10 of 10 — MET**, and it was 10 of 10 on 2026-08-15 — **which is exactly
why the DoR score is not the interesting number here.** The page scored 10/10 the day it was cut
while carrying three criteria a green tree already satisfied: the DoR asks whether criteria are *well
formed*, never whether they are *still unmet*. That second question is project process rule 1's, it
was asked at this exit, and it is what removed half the page. **Do not read 10/10 as "nothing was
wrong".**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** one crashing branch and one untested bare word — user, pain and value stated, each with the measurement behind it |
| 2 | scope and out-of-scope clear | **✅** one new block; fences include "`ABC-066`'s block is not edited", "do not export `USAGE`", "no eleventh child", "zero production lines" |
| 3 | INVEST-shaped | **✅** independent, small, testable by a mutation already performed; `ABC-063`'s overlap is named and is not an ordering |
| 4 | acceptance testable and measurable | **✅** **2** argvs named with `.ok`/`.problem`/`.offending`, the two `.problem` values **unequal**, one mutant **RED**, **1** path, **0** production lines, `spawned` **10**, skip **0** |
| 5 | dependencies known | **✅** none open; `ABC-066` and `ABC-042` named as the merged causes of the re-cut; five same-file neighbours and one subject-overlap named |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms, **0** new files, **0** new spawns, against 152.5 ms today; `NFR-002` untriggered; bar 3's scope stated so it is not re-litigated |
| 7 | test notes present | **✅** four, including "touch no child process" and how to assert `.problem` without transcribing or exporting it |
| 8 | size assigned | **✅** `XS` (1), with the reason it dropped from `S` stated |
| 9 | priority assigned | **✅** `P1`, re-argued against what is LEFT, with the reason it is not `P0` stated |
| 10 | no major unresolved blocker | **✅** none |
