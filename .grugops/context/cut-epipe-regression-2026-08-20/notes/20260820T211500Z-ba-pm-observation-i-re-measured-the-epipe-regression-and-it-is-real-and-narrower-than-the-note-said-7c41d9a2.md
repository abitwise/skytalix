---
id: 20260820T211500Z-ba-pm-observation-i-re-measured-the-epipe-regression-and-it-is-real-and-narrower-than-the-note-said-7c41d9a2
kind: observation
by: ba-pm
at: 2026-08-20T21:15:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - ABC-043
  - ABC-042
  - src/cli.ts
  - src/turn-loop.ts
  - src/frame.ts
  - AGENTS.md
supersedes:
---

# THE REGRESSION IS REAL — re-measured, not cited — and the trigger is NARROWER than the QE note says

**Not a finding.** `human_admission` is `off` on this install, `scripts/context-io.ts` is absent and no
`§14-gate#<id>` verdict can be emitted, so this is an `observation` and nothing downstream may read it as
verified. Everything below is a run I did, at my own hand, on `main` @ `414ef75`, Node **v24.12.0**,
macOS. **The QE/E2E note at `qe-ABC-043-review-exit-2026-08-20` is itself an unstamped `observation`; I
treated its numbers as claims and re-derived every one of them.**

## The reproduction (delivered `main`, this hop)

```
node src/cli.ts --ascii </dev/null | head -2      →  child exit 1
```

- stderr: **1196 bytes**, containing `node:events:486`, `throw er; // Unhandled 'error' event`,
  `Error: write EPIPE`, stack frames naming `src/turn-loop.ts:313` and `src/cli.ts:156`, **and the
  absolute filesystem path of the checkout**.
- `grep -c 'internal error' stderr` → **0**. No result screen.
- **Exit `1`**, and `1` is `USAGE_EXIT_CODE` (`src/cli.ts:90`).
- **The collision is not theoretical and I measured both halves in the same session:**
  `node src/cli.ts --nonsense` → exit **1** with `unrecognised argument: --nonsense` + usage.
  So a refused command line and a crashed pipe are indistinguishable by exit code today, which is the
  exact thing `src/cli.ts:109-115` says `70` exists to prevent.

## The bisect — RE-RUN in three throwaway worktrees, not quoted

| tree | total stdout lines | `| head -2` | stderr `write EPIPE` |
|---|---|---|---|
| `54cbb23` (`ABC-042` tip) | 23 | exit **0** | 0 |
| `46457b8` (`ABC-043` delivery) | 24 | exit **1** | 1 |
| `d127ae3` (`main` when QE measured) | 24 | exit **1** | 1 |
| `414ef75` (`main` today) | 24 | exit **1** | 1 |

The note's claim reproduces exactly. Worktrees removed afterwards; `git worktree list` re-checked.

## TWO DISAGREEMENTS WITH THE QE NOTE, both measured, both narrowing

1. **`| grep -q` is NOT a trigger here.** The note lists it beside `| head` and `| less`+`q`.
   `node src/cli.ts --ascii </dev/null | grep -q 8` → **exit 0, five runs out of five, zero `write
   EPIPE`**. The whole output is 24 lines and the session ends at end-of-input first.
   **Consequence for the ticket: a guard written on `grep -q` would be a guard that cannot go red.**
2. **The boundary is not `head -30`; it is the output itself.** Swept `head -N` at
   `N ∈ {1,2,5,10,15,20,21,22,23,24,25,28,30,40}`: **`N ≤ 23` → exit 1 with the stack; `N ≥ 24` → exit
   0, clean.** 24 is the full output. The rule is *any reader that closes before the session's last
   write*, and `ABC-115` `A3` is written against that rule with the literal boundary re-derived at the
   repair hop rather than copied.

## Two things the note does not say, measured here

- **Not format-specific:** the default glyph mode (`node src/cli.ts | head -2`) reproduces identically
  (exit 1, one `write EPIPE`).
- **Not an artefact of an empty stdin:** `printf 'e4\nquit\n' | node src/cli.ts --ascii | head -2` — a
  session that actually plays a move — also exits **1** with the stack.

## Why no criterion catches it (read, not assumed)

The `'error'` event on `process.stdout` is emitted asynchronously, outside the promise chain, so the
single `try`/`catch` in `main()` (`src/cli.ts:167-183`) cannot observe it and no `await` returns. Node
then exits with its default uncaught-exception status, **which happens to be `1`** — the collision is an
accident of Node's default, not a decision anyone took. `ABC-043` `A3`'s Given is *"an `InputSeam` that
throws"*; this build is not that Given, and `A3` passes as written.

**The five write sites reachable in a session**, all on `process.stdout`, all covered by one arm at the
entry point because the sink is acquired exactly once there (`src/cli.ts:148`): `src/frame.ts:238`,
`src/frame.ts:244`, `src/turn-loop.ts:313`, `src/cli.ts:172`, `src/line-input.ts:239`.

**I did not touch `src/`. Cutting is not fixing.**
