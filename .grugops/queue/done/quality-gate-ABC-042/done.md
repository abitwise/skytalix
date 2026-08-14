---
task: quality-gate-ABC-042
by: qe-e2e
at: 2026-08-15T11:40:00Z
state: complete
---

Work COMPLETE. This claim is finished, not stale — read it that way if the
`queue.stale_ttl_minutes` (30) window has passed.

**VERDICT: `BLOCKED_NEEDS_FIX` — on two instruments, not on a gate and not on a criterion.**
Every gate is green and all twelve criteria are MET; I confirmed most of them independently rather
than watching the engineer's assertions go green. The block is that two rows do not hold the criteria
they are named against, each shown by a mutant that ships the whole suite green:

- **`A6`(i)** — `--colour`'s near misses are asserted in the ONE-token form, where they reject for
  the wrong reason. `token.startsWith(COLOUR)` and `token.toLowerCase() === COLOUR` both ship
  **856/856 green** and make `node src/cli.ts --colourx black` / `--COLOUR black` print a **23-row
  board and exit 0**. The criterion already says "in its **legal argv position**", which for
  `--colour` is two tokens. `A6` is the criterion whose repair discharged the ASVS **V2.2.1 [L1]**
  BLOCK, and the ticket's DoR item 4 claims on the page that such a build is *"RED deterministically"*.
- **`A9`(2)** — a second, unvalidated argv read spelled `process["argv"]`, branched on after the
  resolver returned, ships green against the `/process\.argv/` count. That is the input path ASVS
  **V2.2.2 [L1]** forbids; same shape as `X8` in the `ABC-041` re-gate.

**The unblock is three existing rows in `src/cli.test.ts`, already written and verified** on
`grugops/quality-gate-ABC-042`: zero production bytes, **29 → 29 tests**, zero new spawns, lane cost
inside the noise (`−20 / 0 / +50 ms`). Green on the delivered build, and it kills all four survivors.
The full gate was re-run on that armed state: lint PASS, typecheck PASS, build PASS, **856/856 on
30**, skip **0**, test-integrity `No findings.` exit **0**.

**20 mutants: 14 killed, 5 survived, 1 hung.** The criterion's own named case is fine — `--debug`
enumerated (`M1`) and `--debug` as a bare literal (`M2`) both RED deterministically. The holes are
adjacent to it. `M18` proves the diagnosis rather than asserting it: the same weakening on `--ascii`,
whose legal argv position genuinely is one token, **is** caught.

**`A12` re-verified, not inherited:** `git diff --name-only e140355~1 e140355` is exactly the six
paths, and all **18** merged production modules are byte-identical by **git blob SHA** between
`main@8dbc3db` and `e140355` — 18/18. The licence edit is one array element plus a citation pasted
verbatim from Architect/Design; `toEqual` intact, `FRAME_PRODUCERS` and the regex untouched. The
guard is non-vacuous, proved by mutant (`M16`).

**`PERFT_DEEP`: RULED IN SCOPE, RUN, GREEN.** `src/cli.ts` **does** reach `moves`/`legal`/`apply`/
`position` at runtime (`cli.ts -> render-seam.ts -> status-panel.ts -> san.ts -> …`, and via
`history.ts`); `src/cli-options.ts` reaches **none** of them — both its imports are `import type` and
its runtime closure is empty. So I ran it: **32/32, all eight deep counts exact, 36.2 s.** It was
confirmation, not discovery — those four modules are byte-identical, so the counts could not have moved.

**`N8-LANE` measured independently, WITH the identity null control the engineer flagged as missing:**
**1250 ms CPU net** (gross 1390, per-file floor **measured** at 140) against the **650 ms** bar =
**1.92x, BREACHED**; sign 7/7; treatment **12.6x** the null's ±110 ms. Ten milliseconds from the
engineer's figure on a separately built harness. **`NFR-008`'s 13 s total holds at 10.94 s.**
**I did not rule on `G1`** — that is Security/NFR's on this ticket — and **no target, bar or level was
moved in `plans/nfr-catalog.md` or `ADR-0008`; neither file was opened for writing.**

Ten gaps recorded with severity and owner (`Q1`…`Q10`), including three the subtask asked me to look
for and that I could not repair here: the merged licence guard's comparator can be weakened to a
subset with nothing asserting it (`Q3`, Architect/Design — `A12` forbids fixing it under this
ticket); `A6`(ii)'s "250 asserted first" is a tautology under rejection sampling and an over-dropping
filter **hangs** rather than reds (`Q4`, BA/PM); and bar 1b's regexes still count occurrences rather
than call sites, giving a **false RED** on the correct build (`Q5`, BA/PM — live now, the concurrent
Security/NFR hop reads that bar first).

Eight notes under `.grugops/context/quality-gate-ABC-042/notes/`, committed on
`grugops/quality-gate-ABC-042`. **No `finding`, no invented `§14-gate` stamp** — none is emittable on
this install.

**The `pending -> done` queue move is OWED TO THE ORCHESTRATOR**, the same way the
`quality-gate-ABC-041-regate` hop recorded and which I re-verified:
`.grugops/queue/pending/quality-gate-ABC-042.md` is tracked on `main`, and `main` (`8dbc3db`) is
**not** an ancestor of this branch's base (`8b07d9f`), so the file is not in this branch's tree and
cannot be `git mv`d here. This `claim.md` / `done.md` pair is written into the MAIN repo's working
tree and left **untracked**.

**`ABC-042` was NOT moved on the board — it stays `In Review`.** `plans/board.md`,
`plans/traceability.md`, the ticket page and `.grugops/test-skips.md` were not written.
`src/cli.ts`, `src/cli-options.ts` and `src/history-pane.nfr.test.ts` are byte-identical to
`8b07d9f`; every mutation was reverted and the tree verified clean. Mutation ran in a worktree, never
in the shared checkout. `node_modules` symlink removed. `main` never checked out, nothing pushed,
nothing merged, nothing deployed.
