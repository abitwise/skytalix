---
id: 20260815T113000Z-qe-e2e-decision-perft-deep-ruled-and-the-terminal-result-9d0e6b51
kind: decision
by: qe-e2e
at: 2026-08-15T11:30:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - PERFT_DEEP
  - src/perft.test.ts
  - src/cli.ts
  - src/cli-options.ts
supersedes: 
---

# `PERFT_DEEP`: ruled IN SCOPE by reachability, RUN, and GREEN — and the terminal result

## `PERFT_DEEP` — the ruling, both halves stated as the subtask requires

**The question:** can either delivered production module reach `moves` / `legal` / `apply` /
`position`? I answered it by computing the import closure of both new modules from source, splitting
**runtime (value) imports** from **`import type`** edges, because a type-only edge is erased and
reaches nothing at runtime.

**`src/cli.ts` — YES, it reaches all four, at runtime.** Its runtime closure is **16 modules**, and
the four are in it by two independent paths:

```
cli.ts -> render-seam.ts -> status-panel.ts -> san.ts -> legal.ts -> apply.ts
cli.ts -> render-seam.ts -> status-panel.ts -> san.ts -> moves.ts
cli.ts -> render-seam.ts -> status-panel.ts -> san.ts -> position.ts
cli.ts -> history.ts     (newGame / gameStatusOf)  -> the same engine modules
```

**`src/cli-options.ts` — NO.** Both of its imports are `import type` (`GlyphFlags`, `Orientation`),
so its **runtime closure is empty**. It reaches `position.ts` only through a type-only edge
(`cli-options.ts -> render.ts -> position.ts`), which is erased at runtime and cannot execute a
single move-generation line.

**So the ruling: `PERFT_DEEP` is IN SCOPE for this diff, and I ran it rather than arguing it away.**

```
PERFT_DEEP=1 npx vitest run src/perft.test.ts
  32/32 passed, 36.2 s
  startpos perft(5) = 4865609   kiwipete perft(4) = 4085603
  position-3 perft(5) = 674624  position-3 perft(6) = 11030083
  position-4 perft(4) = 422333  position-4 perft(5) = 15833292
  position-5 perft(4) = 2103487 position-6 perft(4) = 3894594
```

All eight deep counts exact. **GREEN.**

**And the honest qualification, said rather than left implied:** this run was confirmation, not
discovery, and it could not have been anything else. Reachability is not modification — I verified by
**git blob SHA** that all 18 merged production modules, `moves.ts` / `legal.ts` / `apply.ts` /
`position.ts` among them, are byte-identical between `main@8dbc3db` and `e140355`. Unchanged code
cannot produce changed node counts. I ran it because "reaches" was the question I was asked and
running it costs 36 s once, not because I expected a difference.

**Recommendation for the diff shape, not a rule I am imposing:** for a future diff that adds modules
which *reach* the engine but changes **zero bytes** in `moves`/`legal`/`apply`/`position`, the blob
comparison is the cheaper and strictly stronger check, and `PERFT_DEEP` may be recorded as
not-indicated with that comparison as the evidence. Where any of the four **does** change, the
byte check fails and the deep suite is mandatory. Owner of any standing rule: Architect/Design — I am
recording a recommendation, not adopting one.

## The terminal result

> ## `BLOCKED_NEEDS_FIX`
>
> **Not on a failing gate and not on a failing criterion — both are green, and I confirmed most of
> them independently.** On two instruments that do not hold the criteria they are named against, each
> demonstrated by a mutant that ships the whole suite green while breaking the thing the criterion
> exists to prevent.

**The two blocking items:**

1. **`A6`(i) — `--colour`'s membership is unguarded.** `token.startsWith(COLOUR)` and
   `token.toLowerCase() === COLOUR` both ship **856/856 green** and make
   `node src/cli.ts --colourx black` and `--COLOUR black` print a **23-row board and exit 0**. `A6`
   is the criterion whose repair discharged the ASVS **V2.2.1 [L1]** BLOCK, and the ticket's DoR item
   4 asserts on the page that such a build is *"RED **deterministically**"*. For `--colour` it is
   not. Cause: the near-miss row tests `--colour`'s misses in the **one-token** form, where they
   reject for the wrong reason, instead of in `--colour`'s **legal argv position**, which the
   criterion already specifies and which is two tokens.
2. **`A9`(2) — the exclusive-validator property is defeatable.** A second, unvalidated argv read
   spelled `process["argv"]`, branched on after the resolver returned, ships green against
   `expect(entry.match(/process\.argv/g)).toHaveLength(1)`. That is precisely the input path ASVS
   **V2.2.2 [L1]** forbids, and the same defect shape as `X8` in the `ABC-041` re-gate.

**Why this is a block and not a gap-with-an-owner.** `quality.gate_enforcement` is **blocking**; this
ticket's entire recorded history is instruments that looked green and were not (the original ASVS
HIGH shipped green at P ≈ 1.4e-9 against every criterion on the page); the `Ready for Dev` exit
already caught this exact class once as `RF-7` and repaired the *criterion*; and what is delivered
now is that repaired criterion with the same hole one layer down, in its *implementation*. Merging as
it stands puts a false claim on the ticket page and hands the next hop a resolver whose allowlist a
one-word edit disarms silently.

**Why the unblock is cheap, and I did the work rather than only naming it.** The fix is **three
existing rows in `src/cli.test.ts`** — zero production bytes, zero new tests (still 29), zero new
spawns, and **no measurable lane cost** (`−20 / 0 / +50 ms`, inside a ~110 ms noise floor). It is
written and verified on `grugops/quality-gate-ABC-042`: **green on the delivered build**, and it
**kills all four survivors** (`M7`, `M19`, `M11`, `M14`). I have already run the **full gate on
exactly that armed state**: lint PASS, typecheck PASS, build PASS, **856/856 on 30 files**, skip
**0**, test-integrity `No findings.` exit **0**. Adopting it discharges both blocking items; I would
still re-run the gate on whatever tip results, because a gate on a tip nobody produced is not a gate.

## The reading I did not take, stated so it can be overruled on its merits

**A defensible alternative is `READY_FOR_HUMAN_REVIEW`.** Workflow 05 step 5 says *"All checks pass →
`READY_FOR_HUMAN_REVIEW`"*, and **no check failed**: the mandatory four are green, test-integrity
exits 0 (not 1), there is no visual baseline, and `security.block_on` is `high` while `G1` is medium.
On that reading the instrument holes are **gaps with owners** on a green gate, and the fix rides in a
follow-up.

**I did not take it**, because the gate exists to stop a green badge that hides a hole, and here the
hole is demonstrable in one command. But the difference between the two readings is a judgment about
whether a defeatable instrument on an L1 criterion is a "check", not a difference about any fact in
this note — every mutant, command and number above holds either way. **If the Orchestrator or a human
prefers the other reading, nothing here needs re-measuring; only the label changes.**

## Not `SPLIT_REQUIRED`

Size is unchanged and the ticket landed as one coherent slice: 93 + 156 production lines, one test
file, one `package.json` line. Nothing about the delivered shape argues for splitting, and the split
line the ticket names (resolver / entry point) would separate two halves that are already correct.

## Stop conditions honoured

- **`self_fix_attempts` (2) not consumed** — nothing in the delivered build failed a gate, so there
  was nothing to self-fix. The arming is added coverage, not a repair of a red.
- **I did not rule on `G1`/`N8-LANE`** — measured only; the bar's reading is Security/NFR's.
- **No owner-ratified target moved.** `plans/nfr-catalog.md` and `ADR-0008` were not opened for
  writing.
- **No `kind: finding`, no `§14-gate` stamp** — none is emittable on this install and none was
  invented.
- **`plans/board.md`, `plans/traceability.md`, the ticket page and `.grugops/test-skips.md` were not
  written.** Not merged, not deployed, `main` never checked out.
