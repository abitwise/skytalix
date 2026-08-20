---
id: 20260820T222000Z-architect-design-observation-i-re-measured-the-epipe-path-and-prototyped-three-arms-outside-the-repo-4d1c8b7e
kind: observation
by: architect-design
at: 2026-08-20T22:20:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - ADR-0016
  - src/cli.ts
  - src/turn-loop.ts
  - src/frame.ts
  - src/line-input.ts
supersedes:
---

# WHAT I MEASURED MYSELF — the defect, and three candidate arms prototyped OUTSIDE the repo

**Not a finding.** `human_admission` is `off`, `scripts/context-io.ts` and
`mcp__grugops__propose_note` are absent on this install and no `§14-gate#<id>` verdict can be
emitted, so this is an `observation`. Nothing downstream may read it as verified.

**Everything below is a run I did at my own hand**, in a `git worktree` off
`grugops/cut-epipe-regression` @ `c9e7e11`, Node **v24.12.0**, macOS. BA/PM's cut notes are
themselves unstamped, so their numbers were treated as claims and re-derived.

**`src/` WAS NOT TOUCHED.** The prototypes are a **copy of `src/` in a scratch directory outside the
repository**; `git status` in the worktree shows no file under `src/` modified, and the design branch
carries no `src/` change. The prototype directory is throwaway and is not delivered.

## The defect, reproduced at this hop

| command (`set -o pipefail`) | exit | stderr |
|---|---|---|
| `node src/cli.ts --ascii </dev/null \| head -2` | **1** | **1282 bytes**, `node:events:486` / `throw er; // Unhandled 'error' event` / `Error: write EPIPE` + stack + absolute checkout path |
| `node src/cli.ts --nonsense` | **1** | `unrecognised argument: --nonsense` + usage |
| `node src/cli.ts --ascii </dev/null \| head -24` (control) | **0** | **0 bytes** |

The collision BA/PM describes is real and I measured both halves in one session.

**ONE DISAGREEMENT WITH THE CUT NOTE, and it is a small one that matters for `A1`:** the note and the
board record the stack as **1196 bytes**; I measured **1282**, and **1262 / 1303 in two other
harness shapes at this same hop**. The number is **path-length dependent** — the stack contains the
absolute path of the checkout, and my worktree's path is longer than the one BA/PM measured on.
**Consequence for the repair hop: `A1`'s "1196 bytes" is a BASE FOR A RED WATCH, not a constant.
Re-measure it in your own tree; never assert it.** `A1`'s substantive assertions (zero `write EPIPE`,
zero `Unhandled 'error' event`, zero `/^\s+at /`, zero occurrences of the repo path) are
path-independent and are the ones to pin.

## Three candidate arms, prototyped and measured

Each is one listener installed immediately after `const sink = process.stdout;`
(`src/cli.ts:148`), discriminating on `error.code !== "EPIPE" → throw`:

| variant | what it does on EPIPE | `\| head -2`, `</dev/null` | live stdin: `{ echo e4; sleep 8; echo quit; } \| … \| head -2` |
|---|---|---|---|
| **V1** | `process.exit(0)` | exit **0**, stderr **0 bytes** | child **real 3.07 s**, exit **0**, silent |
| **V2** | `process.stdin.destroy()` | exit **0**, stderr **0 bytes** | child **real 3.08 s**, exit **0**, silent |
| **V3** | nothing (bare swallow) | exit **0**, stderr **0 bytes** | child **real 8.02 s**, exit 0 — **the session ran on into a dead pipe** |
| BASE | (no arm) | exit **1**, 1282 bytes | child **real 3.08 s**, exit **1**, 1303 bytes with the stack |

The live-stdin column is the one that separates them, and it required timing **the child**, not the
pipeline: the pipeline's own left-hand side sleeps 8 s, so a naive `time` on the whole pipeline reads
8 s for all four and hides the difference. That mis-measurement was made first and is recorded here
so the repair hop does not repeat it.

**Also measured on V1 and V2, all exit `0` with empty stderr:** the 23-line close (`head -23`), the
default glyph mode (`node src/cli.ts | head -2`), a session that plays a move
(`printf 'e4\nquit\n' | … | head -2`), `--colour black --ascii | head -2`, and the 24-line control.
**`A4`'s refused-command-line half re-run against V1: exit `1` with the usage line, unchanged.**

## What I did NOT measure, stated so nobody reads a gap as a pass

- **`A4`'s throwing-`InputSeam` half.** It needs `ABC-043`'s `registerHooks` rig; I ran the CLI, not
  the test file. `UNKNOWN - verify` at this hop — the repair hop owns it.
- **`npm run lint` / `npm run typecheck` on any candidate line.** The prototypes ran under Node's
  type stripping, which proves they parse, not that Biome and `tsc` are happy with
  `NodeJS.ErrnoException`. `UNKNOWN - verify`.
- **A TTY stdin.** Every run above used pipes. `src/line-input.ts` sets no raw mode, so I expect no
  terminal state to restore under V2's `stdin.destroy()`, but **I did not measure it** and the
  interactive `| less` + `q` case is the real-world Given.
- **A non-`EPIPE` stdout error.** No shape was constructed; the re-throw arm in `ADR-0016` clause 4 is
  reasoned, not measured.
