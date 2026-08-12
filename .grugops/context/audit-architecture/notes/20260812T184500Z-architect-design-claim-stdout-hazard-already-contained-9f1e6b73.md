---
id: 20260812T184500Z-architect-design-claim-stdout-hazard-already-contained-9f1e6b73
kind: claim
by: architect-design
at: 2026-08-12T18:45:00Z
verified_by:
confidence: high
refs:
  - arch-audit-2026-08-12
  - ABC-029
  - ADR-0011
  - EPIC-006
  - src/history-pane.nfr.test.ts
supersedes:
---

# CORRECTION to my own brief: the "is not valid JSON" stdout hazard is ALREADY CONTAINED and does not reproduce

> **Hand-authored, not a `finding`.** The brief invited *"Check me"* on its baseline. This is the one
> baseline item that did not survive checking.

## What the brief said

> *"a production root that prints at import becomes the sole red in the suite (`is not valid JSON`),
> **reproducible today** by adding `perft-bench.ts` as a root."*

**That is true of the tree BEFORE `ABC-029`, and false of the tree today.** `ABC-029`'s `A2` moved
the probe's report channel to **file descriptor 3** and discards the child's stdout
(`stdio: ["ignore", "ignore", "pipe", "pipe"]`, `history-pane.nfr.test.ts:589`). The guard's own
comment says so and names the trigger as dated rather than hypothetical.

## Measured, out of tree, three ways

The probe child was reconstructed verbatim from `src/history-pane.nfr.test.ts:566-590` and run
against the repo's own `src/` by file URL. **Nothing in any worktree was written.**

| build | channel | result |
|---|---|---|
| delivered probe, 5 declared frame producers | fd 3 | **JSON OK**, closure = **11 modules**, `history.ts` absent, **66 ms** |
| **+ `perft-bench.ts` added as a root** | fd 3 | **JSON OK**, closure 13 modules — **the hazard does NOT reproduce** |
| + `perft-bench.ts` rooted, report moved back to **fd 1** | fd 1 | **`Unexpected token 'A', "ABC-006 pe"... is not valid JSON`** |

The third row reproduces the recorded symptom **exactly**, which is what confirms the first two are
measuring the right thing rather than passing by being blind. **The containment is real and it is the
fd-3 split that does the work.**

## The residual is COST, not corruption — and it is the part still worth knowing

Rooting `perft-bench.ts` took **2,051 ms against the delivered probe's 66 ms — a 31x increase**,
because it runs a full benchmark on import. **That is ~2 s of CPU against a 13 s budget with roughly
4.4 s of headroom, i.e. a single rooting decision would spend nearly half the remaining floor
account.** So the reason not to root an entry point is now **budget**, not channel corruption — a
different argument that lands on `ADR-0008` rather than on `ADR-0011`.

`ADR-0011` clause 4 independently makes it moot: an entry point exports nothing, so nothing can
import a binding from it, so **it can never be on the frame path and never a probe root**. The
mechanism and the declaration agree.

## What this means for `EPIC-006`, stated plainly

**The stdout question for the CLI entry point is already answered and needs no new decision.** Three
independent things already hold:

1. **The probe cannot be corrupted by a printing module** — fd 3, stdout discarded (`ABC-029` `A2`).
2. **An entry point is classified mechanically** and is excluded from the frame path by construction
   (`ADR-0011` clause 4).
3. **No production module owns stdout today.** `turn-loop.ts` takes a `FrameSink` as an injected
   option and never reaches for `process.stdout`; `frame.ts` states *"this module never reaches for
   it"*; `render.ts`, `status-panel.ts` and `history-pane.ts` return rows and write nothing.
   **`glyph-mode.ts` is the only module that reads ambient terminal signals** (`isTTY`, `env`), and
   it reads them **once**, inside `beginGlyphModeSession`, not at module scope.

**So stdout is already owned by injection, and `EPIC-006`'s entry point is the ONE place allowed to
supply the real `process.stdout`.** The rule that must survive decomposition is one sentence, and it
is a restatement of what merged code already does rather than a new constraint:

> **The entry point is the only module that may name `process.stdout`, and it may only pass it as
> the injected `FrameSink`. It exports nothing, prints only via the writer `beginFrameSession`
> returns, and no module below it acquires an I/O handle.**

**This does not need an ADR.** It is `ADR-0011` clause 4 plus `ADR-0009` clause 9b plus the existing
`FrameSink` seam, all already accepted. Writing it a fourth time would be ceremony.

## One thing that DOES need checking at `EPIC-006`, and it is already owned

`ADR-0011` clause 1's amendment names the trigger: **the first `.ts` under a subdirectory of `src/`
— "which `EPIC-006`'s entry point may well be, so the trigger is checked THERE."** The guard's
enumeration is non-recursive **and** its specifier is depth-fixed (`"./history.ts"`; `"../history.ts"`
matches neither the delivered nor the widened expression), so **an entry point placed at
`src/cli/main.ts` would silently leave the licence guard's reach.** Owner is already Architect/Design.
**If the entry point lands flat in `src/`, the trigger does not fire at all** — which is the cheapest
answer and is my recommendation.
