---
id: 20260821T003500Z-software-engineer-observation-both-watched-red-rounds-ran-and-only-one-of-them-kills-the-swallow-2b8f6a04
kind: observation
by: software-engineer
at: 2026-08-21T00:35:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - A5
  - A9
  - src/cli.test.ts
supersedes:
---

# `A5` — BOTH WATCHED-RED ROUNDS, RUN IN THE SUITE, WITH THE OUTPUT VERBATIM

The ticket's instruction is that watching only `main` is **not** watching `A9` red. Both rounds were
run here, in vitest, on `npx vitest run src/cli.test.ts`, by swapping `src/cli.ts` and leaving the
test file byte-identical.

## ROUND 1 — the delivered `main` build (`git show HEAD:src/cli.ts`)

`Tests  5 failed | 55 passed (60)`. Four of the five are `ABC-115`'s rows; the fifth is the
`ABC-042` `A9` census row, which reds because the census is a pin the fix moves.

```
 FAIL  src/cli.test.ts > ABC-115 … > A1 — the player is shown NO stack, no `write EPIPE`, no checkout path, no crash claim
AssertionError: `write EPIPE` on stderr: expected 1 to be +0 // Object.is equality

 FAIL  src/cli.test.ts > ABC-115 … > A2 — it exits 0, and independently of that it is neither a refusal nor a crash
AssertionError: a closed reader is not a failure of this product: expected 1 to be +0 // Object.is equality

 FAIL  src/cli.test.ts > ABC-115 … > A3 — the trigger is the RULE: any reader that closes before the session's last write
AssertionError: --ascii, 2 lines: node:events:486
      throw er; // Unhandled 'error' event
      ^

Error: write EPIPE
    at afterWriteDispatched (node:internal/stream_base_commons:159:15)
    …
    at runTurnLoop (file:///…/src/turn-loop.ts:313:14)

 FAIL  src/cli.test.ts > ABC-115 … > A9 — THE SESSION ENDS: stdin stays open behind the closed reader and the child still exits
AssertionError: A9: node:events:486
      throw er; // Unhandled 'error' event
      ^

Error: write EPIPE
    …

 FAIL  src/cli.test.ts > ABC-042 … > A9 — process.argv occurs EXACTLY once and only as the resolver's argument
AssertionError: expected [ 'process.argv', …(7) ] to deeply equal [ 'process.argv', …(8) ]
```

**`A9`'s red here is on its STATUS and STDERR clauses, exactly as the page warns — NOT on its ending
clause.** `main` crashes fast, so it *does* end: the child came back in 0.65 s with `NODE_EXIT=1`
and 1266 bytes of stderr, 5/5. Reporting this round as "`A9` watched red" and stopping would be the
half-watch the ticket names.

## ROUND 2 — the BARE-SWALLOW MUTANT, which is the only build the ending clause reds against

The mutant is `ADR-0016` forbidden shape 4 and nothing else — the delivered arm with the one line
`process.stdin.destroy();` removed, so it silences `EPIPE` and does nothing.

```
 FAIL  src/cli.test.ts [ src/cli.test.ts ]
Error: child /bin/sh -c D=$(mktemp -d); F="$D/fifo"; mkfifo "$F"; ( { sleep 0.6; echo zz; sleep 10; } >"$F" 2>/dev/null & ); set -o pipefail; '/usr/local/bin/node' '…/src/cli.ts' --ascii <"$F" | head -2 >/dev/null; echo "NODE_EXIT=$?"; rm -rf "$D" failed to start: Error: spawnSync /bin/sh ETIMEDOUT
      Tests  no tests
```

The child **never exits** and is killed at the 4 s bound; `childOf`'s existing `child.error` guard
throws, and because the children are built at module scope the whole file fails to load. That is a
loud, bounded red and it is the ENDING clause going red.

**THE MESSAGE WAS UNATTRIBUTABLE ON THE FIRST WATCH AND THAT WAS FIXED RATHER THAN NOTED.** It read
`child /bin/sh failed to start: …` — seven children now spawn `/bin/sh`, so it did not say which.
`childOf`'s throw now names the arguments too. A red nobody can attribute is most of the way to a
red nobody acts on.

## AND THE HALF THAT MAKES `A9` NECESSARY, RE-MEASURED HERE RATHER THAN INHERITED

Against the same bare-swallow mutant, `A1`, `A2` and **all five of `A3`'s close points on both glyph
modes** are GREEN — measured directly at the shell:

```
mode='--ascii' N=2  -> NODE_EXIT=0 stderr_bytes=0
mode='--ascii' N=23 -> NODE_EXIT=0 stderr_bytes=0
mode='--ascii' N=24 -> NODE_EXIT=0 stderr_bytes=0
mode=''       N=2  -> NODE_EXIT=0 stderr_bytes=0
mode=''       N=23 -> NODE_EXIT=0 stderr_bytes=0
mode=''       N=24 -> NODE_EXIT=0 stderr_bytes=0
```

**Eight criteria green and the game still running blind into a dead pipe.** `A9` is the whole guard.
