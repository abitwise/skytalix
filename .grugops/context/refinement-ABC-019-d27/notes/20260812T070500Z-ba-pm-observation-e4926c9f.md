---
id: 20260812T070500Z-ba-pm-observation-e4926c9f
kind: observation
by: ba-pm
at: 2026-08-12T07:05:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-016
  - ABC-017
  - ADR-0009
  - src/turn-loop.ts
  - src/frame.ts
  - src/status-panel.ts
supersedes:
---

# Everything this hop asserted, measured — including the number that made me throw away my first measurement

> **Hand-authored**; `scripts/context-io.ts` absent, `mcp__grugops__propose_note` unavailable. **No
> `finding`.** Every figure below was RUN against merged `src/` on an out-of-tree copy in the session
> scratchpad. `git status --porcelain src/` = **0 lines** in this worktree, before and after. Machine:
> **darwin/arm64, Node via the repo's own `node_modules`** — `UNKNOWN - verify` elsewhere.

## The instrument error I caught, recorded because it is the same shape this task tree keeps finding

My first probe directory **already existed from an earlier session** and held stale files
(`frame.ts.orig`, `frame.test.ts.orig`, no `turn-loop.ts`). `cp -R src probe/src` therefore copied
**into** it and created `probe/src/src`, so **my first geometry run measured a tree that was not this
worktree.** I found it only because a later `cp` failed on a file that should have been there.

Everything below was re-run on a fresh copy **verified byte-identical to the worktree** (`diff -rq`,
0 differences) before any number was used. The re-run agreed with the polluted run in every cell —
**which is exactly why it had to be re-run rather than reasoned about: agreement after the fact is
not verification, and I could not have known it would agree.**

## Baseline, verified rather than accepted from the brief

| | measured here |
|---|---|
| tests on the branch tip after the rebase | **758 passed / 758, 26 files**, skip 0 |
| lint | **0 errors, 2 pre-existing infos** |
| typecheck | **0** |
| `main` is an ancestor of `HEAD` | **yes** — `b82ba3a` ancestor of `c73f923`, so the rebase is real |
| why the baseline moved | **`ABC-016` merged** (`149d643`), delivering `src/status-panel.ts`. It was 723/723 at the previous hop. **Nothing this hop added a test.** |

Gates after the hop are identical to the gates before it, as a doc-only hop requires.

## Geometry — the numbers `[D50]` and `[D51]` rest on

`BOARD_ROWS` = 9 (`renderBoard` at the start position), `MESSAGE_ROWS` = 2, `PROMPT_ROWS` = 1, all
read off the modules rather than assumed.

| panel shape | assembled `H` | `beginFrameSession` at 24 rows |
|---|---|---|
| stub `A` 2/5 (`A18`) | **19** | in-place |
| stub `B` 4/9 (`A18`) | **25** | **append** |
| **real 3/8** (`ABC-016` merged + `ABC-017`'s stated 8) | **23** | **in-place** |
| real 3/10 | 25 | append |

**The consequence is the whole of `[D51]`(2): the real pair is 23, so a suite running ONLY real panels
never exercises the append branch.** `A18` shape `B` is the only run in the tree that does.

**And the fourth argument still carries no rows:** a real 3/8 frame is **23 rows with 0 message items
and 23 with 4** — consistent with `[D28]`'s measurement, re-checked here rather than inherited.

## The import edge — the measurement that dates `[D50]`

Appended to an out-of-tree copy of `src/turn-loop.ts`, then `npx tsc --noEmit`:

| imported | result |
|---|---|
| `STATUS_ROWS` **and** `HISTORY_ROWS` | **`TS2307` × 1**, exit **2** — only `./history-pane.ts` is missing |
| `STATUS_ROWS` **alone** | **no error, exit 0** |

**The ticket says `TS2307` × 2, exit 2, and calls that self-enforcing.** It was, when both panels were
unbuilt. It is half gone now and **fully gone once `ABC-017` merges — which is before this ticket
merges.**

**What kills the IMPORTED form instead, measured:** `frameHeight({board 9, status 3, history 8})` =
**23**, while `A18`'s shapes give first frames of **19** and **25**. So a loop importing the real
constants fails **`A19`(b)** under **both** stub shapes. **Under a real-panel run it would pass** —
23 == 23 — which is the second, independent reason the stub runs must survive the swap.

## Source citations checked at source, not transcribed

| claim | verified |
|---|---|
| `RenderSeam` is 4 args returning `readonly string[]` | `src/turn-loop.ts:97-102` — and exercised through the type system in the probe, not read by eye |
| `frameHeight` takes **exactly three** lengths | `src/frame.ts:84-88`, `{board, status, history}` — **it gained no argument**, so `[D27]`'s *"the three lengths"* survives |
| `STATUS_ROWS = 3` | `src/status-panel.ts:71`, present on `main` |
| history pane module | **absent** from merged `src/`; `HISTORY_ROWS = 8` is the board's figure, **`UNKNOWN - verify`** — I did not open `ABC-017` |
| `statusStub`/`historyStub` at `:55-78` | **exact** in merged `src/frame.test.ts` |
| *"THE TWO UNBUILT PANELS ENTER AS FIXED-HEIGHT STUBS"* | `src/frame.test.ts:11` — the ticket's quote is faithful |
| the false sentence on `main` | `plans/tickets/ABC-019-turn-loop-skeleton.md:242`, **exact** |
| `ADR-0009`'s correction | blocks at `:416-438` (9b) and `:383-393` ((vii)); **+39/−0 additions only** by `git show --numstat` at `ee84aa1`. The `[D27]` attribution is kept split at `:432-438` |

## One thing I did NOT measure and am not claiming

**I did not re-run `A18`/`A19`/`A20` against the real status panel.** That is the cl. 9f re-gate and
it is the Orchestrator's and QE's, not a refinement hop's. Everything above is arithmetic and type
checks over merged modules; **no criterion was evaluated against a real-panel wiring at this hop, and
none is reported as if it had been.**
