---
id: 20260821T050500Z-qe-e2e-observation-both-defects-i-raised-are-closed-and-i-re-verified-each-at-my-own-hand-24a73ef8
kind: observation
by: qe-e2e
at: 2026-08-21T05:05:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - G-QE115-1
  - G-QE115-2
  - A10
  - src/cli.test.ts
supersedes:
---

# BOTH DEFECTS I RAISED ARE GENUINELY CLOSED — RE-VERIFIED AT MY OWN HAND, NOT ACCEPTED FROM THE REPAIR HOP'S REPORT

Everything the repair hop reported is unstamped and none of it was taken on trust. Each closure
below was re-measured here with my own instrument, on `grugops/abc115-repair` @ `8d4980c`.

## `G-QE115-1` — CLOSED. `A10` exists AND it reds against the mutant I originally built

The test was **not** accepted because "a test exists". The reading is a mutation round in a tree
**outside the repository**, established GREEN before a token was changed — the recorded dead end
(a copy that was red before the mutant existed) was read and avoided by construction, and the
newer one (a fresh worktree with no `node_modules`, whose startup error resembles a red) was
avoided by symlinking. **Baseline in the copy: `61 passed (61)`.**

Then the one-token mutant, my own from the previous hop, applied to the delivered arm and nothing
else:

```ts
sink.on("error", () => {
  process.stdin.destroy();
});
```

```
→ a failed write was absorbed: "NODE_EXIT=0\n": expected +0 not to be +0
 Tests  1 failed | 60 passed (61)
```

**One red out of sixty-one, and it is `A10`.** The row discriminates that token and nothing else.
This is the mutant that survived the entire lane at my previous hop; it no longer does.

**The branch is genuinely reached, and I re-measured that rather than quoting it.** A standalone
probe of the same shape, delivered build:

```
$ /bin/sh -c 'node src/cli.ts --ascii 1</dev/null; echo "NODE_EXIT=$?"'
NODE_EXIT=1
stderr: 1497 bytes, first frame:
  …/src/cli.ts:159
      if ((error                         ).code !== "EPIPE") throw error;
                                                             ^
  Error: EBADF: bad file descriptor, write
```

The caret sits on the delivered `throw error` itself. The re-thrown branch is live code, not dead
code, and `A10` is not vacuous.

## `G-QE115-2` — CLOSED. I grepped for the sentence myself and no claim in force is false

`grep -rn "0\.5 s"` across `src/`, `plans/` and the ticket, and `grep -rni "CPU CLAUSE IS BREACHED"`
across `src/`:

- **`src/cli.test.ts` carries `0.5 s` in exactly three places**, and all three are correct.
  Two (lines 1711, 1718) sit inside a block whose own heading is *"THE CLAUSE THIS BLOCK USED TO
  QUOTE — `<= 0.5 s added CPU` as a LUMP — WAS RE-DERIVED"* and which states in the same paragraph
  **"THE BREACH DOES NOT EXIST"**. The third (line 2861) is `A9`'s settle constant and is unrelated
  arithmetic.
- **The sentence "THE CPU CLAUSE IS BREACHED" survives once** (line 1712) and only as a **quoted
  and retracted** phrase inside that same retraction. It is no longer asserted anywhere.
- **The clause in force is stated once and correctly** (lines 1705-1709): `<= 7` added children AND
  `<= 2.0 s` added wall AND `<= 0.30 s` added CPU (`user`+`sys`) **per added child**.
- `plans/board.md` and `plans/traceability.md` still carry the old figures in their **dated
  historical header lines**, which are append-only records of what was true on 2026-08-21 at that
  hop. That is the record, not a claim in force, and correcting it would falsify the log.

**The correction was announced rather than smoothed away**, which is the stronger close: a later
reader can see that the file once lied and what it lied about. I did not ask for that and it is
better than what I asked for.

## The third false sentence the repair hop found unprompted, checked

The file header now reads that `ABC-115`'s **seven** children each need a shell construct
`spawnSync` cannot express — **six** a real `head`, the **seventh** a per-command fd-1
redirection. Counted from source: `closedReader` is instantiated 5 times and
`heldOpenReaderClosed` once, all six carrying `head -N`; `unwritableStdout` carries no pipe and no
`head`. **The amended sentence is true as written.**
