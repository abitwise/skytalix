---
id: 20260821T021000Z-qe-e2e-claim-the-re-thrown-branch-is-guarded-by-nothing-and-a-one-token-mutant-proves-it-8c04b19d
kind: claim
by: qe-e2e
at: 2026-08-21T02:10:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-115
  - ADR-0016
  - G-QE115-1
supersedes:
---

# DEFECT `G-QE115-1` — THE RE-THROWN BRANCH IS ASSERTED BY INSPECTION ONLY, AND A ONE-TOKEN MUTANT SURVIVES THE WHOLE LANE

`confidence: UNKNOWN - verify` because no `finding` is admissible on this install
(`context.human_admission` is `off`); the measurements below are reproducible commands, not a
stamped verdict. Nothing was fixed — reported only, per the subtask's fence.

## The claim in one line

`src/cli.ts`'s delivered comment states, in the imperative, *"Every other code is RE-THROWN: an
unmeasured stdout failure (`ENOSPC`, `EIO`) behaves exactly as it does today rather than being
absorbed by a listener installed for something else."* **Delete the `code !== "EPIPE"` test and the
delivered tree stays completely green** — 60/60 in `src/cli.test.ts`, and all four mandatory gates
pass. The sentence, and `ADR-0016` clause 3 behind it, are guarded by nothing.

## The mutant

```ts
sink.on("error", () => {
  process.stdin.destroy();
});
```

`npx vitest run src/cli.test.ts` → **exit 0, 60 passed**. `A1`, `A2`, `A3`, `A4` and `A9` are all
scoped to the `EPIPE`-shaped path, and `A4`'s two children (`inputSeamThrows`, `badColour`) fail
through `InputSeam` and the argument parser, neither of which is a **stdout** error. No row on this
ticket, and no row anywhere in `src/`, drives a non-`EPIPE` error into `process.stdout`.

## It is not a distinction without a difference — the two builds are observably different

A real non-`EPIPE` stdout error is producible without a full disk: hand the child a **read-only fd
as its stdout**, and the first write fails `EBADF`. The probe (my own, run outside the suite):

```js
const fd = fs.openSync("/dev/null", "r");           // opened READ-ONLY, passed as the child's stdout
spawnSync(process.execPath, [ENTRY, "--ascii"], { stdio: ["ignore", fd, "pipe"], timeout: 8000 });
```

| build | status | stderr |
|---|---|---|
| **delivered** | **1** | **1542 bytes** — a raw stack whose first frame is `src/cli.ts:159`, the delivered `throw error` itself |
| mutant above | **0** | **0 bytes** |

So the delivered behaviour on a genuine write failure is *loud and non-zero* and the mutant's is
*silent success*, and the delivered suite cannot tell them apart.

## Two consequences, kept separate

1. **A coverage hole, and that is the defect.** A 13-line production diff whose central design
   clause — the `EPIPE`/not-`EPIPE` discrimination — is asserted nowhere. The next hop to touch this
   arm gets no signal at all from the suite.
2. **A residual on the exit-code contract, NOT a criterion failure and NOT a re-opening of the
   ruling.** On the `EBADF` path the delivered build exits **1**, which is `USAGE_EXIT_CODE` — the
   same collision `ABC-115` was cut for, on a stdout error code the ticket deliberately scoped out
   (`## Out of scope`, and `ADR-0016` clause 3 chooses "exactly as today" for it on purpose). I am
   **not** asking for the ruling to be re-opened and I am **not** proposing a wider arm: the ticket
   named that trade and priced it. I am recording that the collision still exists off the `EPIPE`
   path, measured, so a later cut is made from a measurement rather than from a hunch.

## What would close it (the engineer's to write, not mine)

One child of the shape above — a read-only fd as stdout — asserted to exit non-zero with a
non-empty stderr. It costs one `CHILDREN` entry and moves the `N8-SPAWN` pin from 23 to 24, which
is a ceiling raise and therefore **BA/PM's word, not the engineer's and not mine**.
