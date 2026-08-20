---
id: 20260820T165500Z-qe-e2e-decision-abc050-qe-verdict-pass-five-of-five-met-with-two-named-residuals-and-one-comment-nit-b8a942c1
kind: decision
by: qe-e2e
at: 2026-08-20T16:55:00Z
verified_by: ""
confidence: high
refs:
  - ABC-050
  - plans/tickets/ABC-050-lane-runner-config-has-no-guard.md
  - plans/board.md
  - plans/traceability.md
  - biome.json
  - tsconfig.json
  - vitest.config.ts
  - src/glyph-mode.nfr.test.ts
supersedes: ""
type: decision
task: qe-ABC-050-2026-08-20
role: qe-e2e
ticket: ABC-050
created: 2026-08-20T16:55:00Z
tree: grugops/abc050-lane-runner-guard @ ca50b26, base main @ d127ae3
---

# QE verdict on `ABC-050`'s `In Review` exit: **PASS — 5 of 5 criteria MET**, on my own measurements, with two named residuals and one comment nit. Merge is the Orchestrator's.

Recorded under `AGENTS.md` § "QE validation authority" (owner's, 2026-08-17, standing). **This is a
QE verdict. It is NOT UAT, it is not acceptance, and it carries no human signature.**

## Tally

| criterion | verdict | the measurement that decided it (mine, not relayed) |
|---|---|---|
| **`A1`** both static tools read the file, as a DELTA | **MET** | lint files **72 -> 73**, exactly one higher, both sides run by me. Tip `npx biome check vitest.config.ts` -> **exit 0**, `Checked 1 file`, **zero** `provided but ignored` lines. Base -> exit 1 with the ignored line, in an out-of-tree `git archive` copy. |
| **`A2`** the guard CATCHES, by wrong build | **MET** | `poool:` for `pool:` — suite **fully green 1207/1207**, `lint` **0 (missed)**, `typecheck` **2**, `build` **2**, both naming `vitest.config.ts`; both **0** after revert. **Caught by `npm run typecheck` / `npm run build`. NOT by `npm run lint`.** |
| **`A3`** four gates survive, both sides | **MET** | lint/typecheck/build/test all **exit 0** on both. **40 files / 1207 tests / 0 skips identical** on both; `test-skip-integrity` `No findings.` exit 0 on both. No rule narrowed, no ignore comment, `linter` and `compilerOptions` blocks byte-identical. |
| **`A4`** the false sentence is gone | **MET** | `/usr/bin/grep -n 'share a worker' vitest.config.ts` -> **exit 1, zero hits**, run unpiped by me. Replacement states the measured mechanism; I re-measured its second clause (below). |
| **`A5`** a leak goes RED, armed control | **MET** | **My own probe, watched red twice**: 2 failures in `src/glyph-mode.nfr.test.ts` on the `isTTY` line, 2 more on the mode line when armed independently. Absolute, not a load-time baseline. Delivered config green 1207/1207. Probe **not committed**. |

## The four things I was asked to adjudicate rather than summarise

**1. `A5` is genuinely armed and genuinely absolute.** Watched red by me, not read off a transcript.
The assertion is absolute because `beginGlyphModeSession` reads the ambient signals **at call
time** and both expectations are fixed literals — and, decisively, because my probe polluted the
worker **before** the guard's file loaded and the guard still went red, which a load-time baseline
could not do. Detail and the run output are in the `claim` note in this folder, including **an
ordering trap the delivery notes do not carry**: vitest's sequencer prefers **cached durations**
over file size, so a padded probe can silently run SECOND and the armed run comes back green for a
reason unrelated to the guard. It happened to me on the first attempt. **`--no-cache`, and read the
file order off the run output.**

**2. The assertion's placement inside `runEverySelectionPath()` does NOT weaken it. Verdict: the
engineer's resolution was right, and I would not move it.**
- It **runs**: the helper is called unconditionally at the top of both `it()` bodies (`:125`,
  `:135`), on every path, with no branch, no `skip`, no `try`, no condition that can bypass it. It
  therefore executes **twice** per run, not once.
- It **fails on a real leak**: proven, twice, in my armed runs — both failures surfaced through the
  helper (`runEverySelectionPath src/glyph-mode.nfr.test.ts:115`) and turned both `it()` blocks red.
- It **cannot be masked**: the two leak assertions sit **before** the `toHaveBeenCalledTimes(0)`
  assertions in execution order, so a leak fails the test outright rather than being swallowed by a
  later expectation.
- The collision it resolves is real: a new `it()` satisfies `A5` and breaks `A3`'s "test total
  identical" by one. Flagging it rather than absorbing it was the right call.
- **The one cost, stated so it is on the record:** a leak now reports as a failure of *`NFR-007`
  zero-I/O*, whose `it()` names have nothing to do with leaks. The failure message
  (`ambient process.stdout.isTTY` / `ambient glyph mode`) and the doc comment name the real subject,
  so a reader is not lost — but the diagnosis costs one hop of reading. That is a **cosmetic
  trade-off the criteria forced**, not a defect, and it is cheaper than falsifying `A3`.

**3. `A2`'s limit is REAL and is a NAMED RESIDUAL, not a failure.** `A2` asks for one wrong build
that is caught; it got one, and the engineer named the limit instead of letting green imply more.
My type-valid probes: `isolate: false` is caught by **`npm test`** (9 failures — better than the
engineer claimed), but a type-valid `exclude` glob is invisible: one added entry **deletes
`ABC-050`'s own guard from the lane** with all four gates at exit 0, and a one-character typo in an
existing glob passes everything with the counts unchanged. Full table in the `observation` note.
**Residual, for a future ticket, not for this one** — closing it needs a lane-inventory assertion,
which `ABC-050`'s own `## Out of scope` fences off.

**4. `A4` is met on both clauses, with one comment nit.** `grep` exits **1**, zero hits, run
unpiped. The replacement's mechanism clause I re-measured myself rather than accepting: the same
armed probe, run under the **delivered** config (`isolate: true`) with a single thread and the probe
ordered first, is **GREEN, exit 0, 4 passed** — so a two-FILE arrangement really cannot reproduce
the red, exactly as the new sentence says. **Nit:** the sentence's "no arrangement of two FILES
reproduces the red" is true only under `isolate: true`, and it sits inside the block headed *"READ
THIS BEFORE YOU TURN ISOLATION OFF"* — whose reader is by definition about to turn it off, where
two files DO reproduce it (that is `A5`'s own armed control). **Recommend, non-blocking:** qualify
it with *"under the delivered `isolate: true`"*. Not a criterion failure and not worth another
engineering hop on its own.

## Decoys planted and reverted — none of them ever entered the repository

Five in total: four wrong builds of `vitest.config.ts` (`poool:`, `isolate: false`, an extra
`exclude` glob, a typo'd `exclude` glob) and one armed probe test file, plus one stripped copy of
`src/glyph-mode.nfr.test.ts`. **All were planted in `git archive` copies of `d127ae3` / `ca50b26`
under the agent scratchpad, never in the working tree.** Each config probe was reverted and
`diff`-compared byte-for-byte against the saved original; the probe file was deleted.

**`git status --porcelain` in the repo is byte-identical to what it was when I started:** the
Orchestrator's modified `plans/tickets/ABC-050-...md` front matter, the Orchestrator's untracked
correction note, and the untracked `.grugops/context/qe-ABC-043-review-exit-2026-08-20/` folder
belonging to the concurrent hop. **Zero residue of mine.** `HEAD` is still `ca50b26` on
`grugops/abc050-lane-runner-guard`; no `checkout`, `switch`, `stash` or `reset` was run.

## What I did NOT do, deliberately

- **`plans/board.md` NOT edited.** The Orchestrator holds the board pen while a second hop is live
  and said so. The `In Review` exit is mine to **decide**; the row is his to **move**.
- **NOT merged, NOT deployed.** Merge is the Orchestrator's after this verdict.
- **No fix authored.** I measured and recommended; I did not repair and then judge my own repair.
  That conflict is `ABC-113`'s subject.
- **`plans/traceability.md` NOT appended.** My role normally records the QE row there, and it is
  **OWED**. I held off because a second QE hop is writing in this same worktree right now and a
  blind append to a shared file is how two hops clobber each other. **Sequence it, or tell me to
  write it and I will.**
- **`.grugops/test-skips.md` READ and RUN AGAINST, never written.**
- **No `finding` authored and no `§14-gate` stamp claimed** — `context.human_admission` is `off`.
  These notes are hand-authored `observation` / `claim` / `decision`.
